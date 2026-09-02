import { pool } from "../config/db.js";
import {
  buildSearchClause,
  buildFilterClause,
  combineClauses,
  buildOrderBy,
} from "../utils/listQuery.js";

// Keys match the field names the UI sends (see ReturnManagement.jsx mapReturnRecord).
const RETURN_SORTS = {
  returnId: "ir.actual_return_date",
  component: "c.component_name",
  quantity: "ri.quantity",
  issueDate: "ir.issue_date",
  returnDate: "ir.actual_return_date",
  condition: "ir.component_condition",
  student: "s.name",
};

// Condition counts cover all returns, independent of the active filter.
export const getReturnStats = async () => {
  const result = await pool.query(`
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE LOWER(ir.component_condition::text) = 'good')::int AS good,
      COUNT(*) FILTER (WHERE LOWER(ir.component_condition::text) = 'fair')::int AS fair,
      COUNT(*) FILTER (WHERE LOWER(ir.component_condition::text) = 'damaged')::int AS damaged
    FROM issue_records ir
    JOIN component_requests cr ON ir.request_id = cr.request_id
    JOIN request_items ri ON cr.request_id = ri.request_id
    WHERE ir.return_status = 'returned'
  `);
  return result.rows[0];
};

export const getReturnHistory = async ({
  search,
  condition,
  sortField,
  sortDir,
} = {}) => {
  const values = [];

  // The base query already filters on return_status, so these append with AND.
  const extra = combineClauses(
    [
      buildSearchClause(
        search,
        ["c.component_name", "s.name", "s.enrollment_no", "t.team_name"],
        values
      ),
      buildFilterClause(condition, "ir.component_condition", values, { cast: "text" }),
    ],
    true
  );

  const result = await pool.query(`
    SELECT
      ir.issue_id,

      'RET-' || LPAD(
        ROW_NUMBER() OVER (ORDER BY ir.actual_return_date DESC)::TEXT,
        3,
        '0'
      ) AS return_id,

      c.component_name,
      ri.quantity,

      ir.issue_date,
      ir.actual_return_date,
      ir.component_condition,

      s.name AS student_name,
    s.enrollment_no,
    t.team_name

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

    WHERE ir.return_status = 'returned'
    ${extra}
    ${buildOrderBy(sortField, sortDir, RETURN_SORTS, "ir.actual_return_date")}
  `, values);

  return result.rows;
};