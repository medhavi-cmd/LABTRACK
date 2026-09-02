import { pool } from "../config/db.js";
import {
  buildFilterClause,
  combineClauses,
  buildOrderBy,
} from "../utils/listQuery.js";

const REQUEST_SORTS = {
  request_id: "cr.request_id",
  request_date: "cr.request_date",
  status: "cr.status",
  purpose: "cr.purpose",
  team_name: "t.team_name",
  student_name: "s.name",
  enrollment_no: "s.enrollment_no",
};

// Counts cover every request, independent of the active filter.
export const getRequestStats = async () => {
  const result = await pool.query(`
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE LOWER(status::text) = 'pending')::int AS pending,
      COUNT(*) FILTER (WHERE LOWER(status::text) = 'approved')::int AS approved,
      COUNT(*) FILTER (WHERE LOWER(status::text) = 'issued')::int AS issued
    FROM component_requests
  `);
  return result.rows[0];
};

export const getAllRequests = async ({ search, status, sortField, sortDir } = {}) => {
  const values = [];

  // Component matches go through EXISTS so a matching request still returns its
  // full component list, rather than only the components that matched.
  const term = typeof search === "string" ? search.trim() : "";
  let searchClause = "";
  if (term) {
    values.push(`%${term}%`);
    const i = values.length;
    searchClause = `(
      LOWER(COALESCE(t.team_name::text, '')) LIKE LOWER($${i})
      OR LOWER(COALESCE(s.name::text, '')) LIKE LOWER($${i})
      OR LOWER(COALESCE(s.enrollment_no::text, '')) LIKE LOWER($${i})
      OR LOWER(COALESCE(cr.purpose::text, '')) LIKE LOWER($${i})
      OR EXISTS (
        SELECT 1 FROM request_items ri2
        JOIN components c2 ON c2.component_id = ri2.component_id
        WHERE ri2.request_id = cr.request_id
          AND LOWER(COALESCE(c2.component_name::text, '')) LIKE LOWER($${i})
      )
    )`;
  }

  const where = combineClauses([
    searchClause,
    buildFilterClause(status, "cr.status", values, { cast: "text" }),
  ]);

  const result = await pool.query(`
    SELECT
      cr.request_id,
      cr.request_date,
      cr.status,
      cr.purpose,
      t.team_name,
      s.name         AS student_name,
      s.enrollment_no,
      json_agg(
        json_build_object(
          'component_id',   c.component_id,
          'component_name', c.component_name,
          'quantity',       ri.quantity
        )
        ORDER BY c.component_name
      ) AS components
    FROM component_requests cr
    JOIN request_items ri
      ON cr.request_id = ri.request_id
    JOIN components c
      ON ri.component_id = c.component_id
    JOIN teams t
      ON cr.team_id = t.team_id
    JOIN students s
      ON t.leader_id = s.student_id
    ${where}
    GROUP BY
      cr.request_id,
      cr.request_date,
      cr.status,
      cr.purpose,
      t.team_name,
      s.name,
      s.enrollment_no
    ${buildOrderBy(sortField, sortDir, REQUEST_SORTS, "cr.request_date")}
  `, values);

  return result.rows;
};

export const approveRequestService = async (requestId, userId) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Resolve lab_staff.staff_id from the authenticated users.user_id
    //    The JWT carries users.user_id; approved_by and issued_by FK to lab_staff.staff_id
    const staffResult = await client.query(
      `SELECT staff_id FROM lab_staff WHERE user_id = $1`,
      [userId]
    );

    if (staffResult.rows.length === 0) {
      throw new Error("Lab staff profile not found for this account.");
    }

    const staffId = staffResult.rows[0].staff_id;

    // 2. Check request exists and is still pending
    const requestResult = await client.query(
      `SELECT status FROM component_requests WHERE request_id = $1`,
      [requestId]
    );

    if (requestResult.rows.length === 0) {
      throw new Error("Request not found");
    }

    if (requestResult.rows[0].status !== "pending") {
      throw new Error("Request already processed");
    }

    // 3. Fetch requested items with current stock levels
    const itemsResult = await client.query(
      `
      SELECT
          ri.component_id,
          ri.quantity,
          c.available_quantity,
          c.component_name
      FROM request_items ri
      JOIN components c
          ON ri.component_id = c.component_id
      WHERE ri.request_id = $1
      `,
      [requestId]
    );

    // 4. Check stock for every item before making any change
    for (const item of itemsResult.rows) {
      if (item.available_quantity < item.quantity) {
        throw new Error(
          `Insufficient stock for "${item.component_name}" — available: ${item.available_quantity}, requested: ${item.quantity}`
        );
      }
    }

    // 5. Mark request as approved
    await client.query(
      `UPDATE component_requests
       SET status = 'approved', approved_by = $1
       WHERE request_id = $2`,
      [staffId, requestId]
    );

    // 6. Reduce available inventory for each component
    for (const item of itemsResult.rows) {
      await client.query(
        `
        UPDATE components
        SET
          available_quantity = available_quantity - $1,
          status = CASE
            WHEN available_quantity - $1 <= 0  THEN 'out_of_stock'::component_status_type
            WHEN available_quantity - $1 <= 10 THEN 'low_stock'::component_status_type
            ELSE 'available'::component_status_type
          END
        WHERE component_id = $2
        `,
        [item.quantity, item.component_id]
      );
    }

    // 7. Create a single issue record for this request
    await client.query(
      `
      INSERT INTO issue_records
        (request_id, issued_by, issue_date, expected_return_date, return_status, component_condition)
      VALUES
        ($1, $2, CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days',
         'pending'::return_status_type, 'good'::component_condition_type)
      `,
      [requestId, staffId]
    );

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};