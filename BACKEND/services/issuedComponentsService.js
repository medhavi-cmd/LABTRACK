import { pool } from "../config/db.js";
import { calculateStatus } from "./inventoryService.js";
import {
  buildSearchClause,
  buildFilterClause,
  combineClauses,
  buildOrderBy,
} from "../utils/listQuery.js";

const ISSUED_SORTS = {
  issue_id: "ir.issue_id",
  component_name: "c.component_name",
  quantity: "ri.quantity",
  leader_name: "s.name",
  team_name: "t.team_name",
  issue_date: "ir.issue_date",
  expected_return_date: "ir.expected_return_date",
  return_status: "ir.return_status",
};

// Counts cover every issue record, independent of the active filter.
export const getIssuedStats = async () => {
  const result = await pool.query(`
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE LOWER(ir.return_status::text) = 'pending')::int AS pending,
      COUNT(*) FILTER (WHERE LOWER(ir.return_status::text) = 'returned')::int AS returned,
      COUNT(*) FILTER (WHERE LOWER(ir.return_status::text) = 'overdue')::int AS overdue
    FROM issue_records ir
    JOIN component_requests cr ON ir.request_id = cr.request_id
    JOIN request_items ri ON cr.request_id = ri.request_id
  `);
  return result.rows[0];
};

export const getAllIssuedComponents = async ({
  search,
  returnStatus,
  sortField,
  sortDir,
} = {}) => {
  const values = [];

  const where = combineClauses([
    buildSearchClause(
      search,
      ["c.component_name", "s.name", "s.enrollment_no", "t.team_name"],
      values
    ),
    buildFilterClause(returnStatus, "ir.return_status", values, { cast: "text" }),
  ]);

  const result = await pool.query(`
    SELECT
        ir.issue_id,
        cr.request_id,

        c.component_id,
        c.component_name,
        ri.quantity,

        s.name AS leader_name,
        s.enrollment_no,

        t.team_name,

        ir.issue_date,
        ir.expected_return_date,
        ir.actual_return_date,
        ir.return_status

    FROM issue_records ir

    JOIN component_requests cr
        ON ir.request_id = cr.request_id

    JOIN request_items ri
        ON cr.request_id = ri.request_id

    JOIN components c
        ON ri.component_id = c.component_id

    JOIN teams t
        ON cr.team_id = t.team_id

    JOIN students s
        ON t.leader_id = s.student_id
    ${where}
    ${buildOrderBy(sortField, sortDir, ISSUED_SORTS, "ir.issue_date")}
  `, values);

  return result.rows;
};

export const returnIssuedComponent = async (issueId) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Check if issue exists and is not already returned
    const issueRes = await client.query(
      `SELECT return_status, request_id FROM issue_records WHERE issue_id = $1 FOR UPDATE`,
      [issueId]
    );

    if (issueRes.rows.length === 0) {
      throw new Error("Issue record not found.");
    }

    if (issueRes.rows[0].return_status === "returned") {
      throw new Error("Component is already returned.");
    }

    const requestId = issueRes.rows[0].request_id;

    // 2. Mark as returned
    await client.query(
      `UPDATE issue_records 
       SET return_status = 'returned', 
           actual_return_date = CURRENT_DATE 
       WHERE issue_id = $1`,
      [issueId]
    );

    // 3. Restore inventory for all items in this request
    const itemsRes = await client.query(
      `SELECT component_id, quantity FROM request_items WHERE request_id = $1`,
      [requestId]
    );

    for (const item of itemsRes.rows) {
      // Get current component to calculate new available_quantity
      const compRes = await client.query(
        `SELECT available_quantity FROM components WHERE component_id = $1 FOR UPDATE`,
        [item.component_id]
      );

      if (compRes.rows.length > 0) {
        const newAvailable = compRes.rows[0].available_quantity + item.quantity;
        const newStatus = calculateStatus(newAvailable);

        await client.query(
          `UPDATE components 
           SET available_quantity = $1, 
               status = $2 
           WHERE component_id = $3`,
          [newAvailable, newStatus, item.component_id]
        );
      }
    }

    await client.query("COMMIT");
    return { success: true, message: "Component returned successfully." };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};