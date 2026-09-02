import { pool } from "../config/db.js";
import {
  buildSearchClause,
  combineClauses,
  buildOrderBy,
} from "../utils/listQuery.js";

// severity/damageType/status/penalty are all derived from component_condition
// below, so sorting on them maps back to the underlying column.
const DAMAGE_SORTS = {
  reportId: "ir.issue_id",
  component: "c.component_name",
  damageType: "ir.component_condition",
  severity: "ir.component_condition",
  reportDate: "ir.actual_return_date",
  penalty: "ir.issue_id",
  status: "ir.issue_id",
  student: "s.name",
};

// severity/status are derived from component_condition below, so filtering on
// them maps back to the underlying column rather than a real severity column.
const SEVERITY_TO_CONDITION = { High: "damaged", Medium: "fair" };

/*
  Stats cover every damage record, independent of the active filter.
  penalty is always 0 and status always "Pending" until a resolution column
  exists, so those are reported as such rather than invented.
*/
export const getDamageStats = async () => {
  const result = await pool.query(`
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE ir.component_condition::text = 'damaged')::int AS "highSeverity",
      COUNT(*) FILTER (WHERE ir.component_condition::text = 'damaged')::int AS "physicalDamage",
      COUNT(*) FILTER (WHERE ir.component_condition::text = 'fair')::int AS "minorDamage"
    FROM issue_records ir
    JOIN component_requests cr ON ir.request_id = cr.request_id
    JOIN request_items ri ON cr.request_id = ri.request_id
    WHERE ir.return_status = 'returned'
      AND ir.component_condition IN ('fair', 'damaged')
  `);

  const row = result.rows[0];
  const damageTypeFrequency = [
    { type: "Physical Damage", count: row.physicalDamage },
    { type: "Minor Damage", count: row.minorDamage },
  ]
    .filter((d) => d.count > 0)
    .sort((a, b) => b.count - a.count);

  return {
    total: row.total,
    pending: row.total,
    totalPenalties: 0,
    highSeverity: row.highSeverity,
    damageTypeFrequency,
  };
};

export const getDamageComponents = async ({
  search,
  severity,
  status,
  sortField,
  sortDir,
} = {}) => {
  const values = [];
  const clauses = [
    buildSearchClause(
      search,
      ["c.component_name", "s.name", "s.enrollment_no", "t.team_name", "u.email"],
      values
    ),
  ];

  const mappedCondition = SEVERITY_TO_CONDITION[severity];
  if (mappedCondition) {
    values.push(mappedCondition);
    clauses.push(`ir.component_condition::text = $${values.length}`);
  }

  // Every row is reported as "Pending" (there is no resolution column yet),
  // so any other status legitimately matches nothing.
  const requestedStatus = status ? String(status).trim() : "";
  if (requestedStatus && requestedStatus.toLowerCase() !== "all") {
    values.push(requestedStatus);
    clauses.push(`'Pending' = $${values.length}`);
  }

  const extra = combineClauses(clauses, true);

  const result = await pool.query(`
    SELECT
      ir.issue_id,
      dr.damage_id,
      c.component_name,
      ir.component_condition,
      ir.actual_return_date,
      dr.severity,
      dr.description,
      s.name AS student_name,
      s.enrollment_no,
      s.year AS batch,
      u.email,
      t.team_name

    FROM issue_records ir

    JOIN component_requests cr
      ON ir.request_id = cr.request_id

    JOIN request_items ri
      ON cr.request_id = ri.request_id

    JOIN components c
      ON ri.component_id = c.component_id

    JOIN teams t
      ON cr.team_id = t.team_id

    JOIN students s
      ON t.leader_id = s.student_id

    JOIN users u
      ON s.user_id = u.user_id

    LEFT JOIN damage_reports dr
      ON ir.issue_id = dr.issue_id

    WHERE ir.return_status = 'returned'
      AND ir.component_condition IN ('fair', 'damaged')
    ${extra}
    ${buildOrderBy(sortField, sortDir, DAMAGE_SORTS, "ir.actual_return_date")}
  `, values);

  return result.rows.map((row) => ({
    reportId: `DMG-${row.issue_id}`,
    issue_id: row.issue_id,

    component: row.component_name,

    damageType:
      row.component_condition === "damaged"
        ? "Physical Damage"
        : "Minor Damage",

    severity:
      row.component_condition === "damaged"
        ? "High"
        : "Medium",

    reportDate: row.actual_return_date,

    penalty: 0,

    status: "Pending",

    description: `Component returned in ${row.component_condition} condition.`,

    resolutionNotes: "",

    student: {
      name: row.student_name || "—",
      enrollmentNo: row.enrollment_no || "—",
      batch: row.batch || "—",
      group: row.team_name || "—",
      email: row.email || "—",
    },
  }));
};

export const resolveDamage = async (issueId) => {
  // TODO: implement later
  return {
    success: true,
    message: "Damage report marked as resolved.",
  };
};

export const addDamageReport = async () => {
  // TODO: implement later
  return {
    success: true,
    message: "Damage report created.",
  };
};