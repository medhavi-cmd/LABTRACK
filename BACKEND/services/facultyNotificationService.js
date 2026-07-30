import { pool } from "../config/db.js";
export const getFacultyNotifications = async (userId) => {
  const result = await pool.query(
    `
    SELECT
      n.notification_id AS id,
      n.title,
      n.message,
      n.source_type AS "sourceType",
      n.source_id AS "sourceId",
      n.created_at AS "createdAt",
      n.is_archived AS "isArchived",
      COUNT(nr.recipient_id)::int AS "recipientCount"
    FROM public.notificationsnew n
    LEFT JOIN public.notification_recipients nr
      ON nr.notification_id = n.notification_id
    WHERE n.created_by = $1
    GROUP BY
      n.notification_id,
      n.title,
      n.message,
      n.source_type,
      n.source_id,
      n.created_at,
      n.is_archived
    ORDER BY n.created_at DESC
    `,
    [userId]
  );

  return result.rows;
};
export const getFacultyNotificationStats = async (userId) => {
  const result = await pool.query(
    `
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (
        WHERE is_archived = false
      )::int AS active,
      COUNT(*) FILTER (
        WHERE is_archived = true
      )::int AS archived
    FROM public.notificationsnew
    WHERE created_by = $1
    `,
    [userId]
  );

  return result.rows[0];
};
export const createFacultyNotification = async ({
  userId,
  title,
  message,
  sourceType,
  sourceId = null,
}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const notificationResult = await client.query(
      `
      INSERT INTO public.notificationsnew (
        title,
        message,
        notification_type,
        source_type,
        source_id,
        created_by,
        is_archived
      )
      VALUES (
        $1,
        $2,
        'faculty',
        $3,
        $4,
        $5,
        false
      )
      RETURNING notification_id
      `,
      [title, message, sourceType, sourceId, userId]
    );

    const notificationId =
      notificationResult.rows[0].notification_id;

    let recipientQuery;
    let recipientParams = [];

    if (sourceType === "all_students") {
      recipientQuery = `
        SELECT DISTINCT user_id
        FROM public.students
      `;
    } else if (sourceType === "faculty_teams") {
      recipientQuery = `
        SELECT DISTINCT s.user_id
        FROM public.faculty f
        INNER JOIN public.team_faculty tf
          ON tf.faculty_id = f.faculty_id
        INNER JOIN public.team_members tm
          ON tm.team_id = tf.team_id
        INNER JOIN public.students s
          ON s.student_id = tm.student_id
        WHERE f.user_id = $1
      `;

      recipientParams = [userId];
    } else if (sourceType === "team") {
      recipientQuery = `
        SELECT DISTINCT s.user_id
        FROM public.team_members tm
        INNER JOIN public.students s
          ON s.student_id = tm.student_id
        WHERE tm.team_id = $1
      `;

      recipientParams = [sourceId];
    } else {
      throw new Error("Invalid notification audience.");
    }

    const recipientResult = await client.query(
      recipientQuery,
      recipientParams
    );

    const recipientUserIds = recipientResult.rows.map(
      (row) => row.user_id
    );

    for (const recipientUserId of recipientUserIds) {
      await client.query(
        `
        INSERT INTO public.notification_recipients (
          notification_id,
          user_id,
          is_read
        )
        VALUES ($1, $2, false)
        `,
        [notificationId, recipientUserId]
      );
    }

    await client.query("COMMIT");

    return {
      id: notificationId,
      recipientCount: recipientUserIds.length,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
export const archiveFacultyNotification = async ({
  notificationId,
  userId,
}) => {
  const result = await pool.query(
    `
    UPDATE public.notificationsnew
    SET is_archived = true
    WHERE notification_id = $1
      AND created_by = $2
    RETURNING
      notification_id AS id,
      title,
      message,
      source_type AS "sourceType",
      source_id AS "sourceId",
      created_at AS "createdAt",
      is_archived AS "isArchived"
    `,
    [notificationId, userId]
  );

  return result.rows[0] || null;
};

export const deleteFacultyNotification = async ({
  notificationId,
  userId,
}) => {
  const result = await pool.query(
    `
    DELETE FROM public.notificationsnew
    WHERE notification_id = $1
      AND created_by = $2
    RETURNING notification_id AS id
    `,
    [notificationId, userId]
  );

  return result.rows[0] || null;
};
