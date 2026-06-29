import { pool } from "../config/db.js";

export const getAllComponents = async () => {
  const query = `
    SELECT
      component_id,
      component_name,
      category,
      total_quantity,
      available_quantity,
      status,
      component_image,
      description
    FROM components
    ORDER BY component_name;
  `;

  const result = await pool.query(query);
  return result.rows;
};

export const calculateStatus = (availableQuantity) => {
  const qty = Number(availableQuantity);

  if (qty === 0) return "out_of_stock";
  if (qty <= 10) return "low_stock";

  return "available";
};

export const getComponentById = async (id) => {
  const result = await pool.query(
    `SELECT * FROM components WHERE component_id = $1`,
    [id]
  );
  return result.rows[0] || null;
};
 
// ─── CREATE ──────────────────────────────────────────────────────────────────
export const addComponent = async ({
  component_name,
  category,
  description,
  total_quantity,
  available_quantity,
}) => {
  const status = calculateStatus(available_quantity);
 
  const result = await pool.query(
    `INSERT INTO components
       (component_name, category, description, total_quantity, available_quantity, status)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      component_name.trim(),
      category.trim(),
      description ? description.trim() : null,
      Number(total_quantity),
      Number(available_quantity),
      status,
    ]
  );
  return result.rows[0];
};
 
// ─── UPDATE ──────────────────────────────────────────────────────────────────
export const updateComponent = async (
  id,
  { component_name, category, description, total_quantity, available_quantity }
) => {
  const status = calculateStatus(available_quantity);
 
  const result = await pool.query(
    `UPDATE components
     SET
       component_name    = $1,
       category          = $2,
       description       = $3,
       total_quantity    = $4,
       available_quantity = $5,
       status            = $6
     WHERE component_id = $7
     RETURNING *`,
    [
      component_name.trim(),
      category.trim(),
      description ? description.trim() : null,
      Number(total_quantity),
      Number(available_quantity),
      status,
      id,
    ]
  );
  return result.rows[0] || null;
};
 
// ─── DELETE ──────────────────────────────────────────────────────────────────
export const deleteComponent = async (id) => {
  const result = await pool.query(
    `DELETE FROM components WHERE component_id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0] || null;
};
 