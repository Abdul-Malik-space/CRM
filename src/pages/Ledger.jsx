import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  Banknote,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  FileText,
  Filter,
  Mail,
  MoreHorizontal,
  Phone,
  Plus,
  Printer,
  ReceiptText,
  RefreshCcw,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  TrendingUp,
  UsersRound,
  WalletCards,
  X,
} from "lucide-react";

const currencyFormatter = new Intl.NumberFormat("en-PK", {
  style: "currency",
  currency: "PKR",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const DAY_MS = 24 * 60 * 60 * 1000;

const ledgerTheme = {
  accent: "#0f766e",
  accent2: "#14b8a6",
  soft: "rgba(15, 118, 110, 0.10)",
  glow: "rgba(15, 118, 110, 0.18)",
  pageBg: "#f0fdfa",
};

const initialClients = [
  {
    id: "c-001",
    name: "Ali Raza",
    company: "Nova Builders",
    segment: "Construction",
    email: "accounts@novabuilders.com",
    phone: "+92 300 1112223",
    creditLimit: 500000,
    openingBalance: 0,
    owner: "Admin User",
    status: "Active",
  },
  {
    id: "c-002",
    name: "Sara Khan",
    company: "Apex Textiles",
    segment: "Manufacturing",
    email: "finance@apextextiles.com",
    phone: "+92 301 5556677",
    creditLimit: 350000,
    openingBalance: 25000,
    owner: "Admin User",
    status: "Active",
  },
  {
    id: "c-003",
    name: "Dr. Hamza Malik",
    company: "Green Clinic",
    segment: "Healthcare",
    email: "billing@greenclinic.com",
    phone: "+92 302 8889911",
    creditLimit: 250000,
    openingBalance: 0,
    owner: "Admin User",
    status: "Active",
  },
  {
    id: "c-004",
    name: "Usman Sheikh",
    company: "Urban Foods",
    segment: "Retail",
    email: "accounts@urbanfoods.com",
    phone: "+92 303 4442211",
    creditLimit: 400000,
    openingBalance: 10000,
    owner: "Admin User",
    status: "Active",
  },
];

const initialTransactions = [
  {
    id: "TXN-1001",
    clientId: "c-001",
    date: "2026-06-01",
    dueDate: "2026-06-15",
    type: "Invoice",
    reference: "INV-1024",
    description: "CRM implementation - Milestone 1",
    debit: 180000,
    credit: 0,
    balanceDue: 80000,
    method: "—",
    status: "Partial",
    source: "Invoice",
    createdBy: "Admin User",
    reconciled: false,
  },
  {
    id: "TXN-1002",
    clientId: "c-001",
    date: "2026-06-05",
    dueDate: "2026-06-05",
    type: "Payment",
    reference: "PAY-0881",
    description: "Bank transfer received against INV-1024",
    debit: 0,
    credit: 100000,
    balanceDue: 0,
    method: "Bank Transfer",
    status: "Reconciled",
    source: "Payment",
    createdBy: "Admin User",
    reconciled: true,
  },
  {
    id: "TXN-1003",
    clientId: "c-002",
    date: "2026-05-10",
    dueDate: "2026-05-25",
    type: "Invoice",
    reference: "INV-1018",
    description: "SEO monthly retainer and reporting",
    debit: 125000,
    credit: 0,
    balanceDue: 125000,
    method: "—",
    status: "Overdue",
    source: "Invoice",
    createdBy: "Admin User",
    reconciled: false,
  },
  {
    id: "TXN-1004",
    clientId: "c-003",
    date: "2026-06-08",
    dueDate: "2026-07-08",
    type: "Invoice",
    reference: "INV-1027",
    description: "Website maintenance and support",
    debit: 95000,
    credit: 0,
    balanceDue: 95000,
    method: "—",
    status: "Open",
    source: "Invoice",
    createdBy: "Admin User",
    reconciled: false,
  },
  {
    id: "TXN-1005",
    clientId: "c-004",
    date: "2026-06-12",
    dueDate: "2026-06-12",
    type: "Payment",
    reference: "PAY-0885",
    description: "Cash payment received",
    debit: 0,
    credit: 60000,
    balanceDue: 0,
    method: "Cash",
    status: "Reconciled",
    source: "Payment",
    createdBy: "Admin User",
    reconciled: true,
  },
  {
    id: "TXN-1006",
    clientId: "c-004",
    date: "2026-06-14",
    dueDate: "2026-06-29",
    type: "Debit Note",
    reference: "DN-203",
    description: "Additional landing page customization",
    debit: 42000,
    credit: 0,
    balanceDue: 42000,
    method: "—",
    status: "Open",
    source: "Adjustment",
    createdBy: "Admin User",
    reconciled: false,
  },
  {
    id: "TXN-1007",
    clientId: "c-002",
    date: "2026-06-16",
    dueDate: "2026-06-16",
    type: "Credit Note",
    reference: "CN-044",
    description: "Service discount adjustment",
    debit: 0,
    credit: 15000,
    balanceDue: 0,
    method: "Adjustment",
    status: "Adjusted",
    source: "Credit Note",
    createdBy: "Admin User",
    reconciled: true,
  },
];

const typeOptions = [
  "all",
  "Invoice",
  "Payment",
  "Debit Note",
  "Credit Note",
  "Refund",
  "Adjustment",
  "Opening Balance",
];

const statusOptions = [
  "all",
  "Open",
  "Partial",
  "Overdue",
  "Paid",
  "Reconciled",
  "Adjusted",
  "Draft",
];

const paymentMethods = [
  "Bank Transfer",
  "Cash",
  "Credit Card",
  "JazzCash",
  "Easypaisa",
  "Cheque",
  "Adjustment",
];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function toDate(value) {
  if (!value) return new Date();
  const date = value instanceof Date ? value : new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function formatMoney(value) {
  return currencyFormatter.format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return "—";
  return dateFormatter.format(toDate(value));
}

function normalize(value) {
  return String(value || "").toLowerCase().trim();
}

function getDaysOverdue(dueDate) {
  const today = startOfDay(new Date());
  const due = startOfDay(toDate(dueDate));
  return Math.max(0, Math.floor((today - due) / DAY_MS));
}

function getAgingBucket(dueDate) {
  const days = getDaysOverdue(dueDate);

  if (days <= 0) return "current";
  if (days <= 30) return "days1to30";
  if (days <= 60) return "days31to60";
  if (days <= 90) return "days61to90";
  return "days90plus";
}

function getHealth(summary) {
  const usage = summary.creditLimit
    ? Math.round((summary.balance / summary.creditLimit) * 100)
    : 0;

  if (summary.overdue > 0 || usage >= 90) {
    return {
      label: "Collection Needed",
      className: "border-rose-200 bg-rose-50 text-rose-700",
      dot: "bg-rose-500",
    };
  }

  if (usage >= 70) {
    return {
      label: "Limit Watch",
      className: "border-amber-200 bg-amber-50 text-amber-700",
      dot: "bg-amber-500",
    };
  }

  return {
    label: "Healthy",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
  };
}

function StatusBadge({ status }) {
  const key = normalize(status);

  const styles = {
    open: "border-blue-200 bg-blue-50 text-blue-700",
    partial: "border-amber-200 bg-amber-50 text-amber-700",
    overdue: "border-rose-200 bg-rose-50 text-rose-700",
    paid: "border-emerald-200 bg-emerald-50 text-emerald-700",
    reconciled: "border-emerald-200 bg-emerald-50 text-emerald-700",
    adjusted: "border-violet-200 bg-violet-50 text-violet-700",
    draft: "border-slate-200 bg-slate-50 text-slate-600",
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${
        styles[key] || "border-slate-200 bg-slate-50 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}

function MetricCard({ title, value, subtitle, icon: Icon, tone = "teal" }) {
  const toneClasses = {
    teal: "from-teal-600 to-emerald-500 shadow-teal-200",
    blue: "from-blue-600 to-indigo-500 shadow-blue-200",
    amber: "from-amber-500 to-orange-500 shadow-amber-200",
    rose: "from-rose-600 to-orange-500 shadow-rose-200",
    slate: "from-slate-800 to-slate-600 shadow-slate-200",
  };

  return (
    <div className="rounded-3xl border border-white/80 bg-white p-5 shadow-sm shadow-slate-200/70">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-500">{title}</p>
          <h3 className="mt-2 truncate text-2xl font-bold tracking-tight text-slate-950">
            {value}
          </h3>
          <p className="mt-1 text-xs font-medium text-slate-400">{subtitle}</p>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg ${
            toneClasses[tone] || toneClasses.teal
          }`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function DateCell({ date, dueDate, isOverdue }) {
  return (
    <div className="flex min-w-[132px] items-center gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-400">
        <CalendarDays className="h-5 w-5" />
      </div>

      <div className="min-w-0">
        <p className="whitespace-nowrap text-sm font-bold text-slate-900">
          {formatDate(date)}
        </p>
        <p
          className={`mt-0.5 whitespace-nowrap text-xs font-medium ${
            isOverdue ? "text-rose-500" : "text-slate-400"
          }`}
        >
          Due {formatDate(dueDate)}
        </p>
      </div>
    </div>
  );
}

function EmptyState({ onAdd }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Search className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-base font-bold text-slate-950">
        No ledger entries found
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Try changing filters or add a new invoice, payment, debit note, credit
        note, or adjustment entry.
      </p>
      <button
        onClick={onAdd}
        className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5"
      >
        <Plus className="h-4 w-4" />
        Add Entry
      </button>
    </div>
  );
}

function Ledger() {
  const clients = initialClients;

  const [transactions, setTransactions] = useState(initialTransactions);
  const [showEntryPanel, setShowEntryPanel] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    clientId: "all",
    type: "all",
    status: "all",
    dateFrom: "",
    dateTo: "",
  });

  const [entryForm, setEntryForm] = useState({
    clientId: clients[0]?.id || "",
    type: "Invoice",
    date: todayISO(),
    dueDate: todayISO(),
    reference: "",
    amount: "",
    method: "Bank Transfer",
    status: "Open",
    description: "",
  });

  const clientMap = useMemo(() => {
    return new Map(clients.map((client) => [client.id, client]));
  }, [clients]);

  const enrichedTransactions = useMemo(() => {
    return transactions.map((transaction) => ({
      ...transaction,
      client: clientMap.get(transaction.clientId),
    }));
  }, [transactions, clientMap]);

  const updateFilter = (key, value) => {
    setFilters((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const openEntryPanel = () => {
    setEntryForm({
      clientId: filters.clientId !== "all" ? filters.clientId : clients[0]?.id || "",
      type: "Invoice",
      date: todayISO(),
      dueDate: todayISO(),
      reference: "",
      amount: "",
      method: "Bank Transfer",
      status: "Open",
      description: "",
    });
    setShowEntryPanel(true);
  };

  const visibleTransactions = useMemo(() => {
    const searchValue = normalize(filters.search);

    return enrichedTransactions.filter((transaction) => {
      const client = transaction.client || {};
      const searchableText = normalize(
        `${transaction.reference} ${transaction.description} ${transaction.type} ${transaction.status} ${transaction.method} ${client.name} ${client.company} ${client.email}`
      );

      const matchesSearch = !searchValue || searchableText.includes(searchValue);
      const matchesClient =
        filters.clientId === "all" || transaction.clientId === filters.clientId;
      const matchesType =
        filters.type === "all" || transaction.type === filters.type;
      const matchesStatus =
        filters.status === "all" || transaction.status === filters.status;
      const matchesFrom = !filters.dateFrom || transaction.date >= filters.dateFrom;
      const matchesTo = !filters.dateTo || transaction.date <= filters.dateTo;

      return (
        matchesSearch &&
        matchesClient &&
        matchesType &&
        matchesStatus &&
        matchesFrom &&
        matchesTo
      );
    });
  }, [enrichedTransactions, filters]);

  const openingBalance = useMemo(() => {
    const baseOpening =
      filters.clientId === "all"
        ? clients.reduce((sum, client) => sum + Number(client.openingBalance || 0), 0)
        : Number(clientMap.get(filters.clientId)?.openingBalance || 0);

    if (!filters.dateFrom) return baseOpening;

    const previousTransactions = enrichedTransactions.filter((transaction) => {
      const matchesClient =
        filters.clientId === "all" || transaction.clientId === filters.clientId;
      return matchesClient && transaction.date < filters.dateFrom;
    });

    return previousTransactions.reduce(
      (sum, transaction) =>
        sum + Number(transaction.debit || 0) - Number(transaction.credit || 0),
      baseOpening
    );
  }, [clients, clientMap, enrichedTransactions, filters.clientId, filters.dateFrom]);

  const ledgerRows = useMemo(() => {
    const sorted = [...visibleTransactions].sort((a, b) => {
      if (a.date === b.date) return a.id.localeCompare(b.id);
      return a.date.localeCompare(b.date);
    });

    let runningBalance = openingBalance;

    return sorted
      .map((transaction) => {
        runningBalance +=
          Number(transaction.debit || 0) - Number(transaction.credit || 0);

        return {
          ...transaction,
          runningBalance,
        };
      })
      .reverse();
  }, [visibleTransactions, openingBalance]);

  const customerSummaries = useMemo(() => {
    return clients.map((client) => {
      const rows = transactions.filter(
        (transaction) => transaction.clientId === client.id
      );

      const totalDebit =
        Number(client.openingBalance || 0) +
        rows.reduce((sum, row) => sum + Number(row.debit || 0), 0);

      const totalCredit = rows.reduce(
        (sum, row) => sum + Number(row.credit || 0),
        0
      );

      const balance = totalDebit - totalCredit;

      const overdue = rows.reduce((sum, row) => {
        if (Number(row.balanceDue || 0) <= 0) return sum;
        if (Number(row.debit || 0) <= 0) return sum;
        if (getDaysOverdue(row.dueDate) <= 0) return sum;
        return sum + Number(row.balanceDue || 0);
      }, 0);

      return {
        ...client,
        totalDebit,
        totalCredit,
        balance,
        overdue,
        creditUsage: client.creditLimit
          ? Math.min(100, Math.round((balance / client.creditLimit) * 100))
          : 0,
      };
    });
  }, [clients, transactions]);

  const summary = useMemo(() => {
    const debit = visibleTransactions.reduce(
      (sum, transaction) => sum + Number(transaction.debit || 0),
      openingBalance
    );

    const credit = visibleTransactions.reduce(
      (sum, transaction) => sum + Number(transaction.credit || 0),
      0
    );

    const overdue = visibleTransactions.reduce((sum, transaction) => {
      if (Number(transaction.balanceDue || 0) <= 0) return sum;
      if (Number(transaction.debit || 0) <= 0) return sum;
      if (getDaysOverdue(transaction.dueDate) <= 0) return sum;
      return sum + Number(transaction.balanceDue || 0);
    }, 0);

    const activeClients = new Set(
      visibleTransactions.map((transaction) => transaction.clientId)
    ).size;

    return {
      debit,
      credit,
      balance: debit - credit,
      overdue,
      activeClients,
    };
  }, [visibleTransactions, openingBalance]);

  const aging = useMemo(() => {
    const buckets = {
      current: 0,
      days1to30: 0,
      days31to60: 0,
      days61to90: 0,
      days90plus: 0,
    };

    visibleTransactions.forEach((transaction) => {
      const amount = Number(transaction.balanceDue || 0);
      if (Number(transaction.debit || 0) <= 0 || amount <= 0) return;

      const bucket = getAgingBucket(transaction.dueDate);
      buckets[bucket] += amount;
    });

    return buckets;
  }, [visibleTransactions]);

  const selectedCustomer =
    filters.clientId !== "all"
      ? customerSummaries.find((client) => client.id === filters.clientId)
      : null;

  const portfolioRiskClients = useMemo(() => {
    return [...customerSummaries]
      .filter((client) => client.balance > 0 || client.overdue > 0)
      .sort((a, b) => b.overdue - a.overdue || b.balance - a.balance)
      .slice(0, 4);
  }, [customerSummaries]);

  const latestActivity = useMemo(() => {
    return [...enrichedTransactions]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 5);
  }, [enrichedTransactions]);

  const smartInsights = useMemo(() => {
    const overdueClients = customerSummaries.filter((client) => client.overdue > 0);
    const limitWatch = customerSummaries.filter((client) => client.creditUsage >= 70);
    const unreconciled = transactions.filter(
      (transaction) => transaction.credit > 0 && !transaction.reconciled
    );

    return [
      {
        title: "Collection Focus",
        value: `${overdueClients.length} clients`,
        text:
          overdueClients.length > 0
            ? "Overdue balances need follow-up and reminders."
            : "No major overdue collection risk found.",
        icon: AlertTriangle,
        tone: overdueClients.length > 0 ? "rose" : "emerald",
      },
      {
        title: "Credit Limit Watch",
        value: `${limitWatch.length} clients`,
        text:
          limitWatch.length > 0
            ? "Some clients are close to their approved credit limits."
            : "Credit exposure is under control.",
        icon: ShieldCheck,
        tone: limitWatch.length > 0 ? "amber" : "emerald",
      },
      {
        title: "Reconciliation",
        value: `${unreconciled.length} payments`,
        text:
          unreconciled.length > 0
            ? "Some payments should be matched with invoices."
            : "Payment reconciliation looks clean.",
        icon: RefreshCcw,
        tone: unreconciled.length > 0 ? "blue" : "emerald",
      },
    ];
  }, [customerSummaries, transactions]);

  const exportCSV = () => {
    const headers = [
      "Date",
      "Client",
      "Company",
      "Type",
      "Reference",
      "Description",
      "Debit",
      "Credit",
      "Balance",
      "Status",
      "Method",
      "Due Date",
      "Created By",
    ];

    const rows = ledgerRows.map((row) => [
      row.date,
      row.client?.name || "",
      row.client?.company || "",
      row.type,
      row.reference,
      row.description,
      row.debit,
      row.credit,
      row.runningBalance,
      row.status,
      row.method,
      row.dueDate,
      row.createdBy,
    ]);

    const csv = [headers, ...rows]
      .map((line) =>
        line
          .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ledger-export-${todayISO()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const printLedger = () => {
    window.print();
  };

  const sendStatement = () => {
    const message =
      filters.clientId === "all"
        ? "Select a specific client before sending a statement."
        : `Statement action prepared for ${selectedCustomer?.company}. Connect this button with email/WhatsApp API later.`;

    window.alert(message);
  };

  const handleAddEntry = (event) => {
    event.preventDefault();

    const amount = Number(entryForm.amount || 0);

    if (!entryForm.clientId || !amount || amount <= 0) {
      window.alert("Please select a client and enter a valid amount.");
      return;
    }

    const debitTypes = [
      "Invoice",
      "Debit Note",
      "Adjustment",
      "Opening Balance",
    ];

    const isDebit = debitTypes.includes(entryForm.type);

    const newTransaction = {
      id: `TXN-${Date.now().toString().slice(-6)}`,
      clientId: entryForm.clientId,
      date: entryForm.date || todayISO(),
      dueDate: entryForm.dueDate || entryForm.date || todayISO(),
      type: entryForm.type,
      reference:
        entryForm.reference ||
        `${entryForm.type.toUpperCase().replace(/\s+/g, "-")}-${Date.now()
          .toString()
          .slice(-4)}`,
      description: entryForm.description || `${entryForm.type} entry`,
      debit: isDebit ? amount : 0,
      credit: isDebit ? 0 : amount,
      balanceDue:
        isDebit && !["Paid", "Reconciled", "Adjusted"].includes(entryForm.status)
          ? amount
          : 0,
      method: isDebit ? "—" : entryForm.method,
      status: entryForm.status,
      source: "Manual",
      createdBy: "Admin User",
      reconciled: ["Payment", "Credit Note"].includes(entryForm.type),
    };

    setTransactions((previous) => [newTransaction, ...previous]);
    setShowEntryPanel(false);
  };

  return (
    <div
      className="min-h-screen p-4 text-slate-900 sm:p-6 print:bg-white print:p-0"
      style={{
        fontFamily:
          '"Inter", "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
        background: `radial-gradient(circle at top left, ${ledgerTheme.soft}, transparent 34%), linear-gradient(180deg, ${ledgerTheme.pageBg} 0%, #ffffff 60%)`,
      }}
    >
      <style>
        {`
          @media print {
            .print-hide { display: none !important; }
            .print-card { border: 1px solid #e2e8f0 !important; box-shadow: none !important; }
          }

          input[type="date"] {
            min-width: 138px;
          }

          input[type="date"]::-webkit-calendar-picker-indicator {
            cursor: pointer;
            opacity: 0.7;
          }
        `}
      </style>

      <div className="mx-auto w-full max-w-[1500px] space-y-6 overflow-hidden">
        <section className="overflow-hidden rounded-[2rem] border border-white/80 bg-white shadow-xl shadow-teal-100/60 print-card">
          <div className="relative p-6 sm:p-8">
            <div
              className="absolute right-0 top-0 h-36 w-36 rounded-full blur-3xl"
              style={{ background: ledgerTheme.glow }}
            />

            <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 items-start gap-4">
                <div
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl text-white shadow-xl"
                  style={{
                    background: `linear-gradient(135deg, ${ledgerTheme.accent}, ${ledgerTheme.accent2})`,
                    boxShadow: `0 18px 40px ${ledgerTheme.glow}`,
                  }}
                >
                  <WalletCards className="h-8 w-8" />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">
                      Finance Control Center
                    </span>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500">
                      Customer Ledger
                    </span>
                  </div>

                  <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                    Ledger Management
                  </h1>

                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                    Track customer invoices, payments, credit notes, debit notes,
                    adjustments, running balance, overdue risk, and statements from
                    one professional CRM finance workspace.
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 flex-wrap gap-2 print-hide">
                <button
                  onClick={sendStatement}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  <Send className="h-4 w-4" />
                  Send Statement
                </button>

                <button
                  onClick={printLedger}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  <Printer className="h-4 w-4" />
                  Print
                </button>

                <button
                  onClick={exportCSV}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  <Download className="h-4 w-4" />
                  Export
                </button>

                <button
                  onClick={openEntryPanel}
                  className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5"
                >
                  <Plus className="h-4 w-4" />
                  Add Entry
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Total Debit"
            value={formatMoney(summary.debit)}
            subtitle="Invoices, debit notes and opening balances"
            icon={ArrowUpRight}
            tone="blue"
          />

          <MetricCard
            title="Total Credit"
            value={formatMoney(summary.credit)}
            subtitle="Payments, credit notes and adjustments"
            icon={ArrowDownLeft}
            tone="teal"
          />

          <MetricCard
            title="Closing Balance"
            value={formatMoney(summary.balance)}
            subtitle="Current receivable balance"
            icon={TrendingUp}
            tone={summary.balance > 0 ? "amber" : "teal"}
          />

          <MetricCard
            title="Overdue"
            value={formatMoney(summary.overdue)}
            subtitle={`${summary.activeClients} active clients in current view`}
            icon={AlertTriangle}
            tone={summary.overdue > 0 ? "rose" : "teal"}
          />
        </section>

        <section className="grid gap-4 lg:grid-cols-3 print-hide">
          {smartInsights.map((insight) => {
            const Icon = insight.icon;

            return (
              <div
                key={insight.title}
                className="rounded-3xl border border-white/80 bg-white p-5 shadow-sm shadow-slate-200/70"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                      insight.tone === "rose"
                        ? "bg-rose-50 text-rose-600"
                        : insight.tone === "amber"
                        ? "bg-amber-50 text-amber-600"
                        : insight.tone === "blue"
                        ? "bg-blue-50 text-blue-600"
                        : "bg-emerald-50 text-emerald-600"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-950">
                      {insight.title}
                    </p>
                    <p className="mt-1 text-xl font-bold text-slate-950">
                      {insight.value}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {insight.text}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        <section className="rounded-[2rem] border border-white/80 bg-white p-4 shadow-sm shadow-slate-200/70 print-hide">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                <SlidersHorizontal className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-bold text-slate-950">
                  Filters & Search
                </h2>
                <p className="text-xs text-slate-500">
                  Filter by client, date, type, status or reference.
                </p>
              </div>
            </div>

            <button
              onClick={() =>
                setFilters({
                  search: "",
                  clientId: "all",
                  type: "all",
                  status: "all",
                  dateFrom: "",
                  dateTo: "",
                })
              }
              className="inline-flex shrink-0 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
            >
              <RefreshCcw className="h-4 w-4" />
              Reset Filters
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(260px,1.6fr)_180px_160px_160px_150px_150px]">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-500">
                Search
              </label>
              <div className="flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3">
                <Search className="h-4 w-4 shrink-0 text-slate-400" />
                <input
                  value={filters.search}
                  onChange={(event) => updateFilter("search", event.target.value)}
                  placeholder="Reference, client, company..."
                  className="w-full min-w-0 bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-500">
                Client
              </label>
              <select
                value={filters.clientId}
                onChange={(event) => updateFilter("clientId", event.target.value)}
                className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-teal-300"
              >
                <option value="all">All Clients</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.company}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-500">
                Type
              </label>
              <select
                value={filters.type}
                onChange={(event) => updateFilter("type", event.target.value)}
                className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-teal-300"
              >
                {typeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type === "all" ? "All Types" : type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-500">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(event) => updateFilter("status", event.target.value)}
                className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-teal-300"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status === "all" ? "All Status" : status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-500">
                From
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(event) => updateFilter("dateFrom", event.target.value)}
                className="h-11 w-full min-w-[140px] rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-teal-300"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-500">
                To
              </label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(event) => updateFilter("dateTo", event.target.value)}
                className="h-11 w-full min-w-[140px] rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-teal-300"
              />
            </div>
          </div>
        </section>

        <section className="grid min-w-0 gap-6 2xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="min-w-0 overflow-hidden rounded-[2rem] border border-white/80 bg-white shadow-sm shadow-slate-200/70 print-card">
            <div className="border-b border-slate-100 p-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <h2 className="text-xl font-bold text-slate-950">
                    Transaction Ledger
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Opening balance:{" "}
                    <span className="font-bold text-slate-800">
                      {formatMoney(openingBalance)}
                    </span>{" "}
                    · Showing{" "}
                    <span className="font-bold text-slate-800">
                      {ledgerRows.length}
                    </span>{" "}
                    entries
                  </p>
                </div>

                <div className="inline-flex w-fit shrink-0 items-center gap-2 rounded-2xl border border-teal-200 bg-teal-50 px-3 py-2 text-xs font-bold text-teal-700">
                  <Filter className="h-4 w-4" />
                  Running Balance
                </div>
              </div>
            </div>

            <div className="max-w-full overflow-x-auto">
              {ledgerRows.length === 0 ? (
                <div className="p-5">
                  <EmptyState onAdd={openEntryPanel} />
                </div>
              ) : (
                <table className="w-full min-w-[1080px] table-fixed text-left">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/80 text-xs uppercase tracking-wide text-slate-400">
                      <th className="w-[155px] px-5 py-4 font-bold">Date</th>
                      <th className="w-[170px] px-5 py-4 font-bold">Client</th>
                      <th className="w-[240px] px-5 py-4 font-bold">Reference</th>
                      <th className="w-[150px] px-5 py-4 font-bold">Type</th>
                      <th className="w-[125px] px-5 py-4 text-right font-bold">
                        Debit
                      </th>
                      <th className="w-[125px] px-5 py-4 text-right font-bold">
                        Credit
                      </th>
                      <th className="w-[135px] px-5 py-4 text-right font-bold">
                        Balance
                      </th>
                      <th className="w-[135px] px-5 py-4 font-bold">Status</th>
                      <th className="w-[95px] px-5 py-4 font-bold print-hide">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {ledgerRows.map((row) => {
                      const IsDebitIcon = row.debit > 0 ? ArrowUpRight : ArrowDownLeft;
                      const isOverdue =
                        Number(row.balanceDue || 0) > 0 &&
                        getDaysOverdue(row.dueDate) > 0;

                      return (
                        <tr
                          key={row.id}
                          className="group transition hover:bg-slate-50/80"
                        >
                          <td className="px-5 py-4 align-middle">
                            <DateCell
                              date={row.date}
                              dueDate={row.dueDate}
                              isOverdue={isOverdue}
                            />
                          </td>

                          <td className="px-5 py-4 align-middle">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-slate-950">
                                {row.client?.company || "Unknown Client"}
                              </p>
                              <p className="mt-1 truncate text-xs font-medium text-slate-500">
                                {row.client?.name || "—"} · {row.client?.segment || "—"}
                              </p>
                            </div>
                          </td>

                          <td className="px-5 py-4 align-middle">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-slate-800">
                                {row.reference}
                              </p>
                              <p className="mt-1 truncate text-xs text-slate-500">
                                {row.description}
                              </p>
                            </div>
                          </td>

                          <td className="px-5 py-4 align-middle">
                            <div className="flex items-center gap-2">
                              <div
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                                  row.debit > 0
                                    ? "bg-blue-50 text-blue-600"
                                    : "bg-emerald-50 text-emerald-600"
                                }`}
                              >
                                <IsDebitIcon className="h-4 w-4" />
                              </div>

                              <div className="min-w-0">
                                <p className="truncate text-sm font-bold text-slate-800">
                                  {row.type}
                                </p>
                                <p className="truncate text-xs text-slate-400">
                                  {row.method}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4 text-right align-middle">
                            <p className="whitespace-nowrap text-sm font-bold text-blue-700">
                              {row.debit > 0 ? formatMoney(row.debit) : "—"}
                            </p>
                          </td>

                          <td className="px-5 py-4 text-right align-middle">
                            <p className="whitespace-nowrap text-sm font-bold text-emerald-700">
                              {row.credit > 0 ? formatMoney(row.credit) : "—"}
                            </p>
                          </td>

                          <td className="px-5 py-4 text-right align-middle">
                            <p
                              className={`whitespace-nowrap text-sm font-bold ${
                                row.runningBalance > 0
                                  ? "text-slate-950"
                                  : "text-emerald-700"
                              }`}
                            >
                              {formatMoney(row.runningBalance)}
                            </p>
                            {row.balanceDue > 0 && (
                              <p className="mt-1 whitespace-nowrap text-xs font-semibold text-amber-600">
                                Due {formatMoney(row.balanceDue)}
                              </p>
                            )}
                          </td>

                          <td className="px-5 py-4 align-middle">
                            <StatusBadge status={row.status} />
                            <p className="mt-1 whitespace-nowrap text-xs text-slate-400">
                              {row.reconciled ? "Reconciled" : "Unmatched"}
                            </p>
                          </td>

                          <td className="px-5 py-4 align-middle print-hide">
                            <div className="flex items-center gap-2">
                              <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-950">
                                <Eye className="h-4 w-4" />
                              </button>

                              <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-950">
                                <MoreHorizontal className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <aside className="grid min-w-0 gap-6 lg:grid-cols-3 2xl:block 2xl:space-y-6">
            <div className="rounded-[2rem] border border-white/80 bg-white p-5 shadow-sm shadow-slate-200/70 print-card">
              {selectedCustomer ? (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-bold text-slate-950">
                        {selectedCustomer.company}
                      </h3>
                      <p className="mt-1 truncate text-sm font-medium text-slate-500">
                        {selectedCustomer.name} · {selectedCustomer.segment}
                      </p>
                    </div>

                    <span
                      className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${
                        getHealth(selectedCustomer).className
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          getHealth(selectedCustomer).dot
                        }`}
                      />
                      {getHealth(selectedCustomer).label}
                    </span>
                  </div>

                  <div className="mt-5 space-y-3">
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3">
                      <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                      <p className="truncate text-sm font-semibold text-slate-600">
                        {selectedCustomer.email}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3">
                      <Phone className="h-4 w-4 shrink-0 text-slate-400" />
                      <p className="truncate text-sm font-semibold text-slate-600">
                        {selectedCustomer.phone}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                      <p className="text-xs font-bold text-slate-400">
                        Balance
                      </p>
                      <p className="mt-1 text-lg font-bold text-slate-950">
                        {formatMoney(selectedCustomer.balance)}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                      <p className="text-xs font-bold text-slate-400">
                        Overdue
                      </p>
                      <p className="mt-1 text-lg font-bold text-rose-600">
                        {formatMoney(selectedCustomer.overdue)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-500">Credit Limit Usage</span>
                      <span className="text-slate-950">
                        {selectedCustomer.creditUsage}%
                      </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-teal-600 to-emerald-400"
                        style={{
                          width: `${selectedCustomer.creditUsage}%`,
                        }}
                      />
                    </div>

                    <p className="mt-2 text-xs text-slate-500">
                      Limit:{" "}
                      <span className="font-bold text-slate-700">
                        {formatMoney(selectedCustomer.creditLimit)}
                      </span>
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                      <UsersRound className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold text-slate-950">
                        Portfolio Overview
                      </h3>
                      <p className="text-sm text-slate-500">
                        Select a client to view statement.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    {portfolioRiskClients.map((client) => {
                      const health = getHealth(client);

                      return (
                        <div
                          key={client.id}
                          className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-slate-950">
                                {client.company}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                Balance {formatMoney(client.balance)}
                              </p>
                            </div>

                            <span
                              className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-bold ${health.className}`}
                            >
                              {health.label}
                            </span>
                          </div>

                          {client.overdue > 0 && (
                            <p className="mt-2 text-xs font-bold text-rose-600">
                              Overdue: {formatMoney(client.overdue)}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            <div className="rounded-[2rem] border border-white/80 bg-white p-5 shadow-sm shadow-slate-200/70 print-card">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                  <Clock3 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-950">
                    A/R Aging
                  </h3>
                  <p className="text-sm text-slate-500">
                    Outstanding dues by age bucket.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  ["Current", aging.current, "bg-emerald-500"],
                  ["1 - 30 Days", aging.days1to30, "bg-blue-500"],
                  ["31 - 60 Days", aging.days31to60, "bg-amber-500"],
                  ["61 - 90 Days", aging.days61to90, "bg-orange-500"],
                  ["90+ Days", aging.days90plus, "bg-rose-500"],
                ].map(([label, value, colorClass]) => {
                  const maxValue = Math.max(
                    aging.current,
                    aging.days1to30,
                    aging.days31to60,
                    aging.days61to90,
                    aging.days90plus,
                    1
                  );

                  return (
                    <div key={label}>
                      <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                        <span className="font-semibold text-slate-600">{label}</span>
                        <span className="whitespace-nowrap font-bold text-slate-950">
                          {formatMoney(value)}
                        </span>
                      </div>

                      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${colorClass}`}
                          style={{
                            width: `${Math.round((value / maxValue) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/80 bg-white p-5 shadow-sm shadow-slate-200/70 print-hide">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                  <ReceiptText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-950">
                    Latest Audit Trail
                  </h3>
                  <p className="text-sm text-slate-500">
                    Recent finance actions.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {latestActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3"
                  >
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-500">
                      {activity.credit > 0 ? (
                        <Banknote className="h-4 w-4" />
                      ) : (
                        <FileText className="h-4 w-4" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-slate-800">
                        {activity.type} · {activity.reference}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        {activity.client?.company} by {activity.createdBy}
                      </p>
                    </div>

                    <p className="shrink-0 text-xs font-bold text-slate-400">
                      {formatDate(activity.date)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </div>

      {showEntryPanel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm print-hide">
          <div className="w-full max-w-2xl overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-slate-900/20">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                  <Plus className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-slate-950">
                    Add Ledger Entry
                  </h3>
                  <p className="text-sm text-slate-500">
                    Invoice, payment, credit note, debit note or adjustment.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowEntryPanel(false)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-950"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddEntry} className="p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-500">
                    Client
                  </label>
                  <select
                    value={entryForm.clientId}
                    onChange={(event) =>
                      setEntryForm((previous) => ({
                        ...previous,
                        clientId: event.target.value,
                      }))
                    }
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 outline-none focus:border-teal-300"
                  >
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.company}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-500">
                    Entry Type
                  </label>
                  <select
                    value={entryForm.type}
                    onChange={(event) =>
                      setEntryForm((previous) => ({
                        ...previous,
                        type: event.target.value,
                      }))
                    }
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 outline-none focus:border-teal-300"
                  >
                    {typeOptions
                      .filter((type) => type !== "all")
                      .map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-500">
                    Transaction Date
                  </label>
                  <input
                    type="date"
                    value={entryForm.date}
                    onChange={(event) =>
                      setEntryForm((previous) => ({
                        ...previous,
                        date: event.target.value,
                      }))
                    }
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 outline-none focus:border-teal-300"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-500">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={entryForm.dueDate}
                    onChange={(event) =>
                      setEntryForm((previous) => ({
                        ...previous,
                        dueDate: event.target.value,
                      }))
                    }
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 outline-none focus:border-teal-300"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-500">
                    Reference No
                  </label>
                  <input
                    value={entryForm.reference}
                    onChange={(event) =>
                      setEntryForm((previous) => ({
                        ...previous,
                        reference: event.target.value,
                      }))
                    }
                    placeholder="INV-0001 / PAY-0001"
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400 focus:border-teal-300"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-500">
                    Amount
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={entryForm.amount}
                    onChange={(event) =>
                      setEntryForm((previous) => ({
                        ...previous,
                        amount: event.target.value,
                      }))
                    }
                    placeholder="0"
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400 focus:border-teal-300"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-500">
                    Payment Method
                  </label>
                  <select
                    value={entryForm.method}
                    onChange={(event) =>
                      setEntryForm((previous) => ({
                        ...previous,
                        method: event.target.value,
                      }))
                    }
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 outline-none focus:border-teal-300"
                  >
                    {paymentMethods.map((method) => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-500">
                    Status
                  </label>
                  <select
                    value={entryForm.status}
                    onChange={(event) =>
                      setEntryForm((previous) => ({
                        ...previous,
                        status: event.target.value,
                      }))
                    }
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 outline-none focus:border-teal-300"
                  >
                    {statusOptions
                      .filter((status) => status !== "all")
                      .map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-bold text-slate-500">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={entryForm.description}
                    onChange={(event) =>
                      setEntryForm((previous) => ({
                        ...previous,
                        description: event.target.value,
                      }))
                    }
                    placeholder="Write transaction details..."
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400 focus:border-teal-300"
                  />
                </div>
              </div>

              <div className="mt-5 flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEntryPanel(false)}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="hidden print:block">
        <p className="mt-6 text-center text-xs text-slate-400">
          Generated from M.CRM Ledger Management
        </p>
      </div>
    </div>
  );
}

export default Ledger;