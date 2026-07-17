import * as dotenv from "dotenv";
dotenv.config();

async function checkSchema() {
  const { pool } = await import("./config/db.js");
  const tables = ['students', 'users', 'teams', 'issue_records', 'damage_reports', 'components', 'request_items', 'component_requests'];
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
