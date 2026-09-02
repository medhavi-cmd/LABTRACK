import { pool } from "../config/db.js";
import {
  buildSearchClause,
  buildFilterClause,
  combineClauses,
  buildOrderBy,
} from "../utils/listQuery.js";

const INVENTORY_SORTS = {
  component_name: "component_name",
  category: "category",
  total_quantity: "total_quantity",
  available_quantity: "available_quantity",
  status: "status",
};

export const getAllComponents = async ({
  search,
  status,
  sortField,
  sortDir,
} = {}) => {
  const values = [];

  const where = combineClauses([
    buildSearchClause(search, ["component_name", "category", "description"], values),
    buildFilterClause(status, "status", values, {
      allowedValues: ["available", "low_stock", "out_of_stock"],
      cast: "text",
    }),
  ]);

  const query = `
    SELECT
      component_id,
      component_name,
      category,
      total_quantity,
      available_quantity,
      status,
      component_image,
      description
    FROM components
    ${where}
    ${buildOrderBy(sortField, sortDir, INVENTORY_SORTS, "component_name")}
  `;

  const result = await pool.query(query, values);
  return result.rows;
};

// Stats always reflect the whole inventory, never the current filter.
export const getInventoryStats = async () => {
  const result = await pool.query(`
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE status = 'available')::int AS available,
      COUNT(*) FILTER (WHERE status = 'low_stock')::int AS "lowStock",
      COUNT(*) FILTER (WHERE status = 'out_of_stock')::int AS "outOfStock"
    FROM components
  `);
  return result.rows[0];
};

export const calculateStatus = (availableQuantity) => {
  const qty = Number(availableQuantity);

  if (qty === 0) return "out_of_stock";
  if (qty <= 10) return "low_stock";

  return "available";
};

export const getComponentById = async (id) => {
  const result = await pool.query(
    `SELECT * FROM components WHERE component_id = $1`,
    [id]
  );
  return result.rows[0] || null;
};
 
// ─── CREATE ──────────────────────────────────────────────────────────────────
export const addComponent = async ({
  component_name,
  category,
  description,
  total_quantity,
  available_quantity,
}) => {
  const status = calculateStatus(available_quantity);
 
  const result = await pool.query(
    `INSERT INTO components
       (component_name, category, description, total_quantity, available_quantity, status)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      component_name.trim(),
      category.trim(),
      description ? description.trim() : null,
      Number(total_quantity),
      Number(available_quantity),
      status,
    ]
  );
  return result.rows[0];
};
 
// ─── UPDATE ──────────────────────────────────────────────────────────────────
export const updateComponent = async (
  id,
  { component_name, category, description, total_quantity, available_quantity }
) => {
  const status = calculateStatus(available_quantity);
 
  const result = await pool.query(
    `UPDATE components
     SET
       component_name    = $1,
       category          = $2,
       description       = $3,
       total_quantity    = $4,
       available_quantity = $5,
       status            = $6
     WHERE component_id = $7
     RETURNING *`,
    [
      component_name.trim(),
      category.trim(),
      description ? description.trim() : null,
      Number(total_quantity),
      Number(available_quantity),
      status,
      id,
    ]
  );
  return result.rows[0] || null;
};
 
// ─── DELETE ──────────────────────────────────────────────────────────────────
export const deleteComponent = async (id) => {
  const result = await pool.query(
    `DELETE FROM components WHERE component_id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0] || null;
};
 