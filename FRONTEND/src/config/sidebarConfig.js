// src/config/sidebarConfig.js

import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Package,
  Images,
  Settings,
  FlaskConical,
  ClipboardList,
} from "lucide-react";

export const SIDEBAR_CONFIG = {
//   Dashboard
// Team Management
// Component Inventory
// Issue History
// New Requests

// ----------------
//  Settings
// Logout

  groupLeader: [
    {
      label: "Dashboard",
      path: "/Student/Dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Team Management",
      path: "/Student/Team-Management",
      icon: Users,
    },
    {
      label: "Component Inventory",
      path: "/Student/Component-Inventory",
      icon: Package,
    },
    {
      label: "Issue History",
      path: "/Student/Issue-History",
      icon: FolderKanban,
    },
    {
      label: "New Requests",
      path: "/Student/New-Requests",
      icon: ClipboardList,
    },
    {
      label: "Project Gallery",
      path: "/Student/gallery",
      icon: Images,
    },
    {
      label: "Settings",
      path: "/Student/settings",
      icon: Settings,
    },
  ],

  faculty: [
    {
      label: "Dashboard",
      path: "/faculty/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Research Groups",
      path: "/faculty/groups",
      icon: Users,
    },
    {
      label: "Projects",
      path: "/faculty/projects",
      icon: ClipboardList,
    },
    {
      label: "Labs",
      path: "/faculty/labs",
      icon: FlaskConical,
    },
    {
      label: "Settings",
      path: "/faculty/settings",
      icon: Settings,
    },
  ],

  labStaff: [
    {
      label: "Dashboard",
      path: "/staff/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Inventory",
      path: "/staff/inventory",
      icon: Package,
    },
    {
      label: "Equipment",
      path: "/staff/equipment",
      icon: FlaskConical,
    },
    {
      label: "Settings",
      path: "/staff/settings",
      icon: Settings,
    },
  ],
};