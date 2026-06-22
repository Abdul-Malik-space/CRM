import { useMemo, useState } from "react";
import PageTitle from "../components/PageTitle";
import {
  AlertTriangle,
  BellRing,
  CalendarClock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  ClipboardList,
  Clock3,
  Edit3,
  Eye,
  Mail,
  MessageCircle,
  Phone,
  Plus,
  RefreshCcw,
  Search,
  Send,
  TimerReset,
  Trash2,
  UserRound,
  UsersRound,
  Video,
  X,
} from "lucide-react";

import { followUps as initialFollowUps } from "../data/crmData";

const ITEMS_PER_PAGE = 6;

const emptyForm = {
  client: "",
  phone: "",
  email: "",
  type: "Call",
  date: "",
  time: "",
  status: "Scheduled",
  priority: "Medium",
  assignedTo: "Admin",
  relatedTo: "General",
  reminder: "30 minutes before",
  outcome: "",
  notes: "",
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
  const date = new Date();
  return date.toTimeString().slice(0, 5);
}

function formatDate(value) {
  if (!value) return "N/A";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function formatTime(value) {
  if (!value) return "N/A";

  const [hour, minute] = value.split(":");

  if (!hour || !minute) {
    return value;
  }

  const date = new Date();
  date.setHours(Number(hour), Number(minute));

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getDateTimeValue(item) {
  const dateValue = item.date || "9999-12-31";
  const timeValue = item.time || "23:59";
  const date = new Date(`${dateValue}T${timeValue}`);

  if (Number.isNaN(date.getTime())) {
    return 0;
  }

  return date.getTime();
}

function normalizeStatus(status) {
  if (status === "Done") return "Completed";
  if (status === "Complete") return "Completed";
  if (status === "Pending") return "Pending";
  return status || "Scheduled";
}

function normalizeFollowUp(item, index) {
  return {
    id: item.id ?? index + 1,
    client: item.client ?? item.name ?? "",
    phone: item.phone ?? "",
    email: item.email ?? "",
    type: item.type ?? "Call",
    date: item.date ?? getToday(),
    time: item.time ?? "10:00",
    status: normalizeStatus(item.status),
    priority: item.priority ?? "Medium",
    assignedTo: item.assignedTo ?? "Admin",
    relatedTo: item.relatedTo ?? "General",
    reminder: item.reminder ?? "30 minutes before",
    outcome: item.outcome ?? "",
    notes: item.notes ?? "",
    createdAt: item.createdAt ?? getToday(),
  };
}

function isClosedStatus(status) {
  return ["Completed", "Cancelled"].includes(status);
}

function isOverdue(item) {
  if (isClosedStatus(item.status)) return false;
  return getDateTimeValue(item) < Date.now();
}

function isDueToday(item) {
  if (isClosedStatus(item.status)) return false;
  return item.date === getToday();
}

function cleanPhone(phone = "") {
  return phone.replace(/[^\d]/g, "");
}

function TypeIcon({ type, className = "h-4 w-4" }) {
  const icons = {
    Call: Phone,
    WhatsApp: MessageCircle,
    Email: Mail,
    Meeting: CalendarClock,
    "Video Meeting": Video,
    SMS: Send,
  };

  const Icon = icons[type] ?? ClipboardList;
  return <Icon className={className} />;
}

function TypeBadge({ type }) {
  const map = {
    Call: "bg-blue-100 text-blue-800 border-blue-200",
    WhatsApp: "bg-emerald-100 text-emerald-800 border-emerald-200",
    Email: "bg-purple-100 text-purple-800 border-purple-200",
    Meeting: "bg-amber-100 text-amber-800 border-amber-200",
    "Video Meeting": "bg-indigo-100 text-indigo-800 border-indigo-200",
    SMS: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold ${
        map[type] ?? "bg-slate-100 text-slate-700 border-slate-200"
      }`}
    >
      <TypeIcon type={type} />
      {type}
    </span>
  );
}

function StatusBadge({ status, overdue }) {
  const map = {
    Scheduled: "bg-blue-100 text-blue-800 border-blue-200",
    Pending: "bg-amber-100 text-amber-800 border-amber-200",
    Completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
    Missed: "bg-rose-100 text-rose-800 border-rose-200",
    Rescheduled: "bg-purple-100 text-purple-800 border-purple-200",
    Cancelled: "bg-slate-100 text-slate-600 border-slate-200",
  };

  if (overdue) {
    return (
      <span className="inline-flex rounded-lg border border-rose-200 bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-800">
        Overdue
      </span>
    );
  }

  return (
    <span
      className={`inline-flex rounded-lg border px-2.5 py-1 text-xs font-semibold ${
        map[status] ?? "bg-slate-100 text-slate-600 border-slate-200"
      }`}
    >
      {status}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const map = {
    High: "bg-rose-100 text-rose-800 border-rose-200",
    Medium: "bg-amber-100 text-amber-800 border-amber-200",
    Low: "bg-blue-100 text-blue-800 border-blue-200",
  };

  return (
    <span
      className={`inline-flex rounded-lg border px-2.5 py-1 text-xs font-semibold ${
        map[priority] ?? "bg-slate-100 text-slate-600 border-slate-200"
      }`}
    >
      {priority}
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

function ConfirmModal({ followUp, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/50 px-4">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
            <AlertTriangle className="h-6 w-6" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-950 dark:text-white">
              Delete Follow-up?
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Are you sure you want to delete the follow-up for{" "}
              <strong>{followUp.client}</strong>? This action cannot be undone.
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
            Delete Follow-up
          </button>
        </div>
      </div>
    </div>
  );
}

function FollowUpViewModal({
  followUp,
  onClose,
  onEdit,
  onComplete,
  onReschedule,
}) {
  const overdue = isOverdue(followUp);
  const phoneNumber = cleanPhone(followUp.phone);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/50 px-4">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-7 flex items-start justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
              <TypeIcon type={followUp.type} className="h-7 w-7" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-slate-950 dark:text-white">
                {followUp.client}
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {followUp.relatedTo || "General follow-up"}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <TypeBadge type={followUp.type} />
                <StatusBadge status={followUp.status} overdue={overdue} />
                <PriorityBadge priority={followUp.priority} />
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 p-2 text-slate-400 transition hover:bg-slate-50 hover:text-slate-700 dark:border-slate-800 dark:hover:bg-slate-900 dark:hover:text-slate-200"
            aria-label="Close follow-up profile"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-950 dark:text-white">
              <UserRound className="h-4 w-4" />
              Client Details
            </div>

            <div className="space-y-3 text-sm">
              <p className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <UsersRound className="h-4 w-4 text-slate-400" />
                {followUp.client || "N/A"}
              </p>

              <p className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Phone className="h-4 w-4 text-slate-400" />
                {followUp.phone || "N/A"}
              </p>

              <p className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Mail className="h-4 w-4 text-slate-400" />
                {followUp.email || "N/A"}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-950 dark:text-white">
              <CalendarClock className="h-4 w-4" />
              Schedule
            </div>

            <div className="space-y-3 text-sm">
              <p className="flex justify-between gap-3">
                <span className="text-slate-500 dark:text-slate-400">Date</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {formatDate(followUp.date)}
                </span>
              </p>

              <p className="flex justify-between gap-3">
                <span className="text-slate-500 dark:text-slate-400">Time</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {formatTime(followUp.time)}
                </span>
              </p>

              <p className="flex justify-between gap-3">
                <span className="text-slate-500 dark:text-slate-400">
                  Reminder
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {followUp.reminder || "N/A"}
                </span>
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-950 dark:text-white">
              <ClipboardList className="h-4 w-4" />
              CRM Details
            </div>

            <div className="space-y-3 text-sm">
              <p className="flex justify-between gap-3">
                <span className="text-slate-500 dark:text-slate-400">
                  Assigned To
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {followUp.assignedTo || "N/A"}
                </span>
              </p>

              <p className="flex justify-between gap-3">
                <span className="text-slate-500 dark:text-slate-400">
                  Related To
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {followUp.relatedTo || "N/A"}
                </span>
              </p>

              <p className="flex justify-between gap-3">
                <span className="text-slate-500 dark:text-slate-400">
                  Created
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {formatDate(followUp.createdAt)}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-950 dark:text-white">
              <CheckCircle2 className="h-4 w-4" />
              Outcome
            </div>

            <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
              {followUp.outcome || "No outcome recorded yet."}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-950 dark:text-white">
              <ClipboardList className="h-4 w-4" />
              Notes
            </div>

            <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
              {followUp.notes || "No notes added for this follow-up."}
            </p>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {followUp.phone && (
            <a
              href={`tel:${followUp.phone}`}
              className="flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
            >
              <Phone className="h-4 w-4" />
              Call Client
            </a>
          )}

          {phoneNumber && (
            <a
              href={`https://wa.me/${phoneNumber}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          )}

          {followUp.email && (
            <a
              href={`mailto:${followUp.email}`}
              className="flex items-center justify-center gap-2 rounded-xl border border-purple-200 bg-purple-50 py-3 text-sm font-semibold text-purple-700 transition hover:bg-purple-100"
            >
              <Mail className="h-4 w-4" />
              Send Email
            </a>
          )}

          <button
            onClick={() => onEdit(followUp)}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            <Edit3 className="h-4 w-4" />
            Edit
          </button>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            onClick={() => onReschedule(followUp)}
            className="flex items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 py-3 text-sm font-semibold text-amber-700 transition hover:bg-amber-100"
          >
            <RefreshCcw className="h-4 w-4" />
            Reschedule Tomorrow
          </button>

          <button
            onClick={() => onComplete(followUp)}
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            <CheckCircle2 className="h-4 w-4" />
            Mark Completed
          </button>
        </div>
      </div>
    </div>
  );
}

function FollowUpFormModal({ followUp, onSave, onClose }) {
  const [form, setForm] = useState(() => ({
    ...(followUp ?? emptyForm),
    date: followUp?.date || getToday(),
    time: followUp?.time || getCurrentTime(),
  }));

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.client.trim() || !form.type.trim() || !form.date || !form.time) {
      return;
    }

    onSave(form);
  }

  const fieldClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-950";

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/50 px-4">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-7 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-slate-950 dark:text-white">
              {followUp ? "Edit Follow-up" : "Add New Follow-up"}
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Schedule calls, WhatsApp messages, emails, meetings, reminders,
              and outcomes.
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
              Client Information
            </h4>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
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
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-bold text-slate-950 dark:text-white">
              Follow-up Schedule
            </h4>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Type *
                </label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className={fieldClass}
                  required
                >
                  {["Call", "WhatsApp", "Email", "Meeting", "Video Meeting", "SMS"].map(
                    (type) => (
                      <option key={type}>{type}</option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className={fieldClass}
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Time *
                </label>
                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  className={fieldClass}
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Reminder
                </label>
                <select
                  name="reminder"
                  value={form.reminder}
                  onChange={handleChange}
                  className={fieldClass}
                >
                  {[
                    "No reminder",
                    "10 minutes before",
                    "30 minutes before",
                    "1 hour before",
                    "1 day before",
                  ].map((reminder) => (
                    <option key={reminder}>{reminder}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-bold text-slate-950 dark:text-white">
              CRM Management
            </h4>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
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
                  {[
                    "Scheduled",
                    "Pending",
                    "Completed",
                    "Missed",
                    "Rescheduled",
                    "Cancelled",
                  ].map((status) => (
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
                  {["High", "Medium", "Low"].map((priority) => (
                    <option key={priority}>{priority}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Assigned To
                </label>
                <input
                  name="assignedTo"
                  value={form.assignedTo}
                  onChange={handleChange}
                  placeholder="Admin"
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
                  {[
                    "General",
                    "Lead",
                    "Customer",
                    "Deal",
                    "Payment",
                    "Project",
                    "Support",
                  ].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-bold text-slate-950 dark:text-white">
              Notes and Outcome
            </h4>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Outcome
                </label>
                <textarea
                  name="outcome"
                  value={form.outcome}
                  onChange={handleChange}
                  placeholder="Add follow-up result..."
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
                  placeholder="Add internal notes..."
                  className={`${fieldClass} min-h-[120px] resize-none`}
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
              {followUp ? (
                <>
                  <Edit3 className="h-4 w-4" />
                  Save Changes
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add Follow-up
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FollowUps() {
  const [followUpList, setFollowUpList] = useState(() =>
    initialFollowUps.map((item, index) => normalizeFollowUp(item, index))
  );

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [sortBy, setSortBy] = useState("nearest");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  function handleAdd(form) {
    const newFollowUp = {
      ...form,
      id: Date.now(),
      createdAt: getToday(),
    };

    setFollowUpList((previous) => [newFollowUp, ...previous]);
    setModal(null);
    showToast("Follow-up added successfully.");
  }

  function handleEdit(form) {
    setFollowUpList((previous) =>
      previous.map((item) =>
        item.id === modal.followUp.id
          ? {
              ...modal.followUp,
              ...form,
            }
          : item
      )
    );

    setModal(null);
    showToast("Follow-up updated successfully.");
  }

  function handleDelete() {
    setFollowUpList((previous) =>
      previous.filter((item) => item.id !== modal.followUp.id)
    );

    setModal(null);
    showToast("Follow-up deleted successfully.", "error");
  }

  function handleComplete(followUp) {
    setFollowUpList((previous) =>
      previous.map((item) =>
        item.id === followUp.id
          ? {
              ...item,
              status: "Completed",
              outcome: item.outcome || "Follow-up completed successfully.",
            }
          : item
      )
    );

    setModal(null);
    showToast("Follow-up marked as completed.");
  }

  function handleReschedule(followUp) {
    setFollowUpList((previous) =>
      previous.map((item) =>
        item.id === followUp.id
          ? {
              ...item,
              date: getTomorrow(),
              status: "Rescheduled",
            }
          : item
      )
    );

    setModal(null);
    showToast("Follow-up rescheduled for tomorrow.", "info");
  }

  const stats = useMemo(() => {
    const total = followUpList.length;
    const today = followUpList.filter((item) => isDueToday(item)).length;
    const overdue = followUpList.filter((item) => isOverdue(item)).length;
    const completed = followUpList.filter(
      (item) => item.status === "Completed"
    ).length;

    return {
      total,
      today,
      overdue,
      completed,
    };
  }, [followUpList]);

  const filteredFollowUps = useMemo(() => {
    const searchValue = search.toLowerCase();

    return followUpList
      .filter((item) => {
        const matchSearch =
          item.client.toLowerCase().includes(searchValue) ||
          item.phone.includes(search) ||
          item.email.toLowerCase().includes(searchValue) ||
          item.type.toLowerCase().includes(searchValue) ||
          item.relatedTo.toLowerCase().includes(searchValue) ||
          item.assignedTo.toLowerCase().includes(searchValue);

        const matchType = filterType === "All" || item.type === filterType;
        const matchStatus =
          filterStatus === "All" || item.status === filterStatus;
        const matchPriority =
          filterPriority === "All" || item.priority === filterPriority;

        return matchSearch && matchType && matchStatus && matchPriority;
      })
      .sort((a, b) => {
        if (sortBy === "latest") {
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }

        if (sortBy === "priority") {
          const priorityOrder = {
            High: 1,
            Medium: 2,
            Low: 3,
          };

          return (
            (priorityOrder[a.priority] || 99) -
            (priorityOrder[b.priority] || 99)
          );
        }

        return getDateTimeValue(a) - getDateTimeValue(b);
      });
  }, [
    followUpList,
    search,
    filterType,
    filterStatus,
    filterPriority,
    sortBy,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredFollowUps.length / ITEMS_PER_PAGE)
  );

  const currentPage = Math.min(page, totalPages);

  const paginatedFollowUps = filteredFollowUps.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const todayFollowUps = filteredFollowUps
    .filter((item) => isDueToday(item))
    .slice(0, 4);

  return (
    <div className="w-full max-w-full">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <PageTitle
          title="Follow-ups"
          subtitle="Track calls, WhatsApp messages, emails, meetings, reminders, and outcomes"
        />

        <button
          onClick={() => setModal({ type: "add" })}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
        >
          <Plus className="h-4 w-4" />
          Add Follow-up
        </button>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Follow-ups"
          value={stats.total}
          subtitle="All scheduled activities"
          icon={<ClipboardList className="h-5 w-5" />}
        />

        <StatCard
          title="Due Today"
          value={stats.today}
          subtitle="Requires action today"
          icon={<CalendarClock className="h-5 w-5" />}
        />

        <StatCard
          title="Overdue"
          value={stats.overdue}
          subtitle="Need immediate attention"
          icon={<CircleAlert className="h-5 w-5" />}
        />

        <StatCard
          title="Completed"
          value={stats.completed}
          subtitle="Successfully completed"
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
      </div>

      <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-950 dark:text-white">
              Today's Follow-ups
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Quick view of follow-ups that need action today.
            </p>
          </div>

          <span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            {todayFollowUps.length} scheduled today
          </span>
        </div>

        {todayFollowUps.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 py-8 text-center text-sm text-slate-400 dark:border-slate-800">
            No follow-ups scheduled for today.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {todayFollowUps.map((item) => (
              <button
                key={item.id}
                onClick={() => setModal({ type: "view", followUp: item })}
                className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-slate-700 dark:bg-slate-950 dark:text-slate-200">
                    <TypeIcon type={item.type} />
                  </div>

                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {item.client}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {item.type} at {formatTime(item.time)}
                    </p>
                  </div>
                </div>

                <PriorityBadge priority={item.priority} />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Search by client, phone, email, type..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-slate-600"
          />
        </div>

        <select
          value={filterType}
          onChange={(event) => {
            setFilterType(event.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-slate-600"
        >
          <option value="All">All Types</option>
          {["Call", "WhatsApp", "Email", "Meeting", "Video Meeting", "SMS"].map(
            (type) => (
              <option key={type}>{type}</option>
            )
          )}
        </select>

        <select
          value={filterStatus}
          onChange={(event) => {
            setFilterStatus(event.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-slate-600"
        >
          <option value="All">All Status</option>
          {[
            "Scheduled",
            "Pending",
            "Completed",
            "Missed",
            "Rescheduled",
            "Cancelled",
          ].map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>

        <select
          value={filterPriority}
          onChange={(event) => {
            setFilterPriority(event.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-slate-600"
        >
          <option value="All">All Priority</option>
          {["High", "Medium", "Low"].map((priority) => (
            <option key={priority}>{priority}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(event) => {
            setSortBy(event.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-slate-600"
        >
          <option value="nearest">Nearest Schedule</option>
          <option value="latest">Latest Created</option>
          <option value="priority">Priority First</option>
        </select>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-950 dark:text-white">
            Follow-up Schedule
          </h3>

          <p className="text-xs font-medium text-slate-400">
            Showing {paginatedFollowUps.length} of {filteredFollowUps.length}
          </p>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
                <th className="px-4 py-3 font-semibold text-slate-500">
                  Client
                </th>
                <th className="px-4 py-3 font-semibold text-slate-500">
                  Type
                </th>
                <th className="px-4 py-3 font-semibold text-slate-500">
                  Schedule
                </th>
                <th className="px-4 py-3 font-semibold text-slate-500">
                  Priority
                </th>
                <th className="px-4 py-3 font-semibold text-slate-500">
                  Status
                </th>
                <th className="px-4 py-3 font-semibold text-slate-500">
                  Assigned To
                </th>
                <th className="px-4 py-3 font-semibold text-slate-500">
                  Reminder
                </th>
                <th className="px-4 py-3 font-semibold text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedFollowUps.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-slate-400"
                  >
                    No follow-ups found.
                  </td>
                </tr>
              ) : (
                paginatedFollowUps.map((item) => {
                  const overdue = isOverdue(item);

                  return (
                    <tr
                      key={item.id}
                      className="border-b border-slate-100 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white dark:bg-white dark:text-slate-950">
                            {item.client
                              .split(" ")
                              .filter(Boolean)
                              .map((word) => word[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)}
                          </div>

                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {item.client}
                            </p>
                            <p className="text-xs text-slate-400">
                              {item.phone || item.email || "No contact added"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <TypeBadge type={item.type} />
                      </td>

                      <td className="px-4 py-3">
                        <p
                          className={`font-semibold ${
                            overdue
                              ? "text-rose-700"
                              : "text-slate-800 dark:text-slate-200"
                          }`}
                        >
                          {formatDate(item.date)}
                        </p>
                        <p className="flex items-center gap-1 text-xs text-slate-400">
                          <Clock3 className="h-3.5 w-3.5" />
                          {formatTime(item.time)}
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <PriorityBadge priority={item.priority} />
                      </td>

                      <td className="px-4 py-3">
                        <StatusBadge status={item.status} overdue={overdue} />
                      </td>

                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                        {item.assignedTo}
                      </td>

                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                          <BellRing className="h-3.5 w-3.5" />
                          {item.reminder}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              setModal({ type: "view", followUp: item })
                            }
                            title="View"
                            className="rounded-lg border border-blue-200 bg-blue-50 p-2 text-blue-700 transition hover:bg-blue-100"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() =>
                              setModal({ type: "edit", followUp: item })
                            }
                            title="Edit"
                            className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => handleComplete(item)}
                            title="Mark Completed"
                            className="rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-emerald-700 transition hover:bg-emerald-100"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => handleReschedule(item)}
                            title="Reschedule"
                            className="rounded-lg border border-amber-200 bg-amber-50 p-2 text-amber-700 transition hover:bg-amber-100"
                          >
                            <TimerReset className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() =>
                              setModal({ type: "delete", followUp: item })
                            }
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

      <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <Eye className="h-3.5 w-3.5" />
          View details
        </span>

        <span className="flex items-center gap-1">
          <Edit3 className="h-3.5 w-3.5" />
          Edit follow-up
        </span>

        <span className="flex items-center gap-1">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Mark completed
        </span>

        <span className="flex items-center gap-1">
          <TimerReset className="h-3.5 w-3.5" />
          Reschedule
        </span>

        <span className="flex items-center gap-1">
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </span>
      </div>

      {modal?.type === "add" && (
        <FollowUpFormModal
          onSave={handleAdd}
          onClose={() => setModal(null)}
        />
      )}

      {modal?.type === "edit" && (
        <FollowUpFormModal
          followUp={modal.followUp}
          onSave={handleEdit}
          onClose={() => setModal(null)}
        />
      )}

      {modal?.type === "view" && (
        <FollowUpViewModal
          followUp={modal.followUp}
          onClose={() => setModal(null)}
          onEdit={(followUp) => setModal({ type: "edit", followUp })}
          onComplete={handleComplete}
          onReschedule={handleReschedule}
        />
      )}

      {modal?.type === "delete" && (
        <ConfirmModal
          followUp={modal.followUp}
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

export default FollowUps;