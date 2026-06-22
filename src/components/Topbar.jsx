import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  LayoutDashboard,
  Menu,
  Moon,
  Search,
  Settings,
  Sun,
  UserRound,
  UsersRound,
  X,
  BriefcaseBusiness,
  ClipboardList,
  FileBarChart,
  Handshake,
  CalendarClock,
  LogOut,
} from "lucide-react";

const pageInfo = {
  "/": {
    title: "CRM Dashboard",
    subtitle: "Overview of your CRM activity",
    icon: LayoutDashboard,
  },
  "/leads": {
    title: "Leads Management",
    subtitle: "Manage new inquiries and potential clients",
    icon: Handshake,
  },
  "/customers": {
    title: "Customers Management",
    subtitle: "Manage confirmed clients",
    icon: UsersRound,
  },
  "/follow-ups": {
    title: "Follow-ups",
    subtitle: "Manage calls, WhatsApp, emails and meetings",
    icon: CalendarClock,
  },
  "/deals": {
    title: "Deals Pipeline",
    subtitle: "Track sales opportunities",
    icon: BriefcaseBusiness,
  },
  "/tasks": {
    title: "Tasks",
    subtitle: "Manage team tasks",
    icon: ClipboardList,
  },
  "/reports": {
    title: "Reports",
    subtitle: "Analyze performance",
    icon: FileBarChart,
  },
  "/settings": {
    title: "Settings",
    subtitle: "Manage CRM settings",
    icon: Settings,
  },
};

const searchablePages = Object.entries(pageInfo).map(([path, item]) => ({
  path,
  title: item.title,
  subtitle: item.subtitle,
  Icon: item.icon,
}));

const notifications = [
  {
    id: 1,
    title: "New lead assigned",
    message: "A new website design lead has been added.",
    time: "5 min ago",
    type: "info",
    unread: true,
  },
  {
    id: 2,
    title: "Payment follow-up due",
    message: "One customer payment follow-up is pending today.",
    time: "28 min ago",
    type: "warning",
    unread: true,
  },
  {
    id: 3,
    title: "Deal status updated",
    message: "A deal has been moved to the negotiation stage.",
    time: "1 hour ago",
    type: "success",
    unread: false,
  },
];

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function Topbar({ toggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();

  const currentPage = pageInfo[location.pathname] || pageInfo["/"];
  const CurrentPageIcon = currentPage.icon;

  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("crm-theme");

    if (savedTheme) {
      return savedTheme;
    }

    const prefersDark = window.matchMedia?.(
      "(prefers-color-scheme: dark)"
    ).matches;

    return prefersDark ? "dark" : "light";
  });

  const [searchValue, setSearchValue] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const user = {
    name: "Admin User",
    role: "CRM Manager",
    email: "admin@example.com",
  };

  const unreadCount = notifications.filter(
    (notification) => notification.unread
  ).length;

  const filteredPages = useMemo(() => {
    const value = searchValue.toLowerCase().trim();

    if (!value) {
      return searchablePages;
    }

    return searchablePages.filter((page) => {
      return (
        page.title.toLowerCase().includes(value) ||
        page.subtitle.toLowerCase().includes(value) ||
        page.path.toLowerCase().includes(value)
      );
    });
  }, [searchValue]);

  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("crm-theme", theme);
  }, [theme]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }

      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }

      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setSearchOpen(false);
        setNotificationsOpen(false);
        setProfileOpen(false);
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function toggleTheme() {
    setTheme((currentTheme) =>
      currentTheme === "dark" ? "light" : "dark"
    );
  }

  function handlePageSelect(path) {
    navigate(path);
    setSearchValue("");
    setSearchOpen(false);
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 px-5 py-4 shadow-sm backdrop-blur-xl transition dark:border-slate-800 dark:bg-slate-950/90">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-800 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex min-w-0 items-center gap-3">
            <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white dark:bg-white dark:text-slate-950 md:flex">
              <CurrentPageIcon className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-xl font-extrabold text-slate-950 dark:text-white">
                {currentPage.title}
              </h2>
              <p className="hidden truncate text-sm text-slate-500 dark:text-slate-400 md:block">
                {currentPage.subtitle}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div ref={searchRef} className="relative hidden lg:block">
            <div className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 text-slate-700 transition focus-within:border-slate-400 focus-within:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:focus-within:border-slate-600 dark:focus-within:bg-slate-950">
              <Search className="h-4 w-4 text-slate-400" />

              <input
                type="text"
                placeholder="Search CRM..."
                value={searchValue}
                onFocus={() => setSearchOpen(true)}
                onChange={(event) => {
                  setSearchValue(event.target.value);
                  setSearchOpen(true);
                }}
                className="w-64 bg-transparent text-sm outline-none placeholder:text-slate-400"
              />

              <span className="rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500">
                Ctrl K
              </span>
            </div>

            {searchOpen && (
              <div className="absolute right-0 mt-3 w-[360px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-950">
                <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Quick Navigation
                  </p>
                </div>

                <div className="max-h-80 overflow-y-auto p-2">
                  {filteredPages.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <Search className="mx-auto h-6 w-6 text-slate-300" />
                      <p className="mt-2 text-sm font-medium text-slate-500">
                        No results found
                      </p>
                    </div>
                  ) : (
                    filteredPages.map((page) => {
                      const Icon = page.Icon;

                      return (
                        <button
                          key={page.path}
                          onClick={() => handlePageSelect(page.path)}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-slate-50 dark:hover:bg-slate-900"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                            <Icon className="h-4 w-4" />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                              {page.title}
                            </p>
                            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                              {page.subtitle}
                            </p>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setSearchOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Open search"
          >
            <Search className="h-5 w-5" />
          </button>

          <button
            onClick={toggleTheme}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            aria-label="Toggle theme"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          <div ref={notificationRef} className="relative">
            <button
              onClick={() => {
                setNotificationsOpen((value) => !value);
                setProfileOpen(false);
              }}
              className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              aria-label="Open notifications"
            >
              <Bell className="h-5 w-5" />

              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1.5 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-950">
                  {unreadCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-3 w-[360px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-950">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                  <div>
                    <h3 className="text-sm font-bold text-slate-950 dark:text-white">
                      Notifications
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {unreadCount} unread notifications
                    </p>
                  </div>

                  <button
                    onClick={() => setNotificationsOpen(false)}
                    className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-900 dark:hover:text-slate-200"
                    aria-label="Close notifications"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="max-h-96 overflow-y-auto p-2">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="flex gap-3 rounded-xl px-3 py-3 transition hover:bg-slate-50 dark:hover:bg-slate-900"
                    >
                      <div
                        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                          notification.type === "success"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                            : notification.type === "warning"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                        }`}
                      >
                        {notification.type === "success" ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : notification.type === "warning" ? (
                          <CircleAlert className="h-4 w-4" />
                        ) : (
                          <Bell className="h-4 w-4" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {notification.title}
                          </p>

                          {notification.unread && (
                            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                          )}
                        </div>

                        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                          {notification.message}
                        </p>

                        <p className="mt-1 text-[11px] font-medium text-slate-400">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-100 p-3 dark:border-slate-800">
                  <button className="w-full rounded-xl bg-slate-950 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          <div ref={profileRef} className="relative">
            <button
              onClick={() => {
                setProfileOpen((value) => !value);
                setNotificationsOpen(false);
              }}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-1.5 pr-3 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
              aria-label="Open profile menu"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white dark:bg-white dark:text-slate-950">
                {getInitials(user.name)}
              </div>

              <div className="hidden text-left xl:block">
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {user.name}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {user.role}
                </p>
              </div>

              <ChevronDown className="hidden h-4 w-4 text-slate-400 xl:block" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-3 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-950">
                <div className="border-b border-slate-100 p-4 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white dark:bg-white dark:text-slate-950">
                      {getInitials(user.name)}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-950 dark:text-white">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-900">
                    <UserRound className="h-4 w-4" />
                    My Profile
                  </button>

                  <button
                    onClick={() => {
                      navigate("/settings");
                      setProfileOpen(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-900"
                  >
                    <Settings className="h-4 w-4" />
                    Account Settings
                  </button>

                  <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {searchOpen && (
        <div
          ref={searchRef}
          className="mt-4 block rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-950 lg:hidden"
        >
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-900">
            <Search className="h-4 w-4 text-slate-400" />

            <input
              type="text"
              placeholder="Search CRM..."
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
              autoFocus
            />

            <button
              onClick={() => {
                setSearchOpen(false);
                setSearchValue("");
              }}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              aria-label="Close search"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-2 max-h-72 overflow-y-auto">
            {filteredPages.map((page) => {
              const Icon = page.Icon;

              return (
                <button
                  key={page.path}
                  onClick={() => handlePageSelect(page.path)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-900"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                    <Icon className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {page.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {page.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}

export default Topbar;