import { pool } from "../config/db.js";

export const getComponentDemand = async () => {
  const result = await pool.query(`
    WITH request_counts AS (
      SELECT 
        ri.component_id, 
        SUM(ri.quantity) AS total_requested
      FROM request_items ri
      GROUP BY ri.component_id
    )
    SELECT 
      c.component_id,
      c.component_name,
      c.category,
      c.total_quantity,
      c.available_quantity,
      COALESCE(rc.total_requested, 0) AS total_requested
    FROM components c
    LEFT JOIN request_counts rc ON c.component_id = rc.component_id
    ORDER BY total_requested DESC, c.available_quantity ASC;
  `);

  return result.rows.map((row) => {
    let demandStatus = "Low";
    
    // Convert to numbers
    const available = parseInt(row.available_quantity, 10);
    const total = parseInt(row.total_quantity, 10);
    
    if (available === 0) {
      demandStatus = "Critical";
    } else if (total > 0) {
      const ratio = available / total;
      if (ratio < 0.2) {
        demandStatus = "High";
      } else if (ratio < 0.5) {
        demandStatus = "Medium";
      }
    }

    return {
      componentId: `COMP-${row.component_id}`,
      componentName: row.component_name,
      category: row.category,
      totalStock: total,
      availableStock: available,
      totalRequested: parseInt(row.total_requested, 10),
      demandStatus,
    };
  });
};
