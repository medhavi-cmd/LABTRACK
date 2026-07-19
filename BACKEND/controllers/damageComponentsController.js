import { getDamageComponents, resolveDamage, addDamageReport } from "../services/damageComponentsService.js";

export const fetchDamageComponents = async (req, res) => {
  try {
    const components = await getDamageComponents();
    res.status(200).json({ success: true, data: components });
  } catch (error) {
    console.error("Damage Components Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch damage components" });
  }
};

export const resolveDamageComponent = async (req, res) => {
  try {
    const issueId = req.params.id;
    const result = await resolveDamage(issueId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Resolve Damage Error:", error);
    res.status(500).json({ success: false, message: "Failed to resolve damage component" });
  }
};

export const createDamageReport = async (req, res) => {
  try {
    const data = req.body;
    const result = await addDamageReport(data);
    res.status(201).json(result);
  } catch (error) {
    console.error("Add Damage Report Error:", error);
    res.status(500).json({ success: false, message: "Failed to create damage report" });
  }
};
