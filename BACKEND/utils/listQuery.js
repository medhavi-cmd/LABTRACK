/*
  Helpers for server-side search / filter / sort on list endpoints.

  Values are always passed as bound parameters. Column names cannot be bound,
  so sort fields and filter columns are resolved through caller-supplied
  whitelists — never interpolated from raw client input.
*/

/**
 * Builds a case-insensitive OR'd LIKE clause across the given SQL expressions.
 *
 * @param {string} search        raw search text from the client
 * @param {string[]} expressions SQL expressions to match against, e.g. ["c.component_name", "c.category"]
 * @param {any[]} values         bound-parameter array, appended to in place
 * @returns {string} a SQL fragment (without WHERE/AND), or "" when there is nothing to search
 */
export const buildSearchClause = (search, expressions, values) => {
  const term = typeof search === "string" ? search.trim() : "";
  if (!term || expressions.length === 0) return "";

  values.push(`%${term}%`);
  const idx = values.length;

  const parts = expressions.map(
    (expr) => `LOWER(COALESCE(${expr}::text, '')) LIKE LOWER($${idx})`
  );

  return `(${parts.join(" OR ")})`;
};

/**
 * Builds an equality clause for a filter, resolving the column through a whitelist.
 *
 * @param {string} value    raw filter value from the client ("all"/""/undefined means no filter)
 * @param {string} column   SQL column expression to compare
 * @param {any[]} values    bound-parameter array, appended to in place
 * @param {object} [opts]
 * @param {string[]} [opts.allowedValues] if given, value must be one of these
 * @param {string} [opts.cast]            optional cast for the column, e.g. "text"
 * @returns {string} a SQL fragment (without WHERE/AND), or "" when no filter applies
 */
export const buildFilterClause = (value, column, values, opts = {}) => {
  const { allowedValues, cast } = opts;
  if (value === undefined || value === null) return "";

  const raw = String(value).trim();
  if (!raw || raw.toLowerCase() === "all") return "";
  if (allowedValues && !allowedValues.includes(raw)) return "";

  values.push(raw);
  const col = cast ? `${column}::${cast}` : column;
  return `LOWER(${col}) = LOWER($${values.length})`;
};

/**
 * Combines clause fragments into a single WHERE/AND suffix.
 *
 * @param {string[]} clauses fragments produced by the builders above ("" entries are dropped)
 * @param {boolean} hasWhere true when the base query already contains a WHERE
 */
export const combineClauses = (clauses, hasWhere = false) => {
  const active = clauses.filter(Boolean);
  if (active.length === 0) return "";
  return `${hasWhere ? " AND " : " WHERE "}${active.join(" AND ")}`;
};

/**
 * Builds a safe ORDER BY clause.
 *
 * @param {string} sortField     requested field key from the client
 * @param {string} sortDir       "asc" | "desc"
 * @param {object} allowedSorts  map of client field key -> SQL expression (the whitelist)
 * @param {string} fallback      SQL expression used when the requested field isn't allowed
 * @returns {string} a complete "ORDER BY ..." clause
 */
export const buildOrderBy = (sortField, sortDir, allowedSorts, fallback) => {
  const expr = allowedSorts[sortField] ?? fallback;
  const dir = String(sortDir).toLowerCase() === "desc" ? "DESC" : "ASC";
  return `ORDER BY ${expr} ${dir} NULLS LAST`;
};
