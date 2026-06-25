import { pool } from "../config/db.js";

/* =========================
   GET STUDENT BY USER ID
========================= */
export const getStudentByUserId = async (userId) => {
  const result = await pool.query(
    `
    SELECT
      s.student_id,
      s.user_id,
      s.enrollment_no,
      s.name,
      s.branch,
      s.section,
      s.year,
      s.semester,
      s.phone_no,
      u.email,
      u.full_name,
      u.profile_completed
    FROM students s
    JOIN users u
      ON s.user_id = u.user_id
    WHERE s.user_id = $1
    `,
    [userId]
  );

  return result.rows[0];
};


/* =========================
   GET STUDENT BY ENROLLMENT
========================= */
export const getStudentByEnrollment = async (enrollmentNo) => {
  const result = await pool.query(
    `
    SELECT
      s.student_id,
      s.user_id,
      s.enrollment_no,
      s.name,
      s.branch,
      s.section,
      s.year,
      s.semester,
      s.phone_no,
      u.email
    FROM students s
    JOIN users u
      ON s.user_id = u.user_id
    WHERE s.enrollment_no = $1
    `,
    [enrollmentNo]
  );

  return result.rows[0];
};


/* =========================
   CHECK IF STUDENT HAS TEAM
========================= */
export const studentHasTeam = async (userId) => {
  const result = await pool.query(
    `
    SELECT 1
    FROM team_members tm
    JOIN students s
      ON tm.student_id = s.student_id
    WHERE s.user_id = $1
    LIMIT 1
    `,
    [userId]
  );

  return result.rows.length > 0;
};


/* =========================
   GET TEAM FOR LOGGED-IN USER
========================= */
export const getTeamByUserId = async (userId) => {
  const result = await pool.query(
    `
    SELECT
      t.team_id,
      t.team_name,
      t.leader_id,

      p.project_id,
      p.project_title,
      p.description,

      json_agg(
        json_build_object(
          'student_id', s.student_id,
          'user_id', s.user_id,
          'name', s.name,
          'enrollment_no', s.enrollment_no,
          'email', u.email,
          'branch', s.branch,
          'section', s.section,
          'year', s.year,
          'semester', s.semester,
          'phone_no', s.phone_no,
          'project_role', tm.project_role
        )
        ORDER BY
          CASE
            WHEN s.student_id = t.leader_id THEN 0
            ELSE 1
          END,
          s.name
      ) AS members

    FROM team_members current_member

    JOIN students current_student
      ON current_member.student_id = current_student.student_id

    JOIN teams t
      ON current_member.team_id = t.team_id

    LEFT JOIN projects p
      ON p.team_id = t.team_id

    JOIN team_members tm
      ON tm.team_id = t.team_id

    JOIN students s
      ON tm.student_id = s.student_id

    JOIN users u
      ON u.user_id = s.user_id

    WHERE current_student.user_id = $1

    GROUP BY
      t.team_id,
      t.team_name,
      t.leader_id,
      p.project_id,
      p.project_title,
      p.description
    `,
    [userId]
  );

  return result.rows[0];
};

/* =========================
   REGISTER TEAM
========================= */
export const registerTeam = async (data) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const {
      leaderUserId,
      projectName,
      description,
      memberEnrollmentNumbers,
    } = data;

    // Check whether leader has already joined/created a team
    const alreadyInTeam = await client.query(
      `
      SELECT 1
      FROM team_members tm
      JOIN students s ON s.student_id = tm.student_id
      WHERE s.user_id = $1
      LIMIT 1
      `,
      [leaderUserId]
    );

    if (alreadyInTeam.rows.length > 0) {
      throw new Error("You are already part of a team");
    }

    // Fetch leader profile
    const leaderResult = await client.query(
      `
      SELECT
        student_id,
        user_id,
        enrollment_no,
        name
      FROM students
      WHERE user_id = $1
      `,
      [leaderUserId]
    );

    const leader = leaderResult.rows[0];

    if (!leader) {
      throw new Error("Leader profile not found. Please complete your profile first.");
    }

    // Remove empty values and duplicate enrollment numbers
    const cleanedMembers = [
      ...new Set(
        memberEnrollmentNumbers
          .map((number) => String(number).trim())
          .filter(Boolean)
      ),
    ];

    // Total members includes leader
    const allEnrollmentNumbers = [
      String(leader.enrollment_no),
      ...cleanedMembers,
    ];

    const uniqueMembers = [...new Set(allEnrollmentNumbers)];

    if (uniqueMembers.length < 2) {
      throw new Error("A team must have at least 2 members including the leader");
    }

    if (uniqueMembers.length > 5) {
      throw new Error("A team can have at most 5 members including the leader");
    }

    // Validate all members before creating anything
    const memberResult = await client.query(
      `
      SELECT
        student_id,
        user_id,
        enrollment_no,
        name
      FROM students
      WHERE enrollment_no = ANY($1::text[])
      `,
      [uniqueMembers]
    );

    if (memberResult.rows.length !== uniqueMembers.length) {
      const foundEnrollments = memberResult.rows.map((student) =>
        String(student.enrollment_no)
      );

      const missingEnrollment = uniqueMembers.find(
        (enrollment) => !foundEnrollments.includes(enrollment)
      );

      throw new Error(`Student with enrollment number ${missingEnrollment} not found`);
    }

    // Check that none of the members are already in another team
    const studentIds = memberResult.rows.map((student) => student.student_id);

    const occupiedMembers = await client.query(
      `
      SELECT
        s.name,
        s.enrollment_no
      FROM team_members tm
      JOIN students s
        ON tm.student_id = s.student_id
      WHERE tm.student_id = ANY($1::bigint[])
      `,
      [studentIds]
    );

    if (occupiedMembers.rows.length > 0) {
      throw new Error(
        `${occupiedMembers.rows[0].name} is already part of another team`
      );
    }

    // Create team
    const teamResult = await client.query(
      `
      INSERT INTO teams (team_name, leader_id)
      VALUES ($1, $2)
      RETURNING *
      `,
      [projectName, leader.student_id]
    );

    const team = teamResult.rows[0];

    // Create linked project
    await client.query(
      `
      INSERT INTO projects (team_id, project_title, description)
      VALUES ($1, $2, $3)
      `,
      [team.team_id, projectName, description]
    );

    // Add each member exactly once
    for (const member of memberResult.rows) {
      const membershipRole =
        member.student_id === leader.student_id ? "leader" : "member";

      await client.query(
        `
    INSERT INTO team_members (team_id, student_id, project_role)
    VALUES ($1, $2, $3)
    `,
        [team.team_id, member.student_id, membershipRole]
      );
    }

    await client.query("COMMIT");

    return team;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};