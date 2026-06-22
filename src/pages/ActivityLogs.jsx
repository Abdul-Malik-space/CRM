import { useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  Archive,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Database,
  Download,
  Edit3,
  Eye,
  FileText,
  Filter,
  Globe2,
  History,
  Info,
  Laptop,
  LockKeyhole,
  MoreHorizontal,
  RefreshCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Trash2,
  UserCheck,
  Users,
  X,
} from "lucide-react";

const modules = [
  "All",
  "Leads",
  "Customers",
  "Deals",
  "Proposals",
  "Payments",
  "Projects",
  "Tasks",
  "Documents",
  "Services",
  "Communications",
  "Team",
  "Automations",
  "Notifications",
  "Settings",
  "Security",
];

const actionTypes = [
  "All",
  "Created",
  "Updated",
  "Deleted",
  "Viewed",
  "Exported",
  "Imported",
  "Assigned",
  "Status Changed",
  "Login",
  "Logout",
  "Permission Changed",
  "Automation Run",
  "File Downloaded",
  "Failed Attempt",
];

const riskLevels = ["All", "Low", "Medium", "High", "Critical"];

const users = [
  "All",
  "Admin User",
  "Ahsan Ali",
  "Sara Khan",
  "Bilal Ahmed",
  "Malik Khan",
  "Support Team",
  "System Bot",
];

const sources = [
  "All",
  "Web App",
  "Mobile App",
  "API",
  "Automation",
  "Import Tool",
  "Security Monitor",
];

const statuses = ["All", "Success", "Failed", "Warning"];

const demoLogs = [
  {
    id: "LOG-1001",
    timestamp: "2026-06-19T10:20:00",
    user: "Ahsan Ali",
    userRole: "Sales Manager",
    module: "Leads",
    actionType: "Created",
    status: "Success",
    riskLevel: "Low",
    recordId: "LED-2041",
    recordName: "ABC School Website Lead",
    fieldName: "Lead Source",
    oldValue: "",
    newValue: "Website Form",
    ipAddress: "103.155.44.21",
    device: "Chrome on Windows",
    source: "Web App",
    location: "Lahore, PK",
    description: "Created a new lead from website form inquiry.",
    metadata: "Lead assigned to Sales Team automatically.",
  },
  {
    id: "LOG-1002",
    timestamp: "2026-06-19T10:35:00",
    user: "Admin User",
    userRole: "CRM Administrator",
    module: "Payments",
    actionType: "Updated",
    status: "Success",
    riskLevel: "Medium",
    recordId: "PAY-8812",
    recordName: "Khan Traders Invoice",
    fieldName: "Payment Status",
    oldValue: "Pending",
    newValue: "Overdue",
    ipAddress: "103.155.44.22",
    device: "Chrome on Windows",
    source: "Web App",
    location: "Lahore, PK",
    description: "Updated payment status after due date check.",
    metadata: "Notification sent to Finance Team.",
  },
  {
    id: "LOG-1003",
    timestamp: "2026-06-19T11:00:00",
    user: "System Bot",
    userRole: "Automation",
    module: "Automations",
    actionType: "Automation Run",
    status: "Success",
    riskLevel: "Low",
    recordId: "AUT-1002",
    recordName: "Deal Stage Follow-up Reminder",
    fieldName: "Run Status",
    oldValue: "Scheduled",
    newValue: "Completed",
    ipAddress: "System",
    device: "Server Worker",
    source: "Automation",
    location: "Cloud Worker",
    description: "Automation created a follow-up task for proposal stage deal.",
    metadata: "Task generated for Sales Team.",
  },
  {
    id: "LOG-1004",
    timestamp: "2026-06-19T11:25:00",
    user: "Sara Khan",
    userRole: "Support Agent",
    module: "Documents",
    actionType: "File Downloaded",
    status: "Success",
    riskLevel: "Medium",
    recordId: "DOC-1001",
    recordName: "ABC School CRM Proposal.pdf",
    fieldName: "File Access",
    oldValue: "Not downloaded",
    newValue: "Downloaded",
    ipAddress: "103.155.44.30",
    device: "Safari on iPhone",
    source: "Mobile App",
    location: "Karachi, PK",
    description: "Downloaded proposal document from CRM document vault.",
    metadata: "Download allowed by Team permission.",
  },
  {
    id: "LOG-1005",
    timestamp: "2026-06-19T12:05:00",
    user: "Bilal Ahmed",
    userRole: "Sales Agent",
    module: "Deals",
    actionType: "Status Changed",
    status: "Success",
    riskLevel: "Low",
    recordId: "DEA-7004",
    recordName: "Growth Mart SEO Deal",
    fieldName: "Deal Stage",
    oldValue: "Qualified",
    newValue: "Proposal Sent",
    ipAddress: "103.155.44.40",
    device: "Firefox on Windows",
    source: "Web App",
    location: "Islamabad, PK",
    description: "Moved deal stage from Qualified to Proposal Sent.",
    metadata: "Follow-up automation scheduled.",
  },
  {
    id: "LOG-1006",
    timestamp: "2026-06-19T12:25:00",
    user: "Unknown User",
    userRole: "External",
    module: "Security",
    actionType: "Failed Attempt",
    status: "Failed",
    riskLevel: "Critical",
    recordId: "SEC-9091",
    recordName: "Admin Login Attempt",
    fieldName: "Authentication",
    oldValue: "Not authenticated",
    newValue: "Failed login",
    ipAddress: "45.90.12.77",
    device: "Unknown Device",
    source: "Security Monitor",
    location: "Unknown",
    description: "Failed login attempt detected for Admin User account.",
    metadata: "Security alert generated.",
  },
  {
    id: "LOG-1007",
    timestamp: "2026-06-19T13:10:00",
    user: "Admin User",
    userRole: "CRM Administrator",
    module: "Team",
    actionType: "Permission Changed",
    status: "Warning",
    riskLevel: "High",
    recordId: "USR-1003",
    recordName: "Bilal Ahmed",
    fieldName: "Role",
    oldValue: "Viewer",
    newValue: "Sales Agent",
    ipAddress: "103.155.44.22",
    device: "Chrome on Windows",
    source: "Web App",
    location: "Lahore, PK",
    description: "Changed user role and CRM access permissions.",
    metadata: "Permission change should be reviewed by administrator.",
  },
  {
    id: "LOG-1008",
    timestamp: "2026-06-19T14:00:00",
    user: "Malik Khan",
    userRole: "Finance User",
    module: "Payments",
    actionType: "Exported",
    status: "Success",
    riskLevel: "High",
    recordId: "EXP-5520",
    recordName: "Monthly Payment Report",
    fieldName: "Export",
    oldValue: "Not exported",
    newValue: "CSV exported",
    ipAddress: "103.155.44.50",
    device: "Edge on Windows",
    source: "Web App",
    location: "Multan, PK",
    description: "Exported monthly payment report.",
    metadata: "Export contains payment and invoice records.",
  },
];

function formatDateTime(value) {
  if (!value) return "Not set";

  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function actionClass(actionType) {
  return (
    {
      Created: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      Updated: "bg-blue-50 text-blue-700 ring-blue-200",
      Deleted: "bg-rose-50 text-rose-700 ring-rose-200",
      Viewed: "bg-slate-100 text-slate-700 ring-slate-200",
      Exported: "bg-orange-50 text-orange-700 ring-orange-200",
      Imported: "bg-cyan-50 text-cyan-700 ring-cyan-200",
      Assigned: "bg-violet-50 text-violet-700 ring-violet-200",
      "Status Changed": "bg-indigo-50 text-indigo-700 ring-indigo-200",
      Login: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      Logout: "bg-slate-100 text-slate-700 ring-slate-200",
      "Permission Changed": "bg-amber-50 text-amber-700 ring-amber-200",
      "Automation Run": "bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200",
      "File Downloaded": "bg-sky-50 text-sky-700 ring-sky-200",
      "Failed Attempt": "bg-rose-50 text-rose-700 ring-rose-200",
    }[actionType] || "bg-slate-100 text-slate-700 ring-slate-200"
  );
}

function riskClass(riskLevel) {
  return (
    {
      Low: "bg-slate-100 text-slate-600 ring-slate-200",
      Medium: "bg-blue-50 text-blue-700 ring-blue-200",
      High: "bg-orange-50 text-orange-700 ring-orange-200",
      Critical: "bg-rose-50 text-rose-700 ring-rose-200",
    }[riskLevel] || "bg-slate-100 text-slate-700 ring-slate-200"
  );
}

function statusClass(status) {
  return (
    {
      Success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      Failed: "bg-rose-50 text-rose-700 ring-rose-200",
      Warning: "bg-amber-50 text-amber-700 ring-amber-200",
    }[status] || "bg-slate-100 text-slate-700 ring-slate-200"
  );
}

function sourceIcon(source) {
  const icons = {
    "Web App": Laptop,
    "Mobile App": Smartphone,
    API: Database,
    Automation: RefreshCcw,
    "Import Tool": Archive,
    "Security Monitor": ShieldAlert,
  };

  return icons[source] || Activity;
}

function actionIcon(actionType) {
  const icons = {
    Created: CheckCircle2,
    Updated: Edit3,
    Deleted: Trash2,
    Viewed: Eye,
    Exported: Download,
    Imported: Archive,
    Assigned: UserCheck,
    "Status Changed": RefreshCcw,
    Login: LockKeyhole,
    Logout: LockKeyhole,
    "Permission Changed": ShieldCheck,
    "Automation Run": Activity,
    "File Downloaded": FileText,
    "Failed Attempt": ShieldAlert,
  };

  return icons[actionType] || Activity;
}

function ActivityLogs() {
  const [logs, setLogs] = useState(demoLogs);
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("All");
  const [actionFilter, setActionFilter] = useState("All");
  const [riskFilter, setRiskFilter] = useState("All");
  const [userFilter, setUserFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedLog, setSelectedLog] = useState(null);
  const [success, setSuccess] = useState("");

  const filteredLogs = useMemo(() => {
    const q = search.toLowerCase().trim();

    return logs.filter((log) => {
      const searchOk =
        !q ||
        [
          log.id,
          log.user,
          log.userRole,
          log.module,
          log.actionType,
          log.status,
          log.riskLevel,
          log.recordId,
          log.recordName,
          log.fieldName,
          log.oldValue,
          log.newValue,
          log.ipAddress,
          log.device,
          log.source,
          log.location,
          log.description,
          log.metadata,
        ]
          .join(" ")
          .toLowerCase()
          .includes(q);

      const moduleOk = moduleFilter === "All" || log.module === moduleFilter;
      const actionOk = actionFilter === "All" || log.actionType === actionFilter;
      const riskOk = riskFilter === "All" || log.riskLevel === riskFilter;
      const userOk = userFilter === "All" || log.user === userFilter;
      const sourceOk = sourceFilter === "All" || log.source === sourceFilter;
      const statusOk = statusFilter === "All" || log.status === statusFilter;

      return (
        searchOk &&
        moduleOk &&
        actionOk &&
        riskOk &&
        userOk &&
        sourceOk &&
        statusOk
      );
    });
  }, [
    logs,
    search,
    moduleFilter,
    actionFilter,
    riskFilter,
    userFilter,
    sourceFilter,
    statusFilter,
  ]);

  const stats = [
    {
      label: "Total Logs",
      value: logs.length,
      note: "Tracked events",
      icon: History,
    },
    {
      label: "High Risk",
      value: logs.filter(
        (log) => log.riskLevel === "High" || log.riskLevel === "Critical"
      ).length,
      note: "Needs review",
      icon: ShieldAlert,
    },
    {
      label: "Failed Events",
      value: logs.filter((log) => log.status === "Failed").length,
      note: "Errors found",
      icon: AlertCircle,
    },
    {
      label: "Exports",
      value: logs.filter((log) => log.actionType === "Exported").length,
      note: "Data exports",
      icon: Download,
    },
  ];

  const moduleStats = modules
    .filter((item) => item !== "All")
    .map((module) => ({
      module,
      count: logs.filter((log) => log.module === module).length,
    }));

  const riskyEvents = logs
    .filter((log) => log.riskLevel === "High" || log.riskLevel === "Critical")
    .slice(0, 5);

  const userActivity = users
    .filter((user) => user !== "All")
    .map((user) => ({
      user,
      count: logs.filter((log) => log.user === user).length,
    }))
    .filter((item) => item.count > 0);

  function updateLog(id, updates) {
    setLogs((prev) =>
      prev.map((log) => (log.id === id ? { ...log, ...updates } : log))
    );

    setSelectedLog((prev) => (prev && prev.id === id ? { ...prev, ...updates } : prev));
  }

  function handleDelete(id) {
    setLogs((prev) => prev.filter((log) => log.id !== id));

    if (selectedLog?.id === id) {
      setSelectedLog(null);
    }
  }

  function exportCsv() {
    const headers = [
      "ID",
      "Timestamp",
      "User",
      "Role",
      "Module",
      "Action",
      "Status",
      "Risk",
      "Record ID",
      "Record Name",
      "Field",
      "Old Value",
      "New Value",
      "IP Address",
      "Device",
      "Source",
      "Location",
      "Description",
    ];

    const rows = filteredLogs.map((log) => [
      log.id,
      formatDateTime(log.timestamp),
      log.user,
      log.userRole,
      log.module,
      log.actionType,
      log.status,
      log.riskLevel,
      log.recordId,
      log.recordName,
      log.fieldName,
      log.oldValue,
      log.newValue,
      log.ipAddress,
      log.device,
      log.source,
      log.location,
      log.description,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value || "").replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "crm-activity-logs.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setSuccess("Activity logs exported successfully.");
  }

  return (
    <div className="min-h-screen bg-[#f6f8fb] p-4 sm:p-5 lg:p-6">
      <div className="mx-auto max-w-[1500px] space-y-5">
        {success && (
          <div className="fixed right-4 top-4 z-[70] max-w-md rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 shadow-xl">
            <div className="flex items-start gap-2">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
              <span>{success}</span>

              <button type="button" onClick={() => setSuccess("")} className="ml-2">
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        <section className="overflow-hidden rounded-[1.7rem] border border-slate-200 bg-white shadow-sm">
          <div className="relative p-5 sm:p-6">
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-slate-700 via-slate-500 to-slate-400" />

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-black uppercase tracking-wide text-slate-700">
                  <History size={14} />
                  CRM Audit Trail
                </div>

                <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                  Activity Logs
                </h1>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                  Track user actions, record changes, security events, exports,
                  automation runs, IP addresses, devices and audit history.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setModuleFilter("All");
                    setActionFilter("All");
                    setRiskFilter("All");
                    setUserFilter("All");
                    setSourceFilter("All");
                    setStatusFilter("All");
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  <RefreshCcw size={18} />
                  Reset Filters
                </button>

                <button
                  type="button"
                  onClick={exportCsv}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white shadow-lg shadow-slate-200 transition hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  <Download size={18} />
                  Export Logs
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-[1.4rem] border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
                    <Icon size={21} />
                  </div>

                  <span className="text-xs font-black text-slate-400">
                    {stat.note}
                  </span>
                </div>

                <p className="mt-4 text-sm font-bold text-slate-500">
                  {stat.label}
                </p>

                <h2 className="mt-1 text-3xl font-black text-slate-950">
                  {stat.value}
                </h2>
              </div>
            );
          })}
        </section>

        <section className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 rounded-[1.4rem] border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-4">
              <div className="grid gap-3">
                <div className="relative">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />

                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search user, module, action, record, IP, device, description..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
                  {[
                    [moduleFilter, setModuleFilter, modules, "Module"],
                    [actionFilter, setActionFilter, actionTypes, "Action"],
                    [riskFilter, setRiskFilter, riskLevels, "Risk"],
                    [userFilter, setUserFilter, users, "User"],
                    [sourceFilter, setSourceFilter, sources, "Source"],
                    [statusFilter, setStatusFilter, statuses, "Status"],
                  ].map(([value, setter, options, label]) => (
                    <div key={label} className="relative">
                      {label === "Module" && (
                        <Filter
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                          size={16}
                        />
                      )}

                      <select
                        value={value}
                        onChange={(event) => setter(event.target.value)}
                        className={`w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pr-9 text-sm font-bold text-slate-700 outline-none ${
                          label === "Module" ? "pl-10" : "pl-4"
                        }`}
                      >
                        {options.map((option) => (
                          <option key={option}>{option}</option>
                        ))}
                      </select>

                      <ChevronDown
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                        size={16}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1280px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Event</th>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Record</th>
                    <th className="px-4 py-3">Change</th>
                    <th className="px-4 py-3">Source</th>
                    <th className="px-4 py-3">Risk</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredLogs.map((log) => {
                    const ActionIcon = actionIcon(log.actionType);
                    const SourceIcon = sourceIcon(log.source);

                    return (
                      <tr key={log.id} className="transition hover:bg-slate-50/80">
                        <td className="px-4 py-3">
                          <div className="flex min-w-0 items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-700 to-slate-500 text-white shadow-lg shadow-slate-100">
                              <ActionIcon size={18} />
                            </div>

                            <div className="min-w-0">
                              <p className="truncate font-black text-slate-950">
                                {log.description}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                {log.id} • {formatDateTime(log.timestamp)}
                              </p>

                              <div className="mt-2 flex flex-wrap gap-1.5">
                                <span
                                  className={`inline-flex w-fit items-center whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-black ring-1 ${actionClass(
                                    log.actionType
                                  )}`}
                                >
                                  {log.actionType}
                                </span>

                                <span className="inline-flex w-fit items-center whitespace-nowrap rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-black text-slate-600 ring-1 ring-slate-200">
                                  {log.module}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <p className="font-bold text-slate-800">{log.user}</p>

                          <p className="mt-1 text-xs text-slate-500">
                            {log.userRole}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {log.location}
                          </p>
                        </td>

                        <td className="px-4 py-3">
                          <p className="font-bold text-slate-800">
                            {log.recordName}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {log.recordId}
                          </p>
                        </td>

                        <td className="px-4 py-3">
                          <p className="font-bold text-slate-800">
                            {log.fieldName}
                          </p>

                          <p className="mt-1 max-w-[220px] truncate text-xs text-slate-500">
                            Old: {log.oldValue || "Blank"}
                          </p>

                          <p className="mt-1 max-w-[220px] truncate text-xs text-slate-500">
                            New: {log.newValue || "Blank"}
                          </p>
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="rounded-lg bg-slate-100 p-2 text-slate-700">
                              <SourceIcon size={15} />
                            </div>

                            <div>
                              <p className="font-bold text-slate-800">
                                {log.source}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                {log.ipAddress}
                              </p>

                              <p className="mt-1 max-w-[160px] truncate text-xs text-slate-400">
                                {log.device}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex w-fit items-center whitespace-nowrap rounded-full px-3 py-1 text-xs font-black ring-1 ${riskClass(
                              log.riskLevel
                            )}`}
                          >
                            {log.riskLevel}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex w-fit items-center whitespace-nowrap rounded-full px-3 py-1 text-xs font-black ring-1 ${statusClass(
                              log.status
                            )}`}
                          >
                            {log.status}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedLog(log)}
                              className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
                              title="View Details"
                            >
                              <Eye size={15} />
                            </button>

                            <button
                              onClick={() =>
                                updateLog(log.id, {
                                  riskLevel:
                                    log.riskLevel === "Critical" ? "High" : "Critical",
                                })
                              }
                              className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
                              title="Toggle Risk"
                            >
                              <ShieldAlert size={15} />
                            </button>

                            <button
                              onClick={() => handleDelete(log.id)}
                              className="rounded-lg border border-rose-100 p-2 text-rose-500 hover:bg-rose-50"
                              title="Delete Log"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredLogs.length === 0 && (
                <div className="p-10 text-center">
                  <History className="mx-auto text-slate-300" size={42} />

                  <h3 className="mt-3 text-lg font-black text-slate-900">
                    No activity logs found
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Change filters or reset search criteria.
                  </p>
                </div>
              )}
            </div>
          </div>

          <aside className="min-w-0 space-y-4">
            <div className="rounded-[1.4rem] border border-slate-200 bg-white p-4 shadow-sm 2xl:sticky 2xl:top-6">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-base font-black text-slate-950">
                  Module Activity
                </h3>

                <MoreHorizontal className="text-slate-400" size={18} />
              </div>

              <div className="mt-4 max-h-[360px] space-y-2 overflow-y-auto pr-1">
                {moduleStats.map((item) => (
                  <div
                    key={item.module}
                    className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5"
                  >
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg bg-white p-1.5 text-slate-700">
                        <Database size={15} />
                      </div>

                      <span className="text-xs font-black text-slate-700">
                        {item.module}
                      </span>
                    </div>

                    <span className="rounded-full bg-white px-2 py-1 text-xs font-black text-slate-500">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.4rem] border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-base font-black text-slate-950">
                Risk Review Queue
              </h3>

              <div className="mt-4 space-y-2">
                {riskyEvents.map((log) => (
                  <button
                    key={log.id}
                    type="button"
                    onClick={() => setSelectedLog(log)}
                    className="w-full rounded-xl bg-slate-50 px-3 py-2.5 text-left transition hover:bg-slate-100"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-xs font-black text-slate-900">
                          {log.description}
                        </p>

                        <p className="mt-1 text-[11px] text-slate-500">
                          {log.user} • {log.module}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-black ring-1 ${riskClass(
                          log.riskLevel
                        )}`}
                      >
                        {log.riskLevel}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[1.4rem] border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-base font-black text-slate-950">
                User Activity
              </h3>

              <div className="mt-4 space-y-2">
                {userActivity.map((item) => (
                  <div
                    key={item.user}
                    className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2.5"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-xs font-black text-white">
                        {item.user
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .slice(0, 2)}
                      </div>

                      <p className="truncate text-xs font-black text-slate-900">
                        {item.user}
                      </p>
                    </div>

                    <span className="rounded-full bg-white px-2 py-1 text-xs font-black text-slate-500">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </div>

      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="my-8 w-full max-w-5xl rounded-[1.7rem] bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-700 to-slate-500 text-white shadow-lg shadow-slate-100">
                  <History size={24} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                    {selectedLog.id} • {selectedLog.module}
                  </p>

                  <h2 className="mt-1 break-words text-2xl font-black text-slate-950">
                    {selectedLog.description}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {selectedLog.user} • {formatDateTime(selectedLog.timestamp)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="rounded-xl bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["User", selectedLog.user, Users],
                ["User Role", selectedLog.userRole, UserCheck],
                ["Module", selectedLog.module, Database],
                ["Action", selectedLog.actionType, Activity],
                ["Status", selectedLog.status, CheckCircle2],
                ["Risk Level", selectedLog.riskLevel, ShieldAlert],
                ["Record ID", selectedLog.recordId, Archive],
                ["Record Name", selectedLog.recordName, FileText],
                ["Field", selectedLog.fieldName, Edit3],
                ["Old Value", selectedLog.oldValue || "Blank", Info],
                ["New Value", selectedLog.newValue || "Blank", Info],
                ["IP Address", selectedLog.ipAddress, Globe2],
                ["Device", selectedLog.device, Laptop],
                ["Source", selectedLog.source, Database],
                ["Location", selectedLog.location, Globe2],
              ].map(([label, value, Icon]) => (
                <div key={label} className="rounded-xl bg-slate-50 p-3">
                  <div className="flex items-center gap-2 text-xs font-black uppercase text-slate-400">
                    <Icon size={14} />
                    {label}
                  </div>

                  <p className="mt-1 break-words text-sm font-bold text-slate-800">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-3 lg:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-black uppercase text-slate-400">
                  Description
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {selectedLog.description}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-black uppercase text-slate-400">
                  Metadata
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {selectedLog.metadata || "No metadata available."}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-black text-slate-700 hover:bg-slate-50"
                onClick={() => setSelectedLog(null)}
              >
                Close
              </button>

              <button
                onClick={() =>
                  updateLog(selectedLog.id, {
                    riskLevel:
                      selectedLog.riskLevel === "Critical" ? "High" : "Critical",
                  })
                }
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-black text-slate-700 hover:bg-slate-50"
              >
                Toggle Risk
              </button>

              <button
                onClick={() => handleDelete(selectedLog.id)}
                className="flex-1 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-black text-white hover:bg-slate-800"
              >
                Delete Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActivityLogs;