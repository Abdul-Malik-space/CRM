import { useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  Archive,
  Bell,
  BellRing,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Edit3,
  Eye,
  Filter,
  Mail,
  MessageSquareText,
  MonitorSmartphone,
  MoreHorizontal,
  Phone,
  Plus,
  RefreshCcw,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  Smartphone,
  Tag,
  Trash2,
  UserCheck,
  Users,
  X,
  Zap,
} from "lucide-react";

const notificationTypes = [
  "All",
  "Lead Alert",
  "Deal Alert",
  "Task Reminder",
  "Payment Alert",
  "Project Update",
  "Document Alert",
  "Communication Alert",
  "System Alert",
  "Security Alert",
];

const statuses = ["All", "Unread", "Read", "Snoozed", "Archived"];

const priorities = ["All", "Low", "Medium", "High", "Critical"];

const channels = [
  "All",
  "In-App",
  "Email",
  "SMS",
  "WhatsApp",
  "Push",
];

const recipients = [
  "Admin User",
  "Sales Team",
  "Support Team",
  "Marketing Team",
  "Finance Team",
  "Operations Team",
];

const ruleTriggers = [
  "New Lead Created",
  "Deal Stage Changed",
  "Task Due Soon",
  "Payment Overdue",
  "Project Status Changed",
  "Document Uploaded",
  "Customer Message Received",
  "Login From New Device",
];

const modules = [
  "Leads",
  "Deals",
  "Tasks",
  "Payments",
  "Projects",
  "Documents",
  "Communications",
  "Security",
];

const demoNotifications = [
  {
    id: "NTF-1001",
    title: "New website lead assigned",
    message:
      "ABC School submitted a website development inquiry and has been assigned to Sales Team.",
    type: "Lead Alert",
    module: "Leads",
    status: "Unread",
    priority: "High",
    channel: "In-App",
    recipient: "Sales Team",
    relatedRecord: "ABC School Website Lead",
    createdAt: "2026-06-19T10:20",
    dueAt: "2026-06-19T15:00",
    source: "Website Form",
    actionRequired: true,
    starred: true,
    readBy: [],
    tags: "lead, website, urgent",
  },
  {
    id: "NTF-1002",
    title: "Payment overdue",
    message:
      "Invoice INV-2041 for Khan Traders is overdue. Finance follow-up is required.",
    type: "Payment Alert",
    module: "Payments",
    status: "Unread",
    priority: "Critical",
    channel: "Email",
    recipient: "Finance Team",
    relatedRecord: "Khan Traders Invoice INV-2041",
    createdAt: "2026-06-19T09:00",
    dueAt: "2026-06-19T12:00",
    source: "Payment Automation",
    actionRequired: true,
    starred: true,
    readBy: ["Admin User"],
    tags: "payment, overdue, finance",
  },
  {
    id: "NTF-1003",
    title: "Follow-up task due soon",
    message:
      "Proposal follow-up for Growth Mart is due in 1 hour.",
    type: "Task Reminder",
    module: "Tasks",
    status: "Snoozed",
    priority: "Medium",
    channel: "Push",
    recipient: "Ahsan Ali",
    relatedRecord: "Growth Mart Proposal Follow-up",
    createdAt: "2026-06-19T08:30",
    dueAt: "2026-06-19T11:30",
    source: "Task Reminder",
    actionRequired: true,
    starred: false,
    readBy: ["Ahsan Ali"],
    tags: "task, follow-up",
  },
  {
    id: "NTF-1004",
    title: "Document uploaded",
    message:
      "New contract file has been uploaded for Maria Boutique project.",
    type: "Document Alert",
    module: "Documents",
    status: "Read",
    priority: "Low",
    channel: "In-App",
    recipient: "Operations Team",
    relatedRecord: "Maria Boutique Contract",
    createdAt: "2026-06-18T16:00",
    dueAt: "",
    source: "Document Vault",
    actionRequired: false,
    starred: false,
    readBy: ["Operations Team"],
    tags: "document, contract",
  },
  {
    id: "NTF-1005",
    title: "New login from device",
    message:
      "Admin User logged in from a new device. Review if this was expected.",
    type: "Security Alert",
    module: "Security",
    status: "Unread",
    priority: "Critical",
    channel: "Email",
    recipient: "Admin User",
    relatedRecord: "Admin User Session",
    createdAt: "2026-06-19T07:45",
    dueAt: "2026-06-19T09:00",
    source: "Security Monitor",
    actionRequired: true,
    starred: true,
    readBy: [],
    tags: "security, login",
  },
];

const demoRules = [
  {
    id: "RUL-1001",
    name: "New Lead Instant Alert",
    trigger: "New Lead Created",
    module: "Leads",
    channel: "In-App",
    recipient: "Sales Team",
    priority: "High",
    enabled: true,
    frequency: "Instant",
  },
  {
    id: "RUL-1002",
    name: "Payment Overdue Email",
    trigger: "Payment Overdue",
    module: "Payments",
    channel: "Email",
    recipient: "Finance Team",
    priority: "Critical",
    enabled: true,
    frequency: "Instant",
  },
  {
    id: "RUL-1003",
    name: "Task Reminder Push",
    trigger: "Task Due Soon",
    module: "Tasks",
    channel: "Push",
    recipient: "Task Owner",
    priority: "Medium",
    enabled: true,
    frequency: "1 hour before",
  },
];

const emptyNotificationForm = {
  title: "",
  message: "",
  type: "Lead Alert",
  module: "Leads",
  status: "Unread",
  priority: "Medium",
  channel: "In-App",
  recipient: "Admin User",
  relatedRecord: "",
  dueAt: "",
  source: "",
  actionRequired: true,
  starred: false,
  tags: "",
};

const emptyRuleForm = {
  name: "",
  trigger: "New Lead Created",
  module: "Leads",
  channel: "In-App",
  recipient: "Admin User",
  priority: "Medium",
  frequency: "Instant",
  enabled: true,
};

function formatDateTime(value) {
  if (!value) return "Not set";

  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isOverdue(value, status) {
  if (!value || status === "Archived") return false;
  return new Date(value).getTime() < new Date().getTime();
}

function typeClass(type) {
  return (
    {
      "Lead Alert": "bg-blue-50 text-blue-700 ring-blue-200",
      "Deal Alert": "bg-indigo-50 text-indigo-700 ring-indigo-200",
      "Task Reminder": "bg-violet-50 text-violet-700 ring-violet-200",
      "Payment Alert": "bg-amber-50 text-amber-700 ring-amber-200",
      "Project Update": "bg-emerald-50 text-emerald-700 ring-emerald-200",
      "Document Alert": "bg-slate-100 text-slate-700 ring-slate-200",
      "Communication Alert": "bg-sky-50 text-sky-700 ring-sky-200",
      "System Alert": "bg-cyan-50 text-cyan-700 ring-cyan-200",
      "Security Alert": "bg-rose-50 text-rose-700 ring-rose-200",
    }[type] || "bg-slate-100 text-slate-700 ring-slate-200"
  );
}

function statusClass(status) {
  return (
    {
      Unread: "bg-blue-50 text-blue-700 ring-blue-200",
      Read: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      Snoozed: "bg-amber-50 text-amber-700 ring-amber-200",
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

function channelIcon(channel) {
  const icons = {
    "In-App": Bell,
    Email: Mail,
    SMS: Phone,
    WhatsApp: MessageSquareText,
    Push: Smartphone,
  };

  return icons[channel] || Bell;
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

function Notifications() {
  const [notifications, setNotifications] = useState(demoNotifications);
  const [rules, setRules] = useState(demoRules);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [notificationForm, setNotificationForm] = useState(emptyNotificationForm);
  const [ruleForm, setRuleForm] = useState(emptyRuleForm);
  const [editingRuleId, setEditingRuleId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const filteredNotifications = useMemo(() => {
    const q = search.toLowerCase().trim();

    return notifications.filter((item) => {
      const searchOk =
        !q ||
        [
          item.id,
          item.title,
          item.message,
          item.type,
          item.module,
          item.status,
          item.priority,
          item.channel,
          item.recipient,
          item.relatedRecord,
          item.source,
          item.tags,
        ]
          .join(" ")
          .toLowerCase()
          .includes(q);

      const typeOk = typeFilter === "All" || item.type === typeFilter;
      const statusOk = statusFilter === "All" || item.status === statusFilter;
      const priorityOk =
        priorityFilter === "All" || item.priority === priorityFilter;

      return searchOk && typeOk && statusOk && priorityOk;
    });
  }, [notifications, search, typeFilter, statusFilter, priorityFilter]);

  const stats = [
    {
      label: "Total Notifications",
      value: notifications.length,
      note: "All alerts",
      icon: BellRing,
    },
    {
      label: "Unread",
      value: notifications.filter((item) => item.status === "Unread").length,
      note: "Need attention",
      icon: Bell,
    },
    {
      label: "Critical",
      value: notifications.filter((item) => item.priority === "Critical").length,
      note: "High risk",
      icon: AlertCircle,
    },
    {
      label: "Action Required",
      value: notifications.filter((item) => item.actionRequired).length,
      note: "Pending action",
      icon: Zap,
    },
  ];

  const channelStats = channels
    .filter((item) => item !== "All")
    .map((channel) => ({
      channel,
      count: notifications.filter((item) => item.channel === channel).length,
    }));

  const typeStats = notificationTypes
    .filter((item) => item !== "All")
    .map((type) => ({
      type,
      count: notifications.filter((item) => item.type === type).length,
    }));

  function setNotificationField(name, value) {
    setNotificationForm((prev) => ({ ...prev, [name]: value }));
  }

  function setRuleField(name, value) {
    setRuleForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleNotificationChange(event) {
    const { name, value } = event.target;
    setNotificationField(name, value);
  }

  function handleRuleChange(event) {
    const { name, value } = event.target;
    setRuleField(name, value);
  }

  function resetNotificationModal() {
    setNotificationForm(emptyNotificationForm);
    setError("");
    setShowNotificationModal(false);
  }

  function resetRuleModal() {
    setRuleForm(emptyRuleForm);
    setEditingRuleId(null);
    setError("");
    setShowRuleModal(false);
  }

  function handleCreateNotification(event) {
    event.preventDefault();
    setError("");

    if (!notificationForm.title.trim()) {
      setError("Notification title is required.");
      return;
    }

    if (!notificationForm.message.trim()) {
      setError("Notification message is required.");
      return;
    }

    const newNotification = {
      id: `NTF-${1000 + notifications.length + 1}`,
      ...notificationForm,
      createdAt: new Date().toISOString(),
      readBy: [],
    };

    setNotifications((prev) => [newNotification, ...prev]);
    setSuccess("Notification created successfully.");
    resetNotificationModal();
  }

  function handleRuleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!ruleForm.name.trim()) {
      setError("Rule name is required.");
      return;
    }

    const payload = { ...ruleForm };

    if (editingRuleId) {
      setRules((prev) =>
        prev.map((rule) => (rule.id === editingRuleId ? { ...rule, ...payload } : rule))
      );
      setSuccess("Notification rule updated successfully.");
      resetRuleModal();
      return;
    }

    const newRule = {
      id: `RUL-${1000 + rules.length + 1}`,
      ...payload,
    };

    setRules((prev) => [newRule, ...prev]);
    setSuccess("Notification rule created successfully.");
    resetRuleModal();
  }

  function openEditRule(rule) {
    setEditingRuleId(rule.id);
    setRuleForm({
      name: rule.name,
      trigger: rule.trigger,
      module: rule.module,
      channel: rule.channel,
      recipient: rule.recipient,
      priority: rule.priority,
      frequency: rule.frequency,
      enabled: rule.enabled,
    });
    setShowRuleModal(true);
  }

  function updateNotification(id, updates) {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );

    setSelectedNotification((prev) =>
      prev && prev.id === id ? { ...prev, ...updates } : prev
    );
  }

  function markAllRead() {
    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        status: item.status === "Unread" ? "Read" : item.status,
      }))
    );

    setSuccess("All unread notifications marked as read.");
  }

  function deleteNotification(id) {
    setNotifications((prev) => prev.filter((item) => item.id !== id));

    if (selectedNotification?.id === id) {
      setSelectedNotification(null);
    }
  }

  function deleteRule(id) {
    setRules((prev) => prev.filter((rule) => rule.id !== id));
  }

  function toggleRule(rule) {
    setRules((prev) =>
      prev.map((item) =>
        item.id === rule.id ? { ...item, enabled: !item.enabled } : item
      )
    );
  }

  function openNotification(item) {
    setSelectedNotification(item);

    if (item.status === "Unread") {
      updateNotification(item.id, { status: "Read" });
    }
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
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500" />

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-rose-700">
                  <BellRing size={14} />
                  CRM Notification Center
                </div>

                <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                  Notifications
                </h1>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                  Manage CRM alerts, reminders, system messages, priority
                  notifications, delivery channels, rules and user preferences.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={markAllRead}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  <CheckCircle2 size={18} />
                  Mark All Read
                </button>

                <button
                  type="button"
                  onClick={() => setShowRuleModal(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  <Settings2 size={18} />
                  Add Rule
                </button>

                <button
                  type="button"
                  onClick={() => setShowNotificationModal(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white shadow-lg shadow-slate-200 transition hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  <Plus size={18} />
                  New Notification
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
                  <div className="rounded-2xl bg-rose-50 p-3 text-rose-700">
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
                    placeholder="Search title, message, module, recipient, tags..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    [typeFilter, setTypeFilter, notificationTypes, "Type"],
                    [statusFilter, setStatusFilter, statuses, "Status"],
                    [priorityFilter, setPriorityFilter, priorities, "Priority"],
                  ].map(([value, setter, options, label]) => (
                    <div key={label} className="relative">
                      {label === "Type" && (
                        <Filter
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                          size={16}
                        />
                      )}

                      <select
                        value={value}
                        onChange={(event) => setter(event.target.value)}
                        className={`w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pr-9 text-sm font-bold text-slate-700 outline-none ${
                          label === "Type" ? "pl-10" : "pl-4"
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
              <table className="w-full min-w-[1180px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Notification</th>
                    <th className="px-4 py-3">Recipient</th>
                    <th className="px-4 py-3">Channel</th>
                    <th className="px-4 py-3">Related Record</th>
                    <th className="px-4 py-3">Due / SLA</th>
                    <th className="px-4 py-3">Priority</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredNotifications.map((item) => {
                    const ChannelIcon = channelIcon(item.channel);
                    const overdue = isOverdue(item.dueAt, item.status);

                    return (
                      <tr key={item.id} className="transition hover:bg-slate-50/80">
                        <td className="px-4 py-3">
                          <div className="flex min-w-0 items-start gap-3">
                            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-600 to-orange-500 text-white shadow-lg shadow-rose-100">
                              <BellRing size={18} />

                              {item.status === "Unread" && (
                                <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-blue-500 ring-2 ring-white" />
                              )}
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="truncate font-black text-slate-950">
                                  {item.title}
                                </p>

                                {item.starred && (
                                  <Zap
                                    size={14}
                                    className="shrink-0 fill-amber-400 text-amber-400"
                                  />
                                )}
                              </div>

                              <p className="mt-1 text-xs text-slate-500">
                                {item.id} • {item.module}
                              </p>

                              <p className="mt-1 max-w-[310px] truncate text-xs text-slate-400">
                                {item.message}
                              </p>

                              <span
                                className={`mt-2 inline-flex w-fit items-center whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-black ring-1 ${typeClass(
                                  item.type
                                )}`}
                              >
                                {item.type}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <p className="font-bold text-slate-800">
                            {item.recipient}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            Source: {item.source}
                          </p>
                        </td>

                        <td className="px-4 py-3">
                          <span className="inline-flex w-fit items-center gap-1 whitespace-nowrap rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700 ring-1 ring-slate-200">
                            <ChannelIcon size={12} />
                            {item.channel}
                          </span>

                          <p className="mt-2 text-xs text-slate-500">
                            {formatDateTime(item.createdAt)}
                          </p>
                        </td>

                        <td className="px-4 py-3">
                          <p className="max-w-[190px] font-bold text-slate-800">
                            {item.relatedRecord || "Not linked"}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {item.actionRequired
                              ? "Action required"
                              : "Information only"}
                          </p>
                        </td>

                        <td className="px-4 py-3">
                          <p
                            className={`font-bold ${
                              overdue ? "text-rose-600" : "text-slate-800"
                            }`}
                          >
                            {formatDateTime(item.dueAt)}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {overdue ? "Overdue" : "On track"}
                          </p>
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex w-fit items-center whitespace-nowrap rounded-full px-3 py-1 text-xs font-black ring-1 ${priorityClass(
                              item.priority
                            )}`}
                          >
                            {item.priority}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex w-fit items-center whitespace-nowrap rounded-full px-3 py-1 text-xs font-black ring-1 ${statusClass(
                              item.status
                            )}`}
                          >
                            {item.status}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openNotification(item)}
                              className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
                              title="View Details"
                            >
                              <Eye size={15} />
                            </button>

                            <button
                              onClick={() =>
                                updateNotification(item.id, {
                                  starred: !item.starred,
                                })
                              }
                              className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
                              title="Highlight"
                            >
                              <Zap
                                size={15}
                                className={
                                  item.starred
                                    ? "fill-amber-400 text-amber-400"
                                    : ""
                                }
                              />
                            </button>

                            <select
                              value={item.status}
                              onChange={(event) =>
                                updateNotification(item.id, {
                                  status: event.target.value,
                                })
                              }
                              className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs font-bold text-slate-600 outline-none"
                            >
                              {statuses
                                .filter((status) => status !== "All")
                                .map((status) => (
                                  <option key={status}>{status}</option>
                                ))}
                            </select>

                            <button
                              onClick={() => deleteNotification(item.id)}
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

              {filteredNotifications.length === 0 && (
                <div className="p-10 text-center">
                  <BellRing className="mx-auto text-slate-300" size={42} />

                  <h3 className="mt-3 text-lg font-black text-slate-900">
                    No notifications found
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Change filters or create a new notification.
                  </p>
                </div>
              )}
            </div>
          </div>

          <aside className="min-w-0 space-y-4">
            <div className="rounded-[1.4rem] border border-slate-200 bg-white p-4 shadow-sm 2xl:sticky 2xl:top-6">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-base font-black text-slate-950">
                  Channel Overview
                </h3>

                <MoreHorizontal className="text-slate-400" size={18} />
              </div>

              <div className="mt-4 space-y-2">
                {channelStats.map((item) => {
                  const Icon = channelIcon(item.channel);

                  return (
                    <div
                      key={item.channel}
                      className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5"
                    >
                      <div className="flex items-center gap-2">
                        <div className="rounded-lg bg-white p-1.5 text-rose-700">
                          <Icon size={15} />
                        </div>

                        <span className="text-xs font-black text-slate-700">
                          {item.channel}
                        </span>
                      </div>

                      <span className="rounded-full bg-white px-2 py-1 text-xs font-black text-slate-500">
                        {item.count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[1.4rem] border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-base font-black text-slate-950">
                Notification Types
              </h3>

              <div className="mt-4 max-h-[360px] space-y-2 overflow-y-auto pr-1">
                {typeStats.map((item) => (
                  <div
                    key={item.type}
                    className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2.5"
                  >
                    <p className="truncate text-xs font-black text-slate-900">
                      {item.type}
                    </p>

                    <span className="rounded-full bg-white px-2 py-1 text-xs font-black text-slate-500">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.4rem] border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-base font-black text-slate-950">
                Notification Rules
              </h3>

              <div className="mt-4 space-y-2">
                {rules.map((rule) => (
                  <div key={rule.id} className="rounded-xl bg-slate-50 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-xs font-black text-slate-900">
                          {rule.name}
                        </p>

                        <p className="mt-1 text-[11px] text-slate-500">
                          {rule.trigger} → {rule.channel}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleRule(rule)}
                        className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-black ${
                          rule.enabled
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {rule.enabled ? "On" : "Off"}
                      </button>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={() => openEditRule(rule)}
                        className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 hover:bg-slate-50"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteRule(rule.id)}
                        className="rounded-lg border border-rose-100 bg-white px-3 py-2 text-xs font-black text-rose-500 hover:bg-rose-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </div>

      {showNotificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-3 backdrop-blur-sm sm:p-5">
          <form
            onSubmit={handleCreateNotification}
            className="my-4 flex h-[86vh] w-full max-w-5xl flex-col overflow-hidden rounded-[1.7rem] bg-white shadow-2xl"
          >
            <div className="shrink-0 border-b border-slate-100 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-950">
                    Create Notification
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Create a manual alert, reminder or internal CRM notification.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={resetNotificationModal}
                  className="rounded-xl bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-5">
              <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
                <div className="space-y-4">
                  <div className="rounded-[1.3rem] border border-slate-200 p-4">
                    <h3 className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500">
                      <BellRing size={15} />
                      Notification Details
                    </h3>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        name="title"
                        value={notificationForm.title}
                        onChange={handleNotificationChange}
                        placeholder="Notification Title"
                        className="sm:col-span-2 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-500"
                      />

                      <select
                        name="type"
                        value={notificationForm.type}
                        onChange={handleNotificationChange}
                        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold outline-none focus:border-slate-500"
                      >
                        {notificationTypes
                          .filter((type) => type !== "All")
                          .map((type) => (
                            <option key={type}>{type}</option>
                          ))}
                      </select>

                      <select
                        name="module"
                        value={notificationForm.module}
                        onChange={handleNotificationChange}
                        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold outline-none focus:border-slate-500"
                      >
                        {modules.map((module) => (
                          <option key={module}>{module}</option>
                        ))}
                      </select>

                      <textarea
                        name="message"
                        value={notificationForm.message}
                        onChange={handleNotificationChange}
                        rows={5}
                        placeholder="Notification message"
                        className="sm:col-span-2 resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-500"
                      />
                    </div>
                  </div>

                  <div className="rounded-[1.3rem] border border-slate-200 p-4">
                    <h3 className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500">
                      <Send size={15} />
                      Delivery
                    </h3>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <select
                        name="channel"
                        value={notificationForm.channel}
                        onChange={handleNotificationChange}
                        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold outline-none focus:border-slate-500"
                      >
                        {channels
                          .filter((channel) => channel !== "All")
                          .map((channel) => (
                            <option key={channel}>{channel}</option>
                          ))}
                      </select>

                      <select
                        name="recipient"
                        value={notificationForm.recipient}
                        onChange={handleNotificationChange}
                        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold outline-none focus:border-slate-500"
                      >
                        {recipients.map((recipient) => (
                          <option key={recipient}>{recipient}</option>
                        ))}
                      </select>

                      <select
                        name="priority"
                        value={notificationForm.priority}
                        onChange={handleNotificationChange}
                        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold outline-none focus:border-slate-500"
                      >
                        {priorities
                          .filter((priority) => priority !== "All")
                          .map((priority) => (
                            <option key={priority}>{priority}</option>
                          ))}
                      </select>

                      <select
                        name="status"
                        value={notificationForm.status}
                        onChange={handleNotificationChange}
                        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold outline-none focus:border-slate-500"
                      >
                        {statuses
                          .filter((status) => status !== "All")
                          .map((status) => (
                            <option key={status}>{status}</option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-[1.3rem] border border-slate-200 p-4">
                    <h3 className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500">
                      <Archive size={15} />
                      CRM Link
                    </h3>

                    <input
                      name="relatedRecord"
                      value={notificationForm.relatedRecord}
                      onChange={handleNotificationChange}
                      placeholder="Related Record"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-500"
                    />

                    <input
                      name="source"
                      value={notificationForm.source}
                      onChange={handleNotificationChange}
                      placeholder="Source"
                      className="mt-3 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-500"
                    />

                    <input
                      name="dueAt"
                      type="datetime-local"
                      value={notificationForm.dueAt}
                      onChange={handleNotificationChange}
                      className="mt-3 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-500"
                    />

                    <input
                      name="tags"
                      value={notificationForm.tags}
                      onChange={handleNotificationChange}
                      placeholder="Tags"
                      className="mt-3 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-500"
                    />
                  </div>

                  <div className="rounded-[1.3rem] border border-slate-200 p-4">
                    <h3 className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500">
                      <ShieldCheck size={15} />
                      Controls
                    </h3>

                    <div className="space-y-3">
                      <Toggle
                        checked={notificationForm.actionRequired}
                        onChange={(value) =>
                          setNotificationField("actionRequired", value)
                        }
                        label="Action Required"
                        description="Mark this notification as a task-like alert."
                      />

                      <Toggle
                        checked={notificationForm.starred}
                        onChange={(value) =>
                          setNotificationField("starred", value)
                        }
                        label="Highlight Notification"
                        description="Pin attention to important alerts."
                      />
                    </div>
                  </div>

                  <div className="rounded-[1.3rem] border border-slate-200 bg-slate-50 p-4">
                    <h3 className="text-xs font-black uppercase tracking-wide text-slate-500">
                      Preview
                    </h3>

                    <div className="mt-3 rounded-2xl bg-white p-4">
                      <p className="text-sm font-black text-slate-950">
                        {notificationForm.title || "Notification title"}
                      </p>

                      <p className="mt-2 text-sm leading-5 text-slate-500">
                        {notificationForm.message || "Notification message preview."}
                      </p>

                      <p className="mt-3 text-xs font-bold text-slate-500">
                        {notificationForm.channel} → {notificationForm.recipient}
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
                  onClick={resetNotificationModal}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-black text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-slate-950 px-6 py-2.5 text-sm font-black text-white hover:bg-slate-800"
                >
                  Create Notification
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {showRuleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-3 backdrop-blur-sm sm:p-5">
          <form
            onSubmit={handleRuleSubmit}
            className="my-4 w-full max-w-3xl overflow-hidden rounded-[1.7rem] bg-white shadow-2xl"
          >
            <div className="border-b border-slate-100 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-950">
                    {editingRuleId ? "Edit Rule" : "Create Notification Rule"}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Define when, where and to whom CRM notifications should be sent.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={resetRuleModal}
                  className="rounded-xl bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  name="name"
                  value={ruleForm.name}
                  onChange={handleRuleChange}
                  placeholder="Rule Name"
                  className="sm:col-span-2 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-500"
                />

                <select
                  name="trigger"
                  value={ruleForm.trigger}
                  onChange={handleRuleChange}
                  className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold outline-none focus:border-slate-500"
                >
                  {ruleTriggers.map((trigger) => (
                    <option key={trigger}>{trigger}</option>
                  ))}
                </select>

                <select
                  name="module"
                  value={ruleForm.module}
                  onChange={handleRuleChange}
                  className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold outline-none focus:border-slate-500"
                >
                  {modules.map((module) => (
                    <option key={module}>{module}</option>
                  ))}
                </select>

                <select
                  name="channel"
                  value={ruleForm.channel}
                  onChange={handleRuleChange}
                  className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold outline-none focus:border-slate-500"
                >
                  {channels
                    .filter((channel) => channel !== "All")
                    .map((channel) => (
                      <option key={channel}>{channel}</option>
                    ))}
                </select>

                <select
                  name="recipient"
                  value={ruleForm.recipient}
                  onChange={handleRuleChange}
                  className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold outline-none focus:border-slate-500"
                >
                  {recipients.map((recipient) => (
                    <option key={recipient}>{recipient}</option>
                  ))}
                </select>

                <select
                  name="priority"
                  value={ruleForm.priority}
                  onChange={handleRuleChange}
                  className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold outline-none focus:border-slate-500"
                >
                  {priorities
                    .filter((priority) => priority !== "All")
                    .map((priority) => (
                      <option key={priority}>{priority}</option>
                    ))}
                </select>

                <input
                  name="frequency"
                  value={ruleForm.frequency}
                  onChange={handleRuleChange}
                  placeholder="Frequency e.g. Instant, Daily Digest"
                  className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-500"
                />

                <div className="sm:col-span-2">
                  <Toggle
                    checked={ruleForm.enabled}
                    onChange={(value) => setRuleField("enabled", value)}
                    label="Enable Rule"
                    description="Turn this rule on or off without deleting it."
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 bg-white p-5">
              <div className="flex flex-col justify-end gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={resetRuleModal}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-black text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-slate-950 px-6 py-2.5 text-sm font-black text-white hover:bg-slate-800"
                >
                  {editingRuleId ? "Update Rule" : "Create Rule"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {selectedNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="my-8 w-full max-w-5xl rounded-[1.7rem] bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-600 to-orange-500 text-white shadow-lg shadow-rose-100">
                  <BellRing size={24} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                    {selectedNotification.id} • {selectedNotification.module}
                  </p>

                  <h2 className="mt-1 break-words text-2xl font-black text-slate-950">
                    {selectedNotification.title}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {selectedNotification.type} • {selectedNotification.channel}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedNotification(null)}
                className="rounded-xl bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["Recipient", selectedNotification.recipient, Users],
                ["Priority", selectedNotification.priority, AlertCircle],
                ["Status", selectedNotification.status, CheckCircle2],
                ["Channel", selectedNotification.channel, MonitorSmartphone],
                ["Source", selectedNotification.source, Activity],
                ["Related Record", selectedNotification.relatedRecord, Archive],
                ["Created", formatDateTime(selectedNotification.createdAt), Clock3],
                ["Due", formatDateTime(selectedNotification.dueAt), CalendarClock],
                [
                  "Action Required",
                  selectedNotification.actionRequired ? "Yes" : "No",
                  Zap,
                ],
                ["Read By", selectedNotification.readBy?.join(", ") || "None", Eye],
                ["Tags", selectedNotification.tags || "No tags", Tag],
                ["Module", selectedNotification.module, ShieldCheck],
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

            <div className="mt-5 rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-black uppercase text-slate-400">
                Message
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-700">
                {selectedNotification.message}
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-black text-slate-700 hover:bg-slate-50"
                onClick={() => setSelectedNotification(null)}
              >
                Close
              </button>

              <button
                onClick={() =>
                  updateNotification(selectedNotification.id, { status: "Read" })
                }
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-black text-slate-700 hover:bg-slate-50"
              >
                Mark Read
              </button>

              <button
                onClick={() =>
                  updateNotification(selectedNotification.id, {
                    status: "Archived",
                  })
                }
                className="flex-1 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-black text-white hover:bg-slate-800"
              >
                Archive
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Notifications;