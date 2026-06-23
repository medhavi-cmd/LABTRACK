import {
  getAllComponents,
  getComponentById as getComponentByIdService,
  addComponent,
  updateComponent as updateComponentService,
  deleteComponent as deleteComponentService,
} from "../services/inventoryService.js";

// ─── Shared field validator ───────────────────────────────────────────────────
const validateComponentFields = ({ component_name, category, total_quantity, available_quantity }) => {
  const errors = [];
 
  if (!component_name || !component_name.trim()) {
    errors.push("Component name is required.");
  }
  if (!category || !category.trim()) {
    errors.push("Category is required.");
  }
  if (total_quantity === undefined || total_quantity === null || total_quantity === "") {
    errors.push("Total quantity is required.");
  } else if (isNaN(total_quantity) || Number(total_quantity) < 0) {
    errors.push("Total quantity must be a non-negative number.");
  }
  if (available_quantity === undefined || available_quantity === null || available_quantity === "") {
    errors.push("Available quantity is required.");
  } else if (isNaN(available_quantity) || Number(available_quantity) < 0) {
    errors.push("Available quantity must be a non-negative number.");
  }
  if (
    !isNaN(total_quantity) &&
    !isNaN(available_quantity) &&
    Number(available_quantity) > Number(total_quantity)
  ) {
    errors.push("Available quantity cannot exceed total quantity.");
  }
 
  return errors;
};
 
// ─── GET ALL ─────────────────────────────────────────────────────────────────
export const fetchComponents = async (req, res) => {
  try {
    const data = await getAllComponents();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Inventory Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch inventory",
    });
  }
};
// ─── GET ONE ─────────────────────────────────────────────────────────────────
export const fetchComponentById = async (req, res) => {
  try {
    const component = await getComponentByIdService(req.params.id);

    if (!component) {
      return res.status(404).json({
        success: false,
        message: "Component not found",
      });
    }

    res.status(200).json({
      success: true,
      data: component,
    });
  } catch (error) {
    console.error("getComponentById error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch component",
    });
  }
};

// ─── CREATE ──────────────────────────────────────────────────────────────────
export const createComponent = async (req, res) => {
  try {
    const { component_name, category, description, total_quantity, available_quantity } = req.body;
 
    const errors = validateComponentFields({ component_name, category, total_quantity, available_quantity });
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: errors.join(" ") });
    }
 
    const newComponent = await addComponent({
      component_name,
      category,
      description,
      total_quantity,
      available_quantity,
    });
 
    res.status(201).json({
      success: true,
      message: "Component added successfully.",
      data: newComponent,
    });
  } catch (error) {
    console.error("createComponent error:", error);
    res.status(500).json({ success: false, message: "Failed to create component." });
  }
};
 
// ─── UPDATE ──────────────────────────────────────────────────────────────────
export const updateComponent = async (req, res) => {
  try {
    const { id } = req.params;
    const { component_name, category, description, total_quantity, available_quantity } = req.body;
 
    const errors = validateComponentFields({ component_name, category, total_quantity, available_quantity });
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: errors.join(" ") });
    }
 
    const updated = await updateComponentService(id, {
      component_name,
      category,
      description,
      total_quantity,
      available_quantity,
    });
 
    if (!updated) {
      return res.status(404).json({ success: false, message: "Component not found." });
    }
 
    res.status(200).json({
      success: true,
      message: "Component updated successfully.",
      data: updated,
    });
  } catch (error) {
    console.error("updateComponent error:", error);
    res.status(500).json({ success: false, message: "Failed to update component." });
  }
};
 
// ─── DELETE ──────────────────────────────────────────────────────────────────
export const deleteComponent = async (req, res) => {
  try {
    const { id } = req.params;
 
    const deleted = await deleteComponentService(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Component not found." });
    }
 
    res.status(200).json({
      success: true,
      message: "Component deleted successfully.",
      data: deleted,
    });
  } catch (error) {
    console.error("deleteComponent error:", error);
    res.status(500).json({ success: false, message: "Failed to delete component." });
  }
};
 