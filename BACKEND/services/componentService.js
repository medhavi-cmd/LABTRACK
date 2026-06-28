import { pool } from "../config/db.js";

export const getAllComponents = async () => {
  const query = `
    SELECT
      component_id,
      component_name,
      category,
      component_image,
      description,
      total_quantity,
      available_quantity,
      status
    FROM components
    ORDER BY component_name;
  `;

  const { rows } = await pool.query(query);

  return rows;
};