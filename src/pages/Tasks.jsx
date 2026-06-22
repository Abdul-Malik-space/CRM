import { useMemo, useState } from "react";
import PageTitle from "../components/PageTitle";
import {
  AlertTriangle,
  ArrowRightLeft,
  CalendarClock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  ClipboardCheck,
  ClipboardList,
  Clock3,
  Edit3,
  Eye,
  FileText,
  Filter,
  Flag,
  Layers3,
  ListChecks,
  MoreHorizontal,
  Plus,
  Search,
  TimerReset,
  Trash2,
  UserCheck,
  UserRound,
  UsersRound,
  X,
  XCircle,
} from "lucide-react";

import { tasks as initialTasks } from "../data/crmData";

const ITEMS_PER_PAGE = 6;

const STATUSES = [
  "Backlog",
  "To Do",
  "In Progress",
  "Review",
  "Completed",
  "Blocked",
];

const PRIORITIES = ["Urgent", "High", "Medium", "Low"];

const TASK_TYPES = [
  "Call",
  "Follow-up",
  "Design",
  "Development",
  "Content",
  "Admin",
  "Support",
  "Meeting",
];

const RELATED_TO = [
  "General",
  "Lead",
  "Customer",
  "Deal",
  "Project",
  "Invoice",
  "Support",
];

const emptyForm = {
  title: "",
  description: "",
  createdBy: "Admin",
  assigned: "Admin",
  reviewer: "",
  client: "",
  type: "Admin",
  relatedTo: "General",
  dueDate: "",
  dueTime: "",
  priority: "Medium",
  status: "To Do",
  progress: 0,
  estimatedHours: "",
  notes: "",
  subtasks: [],
  activity: [],
};

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function getTomorrow() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

function getCurrentTime() {
  return new Date().toTimeString().slice(0, 5);
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

function getDateTimeValue(task) {
  const date = task.dueDate || "9999-12-31";
  const time = task.dueTime || "23:59";
  const value = new Date(`${date}T${time}`);

  if (Number.isNaN(value.getTime())) return 0;

  return value.getTime();
}

function isClosed(task) {
  return task.status === "Completed";
}

function isOverdue(task) {
  if (isClosed(task) || task.status === "Blocked") return false;
  if (!task.dueDate) return false;

  return getDateTimeValue(task) < Date.now();
}

function isDueToday(task) {
  if (isClosed(task)) return false;
  return task.dueDate === getToday();
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

function normalizeStatus(status) {
  if (status === "Pending") return "To Do";
  if (status === "Done") return "Completed";
  if (status === "Complete") return "Completed";
  return status || "To Do";
}

function normalizeTask(task, index) {
  const status = normalizeStatus(task.status);
  const assigned = task.assigned || task.assignedTo || "Admin";

  return {
    id: task.id ?? index + 1,
    title: task.title ?? "Untitled Task",
    description: task.description ?? "",
    createdBy: task.createdBy ?? "Admin",
    assigned,
    reviewer: task.reviewer ?? "",
    client: task.client ?? "",
    type: task.type ?? "Admin",
    relatedTo: task.relatedTo ?? "General",
    dueDate: task.dueDate ?? task.due ?? getTomorrow(),
    dueTime: task.dueTime ?? "10:00",
    priority: task.priority ?? "Medium",
    status,
    progress:
      task.progress ??
      (status === "Completed"
        ? 100
        : status === "Review"
        ? 80
        : status === "In Progress"
        ? 50
        : 0),
    estimatedHours: task.estimatedHours ?? "",
    notes: task.notes ?? "",
    subtasks: Array.isArray(task.subtasks)
      ? task.subtasks
      : [
          { id: 1, title: "Review requirement", done: false },
          { id: 2, title: "Complete task execution", done: false },
        ],
    activity: Array.isArray(task.activity)
      ? task.activity
      : [
          {
            id: 1,
            action: `Task assigned to ${assigned}`,
            by: task.createdBy ?? "Admin",
            date: getToday(),
            time: "09:00",
          },
        ],
    createdAt: task.createdAt ?? getToday(),
  };
}

function StatusBadge({ status, overdue }) {
  if (overdue) {
    return (
      <span className="inline-flex rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-800">
        Overdue
      </span>
    );
  }

  const map = {
    Backlog: "border-slate-200 bg-slate-50 text-slate-700",
    "To Do": "border-blue-200 bg-blue-50 text-blue-800",
    "In Progress": "border-amber-200 bg-amber-50 text-amber-800",
    Review: "border-purple-200 bg-purple-50 text-purple-800",
    Completed: "border-emerald-200 bg-emerald-50 text-emerald-800",
    Blocked: "border-rose-200 bg-rose-50 text-rose-800",
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

function PriorityBadge({ priority }) {
  const map = {
    Urgent: "border-rose-200 bg-rose-50 text-rose-800",
    High: "border-orange-200 bg-orange-50 text-orange-800",
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

function TypeBadge({ type }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
      <Layers3 className="h-3.5 w-3.5" />
      {type}
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

function ProgressBar({ value }) {
  const safeValue = Math.min(100, Math.max(0, Number(value || 0)));

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-500 dark:text-slate-400">
          Progress
        </span>
        <span className="font-bold text-slate-700 dark:text-slate-200">
          {safeValue}%
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-slate-950 transition-all dark:bg-white"
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}

function ConfirmModal({ task, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/50 px-4">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
            <AlertTriangle className="h-6 w-6" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-950 dark:text-white">
              Delete Task?
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Are you sure you want to delete <strong>{task.title}</strong>?
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
            Delete Task
          </button>
        </div>
      </div>
    </div>
  );
}

function ReassignModal({ task, onSave, onClose }) {
  const [assigned, setAssigned] = useState(task.assigned || "");
  const [reason, setReason] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (!assigned.trim()) return;

    onSave(task, assigned, reason);
  }

  const fieldClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-950";

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/50 px-4">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-7 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-slate-950 dark:text-white">
              Reassign Task
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Move this task from one team member to another and record the
              reason.
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

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Current Assignee
            </p>
            <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
              {task.assigned}
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              New Assignee *
            </label>
            <input
              value={assigned}
              onChange={(event) => setAssigned(event.target.value)}
              placeholder="Team member name"
              className={fieldClass}
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Reassignment Reason
            </label>
            <textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Reason for moving this task..."
              className={`${fieldClass} min-h-[120px] resize-none`}
            />
          </div>

          <div className="flex flex-col gap-3 pt-3 sm:flex-row">
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
              <ArrowRightLeft className="h-4 w-4" />
              Reassign Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TaskViewModal({
  task,
  onClose,
  onEdit,
  onComplete,
  onMoveNext,
  onReassign,
  onToggleSubtask,
}) {
  const overdue = isOverdue(task);
  const completedSubtasks = task.subtasks.filter((item) => item.done).length;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/50 px-4">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-7 flex items-start justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
              <ClipboardCheck className="h-7 w-7" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-slate-950 dark:text-white">
                {task.title}
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {task.relatedTo} {task.client ? `• ${task.client}` : ""}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <StatusBadge status={task.status} overdue={overdue} />
                <PriorityBadge priority={task.priority} />
                <TypeBadge type={task.type} />
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 p-2 text-slate-400 transition hover:bg-slate-50 hover:text-slate-700 dark:border-slate-800 dark:hover:bg-slate-900 dark:hover:text-slate-200"
            aria-label="Close task profile"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-950 dark:text-white">
              <UserRound className="h-4 w-4" />
              Assigned To
            </div>
            <p className="text-xl font-bold text-slate-950 dark:text-white">
              {task.assigned}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Current task owner
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-950 dark:text-white">
              <CalendarClock className="h-4 w-4" />
              Due Date
            </div>
            <p
              className={`text-xl font-bold ${
                overdue
                  ? "text-rose-700"
                  : "text-slate-950 dark:text-white"
              }`}
            >
              {formatDate(task.dueDate)}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {formatTime(task.dueTime)}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-950 dark:text-white">
              <Flag className="h-4 w-4" />
              Priority
            </div>
            <p className="text-xl font-bold text-slate-950 dark:text-white">
              {task.priority}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Execution importance
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-950 dark:text-white">
              <TimerReset className="h-4 w-4" />
              Estimate
            </div>
            <p className="text-xl font-bold text-slate-950 dark:text-white">
              {task.estimatedHours || "N/A"}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Estimated hours
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-950 dark:text-white">
              <FileText className="h-4 w-4" />
              Description
            </div>

            <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
              {task.description || "No description added for this task."}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-950 dark:text-white">
                <ListChecks className="h-4 w-4" />
                Subtasks
              </div>

              <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                {completedSubtasks}/{task.subtasks.length}
              </span>
            </div>

            {task.subtasks.length === 0 ? (
              <p className="text-sm text-slate-400">No subtasks added.</p>
            ) : (
              <div className="space-y-2">
                {task.subtasks.map((subtask) => (
                  <button
                    key={subtask.id}
                    onClick={() => onToggleSubtask(task, subtask.id)}
                    className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-left transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                        subtask.done
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : "border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-950"
                      }`}
                    >
                      {subtask.done && <CheckCircle2 className="h-3.5 w-3.5" />}
                    </span>

                    <span
                      className={`text-sm ${
                        subtask.done
                          ? "text-slate-400 line-through"
                          : "text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {subtask.title}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
          <ProgressBar value={task.progress} />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-950 dark:text-white">
              <ClipboardList className="h-4 w-4" />
              Notes
            </div>

            <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
              {task.notes || "No internal notes added."}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-950 dark:text-white">
              <ArrowRightLeft className="h-4 w-4" />
              Activity History
            </div>

            <div className="space-y-3">
              {task.activity.length === 0 ? (
                <p className="text-sm text-slate-400">No activity recorded.</p>
              ) : (
                task.activity.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {item.action}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      By {item.by} • {formatDate(item.date)} •{" "}
                      {formatTime(item.time)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <button
            onClick={() => onEdit(task)}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            <Edit3 className="h-4 w-4" />
            Edit Task
          </button>

          <button
            onClick={() => onReassign(task)}
            className="flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
          >
            <ArrowRightLeft className="h-4 w-4" />
            Reassign
          </button>

          <button
            onClick={() => onMoveNext(task)}
            disabled={task.status === "Completed"}
            className="flex items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 py-3 text-sm font-semibold text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
            Move Next
          </button>

          <button
            onClick={() => onComplete(task)}
            disabled={task.status === "Completed"}
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

function TaskFormModal({ task, onSave, onClose }) {
  const [form, setForm] = useState(() => ({
    ...(task ?? emptyForm),
    dueDate: task?.dueDate || getTomorrow(),
    dueTime: task?.dueTime || getCurrentTime(),
  }));

  const [subtasksInput, setSubtasksInput] = useState(
    (task?.subtasks ?? [])
      .map((subtask) => subtask.title)
      .join("\n")
  );

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => {
      const nextForm = { ...previous, [name]: value };

      if (name === "status") {
        if (value === "Completed") nextForm.progress = 100;
        if (value === "Review" && Number(nextForm.progress) < 80) {
          nextForm.progress = 80;
        }
        if (value === "In Progress" && Number(nextForm.progress) < 40) {
          nextForm.progress = 40;
        }
      }

      return nextForm;
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.title.trim() || !form.assigned.trim() || !form.dueDate) {
      return;
    }

    const subtasks = subtasksInput
      .split("\n")
      .map((title) => title.trim())
      .filter(Boolean)
      .map((title, index) => {
        const existing = task?.subtasks?.find((item) => item.title === title);

        return {
          id: existing?.id ?? Date.now() + index,
          title,
          done: existing?.done ?? false,
        };
      });

    const activity = Array.isArray(form.activity) ? [...form.activity] : [];

    if (task && task.assigned !== form.assigned) {
      activity.unshift({
        id: Date.now(),
        action: `Task reassigned from ${task.assigned} to ${form.assigned}`,
        by: "Admin",
        date: getToday(),
        time: getCurrentTime(),
      });
    }

    onSave({
      ...form,
      progress: Number(form.progress || 0),
      subtasks,
      activity,
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
              {task ? "Edit Task" : "Add New Task"}
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage assignment, priority, due date, progress, subtasks,
              ownership, and internal notes.
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
              Task Information
            </h4>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Task Title *
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Prepare proposal for client"
                  className={fieldClass}
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Task Type
                </label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className={fieldClass}
                >
                  {TASK_TYPES.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Write task details, requirement, expected output, and important context..."
                className={`${fieldClass} min-h-[120px] resize-none`}
              />
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-bold text-slate-950 dark:text-white">
              Assignment
            </h4>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Created By
                </label>
                <input
                  name="createdBy"
                  value={form.createdBy}
                  onChange={handleChange}
                  placeholder="Admin"
                  className={fieldClass}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Assigned To *
                </label>
                <input
                  name="assigned"
                  value={form.assigned}
                  onChange={handleChange}
                  placeholder="Team member name"
                  className={fieldClass}
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Reviewer
                </label>
                <input
                  name="reviewer"
                  value={form.reviewer}
                  onChange={handleChange}
                  placeholder="Reviewer name"
                  className={fieldClass}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Related To
                </label>
                <select
                  name="relatedTo"
                  value={form.relatedTo}
                  onChange={handleChange}
                  className={fieldClass}
                >
                  {RELATED_TO.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-bold text-slate-950 dark:text-white">
              Schedule and Priority
            </h4>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-5">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Due Date *
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleChange}
                  className={fieldClass}
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Due Time
                </label>
                <input
                  type="time"
                  name="dueTime"
                  value={form.dueTime}
                  onChange={handleChange}
                  className={fieldClass}
                />
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
                  Estimated Hours
                </label>
                <input
                  name="estimatedHours"
                  value={form.estimatedHours}
                  onChange={handleChange}
                  placeholder="3h"
                  className={fieldClass}
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-bold text-slate-950 dark:text-white">
              Progress and Client Context
            </h4>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Progress %
                </label>
                <input
                  type="number"
                  name="progress"
                  value={form.progress}
                  onChange={handleChange}
                  placeholder="50"
                  min="0"
                  max="100"
                  className={fieldClass}
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Client / Project
                </label>
                <input
                  name="client"
                  value={form.client}
                  onChange={handleChange}
                  placeholder="Client or project name"
                  className={fieldClass}
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-bold text-slate-950 dark:text-white">
              Subtasks and Notes
            </h4>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Subtasks
                </label>
                <textarea
                  value={subtasksInput}
                  onChange={(event) => setSubtasksInput(event.target.value)}
                  placeholder={`Write one subtask per line\nReview client requirement\nPrepare draft\nSubmit for review`}
                  className={`${fieldClass} min-h-[140px] resize-none`}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Internal Notes
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Add internal notes, blockers, dependency, or manager instructions..."
                  className={`${fieldClass} min-h-[140px] resize-none`}
                />
              </div>
            </div>
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
              {task ? (
                <>
                  <Edit3 className="h-4 w-4" />
                  Save Changes
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add Task
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Tasks() {
  const [taskList, setTaskList] = useState(() =>
    initialTasks.map((task, index) => normalizeTask(task, index))
  );

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [filterAssignee, setFilterAssignee] = useState("All");
  const [sortBy, setSortBy] = useState("dueDate");
  const [viewMode, setViewMode] = useState("board");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);

  const assignees = useMemo(() => {
    return Array.from(new Set(taskList.map((task) => task.assigned))).filter(
      Boolean
    );
  }, [taskList]);

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  function handleAdd(form) {
    const newTask = {
      ...form,
      id: Date.now(),
      createdAt: getToday(),
      activity: [
        {
          id: Date.now(),
          action: `Task created and assigned to ${form.assigned}`,
          by: form.createdBy || "Admin",
          date: getToday(),
          time: getCurrentTime(),
        },
      ],
    };

    setTaskList((previous) => [newTask, ...previous]);
    setModal(null);
    showToast("Task added successfully.");
  }

  function handleEdit(form) {
    setTaskList((previous) =>
      previous.map((task) =>
        task.id === modal.task.id
          ? {
              ...modal.task,
              ...form,
            }
          : task
      )
    );

    setModal(null);
    showToast("Task updated successfully.");
  }

  function handleDelete() {
    setTaskList((previous) =>
      previous.filter((task) => task.id !== modal.task.id)
    );

    setModal(null);
    showToast("Task deleted successfully.", "error");
  }

  function handleComplete(task) {
    setTaskList((previous) =>
      previous.map((item) =>
        item.id === task.id
          ? {
              ...item,
              status: "Completed",
              progress: 100,
              activity: [
                {
                  id: Date.now(),
                  action: "Task marked as completed",
                  by: "Admin",
                  date: getToday(),
                  time: getCurrentTime(),
                },
                ...item.activity,
              ],
            }
          : item
      )
    );

    setModal(null);
    showToast("Task marked as completed.");
  }

  function handleMoveNext(task) {
    const currentIndex = STATUSES.indexOf(task.status);

    if (currentIndex < 0 || currentIndex >= STATUSES.length - 2) return;

    const nextStatus = STATUSES[currentIndex + 1];

    setTaskList((previous) =>
      previous.map((item) =>
        item.id === task.id
          ? {
              ...item,
              status: nextStatus,
              progress:
                nextStatus === "In Progress"
                  ? Math.max(Number(item.progress || 0), 40)
                  : nextStatus === "Review"
                  ? Math.max(Number(item.progress || 0), 80)
                  : item.progress,
              activity: [
                {
                  id: Date.now(),
                  action: `Task moved to ${nextStatus}`,
                  by: "Admin",
                  date: getToday(),
                  time: getCurrentTime(),
                },
                ...item.activity,
              ],
            }
          : item
      )
    );

    setModal(null);
    showToast(`Task moved to ${nextStatus}.`, "info");
  }

  function handleMovePrevious(task) {
    const currentIndex = STATUSES.indexOf(task.status);

    if (currentIndex <= 0 || task.status === "Completed") return;

    const previousStatus = STATUSES[currentIndex - 1];

    setTaskList((previous) =>
      previous.map((item) =>
        item.id === task.id
          ? {
              ...item,
              status: previousStatus,
              activity: [
                {
                  id: Date.now(),
                  action: `Task moved back to ${previousStatus}`,
                  by: "Admin",
                  date: getToday(),
                  time: getCurrentTime(),
                },
                ...item.activity,
              ],
            }
          : item
      )
    );

    showToast(`Task moved back to ${previousStatus}.`, "info");
  }

  function handleReassign(task, newAssignee, reason) {
    if (task.assigned === newAssignee) {
      setModal(null);
      return;
    }

    setTaskList((previous) =>
      previous.map((item) =>
        item.id === task.id
          ? {
              ...item,
              assigned: newAssignee,
              status: item.status === "Completed" ? item.status : "To Do",
              activity: [
                {
                  id: Date.now(),
                  action: `Task reassigned from ${item.assigned} to ${newAssignee}${
                    reason ? `: ${reason}` : ""
                  }`,
                  by: "Admin",
                  date: getToday(),
                  time: getCurrentTime(),
                },
                ...item.activity,
              ],
            }
          : item
      )
    );

    setModal(null);
    showToast("Task reassigned successfully.", "info");
  }

  function handleToggleSubtask(task, subtaskId) {
    setTaskList((previous) =>
      previous.map((item) => {
        if (item.id !== task.id) return item;

        const updatedSubtasks = item.subtasks.map((subtask) =>
          subtask.id === subtaskId
            ? { ...subtask, done: !subtask.done }
            : subtask
        );

        const completedCount = updatedSubtasks.filter(
          (subtask) => subtask.done
        ).length;

        const progress =
          updatedSubtasks.length > 0
            ? Math.round((completedCount / updatedSubtasks.length) * 100)
            : item.progress;

        return {
          ...item,
          subtasks: updatedSubtasks,
          progress,
          status: progress === 100 ? "Completed" : item.status,
        };
      })
    );

    const updatedTask = taskList
      .map((item) => {
        if (item.id !== task.id) return item;

        const updatedSubtasks = item.subtasks.map((subtask) =>
          subtask.id === subtaskId
            ? { ...subtask, done: !subtask.done }
            : subtask
        );

        const completedCount = updatedSubtasks.filter(
          (subtask) => subtask.done
        ).length;

        const progress =
          updatedSubtasks.length > 0
            ? Math.round((completedCount / updatedSubtasks.length) * 100)
            : item.progress;

        return {
          ...item,
          subtasks: updatedSubtasks,
          progress,
          status: progress === 100 ? "Completed" : item.status,
        };
      })
      .find((item) => item.id === task.id);

    setModal({ type: "view", task: updatedTask });
  }

  const stats = useMemo(() => {
    const total = taskList.length;
    const dueToday = taskList.filter((task) => isDueToday(task)).length;
    const overdue = taskList.filter((task) => isOverdue(task)).length;
    const completed = taskList.filter(
      (task) => task.status === "Completed"
    ).length;
    const blocked = taskList.filter((task) => task.status === "Blocked").length;

    return {
      total,
      dueToday,
      overdue,
      completed,
      blocked,
    };
  }, [taskList]);

  const filteredTasks = useMemo(() => {
    const searchValue = search.toLowerCase();

    return taskList
      .filter((task) => {
        const matchSearch =
          task.title.toLowerCase().includes(searchValue) ||
          task.description.toLowerCase().includes(searchValue) ||
          task.assigned.toLowerCase().includes(searchValue) ||
          task.createdBy.toLowerCase().includes(searchValue) ||
          task.client.toLowerCase().includes(searchValue) ||
          task.type.toLowerCase().includes(searchValue) ||
          task.relatedTo.toLowerCase().includes(searchValue);

        const matchStatus =
          filterStatus === "All" || task.status === filterStatus;

        const matchPriority =
          filterPriority === "All" || task.priority === filterPriority;

        const matchAssignee =
          filterAssignee === "All" || task.assigned === filterAssignee;

        return matchSearch && matchStatus && matchPriority && matchAssignee;
      })
      .sort((a, b) => {
        if (sortBy === "priority") {
          const order = {
            Urgent: 1,
            High: 2,
            Medium: 3,
            Low: 4,
          };

          return (order[a.priority] || 99) - (order[b.priority] || 99);
        }

        if (sortBy === "progress") {
          return Number(a.progress || 0) - Number(b.progress || 0);
        }

        if (sortBy === "latest") {
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }

        return getDateTimeValue(a) - getDateTimeValue(b);
      });
  }, [
    taskList,
    search,
    filterStatus,
    filterPriority,
    filterAssignee,
    sortBy,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);

  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="w-full max-w-full">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <PageTitle
          title="Tasks"
          subtitle="Assign, track, reassign, review, and complete team tasks"
        />

        <button
          onClick={() => setModal({ type: "add" })}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
        >
          <Plus className="h-4 w-4" />
          Add New Task
        </button>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Total Tasks"
          value={stats.total}
          subtitle="All assigned tasks"
          icon={<ClipboardList className="h-5 w-5" />}
        />

        <StatCard
          title="Due Today"
          value={stats.dueToday}
          subtitle="Tasks requiring action"
          icon={<CalendarClock className="h-5 w-5" />}
        />

        <StatCard
          title="Overdue"
          value={stats.overdue}
          subtitle="Needs immediate attention"
          icon={<CircleAlert className="h-5 w-5" />}
        />

        <StatCard
          title="Completed"
          value={stats.completed}
          subtitle="Finished tasks"
          icon={<CheckCircle2 className="h-5 w-5" />}
        />

        <StatCard
          title="Blocked"
          value={stats.blocked}
          subtitle="Waiting or stuck tasks"
          icon={<XCircle className="h-5 w-5" />}
        />
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Search by task, assignee, client, type..."
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
          value={filterAssignee}
          onChange={(event) => {
            setFilterAssignee(event.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
        >
          <option value="All">All Assignees</option>
          {assignees.map((assignee) => (
            <option key={assignee}>{assignee}</option>
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
          <option value="dueDate">Nearest Due Date</option>
          <option value="priority">Priority First</option>
          <option value="progress">Lowest Progress</option>
          <option value="latest">Latest Created</option>
        </select>

        <button
          onClick={() =>
            setViewMode((current) => (current === "board" ? "table" : "board"))
          }
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
        >
          <Filter className="h-4 w-4" />
          {viewMode === "board" ? "Table View" : "Board View"}
        </button>
      </div>

      {viewMode === "board" ? (
        <div className="grid gap-5 xl:grid-cols-6">
          {STATUSES.map((status) => {
            const statusTasks = filteredTasks.filter(
              (task) => task.status === status
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
                      {statusTasks.length} tasks
                    </p>
                  </div>

                  <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                    {statusTasks.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {statusTasks.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-200 py-8 text-center text-sm text-slate-400 dark:border-slate-800">
                      No tasks
                    </div>
                  ) : (
                    statusTasks.map((task) => {
                      const overdue = isOverdue(task);

                      return (
                        <div
                          key={task.id}
                          className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-white hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-950"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                {task.title}
                              </h4>
                              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                {task.client || task.relatedTo}
                              </p>
                            </div>

                            <button
                              onClick={() => setModal({ type: "view", task })}
                              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                              title="View task"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2">
                            <PriorityBadge priority={task.priority} />
                            <StatusBadge status={task.status} overdue={overdue} />
                          </div>

                          <div className="mt-4">
                            <ProgressBar value={task.progress} />
                          </div>

                          <div className="mt-4 flex items-center justify-between gap-3 text-xs">
                            <span
                              className={`flex items-center gap-1 ${
                                overdue
                                  ? "font-semibold text-rose-600"
                                  : "text-slate-500 dark:text-slate-400"
                              }`}
                            >
                              <Clock3 className="h-3.5 w-3.5" />
                              {formatDate(task.dueDate)}
                            </span>

                            <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                              <UserCheck className="h-3.5 w-3.5" />
                              {task.assigned}
                            </span>
                          </div>

                          <div className="mt-4 flex flex-wrap items-center gap-2">
                            <button
                              onClick={() => setModal({ type: "view", task })}
                              title="View"
                              className="rounded-lg border border-blue-200 bg-blue-50 p-2 text-blue-700 transition hover:bg-blue-100"
                            >
                              <Eye className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => setModal({ type: "edit", task })}
                              title="Edit"
                              className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => handleMovePrevious(task)}
                              disabled={
                                STATUSES.indexOf(task.status) <= 0 ||
                                task.status === "Completed"
                              }
                              title="Move Back"
                              className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => handleMoveNext(task)}
                              disabled={
                                task.status === "Completed" ||
                                task.status === "Blocked"
                              }
                              title="Move Next"
                              className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => handleComplete(task)}
                              disabled={task.status === "Completed"}
                              title="Complete"
                              className="rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => setModal({ type: "delete", task })}
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
              Task List
            </h3>

            <p className="text-xs font-medium text-slate-400">
              Showing {paginatedTasks.length} of {filteredTasks.length}
            </p>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
                  <th className="px-4 py-3 font-semibold text-slate-500">
                    Task
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-500">
                    Assigned To
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-500">
                    Due Date
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-500">
                    Priority
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-500">
                    Status
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-500">
                    Progress
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-500">
                    Type
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedTasks.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-12 text-center text-slate-400"
                    >
                      No tasks found.
                    </td>
                  </tr>
                ) : (
                  paginatedTasks.map((task) => {
                    const overdue = isOverdue(task);

                    return (
                      <tr
                        key={task.id}
                        className="border-b border-slate-100 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                      >
                        <td className="px-4 py-3">
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {task.title}
                          </p>
                          <p className="text-xs text-slate-400">
                            {task.client || task.relatedTo}
                          </p>
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white dark:bg-white dark:text-slate-950">
                              {getInitials(task.assigned)}
                            </div>
                            <span className="font-medium text-slate-700 dark:text-slate-300">
                              {task.assigned}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <p
                            className={`font-semibold ${
                              overdue
                                ? "text-rose-700"
                                : "text-slate-700 dark:text-slate-300"
                            }`}
                          >
                            {formatDate(task.dueDate)}
                          </p>
                          <p className="text-xs text-slate-400">
                            {formatTime(task.dueTime)}
                          </p>
                        </td>

                        <td className="px-4 py-3">
                          <PriorityBadge priority={task.priority} />
                        </td>

                        <td className="px-4 py-3">
                          <StatusBadge status={task.status} overdue={overdue} />
                        </td>

                        <td className="px-4 py-3">
                          <div className="w-36">
                            <ProgressBar value={task.progress} />
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <TypeBadge type={task.type} />
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setModal({ type: "view", task })}
                              title="View"
                              className="rounded-lg border border-blue-200 bg-blue-50 p-2 text-blue-700 transition hover:bg-blue-100"
                            >
                              <Eye className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => setModal({ type: "edit", task })}
                              title="Edit"
                              className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() =>
                                setModal({ type: "reassign", task })
                              }
                              title="Reassign"
                              className="rounded-lg border border-purple-200 bg-purple-50 p-2 text-purple-700 transition hover:bg-purple-100"
                            >
                              <ArrowRightLeft className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => handleComplete(task)}
                              title="Complete"
                              className="rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-emerald-700 transition hover:bg-emerald-100"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => setModal({ type: "delete", task })}
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

      <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <Eye className="h-3.5 w-3.5" />
          View details
        </span>

        <span className="flex items-center gap-1">
          <Edit3 className="h-3.5 w-3.5" />
          Edit task
        </span>

        <span className="flex items-center gap-1">
          <ArrowRightLeft className="h-3.5 w-3.5" />
          Reassign task
        </span>

        <span className="flex items-center gap-1">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Mark completed
        </span>

        <span className="flex items-center gap-1">
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </span>
      </div>

      {modal?.type === "add" && (
        <TaskFormModal onSave={handleAdd} onClose={() => setModal(null)} />
      )}

      {modal?.type === "edit" && (
        <TaskFormModal
          task={modal.task}
          onSave={handleEdit}
          onClose={() => setModal(null)}
        />
      )}

      {modal?.type === "view" && (
        <TaskViewModal
          task={modal.task}
          onClose={() => setModal(null)}
          onEdit={(task) => setModal({ type: "edit", task })}
          onComplete={handleComplete}
          onMoveNext={handleMoveNext}
          onReassign={(task) => setModal({ type: "reassign", task })}
          onToggleSubtask={handleToggleSubtask}
        />
      )}

      {modal?.type === "reassign" && (
        <ReassignModal
          task={modal.task}
          onSave={handleReassign}
          onClose={() => setModal(null)}
        />
      )}

      {modal?.type === "delete" && (
        <ConfirmModal
          task={modal.task}
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

export default Tasks;