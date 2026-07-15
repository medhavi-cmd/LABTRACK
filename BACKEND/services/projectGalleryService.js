import { pool } from "../config/db.js";

import {
  uploadProjectCover,
  uploadProjectImage,
  uploadProjectReport,
} from "./projectGalleryUploadService.js";

// SUBMIT PROJECT TO GALLERY

export const submitProjectToGallery = async (
  userId,
  body,
  files
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // FIND TEAM & PROJECT

    const projectResult = await client.query(
      `
      SELECT
          p.project_id,
          p.team_id
      FROM students s

      JOIN team_members tm
          ON tm.student_id = s.student_id

      JOIN teams t
          ON t.team_id = tm.team_id

      JOIN projects p
          ON p.team_id = t.team_id

      WHERE s.user_id = $1

      LIMIT 1
      `,
      [userId]
    );

    if (projectResult.rows.length === 0) {
      throw new Error("Project not found.");
    }

    const project = projectResult.rows[0];

    const existingRequest = await client.query(
      `
      SELECT request_id
      FROM gallery_requests
      WHERE project_id = $1
      `,
      [project.project_id]
    );

    if (existingRequest.rows.length > 0) {
      throw new Error(
        "You have already submitted this project for gallery approval."
      );
    }

    // COVER IMAGE

    let coverImageUrl = null;

    if (files.coverImage?.length) {
      coverImageUrl = await uploadProjectCover(
        files.coverImage[0]
      );
    }

    // REPORT PDF

    let reportUrl = null;

    if (files.report?.length) {
      reportUrl = await uploadProjectReport(
        files.report[0]
      );
    }

    //UPDATE PROJECT

    await client.query(
      `
      UPDATE projects

      SET
          description = $1,
          objective = $2,
          cover_image = $3,
          report_file = $4

      WHERE project_id = $5
      `,
      [
        body.description,
        body.objective,
        coverImageUrl,
        reportUrl,
        project.project_id,
      ]
    );

    // PROJECT IMAGES

    if (files.galleryImages?.length) {
      for (const image of files.galleryImages) {
        const imageUrl = await uploadProjectImage(image);

        await client.query(
          `
          INSERT INTO project_images
          (
              project_id,
              image_url
          )

          VALUES
          (
              $1,
              $2
          )
          `,
          [
            project.project_id,
            imageUrl,
          ]
        );
      }
    }

  //  CREATE GALLERY REQUEST

    await client.query(
      `
      INSERT INTO gallery_requests
      (
          project_id
      )

      VALUES
      (
          $1
      )
      `,
      [project.project_id]
    );

    await client.query("COMMIT");

    return {
      success: true,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// GET GALLERY PROJECTS

export const getGalleryProjects = async () => {
  const result = await pool.query(
    `
    SELECT

        p.project_id,
        p.project_title,
        p.description,
        p.cover_image,

        t.team_name,
        t.department,
        t.academic_year,

        (
            SELECT COUNT(*)
            FROM team_members tm
            WHERE tm.team_id = t.team_id
        ) AS team_size

    FROM projects p

    JOIN teams t
        ON p.team_id = t.team_id

    WHERE p.is_gallery_visible = TRUE

    ORDER BY p.created_at DESC
    `
  );

  return result.rows;
};

//GALLERY STATISTICS

export const getGalleryStatistics = async () => {
  const totalProjects = await pool.query(`
      SELECT COUNT(*)
      FROM projects
      WHERE is_gallery_visible = TRUE
  `);

  const totalTeams = await pool.query(`
      SELECT COUNT(DISTINCT team_id)
      FROM projects
      WHERE is_gallery_visible = TRUE
  `);

  // const totalDepartments = await pool.query(`
  //     SELECT COUNT(DISTINCT department)
  //     FROM teams
  // `);

  // const totalBatches = await pool.query(`
  //     SELECT COUNT(DISTINCT academic_year)
  //     FROM teams
  // `);

  return {
    totalProjects: Number(totalProjects.rows[0].count),
    totalTeams: Number(totalTeams.rows[0].count),
    totalDepartments: Number(totalDepartments.rows[0].count),
    totalBatches: Number(totalBatches.rows[0].count),
  };
};