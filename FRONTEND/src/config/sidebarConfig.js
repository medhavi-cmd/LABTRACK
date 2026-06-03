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
  groupLeader: [
    {
      label: "Dashboard",
      path: "/group-leader/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Team Management",
      path: "/group-leader/team-management",
      icon: Users,
    },
    {
      label: "Project Tracking",
      path: "/group-leader/projects",
      icon: FolderKanban,
    },
    {
      label: "Inventory Management",
      path: "/group-leader/inventory",
      icon: Package,
    },
    {
      label: "Project Gallery",
      path: "/group-leader/gallery",
      icon: Images,
    },
    {
      label: "Settings",
      path: "/group-leader/settings",
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