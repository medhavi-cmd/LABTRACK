import { pool } from "../config/db.js";
import {
  buildSearchClause,
  buildFilterClause,
  combineClauses,
  buildOrderBy,
} from "../utils/listQuery.js";

/*
  demand_status is derived in SQL (rather than in JS after the fact) so that it
  can be filtered and sorted on by the database.
*/
const DEMAND_STATUS_SQL = `
  CASE
    WHEN c.available_quantity = 0 THEN 'Critical'
    WHEN c.total_quantity > 0
      AND c.available_quantity::numeric / c.total_quantity::numeric < 0.2 THEN 'High'
    WHEN c.total_quantity > 0
      AND c.available_quantity::numeric / c.total_quantity::numeric < 0.5 THEN 'Medium'
    ELSE 'Low'
  END
`;

const DEMAND_SORTS = {
  componentId: "c.component_id",
  componentName: "c.component_name",
  category: "c.category",
  totalStock: "c.total_quantity",
  availableStock: "c.available_quantity",
  totalRequested: "COALESCE(rc.total_requested, 0)",
  demandStatus: DEMAND_STATUS_SQL,
};

export const getComponentDemand = async ({
  search,
  demandStatus,
  sortField,
  sortDir,
} = {}) => {
  const values = [];

  const where = combineClauses([
    buildSearchClause(search, ["c.component_name", "c.category"], values),
    buildFilterClause(demandStatus, DEMAND_STATUS_SQL, values, {
      allowedValues: ["Critical", "High", "Medium", "Low"],
    }),
  ]);

  const orderBy = sortField
    ? buildOrderBy(sortField, sortDir, DEMAND_SORTS, "COALESCE(rc.total_requested, 0)")
    : "ORDER BY COALESCE(rc.total_requested, 0) DESC, c.available_quantity ASC";

  const result = await pool.query(`
    WITH request_counts AS (
      SELECT
        ri.component_id,
        SUM(ri.quantity) AS total_requested
      FROM request_items ri
      GROUP BY ri.component_id
    )
    SELECT
      c.component_id,
      c.component_name,
      c.category,
      c.total_quantity,
      c.available_quantity,
      COALESCE(rc.total_requested, 0) AS total_requested,
      ${DEMAND_STATUS_SQL} AS demand_status
    FROM components c
    LEFT JOIN request_counts rc ON c.component_id = rc.component_id
    ${where}
    ${orderBy}
  `, values);

  return result.rows.map((row) => ({
    componentId: `COMP-${row.component_id}`,
    componentName: row.component_name,
    category: row.category,
    totalStock: parseInt(row.total_quantity, 10),
    availableStock: parseInt(row.available_quantity, 10),
    totalRequested: parseInt(row.total_requested, 10),
    demandStatus: row.demand_status,
  }));
};

// Counts cover the whole catalogue, independent of the active filter.
export const getComponentDemandStats = async () => {
  const result = await pool.query(`
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE ${DEMAND_STATUS_SQL} = 'Critical')::int AS critical,
      COUNT(*) FILTER (WHERE ${DEMAND_STATUS_SQL} = 'High')::int AS high,
      COUNT(*) FILTER (WHERE ${DEMAND_STATUS_SQL} = 'Medium')::int AS medium,
      COUNT(*) FILTER (WHERE ${DEMAND_STATUS_SQL} = 'Low')::int AS low
    FROM components c
  `);
  return result.rows[0];
};
