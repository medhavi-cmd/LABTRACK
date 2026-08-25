import { pool } from "../config/db.js";


//  GET TEAM DETAILS OF LOGGED-IN STUDENT
export const getTeamDetailsForRequest = async (userId) => {
    const result = await pool.query(
        `
    SELECT
        t.team_id,
        t.team_name,
        p.project_title,

        COALESCE(
            (
                SELECT json_agg(
                    json_build_object(
                        'faculty_id', f.faculty_id,
                        'name', f.name,
                        'department', f.department
                    )
                )
                FROM team_faculty tf
                JOIN faculty f
                    ON f.faculty_id = tf.faculty_id
                WHERE tf.team_id = t.team_id
            ),
            '[]'
        ) AS faculty

    FROM students s

    JOIN team_members tm
        ON tm.student_id = s.student_id

    JOIN teams t
        ON t.team_id = tm.team_id

    LEFT JOIN projects p
        ON p.team_id = t.team_id

    WHERE s.user_id = $1
    `,
        [userId]
    );

    return result.rows[0];
};


// CREATE PURCHASE REQUEST
export const createPurchaseRequest = async (userId, data) => {
    const {
        componentName,
        quantityRequired,
        reason,
        category,
    } = data;

    // Find the logged-in student's team
    const teamResult = await pool.query(
        `
    SELECT
        t.team_id
    FROM students s

    JOIN team_members tm
        ON tm.student_id = s.student_id

    JOIN teams t
        ON t.team_id = tm.team_id

    WHERE s.user_id = $1
    LIMIT 1
    `,
        [userId]
    );

    if (teamResult.rows.length === 0) {
        throw new Error("You are not part of any team.");
    }

    const teamId = teamResult.rows[0].team_id;

    const result = await pool.query(
        `
    INSERT INTO component_purchase_requests
    (
        team_id,
        component_name,
        category,
        quantity_required,
        reason
    )
    VALUES
    (
        $1,
        $2,
        $3,
        $4,
        $5
    )
    RETURNING *
    `,
        [
            teamId,
            componentName,
            category || null,
            quantityRequired,
            reason,
        ]
    );

    return result.rows[0];
};


//    GET ALL PURCHASE REQUESTS OF MY TEAM
export const getPurchaseRequestsByTeam = async (userId) => {
    const result = await pool.query(
        `
    SELECT
        cpr.purchase_request_id,
        cpr.component_name,
        cpr.category,
        cpr.quantity_required,
        cpr.reason,
        cpr.request_date,
        cpr.status,
        cpr.remarks

    FROM component_purchase_requests cpr

    WHERE cpr.team_id = (
        SELECT tm.team_id
        FROM students s

        JOIN team_members tm
            ON tm.student_id = s.student_id

        WHERE s.user_id = $1
        LIMIT 1
    )

    ORDER BY cpr.request_date DESC
    `,
        [userId]
    );

    return result.rows;
};

// GET ALL PURCHASE REQUESTS (LAB STAFF)
export const getAllPurchaseRequests = async () => {
    const result = await pool.query(
        `
        SELECT
            cpr.purchase_request_id,
            cpr.component_name,
            cpr.category,
            cpr.quantity_required,
            cpr.reason,
            cpr.request_date,
            cpr.status,
            cpr.remarks,
            t.team_name,
            p.project_title
        FROM component_purchase_requests cpr
        LEFT JOIN teams t ON t.team_id = cpr.team_id
        LEFT JOIN projects p ON p.team_id = t.team_id
        ORDER BY cpr.request_date DESC
        `
    );
    return result.rows;
};

// UPDATE PURCHASE REQUEST STATUS (LAB STAFF)
export const updatePurchaseRequest = async (id, status, remarks) => {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        
        // Update request status
        const updateResult = await client.query(
            `
            UPDATE component_purchase_requests
            SET status = $1, remarks = $2
            WHERE purchase_request_id = $3
            RETURNING *
            `,
            [status, remarks || null, id]
        );
        
        const request = updateResult.rows[0];
        
        if (!request) {
            throw new Error("Purchase request not found");
        }
        
        // If approved, add component to inventory
        if (status === 'approved') {
            // Check if component exists by name (case-insensitive)
            const existingComponentResult = await client.query(
                `SELECT * FROM components WHERE LOWER(component_name) = LOWER($1)`,
                [request.component_name]
            );
            
            if (existingComponentResult.rows.length > 0) {
                // Update existing component quantity
                const existing = existingComponentResult.rows[0];
                const newTotal = Number(existing.total_quantity) + Number(request.quantity_required);
                const newAvailable = Number(existing.available_quantity) + Number(request.quantity_required);
                
                let newStatus = "available";
                if (newAvailable === 0) newStatus = "out_of_stock";
                else if (newAvailable <= 10) newStatus = "low_stock";
                
                await client.query(
                    `UPDATE components SET total_quantity = $1, available_quantity = $2, status = $3 WHERE component_id = $4`,
                    [newTotal, newAvailable, newStatus, existing.component_id]
                );
            } else {
                // Add new component
                let newStatus = "available";
                if (request.quantity_required === 0) newStatus = "out_of_stock";
                else if (request.quantity_required <= 10) newStatus = "low_stock";
                
                await client.query(
                    `INSERT INTO components (component_name, category, total_quantity, available_quantity, status)
                     VALUES ($1, $2, $3, $4, $5)`,
                    [
                        request.component_name.trim(),
                        request.category ? request.category.trim() : "Uncategorized",
                        Number(request.quantity_required),
                        Number(request.quantity_required),
                        newStatus
                    ]
                );
            }
        }
        
        await client.query('COMMIT');
        return request;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};