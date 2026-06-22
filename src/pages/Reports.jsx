import { useMemo, useState } from "react";
import PageTitle from "../components/PageTitle";
import {
  BadgeDollarSign,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  Download,
  Filter,
  Handshake,
  Layers3,
  PieChart,
  RefreshCcw,
  Search,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy,
  UsersRound,
  WalletCards,
} from "lucide-react";

import {
  leads as initialLeads,
  customers as initialCustomers,
  deals as initialDeals,
  followUps as initialFollowUps,
  tasks as initialTasks,
} from "../data/crmData";

const CURRENCY = "PKR";

const STAGES = [
  "Requirement Taken",
  "Proposal Sent",
  "Negotiation",
  "Won",
  "Lost",
];

const RANGE_OPTIONS = [
  { label: "All Time", value: "all" },
  { label: "Last 7 Days", value: "last7" },
  { label: "Last 30 Days", value: "last30" },
  { label: "This Month", value: "thisMonth" },
  { label: "This Year", value: "thisYear" },
];

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function getMonthKey(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Unknown";

  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
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

function isWithinRange(dateValue, range) {
  if (range === "all") return true;
  if (!dateValue) return true;

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return true;

  const today = new Date();
  const start = new Date();

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

  if (range === "thisYear") {
    return date.getFullYear() === today.getFullYear();
  }

  return true;
}

function groupBy(items, keyGetter) {
  return items.reduce((result, item) => {
    const key = keyGetter(item) || "Unknown";
    result[key] = result[key] || [];
    result[key].push(item);
    return result;
  }, {});
}

function normalizeLead(lead, index) {
  return {
    id: lead.id ?? index + 1,
    name: lead.name ?? "",
    phone: lead.phone ?? "",
    source: lead.source ?? "Unknown",
    status: lead.status ?? "New",
    priority: lead.priority ?? "Medium",
    service: lead.service ?? "",
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
    service: customer.service ?? "Unknown",
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
    service: deal.service ?? deal.title ?? "Unknown",
    stage,
    amount,
    owner: deal.owner ?? "Admin",
    source: deal.source ?? "Direct",
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
    expectedCloseDate: deal.expectedCloseDate ?? getToday(),
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
    assignedTo: item.assignedTo ?? "Admin",
    priority: item.priority ?? "Medium",
  };
}

function normalizeTask(task, index) {
  return {
    id: task.id ?? index + 1,
    title: task.title ?? "Untitled Task",
    assigned: task.assigned ?? task.assignedTo ?? "Admin",
    dueDate: task.dueDate ?? task.due ?? getToday(),
    priority: task.priority ?? "Medium",
    status:
      task.status === "Done" || task.status === "Complete"
        ? "Completed"
        : task.status === "Pending"
        ? "To Do"
        : task.status ?? "To Do",
    createdAt: task.createdAt ?? getToday(),
  };
}

function isOverdueDate(dateValue, status) {
  if (status === "Completed" || status === "Won" || status === "Lost") return false;
  if (!dateValue) return false;

  return new Date(dateValue) < new Date(getToday());
}

function KpiCard({ title, value, subtitle, icon, trend, tone = "default" }) {
  const toneMap = {
    default: "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-rose-100 text-rose-700",
    info: "bg-blue-100 text-blue-700",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {title}
          </p>

          <h3 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
            {value}
          </h3>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
            toneMap[tone] || toneMap.default
          }`}
        >
          {icon}
        </div>
      </div>

      {trend && (
        <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          {trend.type === "up" ? (
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          ) : (
            <TrendingDown className="h-4 w-4 text-rose-600" />
          )}
          {trend.label}
        </div>
      )}
    </div>
  );
}

function SectionCard({ title, subtitle, icon, children, right }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
            {icon}
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-950 dark:text-white">
              {title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          </div>
        </div>

        {right}
      </div>

      <div className="p-5">{children}</div>
    </div>
  );
}

function BarRow({ label, value, maxValue, meta }) {
  const width = maxValue > 0 ? Math.max(4, (Number(value || 0) / maxValue) * 100) : 0;

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
        <span className="font-semibold text-slate-700 dark:text-slate-200">
          {label}
        </span>
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {meta ?? value}
        </span>
      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-slate-950 transition-all dark:bg-white"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

function MiniTable({ headers, rows }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[620px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
            {headers.map((header) => (
              <th
                key={header}
                className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={headers.length}
                className="px-4 py-8 text-center text-slate-400"
              >
                No data found.
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr
                key={index}
                className="border-b border-slate-100 last:border-0 dark:border-slate-800"
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-4 py-3 text-slate-700 dark:text-slate-300"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function Reports() {
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
    const searchValue = search.toLowerCase().trim();

    const leads = data.leads.filter((item) => {
      const matchesRange = isWithinRange(item.createdAt, range);
      const matchesSearch =
        !searchValue ||
        item.name.toLowerCase().includes(searchValue) ||
        item.source.toLowerCase().includes(searchValue) ||
        item.service.toLowerCase().includes(searchValue);

      return matchesRange && matchesSearch;
    });

    const customers = data.customers.filter((item) => {
      const matchesRange = isWithinRange(item.createdAt, range);
      const matchesSearch =
        !searchValue ||
        item.name.toLowerCase().includes(searchValue) ||
        item.service.toLowerCase().includes(searchValue) ||
        item.status.toLowerCase().includes(searchValue);

      return matchesRange && matchesSearch;
    });

    const deals = data.deals.filter((item) => {
      const matchesRange =
        isWithinRange(item.createdAt, range) ||
        isWithinRange(item.expectedCloseDate, range);

      const matchesSearch =
        !searchValue ||
        item.title.toLowerCase().includes(searchValue) ||
        item.client.toLowerCase().includes(searchValue) ||
        item.stage.toLowerCase().includes(searchValue) ||
        item.service.toLowerCase().includes(searchValue) ||
        item.owner.toLowerCase().includes(searchValue);

      return matchesRange && matchesSearch;
    });

    const followUps = data.followUps.filter((item) => {
      const matchesRange = isWithinRange(item.date, range);
      const matchesSearch =
        !searchValue ||
        item.client.toLowerCase().includes(searchValue) ||
        item.type.toLowerCase().includes(searchValue) ||
        item.status.toLowerCase().includes(searchValue);

      return matchesRange && matchesSearch;
    });

    const tasks = data.tasks.filter((item) => {
      const matchesRange =
        isWithinRange(item.createdAt, range) ||
        isWithinRange(item.dueDate, range);

      const matchesSearch =
        !searchValue ||
        item.title.toLowerCase().includes(searchValue) ||
        item.assigned.toLowerCase().includes(searchValue) ||
        item.priority.toLowerCase().includes(searchValue) ||
        item.status.toLowerCase().includes(searchValue);

      return matchesRange && matchesSearch;
    });

    return { leads, customers, deals, followUps, tasks };
  }, [data, range, search]);

  const reports = useMemo(() => {
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

    const wonRevenue = wonDeals.reduce(
      (sum, deal) => sum + Number(deal.amount || 0),
      0
    );

    const weightedForecast = openDeals.reduce(
      (sum, deal) =>
        sum + (Number(deal.amount || 0) * Number(deal.probability || 0)) / 100,
      0
    );

    const customerRevenue = customers.reduce(
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

    const conversionRate =
      leads.length > 0 ? (customers.length / leads.length) * 100 : 0;

    const dealWinRate =
      deals.length > 0 ? (wonDeals.length / deals.length) * 100 : 0;

    const overdueTasks = tasks.filter((task) =>
      isOverdueDate(task.dueDate, task.status)
    );

    const dueTodayTasks = tasks.filter(
      (task) => task.dueDate === getToday() && task.status !== "Completed"
    );

    const todayFollowUps = followUps.filter(
      (item) => item.date === getToday() && item.status !== "Completed"
    );

    const overdueFollowUps = followUps.filter((item) =>
      isOverdueDate(item.date, item.status)
    );

    const leadSourceGroups = groupBy(leads, (lead) => lead.source);
    const leadSourceReport = Object.entries(leadSourceGroups)
      .map(([source, items]) => ({
        source,
        count: items.length,
        percentage: leads.length > 0 ? (items.length / leads.length) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count);

    const maxLeadSourceCount = Math.max(
      1,
      ...leadSourceReport.map((item) => item.count)
    );

    const paymentGroups = groupBy(customers, (customer) => customer.paymentStatus);
    const paymentReport = Object.entries(paymentGroups)
      .map(([status, items]) => ({
        status,
        count: items.length,
        total: items.reduce((sum, item) => sum + Number(item.totalValue || 0), 0),
        paid: items.reduce((sum, item) => sum + Number(item.paidAmount || 0), 0),
        pending: items.reduce((sum, item) => sum + Number(item.balance || 0), 0),
      }))
      .sort((a, b) => b.pending - a.pending);

    const pipelineReport = STAGES.map((stage) => {
      const stageDeals = deals.filter((deal) => deal.stage === stage);
      const amount = stageDeals.reduce(
        (sum, deal) => sum + Number(deal.amount || 0),
        0
      );

      return {
        stage,
        count: stageDeals.length,
        amount,
      };
    });

    const maxPipelineAmount = Math.max(
      1,
      ...pipelineReport.map((item) => item.amount)
    );

    const funnel = [
      {
        label: "Leads",
        value: leads.length,
      },
      {
        label: "Contacted / Interested",
        value: leads.filter((lead) =>
          ["Contacted", "Interested"].includes(lead.status)
        ).length,
      },
      {
        label: "Proposal Sent",
        value: deals.filter((deal) => deal.stage === "Proposal Sent").length,
      },
      {
        label: "Negotiation",
        value: deals.filter((deal) => deal.stage === "Negotiation").length,
      },
      {
        label: "Won",
        value: wonDeals.length,
      },
    ];

    const maxFunnelValue = Math.max(1, ...funnel.map((item) => item.value));

    const serviceGroups = groupBy(
      [...customers, ...deals],
      (item) => item.service || item.title
    );

    const serviceReport = Object.entries(serviceGroups)
      .map(([service, items]) => ({
        service,
        count: items.length,
        value: items.reduce(
          (sum, item) => sum + Number(item.totalValue ?? item.amount ?? 0),
          0
        ),
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    const teamNames = Array.from(
      new Set([
        ...tasks.map((task) => task.assigned),
        ...deals.map((deal) => deal.owner),
        ...followUps.map((item) => item.assignedTo),
      ])
    ).filter(Boolean);

    const teamReport = teamNames
      .map((member) => {
        const memberTasks = tasks.filter((task) => task.assigned === member);
        const memberDeals = deals.filter((deal) => deal.owner === member);
        const memberFollowUps = followUps.filter(
          (item) => item.assignedTo === member
        );

        const completedTasks = memberTasks.filter(
          (task) => task.status === "Completed"
        ).length;

        const wonAmount = memberDeals
          .filter((deal) => deal.stage === "Won")
          .reduce((sum, deal) => sum + Number(deal.amount || 0), 0);

        return {
          member,
          tasks: memberTasks.length,
          completedTasks,
          followUps: memberFollowUps.length,
          deals: memberDeals.length,
          wonAmount,
        };
      })
      .sort((a, b) => b.wonAmount + b.completedTasks - (a.wonAmount + a.completedTasks));

    const revenueByMonthGroups = groupBy(
      [...customers, ...wonDeals],
      (item) => getMonthKey(item.createdAt ?? item.expectedCloseDate)
    );

    const revenueTrend = Object.entries(revenueByMonthGroups)
      .map(([month, items]) => ({
        month,
        value: items.reduce(
          (sum, item) => sum + Number(item.paidAmount ?? item.amount ?? 0),
          0
        ),
      }))
      .slice(0, 6);

    const maxRevenueTrend = Math.max(
      1,
      ...revenueTrend.map((item) => item.value)
    );

    return {
      kpis: {
        leads: leads.length,
        customers: customers.length,
        openDeals: openDeals.length,
        wonDeals: wonDeals.length,
        lostDeals: lostDeals.length,
        pipelineValue,
        wonRevenue,
        weightedForecast,
        customerRevenue,
        collectedPayments,
        pendingPayments,
        conversionRate,
        dealWinRate,
        overdueTasks: overdueTasks.length,
        dueTodayTasks: dueTodayTasks.length,
        todayFollowUps: todayFollowUps.length,
        overdueFollowUps: overdueFollowUps.length,
      },
      leadSourceReport,
      maxLeadSourceCount,
      paymentReport,
      pipelineReport,
      maxPipelineAmount,
      funnel,
      maxFunnelValue,
      serviceReport,
      teamReport,
      revenueTrend,
      maxRevenueTrend,
    };
  }, [filteredData]);

  function exportCsv() {
    const rows = [
      ["Metric", "Value"],
      ["Leads", reports.kpis.leads],
      ["Customers", reports.kpis.customers],
      ["Open Deals", reports.kpis.openDeals],
      ["Won Deals", reports.kpis.wonDeals],
      ["Lost Deals", reports.kpis.lostDeals],
      ["Pipeline Value", reports.kpis.pipelineValue],
      ["Weighted Forecast", reports.kpis.weightedForecast],
      ["Won Revenue", reports.kpis.wonRevenue],
      ["Customer Revenue", reports.kpis.customerRevenue],
      ["Collected Payments", reports.kpis.collectedPayments],
      ["Pending Payments", reports.kpis.pendingPayments],
      ["Lead Conversion Rate", formatPercent(reports.kpis.conversionRate)],
      ["Deal Win Rate", formatPercent(reports.kpis.dealWinRate)],
      ["Due Today Tasks", reports.kpis.dueTodayTasks],
      ["Overdue Tasks", reports.kpis.overdueTasks],
      ["Today Follow-ups", reports.kpis.todayFollowUps],
      ["Overdue Follow-ups", reports.kpis.overdueFollowUps],
    ];

    const csv = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "crm-reports.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="w-full max-w-full">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <PageTitle
          title="Reports"
          subtitle="Analyze leads, sales, revenue, payments, follow-ups, and team performance"
        />

        <button
          onClick={exportCsv}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      <div className="mb-5 flex flex-wrap gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Search reports by client, source, service, owner..."
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
          {RANGE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <button
          onClick={() => {
            setSearch("");
            setRange("all");
          }}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
        >
          <RefreshCcw className="h-4 w-4" />
          Reset
        </button>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Total Leads"
          value={formatNumber(reports.kpis.leads)}
          subtitle="Captured inquiries"
          icon={<Handshake className="h-5 w-5" />}
          tone="info"
        />

        <KpiCard
          title="Conversion Rate"
          value={formatPercent(reports.kpis.conversionRate)}
          subtitle="Customers compared to leads"
          icon={<Target className="h-5 w-5" />}
          trend={{
            type: reports.kpis.conversionRate >= 25 ? "up" : "down",
            label:
              reports.kpis.conversionRate >= 25
                ? "Healthy conversion"
                : "Needs improvement",
          }}
          tone="success"
        />

        <KpiCard
          title="Pipeline Value"
          value={formatCurrency(reports.kpis.pipelineValue)}
          subtitle="Open deal value"
          icon={<BadgeDollarSign className="h-5 w-5" />}
          tone="default"
        />

        <KpiCard
          title="Weighted Forecast"
          value={formatCurrency(reports.kpis.weightedForecast)}
          subtitle="Probability-based revenue"
          icon={<TrendingUp className="h-5 w-5" />}
          tone="success"
        />

        <KpiCard
          title="Won Revenue"
          value={formatCurrency(reports.kpis.wonRevenue)}
          subtitle="Closed successful deals"
          icon={<Trophy className="h-5 w-5" />}
          tone="success"
        />

        <KpiCard
          title="Pending Payments"
          value={formatCurrency(reports.kpis.pendingPayments)}
          subtitle="Remaining customer balance"
          icon={<CreditCard className="h-5 w-5" />}
          tone={reports.kpis.pendingPayments > 0 ? "warning" : "success"}
        />

        <KpiCard
          title="Today Follow-ups"
          value={formatNumber(reports.kpis.todayFollowUps)}
          subtitle={`${reports.kpis.overdueFollowUps} overdue follow-ups`}
          icon={<CalendarClock className="h-5 w-5" />}
          tone={reports.kpis.overdueFollowUps > 0 ? "danger" : "info"}
        />

        <KpiCard
          title="Task Health"
          value={`${reports.kpis.overdueTasks} overdue`}
          subtitle={`${reports.kpis.dueTodayTasks} due today`}
          icon={<ClipboardList className="h-5 w-5" />}
          tone={reports.kpis.overdueTasks > 0 ? "danger" : "success"}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <SectionCard
          title="Lead Source Report"
          subtitle="Which channel brings the most leads"
          icon={<PieChart className="h-5 w-5" />}
          right={
            <span className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-900">
              <Filter className="h-3.5 w-3.5" />
              Source Mix
            </span>
          }
        >
          <div className="space-y-4">
            {reports.leadSourceReport.length === 0 ? (
              <p className="text-sm text-slate-400">No lead source data found.</p>
            ) : (
              reports.leadSourceReport.map((item) => (
                <BarRow
                  key={item.source}
                  label={item.source}
                  value={item.count}
                  maxValue={reports.maxLeadSourceCount}
                  meta={`${item.count} leads • ${formatPercent(item.percentage)}`}
                />
              ))
            )}
          </div>
        </SectionCard>

        <SectionCard
          title="Sales Conversion Funnel"
          subtitle="Lead to deal closing journey"
          icon={<BarChart3 className="h-5 w-5" />}
        >
          <div className="space-y-4">
            {reports.funnel.map((item) => (
              <BarRow
                key={item.label}
                label={item.label}
                value={item.value}
                maxValue={reports.maxFunnelValue}
                meta={`${item.value} records`}
              />
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Pipeline Stage Report"
          subtitle="Deal value and count by stage"
          icon={<Layers3 className="h-5 w-5" />}
        >
          <div className="space-y-4">
            {reports.pipelineReport.map((item) => (
              <BarRow
                key={item.stage}
                label={item.stage}
                value={item.amount}
                maxValue={reports.maxPipelineAmount}
                meta={`${item.count} deals • ${formatCurrency(item.amount)}`}
              />
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Revenue Trend"
          subtitle="Revenue grouped by month"
          icon={<TrendingUp className="h-5 w-5" />}
        >
          <div className="space-y-4">
            {reports.revenueTrend.length === 0 ? (
              <p className="text-sm text-slate-400">No revenue trend data found.</p>
            ) : (
              reports.revenueTrend.map((item) => (
                <BarRow
                  key={item.month}
                  label={item.month}
                  value={item.value}
                  maxValue={reports.maxRevenueTrend}
                  meta={formatCurrency(item.value)}
                />
              ))
            )}
          </div>
        </SectionCard>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <SectionCard
          title="Payment Report"
          subtitle="Collected and pending customer payments"
          icon={<WalletCards className="h-5 w-5" />}
        >
          <MiniTable
            headers={["Status", "Customers", "Total", "Paid", "Pending"]}
            rows={reports.paymentReport.map((item) => [
              item.status,
              item.count,
              formatCurrency(item.total),
              formatCurrency(item.paid),
              formatCurrency(item.pending),
            ])}
          />
        </SectionCard>

        <SectionCard
          title="Top Services"
          subtitle="Best performing services by value"
          icon={<CheckCircle2 className="h-5 w-5" />}
        >
          <MiniTable
            headers={["Service", "Records", "Value"]}
            rows={reports.serviceReport.map((item) => [
              item.service,
              item.count,
              formatCurrency(item.value),
            ])}
          />
        </SectionCard>
      </div>

      <div className="mt-5">
        <SectionCard
          title="Team Performance"
          subtitle="Tasks, follow-ups, deals, and won amount by team member"
          icon={<UsersRound className="h-5 w-5" />}
        >
          <MiniTable
            headers={[
              "Team Member",
              "Tasks",
              "Completed Tasks",
              "Follow-ups",
              "Deals",
              "Won Amount",
            ]}
            rows={reports.teamReport.map((item) => [
              item.member,
              item.tasks,
              item.completedTasks,
              item.followUps,
              item.deals,
              formatCurrency(item.wonAmount),
            ])}
          />
        </SectionCard>
      </div>
    </div>
  );
}

export default Reports;