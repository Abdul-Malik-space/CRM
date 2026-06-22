import { useMemo, useState } from "react";
import PageTitle from "../components/PageTitle";
import {
  AlertTriangle,
  BadgeDollarSign,
  CalendarClock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock3,
  Edit3,
  Eye,
  FileText,
  FolderKanban,
  Layers3,
  ListChecks,
  Plus,
  RefreshCcw,
  Search,
  TimerReset,
  Trash2,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";

import { customers as initialCustomers, deals as initialDeals } from "../data/crmData";

const CURRENCY = "PKR";
const ITEMS_PER_PAGE = 6;

const STATUSES = [
  "Planning",
  "In Progress",
  "Review",
  "Completed",
  "On Hold",
  "Delayed",
];

const PRIORITIES = ["High", "Medium", "Low"];

const emptyForm = {
  projectCode: "",
  title: "",
  client: "",
  company: "",
  service: "",
  budget: "",
  paidAmount: "",
  startDate: "",
  deadline: "",
  status: "Planning",
  priority: "Medium",
  projectManager: "Admin",
  assignedTeam: "",
  progress: 0,
  notes: "",
  milestones: [],
  deliverables: [],
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

function isClosed(project) {
  return project.status === "Completed";
}

function isOverdue(project) {
  if (isClosed(project)) return false;
  if (!project.deadline) return false;

  return new Date(project.deadline) < new Date(getToday());
}

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function calculateMilestoneProgress(milestones) {
  if (!milestones || milestones.length === 0) return 0;

  const completed = milestones.filter((item) => item.done).length;
  return Math.round((completed / milestones.length) * 100);
}

function normalizeProject(project, index) {
  const status = project.status || "Planning";
  const budget = parseAmount(project.budget ?? project.amount ?? project.totalValue ?? 0);
  const paidAmount = parseAmount(project.paidAmount ?? 0);

  const milestones =
    Array.isArray(project.milestones) && project.milestones.length > 0
      ? project.milestones
      : [
          { id: 1, title: "Requirement confirmation", done: status !== "Planning" },
          { id: 2, title: "Initial work / draft delivery", done: false },
          { id: 3, title: "Client review and revisions", done: false },
          { id: 4, title: "Final delivery", done: status === "Completed" },
        ];

  return {
    id: project.id ?? index + 1,
    projectCode: project.projectCode ?? `PRJ-${String(index + 1).padStart(4, "0")}`,
    title: project.title ?? project.service ?? "Client Project",
    client: project.client ?? project.name ?? "Unknown Client",
    company: project.company ?? "",
    service: project.service ?? project.title ?? "CRM Service",
    budget: budget || 50000 + index * 15000,
    paidAmount,
    startDate: project.startDate ?? project.createdAt ?? getToday(),
    deadline: project.deadline ?? getFutureDate(10 + index * 3),
    status,
    priority: project.priority ?? "Medium",
    projectManager: project.projectManager ?? project.owner ?? "Admin",
    assignedTeam: project.assignedTeam ?? "Designer, Developer",
    progress:
      project.progress ??
      (status === "Completed"
        ? 100
        : status === "Review"
        ? 80
        : status === "In Progress"
        ? 45
        : calculateMilestoneProgress(milestones)),
    notes: project.notes ?? "",
    milestones,
    deliverables:
      Array.isArray(project.deliverables) && project.deliverables.length > 0
        ? project.deliverables
        : [
            { id: 1, title: "Requirement document", status: "Pending" },
            { id: 2, title: "Project files", status: "Pending" },
            { id: 3, title: "Final handover", status: "Pending" },
          ],
    createdAt: project.createdAt ?? getToday(),
  };
}

function buildInitialProjects() {
  const wonDeals = initialDeals.filter((deal) => deal.stage === "Won");

  if (wonDeals.length > 0) {
    return wonDeals.map((deal, index) =>
      normalizeProject(
        {
          title: deal.title,
          client: deal.client,
          company: deal.company,
          service: deal.service ?? deal.title,
          budget: deal.amount,
          paidAmount: deal.amount,
          status: "In Progress",
          projectManager: deal.owner ?? "Admin",
          createdAt: deal.createdAt,
        },
        index
      )
    );
  }

  if (initialCustomers.length > 0) {
    return initialCustomers.map((customer, index) =>
      normalizeProject(
        {
          title: `${customer.service || "Service"} Project`,
          client: customer.name,
          company: customer.company,
          service: customer.service,
          budget: customer.totalValue ?? customer.amount,
          paidAmount: customer.paidAmount,
          status: index % 3 === 0 ? "Review" : "In Progress",
          createdAt: customer.createdAt,
        },
        index
      )
    );
  }

  return [
    normalizeProject(
      {
        title: "Business Website Development",
        client: "Ali Khan",
        service: "Website Design",
        budget: 85000,
        paidAmount: 40000,
        status: "In Progress",
        priority: "High",
      },
      0
    ),
    normalizeProject(
      {
        title: "CRM Setup Project",
        client: "Smart Traders",
        service: "CRM Setup",
        budget: 120000,
        paidAmount: 120000,
        status: "Review",
        priority: "Medium",
      },
      1
    ),
  ];
}

function StatusBadge({ status, overdue }) {
  if (overdue) {
    return (
      <span className="inline-flex rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700">
        Overdue
      </span>
    );
  }

  const map = {
    Planning: "border-slate-200 bg-slate-50 text-slate-700",
    "In Progress": "border-blue-200 bg-blue-50 text-blue-700",
    Review: "border-purple-200 bg-purple-50 text-purple-700",
    Completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
    "On Hold": "border-amber-200 bg-amber-50 text-amber-700",
    Delayed: "border-rose-200 bg-rose-50 text-rose-700",
  };

  return (
    <span
      className={`inline-flex rounded-lg border px-2.5 py-1 text-xs font-bold ${
        map[status] || "border-slate-200 bg-slate-50 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const map = {
    High: "border-rose-200 bg-rose-50 text-rose-700",
    Medium: "border-amber-200 bg-amber-50 text-amber-700",
    Low: "border-blue-200 bg-blue-50 text-blue-700",
  };

  return (
    <span
      className={`inline-flex rounded-lg border px-2.5 py-1 text-xs font-bold ${
        map[priority] || "border-slate-200 bg-slate-50 text-slate-600"
      }`}
    >
      {priority}
    </span>
  );
}

function ProgressBar({ value }) {
  const safeValue = Math.min(100, Math.max(0, Number(value || 0)));

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-500 dark:text-slate-400">
          Progress
        </span>
        <span className="font-bold text-slate-800 dark:text-slate-200">
          {safeValue}%
        </span>
      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-slate-950 transition-all dark:bg-white"
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon, tone = "default" }) {
  const toneMap = {
    default: "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-rose-100 text-rose-700",
    info: "bg-blue-100 text-blue-700",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950">
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
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
            toneMap[tone] || toneMap.default
          }`}
        >
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

function ConfirmModal({ project, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/50 px-4">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
            <AlertTriangle className="h-6 w-6" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-950 dark:text-white">
              Delete Project?
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Are you sure you want to delete <strong>{project.title}</strong>?
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
            Delete Project
          </button>
        </div>
      </div>
    </div>
  );
}

function ProjectViewModal({
  project,
  onClose,
  onEdit,
  onComplete,
  onMoveNext,
  onToggleMilestone,
}) {
  const overdue = isOverdue(project);
  const balance = Math.max(0, Number(project.budget || 0) - Number(project.paidAmount || 0));
  const completedMilestones = project.milestones.filter((item) => item.done).length;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/50 px-4">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-7 flex items-start justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
              <FolderKanban className="h-7 w-7" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-slate-950 dark:text-white">
                {project.title}
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {project.projectCode} • {project.client}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <StatusBadge status={project.status} overdue={overdue} />
                <PriorityBadge priority={project.priority} />
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 p-2 text-slate-400 transition hover:bg-slate-50 hover:text-slate-700 dark:border-slate-800 dark:hover:bg-slate-900 dark:hover:text-slate-200"
            aria-label="Close project profile"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Budget
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
              {formatCurrency(project.budget)}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
              Paid
            </p>
            <p className="mt-2 text-2xl font-bold text-emerald-800">
              {formatCurrency(project.paidAmount)}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-amber-700">
              Balance
            </p>
            <p className="mt-2 text-2xl font-bold text-amber-800">
              {formatCurrency(balance)}
            </p>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-blue-700">
              Progress
            </p>
            <p className="mt-2 text-2xl font-bold text-blue-800">
              {project.progress}%
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
          <ProgressBar value={project.progress} />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-950 dark:text-white">
              <UserRound className="h-4 w-4" />
              Client Details
            </div>

            <div className="space-y-3 text-sm">
              <p className="flex justify-between gap-3">
                <span className="text-slate-500">Client</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {project.client}
                </span>
              </p>

              <p className="flex justify-between gap-3">
                <span className="text-slate-500">Company</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {project.company || "N/A"}
                </span>
              </p>

              <p className="flex justify-between gap-3">
                <span className="text-slate-500">Service</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {project.service}
                </span>
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-950 dark:text-white">
              <CalendarClock className="h-4 w-4" />
              Timeline
            </div>

            <div className="space-y-3 text-sm">
              <p className="flex justify-between gap-3">
                <span className="text-slate-500">Start Date</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {formatDate(project.startDate)}
                </span>
              </p>

              <p className="flex justify-between gap-3">
                <span className="text-slate-500">Deadline</span>
                <span
                  className={`font-semibold ${
                    overdue ? "text-rose-700" : "text-slate-800 dark:text-slate-200"
                  }`}
                >
                  {formatDate(project.deadline)}
                </span>
              </p>

              <p className="flex justify-between gap-3">
                <span className="text-slate-500">Manager</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {project.projectManager}
                </span>
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-950 dark:text-white">
              <UsersRound className="h-4 w-4" />
              Team
            </div>

            <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
              {project.assignedTeam || "No team assigned."}
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-950 dark:text-white">
                <ListChecks className="h-4 w-4" />
                Milestones
              </div>

              <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                {completedMilestones}/{project.milestones.length}
              </span>
            </div>

            <div className="space-y-2">
              {project.milestones.map((milestone) => (
                <button
                  key={milestone.id}
                  onClick={() => onToggleMilestone(project, milestone.id)}
                  className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-left transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                      milestone.done
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-950"
                    }`}
                  >
                    {milestone.done && <CheckCircle2 className="h-3.5 w-3.5" />}
                  </span>

                  <span
                    className={`text-sm ${
                      milestone.done
                        ? "text-slate-400 line-through"
                        : "text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {milestone.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-950 dark:text-white">
              <FileText className="h-4 w-4" />
              Deliverables
            </div>

            <div className="space-y-2">
              {project.deliverables.map((deliverable) => (
                <div
                  key={deliverable.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-900"
                >
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {deliverable.title}
                  </span>
                  <span className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-500 dark:border-slate-800 dark:bg-slate-950">
                    {deliverable.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {project.notes && (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-bold text-slate-950 dark:text-white">
              Notes
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              {project.notes}
            </p>
          </div>
        )}

        <div className="mt-7 grid grid-cols-1 gap-3 md:grid-cols-3">
          <button
            onClick={() => onEdit(project)}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            <Edit3 className="h-4 w-4" />
            Edit Project
          </button>

          <button
            onClick={() => onMoveNext(project)}
            disabled={project.status === "Completed"}
            className="flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
            Move Next
          </button>

          <button
            onClick={() => onComplete(project)}
            disabled={project.status === "Completed"}
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            <CheckCircle2 className="h-4 w-4" />
            Mark Completed
          </button>
        </div>
      </div>
    </div>
  );
}

function ProjectFormModal({ project, onSave, onClose }) {
  const [form, setForm] = useState(() => ({
    ...(project ?? emptyForm),
    projectCode: project?.projectCode || `PRJ-${Date.now().toString().slice(-6)}`,
    startDate: project?.startDate || getToday(),
    deadline: project?.deadline || getFutureDate(14),
  }));

  const [milestonesInput, setMilestonesInput] = useState(
    (project?.milestones ?? [])
      .map((milestone) => milestone.title)
      .join("\n")
  );

  const [deliverablesInput, setDeliverablesInput] = useState(
    (project?.deliverables ?? [])
      .map((deliverable) => deliverable.title)
      .join("\n")
  );

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => {
      const updated = { ...previous, [name]: value };

      if (name === "status") {
        if (value === "Completed") updated.progress = 100;
        if (value === "Review" && Number(updated.progress) < 80) updated.progress = 80;
        if (value === "In Progress" && Number(updated.progress) < 40) updated.progress = 40;
      }

      return updated;
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.title.trim() || !form.client.trim() || !form.deadline) return;

    const milestones = milestonesInput
      .split("\n")
      .map((title) => title.trim())
      .filter(Boolean)
      .map((title, index) => {
        const existing = project?.milestones?.find((item) => item.title === title);

        return {
          id: existing?.id ?? Date.now() + index,
          title,
          done: existing?.done ?? false,
        };
      });

    const deliverables = deliverablesInput
      .split("\n")
      .map((title) => title.trim())
      .filter(Boolean)
      .map((title, index) => {
        const existing = project?.deliverables?.find((item) => item.title === title);

        return {
          id: existing?.id ?? Date.now() + index,
          title,
          status: existing?.status ?? "Pending",
        };
      });

    onSave({
      ...form,
      budget: Number(form.budget || 0),
      paidAmount: Number(form.paidAmount || 0),
      progress: Number(form.progress || 0),
      milestones,
      deliverables,
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
              {project ? "Edit Project" : "Create New Project"}
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage delivery, milestones, deadlines, team, progress, budget, and
              final handover.
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
              Project Information
            </h4>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Project Code
                </label>
                <input
                  name="projectCode"
                  value={form.projectCode}
                  onChange={handleChange}
                  className={fieldClass}
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Project Title *
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Business Website Development"
                  className={fieldClass}
                  required
                />
              </div>

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
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-bold text-slate-950 dark:text-white">
              Client and Team
            </h4>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Client *
                </label>
                <input
                  name="client"
                  value={form.client}
                  onChange={handleChange}
                  placeholder="Client name"
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

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Project Manager
                </label>
                <input
                  name="projectManager"
                  value={form.projectManager}
                  onChange={handleChange}
                  placeholder="Admin"
                  className={fieldClass}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Assigned Team
                </label>
                <input
                  name="assignedTeam"
                  value={form.assignedTeam}
                  onChange={handleChange}
                  placeholder="Designer, Developer"
                  className={fieldClass}
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-bold text-slate-950 dark:text-white">
              Schedule and Status
            </h4>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-5">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  className={fieldClass}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Deadline *
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={form.deadline}
                  onChange={handleChange}
                  className={fieldClass}
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className={fieldClass}
                >
                  {STATUSES.map((status) => (
                    <option key={status}>{status}</option>
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
                  {PRIORITIES.map((priority) => (
                    <option key={priority}>{priority}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Progress %
                </label>
                <input
                  type="number"
                  name="progress"
                  value={form.progress}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  className={fieldClass}
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-bold text-slate-950 dark:text-white">
              Budget and Payment
            </h4>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Project Budget
                </label>
                <input
                  type="number"
                  name="budget"
                  value={form.budget}
                  onChange={handleChange}
                  placeholder="85000"
                  min="0"
                  className={fieldClass}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Paid Amount
                </label>
                <input
                  type="number"
                  name="paidAmount"
                  value={form.paidAmount}
                  onChange={handleChange}
                  placeholder="40000"
                  min="0"
                  className={fieldClass}
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-bold text-slate-950 dark:text-white">
              Milestones and Deliverables
            </h4>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Milestones
                </label>
                <textarea
                  value={milestonesInput}
                  onChange={(event) => setMilestonesInput(event.target.value)}
                  placeholder={`Write one milestone per line\nRequirement confirmation\nInitial draft\nClient review\nFinal delivery`}
                  className={`${fieldClass} min-h-[150px] resize-none`}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Deliverables
                </label>
                <textarea
                  value={deliverablesInput}
                  onChange={(event) => setDeliverablesInput(event.target.value)}
                  placeholder={`Write one deliverable per line\nRequirement document\nProject files\nFinal handover`}
                  className={`${fieldClass} min-h-[150px] resize-none`}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Internal Notes
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Client requirements, delivery instructions, blockers, revision notes..."
              className={`${fieldClass} min-h-[120px] resize-none`}
            />
          </div>

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
              {project ? (
                <>
                  <Edit3 className="h-4 w-4" />
                  Save Changes
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Create Project
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Projects() {
  const [projectList, setProjectList] = useState(() => buildInitialProjects());
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [sortBy, setSortBy] = useState("deadline");
  const [viewMode, setViewMode] = useState("board");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  function handleAdd(form) {
    const newProject = {
      ...form,
      id: Date.now(),
      createdAt: getToday(),
    };

    setProjectList((previous) => [newProject, ...previous]);
    setModal(null);
    showToast("Project created successfully.");
  }

  function handleEdit(form) {
    setProjectList((previous) =>
      previous.map((project) =>
        project.id === modal.project.id
          ? {
              ...modal.project,
              ...form,
            }
          : project
      )
    );

    setModal(null);
    showToast("Project updated successfully.");
  }

  function handleDelete() {
    setProjectList((previous) =>
      previous.filter((project) => project.id !== modal.project.id)
    );

    setModal(null);
    showToast("Project deleted successfully.", "error");
  }

  function handleComplete(project) {
    setProjectList((previous) =>
      previous.map((item) =>
        item.id === project.id
          ? {
              ...item,
              status: "Completed",
              progress: 100,
              milestones: item.milestones.map((milestone) => ({
                ...milestone,
                done: true,
              })),
              deliverables: item.deliverables.map((deliverable) => ({
                ...deliverable,
                status: "Delivered",
              })),
            }
          : item
      )
    );

    setModal(null);
    showToast("Project marked as completed.");
  }

  function handleMoveNext(project) {
    const currentIndex = STATUSES.indexOf(project.status);

    if (currentIndex < 0 || currentIndex >= STATUSES.length - 3) return;

    const nextStatus = STATUSES[currentIndex + 1];

    setProjectList((previous) =>
      previous.map((item) =>
        item.id === project.id
          ? {
              ...item,
              status: nextStatus,
              progress:
                nextStatus === "In Progress"
                  ? Math.max(Number(item.progress || 0), 40)
                  : nextStatus === "Review"
                  ? Math.max(Number(item.progress || 0), 80)
                  : nextStatus === "Completed"
                  ? 100
                  : item.progress,
            }
          : item
      )
    );

    setModal(null);
    showToast(`Project moved to ${nextStatus}.`, "info");
  }

  function handleToggleMilestone(project, milestoneId) {
    const updatedProjects = projectList.map((item) => {
      if (item.id !== project.id) return item;

      const updatedMilestones = item.milestones.map((milestone) =>
        milestone.id === milestoneId
          ? { ...milestone, done: !milestone.done }
          : milestone
      );

      const progress = calculateMilestoneProgress(updatedMilestones);

      return {
        ...item,
        milestones: updatedMilestones,
        progress,
        status: progress === 100 ? "Completed" : item.status,
      };
    });

    setProjectList(updatedProjects);

    const updatedProject = updatedProjects.find((item) => item.id === project.id);
    setModal({ type: "view", project: updatedProject });
  }

  const stats = useMemo(() => {
    const total = projectList.length;
    const active = projectList.filter((project) =>
      ["Planning", "In Progress", "Review"].includes(project.status)
    ).length;
    const completed = projectList.filter(
      (project) => project.status === "Completed"
    ).length;
    const overdue = projectList.filter((project) => isOverdue(project)).length;
    const totalValue = projectList.reduce(
      (sum, project) => sum + Number(project.budget || 0),
      0
    );

    const averageProgress =
      total > 0
        ? Math.round(
            projectList.reduce(
              (sum, project) => sum + Number(project.progress || 0),
              0
            ) / total
          )
        : 0;

    return {
      total,
      active,
      completed,
      overdue,
      totalValue,
      averageProgress,
    };
  }, [projectList]);

  const filteredProjects = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return projectList
      .filter((project) => {
        const matchesSearch =
          !searchValue ||
          project.projectCode.toLowerCase().includes(searchValue) ||
          project.title.toLowerCase().includes(searchValue) ||
          project.client.toLowerCase().includes(searchValue) ||
          project.company.toLowerCase().includes(searchValue) ||
          project.service.toLowerCase().includes(searchValue) ||
          project.projectManager.toLowerCase().includes(searchValue) ||
          project.assignedTeam.toLowerCase().includes(searchValue);

        const matchesStatus =
          filterStatus === "All" || project.status === filterStatus;

        const matchesPriority =
          filterPriority === "All" || project.priority === filterPriority;

        return matchesSearch && matchesStatus && matchesPriority;
      })
      .sort((a, b) => {
        if (sortBy === "highestBudget") {
          return Number(b.budget || 0) - Number(a.budget || 0);
        }

        if (sortBy === "progress") {
          return Number(a.progress || 0) - Number(b.progress || 0);
        }

        if (sortBy === "latest") {
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }

        return new Date(a.deadline || "9999-12-31") - new Date(b.deadline || "9999-12-31");
      });
  }, [projectList, search, filterStatus, filterPriority, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);

  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="w-full max-w-full">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <PageTitle
          title="Projects"
          subtitle="Track client work delivery, milestones, deadlines, progress, files, and project status"
        />

        <button
          onClick={() => setModal({ type: "add" })}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
        >
          <Plus className="h-4 w-4" />
          Create Project
        </button>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
        <StatCard
          title="Total Projects"
          value={stats.total}
          subtitle="All delivery records"
          icon={<FolderKanban className="h-5 w-5" />}
          tone="info"
        />

        <StatCard
          title="Active"
          value={stats.active}
          subtitle="Currently in progress"
          icon={<Layers3 className="h-5 w-5" />}
        />

        <StatCard
          title="Completed"
          value={stats.completed}
          subtitle="Delivered projects"
          icon={<CheckCircle2 className="h-5 w-5" />}
          tone="success"
        />

        <StatCard
          title="Overdue"
          value={stats.overdue}
          subtitle="Needs attention"
          icon={<AlertTriangle className="h-5 w-5" />}
          tone={stats.overdue > 0 ? "danger" : "success"}
        />

        <StatCard
          title="Project Value"
          value={formatCurrency(stats.totalValue)}
          subtitle="Total delivery value"
          icon={<BadgeDollarSign className="h-5 w-5" />}
          tone="warning"
        />

        <StatCard
          title="Avg Progress"
          value={`${stats.averageProgress}%`}
          subtitle="Overall delivery progress"
          icon={<TimerReset className="h-5 w-5" />}
          tone="info"
        />
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Search by project, client, service, team..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-slate-600"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(event) => {
            setFilterStatus(event.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
        >
          <option value="All">All Status</option>
          {STATUSES.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>

        <select
          value={filterPriority}
          onChange={(event) => {
            setFilterPriority(event.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
        >
          <option value="All">All Priority</option>
          {PRIORITIES.map((priority) => (
            <option key={priority}>{priority}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(event) => {
            setSortBy(event.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
        >
          <option value="deadline">Nearest Deadline</option>
          <option value="highestBudget">Highest Budget</option>
          <option value="progress">Lowest Progress</option>
          <option value="latest">Latest Created</option>
        </select>

        <button
          onClick={() =>
            setViewMode((current) => (current === "board" ? "table" : "board"))
          }
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
        >
          {viewMode === "board" ? "Table View" : "Board View"}
        </button>

        <button
          onClick={() => {
            setSearch("");
            setFilterStatus("All");
            setFilterPriority("All");
            setSortBy("deadline");
            setPage(1);
          }}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
        >
          <RefreshCcw className="h-4 w-4" />
          Reset
        </button>
      </div>

      {viewMode === "board" ? (
        <div className="grid gap-5 xl:grid-cols-6">
          {STATUSES.map((status) => {
            const statusProjects = filteredProjects.filter(
              (project) => project.status === status
            );

            return (
              <div
                key={status}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-950 dark:text-white">
                      {status}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {statusProjects.length} projects
                    </p>
                  </div>

                  <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                    {statusProjects.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {statusProjects.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-200 py-8 text-center text-sm text-slate-400 dark:border-slate-800">
                      No projects
                    </div>
                  ) : (
                    statusProjects.map((project) => {
                      const overdue = isOverdue(project);

                      return (
                        <div
                          key={project.id}
                          className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-white hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-950"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                {project.title}
                              </h4>
                              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                {project.client}
                              </p>
                            </div>

                            <PriorityBadge priority={project.priority} />
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2">
                            <StatusBadge status={project.status} overdue={overdue} />
                          </div>

                          <div className="mt-4">
                            <ProgressBar value={project.progress} />
                          </div>

                          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                            <div className="rounded-lg bg-white p-3 dark:bg-slate-950">
                              <p className="font-bold text-slate-400">Budget</p>
                              <p className="mt-1 font-bold text-slate-900 dark:text-white">
                                {formatCurrency(project.budget)}
                              </p>
                            </div>

                            <div className="rounded-lg bg-white p-3 dark:bg-slate-950">
                              <p className="font-bold text-slate-400">Deadline</p>
                              <p
                                className={`mt-1 font-bold ${
                                  overdue
                                    ? "text-rose-700"
                                    : "text-slate-900 dark:text-white"
                                }`}
                              >
                                {formatDate(project.deadline)}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 flex items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1">
                              <UserRound className="h-3.5 w-3.5" />
                              {project.projectManager}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock3 className="h-3.5 w-3.5" />
                              {formatDate(project.startDate)}
                            </span>
                          </div>

                          <div className="mt-4 flex flex-wrap items-center gap-2">
                            <button
                              onClick={() => setModal({ type: "view", project })}
                              title="View"
                              className="rounded-lg border border-blue-200 bg-blue-50 p-2 text-blue-700 transition hover:bg-blue-100"
                            >
                              <Eye className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => setModal({ type: "edit", project })}
                              title="Edit"
                              className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => handleMoveNext(project)}
                              disabled={project.status === "Completed"}
                              title="Move Next"
                              className="rounded-lg border border-amber-200 bg-amber-50 p-2 text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => handleComplete(project)}
                              disabled={project.status === "Completed"}
                              title="Complete"
                              className="rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => setModal({ type: "delete", project })}
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
            <div>
              <h3 className="text-base font-bold text-slate-950 dark:text-white">
                Project List
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Manage project progress, deadlines, team, and delivery status.
              </p>
            </div>

            <p className="text-xs font-medium text-slate-400">
              Showing {paginatedProjects.length} of {filteredProjects.length}
            </p>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[1120px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
                  <th className="px-4 py-3 font-semibold text-slate-500">
                    Project
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-500">
                    Client
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-500">
                    Budget
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-500">
                    Deadline
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-500">
                    Progress
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-500">
                    Priority
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-500">
                    Status
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-500">
                    Manager
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedProjects.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-4 py-12 text-center text-slate-400"
                    >
                      No projects found.
                    </td>
                  </tr>
                ) : (
                  paginatedProjects.map((project) => {
                    const overdue = isOverdue(project);

                    return (
                      <tr
                        key={project.id}
                        className="border-b border-slate-100 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                      >
                        <td className="px-4 py-3">
                          <p className="font-bold text-slate-900 dark:text-white">
                            {project.title}
                          </p>
                          <p className="text-xs text-slate-400">
                            {project.projectCode} • {project.service}
                          </p>
                        </td>

                        <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                          {project.client}
                        </td>

                        <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                          {formatCurrency(project.budget)}
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={
                              overdue
                                ? "font-bold text-rose-700"
                                : "font-semibold text-slate-700 dark:text-slate-300"
                            }
                          >
                            {formatDate(project.deadline)}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <div className="w-36">
                            <ProgressBar value={project.progress} />
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <PriorityBadge priority={project.priority} />
                        </td>

                        <td className="px-4 py-3">
                          <StatusBadge status={project.status} overdue={overdue} />
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white dark:bg-white dark:text-slate-950">
                              {getInitials(project.projectManager)}
                            </div>
                            <span className="font-medium text-slate-700 dark:text-slate-300">
                              {project.projectManager}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setModal({ type: "view", project })}
                              title="View"
                              className="rounded-lg border border-blue-200 bg-blue-50 p-2 text-blue-700 transition hover:bg-blue-100"
                            >
                              <Eye className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => setModal({ type: "edit", project })}
                              title="Edit"
                              className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => handleComplete(project)}
                              title="Complete"
                              className="rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-emerald-700 transition hover:bg-emerald-100"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => setModal({ type: "delete", project })}
                              title="Delete"
                              className="rounded-lg border border-rose-200 bg-rose-50 p-2 text-rose-600 transition hover:bg-rose-100"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-3 dark:border-slate-800">
            <p className="text-xs text-slate-400">
              Page {currentPage} of {totalPages}
            </p>

            <div className="flex gap-1">
              <button
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => setPage(pageNumber)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-semibold ${
                      pageNumber === currentPage
                        ? "border-slate-950 bg-slate-950 text-white dark:border-white dark:bg-white dark:text-slate-950"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
                    }`}
                  >
                    {pageNumber}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  setPage((current) => Math.min(totalPages, current + 1))
                }
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {modal?.type === "add" && (
        <ProjectFormModal onSave={handleAdd} onClose={() => setModal(null)} />
      )}

      {modal?.type === "edit" && (
        <ProjectFormModal
          project={modal.project}
          onSave={handleEdit}
          onClose={() => setModal(null)}
        />
      )}

      {modal?.type === "view" && (
        <ProjectViewModal
          project={modal.project}
          onClose={() => setModal(null)}
          onEdit={(project) => setModal({ type: "edit", project })}
          onComplete={handleComplete}
          onMoveNext={handleMoveNext}
          onToggleMilestone={handleToggleMilestone}
        />
      )}

      {modal?.type === "delete" && (
        <ConfirmModal
          project={modal.project}
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

export default Projects;