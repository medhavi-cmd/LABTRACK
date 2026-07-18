import * as dotenv from "dotenv";
dotenv.config();

async function checkSchema() {
  const { pool } = await import("./config/db.js");
  const tables = ['component_purchase_requests', 'purchase_request_summary', 'low_stock_components'];
  for (const table of tables) {
    const result = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = $1
    `, [table]);
    console.log(`${table} columns:`, result.rows.map(r => r.column_name).join(', '));
  }
  pool.end();
}

checkSchema().catch(console.error);
