import { pool } from "../config/db.js";

export const getStudentByEnrollment = async (enrollmentNo) => {
    const result = await pool.query(
        `SELECT
            student_id,
            enrollment_no,
            name,
            phone_no
        FROM students
        WHERE enrollment_no = $1`,
        [enrollmentNo]
    );

    return result.rows[0];
};

export const registerTeam = async (data) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const {
            leaderUserId,
            projectName,
            description,
            memberEnrollmentNumbers
        } = data;

        // 1. Fetch leader details
        const leaderResult = await client.query(
            `SELECT * FROM students WHERE user_id = $1`,
            [leaderUserId]
        );

        const leader = leaderResult.rows[0];

        if (!leader) {
            throw new Error("Leader profile not found");
        }

        // 2. Validate member count boundaries
        if (memberEnrollmentNumbers.length < 2) {
            throw new Error("Minimum 2 members required");
        }

        if (memberEnrollmentNumbers.length > 5) {
            throw new Error("Maximum 5 members allowed");
        }

        // 3. Create the team
        const teamResult = await client.query(
            `INSERT INTO teams (team_name, leader_id)
             VALUES ($1, $2)
             RETURNING *`,
            [projectName, leader.student_id]
        );

        const team = teamResult.rows[0];

        // 4. Create the project record tied to the team
        await client.query(
            `INSERT INTO projects (team_id, project_title, description)
             VALUES ($1, $2, $3)`,
            [team.team_id, projectName, description]
        );

        // 5. Insert leader into team_members mapping table
        await client.query(
            `INSERT INTO team_members (team_id, student_id, role)
             VALUES ($1, $2, 'leader')`,
            [team.team_id, leader.student_id]
        );

        // 6. Map other students to the team
        for (const enrollmentNo of memberEnrollmentNumbers) {
            // Prevent adding the leader a second time if their number was in the list
            if (enrollmentNo === leader.enrollment_no) {
                continue;
            }

            const memberResult = await client.query(
                `SELECT * FROM students WHERE enrollment_no = $1`,
                [enrollmentNo]
            );

            const member = memberResult.rows[0];

            if (!member) {
                throw new Error(`Student ${enrollmentNo} not found`);
            }

            await client.query(
                `INSERT INTO team_members (team_id, student_id, role)
                 VALUES ($1, $2, 'member')`,
                [team.team_id, member.student_id]
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