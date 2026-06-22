import { useMemo, useState } from "react";
import PageTitle from "../components/PageTitle";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import {
  AlertTriangle,
  BadgeDollarSign,
  BarChart3,
  BellRing,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  ClipboardList,
  CreditCard,
  Download,
  Eye,
  Filter,
  Handshake,
  Layers3,
  MessageCircle,
  Phone,
  RefreshCcw,
  Search,
  Target,
  TimerReset,
  TrendingUp,
  Trophy,
  UsersRound,
  WalletCards,
  Zap,
} from "lucide-react";

import {
  leads as initialLeads,
  customers as initialCustomers,
  deals as initialDeals,
  followUps as initialFollowUps,
  tasks as initialTasks,
  revenueChartData,
  leadSourceChartData,
  dealStageChartData,
  conversionChartData,
} from "../data/crmData";

const CURRENCY = "PKR";

const chartColors = ["#020617", "#2563eb", "#059669", "#f59e0b", "#ef4444"];

const dateRanges = [
  { label: "All Time", value: "all" },
  { label: "Today", value: "today" },
  { label: "Last 7 Days", value: "last7" },
  { label: "Last 30 Days", value: "last30" },
  { label: "This Month", value: "thisMonth" },
];

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function parseAmount(value) {
  if (typeof value === "number") return value;

  const text = String(value || "").toLowerCase();
  const multiplier = text.includes("m") ? 1000000 : text.includes("k") ? 1000 : 1;
  const cleaned = text.replace(/[^\d.]/g, "");

  return Number(cleaned || 0) * multiplier;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: CURRENCY,
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-PK").format(Number(value || 0));
}

function formatPercent(value) {
  return `${Number(value || 0).toFixed(1)}%`;
}

function formatDate(value) {
  if (!value) return "N/A";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function formatTime(value) {
  if (!value) return "N/A";

  const [hour, minute] = String(value).split(":");

  if (!hour || !minute) return value;

  const date = new Date();
  date.setHours(Number(hour), Number(minute));

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isWithinRange(dateValue, range) {
  if (range === "all") return true;
  if (!dateValue) return true;

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return true;

  const today = new Date();
  const todayString = getToday();
  const start = new Date();

  if (range === "today") {
    return dateValue === todayString;
  }

  if (range === "last7") {
    start.setDate(today.getDate() - 7);
    return date >= start && date <= today;
  }

  if (range === "last30") {
    start.setDate(today.getDate() - 30);
    return date >= start && date <= today;
  }

  if (range === "thisMonth") {
    return (
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  return true;
}

function normalizeLead(lead, index) {
  return {
    id: lead.id ?? index + 1,
    name: lead.name ?? "",
    phone: lead.phone ?? "",
    service: lead.service ?? "Unknown Service",
    source: lead.source ?? "Unknown",
    status: lead.status ?? "New",
    priority: lead.priority ?? "Medium",
    createdAt: lead.createdAt ?? getToday(),
  };
}

function normalizeCustomer(customer, index) {
  const totalValue = parseAmount(customer.totalValue ?? customer.amount ?? 0);
  const paidAmount = parseAmount(customer.paidAmount ?? 0);

  return {
    id: customer.id ?? index + 1,
    name: customer.name ?? "",
    phone: customer.phone ?? "",
    service: customer.service ?? "Unknown Service",
    status: customer.status ?? "Active",
    paymentStatus: customer.paymentStatus ?? "Pending",
    totalValue,
    paidAmount,
    balance: Math.max(0, totalValue - paidAmount),
    createdAt: customer.createdAt ?? getToday(),
  };
}

function normalizeDeal(deal, index) {
  const stage = deal.stage ?? "Requirement Taken";
  const amount = parseAmount(deal.amount ?? 0);

  return {
    id: deal.id ?? index + 1,
    title: deal.title ?? "Untitled Deal",
    client: deal.client ?? "",
    amount,
    stage,
    probability:
      deal.probability ??
      (stage === "Won"
        ? 100
        : stage === "Negotiation"
        ? 70
        : stage === "Proposal Sent"
        ? 40
        : stage === "Lost"
        ? 0
        : 20),
    owner: deal.owner ?? "Admin",
    expectedCloseDate: deal.expectedCloseDate ?? getToday(),
    nextStep: deal.nextStep ?? "Follow up with client",
    createdAt: deal.createdAt ?? getToday(),
  };
}

function normalizeFollowUp(item, index) {
  return {
    id: item.id ?? index + 1,
    client: item.client ?? item.name ?? "",
    type: item.type ?? "Call",
    date: item.date ?? getToday(),
    time: item.time ?? "10:00",
    status:
      item.status === "Done" || item.status === "Complete"
        ? "Completed"
        : item.status ?? "Scheduled",
    priority: item.priority ?? "Medium",
    phone: item.phone ?? "",
    assignedTo: item.assignedTo ?? "Admin",
  };
}

function normalizeTask(task, index) {
  return {
    id: task.id ?? index + 1,
    title: task.title ?? "Untitled Task",
    assigned: task.assigned ?? task.assignedTo ?? "Admin",
    dueDate: task.dueDate ?? task.due ?? getToday(),
    dueTime: task.dueTime ?? "10:00",
    priority: task.priority ?? "Medium",
    status:
      task.status === "Done" || task.status === "Complete"
        ? "Completed"
        : task.status === "Pending"
        ? "To Do"
        : task.status ?? "To Do",
    progress: task.progress ?? 0,
    createdAt: task.createdAt ?? getToday(),
  };
}

function isClosedStatus(status) {
  return ["Completed", "Won", "Lost", "Cancelled"].includes(status);
}

function isOverdue(dateValue, status) {
  if (!dateValue || isClosedStatus(status)) return false;
  return new Date(dateValue) < new Date(getToday());
}

function moneyFormatter(value) {
  return `PKR ${(Number(value || 0) / 1000).toFixed(0)}K`;
}

function KpiCard({ title, value, subtitle, icon, tone = "default", pulse = false }) {
  const toneMap = {
    default: "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-rose-100 text-rose-700",
    info: "bg-blue-100 text-blue-700",
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-slate-950 via-blue-600 to-emerald-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {title}
          </p>

          <h3 className="mt-2 text-2xl font-extrabold text-slate-950 dark:text-white">
            {value}
          </h3>

          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        </div>

        <div
          className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
            toneMap[tone] || toneMap.default
          }`}
        >
          {pulse && (
            <span className="absolute inset-0 rounded-xl bg-current opacity-20 animate-ping" />
          )}
          <span className="relative">{icon}</span>
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ title, subtitle, icon, children, right }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-950">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
            {icon}
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-950 dark:text-white">
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {right}
      </div>

      <div className="p-5">{children}</div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    New: "border-blue-200 bg-blue-50 text-blue-800",
    Contacted: "border-amber-200 bg-amber-50 text-amber-800",
    Interested: "border-emerald-200 bg-emerald-50 text-emerald-800",
    Scheduled: "border-blue-200 bg-blue-50 text-blue-800",
    Pending: "border-amber-200 bg-amber-50 text-amber-800",
    "To Do": "border-blue-200 bg-blue-50 text-blue-800",
    "In Progress": "border-amber-200 bg-amber-50 text-amber-800",
    Completed: "border-emerald-200 bg-emerald-50 text-emerald-800",
    Won: "border-emerald-200 bg-emerald-50 text-emerald-800",
    Lost: "border-rose-200 bg-rose-50 text-rose-800",
  };

  return (
    <span
      className={`inline-flex rounded-lg border px-2.5 py-1 text-xs font-semibold ${
        map[status] || "border-slate-200 bg-slate-50 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const map = {
    Urgent: "border-rose-200 bg-rose-50 text-rose-800",
    High: "border-orange-200 bg-orange-50 text-orange-800",
    Medium: "border-amber-200 bg-amber-50 text-amber-800",
    Low: "border-blue-200 bg-blue-50 text-blue-800",
    Hot: "border-rose-200 bg-rose-50 text-rose-800",
    Warm: "border-amber-200 bg-amber-50 text-amber-800",
    Cold: "border-blue-200 bg-blue-50 text-blue-800",
  };

  return (
    <span
      className={`inline-flex rounded-lg border px-2.5 py-1 text-xs font-semibold ${
        map[priority] || "border-slate-200 bg-slate-50 text-slate-600"
      }`}
    >
      {priority}
    </span>
  );
}

function ActionItem({ title, meta, icon, tone = "default", right }) {
  const toneMap = {
    default: "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-rose-100 text-rose-700",
    info: "bg-blue-100 text-blue-700",
  };

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 transition-all duration-300 hover:bg-white hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-950">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            toneMap[tone] || toneMap.default
          }`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-slate-950 dark:text-white">
            {title}
          </p>
          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
            {meta}
          </p>
        </div>
      </div>

      {right}
    </div>
  );
}

function MiniProgress({ value }) {
  const safeValue = Math.min(100, Math.max(0, Number(value || 0)));

  return (
    <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
      <div
        className="h-full rounded-full bg-slate-950 transition-all duration-700 dark:bg-white"
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}

function Dashboard() {
  const [range, setRange] = useState("all");
  const [search, setSearch] = useState("");

  const data = useMemo(() => {
    const leads = initialLeads.map((item, index) => normalizeLead(item, index));
    const customers = initialCustomers.map((item, index) =>
      normalizeCustomer(item, index)
    );
    const deals = initialDeals.map((item, index) => normalizeDeal(item, index));
    const followUps = initialFollowUps.map((item, index) =>
      normalizeFollowUp(item, index)
    );
    const tasks = initialTasks.map((item, index) => normalizeTask(item, index));

    return { leads, customers, deals, followUps, tasks };
  }, []);

  const filteredData = useMemo(() => {
    const value = search.toLowerCase().trim();

    const leads = data.leads.filter((item) => {
      const matchesRange = isWithinRange(item.createdAt, range);
      const matchesSearch =
        !value ||
        item.name.toLowerCase().includes(value) ||
        item.service.toLowerCase().includes(value) ||
        item.source.toLowerCase().includes(value);

      return matchesRange && matchesSearch;
    });

    const customers = data.customers.filter((item) => {
      const matchesRange = isWithinRange(item.createdAt, range);
      const matchesSearch =
        !value ||
        item.name.toLowerCase().includes(value) ||
        item.service.toLowerCase().includes(value) ||
        item.status.toLowerCase().includes(value);

      return matchesRange && matchesSearch;
    });

    const deals = data.deals.filter((item) => {
      const matchesRange =
        isWithinRange(item.createdAt, range) ||
        isWithinRange(item.expectedCloseDate, range);

      const matchesSearch =
        !value ||
        item.title.toLowerCase().includes(value) ||
        item.client.toLowerCase().includes(value) ||
        item.stage.toLowerCase().includes(value) ||
        item.owner.toLowerCase().includes(value);

      return matchesRange && matchesSearch;
    });

    const followUps = data.followUps.filter((item) => {
      const matchesRange = isWithinRange(item.date, range);
      const matchesSearch =
        !value ||
        item.client.toLowerCase().includes(value) ||
        item.type.toLowerCase().includes(value) ||
        item.status.toLowerCase().includes(value);

      return matchesRange && matchesSearch;
    });

    const tasks = data.tasks.filter((item) => {
      const matchesRange =
        isWithinRange(item.createdAt, range) ||
        isWithinRange(item.dueDate, range);

      const matchesSearch =
        !value ||
        item.title.toLowerCase().includes(value) ||
        item.assigned.toLowerCase().includes(value) ||
        item.status.toLowerCase().includes(value) ||
        item.priority.toLowerCase().includes(value);

      return matchesRange && matchesSearch;
    });

    return { leads, customers, deals, followUps, tasks };
  }, [data, range, search]);

  const metrics = useMemo(() => {
    const { leads, customers, deals, followUps, tasks } = filteredData;

    const wonDeals = deals.filter((deal) => deal.stage === "Won");
    const lostDeals = deals.filter((deal) => deal.stage === "Lost");
    const openDeals = deals.filter(
      (deal) => deal.stage !== "Won" && deal.stage !== "Lost"
    );

    const pipelineValue = openDeals.reduce(
      (sum, deal) => sum + Number(deal.amount || 0),
      0
    );

    const weightedForecast = openDeals.reduce(
      (sum, deal) =>
        sum + (Number(deal.amount || 0) * Number(deal.probability || 0)) / 100,
      0
    );

    const wonRevenue = wonDeals.reduce(
      (sum, deal) => sum + Number(deal.amount || 0),
      0
    );

    const totalCustomerValue = customers.reduce(
      (sum, customer) => sum + Number(customer.totalValue || 0),
      0
    );

    const collectedPayments = customers.reduce(
      (sum, customer) => sum + Number(customer.paidAmount || 0),
      0
    );

    const pendingPayments = customers.reduce(
      (sum, customer) => sum + Number(customer.balance || 0),
      0
    );

    const todayFollowUps = followUps.filter(
      (item) => item.date === getToday() && item.status !== "Completed"
    );

    const overdueFollowUps = followUps.filter((item) =>
      isOverdue(item.date, item.status)
    );

    const todayTasks = tasks.filter(
      (task) => task.dueDate === getToday() && task.status !== "Completed"
    );

    const overdueTasks = tasks.filter((task) =>
      isOverdue(task.dueDate, task.status)
    );

    const overdueDeals = openDeals.filter((deal) =>
      isOverdue(deal.expectedCloseDate, deal.stage)
    );

    const conversionRate =
      leads.length > 0 ? (customers.length / leads.length) * 100 : 0;

    const dealWinRate =
      deals.length > 0 ? (wonDeals.length / deals.length) * 100 : 0;

    const hotLeads = leads.filter((lead) =>
      ["Hot", "Interested"].includes(lead.priority) ||
      lead.status === "Interested"
    );

    const topDeals = [...openDeals]
      .sort((a, b) => Number(b.amount || 0) - Number(a.amount || 0))
      .slice(0, 5);

    const recentLeads = [...leads].slice(0, 6);

    const actionQueue = [
      ...overdueFollowUps.map((item) => ({
        id: `followup-overdue-${item.id}`,
        type: "Follow-up",
        title: `Overdue follow-up with ${item.client}`,
        meta: `${item.type} • ${formatDate(item.date)} • ${formatTime(item.time)}`,
        tone: "danger",
        icon: <BellRing className="h-4 w-4" />,
      })),
      ...todayFollowUps.map((item) => ({
        id: `followup-today-${item.id}`,
        type: "Follow-up",
        title: `Follow up with ${item.client}`,
        meta: `${item.type} • Today at ${formatTime(item.time)}`,
        tone: "info",
        icon: <MessageCircle className="h-4 w-4" />,
      })),
      ...overdueTasks.map((task) => ({
        id: `task-overdue-${task.id}`,
        type: "Task",
        title: task.title,
        meta: `Overdue • Assigned to ${task.assigned}`,
        tone: "danger",
        icon: <ClipboardList className="h-4 w-4" />,
      })),
      ...todayTasks.map((task) => ({
        id: `task-today-${task.id}`,
        type: "Task",
        title: task.title,
        meta: `Due today • ${task.assigned}`,
        tone: "warning",
        icon: <TimerReset className="h-4 w-4" />,
      })),
      ...overdueDeals.map((deal) => ({
        id: `deal-overdue-${deal.id}`,
        type: "Deal",
        title: deal.title,
        meta: `Close date overdue • ${formatCurrency(deal.amount)}`,
        tone: "danger",
        icon: <Handshake className="h-4 w-4" />,
      })),
    ].slice(0, 8);

    return {
      leads,
      customers,
      deals,
      followUps,
      tasks,
      wonDeals,
      lostDeals,
      openDeals,
      pipelineValue,
      weightedForecast,
      wonRevenue,
      totalCustomerValue,
      collectedPayments,
      pendingPayments,
      todayFollowUps,
      overdueFollowUps,
      todayTasks,
      overdueTasks,
      overdueDeals,
      conversionRate,
      dealWinRate,
      hotLeads,
      topDeals,
      recentLeads,
      actionQueue,
    };
  }, [filteredData]);

  const filteredRevenueChart = revenueChartData;
  const filteredLeadSourceChart = leadSourceChartData;
  const filteredDealStageChart = dealStageChartData;
  const filteredConversionChart = conversionChartData;

  function exportDashboardSummary() {
    const rows = [
      ["Metric", "Value"],
      ["Total Leads", metrics.leads.length],
      ["Customers", metrics.customers.length],
      ["Open Deals", metrics.openDeals.length],
      ["Won Revenue", metrics.wonRevenue],
      ["Pipeline Value", metrics.pipelineValue],
      ["Weighted Forecast", metrics.weightedForecast],
      ["Pending Payments", metrics.pendingPayments],
      ["Today Follow-ups", metrics.todayFollowUps.length],
      ["Overdue Follow-ups", metrics.overdueFollowUps.length],
      ["Today Tasks", metrics.todayTasks.length],
      ["Overdue Tasks", metrics.overdueTasks.length],
      ["Conversion Rate", formatPercent(metrics.conversionRate)],
      ["Deal Win Rate", formatPercent(metrics.dealWinRate)],
    ];

    const csv = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "crm-dashboard-summary.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="w-full max-w-full overflow-hidden">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <PageTitle
          title="Dashboard"
          subtitle="Admin command center for today’s CRM activity, revenue, deals, tasks, and follow-ups"
        />

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              setSearch("");
              setRange("all");
            }}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            <RefreshCcw className="h-4 w-4" />
            Reset
          </button>

          <button
            onClick={exportDashboardSummary}
            className="flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Search dashboard by client, service, source, task..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-slate-600"
          />
        </div>

        <select
          value={range}
          onChange={(event) => setRange(event.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
        >
          {dateRanges.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
          <Filter className="h-4 w-4" />
          Live CRM Overview
        </div>
      </div>

      <div className="mb-5 grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Today’s Follow-ups"
          value={metrics.todayFollowUps.length}
          subtitle={`${metrics.overdueFollowUps.length} overdue follow-ups need attention`}
          icon={<CalendarClock className="h-5 w-5" />}
          tone={metrics.overdueFollowUps.length > 0 ? "danger" : "info"}
          pulse={metrics.overdueFollowUps.length > 0}
        />

        <KpiCard
          title="Today’s Tasks"
          value={metrics.todayTasks.length}
          subtitle={`${metrics.overdueTasks.length} overdue tasks pending`}
          icon={<ClipboardList className="h-5 w-5" />}
          tone={metrics.overdueTasks.length > 0 ? "danger" : "warning"}
          pulse={metrics.overdueTasks.length > 0}
        />

        <KpiCard
          title="Pipeline Value"
          value={formatCurrency(metrics.pipelineValue)}
          subtitle={`${metrics.openDeals.length} open deals in pipeline`}
          icon={<BadgeDollarSign className="h-5 w-5" />}
          tone="default"
        />

        <KpiCard
          title="Pending Payments"
          value={formatCurrency(metrics.pendingPayments)}
          subtitle={`${formatCurrency(metrics.collectedPayments)} already collected`}
          icon={<CreditCard className="h-5 w-5" />}
          tone={metrics.pendingPayments > 0 ? "warning" : "success"}
        />

        <KpiCard
          title="Hot Leads"
          value={metrics.hotLeads.length}
          subtitle={`${metrics.leads.length} total leads in current view`}
          icon={<Zap className="h-5 w-5" />}
          tone="danger"
        />

        <KpiCard
          title="Conversion Rate"
          value={formatPercent(metrics.conversionRate)}
          subtitle="Customers compared to total leads"
          icon={<Target className="h-5 w-5" />}
          tone={metrics.conversionRate >= 25 ? "success" : "warning"}
        />

        <KpiCard
          title="Won Revenue"
          value={formatCurrency(metrics.wonRevenue)}
          subtitle={`${metrics.wonDeals.length} deals successfully closed`}
          icon={<Trophy className="h-5 w-5" />}
          tone="success"
        />

        <KpiCard
          title="Weighted Forecast"
          value={formatCurrency(metrics.weightedForecast)}
          subtitle="Expected revenue based on deal probability"
          icon={<TrendingUp className="h-5 w-5" />}
          tone="info"
        />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_420px]">
        <DashboardCard
          title="Today’s Action Center"
          subtitle="The admin can start from here and handle urgent CRM work first"
          icon={<BellRing className="h-5 w-5" />}
          right={
            <span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              {metrics.actionQueue.length} actions
            </span>
          }
        >
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {metrics.actionQueue.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 py-10 text-center text-sm text-slate-400 dark:border-slate-800 lg:col-span-2">
                No urgent actions right now.
              </div>
            ) : (
              metrics.actionQueue.map((item) => (
                <ActionItem
                  key={item.id}
                  title={item.title}
                  meta={item.meta}
                  tone={item.tone}
                  icon={item.icon}
                  right={
                    <button className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  }
                />
              ))
            )}
          </div>
        </DashboardCard>

        <DashboardCard
          title="Business Health"
          subtitle="Fast decision summary"
          icon={<BarChart3 className="h-5 w-5" />}
        >
          <div className="space-y-5">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  Lead to Customer Conversion
                </span>
                <span className="font-bold text-slate-950 dark:text-white">
                  {formatPercent(metrics.conversionRate)}
                </span>
              </div>
              <MiniProgress value={metrics.conversionRate} />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  Deal Win Rate
                </span>
                <span className="font-bold text-slate-950 dark:text-white">
                  {formatPercent(metrics.dealWinRate)}
                </span>
              </div>
              <MiniProgress value={metrics.dealWinRate} />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  Payment Collection
                </span>
                <span className="font-bold text-slate-950 dark:text-white">
                  {formatPercent(
                    metrics.totalCustomerValue > 0
                      ? (metrics.collectedPayments / metrics.totalCustomerValue) * 100
                      : 0
                  )}
                </span>
              </div>
              <MiniProgress
                value={
                  metrics.totalCustomerValue > 0
                    ? (metrics.collectedPayments / metrics.totalCustomerValue) * 100
                    : 0
                }
              />
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Admin Alert
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Focus first on overdue follow-ups, overdue tasks, and pending
                payments. These directly affect sales closing and cash flow.
              </p>
            </div>
          </div>
        </DashboardCard>
      </div>

      <div className="grid w-full min-w-0 grid-cols-1 gap-6 2xl:grid-cols-2">
        <DashboardCard
          title="Revenue Overview"
          subtitle="Revenue and expenses trend"
          icon={<WalletCards className="h-5 w-5" />}
        >
          <div className="h-80 w-full min-w-0 overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={filteredRevenueChart}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="revenueColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>

                  <linearGradient id="expenseColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis width={58} tickFormatter={moneyFormatter} stroke="#64748b" />
                <Tooltip
                  formatter={(value) => moneyFormatter(value)}
                  contentStyle={{
                    borderRadius: "14px",
                    border: "1px solid #e2e8f0",
                  }}
                />
                <Legend />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#2563eb"
                  strokeWidth={3}
                  fill="url(#revenueColor)"
                  animationDuration={900}
                />

                <Area
                  type="monotone"
                  dataKey="expenses"
                  name="Expenses"
                  stroke="#ef4444"
                  strokeWidth={3}
                  fill="url(#expenseColor)"
                  animationDuration={900}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Lead Sources"
          subtitle="Which channels are bringing inquiries"
          icon={<Handshake className="h-5 w-5" />}
        >
          <div className="h-80 w-full min-w-0 overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={filteredLeadSourceChart}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="source" stroke="#64748b" />
                <YAxis width={40} stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    borderRadius: "14px",
                    border: "1px solid #e2e8f0",
                  }}
                />
                <Bar
                  dataKey="leads"
                  name="Leads"
                  fill="#020617"
                  radius={[10, 10, 0, 0]}
                  barSize={35}
                  animationDuration={900}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Deal Pipeline Status"
          subtitle="Deal distribution by stage"
          icon={<Layers3 className="h-5 w-5" />}
        >
          <div className="h-80 w-full min-w-0 overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <Pie
                  data={filteredDealStageChart}
                  dataKey="value"
                  nameKey="stage"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={5}
                  animationDuration={900}
                >
                  {filteredDealStageChart.map((entry, index) => (
                    <Cell
                      key={entry.stage}
                      fill={chartColors[index % chartColors.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    borderRadius: "14px",
                    border: "1px solid #e2e8f0",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Monthly Conversion Rate"
          subtitle="How well leads are converting"
          icon={<Target className="h-5 w-5" />}
        >
          <div className="h-80 w-full min-w-0 overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={filteredConversionChart}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis
                  width={40}
                  tickFormatter={(value) => `${value}%`}
                  stroke="#64748b"
                />
                <Tooltip
                  formatter={(value) => `${value}%`}
                  contentStyle={{
                    borderRadius: "14px",
                    border: "1px solid #e2e8f0",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="conversion"
                  name="Conversion"
                  stroke="#059669"
                  strokeWidth={4}
                  dot={{ r: 5 }}
                  activeDot={{ r: 8 }}
                  animationDuration={900}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>
      </div>

      <div className="mt-6 grid w-full min-w-0 grid-cols-1 gap-6 2xl:grid-cols-3">
        <DashboardCard
          title="Top Open Deals"
          subtitle="High-value opportunities to close"
          icon={<Trophy className="h-5 w-5" />}
        >
          <div className="space-y-3">
            {metrics.topDeals.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 py-8 text-center text-sm text-slate-400 dark:border-slate-800">
                No open deals found.
              </div>
            ) : (
              metrics.topDeals.map((deal) => (
                <ActionItem
                  key={deal.id}
                  title={deal.title}
                  meta={`${deal.client} • ${deal.stage} • ${formatDate(
                    deal.expectedCloseDate
                  )}`}
                  icon={<BadgeDollarSign className="h-4 w-4" />}
                  tone="success"
                  right={
                    <span className="text-sm font-bold text-slate-950 dark:text-white">
                      {formatCurrency(deal.amount)}
                    </span>
                  }
                />
              ))
            )}
          </div>
        </DashboardCard>

        <DashboardCard
          title="Recent Leads"
          subtitle="Latest inquiries requiring attention"
          icon={<UsersRound className="h-5 w-5" />}
        >
          <div className="space-y-3">
            {metrics.recentLeads.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 py-8 text-center text-sm text-slate-400 dark:border-slate-800">
                No leads found.
              </div>
            ) : (
              metrics.recentLeads.map((lead) => (
                <ActionItem
                  key={lead.id}
                  title={lead.name}
                  meta={`${lead.service} • ${lead.source}`}
                  icon={<Handshake className="h-4 w-4" />}
                  tone={lead.status === "Interested" ? "success" : "info"}
                  right={
                    <div className="flex items-center gap-2">
                      <PriorityBadge priority={lead.priority} />
                      <StatusBadge status={lead.status} />
                    </div>
                  }
                />
              ))
            )}
          </div>
        </DashboardCard>

        <DashboardCard
          title="Quick Contacts"
          subtitle="Fast call and follow-up access"
          icon={<Phone className="h-5 w-5" />}
        >
          <div className="space-y-3">
            {metrics.todayFollowUps.slice(0, 6).length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 py-8 text-center text-sm text-slate-400 dark:border-slate-800">
                No contacts scheduled today.
              </div>
            ) : (
              metrics.todayFollowUps.slice(0, 6).map((item) => (
                <ActionItem
                  key={item.id}
                  title={item.client}
                  meta={`${item.type} • ${formatTime(item.time)} • ${item.assignedTo}`}
                  icon={<MessageCircle className="h-4 w-4" />}
                  tone="info"
                  right={
                    <div className="flex items-center gap-2">
                      {item.phone && (
                        <a
                          href={`tel:${item.phone}`}
                          className="rounded-lg border border-blue-200 bg-blue-50 p-2 text-blue-700 transition hover:bg-blue-100"
                          title="Call"
                        >
                          <Phone className="h-4 w-4" />
                        </a>
                      )}

                      <button
                        className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  }
                />
              ))
            )}
          </div>
        </DashboardCard>
      </div>

      <div className="mt-6 grid w-full min-w-0 grid-cols-1 gap-6 2xl:grid-cols-2">
        <DashboardCard
          title="Task Snapshot"
          subtitle="Current task workload and due work"
          icon={<ClipboardList className="h-5 w-5" />}
        >
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Task
                  </th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Assigned
                  </th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Due
                  </th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Priority
                  </th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {metrics.tasks.slice(0, 6).map((task) => (
                  <tr
                    key={task.id}
                    className="border-b border-slate-100 last:border-0 dark:border-slate-800"
                  >
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                      {task.title}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {task.assigned}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {formatDate(task.dueDate)}
                    </td>
                    <td className="px-4 py-3">
                      <PriorityBadge priority={task.priority} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={task.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Payment Snapshot"
          subtitle="Cash collection and receivable overview"
          icon={<CreditCard className="h-5 w-5" />}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Total Value
              </p>
              <p className="mt-2 text-xl font-extrabold text-slate-950 dark:text-white">
                {formatCurrency(metrics.totalCustomerValue)}
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                Collected
              </p>
              <p className="mt-2 text-xl font-extrabold text-emerald-800">
                {formatCurrency(metrics.collectedPayments)}
              </p>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-amber-700">
                Pending
              </p>
              <p className="mt-2 text-xl font-extrabold text-amber-800">
                {formatCurrency(metrics.pendingPayments)}
              </p>
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                Collection Progress
              </span>
              <span className="font-bold text-slate-950 dark:text-white">
                {formatPercent(
                  metrics.totalCustomerValue > 0
                    ? (metrics.collectedPayments / metrics.totalCustomerValue) * 100
                    : 0
                )}
              </span>
            </div>

            <MiniProgress
              value={
                metrics.totalCustomerValue > 0
                  ? (metrics.collectedPayments / metrics.totalCustomerValue) * 100
                  : 0
              }
            />
          </div>

          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-600" />
              <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                Follow up with customers who have pending balances. Payment
                collection should be checked before adding new delivery workload.
              </p>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}

export default Dashboard;