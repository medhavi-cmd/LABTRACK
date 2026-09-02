import { pool } from "../config/db.js";
import {
  buildSearchClause,
  combineClauses,
  buildOrderBy,
} from "../utils/listQuery.js";

const EVENT_SORTS = {
  title: "e.event_name",
  date: "e.event_datetime",
  event_datetime: "e.event_datetime",
  created_by_name: "f.name",
};

export const getFacultyEvents = async ({ search, sortField, sortDir } = {}) => {
  const values = [];

  const where = combineClauses([
    buildSearchClause(
      search,
      ["e.event_name", "e.event_description", "f.name"],
      values
    ),
  ]);

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
    ${where}
    ${buildOrderBy(sortField, sortDir, EVENT_SORTS, "e.event_datetime")}
  `;

  const result = await pool.query(query, values);
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
