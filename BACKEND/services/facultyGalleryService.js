import { pool } from "../config/db.js";

/* =========================================================
   SHARED SELECT — GALLERY REQUEST WITH PROJECT/TEAM/UPLOADER
========================================================= */

const GALLERY_REQUEST_SELECT = `
  SELECT
    gr.request_id AS id,
    gr.project_id AS "projectId",
    p.project_title AS title,
    t.team_name AS team,
    COALESCE(s.name, 'Unknown') AS "uploadedBy",
    pi.image_url AS image,
    INITCAP(COALESCE(gr.status::text, 'pending')) AS status,
    gr.request_date AS "requestDate",
    gr.reviewed_at AS "reviewedAt",
    gr.remarks AS remarks

  FROM public.gallery_requests gr

  INNER JOIN public.projects p
    ON p.project_id = gr.project_id

  INNER JOIN public.teams t
    ON t.team_id = p.team_id

  LEFT JOIN public.students s
    ON s.student_id = t.leader_id

  LEFT JOIN LATERAL (
    SELECT image_url
    FROM public.project_images pi2
    WHERE pi2.project_id = p.project_id
    ORDER BY pi2.image_id DESC
    LIMIT 1
  ) pi ON TRUE
`;

export const getFacultyGalleryRequests = async () => {
  const query = `
    ${GALLERY_REQUEST_SELECT}
    ORDER BY
      gr.request_date DESC,
      gr.request_id DESC
  `;

  const result = await pool.query(query);

  return result.rows;
};

export const getGalleryRequestById = async (requestId) => {
  const query = `
    ${GALLERY_REQUEST_SELECT}
    WHERE gr.request_id = $1
  `;

  const result = await pool.query(query, [requestId]);

  return result.rows[0] || null;
};

/* =========================================================
   RESOLVE FACULTY_ID FROM AUTHENTICATED USER_ID
   JWT only carries user_id — faculty.user_id maps it
   to faculty_id. Never fabricate this value.
========================================================= */

export const getFacultyIdByUserId = async (userId) => {
  const result = await pool.query(
    `
    SELECT faculty_id
    FROM public.faculty
    WHERE user_id = $1
    `,
    [userId]
  );

  return result.rows[0]?.faculty_id ?? null;
};

/* =========================================================
   APPROVE / REJECT A GALLERY REQUEST
========================================================= */

export const updateFacultyGalleryRequestStatus = async ({
  requestId,
  status,
  facultyId,
  remarks,
}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const updateResult = await client.query(
      `
      UPDATE public.gallery_requests
      SET
        status = $1::approval_status,
        faculty_id = $2,
        reviewed_at = NOW(),
        remarks = $3
      WHERE request_id = $4
      RETURNING project_id
      `,
      [status, facultyId, remarks, requestId]
    );

    if (updateResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return null;
    }

    const { project_id: projectId } = updateResult.rows[0];

    await client.query(
      `
      UPDATE public.projects
      SET is_gallery_visible = $1
      WHERE project_id = $2
      `,
      [status === "approved", projectId]
    );

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

  return getGalleryRequestById(requestId);
};
