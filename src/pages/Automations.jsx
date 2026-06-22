import { useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  Archive,
  BellRing,
  Bot,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Copy,
  Edit3,
  Eye,
  Filter,
  GitBranch,
  History,
  Mail,
  MessageSquareText,
  MoreHorizontal,
  PauseCircle,
  PlayCircle,
  Plus,
  RefreshCcw,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Tag,
  Timer,
  Trash2,
  UserCheck,
  Webhook,
  X,
  Zap,
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
  "Communications",
  "Services",
];

const statuses = ["All", "Active", "Paused", "Draft", "Failed", "Archived"];

const triggerTypes = [
  "Record Created",
  "Record Updated",
  "Stage Changed",
  "Date Based",
  "Email Received",
  "Payment Due",
  "Task Overdue",
  "Manual Trigger",
];

const actionTypes = [
  "Send Email",
  "Create Task",
  "Assign Owner",
  "Update Field",
  "Send Notification",
  "Create Follow-up",
  "Webhook",
  "Move Stage",
];

const owners = [
  "Admin User",
  "Sales Team",
  "Support Team",
  "Marketing Team",
  "Finance Team",
  "Operations Team",
];

const runModes = ["Instant", "Delayed", "Scheduled", "Recurring"];

const priorities = ["Low", "Medium", "High", "Critical"];

const conditionOperators = [
  "Equals",
  "Not Equals",
  "Contains",
  "Greater Than",
  "Less Than",
  "Is Empty",
  "Is Not Empty",
];

const demoAutomations = [
  {
    id: "AUT-1001",
    name: "New Lead Auto Assignment",
    description:
      "Assign new website leads to the sales team and create first follow-up task.",
    module: "Leads",
    status: "Active",
    triggerType: "Record Created",
    triggerEvent: "When a new lead is created",
    conditionField: "Lead Source",
    conditionOperator: "Equals",
    conditionValue: "Website Form",
    actionType: "Assign Owner",
    actionSummary: "Assign lead to Sales Team and create follow-up task",
    owner: "Sales Team",
    runMode: "Instant",
    delayValue: 0,
    delayUnit: "Minutes",
    priority: "High",
    totalRuns: 248,
    successRuns: 241,
    failedRuns: 7,
    lastRun: "2026-06-19T10:20",
    nextRun: "",
    createdAt: "2026-05-02",
    updatedAt: "2026-06-18",
    tags: "lead, assignment, sales",
    emailTo: "",
    webhookUrl: "",
    notifyOwner: true,
    stopOnError: true,
    requireApproval: false,
    auditLog: [
      "Automation executed for lead ABC School.",
      "Owner assigned to Sales Team.",
      "Follow-up task created.",
    ],
  },
  {
    id: "AUT-1002",
    name: "Deal Stage Follow-up Reminder",
    description:
      "Create a follow-up task when a deal stays in proposal stage for more than two days.",
    module: "Deals",
    status: "Active",
    triggerType: "Stage Changed",
    triggerEvent: "When deal moves to Proposal Sent",
    conditionField: "Deal Stage",
    conditionOperator: "Equals",
    conditionValue: "Proposal Sent",
    actionType: "Create Follow-up",
    actionSummary: "Create follow-up task after 2 days",
    owner: "Sales Team",
    runMode: "Delayed",
    delayValue: 2,
    delayUnit: "Days",
    priority: "Medium",
    totalRuns: 116,
    successRuns: 112,
    failedRuns: 4,
    lastRun: "2026-06-18T15:10",
    nextRun: "2026-06-20T15:10",
    createdAt: "2026-05-12",
    updatedAt: "2026-06-17",
    tags: "deal, proposal, follow-up",
    emailTo: "",
    webhookUrl: "",
    notifyOwner: true,
    stopOnError: true,
    requireApproval: false,
    auditLog: [
      "Deal moved to Proposal Sent.",
      "Delay timer started.",
      "Follow-up task scheduled.",
    ],
  },
  {
    id: "AUT-1003",
    name: "Payment Due Alert",
    description:
      "Notify finance and account owner when an invoice becomes due.",
    module: "Payments",
    status: "Active",
    triggerType: "Payment Due",
    triggerEvent: "When invoice due date arrives",
    conditionField: "Payment Status",
    conditionOperator: "Not Equals",
    conditionValue: "Paid",
    actionType: "Send Notification",
    actionSummary: "Notify Finance Team and assigned account owner",
    owner: "Finance Team",
    runMode: "Scheduled",
    delayValue: 0,
    delayUnit: "Minutes",
    priority: "Critical",
    totalRuns: 89,
    successRuns: 85,
    failedRuns: 4,
    lastRun: "2026-06-19T09:00",
    nextRun: "2026-06-20T09:00",
    createdAt: "2026-04-20",
    updatedAt: "2026-06-16",
    tags: "payment, invoice, finance",
    emailTo: "finance@example.com",
    webhookUrl: "",
    notifyOwner: true,
    stopOnError: true,
    requireApproval: true,
    auditLog: [
      "Invoice due date checked.",
      "Payment status not paid.",
      "Finance notification sent.",
    ],
  },
  {
    id: "AUT-1004",
    name: "Support Ticket Escalation",
    description:
      "Escalate unresolved support conversations after SLA deadline.",
    module: "Communications",
    status: "Paused",
    triggerType: "Task Overdue",
    triggerEvent: "When SLA time is missed",
    conditionField: "Conversation Status",
    conditionOperator: "Not Equals",
    conditionValue: "Resolved",
    actionType: "Send Notification",
    actionSummary: "Notify Support Team Lead and mark priority High",
    owner: "Support Team",
    runMode: "Instant",
    delayValue: 0,
    delayUnit: "Minutes",
    priority: "High",
    totalRuns: 42,
    successRuns: 39,
    failedRuns: 3,
    lastRun: "2026-06-15T13:30",
    nextRun: "",
    createdAt: "2026-05-28",
    updatedAt: "2026-06-14",
    tags: "support, escalation, sla",
    emailTo: "",
    webhookUrl: "",
    notifyOwner: true,
    stopOnError: true,
    requireApproval: false,
    auditLog: [
      "SLA missed.",
      "Priority changed to High.",
      "Support lead notified.",
    ],
  },
  {
    id: "AUT-1005",
    name: "Webhook to External Reporting",
    description:
      "Send deal win data to external reporting tool through webhook.",
    module: "Deals",
    status: "Failed",
    triggerType: "Stage Changed",
    triggerEvent: "When deal stage becomes Won",
    conditionField: "Deal Stage",
    conditionOperator: "Equals",
    conditionValue: "Won",
    actionType: "Webhook",
    actionSummary: "Send deal data to external reporting endpoint",
    owner: "Operations Team",
    runMode: "Instant",
    delayValue: 0,
    delayUnit: "Minutes",
    priority: "Medium",
    totalRuns: 31,
    successRuns: 24,
    failedRuns: 7,
    lastRun: "2026-06-18T18:45",
    nextRun: "",
    createdAt: "2026-06-01",
    updatedAt: "2026-06-18",
    tags: "webhook, deal, reporting",
    emailTo: "",
    webhookUrl: "https://example.com/webhook",
    notifyOwner: true,
    stopOnError: false,
    requireApproval: false,
    auditLog: [
      "Deal stage changed to Won.",
      "Webhook request failed.",
      "Retry required.",
    ],
  },
];

const emptyAutomationForm = {
  name: "",
  description: "",
  module: "Leads",
  status: "Active",
  triggerType: "Record Created",
  triggerEvent: "",
  conditionField: "",
  conditionOperator: "Equals",
  conditionValue: "",
  actionType: "Create Task",
  actionSummary: "",
  owner: "Admin User",
  runMode: "Instant",
  delayValue: "0",
  delayUnit: "Minutes",
  priority: "Medium",
  tags: "",
  emailTo: "",
  webhookUrl: "",
  notifyOwner: true,
  stopOnError: true,
  requireApproval: false,
};

function formatDateTime(value) {
  if (!value) return "Not scheduled";

  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(value) {
  if (!value) return "Not set";

  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function statusClass(status) {
  return (
    {
      Active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      Paused: "bg-amber-50 text-amber-700 ring-amber-200",
      Draft: "bg-slate-100 text-slate-700 ring-slate-200",
      Failed: "bg-rose-50 text-rose-700 ring-rose-200",
      Archived: "bg-slate-100 text-slate-600 ring-slate-200",
    }[status] || "bg-slate-100 text-slate-700 ring-slate-200"
  );
}

function priorityClass(priority) {
  return (
    {
      Low: "bg-slate-100 text-slate-600 ring-slate-200",
      Medium: "bg-blue-50 text-blue-700 ring-blue-200",
      High: "bg-orange-50 text-orange-700 ring-orange-200",
      Critical: "bg-rose-50 text-rose-700 ring-rose-200",
    }[priority] || "bg-slate-100 text-slate-700 ring-slate-200"
  );
}

function triggerClass(triggerType) {
  return (
    {
      "Record Created": "bg-blue-50 text-blue-700 ring-blue-200",
      "Record Updated": "bg-cyan-50 text-cyan-700 ring-cyan-200",
      "Stage Changed": "bg-indigo-50 text-indigo-700 ring-indigo-200",
      "Date Based": "bg-violet-50 text-violet-700 ring-violet-200",
      "Email Received": "bg-sky-50 text-sky-700 ring-sky-200",
      "Payment Due": "bg-amber-50 text-amber-700 ring-amber-200",
      "Task Overdue": "bg-rose-50 text-rose-700 ring-rose-200",
      "Manual Trigger": "bg-slate-100 text-slate-700 ring-slate-200",
    }[triggerType] || "bg-slate-100 text-slate-700 ring-slate-200"
  );
}

function actionIcon(actionType) {
  const icons = {
    "Send Email": Mail,
    "Create Task": CheckCircle2,
    "Assign Owner": UserCheck,
    "Update Field": Edit3,
    "Send Notification": BellRing,
    "Create Follow-up": CalendarClock,
    Webhook: Webhook,
    "Move Stage": GitBranch,
  };

  return icons[actionType] || Zap;
}

function successRate(item) {
  if (!item.totalRuns) return 0;
  return Math.round((item.successRuns / item.totalRuns) * 100);
}

function Toggle({ checked, onChange, label, description }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex w-full items-start justify-between gap-3 rounded-xl border p-3 text-left transition ${
        checked
          ? "border-slate-950 bg-slate-950 text-white"
          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      }`}
    >
      <span>
        <span className="block text-xs font-black">{label}</span>

        {description && (
          <span
            className={`mt-1 block text-[11px] leading-4 ${
              checked ? "text-slate-300" : "text-slate-500"
            }`}
          >
            {description}
          </span>
        )}
      </span>

      <span
        className={`mt-1 h-5 w-9 rounded-full p-0.5 transition ${
          checked ? "bg-white" : "bg-slate-200"
        }`}
      >
        <span
          className={`block h-4 w-4 rounded-full transition ${
            checked ? "translate-x-4 bg-slate-950" : "bg-white"
          }`}
        />
      </span>
    </button>
  );
}

function Automations() {
  const [automations, setAutomations] = useState(demoAutomations);
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [triggerFilter, setTriggerFilter] = useState("All");
  const [selectedAutomation, setSelectedAutomation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingAutomationId, setEditingAutomationId] = useState(null);
  const [form, setForm] = useState(emptyAutomationForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const filteredAutomations = useMemo(() => {
    const q = search.toLowerCase().trim();

    return automations.filter((automation) => {
      const searchOk =
        !q ||
        [
          automation.id,
          automation.name,
          automation.description,
          automation.module,
          automation.status,
          automation.triggerType,
          automation.triggerEvent,
          automation.conditionField,
          automation.conditionValue,
          automation.actionType,
          automation.actionSummary,
          automation.owner,
          automation.priority,
          automation.tags,
        ]
          .join(" ")
          .toLowerCase()
          .includes(q);

      const moduleOk =
        moduleFilter === "All" || automation.module === moduleFilter;

      const statusOk =
        statusFilter === "All" || automation.status === statusFilter;

      const triggerOk =
        triggerFilter === "All" || automation.triggerType === triggerFilter;

      return searchOk && moduleOk && statusOk && triggerOk;
    });
  }, [automations, search, moduleFilter, statusFilter, triggerFilter]);

  const stats = [
    {
      label: "Total Automations",
      value: automations.length,
      note: "All rules",
      icon: Bot,
    },
    {
      label: "Active Rules",
      value: automations.filter((item) => item.status === "Active").length,
      note: "Running now",
      icon: PlayCircle,
    },
    {
      label: "Failed Rules",
      value: automations.filter((item) => item.status === "Failed").length,
      note: "Need review",
      icon: AlertCircle,
    },
    {
      label: "Avg Success Rate",
      value: `${Math.round(
        automations.reduce((sum, item) => sum + successRate(item), 0) /
          automations.length
      )}%`,
      note: "Reliability",
      icon: Activity,
    },
  ];

  const moduleStats = modules
    .filter((item) => item !== "All")
    .map((module) => ({
      module,
      count: automations.filter((item) => item.module === module).length,
    }));

  const recentRuns = [...automations]
    .sort((a, b) => new Date(b.lastRun).getTime() - new Date(a.lastRun).getTime())
    .slice(0, 5);

  function setField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setField(name, value);
  }

  function resetModal() {
    setForm(emptyAutomationForm);
    setEditingAutomationId(null);
    setError("");
    setShowModal(false);
  }

  function openCreateModal() {
    setForm(emptyAutomationForm);
    setEditingAutomationId(null);
    setShowModal(true);
  }

  function openEditModal(automation) {
    setEditingAutomationId(automation.id);
    setForm({
      name: automation.name,
      description: automation.description,
      module: automation.module,
      status: automation.status,
      triggerType: automation.triggerType,
      triggerEvent: automation.triggerEvent,
      conditionField: automation.conditionField,
      conditionOperator: automation.conditionOperator,
      conditionValue: automation.conditionValue,
      actionType: automation.actionType,
      actionSummary: automation.actionSummary,
      owner: automation.owner,
      runMode: automation.runMode,
      delayValue: String(automation.delayValue),
      delayUnit: automation.delayUnit,
      priority: automation.priority,
      tags: automation.tags,
      emailTo: automation.emailTo,
      webhookUrl: automation.webhookUrl,
      notifyOwner: automation.notifyOwner,
      stopOnError: automation.stopOnError,
      requireApproval: automation.requireApproval,
    });
    setShowModal(true);
  }

  function validateForm() {
    if (!form.name.trim()) return "Automation name is required.";
    if (!form.triggerEvent.trim()) return "Trigger event is required.";
    if (!form.conditionField.trim()) return "Condition field is required.";
    if (!form.actionSummary.trim()) return "Action summary is required.";

    if (form.actionType === "Send Email" && !form.emailTo.trim()) {
      return "Email recipient is required for Send Email action.";
    }

    if (form.actionType === "Webhook" && !form.webhookUrl.trim()) {
      return "Webhook URL is required for Webhook action.";
    }

    if (
      (form.runMode === "Delayed" || form.runMode === "Scheduled") &&
      Number(form.delayValue) < 0
    ) {
      return "Delay value must be valid.";
    }

    return "";
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = {
      name: form.name,
      description: form.description,
      module: form.module,
      status: form.status,
      triggerType: form.triggerType,
      triggerEvent: form.triggerEvent,
      conditionField: form.conditionField,
      conditionOperator: form.conditionOperator,
      conditionValue: form.conditionValue,
      actionType: form.actionType,
      actionSummary: form.actionSummary,
      owner: form.owner,
      runMode: form.runMode,
      delayValue: Number(form.delayValue || 0),
      delayUnit: form.delayUnit,
      priority: form.priority,
      tags: form.tags,
      emailTo: form.emailTo,
      webhookUrl: form.webhookUrl,
      notifyOwner: form.notifyOwner,
      stopOnError: form.stopOnError,
      requireApproval: form.requireApproval,
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    if (editingAutomationId) {
      setAutomations((prev) =>
        prev.map((item) =>
          item.id === editingAutomationId ? { ...item, ...payload } : item
        )
      );
      setSuccess("Automation updated successfully.");
      resetModal();
      return;
    }

    const newAutomation = {
      id: `AUT-${1000 + automations.length + 1}`,
      ...payload,
      totalRuns: 0,
      successRuns: 0,
      failedRuns: 0,
      lastRun: "",
      nextRun: payload.runMode === "Scheduled" ? new Date().toISOString() : "",
      createdAt: new Date().toISOString().slice(0, 10),
      auditLog: ["Automation created."],
    };

    setAutomations((prev) => [newAutomation, ...prev]);
    setSuccess("Automation created successfully.");
    resetModal();
  }

  function updateAutomation(id, updates) {
    setAutomations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );

    setSelectedAutomation((prev) =>
      prev && prev.id === id ? { ...prev, ...updates } : prev
    );
  }

  function handleDelete(id) {
    setAutomations((prev) => prev.filter((item) => item.id !== id));

    if (selectedAutomation?.id === id) {
      setSelectedAutomation(null);
    }
  }

  function handleDuplicate(automation) {
    const copy = {
      ...automation,
      id: `AUT-${1000 + automations.length + 1}`,
      name: `${automation.name} Copy`,
      status: "Draft",
      totalRuns: 0,
      successRuns: 0,
      failedRuns: 0,
      lastRun: "",
      nextRun: "",
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
      auditLog: ["Automation duplicated as draft."],
    };

    setAutomations((prev) => [copy, ...prev]);
    setSuccess("Automation duplicated as draft.");
  }

  function handleRunNow(automation) {
    const passed = automation.status !== "Failed";
    const now = new Date().toISOString();

    updateAutomation(automation.id, {
      totalRuns: automation.totalRuns + 1,
      successRuns: automation.successRuns + (passed ? 1 : 0),
      failedRuns: automation.failedRuns + (passed ? 0 : 1),
      lastRun: now,
      auditLog: [
        `Manual run executed at ${formatDateTime(now)}.`,
        ...(automation.auditLog || []),
      ],
    });

    setSuccess(passed ? "Automation executed successfully." : "Automation run failed.");
  }

  return (
    <div className="min-h-screen bg-[#f6f8fb] p-4 sm:p-5 lg:p-6">
      <div className="mx-auto max-w-[1500px] space-y-5">
        {(error || success) && (
          <div
            className={`fixed right-4 top-4 z-[70] max-w-md rounded-2xl border px-4 py-3 text-sm font-bold shadow-xl ${
              error
                ? "border-rose-200 bg-rose-50 text-rose-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            <div className="flex items-start gap-2">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span>{error || success}</span>

              <button
                type="button"
                onClick={() => {
                  setError("");
                  setSuccess("");
                }}
                className="ml-2"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        <section className="overflow-hidden rounded-[1.7rem] border border-slate-200 bg-white shadow-sm">
          <div className="relative p-5 sm:p-6">
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-fuchsia-600 via-violet-600 to-indigo-600" />

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-fuchsia-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-fuchsia-700">
                  <Bot size={14} />
                  CRM Workflow Automation
                </div>

                <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                  Automations
                </h1>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                  Build trigger-based workflows with conditions, actions,
                  delays, schedules, owners, error handling and run history.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50">
                  <Settings2 size={18} />
                  Global Settings
                </button>

                <button
                  type="button"
                  onClick={openCreateModal}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white shadow-lg shadow-slate-200 transition hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  <Plus size={18} />
                  New Automation
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
                  <div className="rounded-2xl bg-fuchsia-50 p-3 text-fuchsia-700">
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
              <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />

                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search automation, trigger, action, owner, tag..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    [moduleFilter, setModuleFilter, modules, "Module"],
                    [statusFilter, setStatusFilter, statuses, "Status"],
                    [
                      triggerFilter,
                      setTriggerFilter,
                      ["All", ...triggerTypes],
                      "Trigger",
                    ],
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
              <table className="w-full min-w-[1220px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Automation</th>
                    <th className="px-4 py-3">Trigger</th>
                    <th className="px-4 py-3">Condition</th>
                    <th className="px-4 py-3">Action</th>
                    <th className="px-4 py-3">Schedule</th>
                    <th className="px-4 py-3">Performance</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredAutomations.map((automation) => {
                    const ActionIcon = actionIcon(automation.actionType);

                    return (
                      <tr
                        key={automation.id}
                        className="transition hover:bg-slate-50/80"
                      >
                        <td className="px-4 py-3">
                          <div className="flex min-w-0 items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-600 to-indigo-600 text-white shadow-lg shadow-fuchsia-100">
                              <Bot size={18} />
                            </div>

                            <div className="min-w-0">
                              <p className="truncate font-black text-slate-950">
                                {automation.name}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                {automation.id} • {automation.module}
                              </p>

                              <p className="mt-1 max-w-[260px] truncate text-xs text-slate-400">
                                {automation.description}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex w-fit items-center whitespace-nowrap rounded-full px-3 py-1 text-xs font-black ring-1 ${triggerClass(
                              automation.triggerType
                            )}`}
                          >
                            {automation.triggerType}
                          </span>

                          <p className="mt-2 max-w-[170px] text-xs leading-4 text-slate-500">
                            {automation.triggerEvent}
                          </p>
                        </td>

                        <td className="px-4 py-3">
                          <p className="font-bold text-slate-800">
                            {automation.conditionField}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {automation.conditionOperator}:{" "}
                            {automation.conditionValue || "Any"}
                          </p>
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="rounded-lg bg-slate-100 p-2 text-slate-700">
                              <ActionIcon size={15} />
                            </div>

                            <div>
                              <p className="font-bold text-slate-800">
                                {automation.actionType}
                              </p>

                              <p className="mt-1 max-w-[180px] text-xs leading-4 text-slate-500">
                                {automation.actionSummary}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <p className="font-bold text-slate-800">
                            {automation.runMode}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {automation.delayValue > 0
                              ? `${automation.delayValue} ${automation.delayUnit}`
                              : "No delay"}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            Next: {formatDateTime(automation.nextRun)}
                          </p>
                        </td>

                        <td className="px-4 py-3">
                          <p className="font-black text-slate-950">
                            {successRate(automation)}%
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {automation.successRuns}/{automation.totalRuns} runs
                          </p>

                          <p className="mt-1 text-xs text-rose-500">
                            {automation.failedRuns} failed
                          </p>
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex w-fit items-center whitespace-nowrap rounded-full px-3 py-1 text-xs font-black ring-1 ${statusClass(
                              automation.status
                            )}`}
                          >
                            {automation.status}
                          </span>

                          <span
                            className={`mt-2 inline-flex w-fit items-center whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-black ring-1 ${priorityClass(
                              automation.priority
                            )}`}
                          >
                            {automation.priority}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedAutomation(automation)}
                              className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
                              title="View Details"
                            >
                              <Eye size={15} />
                            </button>

                            <button
                              onClick={() => handleRunNow(automation)}
                              className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
                              title="Run Now"
                            >
                              <PlayCircle size={15} />
                            </button>

                            <button
                              onClick={() => openEditModal(automation)}
                              className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
                              title="Edit Automation"
                            >
                              <Edit3 size={15} />
                            </button>

                            <button
                              onClick={() => handleDuplicate(automation)}
                              className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
                              title="Duplicate"
                            >
                              <Copy size={15} />
                            </button>

                            <button
                              onClick={() => handleDelete(automation.id)}
                              className="rounded-lg border border-rose-100 p-2 text-rose-500 hover:bg-rose-50"
                              title="Delete"
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

              {filteredAutomations.length === 0 && (
                <div className="p-10 text-center">
                  <Bot className="mx-auto text-slate-300" size={42} />

                  <h3 className="mt-3 text-lg font-black text-slate-900">
                    No automations found
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Change filters or create a new automation.
                  </p>
                </div>
              )}
            </div>
          </div>

          <aside className="min-w-0 space-y-4">
            <div className="rounded-[1.4rem] border border-slate-200 bg-white p-4 shadow-sm 2xl:sticky 2xl:top-6">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-base font-black text-slate-950">
                  Module Overview
                </h3>

                <MoreHorizontal className="text-slate-400" size={18} />
              </div>

              <div className="mt-4 max-h-[380px] space-y-2 overflow-y-auto pr-1">
                {moduleStats.map((item) => (
                  <div
                    key={item.module}
                    className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5"
                  >
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg bg-white p-1.5 text-fuchsia-700">
                        <Zap size={15} />
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
                Recent Runs
              </h3>

              <div className="mt-4 space-y-2">
                {recentRuns.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl bg-slate-50 px-3 py-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-xs font-black text-slate-900">
                        {item.name}
                      </p>

                      <span
                        className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-black ring-1 ${statusClass(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <p className="mt-1 text-[11px] text-slate-500">
                      Last run: {formatDateTime(item.lastRun)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.4rem] border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-base font-black text-slate-950">
                Automation Health
              </h3>

              <div className="mt-4 space-y-2">
                {[
                  ["Active", automations.filter((i) => i.status === "Active").length],
                  ["Paused", automations.filter((i) => i.status === "Paused").length],
                  ["Draft", automations.filter((i) => i.status === "Draft").length],
                  ["Failed", automations.filter((i) => i.status === "Failed").length],
                ].map(([label, count]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5"
                  >
                    <p className="text-xs font-black text-slate-700">{label}</p>

                    <span className="rounded-full bg-white px-2 py-1 text-xs font-black text-slate-500">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-3 backdrop-blur-sm sm:p-5">
          <form
            onSubmit={handleSubmit}
            className="my-4 flex h-[88vh] w-full max-w-6xl flex-col overflow-hidden rounded-[1.7rem] bg-white shadow-2xl"
          >
            <div className="shrink-0 border-b border-slate-100 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-950">
                    {editingAutomationId
                      ? "Edit Automation"
                      : "Create Automation"}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Define trigger, condition, action, schedule, ownership and
                    error handling.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={resetModal}
                  className="rounded-xl bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-5">
              <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
                <div className="space-y-4">
                  <div className="rounded-[1.3rem] border border-slate-200 p-4">
                    <h3 className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500">
                      <Bot size={15} />
                      Basic Information
                    </h3>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Automation Name"
                        className="sm:col-span-2 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-500"
                      />

                      <select
                        name="module"
                        value={form.module}
                        onChange={handleChange}
                        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold outline-none focus:border-slate-500"
                      >
                        {modules
                          .filter((item) => item !== "All")
                          .map((module) => (
                            <option key={module}>{module}</option>
                          ))}
                      </select>

                      <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold outline-none focus:border-slate-500"
                      >
                        {statuses
                          .filter((item) => item !== "All")
                          .map((status) => (
                            <option key={status}>{status}</option>
                          ))}
                      </select>

                      <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Automation description"
                        className="sm:col-span-2 resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-500"
                      />
                    </div>
                  </div>

                  <div className="rounded-[1.3rem] border border-slate-200 p-4">
                    <h3 className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500">
                      <Zap size={15} />
                      Trigger
                    </h3>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <select
                        name="triggerType"
                        value={form.triggerType}
                        onChange={handleChange}
                        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold outline-none focus:border-slate-500"
                      >
                        {triggerTypes.map((type) => (
                          <option key={type}>{type}</option>
                        ))}
                      </select>

                      <input
                        name="triggerEvent"
                        value={form.triggerEvent}
                        onChange={handleChange}
                        placeholder="Trigger Event"
                        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-500"
                      />
                    </div>
                  </div>

                  <div className="rounded-[1.3rem] border border-slate-200 p-4">
                    <h3 className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500">
                      <GitBranch size={15} />
                      Condition
                    </h3>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <input
                        name="conditionField"
                        value={form.conditionField}
                        onChange={handleChange}
                        placeholder="Field"
                        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-500"
                      />

                      <select
                        name="conditionOperator"
                        value={form.conditionOperator}
                        onChange={handleChange}
                        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold outline-none focus:border-slate-500"
                      >
                        {conditionOperators.map((operator) => (
                          <option key={operator}>{operator}</option>
                        ))}
                      </select>

                      <input
                        name="conditionValue"
                        value={form.conditionValue}
                        onChange={handleChange}
                        placeholder="Value"
                        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-500"
                      />
                    </div>
                  </div>

                  <div className="rounded-[1.3rem] border border-slate-200 p-4">
                    <h3 className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500">
                      <Send size={15} />
                      Action
                    </h3>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <select
                        name="actionType"
                        value={form.actionType}
                        onChange={handleChange}
                        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold outline-none focus:border-slate-500"
                      >
                        {actionTypes.map((type) => (
                          <option key={type}>{type}</option>
                        ))}
                      </select>

                      <select
                        name="owner"
                        value={form.owner}
                        onChange={handleChange}
                        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold outline-none focus:border-slate-500"
                      >
                        {owners.map((owner) => (
                          <option key={owner}>{owner}</option>
                        ))}
                      </select>

                      <input
                        name="actionSummary"
                        value={form.actionSummary}
                        onChange={handleChange}
                        placeholder="Action Summary"
                        className="sm:col-span-2 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-500"
                      />

                      {form.actionType === "Send Email" && (
                        <input
                          name="emailTo"
                          value={form.emailTo}
                          onChange={handleChange}
                          placeholder="Email Recipient"
                          className="sm:col-span-2 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-500"
                        />
                      )}

                      {form.actionType === "Webhook" && (
                        <input
                          name="webhookUrl"
                          value={form.webhookUrl}
                          onChange={handleChange}
                          placeholder="Webhook URL"
                          className="sm:col-span-2 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-500"
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-[1.3rem] border border-slate-200 p-4">
                    <h3 className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500">
                      <Timer size={15} />
                      Timing & Priority
                    </h3>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <select
                        name="runMode"
                        value={form.runMode}
                        onChange={handleChange}
                        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold outline-none focus:border-slate-500"
                      >
                        {runModes.map((mode) => (
                          <option key={mode}>{mode}</option>
                        ))}
                      </select>

                      <select
                        name="priority"
                        value={form.priority}
                        onChange={handleChange}
                        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold outline-none focus:border-slate-500"
                      >
                        {priorities.map((priority) => (
                          <option key={priority}>{priority}</option>
                        ))}
                      </select>

                      <input
                        name="delayValue"
                        type="number"
                        min="0"
                        value={form.delayValue}
                        onChange={handleChange}
                        placeholder="Delay Value"
                        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-500"
                      />

                      <select
                        name="delayUnit"
                        value={form.delayUnit}
                        onChange={handleChange}
                        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold outline-none focus:border-slate-500"
                      >
                        <option>Minutes</option>
                        <option>Hours</option>
                        <option>Days</option>
                        <option>Weeks</option>
                        <option>Months</option>
                      </select>
                    </div>
                  </div>

                  <div className="rounded-[1.3rem] border border-slate-200 p-4">
                    <h3 className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500">
                      <ShieldCheck size={15} />
                      Safety Controls
                    </h3>

                    <div className="space-y-3">
                      <Toggle
                        checked={form.notifyOwner}
                        onChange={(value) => setField("notifyOwner", value)}
                        label="Notify Owner"
                        description="Send notification to automation owner after run."
                      />

                      <Toggle
                        checked={form.stopOnError}
                        onChange={(value) => setField("stopOnError", value)}
                        label="Stop On Error"
                        description="Stop workflow if an action fails."
                      />

                      <Toggle
                        checked={form.requireApproval}
                        onChange={(value) => setField("requireApproval", value)}
                        label="Require Approval"
                        description="Useful for finance, deletion or external webhooks."
                      />
                    </div>
                  </div>

                  <div className="rounded-[1.3rem] border border-slate-200 p-4">
                    <h3 className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500">
                      <Tag size={15} />
                      Tags
                    </h3>

                    <input
                      name="tags"
                      value={form.tags}
                      onChange={handleChange}
                      placeholder="Tags e.g. lead, follow-up, finance"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-500"
                    />
                  </div>

                  <div className="rounded-[1.3rem] border border-slate-200 bg-slate-50 p-4">
                    <h3 className="text-xs font-black uppercase tracking-wide text-slate-500">
                      Workflow Preview
                    </h3>

                    <div className="mt-3 rounded-2xl bg-white p-4">
                      <p className="text-sm font-black text-slate-950">
                        {form.triggerType} → {form.actionType}
                      </p>

                      <p className="mt-2 text-sm leading-5 text-slate-500">
                        If <strong>{form.conditionField || "Field"}</strong>{" "}
                        {form.conditionOperator}{" "}
                        <strong>{form.conditionValue || "Value"}</strong>, then{" "}
                        {form.actionSummary || "perform selected action"}.
                      </p>

                      <p className="mt-3 text-xs font-bold text-slate-500">
                        Run Mode: {form.runMode} • Owner: {form.owner}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="shrink-0 border-t border-slate-100 bg-white p-5">
              <div className="flex flex-col justify-end gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={resetModal}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-black text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-slate-950 px-6 py-2.5 text-sm font-black text-white hover:bg-slate-800"
                >
                  {editingAutomationId
                    ? "Update Automation"
                    : "Create Automation"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {selectedAutomation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="my-8 w-full max-w-5xl rounded-[1.7rem] bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-600 to-indigo-600 text-white shadow-lg shadow-fuchsia-100">
                  <Bot size={24} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                    {selectedAutomation.id} • {selectedAutomation.module}
                  </p>

                  <h2 className="mt-1 break-words text-2xl font-black text-slate-950">
                    {selectedAutomation.name}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {selectedAutomation.triggerType} →{" "}
                    {selectedAutomation.actionType}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAutomation(null)}
                className="rounded-xl bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["Status", selectedAutomation.status, PlayCircle],
                ["Priority", selectedAutomation.priority, AlertCircle],
                ["Owner", selectedAutomation.owner, UserCheck],
                ["Run Mode", selectedAutomation.runMode, Clock3],
                [
                  "Delay",
                  selectedAutomation.delayValue > 0
                    ? `${selectedAutomation.delayValue} ${selectedAutomation.delayUnit}`
                    : "No delay",
                  Timer,
                ],
                ["Success Rate", `${successRate(selectedAutomation)}%`, Activity],
                ["Total Runs", selectedAutomation.totalRuns, RefreshCcw],
                ["Success Runs", selectedAutomation.successRuns, CheckCircle2],
                ["Failed Runs", selectedAutomation.failedRuns, AlertCircle],
                ["Last Run", formatDateTime(selectedAutomation.lastRun), History],
                ["Next Run", formatDateTime(selectedAutomation.nextRun), CalendarClock],
                ["Created", formatDate(selectedAutomation.createdAt), Clock3],
                ["Updated", formatDate(selectedAutomation.updatedAt), Edit3],
                [
                  "Require Approval",
                  selectedAutomation.requireApproval ? "Yes" : "No",
                  ShieldCheck,
                ],
                [
                  "Stop On Error",
                  selectedAutomation.stopOnError ? "Yes" : "No",
                  PauseCircle,
                ],
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
                  Trigger
                </p>

                <p className="mt-2 text-sm font-bold text-slate-800">
                  {selectedAutomation.triggerEvent}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-black uppercase text-slate-400">
                  Condition
                </p>

                <p className="mt-2 text-sm font-bold text-slate-800">
                  {selectedAutomation.conditionField}{" "}
                  {selectedAutomation.conditionOperator}{" "}
                  {selectedAutomation.conditionValue || "Any"}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-black uppercase text-slate-400">
                  Action
                </p>

                <p className="mt-2 text-sm font-bold text-slate-800">
                  {selectedAutomation.actionSummary}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-black uppercase text-slate-400">
                  Tags
                </p>

                <p className="mt-2 text-sm font-bold text-slate-800">
                  {selectedAutomation.tags || "No tags"}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-black uppercase text-slate-400">
                Run History
              </p>

              <div className="mt-3 space-y-2">
                {(selectedAutomation.auditLog || []).map((log, index) => (
                  <div
                    key={`${log}-${index}`}
                    className="rounded-xl bg-white px-3 py-2 text-sm font-bold text-slate-700"
                  >
                    {log}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-black text-slate-700 hover:bg-slate-50"
                onClick={() => setSelectedAutomation(null)}
              >
                Close
              </button>

              <button
                onClick={() => handleRunNow(selectedAutomation)}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-black text-slate-700 hover:bg-slate-50"
              >
                Run Now
              </button>

              <button
                onClick={() => {
                  setSelectedAutomation(null);
                  openEditModal(selectedAutomation);
                }}
                className="flex-1 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-black text-white hover:bg-slate-800"
              >
                Edit Automation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Automations;