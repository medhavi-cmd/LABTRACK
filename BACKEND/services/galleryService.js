import { pool } from "../config/db.js";

// GET ALL APPROVED PROJECTS
export const getGalleryProjects = async (filters = {}) => {
  const { search, branch, faculty } = filters;

  let query = `
    SELECT
      p.project_id,
      p.project_title,
      p.description,
      p.cover_image,
      t.department AS branch,
      t.academic_year AS batch,
      STRING_AGG(DISTINCT f.name, ', ') AS faculty_names

    FROM projects p

    JOIN teams t
      ON t.team_id = p.team_id

    LEFT JOIN team_faculty tf
      ON tf.team_id = t.team_id

    LEFT JOIN faculty f
      ON f.faculty_id = tf.faculty_id

    WHERE p.is_gallery_visible = TRUE
  `;

  const values = [];
  let index = 1;

  if (search) {
    query += `
      AND (
        LOWER(p.project_title) LIKE LOWER($${index})
        OR LOWER(COALESCE(p.description,'')) LIKE LOWER($${index})
      )
    `;
    values.push(`%${search}%`);
    index++;
  }

  if (branch) {
    query += ` AND t.department = $${index}`;
    values.push(branch);
    index++;
  }

  if (faculty) {
    query += ` AND f.name = $${index}`;
    values.push(faculty);
    index++;
  }

  query += `
    GROUP BY
      p.project_id,
      p.project_title,
      p.description,
      p.cover_image,
      t.department,
      t.academic_year

    ORDER BY
      p.created_at DESC
  `;

  const result = await pool.query(query, values);

  return result.rows;
};

// GET PROJECT DETAILS
export const getProjectDetails = async (projectId) => {
  const projectResult = await pool.query(
    `
    SELECT
      p.project_id,
      p.project_title,
      p.description,
      p.objective,
      p.cover_image,
      p.report_file,
      p.created_at,

      t.team_name,
      t.department,
      t.academic_year,

      STRING_AGG(DISTINCT f.name, ', ') AS faculty_names

    FROM projects p

    JOIN teams t
      ON t.team_id = p.team_id

    LEFT JOIN team_faculty tf
      ON tf.team_id = t.team_id

    LEFT JOIN faculty f
      ON f.faculty_id = tf.faculty_id

    WHERE
      p.project_id = $1
      AND p.is_gallery_visible = TRUE

    GROUP BY
      p.project_id,
      t.team_name,
      t.department,
      t.academic_year
    `,
    [projectId]
  );

  if (projectResult.rows.length === 0) {
    return null;
  }

  const imagesResult = await pool.query(
    `
    SELECT
      image_url

    FROM project_images

    WHERE project_id = $1
    `,
    [projectId]
  );

  const videosResult = await pool.query(
    `
    SELECT
      video_url

    FROM project_videos

    WHERE project_id = $1
    `,
    [projectId]
  );

  const teamResult = await pool.query(
    `
    SELECT
      s.name

    FROM team_members tm

    JOIN students s
      ON s.student_id = tm.student_id

    JOIN projects p
      ON p.team_id = tm.team_id

    WHERE p.project_id = $1
    `,
    [projectId]
  );

  return {
    ...projectResult.rows[0],
    images: imagesResult.rows,
    videos: videosResult.rows,
    teamMembers: teamResult.rows,
  };
};

// GET GALLERY STATISTICS
export const getGalleryStatistics = async () => {
  const result = await pool.query(`
    SELECT
      COUNT(*) AS total_projects,

      COUNT(DISTINCT t.department) AS total_branches,

      COUNT(DISTINCT t.team_id) AS total_teams

    FROM projects p

    JOIN teams t
      ON t.team_id = p.team_id

    WHERE p.is_gallery_visible = TRUE
  `);

  return result.rows[0];
};