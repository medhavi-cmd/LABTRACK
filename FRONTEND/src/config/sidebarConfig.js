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
    path: "/student/student-dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Team Management",
    path: "/student/team-management",
    icon: Users,
  },
  {
    label: "Component Inventory",
    path: "/student/component-inventory",
    icon: Package,
  },
  {
    label: "Issue History",
    path: "/student/issue-history",
    icon: FolderKanban,
  },
  {
    label: "New Requests",
    path: "/student/new-request",
    icon: ClipboardList,
  },
  {
    label: "Project Gallery",
    path: "/student/gallery",
    icon: Images,
  },
  {
    label: "Settings",
    path: "/student/settings",
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
      label: "Project Approvals",
      path: "/faculty/project-approvals",
      icon: ClipboardList,
    },
    {
      label: "Component Requests",
      path: "/faculty/component-requests",
      icon: Package,
    },
    {
      label: "Events",
      path: "/faculty/events",
      icon: FolderKanban,
    },
    {
      label: "Notifications",
      path: "/faculty/notifications",
      icon: ClipboardList,
    },
    {
      label: "Gallery Approvals",
      path: "/faculty/gallery-approvals",
      icon: Images,
    },
    {
      label: "Student Progress",
      path: "/faculty/student-progress",
      icon: Users,
    },
  ],

  labStaff: [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/lab-staff/dashboard"
    },
    {
      label: "Inventory Management",
      icon: Package,
      path: "/lab-staff/inventory"
    },
    {
      label: "Component Requests",
      icon: ClipboardList,
      path: "/lab-staff/requests"
    },
    {
      label: "Issued Components",
      icon: FolderKanban,
      path: "/lab-staff/issued"
    },
    {
      label: "Return Management",
      icon: Users,
      path: "/lab-staff/returns"
    },
    {
      label: "Damage Components",
      icon: Images,
      path: "/lab-staff/damage"
    },
    {
      label: "Component Demand",
      icon: FolderKanban,
      path: "/lab-staff/demand"
    },
    {
      label: "Notifications",
      icon: ClipboardList,
      path: "/lab-staff/notifications"
    },
    {
      label: "Settings",
      icon: Settings,
      path: "/lab-staff/settings"
    },
  ],
};
