import { useMemo, useState } from "react";
import PageTitle from "../components/PageTitle";
import {
  AlertTriangle,
  BadgeDollarSign,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  ClipboardList,
  Edit3,
  Eye,
  FileText,
  Filter,
  Handshake,
  MoveRight,
  Plus,
  Search,
  Target,
  Trash2,
  TrendingUp,
  Trophy,
  UserRound,
  X,
  XCircle,
} from "lucide-react";

import { deals as initialDeals } from "../data/crmData";

const CURRENCY = "PKR";

const STAGES = [
  {
    name: "Requirement Taken",
    probability: 20,
    color: "border-blue-200 bg-blue-50 text-blue-800",
  },
  {
    name: "Proposal Sent",
    probability: 40,
    color: "border-purple-200 bg-purple-50 text-purple-800",
  },
  {
    name: "Negotiation",
    probability: 70,
    color: "border-amber-200 bg-amber-50 text-amber-800",
  },
  {
    name: "Won",
    probability: 100,
    color: "border-emerald-200 bg-emerald-50 text-emerald-800",
  },
  {
    name: "Lost",
    probability: 0,
    color: "border-rose-200 bg-rose-50 text-rose-800",
  },
];

const emptyForm = {
  title: "",
  client: "",
  company: "",
  phone: "",
  email: "",
  service: "",
  amount: "",
  stage: "Requirement Taken",
  priority: "Medium",
  owner: "Admin",
  source: "Direct",
  expectedCloseDate: "",
  nextStep: "",
  probability: 20,
  status: "Open",
  notes: "",
  lossReason: "",
};

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function getFutureDate(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function parseAmount(value) {
  if (typeof value === "number") return value;

  const cleaned = String(value || "")
    .replace(/[^\d.]/g, "")
    .trim();

  return Number(cleaned || 0);
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: CURRENCY,
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
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

function getStageProbability(stage) {
  return STAGES.find((item) => item.name === stage)?.probability ?? 0;
}

function getStageColor(stage) {
  return (
    STAGES.find((item) => item.name === stage)?.color ||
    "border-slate-200 bg-slate-50 text-slate-700"
  );
}

function getStageIndex(stage) {
  return STAGES.findIndex((item) => item.name === stage);
}

function isOpenDeal(deal) {
  return !["Won", "Lost"].includes(deal.stage);
}

function isOverdue(deal) {
  if (!isOpenDeal(deal)) return false;
  if (!deal.expectedCloseDate) return false;

  return new Date(deal.expectedCloseDate) < new Date(getToday());
}

function isClosingThisMonth(deal) {
  if (!deal.expectedCloseDate || !isOpenDeal(deal)) return false;

  const today = new Date();
  const closeDate = new Date(deal.expectedCloseDate);

  return (
    closeDate.getMonth() === today.getMonth() &&
    closeDate.getFullYear() === today.getFullYear()
  );
}

function normalizeDeal(deal, index) {
  const stage = deal.stage || "Requirement Taken";
  const amount = parseAmount(deal.amount);

  return {
    id: deal.id ?? index + 1,
    title: deal.title ?? "Untitled Deal",
    client: deal.client ?? deal.name ?? "Unknown Client",
    company: deal.company ?? "",
    phone: deal.phone ?? "",
    email: deal.email ?? "",
    service: deal.service ?? deal.title ?? "",
    amount,
    stage,
    priority: deal.priority ?? "Medium",
    owner: deal.owner ?? "Admin",
    source: deal.source ?? "Direct",
    expectedCloseDate: deal.expectedCloseDate ?? getFutureDate(7),
    nextStep: deal.nextStep ?? "Follow up with client",
    probability: deal.probability ?? getStageProbability(stage),
    status: deal.status ?? (stage === "Won" ? "Won" : stage === "Lost" ? "Lost" : "Open"),
    notes: deal.notes ?? "",
    lossReason: deal.lossReason ?? "",
    createdAt: deal.createdAt ?? getToday(),
  };
}

function StageBadge({ stage }) {
  return (
    <span
      className={`inline-flex rounded-lg border px-2.5 py-1 text-xs font-semibold ${getStageColor(
        stage
      )}`}
    >
      {stage}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const map = {
    High: "border-rose-200 bg-rose-50 text-rose-800",
    Medium: "border-amber-200 bg-amber-50 text-amber-800",
    Low: "border-blue-200 bg-blue-50 text-blue-800",
  };

  return (
    <span
      className={`inline-flex rounded-lg border px-2.5 py-1 text-xs font-semibold ${
        map[priority] || "border-slate-200 bg-slate-50 text-slate-700"
      }`}
    >
      {priority}
    </span>
  );
}

function StatusBadge({ status }) {
  const map = {
    Open: "border-blue-200 bg-blue-50 text-blue-800",
    Won: "border-emerald-200 bg-emerald-50 text-emerald-800",
    Lost: "border-rose-200 bg-rose-50 text-rose-800",
  };

  return (
    <span
      className={`inline-flex rounded-lg border px-2.5 py-1 text-xs font-semibold ${
        map[status] || "border-slate-200 bg-slate-50 text-slate-700"
      }`}
    >
      {status}
    </span>
  );
}

function StatCard({ title, value, subtitle, icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition dark:border-slate-800 dark:bg-slate-950">
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

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
          {icon}
        </div>
      </div>
    </div>
  );
}

function Toast({ message, type, onClose }) {
  const colors = {
    success: "bg-emerald-50 border-emerald-300 text-emerald-800",
    error: "bg-rose-50 border-rose-300 text-rose-800",
    info: "bg-blue-50 border-blue-300 text-blue-800",
  };

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium shadow-lg ${
        colors[type] ?? colors.info
      }`}
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        className="rounded-md p-1 opacity-60 transition hover:bg-black/5 hover:opacity-100"
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function ConfirmModal({ deal, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/50 px-4">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
            <AlertTriangle className="h-6 w-6" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-950 dark:text-white">
              Delete Deal?
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Are you sure you want to delete <strong>{deal.title}</strong>?
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-rose-600 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
          >
            Delete Deal
          </button>
        </div>
      </div>
    </div>
  );
}

function DealViewModal({ deal, onClose, onEdit, onMarkWon, onMarkLost, onMoveNext }) {
  const weightedAmount = (Number(deal.amount || 0) * Number(deal.probability || 0)) / 100;
  const overdue = isOverdue(deal);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/50 px-4">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-7 flex items-start justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
              <BriefcaseBusiness className="h-7 w-7" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-slate-950 dark:text-white">
                {deal.title}
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {deal.client} {deal.company ? `• ${deal.company}` : ""}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <StageBadge stage={deal.stage} />
                <PriorityBadge priority={deal.priority} />
                <StatusBadge status={deal.status} />
                {overdue && (
                  <span className="inline-flex rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-800">
                    Overdue
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 p-2 text-slate-400 transition hover:bg-slate-50 hover:text-slate-700 dark:border-slate-800 dark:hover:bg-slate-900 dark:hover:text-slate-200"
            aria-label="Close deal profile"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-950 dark:text-white">
              <BadgeDollarSign className="h-4 w-4" />
              Deal Value
            </div>
            <p className="text-2xl font-bold text-slate-950 dark:text-white">
              {formatCurrency(deal.amount)}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Total opportunity amount
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-950 dark:text-white">
              <Target className="h-4 w-4" />
              Probability
            </div>
            <p className="text-2xl font-bold text-slate-950 dark:text-white">
              {deal.probability}%
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Chance to close
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-950 dark:text-white">
              <TrendingUp className="h-4 w-4" />
              Weighted Value
            </div>
            <p className="text-2xl font-bold text-slate-950 dark:text-white">
              {formatCurrency(weightedAmount)}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Forecasted revenue
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-950 dark:text-white">
              <CalendarClock className="h-4 w-4" />
              Close Date
            </div>
            <p className="text-2xl font-bold text-slate-950 dark:text-white">
              {formatDate(deal.expectedCloseDate)}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Expected closing date
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-950 dark:text-white">
              <UserRound className="h-4 w-4" />
              Client Details
            </div>

            <div className="space-y-3 text-sm">
              <p className="flex justify-between gap-3">
                <span className="text-slate-500 dark:text-slate-400">Client</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {deal.client}
                </span>
              </p>

              <p className="flex justify-between gap-3">
                <span className="text-slate-500 dark:text-slate-400">Company</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {deal.company || "N/A"}
                </span>
              </p>

              <p className="flex justify-between gap-3">
                <span className="text-slate-500 dark:text-slate-400">Phone</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {deal.phone || "N/A"}
                </span>
              </p>

              <p className="flex justify-between gap-3">
                <span className="text-slate-500 dark:text-slate-400">Email</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {deal.email || "N/A"}
                </span>
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-950 dark:text-white">
              <ClipboardList className="h-4 w-4" />
              Sales Details
            </div>

            <div className="space-y-3 text-sm">
              <p className="flex justify-between gap-3">
                <span className="text-slate-500 dark:text-slate-400">Service</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {deal.service || "N/A"}
                </span>
              </p>

              <p className="flex justify-between gap-3">
                <span className="text-slate-500 dark:text-slate-400">Owner</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {deal.owner || "N/A"}
                </span>
              </p>

              <p className="flex justify-between gap-3">
                <span className="text-slate-500 dark:text-slate-400">Source</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {deal.source || "N/A"}
                </span>
              </p>

              <p className="flex justify-between gap-3">
                <span className="text-slate-500 dark:text-slate-400">Created</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {formatDate(deal.createdAt)}
                </span>
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-950 dark:text-white">
              <MoveRight className="h-4 w-4" />
              Next Step
            </div>

            <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
              {deal.nextStep || "No next step added."}
            </p>

            {deal.stage === "Lost" && deal.lossReason && (
              <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-rose-700">
                  Loss Reason
                </p>
                <p className="mt-1 text-sm text-rose-700">{deal.lossReason}</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-950 dark:text-white">
            <FileText className="h-4 w-4" />
            Notes
          </div>

          <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
            {deal.notes || "No notes added for this deal."}
          </p>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <button
            onClick={() => onEdit(deal)}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            <Edit3 className="h-4 w-4" />
            Edit Deal
          </button>

          <button
            onClick={() => onMoveNext(deal)}
            disabled={!isOpenDeal(deal)}
            className="flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <MoveRight className="h-4 w-4" />
            Move Next
          </button>

          <button
            onClick={() => onMarkWon(deal)}
            disabled={deal.stage === "Won"}
            className="flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Trophy className="h-4 w-4" />
            Mark Won
          </button>

          <button
            onClick={() => onMarkLost(deal)}
            disabled={deal.stage === "Lost"}
            className="flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <XCircle className="h-4 w-4" />
            Mark Lost
          </button>
        </div>
      </div>
    </div>
  );
}

function DealFormModal({ deal, onSave, onClose }) {
  const [form, setForm] = useState(() => ({
    ...(deal ?? emptyForm),
    amount: deal?.amount ?? "",
    expectedCloseDate: deal?.expectedCloseDate || getFutureDate(7),
  }));

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => {
      const nextForm = { ...previous, [name]: value };

      if (name === "stage") {
        const probability = getStageProbability(value);
        nextForm.probability = probability;
        nextForm.status = value === "Won" ? "Won" : value === "Lost" ? "Lost" : "Open";
      }

      return nextForm;
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.title.trim() || !form.client.trim() || !form.amount) {
      return;
    }

    onSave({
      ...form,
      amount: Number(form.amount || 0),
      probability: Number(form.probability || getStageProbability(form.stage)),
      status: form.stage === "Won" ? "Won" : form.stage === "Lost" ? "Lost" : "Open",
    });
  }

  const fieldClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-950";

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/50 px-4">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-7 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-slate-950 dark:text-white">
              {deal ? "Edit Deal" : "Add New Deal"}
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage deal value, pipeline stage, close date, probability, owner,
              next step, and notes.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 p-2 text-slate-400 transition hover:bg-slate-50 hover:text-slate-700 dark:border-slate-800 dark:hover:bg-slate-900 dark:hover:text-slate-200"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h4 className="mb-3 text-sm font-bold text-slate-950 dark:text-white">
              Deal Information
            </h4>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Deal Title *
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Website Design Project"
                  className={fieldClass}
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Client Name *
                </label>
                <input
                  name="client"
                  value={form.client}
                  onChange={handleChange}
                  placeholder="Ali Khan"
                  className={fieldClass}
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Company
                </label>
                <input
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="Company name"
                  className={fieldClass}
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-bold text-slate-950 dark:text-white">
              Contact Details
            </h4>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Phone
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="0300-1234567"
                  className={fieldClass}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Email
                </label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="client@example.com"
                  className={fieldClass}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Source
                </label>
                <select
                  name="source"
                  value={form.source}
                  onChange={handleChange}
                  className={fieldClass}
                >
                  {["Direct", "Facebook", "WhatsApp", "Google", "Referral", "Website"].map(
                    (source) => (
                      <option key={source}>{source}</option>
                    )
                  )}
                </select>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-bold text-slate-950 dark:text-white">
              Pipeline Details
            </h4>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Service
                </label>
                <input
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                  placeholder="Website Design"
                  className={fieldClass}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Stage
                </label>
                <select
                  name="stage"
                  value={form.stage}
                  onChange={handleChange}
                  className={fieldClass}
                >
                  {STAGES.map((stage) => (
                    <option key={stage.name}>{stage.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Priority
                </label>
                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  className={fieldClass}
                >
                  {["High", "Medium", "Low"].map((priority) => (
                    <option key={priority}>{priority}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Owner
                </label>
                <input
                  name="owner"
                  value={form.owner}
                  onChange={handleChange}
                  placeholder="Admin"
                  className={fieldClass}
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-bold text-slate-950 dark:text-white">
              Forecast Details
            </h4>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Amount *
                </label>
                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="50000"
                  min="0"
                  className={fieldClass}
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Probability %
                </label>
                <input
                  type="number"
                  name="probability"
                  value={form.probability}
                  onChange={handleChange}
                  placeholder="40"
                  min="0"
                  max="100"
                  className={fieldClass}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Expected Close Date
                </label>
                <input
                  type="date"
                  name="expectedCloseDate"
                  value={form.expectedCloseDate}
                  onChange={handleChange}
                  className={fieldClass}
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-bold text-slate-950 dark:text-white">
              Next Step and Notes
            </h4>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Next Step
                </label>
                <textarea
                  name="nextStep"
                  value={form.nextStep}
                  onChange={handleChange}
                  placeholder="Send proposal, call client, schedule meeting..."
                  className={`${fieldClass} min-h-[120px] resize-none`}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Add internal deal notes..."
                  className={`${fieldClass} min-h-[120px] resize-none`}
                />
              </div>
            </div>
          </div>

          {form.stage === "Lost" && (
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Loss Reason
              </label>
              <textarea
                name="lossReason"
                value={form.lossReason}
                onChange={handleChange}
                placeholder="Price issue, no response, competitor selected..."
                className={`${fieldClass} min-h-[100px] resize-none`}
              />
            </div>
          )}

          <div className="flex flex-col gap-3 pt-4 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-950 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              {deal ? (
                <>
                  <Edit3 className="h-4 w-4" />
                  Save Changes
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add Deal
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Deals() {
  const [dealList, setDealList] = useState(() =>
    initialDeals.map((deal, index) => normalizeDeal(deal, index))
  );

  const [search, setSearch] = useState("");
  const [filterStage, setFilterStage] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [sortBy, setSortBy] = useState("closeDate");
  const [viewMode, setViewMode] = useState("kanban");
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  function handleAdd(form) {
    const newDeal = {
      ...form,
      id: Date.now(),
      createdAt: getToday(),
    };

    setDealList((previous) => [newDeal, ...previous]);
    setModal(null);
    showToast("Deal added successfully.");
  }

  function handleEdit(form) {
    setDealList((previous) =>
      previous.map((deal) =>
        deal.id === modal.deal.id
          ? {
              ...modal.deal,
              ...form,
            }
          : deal
      )
    );

    setModal(null);
    showToast("Deal updated successfully.");
  }

  function handleDelete() {
    setDealList((previous) =>
      previous.filter((deal) => deal.id !== modal.deal.id)
    );

    setModal(null);
    showToast("Deal deleted successfully.", "error");
  }

  function updateDealStage(deal, stage) {
    setDealList((previous) =>
      previous.map((item) =>
        item.id === deal.id
          ? {
              ...item,
              stage,
              probability: getStageProbability(stage),
              status: stage === "Won" ? "Won" : stage === "Lost" ? "Lost" : "Open",
            }
          : item
      )
    );
  }

  function handleMoveNext(deal) {
    const currentIndex = getStageIndex(deal.stage);

    if (currentIndex < 0 || currentIndex >= STAGES.length - 2) {
      return;
    }

    const nextStage = STAGES[currentIndex + 1].name;
    updateDealStage(deal, nextStage);
    setModal(null);
    showToast(`Deal moved to ${nextStage}.`, "info");
  }

  function handleMovePrevious(deal) {
    const currentIndex = getStageIndex(deal.stage);

    if (currentIndex <= 0 || !isOpenDeal(deal)) {
      return;
    }

    const previousStage = STAGES[currentIndex - 1].name;
    updateDealStage(deal, previousStage);
    showToast(`Deal moved to ${previousStage}.`, "info");
  }

  function handleMarkWon(deal) {
    updateDealStage(deal, "Won");
    setModal(null);
    showToast("Deal marked as won.");
  }

  function handleMarkLost(deal) {
    updateDealStage(deal, "Lost");
    setModal(null);
    showToast("Deal marked as lost.", "error");
  }

  const stats = useMemo(() => {
    const openDeals = dealList.filter((deal) => isOpenDeal(deal));
    const wonDeals = dealList.filter((deal) => deal.stage === "Won");
    const overdueDeals = dealList.filter((deal) => isOverdue(deal));
    const closingThisMonth = dealList.filter((deal) => isClosingThisMonth(deal));

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

    return {
      totalDeals: dealList.length,
      pipelineValue,
      weightedForecast,
      wonRevenue,
      overdueCount: overdueDeals.length,
      closingThisMonth: closingThisMonth.length,
    };
  }, [dealList]);

  const filteredDeals = useMemo(() => {
    const searchValue = search.toLowerCase();

    return dealList
      .filter((deal) => {
        const matchSearch =
          deal.title.toLowerCase().includes(searchValue) ||
          deal.client.toLowerCase().includes(searchValue) ||
          deal.company.toLowerCase().includes(searchValue) ||
          deal.service.toLowerCase().includes(searchValue) ||
          deal.owner.toLowerCase().includes(searchValue) ||
          deal.source.toLowerCase().includes(searchValue);

        const matchStage = filterStage === "All" || deal.stage === filterStage;
        const matchStatus = filterStatus === "All" || deal.status === filterStatus;
        const matchPriority =
          filterPriority === "All" || deal.priority === filterPriority;

        return matchSearch && matchStage && matchStatus && matchPriority;
      })
      .sort((a, b) => {
        if (sortBy === "highestAmount") {
          return Number(b.amount || 0) - Number(a.amount || 0);
        }

        if (sortBy === "probability") {
          return Number(b.probability || 0) - Number(a.probability || 0);
        }

        if (sortBy === "latest") {
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }

        return new Date(a.expectedCloseDate || "9999-12-31") - new Date(b.expectedCloseDate || "9999-12-31");
      });
  }, [dealList, search, filterStage, filterStatus, filterPriority, sortBy]);

  return (
    <div className="w-full max-w-full">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <PageTitle
          title="Deals / Pipeline"
          subtitle="Track every deal from requirement to closing with revenue forecasting"
        />

        <button
          onClick={() => setModal({ type: "add" })}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
        >
          <Plus className="h-4 w-4" />
          Add New Deal
        </button>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Pipeline Value"
          value={formatCurrency(stats.pipelineValue)}
          subtitle="Open deal amount"
          icon={<BadgeDollarSign className="h-5 w-5" />}
        />

        <StatCard
          title="Weighted Forecast"
          value={formatCurrency(stats.weightedForecast)}
          subtitle="Amount by probability"
          icon={<TrendingUp className="h-5 w-5" />}
        />

        <StatCard
          title="Won Revenue"
          value={formatCurrency(stats.wonRevenue)}
          subtitle="Closed successful deals"
          icon={<Trophy className="h-5 w-5" />}
        />

        <StatCard
          title="Pipeline Health"
          value={`${stats.overdueCount} overdue`}
          subtitle={`${stats.closingThisMonth} closing this month`}
          icon={<CircleAlert className="h-5 w-5" />}
        />
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Search by deal, client, company, owner..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-slate-600"
          />
        </div>

        <select
          value={filterStage}
          onChange={(event) => setFilterStage(event.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
        >
          <option value="All">All Stages</option>
          {STAGES.map((stage) => (
            <option key={stage.name}>{stage.name}</option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(event) => setFilterStatus(event.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
        >
          <option value="All">All Status</option>
          {["Open", "Won", "Lost"].map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>

        <select
          value={filterPriority}
          onChange={(event) => setFilterPriority(event.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
        >
          <option value="All">All Priority</option>
          {["High", "Medium", "Low"].map((priority) => (
            <option key={priority}>{priority}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
        >
          <option value="closeDate">Nearest Close Date</option>
          <option value="highestAmount">Highest Amount</option>
          <option value="probability">Highest Probability</option>
          <option value="latest">Latest Created</option>
        </select>

        <button
          onClick={() =>
            setViewMode((current) => (current === "kanban" ? "table" : "kanban"))
          }
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
        >
          <Filter className="h-4 w-4" />
          {viewMode === "kanban" ? "Table View" : "Kanban View"}
        </button>
      </div>

      {viewMode === "kanban" ? (
        <div className="grid gap-5 xl:grid-cols-5">
          {STAGES.map((stage) => {
            const stageDeals = filteredDeals.filter(
              (deal) => deal.stage === stage.name
            );

            const stageValue = stageDeals.reduce(
              (sum, deal) => sum + Number(deal.amount || 0),
              0
            );

            return (
              <div
                key={stage.name}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-950 dark:text-white">
                        {stage.name}
                      </h3>

                      <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                        {stageDeals.length}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {formatCurrency(stageValue)}
                    </p>
                  </div>

                  <span className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-bold text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                    {stage.probability}%
                  </span>
                </div>

                <div className="space-y-3">
                  {stageDeals.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-200 py-8 text-center text-sm text-slate-400 dark:border-slate-800">
                      No deals
                    </div>
                  ) : (
                    stageDeals.map((deal) => {
                      const overdue = isOverdue(deal);
                      const weightedAmount =
                        (Number(deal.amount || 0) *
                          Number(deal.probability || 0)) /
                        100;

                      return (
                        <div
                          key={deal.id}
                          className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-white hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-950"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h4 className="font-semibold text-slate-900 dark:text-white">
                                {deal.title}
                              </h4>
                              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                {deal.client}
                              </p>
                            </div>

                            <PriorityBadge priority={deal.priority} />
                          </div>

                          <div className="mt-4 grid grid-cols-2 gap-3">
                            <div className="rounded-lg bg-white p-3 dark:bg-slate-950">
                              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                Amount
                              </p>
                              <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                                {formatCurrency(deal.amount)}
                              </p>
                            </div>

                            <div className="rounded-lg bg-white p-3 dark:bg-slate-950">
                              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                Forecast
                              </p>
                              <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                                {formatCurrency(weightedAmount)}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 flex items-center justify-between gap-3 text-xs">
                            <span
                              className={`flex items-center gap-1 ${
                                overdue
                                  ? "font-semibold text-rose-600"
                                  : "text-slate-500 dark:text-slate-400"
                              }`}
                            >
                              <CalendarClock className="h-3.5 w-3.5" />
                              {formatDate(deal.expectedCloseDate)}
                            </span>

                            <span className="font-semibold text-slate-500 dark:text-slate-400">
                              {deal.probability}%
                            </span>
                          </div>

                          <div className="mt-4 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950">
                            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                              Next Step
                            </p>
                            <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600 dark:text-slate-400">
                              {deal.nextStep || "No next step added."}
                            </p>
                          </div>

                          <div className="mt-4 flex flex-wrap items-center gap-2">
                            <button
                              onClick={() => setModal({ type: "view", deal })}
                              title="View"
                              className="rounded-lg border border-blue-200 bg-blue-50 p-2 text-blue-700 transition hover:bg-blue-100"
                            >
                              <Eye className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => setModal({ type: "edit", deal })}
                              title="Edit"
                              className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => handleMovePrevious(deal)}
                              disabled={getStageIndex(deal.stage) <= 0 || !isOpenDeal(deal)}
                              title="Move Back"
                              className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => handleMoveNext(deal)}
                              disabled={getStageIndex(deal.stage) >= STAGES.length - 2 || !isOpenDeal(deal)}
                              title="Move Next"
                              className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => handleMarkWon(deal)}
                              title="Mark Won"
                              className="rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-emerald-700 transition hover:bg-emerald-100"
                            >
                              <Trophy className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => setModal({ type: "delete", deal })}
                              title="Delete"
                              className="rounded-lg border border-rose-200 bg-rose-50 p-2 text-rose-600 transition hover:bg-rose-100"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-950 dark:text-white">
              Deal List
            </h3>

            <p className="text-xs font-medium text-slate-400">
              Showing {filteredDeals.length} deals
            </p>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
                  <th className="px-4 py-3 font-semibold text-slate-500">
                    Deal
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-500">
                    Client
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-500">
                    Stage
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-500">
                    Amount
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-500">
                    Probability
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-500">
                    Close Date
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-500">
                    Owner
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredDeals.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-12 text-center text-slate-400"
                    >
                      No deals found.
                    </td>
                  </tr>
                ) : (
                  filteredDeals.map((deal) => (
                    <tr
                      key={deal.id}
                      className="border-b border-slate-100 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                    >
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {deal.title}
                        </p>
                        <p className="text-xs text-slate-400">
                          {deal.service || "No service added"}
                        </p>
                      </td>

                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                        {deal.client}
                      </td>

                      <td className="px-4 py-3">
                        <StageBadge stage={deal.stage} />
                      </td>

                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                        {formatCurrency(deal.amount)}
                      </td>

                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                        {deal.probability}%
                      </td>

                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                        {formatDate(deal.expectedCloseDate)}
                      </td>

                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                        {deal.owner}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setModal({ type: "view", deal })}
                            title="View"
                            className="rounded-lg border border-blue-200 bg-blue-50 p-2 text-blue-700 transition hover:bg-blue-100"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => setModal({ type: "edit", deal })}
                            title="Edit"
                            className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => handleMarkWon(deal)}
                            title="Mark Won"
                            className="rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-emerald-700 transition hover:bg-emerald-100"
                          >
                            <Trophy className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => setModal({ type: "delete", deal })}
                            title="Delete"
                            className="rounded-lg border border-rose-200 bg-rose-50 p-2 text-rose-600 transition hover:bg-rose-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <Eye className="h-3.5 w-3.5" />
          View details
        </span>

        <span className="flex items-center gap-1">
          <Edit3 className="h-3.5 w-3.5" />
          Edit deal
        </span>

        <span className="flex items-center gap-1">
          <ChevronLeft className="h-3.5 w-3.5" />
          Move back
        </span>

        <span className="flex items-center gap-1">
          <ChevronRight className="h-3.5 w-3.5" />
          Move next
        </span>

        <span className="flex items-center gap-1">
          <Trophy className="h-3.5 w-3.5" />
          Mark won
        </span>

        <span className="flex items-center gap-1">
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </span>
      </div>

      {modal?.type === "add" && (
        <DealFormModal onSave={handleAdd} onClose={() => setModal(null)} />
      )}

      {modal?.type === "edit" && (
        <DealFormModal
          deal={modal.deal}
          onSave={handleEdit}
          onClose={() => setModal(null)}
        />
      )}

      {modal?.type === "view" && (
        <DealViewModal
          deal={modal.deal}
          onClose={() => setModal(null)}
          onEdit={(deal) => setModal({ type: "edit", deal })}
          onMarkWon={handleMarkWon}
          onMarkLost={handleMarkLost}
          onMoveNext={handleMoveNext}
        />
      )}

      {modal?.type === "delete" && (
        <ConfirmModal
          deal={modal.deal}
          onConfirm={handleDelete}
          onCancel={() => setModal(null)}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default Deals;