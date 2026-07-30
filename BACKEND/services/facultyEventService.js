import { pool } from "../config/db.js";

export const getFacultyEvents = async () => {
  const query = `
    SELECT
      e.event_id AS id,
      e.event_name AS title,
      e.event_description AS description,
      TO_CHAR(e.event_datetime, 'DD-MM-YYYY') AS date,
      TO_CHAR(e.event_datetime, 'HH24:MI') AS time,
      e.event_datetime,
      e.created_by,
      COALESCE(f.name, 'Not Assigned') AS created_by_name
    FROM public.events e
    LEFT JOIN public.faculty f
      ON f.faculty_id = e.created_by
    ORDER BY e.event_datetime ASC, e.event_id ASC
  `;

  const result = await pool.query(query);
  return result.rows;
};

export const createFacultyEvent = async ({
  title,
  description,
  eventDatetime,
  facultyId,
}) => {
  const query = `
    INSERT INTO public.events
    (
      event_name,
      event_description,
      event_datetime,
      created_by
    )
    VALUES ($1, $2, $3, $4)
    RETURNING
      event_id AS id,
      event_name AS title,
      event_description AS description,
      TO_CHAR(event_datetime, 'DD-MM-YYYY') AS date,
      TO_CHAR(event_datetime, 'HH24:MI') AS time,
      event_datetime,
      created_by
  `;

  const values = [
    title,
    description || null,
    eventDatetime,
    facultyId,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const removeFacultyEvent = async (eventId) => {
  const query = `
    DELETE FROM public.events
    WHERE event_id = $1
    RETURNING event_id AS id
  `;

  const result = await pool.query(query, [eventId]);
  return result.rows[0] || null;
};
