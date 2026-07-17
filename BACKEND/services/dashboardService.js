import { pool } from "../config/db.js";

export const getDashboardData = async () => {
  try {
    // ==========================
    // Dashboard Statistics
    // ==========================
    const [
      totalComponentsResult,
      pendingRequestsResult,
      issuedComponentsResult,
      damagedComponentsResult,
    ] = await Promise.all([
      pool.query(`
        SELECT COUNT(*) AS total
        FROM components;
      `),

      pool.query(`
        SELECT COUNT(*) AS total
        FROM component_requests
        WHERE status = 'pending';
      `),

      pool.query(`
        SELECT COUNT(*) AS total
        FROM issue_records
        WHERE return_status = 'pending';
      `),

      pool.query(`
        SELECT COUNT(*) AS total
        FROM damage_reports;
      `),
    ]);

    // ==========================
    // Recent Component Requests
    // ==========================
    const recentRequestsResult = await pool.query(`
      SELECT
          cr.request_id,
          c.component_name,
          ri.quantity,
          cr.status,
          cr.request_date

      FROM component_requests cr

      JOIN request_items ri
          ON cr.request_id = ri.request_id

      JOIN components c
          ON ri.component_id = c.component_id

      ORDER BY cr.request_date DESC
      LIMIT 5;
    `);

    // ==========================
    // Low Stock Components
    // ==========================
    const lowStockResult = await pool.query(`
      SELECT
          component_id,
          component_name,
          available_quantity,
          total_quantity,
          status

      FROM components

      WHERE status = 'low_stock'

      ORDER BY available_quantity ASC
      LIMIT 5;
    `);

    return {
      stats: {
        totalComponents: Number(totalComponentsResult.rows[0].total),
        pendingRequests: Number(pendingRequestsResult.rows[0].total),
        issuedComponents: Number(issuedComponentsResult.rows[0].total),
        damagedComponents: Number(damagedComponentsResult.rows[0].total),
      },

      recentRequests: recentRequestsResult.rows,

      lowStockComponents: lowStockResult.rows,
    };
  } catch (error) {
    console.error("Dashboard Service Error:", error);
    throw error;
  }
};