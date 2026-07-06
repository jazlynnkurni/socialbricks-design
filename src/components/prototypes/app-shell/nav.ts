import {
  BarChart3,
  FileText,
  Files,
  LayoutDashboard,
  MessageSquare,
  ScrollText,
  UserCog,
  Users,
  type LucideIcon,
} from "lucide-react";

export const APP_SHELL_PATH = "/prototypes/app-shell";
export const APPLICATIONS_PATH = `${APP_SHELL_PATH}/applications`;
export const PEOPLE_PATH = `${APP_SHELL_PATH}/people`;
export const DOCUMENTS_PATH = `${APP_SHELL_PATH}/documents`;
export const COMMUNICATIONS_PATH = `${APP_SHELL_PATH}/communications`;

export interface NavEntry {
  id: string;
  label: string;
  icon: LucideIcon;
  /** Real route for this item. Items without one are placeholder buttons. */
  href?: string;
}

export interface NavSection {
  label?: string;
  items: NavEntry[];
  /** Rarely-used group, rendered slightly muted but fully accessible. */
  deemphasized?: boolean;
}

// Three labeled groups. Intake, Eligibility, Awards, and Criteria were
// removed from the sidebar: they become case-detail tabs in a later
// prototype. The old Intake concept is now Documents.
export const NAV_SECTIONS: NavSection[] = [
  {
    label: "Daily work",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        href: APP_SHELL_PATH,
      },
      { id: "people", label: "People", icon: Users, href: PEOPLE_PATH },
    ],
  },
  {
    label: "Case work",
    items: [
      {
        id: "applications",
        label: "Applications",
        icon: FileText,
        href: APPLICATIONS_PATH,
      },
      {
        id: "documents",
        label: "Documents",
        icon: Files,
        href: DOCUMENTS_PATH,
      },
      {
        id: "communications",
        label: "Communications",
        icon: MessageSquare,
        href: COMMUNICATIONS_PATH,
      },
    ],
  },
  {
    label: "Admin",
    deemphasized: true,
    items: [
      { id: "reporting", label: "Reporting", icon: BarChart3 },
      { id: "audit-log", label: "Audit log", icon: ScrollText },
      { id: "user-roles", label: "User roles", icon: UserCog },
    ],
  },
];
