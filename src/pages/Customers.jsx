import { useMemo, useState } from "react";
import PageTitle from "../components/PageTitle";
import {
  AlertTriangle,
  BadgeDollarSign,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  CreditCard,
  Edit3,
  Eye,
  Mail,
  MessageCircle,
  Phone,
  Plus,
  Search,
  Tags,
  Trash2,
  UserRound,
  UsersRound,
  WalletCards,
  X,
} from "lucide-react";

import { customers as initialCustomers } from "../data/crmData";

const ITEMS_PER_PAGE = 6;
const CURRENCY = "PKR";

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  company: "",
  service: "",
  status: "Active",
  paymentStatus: "Pending",
  totalValue: "",
  paidAmount: "",
  source: "Direct",
  owner: "Admin",
  lastContact: "",
  nextFollowUp: "",
  tags: [],
  notes: "",
};

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatCurrency(value) {
  const amount = Number(value || 0);

  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: CURRENCY,
    maximumFractionDigits: 0,
  }).format(amount);
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

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function getTomorrow() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

function normalizeCustomer(customer, index) {
  return {
    id: customer.id ?? index + 1,
    name: customer.name ?? "",
    phone: customer.phone ?? "",
    email: customer.email ?? "",
    company: customer.company ?? "",
    service: customer.service ?? "",
    status: customer.status ?? "Active",
    paymentStatus: customer.paymentStatus ?? "Pending",
    totalValue: customer.totalValue ?? customer.amount ?? 0,
    paidAmount: customer.paidAmount ?? 0,
    source: customer.source ?? "Direct",
    owner: customer.owner ?? "Admin",
    lastContact: customer.lastContact ?? "",
    nextFollowUp: customer.nextFollowUp ?? "",
    tags: Array.isArray(customer.tags) ? customer.tags : [],
    notes: customer.notes ?? "",
    createdAt: customer.createdAt ?? getToday(),
  };
}

function StatusBadge({ status }) {
  const map = {
    Active: "bg-emerald-100 text-emerald-800 border-emerald-200",
    Inactive: "bg-slate-100 text-slate-600 border-slate-200",
    Onboarding: "bg-blue-100 text-blue-800 border-blue-200",
    "At Risk": "bg-rose-100 text-rose-800 border-rose-200",
    Completed: "bg-purple-100 text-purple-800 border-purple-200",
  };

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

function PaymentBadge({ status }) {
  const map = {
    Paid: "bg-emerald-100 text-emerald-800 border-emerald-200",
    Pending: "bg-amber-100 text-amber-800 border-amber-200",
    Partial: "bg-blue-100 text-blue-800 border-blue-200",
    Overdue: "bg-rose-100 text-rose-800 border-rose-200",
  };

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

function StatCard({ title, value, subtitle, icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {title}
          </p>
          <h3 className="mt-2 text-2xl font-bold text-slate-950">{value}</h3>
          <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
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

function ConfirmModal({ customer, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/50 px-4">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
            <AlertTriangle className="h-6 w-6" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-950">
              Delete Customer?
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Are you sure you want to delete <strong>{customer.name}</strong>?
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-rose-600 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
          >
            Delete Customer
          </button>
        </div>
      </div>
    </div>
  );
}

function CustomerModal({ customer, onClose, onEdit, onMarkPaid, onContacted }) {
  const balance = Number(customer.totalValue || 0) - Number(customer.paidAmount || 0);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/50 px-4">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="mb-7 flex items-start justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950 text-xl font-bold text-white">
              {getInitials(customer.name)}
            </div>

            <div>
              <h3 className="text-2xl font-bold text-slate-950">
                {customer.name}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {customer.company || "No company added"}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <StatusBadge status={customer.status} />
                <PaymentBadge status={customer.paymentStatus} />
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 p-2 text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"
            aria-label="Close customer profile"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-950">
              <UserRound className="h-4 w-4" />
              Contact Details
            </div>

            <div className="space-y-3 text-sm">
              <p className="flex items-center gap-2 text-slate-600">
                <Phone className="h-4 w-4 text-slate-400" />
                {customer.phone || "N/A"}
              </p>

              <p className="flex items-center gap-2 text-slate-600">
                <Mail className="h-4 w-4 text-slate-400" />
                {customer.email || "N/A"}
              </p>

              <p className="flex items-center gap-2 text-slate-600">
                <Building2 className="h-4 w-4 text-slate-400" />
                {customer.company || "N/A"}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-950">
              <BriefcaseBusiness className="h-4 w-4" />
              Business Details
            </div>

            <div className="space-y-3 text-sm">
              <p className="flex justify-between gap-3">
                <span className="text-slate-500">Service</span>
                <span className="font-semibold text-slate-800">
                  {customer.service || "N/A"}
                </span>
              </p>

              <p className="flex justify-between gap-3">
                <span className="text-slate-500">Source</span>
                <span className="font-semibold text-slate-800">
                  {customer.source || "N/A"}
                </span>
              </p>

              <p className="flex justify-between gap-3">
                <span className="text-slate-500">Owner</span>
                <span className="font-semibold text-slate-800">
                  {customer.owner || "N/A"}
                </span>
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-950">
              <WalletCards className="h-4 w-4" />
              Payment Summary
            </div>

            <div className="space-y-3 text-sm">
              <p className="flex justify-between gap-3">
                <span className="text-slate-500">Total Value</span>
                <span className="font-semibold text-slate-800">
                  {formatCurrency(customer.totalValue)}
                </span>
              </p>

              <p className="flex justify-between gap-3">
                <span className="text-slate-500">Paid Amount</span>
                <span className="font-semibold text-emerald-700">
                  {formatCurrency(customer.paidAmount)}
                </span>
              </p>

              <p className="flex justify-between gap-3">
                <span className="text-slate-500">Balance</span>
                <span className="font-semibold text-rose-700">
                  {formatCurrency(balance)}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-950">
              <CalendarClock className="h-4 w-4" />
              Timeline
            </div>

            <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-400">Created</p>
                <p className="mt-1 font-semibold text-slate-800">
                  {formatDate(customer.createdAt)}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-400">
                  Last Contact
                </p>
                <p className="mt-1 font-semibold text-slate-800">
                  {formatDate(customer.lastContact)}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-400">
                  Next Follow-up
                </p>
                <p className="mt-1 font-semibold text-slate-800">
                  {formatDate(customer.nextFollowUp)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-950">
              <Tags className="h-4 w-4" />
              Tags
            </div>

            {customer.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {customer.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">No tags added.</p>
            )}
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-950">
            <ClipboardList className="h-4 w-4" />
            Notes
          </div>

          <p className="text-sm leading-6 text-slate-600">
            {customer.notes || "No notes added for this customer."}
          </p>
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => onEdit(customer)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <Edit3 className="h-4 w-4" />
            Edit Customer
          </button>

          <button
            onClick={() => onContacted(customer)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
          >
            <MessageCircle className="h-4 w-4" />
            Mark Contacted
          </button>

          <button
            onClick={() => onMarkPaid(customer)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-950 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <CheckCircle2 className="h-4 w-4" />
            Mark Paid
          </button>
        </div>
      </div>
    </div>
  );
}

function CustomerFormModal({ customer, onSave, onClose }) {
  const [form, setForm] = useState(customer ?? emptyForm);
  const [tagsInput, setTagsInput] = useState((customer?.tags ?? []).join(", "));

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.name.trim() || !form.phone.trim() || !form.service.trim()) {
      return;
    }

    const cleanedTags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    onSave({
      ...form,
      totalValue: Number(form.totalValue || 0),
      paidAmount: Number(form.paidAmount || 0),
      tags: cleanedTags,
    });
  }

  const fieldClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white";

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/50 px-4">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="mb-7 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-slate-950">
              {customer ? "Edit Customer" : "Add New Customer"}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Manage customer profile, payments, service details, and follow-up
              information.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 p-2 text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h4 className="mb-3 text-sm font-bold text-slate-950">
              Contact Information
            </h4>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Name *
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ali Khan"
                  className={fieldClass}
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Phone *
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="0300-1234567"
                  className={fieldClass}
                  required
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
            <h4 className="mb-3 text-sm font-bold text-slate-950">
              Service Information
            </h4>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Service *
                </label>
                <input
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                  placeholder="Website Design"
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
                  {["Active", "Onboarding", "Completed", "At Risk", "Inactive"].map(
                    (status) => (
                      <option key={status}>{status}</option>
                    )
                  )}
                </select>
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
                  {[
                    "Direct",
                    "Facebook",
                    "WhatsApp",
                    "Google",
                    "Referral",
                    "Website",
                  ].map((source) => (
                    <option key={source}>{source}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-bold text-slate-950">
              Payment Information
            </h4>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Payment Status
                </label>
                <select
                  name="paymentStatus"
                  value={form.paymentStatus}
                  onChange={handleChange}
                  className={fieldClass}
                >
                  {["Pending", "Partial", "Paid", "Overdue"].map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Total Value
                </label>
                <input
                  type="number"
                  name="totalValue"
                  value={form.totalValue}
                  onChange={handleChange}
                  placeholder="50000"
                  className={fieldClass}
                  min="0"
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
                  placeholder="25000"
                  className={fieldClass}
                  min="0"
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-bold text-slate-950">
              Follow-up Information
            </h4>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Last Contact
                </label>
                <input
                  type="date"
                  name="lastContact"
                  value={form.lastContact}
                  onChange={handleChange}
                  className={fieldClass}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Next Follow-up
                </label>
                <input
                  type="date"
                  name="nextFollowUp"
                  value={form.nextFollowUp}
                  onChange={handleChange}
                  className={fieldClass}
                />
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
            <h4 className="mb-3 text-sm font-bold text-slate-950">
              Notes and Tags
            </h4>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Tags
                </label>
                <input
                  value={tagsInput}
                  onChange={(event) => setTagsInput(event.target.value)}
                  placeholder="VIP, Monthly Client, Website"
                  className={fieldClass}
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
                  placeholder="Add customer notes..."
                  className={`${fieldClass} min-h-[110px] resize-none`}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-950 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              {customer ? (
                <>
                  <Edit3 className="h-4 w-4" />
                  Save Changes
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add Customer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Customers() {
  const [customerList, setCustomerList] = useState(() =>
    initialCustomers.map((customer, index) => normalizeCustomer(customer, index))
  );

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPayment, setFilterPayment] = useState("All");
  const [sortBy, setSortBy] = useState("latest");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  function handleAdd(form) {
    const newCustomer = {
      ...form,
      id: Date.now(),
      createdAt: getToday(),
      lastContact: form.lastContact || getToday(),
      nextFollowUp: form.nextFollowUp || getTomorrow(),
    };

    setCustomerList((previous) => [newCustomer, ...previous]);
    setModal(null);
    showToast("Customer added successfully.");
  }

  function handleEdit(form) {
    setCustomerList((previous) =>
      previous.map((customer) =>
        customer.id === modal.customer.id
          ? {
              ...modal.customer,
              ...form,
            }
          : customer
      )
    );

    setModal(null);
    showToast("Customer updated successfully.");
  }

  function handleDelete() {
    setCustomerList((previous) =>
      previous.filter((customer) => customer.id !== modal.customer.id)
    );

    setModal(null);
    showToast("Customer deleted successfully.", "error");
  }

  function handleMarkPaid(customer) {
    setCustomerList((previous) =>
      previous.map((item) =>
        item.id === customer.id
          ? {
              ...item,
              paymentStatus: "Paid",
              paidAmount: Number(item.totalValue || 0),
            }
          : item
      )
    );

    setModal(null);
    showToast("Payment marked as paid.", "success");
  }

  function handleContacted(customer) {
    setCustomerList((previous) =>
      previous.map((item) =>
        item.id === customer.id
          ? {
              ...item,
              lastContact: getToday(),
              nextFollowUp: item.nextFollowUp || getTomorrow(),
            }
          : item
      )
    );

    showToast("Customer contact date updated.", "info");
  }

  const stats = useMemo(() => {
    const totalCustomers = customerList.length;
    const activeCustomers = customerList.filter(
      (customer) => customer.status === "Active"
    ).length;

    const totalRevenue = customerList.reduce(
      (sum, customer) => sum + Number(customer.totalValue || 0),
      0
    );

    const totalPaid = customerList.reduce(
      (sum, customer) => sum + Number(customer.paidAmount || 0),
      0
    );

    const receivable = totalRevenue - totalPaid;

    return {
      totalCustomers,
      activeCustomers,
      totalRevenue,
      receivable,
    };
  }, [customerList]);

  const filteredCustomers = useMemo(() => {
    const searchValue = search.toLowerCase();

    return customerList
      .filter((customer) => {
        const matchSearch =
          customer.name.toLowerCase().includes(searchValue) ||
          customer.phone.includes(search) ||
          customer.email.toLowerCase().includes(searchValue) ||
          customer.company.toLowerCase().includes(searchValue) ||
          customer.service.toLowerCase().includes(searchValue);

        const matchStatus =
          filterStatus === "All" || customer.status === filterStatus;

        const matchPayment =
          filterPayment === "All" ||
          customer.paymentStatus === filterPayment;

        return matchSearch && matchStatus && matchPayment;
      })
      .sort((a, b) => {
        if (sortBy === "highestValue") {
          return Number(b.totalValue || 0) - Number(a.totalValue || 0);
        }

        if (sortBy === "followUp") {
          return new Date(a.nextFollowUp || "9999-12-31") - new Date(b.nextFollowUp || "9999-12-31");
        }

        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
  }, [customerList, search, filterStatus, filterPayment, sortBy]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE)
  );

  const currentPage = Math.min(page, totalPages);

  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="w-full max-w-full">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <PageTitle
          title="Customers"
          subtitle="Manage confirmed clients, payments, services, and follow-ups"
        />

        <button
          onClick={() => setModal({ type: "add" })}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" />
          Add New Customer
        </button>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          subtitle="All confirmed clients"
          icon={<UsersRound className="h-5 w-5" />}
        />

        <StatCard
          title="Active Customers"
          value={stats.activeCustomers}
          subtitle="Currently active clients"
          icon={<CheckCircle2 className="h-5 w-5" />}
        />

        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          subtitle="Total customer value"
          icon={<BadgeDollarSign className="h-5 w-5" />}
        />

        <StatCard
          title="Receivable"
          value={formatCurrency(stats.receivable)}
          subtitle="Remaining payment balance"
          icon={<CreditCard className="h-5 w-5" />}
        />
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Search by name, phone, service, company..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none focus:border-slate-400"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(event) => {
            setFilterStatus(event.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-400"
        >
          <option value="All">All Status</option>
          {["Active", "Onboarding", "Completed", "At Risk", "Inactive"].map(
            (status) => (
              <option key={status}>{status}</option>
            )
          )}
        </select>

        <select
          value={filterPayment}
          onChange={(event) => {
            setFilterPayment(event.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-400"
        >
          <option value="All">All Payments</option>
          {["Pending", "Partial", "Paid", "Overdue"].map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(event) => {
            setSortBy(event.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-400"
        >
          <option value="latest">Latest Customers</option>
          <option value="highestValue">Highest Value</option>
          <option value="followUp">Nearest Follow-up</option>
        </select>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <h3 className="text-base font-bold text-slate-950">
            Customer List
          </h3>

          <p className="text-xs font-medium text-slate-400">
            Showing {paginatedCustomers.length} of {filteredCustomers.length}
          </p>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-4 py-3 font-semibold text-slate-500">
                  Customer
                </th>
                <th className="px-4 py-3 font-semibold text-slate-500">
                  Contact
                </th>
                <th className="px-4 py-3 font-semibold text-slate-500">
                  Service
                </th>
                <th className="px-4 py-3 font-semibold text-slate-500">
                  Value
                </th>
                <th className="px-4 py-3 font-semibold text-slate-500">
                  Payment
                </th>
                <th className="px-4 py-3 font-semibold text-slate-500">
                  Status
                </th>
                <th className="px-4 py-3 font-semibold text-slate-500">
                  Next Follow-up
                </th>
                <th className="px-4 py-3 font-semibold text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedCustomers.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-slate-400"
                  >
                    No customers found.
                  </td>
                </tr>
              ) : (
                paginatedCustomers.map((customer) => {
                  const balance =
                    Number(customer.totalValue || 0) -
                    Number(customer.paidAmount || 0);

                  return (
                    <tr
                      key={customer.id}
                      className="border-b border-slate-100 transition hover:bg-slate-50"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white">
                            {getInitials(customer.name)}
                          </div>

                          <div>
                            <p className="font-semibold text-slate-900">
                              {customer.name}
                            </p>
                            <p className="text-xs text-slate-400">
                              {customer.company || "No company"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <p className="text-slate-700">{customer.phone}</p>
                        <p className="text-xs text-slate-400">
                          {customer.email || "No email"}
                        </p>
                      </td>

                      <td className="px-4 py-3 text-slate-700">
                        {customer.service}
                      </td>

                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-900">
                          {formatCurrency(customer.totalValue)}
                        </p>
                        <p className="text-xs text-slate-400">
                          Balance: {formatCurrency(balance)}
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <PaymentBadge status={customer.paymentStatus} />
                      </td>

                      <td className="px-4 py-3">
                        <StatusBadge status={customer.status} />
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {formatDate(customer.nextFollowUp)}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              setModal({ type: "view", customer })
                            }
                            title="View"
                            className="rounded-lg border border-blue-200 bg-blue-50 p-2 text-blue-700 transition hover:bg-blue-100"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() =>
                              setModal({ type: "edit", customer })
                            }
                            title="Edit"
                            className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-600 transition hover:bg-slate-100"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => handleContacted(customer)}
                            title="Mark Contacted"
                            className="rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-emerald-700 transition hover:bg-emerald-100"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() =>
                              setModal({ type: "delete", customer })
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

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-3">
          <p className="text-xs text-slate-400">
            Page {currentPage} of {totalPages}
          </p>

          <div className="flex gap-1">
            <button
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
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
                      ? "border-slate-950 bg-slate-950 text-white"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
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
              className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
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
          View profile
        </span>

        <span className="flex items-center gap-1">
          <Edit3 className="h-3.5 w-3.5" />
          Edit customer
        </span>

        <span className="flex items-center gap-1">
          <MessageCircle className="h-3.5 w-3.5" />
          Mark contacted
        </span>

        <span className="flex items-center gap-1">
          <Trash2 className="h-3.5 w-3.5" />
          Delete customer
        </span>
      </div>

      {modal?.type === "add" && (
        <CustomerFormModal
          onSave={handleAdd}
          onClose={() => setModal(null)}
        />
      )}

      {modal?.type === "edit" && (
        <CustomerFormModal
          customer={modal.customer}
          onSave={handleEdit}
          onClose={() => setModal(null)}
        />
      )}

      {modal?.type === "view" && (
        <CustomerModal
          customer={modal.customer}
          onClose={() => setModal(null)}
          onEdit={(customer) => setModal({ type: "edit", customer })}
          onMarkPaid={handleMarkPaid}
          onContacted={handleContacted}
        />
      )}

      {modal?.type === "delete" && (
        <ConfirmModal
          customer={modal.customer}
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

export default Customers;