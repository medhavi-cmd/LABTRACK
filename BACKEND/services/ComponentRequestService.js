import { pool } from "../config/db.js";

export const getAllRequests = async () => {
  const result = await pool.query(`
    SELECT
      cr.request_id,
      cr.request_date,
      cr.status,
      cr.purpose,
      c.component_name,
      ri.quantity,
      t.team_name,
      s.name AS student_name,
      s.enrollment_no
    FROM component_requests cr
    JOIN request_items ri
      ON cr.request_id = ri.request_id
    JOIN components c
      ON ri.component_id = c.component_id
    JOIN teams t
      ON cr.team_id = t.team_id
    JOIN students s
      ON t.leader_id = s.student_id
    ORDER BY cr.request_date DESC;
  `);

  return result.rows;
};

export const approveRequestService = async (requestId, staffId) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

  

    // 2. Check request exists
    const requestResult = await client.query(
      `
      SELECT status
      FROM component_requests
      WHERE request_id = $1
      `,
      [requestId]
    );

    if (requestResult.rows.length === 0) {
      throw new Error("Request not found");
    }

    if (requestResult.rows[0].status !== "pending") {
      throw new Error("Request already processed");
    }

    // 3. Fetch requested items
    const itemsResult = await client.query(
      `
      SELECT
          ri.component_id,
          ri.quantity,
          c.available_quantity
      FROM request_items ri
      JOIN components c
          ON ri.component_id = c.component_id
      WHERE ri.request_id = $1
      `,
      [requestId]
    );

    // 4. Check stock
    for (const item of itemsResult.rows) {
      if (item.available_quantity < item.quantity) {
        throw new Error(
          `Not enough stock for Component ID ${item.component_id}`
        );
      }
    }

    // 5. Approve request
    await client.query(
      `
      UPDATE component_requests
      SET
          status = 'approved',
          approved_by = $1
      WHERE request_id = $2
      `,
      [staffId, requestId]
    );

    // 6. Reduce inventory
    for (const item of itemsResult.rows) {
      await client.query(
  `
  UPDATE components
  SET
    available_quantity = available_quantity - $1,
    status = CASE
      WHEN available_quantity - $1 <= 0 THEN 'out_of_stock'::component_status_type
      WHEN available_quantity - $1 <= 10 THEN 'low_stock'::component_status_type
      ELSE 'available'::component_status_type
    END
  WHERE component_id = $2
  `,
  [item.quantity, item.component_id]
);
    }

    // 7. Create issue record
    await client.query(
      `
      INSERT INTO issue_records
      (
          request_id,
          issued_by,
          issue_date,
          expected_return_date,
          return_status,
          component_condition
      )
      VALUES
      (
          $1,
          $2,
          CURRENT_DATE,
          CURRENT_DATE + INTERVAL '7 days',
          'pending'::return_status_type,
          'good'::component_condition_type
      )
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