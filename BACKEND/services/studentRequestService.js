import {pool} from "../config/db.js";

export const submitComponentRequest = async (
  studentId,
  purpose,
  items
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Find student's team
    const teamResult = await client.query(
      `
      SELECT team_id
      FROM team_members
      WHERE student_id = $1
      `,
      [studentId]
    );

    if (teamResult.rows.length === 0) {
      throw new Error("You are not part of any team.");
    }

    const teamId = teamResult.rows[0].team_id;

    // Create request
    const requestResult = await client.query(
      `
      INSERT INTO component_requests
      (
        team_id,
        purpose
      )
      VALUES
      (
        $1,
        $2
      )
      RETURNING request_id
      `,
      [teamId, purpose]
    );

    const requestId = requestResult.rows[0].request_id;

    // Insert each component
    for (const item of items) {
      await client.query(
        `
        INSERT INTO request_items
        (
          request_id,
          component_id,
          quantity
        )
        VALUES
        (
          $1,
          $2,
          $3
        )
        `,
        [
          requestId,
          item.component_id,
          item.quantity,
        ]
      );
    }

    await client.query("COMMIT");

    return {
      message: "Request submitted successfully",
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};