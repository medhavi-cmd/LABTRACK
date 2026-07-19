import { colors } from "./colors";

export const tokens = {
  background: {
    page: "bg-transparent", // page bg is already on body
    card: "bg-white",
    hover: "hover:bg-slate-50",
    active: "active:bg-slate-100",
    tableRowHover: "hover:bg-slate-50",
    tableHeader: "bg-slate-50",
    input: "bg-white",
  },
  text: {
    primary: "text-slate-900",
    secondary: "text-slate-500",
    tertiary: "text-slate-400",
    accent: "text-cyan-600",
    inverse: "text-white",
    success: "text-green-600",
    warning: "text-amber-600",
    error: "text-red-600",
  },
  border: {
    default: "border-slate-200",
    hover: "hover:border-slate-300",
    focus: "focus:border-cyan-500",
    card: "border-slate-200",
    divider: "border-slate-200",
  },
  shadow: {
    card: "shadow-sm",
    hover: "hover:shadow-md",
  },
  radius: {
    card: "rounded-xl",
    input: "rounded-lg",
    button: "rounded-lg",
    badge: "rounded-full",
  },
};
