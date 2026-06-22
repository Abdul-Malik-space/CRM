import { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Activity,
  BarChart3,
  BellRing,
  BookOpenText,
  Bot,
  BriefcaseBusiness,
  CalendarDays,
  CalendarClock,
  ChevronRight,
  ClipboardList,
  CreditCard,
  FileText,
  FolderKanban,
  Handshake,
  LayoutDashboard,
  LifeBuoy,
  MessageSquareText,
  PackageCheck,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  UsersRound,
  WalletCards,
  X,
} from "lucide-react";

const pageThemes = {
  dashboard: {
    accent: "#2563eb",
    accent2: "#4f46e5",
    soft: "rgba(37, 99, 235, 0.10)",
    glow: "rgba(37, 99, 235, 0.20)",
    pageBg: "#f1f5ff",
  },
  leads: {
    accent: "#e11d48",
    accent2: "#f97316",
    soft: "rgba(225, 29, 72, 0.10)",
    glow: "rgba(225, 29, 72, 0.18)",
    pageBg: "#fff1f2",
  },
  customers: {
    accent: "#059669",
    accent2: "#0d9488",
    soft: "rgba(5, 150, 105, 0.10)",
    glow: "rgba(5, 150, 105, 0.18)",
    pageBg: "#ecfdf5",
  },
  followups: {
    accent: "#7c3aed",
    accent2: "#2563eb",
    soft: "rgba(124, 58, 237, 0.10)",
    glow: "rgba(124, 58, 237, 0.18)",
    pageBg: "#f5f3ff",
  },
  deals: {
    accent: "#d97706",
    accent2: "#ea580c",
    soft: "rgba(217, 119, 6, 0.12)",
    glow: "rgba(217, 119, 6, 0.18)",
    pageBg: "#fffbeb",
  },
  proposals: {
    accent: "#9333ea",
    accent2: "#db2777",
    soft: "rgba(147, 51, 234, 0.10)",
    glow: "rgba(147, 51, 234, 0.18)",
    pageBg: "#faf5ff",
  },
  payments: {
    accent: "#0891b2",
    accent2: "#2563eb",
    soft: "rgba(8, 145, 178, 0.10)",
    glow: "rgba(8, 145, 178, 0.18)",
    pageBg: "#ecfeff",
  },
  ledger: {
    accent: "#0f766e",
    accent2: "#14b8a6",
    soft: "rgba(15, 118, 110, 0.10)",
    glow: "rgba(15, 118, 110, 0.18)",
    pageBg: "#f0fdfa",
  },
  projects: {
    accent: "#0f766e",
    accent2: "#059669",
    soft: "rgba(15, 118, 110, 0.10)",
    glow: "rgba(15, 118, 110, 0.18)",
    pageBg: "#f0fdfa",
  },
  tasks: {
    accent: "#2563eb",
    accent2: "#0891b2",
    soft: "rgba(37, 99, 235, 0.10)",
    glow: "rgba(37, 99, 235, 0.18)",
    pageBg: "#eff6ff",
  },
  calendar: {
    accent: "#ea580c",
    accent2: "#f59e0b",
    soft: "rgba(234, 88, 12, 0.10)",
    glow: "rgba(234, 88, 12, 0.18)",
    pageBg: "#fff7ed",
  },
  documents: {
    accent: "#475569",
    accent2: "#0f172a",
    soft: "rgba(71, 85, 105, 0.10)",
    glow: "rgba(71, 85, 105, 0.16)",
    pageBg: "#f8fafc",
  },
  services: {
    accent: "#16a34a",
    accent2: "#059669",
    soft: "rgba(22, 163, 74, 0.10)",
    glow: "rgba(22, 163, 74, 0.18)",
    pageBg: "#f0fdf4",
  },
  communications: {
    accent: "#0284c7",
    accent2: "#4f46e5",
    soft: "rgba(2, 132, 199, 0.10)",
    glow: "rgba(2, 132, 199, 0.18)",
    pageBg: "#f0f9ff",
  },
  reports: {
    accent: "#059669",
    accent2: "#2563eb",
    soft: "rgba(5, 150, 105, 0.10)",
    glow: "rgba(5, 150, 105, 0.18)",
    pageBg: "#f0fdf4",
  },
  team: {
    accent: "#4f46e5",
    accent2: "#2563eb",
    soft: "rgba(79, 70, 229, 0.10)",
    glow: "rgba(79, 70, 229, 0.18)",
    pageBg: "#eef2ff",
  },
  automations: {
    accent: "#db2777",
    accent2: "#7c3aed",
    soft: "rgba(219, 39, 119, 0.10)",
    glow: "rgba(219, 39, 119, 0.18)",
    pageBg: "#fdf2f8",
  },
  notifications: {
    accent: "#e11d48",
    accent2: "#f97316",
    soft: "rgba(225, 29, 72, 0.10)",
    glow: "rgba(225, 29, 72, 0.18)",
    pageBg: "#fff1f2",
  },
  activityLogs: {
    accent: "#64748b",
    accent2: "#334155",
    soft: "rgba(100, 116, 139, 0.10)",
    glow: "rgba(100, 116, 139, 0.16)",
    pageBg: "#f8fafc",
  },
  settings: {
    accent: "#0f172a",
    accent2: "#475569",
    soft: "rgba(15, 23, 42, 0.08)",
    glow: "rgba(15, 23, 42, 0.14)",
    pageBg: "#f8fafc",
  },
};

const menuSections = [
  {
    title: "Main",
    items: [
      {
        key: "dashboard",
        name: "Dashboard",
        path: "/",
        icon: LayoutDashboard,
        badge: null,
        description: "CRM overview",
        theme: pageThemes.dashboard,
      },
      {
        key: "leads",
        name: "Leads",
        path: "/leads",
        icon: Handshake,
        badge: "12",
        description: "New inquiries",
        theme: pageThemes.leads,
      },
      {
        key: "customers",
        name: "Customers",
        path: "/customers",
        icon: UsersRound,
        badge: null,
        description: "Confirmed clients",
        theme: pageThemes.customers,
      },
      {
        key: "followups",
        name: "Follow-ups",
        path: "/follow-ups",
        icon: CalendarClock,
        badge: "4",
        description: "Today actions",
        theme: pageThemes.followups,
      },
    ],
  },
  {
    title: "Sales",
    items: [
      {
        key: "deals",
        name: "Deals",
        path: "/deals",
        icon: BriefcaseBusiness,
        badge: null,
        description: "Sales pipeline",
        theme: pageThemes.deals,
      },
      {
        key: "proposals",
        name: "Proposals",
        path: "/proposals",
        icon: FileText,
        badge: null,
        description: "Quotes and offers",
        theme: pageThemes.proposals,
      },
      {
        key: "payments",
        name: "Payments",
        path: "/payments",
        icon: CreditCard,
        badge: null,
        description: "Invoices and dues",
        theme: pageThemes.payments,
      },
      {
        key: "ledger",
        name: "Ledger",
        path: "/ledger",
        icon: WalletCards,
        badge: null,
        description: "Accounts history",
        theme: pageThemes.ledger,
      },
    ],
  },
  {
    title: "Work",
    items: [
      {
        key: "projects",
        name: "Projects",
        path: "/projects",
        icon: FolderKanban,
        badge: null,
        description: "Delivery tracking",
        theme: pageThemes.projects,
      },
      {
        key: "tasks",
        name: "Tasks",
        path: "/tasks",
        icon: ClipboardList,
        badge: "6",
        description: "Team workload",
        theme: pageThemes.tasks,
      },
      {
        key: "calendar",
        name: "Calendar",
        path: "/calendar",
        icon: CalendarDays,
        badge: null,
        description: "Schedule view",
        theme: pageThemes.calendar,
      },
      {
        key: "documents",
        name: "Documents",
        path: "/documents",
        icon: BookOpenText,
        badge: null,
        description: "Files and records",
        theme: pageThemes.documents,
      },
    ],
  },
  {
    title: "Business",
    items: [
      {
        key: "services",
        name: "Services",
        path: "/services",
        icon: PackageCheck,
        badge: null,
        description: "Service catalog",
        theme: pageThemes.services,
      },
      {
        key: "communications",
        name: "Communications",
        path: "/communications",
        icon: MessageSquareText,
        badge: null,
        description: "Client messages",
        theme: pageThemes.communications,
      },
      {
        key: "reports",
        name: "Reports",
        path: "/reports",
        icon: BarChart3,
        badge: null,
        description: "Analytics",
        theme: pageThemes.reports,
      },
    ],
  },
  {
    title: "Admin",
    items: [
      {
        key: "team",
        name: "Team",
        path: "/team",
        icon: ShieldCheck,
        badge: null,
        description: "Users and roles",
        theme: pageThemes.team,
      },
      {
        key: "automations",
        name: "Automations",
        path: "/automations",
        icon: Bot,
        badge: null,
        description: "Workflow rules",
        theme: pageThemes.automations,
      },
      {
        key: "notifications",
        name: "Notifications",
        path: "/notifications",
        icon: BellRing,
        badge: "2",
        description: "CRM alerts",
        theme: pageThemes.notifications,
      },
      {
        key: "activityLogs",
        name: "Activity Logs",
        path: "/activity-logs",
        icon: Activity,
        badge: null,
        description: "System history",
        theme: pageThemes.activityLogs,
      },
      {
        key: "settings",
        name: "Settings",
        path: "/settings",
        icon: Settings,
        badge: null,
        description: "CRM controls",
        theme: pageThemes.settings,
      },
    ],
  },
];

function SidebarLink({ item }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      end={item.path === "/"}
      className="group relative flex items-center justify-between gap-3 rounded-2xl border px-3.5 py-3 text-sm font-semibold transition-all duration-300"
      style={({ isActive }) => ({
        color: isActive ? item.theme.accent : "#475569",
        borderColor: isActive ? `${item.theme.accent}33` : "transparent",
        background: isActive
          ? `linear-gradient(135deg, ${item.theme.soft}, rgba(255,255,255,0.96))`
          : "transparent",
        boxShadow: isActive ? `0 14px 30px ${item.theme.glow}` : "none",
      })}
    >
      {({ isActive }) => (
        <>
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-105"
              style={{
                background: isActive
                  ? `linear-gradient(135deg, ${item.theme.accent}, ${item.theme.accent2})`
                  : "#f1f5f9",
                color: isActive ? "#ffffff" : "#64748b",
                boxShadow: isActive ? `0 10px 22px ${item.theme.glow}` : "none",
              }}
            >
              <Icon className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <p className="truncate">{item.name}</p>
              <p
                className="mt-0.5 truncate text-[11px] font-medium"
                style={{
                  color: isActive ? "#334155" : "#94a3b8",
                }}
              >
                {item.description}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {item.badge && (
              <span
                className="flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-[11px] font-bold text-white shadow-md"
                style={{
                  background: `linear-gradient(135deg, ${item.theme.accent}, ${item.theme.accent2})`,
                  boxShadow: `0 8px 16px ${item.theme.glow}`,
                }}
              >
                {item.badge}
              </span>
            )}

            <ChevronRight
              className={`h-4 w-4 transition-all duration-300 ${
                isActive
                  ? "text-slate-600"
                  : "text-slate-300 group-hover:translate-x-0.5 group-hover:text-slate-600"
              }`}
            />
          </div>

          {isActive && (
            <span
              className="absolute -left-4 top-1/2 h-9 w-1 -translate-y-1/2 rounded-r-full"
              style={{
                background: `linear-gradient(to bottom, ${item.theme.accent}, ${item.theme.accent2})`,
                boxShadow: `0 0 18px ${item.theme.glow}`,
              }}
            />
          )}
        </>
      )}
    </NavLink>
  );
}

function Sidebar({ isOpen, closeSidebar }) {
  const location = useLocation();
  const [search, setSearch] = useState("");

  const allMenuItems = useMemo(() => {
    return menuSections.flatMap((section) => section.items);
  }, []);

  const activeItem =
    allMenuItems.find((item) =>
      item.path === "/"
        ? location.pathname === "/"
        : location.pathname.startsWith(item.path)
    ) || allMenuItems[0];

  const activeTheme = activeItem.theme;
  const ActiveIcon = activeItem.icon;

  const filteredSections = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    if (!searchValue) {
      return menuSections;
    }

    return menuSections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => {
          return (
            item.name.toLowerCase().includes(searchValue) ||
            item.description.toLowerCase().includes(searchValue) ||
            section.title.toLowerCase().includes(searchValue)
          );
        }),
      }))
      .filter((section) => section.items.length > 0);
  }, [search]);

  useEffect(() => {
    document.documentElement.style.setProperty("--crm-accent", activeTheme.accent);
    document.documentElement.style.setProperty("--crm-accent-2", activeTheme.accent2);
    document.documentElement.style.setProperty("--crm-page-bg", activeTheme.pageBg);
    document.documentElement.style.setProperty("--crm-page-glow", activeTheme.glow);
  }, [activeTheme]);

  return (
    <>
      {isOpen && (
        <button
          onClick={closeSidebar}
          className="fixed inset-0 z-30 bg-slate-950/35 backdrop-blur-sm lg:hidden"
          aria-label="Close sidebar overlay"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-40 h-screen overflow-hidden border-r border-slate-200/80 text-slate-900 shadow-xl shadow-slate-200/70 transition-all duration-300 lg:sticky lg:top-0 lg:w-full lg:translate-x-0 ${
          isOpen
            ? "w-80 translate-x-0"
            : "w-0 -translate-x-full lg:w-full lg:translate-x-0"
        }`}
        style={{
          background: `radial-gradient(circle at top left, ${activeTheme.soft}, transparent 34%),
                       linear-gradient(180deg, #ffffff 0%, #f8fafc 50%, #eef2ff 100%)`,
        }}
      >
        <div className="flex h-full w-80 flex-col lg:w-full">
          <div className="border-b border-slate-200/80 p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${activeTheme.accent}, ${activeTheme.accent2})`,
                    boxShadow: `0 14px 30px ${activeTheme.glow}`,
                  }}
                >
                  <Sparkles className="h-6 w-6" />
                </div>

                <div className="min-w-0">
                  <h1 className="truncate text-2xl font-extrabold tracking-tight text-slate-950">
                    M.CRM
                  </h1>
                  <p className="mt-0.5 truncate text-xs font-medium text-slate-500">
                    Sales & Lead Management
                  </p>
                </div>
              </div>

              <button
                onClick={closeSidebar}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
                aria-label="Close sidebar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div
              className="mt-5 rounded-2xl border p-3 shadow-sm"
              style={{
                background: activeTheme.soft,
                borderColor: `${activeTheme.accent}33`,
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${activeTheme.accent}, ${activeTheme.accent2})`,
                    boxShadow: `0 10px 22px ${activeTheme.glow}`,
                  }}
                >
                  <ActiveIcon className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-950">
                    {activeItem.name}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {activeItem.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm transition focus-within:border-slate-300">
              <Search className="h-4 w-4 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search menu..."
                className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-5">
            <nav className="space-y-6">
              {filteredSections.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-center">
                  <Search className="mx-auto h-6 w-6 text-slate-300" />
                  <p className="mt-2 text-sm font-semibold text-slate-400">
                    No menu found
                  </p>
                </div>
              ) : (
                filteredSections.map((section) => (
                  <div key={section.title}>
                    <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                      {section.title}
                    </p>

                    <div className="space-y-1.5">
                      {section.items.map((item) => (
                        <SidebarLink key={item.path} item={item} />
                      ))}
                    </div>
                  </div>
                ))
              )}
            </nav>

            <div
              className="mt-6 rounded-3xl border p-4 shadow-sm"
              style={{
                background: activeTheme.soft,
                borderColor: `${activeTheme.accent}33`,
              }}
            >
              <div
                className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${activeTheme.accent}, ${activeTheme.accent2})`,
                  boxShadow: `0 10px 22px ${activeTheme.glow}`,
                }}
              >
                <WalletCards className="h-5 w-5" />
              </div>

              <h3 className="text-sm font-bold text-slate-950">
                Business Control Center
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Track leads, deals, customers, follow-ups, tasks, reports, and
                payments from one CRM workspace.
              </p>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="rounded-xl border border-white/70 bg-white/70 p-2 text-center shadow-sm">
                  <p className="text-sm font-bold text-slate-950">12</p>
                  <p className="text-[10px] text-slate-500">Leads</p>
                </div>

                <div className="rounded-xl border border-white/70 bg-white/70 p-2 text-center shadow-sm">
                  <p className="text-sm font-bold text-slate-950">4</p>
                  <p className="text-[10px] text-slate-500">Due</p>
                </div>

                <div className="rounded-xl border border-white/70 bg-white/70 p-2 text-center shadow-sm">
                  <p className="text-sm font-bold text-slate-950">6</p>
                  <p className="text-[10px] text-slate-500">Tasks</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200/80 p-4">
            <div className="mb-3 grid grid-cols-2 gap-2">
              <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-950">
                <LifeBuoy className="h-4 w-4" />
                Help
              </button>

              <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-950">
                <BellRing className="h-4 w-4" />
                Alerts
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-extrabold text-white"
                  style={{
                    background: `linear-gradient(135deg, ${activeTheme.accent}, ${activeTheme.accent2})`,
                  }}
                >
                  AD
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-slate-950">
                    Admin User
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    CRM Administrator
                  </p>
                </div>

                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{
                    background: activeTheme.soft,
                    color: activeTheme.accent,
                  }}
                >
                  <ShieldCheck className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;