import { pool } from "../config/db.js";
import {
  buildSearchClause,
  buildFilterClause,
  combineClauses,
  buildOrderBy,
} from "../utils/listQuery.js";

const CATALOGUE_SORTS = {
  component_name: "component_name",
  category: "category",
  available_quantity: "available_quantity",
};

export const getAllComponents = async ({
  search,
  category,
  sortField,
  sortDir,
} = {}) => {
  const values = [];

  const where = combineClauses([
    buildSearchClause(search, ["component_name", "category", "description"], values),
    buildFilterClause(category, "category", values),
  ]);

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
    ${where}
    ${buildOrderBy(sortField, sortDir, CATALOGUE_SORTS, "component_name")}
  `;

  const { rows } = await pool.query(query, values);

  return rows;
};

// Distinct categories power the catalogue's filter dropdown.
export const getComponentCategories = async () => {
  const { rows } = await pool.query(`
    SELECT DISTINCT category
    FROM components
    WHERE category IS NOT NULL AND category <> ''
    ORDER BY category
  `);
  return rows.map((r) => r.category);
};