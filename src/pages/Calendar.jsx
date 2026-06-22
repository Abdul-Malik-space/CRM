import { useMemo, useState } from "react";
import PageTitle from "../components/PageTitle";
import {
  AlertTriangle,
  BellRing,
  BriefcaseBusiness,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  CreditCard,
  Download,
  Edit3,
  Eye,
  Filter,
  FolderKanban,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
  RefreshCcw,
  Search,
  Trash2,
  UsersRound,
  Video,
  X,
} from "lucide-react";

import {
  followUps as initialFollowUps,
  tasks as initialTasks,
  deals as initialDeals,
  customers as initialCustomers,
} from "../data/crmData";

const EVENT_TYPES = [
  "Follow-up",
  "Task",
  "Meeting",
  "Payment",
  "Project",
  "Deal",
  "Other",
];

const PRIORITIES = ["High", "Medium", "Low"];

const STATUS_OPTIONS = ["Scheduled", "Completed", "Cancelled"];

const emptyForm = {
  title: "",
  type: "Meeting",
  date: "",
  time: "",
  endTime: "",
  status: "Scheduled",
  priority: "Medium",
  assignedTo: "Admin",
  relatedName: "",
  channel: "Office",
  location: "",
  phone: "",
  email: "",
  notes: "",
};

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function getCurrentTime() {
  return new Date().toTimeString().slice(0, 5);
}

function getFutureDate(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return toLocalDateString(date);
}

function toLocalDateString(date) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
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
    currency: "PKR",
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

function getMonthName(date) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function getEventStatus(event) {
  if (event.status === "Completed") return "Completed";
  if (event.status === "Cancelled") return "Cancelled";

  if (event.date && new Date(event.date) < new Date(getToday())) {
    return "Overdue";
  }

  return "Scheduled";
}

function sortEventsByDateTime(a, b) {
  const dateA = new Date(`${a.date || "9999-12-31"}T${a.time || "23:59"}`);
  const dateB = new Date(`${b.date || "9999-12-31"}T${b.time || "23:59"}`);

  return dateA - dateB;
}

function getTypeIcon(type) {
  const iconMap = {
    "Follow-up": MessageCircle,
    Task: BellRing,
    Meeting: UsersRound,
    Payment: CreditCard,
    Project: FolderKanban,
    Deal: BriefcaseBusiness,
    Other: CalendarClock,
  };

  return iconMap[type] || CalendarClock;
}

function buildInitialEvents() {
  const followUpEvents = initialFollowUps.map((item, index) => ({
    id: `followup-${index + 1}`,
    title: `${item.type || "Follow-up"} with ${item.client || item.name || "Client"}`,
    type: "Follow-up",
    date: item.date || getToday(),
    time: item.time || "10:00",
    endTime: "",
    status:
      item.status === "Done" || item.status === "Complete"
        ? "Completed"
        : item.status || "Scheduled",
    priority: item.priority || "Medium",
    assignedTo: item.assignedTo || "Admin",
    relatedName: item.client || item.name || "",
    channel: item.type || "Call",
    location: "",
    phone: item.phone || "",
    email: item.email || "",
    notes: item.notes || "Client follow-up activity.",
    source: "Follow-up",
  }));

  const taskEvents = initialTasks.map((task, index) => ({
    id: `task-${index + 1}`,
    title: task.title || "Task Reminder",
    type: "Task",
    date: task.dueDate || task.due || getToday(),
    time: task.dueTime || "11:00",
    endTime: "",
    status:
      task.status === "Done" || task.status === "Complete"
        ? "Completed"
        : task.status || "Scheduled",
    priority: task.priority || "Medium",
    assignedTo: task.assigned || task.assignedTo || "Admin",
    relatedName: task.client || task.relatedTo || "",
    channel: "Task",
    location: "",
    phone: "",
    email: "",
    notes: task.description || task.notes || "Assigned CRM task.",
    source: "Task",
  }));

  const dealEvents = initialDeals.map((deal, index) => ({
    id: `deal-${index + 1}`,
    title: `${deal.title || "Deal"} closing`,
    type: "Deal",
    date: deal.expectedCloseDate || getFutureDate(index + 2),
    time: "03:00",
    endTime: "",
    status:
      deal.stage === "Won" || deal.stage === "Lost"
        ? "Completed"
        : "Scheduled",
    priority: deal.priority || "High",
    assignedTo: deal.owner || "Admin",
    relatedName: deal.client || "",
    channel: "Deal Closing",
    location: "",
    phone: deal.phone || "",
    email: deal.email || "",
    notes: `Deal value: ${formatCurrency(parseAmount(deal.amount))}`,
    source: "Deal",
  }));

  const paymentEvents = initialCustomers
    .map((customer, index) => {
      const totalValue = parseAmount(customer.totalValue ?? customer.amount ?? 0);
      const paidAmount = parseAmount(customer.paidAmount ?? 0);
      const balance = Math.max(0, totalValue - paidAmount);

      if (balance <= 0) return null;

      return {
        id: `payment-${index + 1}`,
        title: `Payment due from ${customer.name || "Customer"}`,
        type: "Payment",
        date: customer.dueDate || getFutureDate(index + 1),
        time: "12:00",
        endTime: "",
        status: "Scheduled",
        priority: "High",
        assignedTo: "Admin",
        relatedName: customer.name || "",
        channel: "Payment Reminder",
        location: "",
        phone: customer.phone || "",
        email: customer.email || "",
        notes: `Pending balance: ${formatCurrency(balance)}`,
        source: "Payment",
      };
    })
    .filter(Boolean);

  const defaultEvents = [
    {
      id: "meeting-default-1",
      title: "Weekly sales review meeting",
      type: "Meeting",
      date: getToday(),
      time: "05:00",
      endTime: "05:30",
      status: "Scheduled",
      priority: "Medium",
      assignedTo: "Admin",
      relatedName: "Sales Team",
      channel: "Office",
      location: "Main Office",
      phone: "",
      email: "",
      notes: "Review leads, deals, tasks, payments, and pending follow-ups.",
      source: "Manual",
    },
  ];

  return [
    ...defaultEvents,
    ...followUpEvents,
    ...taskEvents,
    ...dealEvents,
    ...paymentEvents,
  ].sort(sortEventsByDateTime);
}

function TypeBadge({ type }) {
  const map = {
    "Follow-up": "border-blue-200 bg-blue-50 text-blue-700",
    Task: "border-amber-200 bg-amber-50 text-amber-700",
    Meeting: "border-purple-200 bg-purple-50 text-purple-700",
    Payment: "border-emerald-200 bg-emerald-50 text-emerald-700",
    Project: "border-cyan-200 bg-cyan-50 text-cyan-700",
    Deal: "border-orange-200 bg-orange-50 text-orange-700",
    Other: "border-slate-200 bg-slate-50 text-slate-700",
  };

  return (
    <span
      className={`inline-flex rounded-lg border px-2.5 py-1 text-xs font-bold ${
        map[type] || "border-slate-200 bg-slate-50 text-slate-700"
      }`}
    >
      {type}
    </span>
  );
}

function StatusBadge({ status }) {
  const map = {
    Scheduled: "border-blue-200 bg-blue-50 text-blue-700",
    Completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
    Overdue: "border-rose-200 bg-rose-50 text-rose-700",
    Cancelled: "border-slate-200 bg-slate-50 text-slate-600",
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

function ConfirmModal({ event, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/50 px-4">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
            <AlertTriangle className="h-6 w-6" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-950 dark:text-white">
              Delete Calendar Event?
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Are you sure you want to delete <strong>{event.title}</strong>?
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
            Delete Event
          </button>
        </div>
      </div>
    </div>
  );
}

function EventFormModal({ event, selectedDate, onSave, onClose }) {
  const [form, setForm] = useState(() => ({
    ...(event ?? emptyForm),
    date: event?.date || selectedDate || getToday(),
    time: event?.time || getCurrentTime(),
  }));

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.title.trim() || !form.date || !form.time) return;

    onSave({
      ...form,
      id: event?.id || Date.now(),
      source: event?.source || "Manual",
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
              {event ? "Edit Calendar Event" : "Create Calendar Event"}
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Schedule meetings, follow-ups, tasks, payment reminders, deal
              closing dates, and project deadlines.
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
              Event Information
            </h4>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Event Title *
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Client meeting or payment reminder"
                  className={fieldClass}
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Type
                </label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className={fieldClass}
                >
                  {EVENT_TYPES.map((type) => (
                    <option key={type}>{type}</option>
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
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-bold text-slate-950 dark:text-white">
              Schedule
            </h4>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
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
                  Start Time *
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
                  End Time
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={form.endTime}
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
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-bold text-slate-950 dark:text-white">
              Contact and Assignment
            </h4>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
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
                  Related Client / Team
                </label>
                <input
                  name="relatedName"
                  value={form.relatedName}
                  onChange={handleChange}
                  placeholder="Client or team name"
                  className={fieldClass}
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
              Meeting Channel
            </h4>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Channel
                </label>
                <select
                  name="channel"
                  value={form.channel}
                  onChange={handleChange}
                  className={fieldClass}
                >
                  {[
                    "Office",
                    "Call",
                    "WhatsApp",
                    "Email",
                    "Google Meet",
                    "Zoom",
                    "Client Visit",
                    "Other",
                  ].map((channel) => (
                    <option key={channel}>{channel}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Location / Link
                </label>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Office address or meeting link"
                  className={fieldClass}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Notes
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Agenda, reminder note, meeting details, client requirement, or payment reminder..."
              className={`${fieldClass} min-h-[130px] resize-none`}
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
              {event ? (
                <>
                  <Edit3 className="h-4 w-4" />
                  Save Changes
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Create Event
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EventViewModal({ event, onClose, onEdit, onComplete }) {
  const status = getEventStatus(event);
  const TypeIcon = getTypeIcon(event.type);
  const phoneNumber = String(event.phone || "").replace(/[^\d]/g, "");

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/50 px-4">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-7 flex items-start justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
              <TypeIcon className="h-7 w-7" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-slate-950 dark:text-white">
                {event.title}
              </h3>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {formatDate(event.date)} • {formatTime(event.time)}
                {event.endTime ? ` - ${formatTime(event.endTime)}` : ""}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <TypeBadge type={event.type} />
                <StatusBadge status={status} />
                <PriorityBadge priority={event.priority} />
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 p-2 text-slate-400 transition hover:bg-slate-50 hover:text-slate-700 dark:border-slate-800 dark:hover:bg-slate-900 dark:hover:text-slate-200"
            aria-label="Close event"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-950 dark:text-white">
              <CalendarDays className="h-4 w-4" />
              Schedule
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300">
              Date: <strong>{formatDate(event.date)}</strong>
            </p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Time: <strong>{formatTime(event.time)}</strong>
            </p>
            {event.endTime && (
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                End: <strong>{formatTime(event.endTime)}</strong>
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-950 dark:text-white">
              <UsersRound className="h-4 w-4" />
              Assignment
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300">
              Assigned To: <strong>{event.assignedTo || "N/A"}</strong>
            </p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Related: <strong>{event.relatedName || "N/A"}</strong>
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-950 dark:text-white">
              <Video className="h-4 w-4" />
              Channel
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300">
              {event.channel || "N/A"}
            </p>

            {event.location && (
              <p className="mt-2 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <MapPin className="h-4 w-4" />
                {event.location}
              </p>
            )}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-950 dark:text-white">
              <Phone className="h-4 w-4" />
              Contact
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300">
              Phone: {event.phone || "No phone added"}
            </p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Email: {event.email || "No email added"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-950 dark:text-white">
              <BellRing className="h-4 w-4" />
              Notes
            </div>

            <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
              {event.notes || "No notes added."}
            </p>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
          <button
            onClick={() => onEdit(event)}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            <Edit3 className="h-4 w-4" />
            Edit
          </button>

          <button
            onClick={() => onComplete(event)}
            disabled={status === "Completed"}
            className="flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <CheckCircle2 className="h-4 w-4" />
            Complete
          </button>

          {phoneNumber && (
            <a
              href={`tel:${event.phone}`}
              className="flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
            >
              <Phone className="h-4 w-4" />
              Call
            </a>
          )}

          {phoneNumber && (
            <a
              href={`https://wa.me/${phoneNumber}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-100"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          )}

          {event.email && (
            <a
              href={`mailto:${event.email}`}
              className="flex items-center justify-center gap-2 rounded-xl border border-purple-200 bg-purple-50 py-3 text-sm font-semibold text-purple-700 transition hover:bg-purple-100"
            >
              <Mail className="h-4 w-4" />
              Email
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function Calendar() {
  const [eventList, setEventList] = useState(() => buildInitialEvents());
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  function handleAdd(form) {
    setEventList((previous) => [form, ...previous].sort(sortEventsByDateTime));
    setModal(null);
    showToast("Calendar event created successfully.");
  }

  function handleEdit(form) {
    setEventList((previous) =>
      previous
        .map((event) => (event.id === modal.event.id ? { ...modal.event, ...form } : event))
        .sort(sortEventsByDateTime)
    );

    setModal(null);
    showToast("Calendar event updated successfully.");
  }

  function handleDelete() {
    setEventList((previous) =>
      previous.filter((event) => event.id !== modal.event.id)
    );

    setModal(null);
    showToast("Calendar event deleted.", "error");
  }

  function handleComplete(event) {
    setEventList((previous) =>
      previous.map((item) =>
        item.id === event.id ? { ...item, status: "Completed" } : item
      )
    );

    setModal(null);
    showToast("Event marked as completed.");
  }

  function exportCsv() {
    const rows = [
      [
        "Title",
        "Type",
        "Date",
        "Time",
        "Status",
        "Priority",
        "Assigned To",
        "Related",
        "Channel",
      ],
      ...eventList.map((event) => [
        event.title,
        event.type,
        event.date,
        event.time,
        getEventStatus(event),
        event.priority,
        event.assignedTo,
        event.relatedName,
        event.channel,
      ]),
    ];

    const csv = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "crm-calendar.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  const filteredEvents = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return eventList
      .filter((event) => {
        const status = getEventStatus(event);

        const matchesSearch =
          !searchValue ||
          event.title.toLowerCase().includes(searchValue) ||
          event.relatedName.toLowerCase().includes(searchValue) ||
          event.assignedTo.toLowerCase().includes(searchValue) ||
          event.type.toLowerCase().includes(searchValue) ||
          event.channel.toLowerCase().includes(searchValue);

        const matchesType = filterType === "All" || event.type === filterType;
        const matchesStatus = filterStatus === "All" || status === filterStatus;

        return matchesSearch && matchesType && matchesStatus;
      })
      .sort(sortEventsByDateTime);
  }, [eventList, search, filterType, filterStatus]);

  const stats = useMemo(() => {
    const todayEvents = filteredEvents.filter((event) => event.date === getToday());
    const overdueEvents = filteredEvents.filter(
      (event) => getEventStatus(event) === "Overdue"
    );
    const meetings = filteredEvents.filter((event) => event.type === "Meeting");
    const followUps = filteredEvents.filter((event) => event.type === "Follow-up");

    return {
      total: filteredEvents.length,
      today: todayEvents.length,
      overdue: overdueEvents.length,
      meetings: meetings.length,
      followUps: followUps.length,
    };
  }, [filteredEvents]);

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const firstGridDate = new Date(firstDayOfMonth);
    firstGridDate.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay());

    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(firstGridDate);
      date.setDate(firstGridDate.getDate() + index);

      const dateString = toLocalDateString(date);

      return {
        date,
        dateString,
        day: date.getDate(),
        isCurrentMonth: date.getMonth() === month,
        isToday: dateString === getToday(),
        isSelected: dateString === selectedDate,
        events: filteredEvents.filter((event) => event.date === dateString),
      };
    });
  }, [currentMonth, filteredEvents, selectedDate]);

  const selectedDayEvents = useMemo(() => {
    return filteredEvents
      .filter((event) => event.date === selectedDate)
      .sort(sortEventsByDateTime);
  }, [filteredEvents, selectedDate]);

  const upcomingEvents = useMemo(() => {
    return filteredEvents
      .filter((event) => {
        const status = getEventStatus(event);
        return event.date >= getToday() && status !== "Completed" && status !== "Cancelled";
      })
      .slice(0, 8);
  }, [filteredEvents]);

  function goToPreviousMonth() {
    setCurrentMonth((previous) => {
      const next = new Date(previous);
      next.setMonth(previous.getMonth() - 1);
      return next;
    });
  }

  function goToNextMonth() {
    setCurrentMonth((previous) => {
      const next = new Date(previous);
      next.setMonth(previous.getMonth() + 1);
      return next;
    });
  }

  function goToToday() {
    const today = new Date();
    setCurrentMonth(today);
    setSelectedDate(getToday());
  }

  return (
    <div className="w-full max-w-full">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <PageTitle
          title="Calendar"
          subtitle="View follow-ups, tasks, meetings, payment due dates, project deadlines, and deal closing reminders"
        />

        <div className="flex flex-wrap gap-3">
          <button
            onClick={exportCsv}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            <Download className="h-4 w-4" />
            Export
          </button>

          <button
            onClick={() => setModal({ type: "add" })}
            className="flex shrink-0 items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            <Plus className="h-4 w-4" />
            Create Event
          </button>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Total Events"
          value={stats.total}
          subtitle="All calendar records"
          icon={<CalendarDays className="h-5 w-5" />}
          tone="info"
        />

        <StatCard
          title="Today"
          value={stats.today}
          subtitle="Scheduled for today"
          icon={<CalendarClock className="h-5 w-5" />}
          tone="warning"
        />

        <StatCard
          title="Overdue"
          value={stats.overdue}
          subtitle="Needs immediate action"
          icon={<AlertTriangle className="h-5 w-5" />}
          tone={stats.overdue > 0 ? "danger" : "success"}
        />

        <StatCard
          title="Meetings"
          value={stats.meetings}
          subtitle="Client and team meetings"
          icon={<UsersRound className="h-5 w-5" />}
          tone="info"
        />

        <StatCard
          title="Follow-ups"
          value={stats.followUps}
          subtitle="Client communication tasks"
          icon={<MessageCircle className="h-5 w-5" />}
          tone="success"
        />
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Search by title, client, assignee, type..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-slate-600"
          />
        </div>

        <select
          value={filterType}
          onChange={(event) => setFilterType(event.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
        >
          <option value="All">All Types</option>
          {EVENT_TYPES.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(event) => setFilterStatus(event.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
        >
          <option value="All">All Status</option>
          {["Scheduled", "Completed", "Overdue", "Cancelled"].map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>

        <button
          onClick={() => {
            setSearch("");
            setFilterType("All");
            setFilterStatus("All");
          }}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
        >
          <RefreshCcw className="h-4 w-4" />
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_390px]">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-slate-950 dark:text-white">
                {getMonthName(currentMonth)}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Monthly CRM schedule overview
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={goToPreviousMonth}
                className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                onClick={goToToday}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
              >
                Today
              </button>

              <button
                onClick={goToNextMonth}
                className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wide text-slate-500"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {calendarDays.map((day) => (
              <button
                key={day.dateString}
                onClick={() => setSelectedDate(day.dateString)}
                className={`min-h-[125px] border-b border-r border-slate-100 p-2 text-left transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900 ${
                  day.isSelected
                    ? "bg-blue-50 dark:bg-blue-950/30"
                    : day.isCurrentMonth
                    ? "bg-white dark:bg-slate-950"
                    : "bg-slate-50/70 text-slate-300 dark:bg-slate-900/40"
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                      day.isToday
                        ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                        : day.isSelected
                        ? "bg-blue-600 text-white"
                        : "text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {day.day}
                  </span>

                  {day.events.length > 0 && (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                      {day.events.length}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  {day.events.slice(0, 3).map((event) => {
                    const status = getEventStatus(event);

                    return (
                      <div
                        key={event.id}
                        className={`truncate rounded-lg px-2 py-1 text-[11px] font-semibold ${
                          status === "Overdue"
                            ? "bg-rose-100 text-rose-700"
                            : event.type === "Payment"
                            ? "bg-emerald-100 text-emerald-700"
                            : event.type === "Meeting"
                            ? "bg-purple-100 text-purple-700"
                            : event.type === "Task"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {formatTime(event.time)} {event.title}
                      </div>
                    );
                  })}

                  {day.events.length > 3 && (
                    <p className="px-1 text-[11px] font-semibold text-slate-400">
                      +{day.events.length - 3} more
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-950 dark:text-white">
                {formatDate(selectedDate)}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Selected day schedule
              </p>
            </div>

            <div className="space-y-3 p-5">
              {selectedDayEvents.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 py-8 text-center text-sm text-slate-400 dark:border-slate-800">
                  No events for selected date.
                </div>
              ) : (
                selectedDayEvents.map((event) => {
                  const status = getEventStatus(event);
                  const TypeIcon = getTypeIcon(event.type);

                  return (
                    <div
                      key={event.id}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-slate-700 dark:bg-slate-950 dark:text-slate-300">
                            <TypeIcon className="h-5 w-5" />
                          </div>

                          <div className="min-w-0">
                            <p className="font-bold text-slate-950 dark:text-white">
                              {event.title}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {formatTime(event.time)} • {event.assignedTo}
                            </p>
                          </div>
                        </div>

                        <StatusBadge status={status} />
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <TypeBadge type={event.type} />
                        <PriorityBadge priority={event.priority} />
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          onClick={() => setModal({ type: "view", event })}
                          className="rounded-lg border border-blue-200 bg-blue-50 p-2 text-blue-700 transition hover:bg-blue-100"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => setModal({ type: "edit", event })}
                          className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800"
                          title="Edit"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => handleComplete(event)}
                          disabled={status === "Completed"}
                          className="rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-40"
                          title="Complete"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => setModal({ type: "delete", event })}
                          className="rounded-lg border border-rose-200 bg-rose-50 p-2 text-rose-600 transition hover:bg-rose-100"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}

              <button
                onClick={() => setModal({ type: "add" })}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
              >
                <Plus className="h-4 w-4" />
                Add Event on This Date
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-950 dark:text-white">
                Upcoming Events
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Next important CRM actions
              </p>
            </div>

            <div className="space-y-3 p-5">
              {upcomingEvents.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 py-8 text-center text-sm text-slate-400 dark:border-slate-800">
                  No upcoming events.
                </div>
              ) : (
                upcomingEvents.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => {
                      setSelectedDate(event.date);
                      setModal({ type: "view", event });
                    }}
                    className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-left transition hover:bg-white hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-950"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-950 dark:text-white">
                        {event.title}
                      </p>
                      <p className="mt-1 truncate text-xs text-slate-500">
                        {formatDate(event.date)} • {formatTime(event.time)}
                      </p>
                    </div>

                    <TypeBadge type={event.type} />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {modal?.type === "add" && (
        <EventFormModal
          selectedDate={selectedDate}
          onSave={handleAdd}
          onClose={() => setModal(null)}
        />
      )}

      {modal?.type === "edit" && (
        <EventFormModal
          event={modal.event}
          selectedDate={selectedDate}
          onSave={handleEdit}
          onClose={() => setModal(null)}
        />
      )}

      {modal?.type === "view" && (
        <EventViewModal
          event={modal.event}
          onClose={() => setModal(null)}
          onEdit={(event) => setModal({ type: "edit", event })}
          onComplete={handleComplete}
        />
      )}

      {modal?.type === "delete" && (
        <ConfirmModal
          event={modal.event}
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

export default Calendar;