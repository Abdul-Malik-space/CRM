import { useMemo, useState } from "react";
import PageTitle from "../components/PageTitle";
import {
  AlertTriangle,
  BadgeDollarSign,
  CalendarClock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Download,
  Edit3,
  Eye,
  FileText,
  Mail,
  MessageCircle,
  Phone,
  Plus,
  ReceiptText,
  RefreshCcw,
  Search,
  Send,
  Trash2,
  WalletCards,
  X,
} from "lucide-react";

import { customers as initialCustomers, deals as initialDeals } from "../data/crmData";

const CURRENCY = "PKR";
const ITEMS_PER_PAGE = 7;

const emptyForm = {
  invoiceNo: "",
  customer: "",
  company: "",
  phone: "",
  email: "",
  service: "",
  issueDate: "",
  dueDate: "",
  totalAmount: "",
  paidAmount: "",
  paymentMethod: "Bank Transfer",
  status: "Pending",
  notes: "",
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

function getInvoiceStatus(invoice) {
  const total = Number(invoice.totalAmount || 0);
  const paid = Number(invoice.paidAmount || 0);
  const balance = Math.max(0, total - paid);

  if (paid >= total && total > 0) return "Paid";
  if (paid > 0 && balance > 0) return "Partial";
  if (invoice.dueDate && new Date(invoice.dueDate) < new Date(getToday())) {
    return "Overdue";
  }

  return invoice.status || "Pending";
}

function normalizeInvoice(invoice, index) {
  const totalAmount = parseAmount(invoice.totalAmount ?? invoice.amount ?? invoice.totalValue ?? 0);
  const paidAmount = parseAmount(invoice.paidAmount ?? 0);

  return {
    id: invoice.id ?? index + 1,
    invoiceNo: invoice.invoiceNo ?? `INV-${String(index + 1).padStart(4, "0")}`,
    customer: invoice.customer ?? invoice.name ?? invoice.client ?? "Unknown Customer",
    company: invoice.company ?? "",
    phone: invoice.phone ?? "",
    email: invoice.email ?? "",
    service: invoice.service ?? invoice.title ?? "CRM Service",
    issueDate: invoice.issueDate ?? invoice.createdAt ?? getToday(),
    dueDate: invoice.dueDate ?? getFutureDate(7 + index),
    totalAmount,
    paidAmount,
    paymentMethod: invoice.paymentMethod ?? "Bank Transfer",
    status: invoice.status ?? "Pending",
    notes: invoice.notes ?? "",
    createdAt: invoice.createdAt ?? getToday(),
    paymentHistory:
      invoice.paymentHistory ??
      (paidAmount > 0
        ? [
            {
              id: 1,
              amount: paidAmount,
              method: invoice.paymentMethod ?? "Bank Transfer",
              date: invoice.createdAt ?? getToday(),
              note: "Opening payment record",
            },
          ]
        : []),
  };
}

function buildInitialInvoices() {
  const customerInvoices = initialCustomers.map((customer, index) => {
    const totalAmount = parseAmount(customer.totalValue ?? customer.amount ?? 0);
    const paidAmount = parseAmount(customer.paidAmount ?? 0);

    return normalizeInvoice(
      {
        invoiceNo: `INV-CUS-${String(index + 1).padStart(4, "0")}`,
        customer: customer.name,
        company: customer.company,
        phone: customer.phone,
        email: customer.email,
        service: customer.service,
        totalAmount: totalAmount || 45000 + index * 12000,
        paidAmount,
        paymentMethod: customer.paymentMethod,
        status: customer.paymentStatus ?? "Pending",
        createdAt: customer.createdAt,
      },
      index
    );
  });

  if (customerInvoices.length > 0) return customerInvoices;

  return initialDeals.slice(0, 5).map((deal, index) =>
    normalizeInvoice(
      {
        invoiceNo: `INV-DEAL-${String(index + 1).padStart(4, "0")}`,
        customer: deal.client,
        company: deal.company,
        phone: deal.phone,
        email: deal.email,
        service: deal.title,
        totalAmount: parseAmount(deal.amount) || 60000 + index * 15000,
        paidAmount: deal.stage === "Won" ? parseAmount(deal.amount) : 0,
        status: deal.stage === "Won" ? "Paid" : "Pending",
        createdAt: deal.createdAt,
      },
      index
    )
  );
}

function StatusBadge({ status }) {
  const map = {
    Paid: "border-emerald-200 bg-emerald-50 text-emerald-700",
    Partial: "border-blue-200 bg-blue-50 text-blue-700",
    Pending: "border-amber-200 bg-amber-50 text-amber-700",
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

function ConfirmModal({ invoice, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/50 px-4">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
            <AlertTriangle className="h-6 w-6" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-950 dark:text-white">
              Delete Invoice?
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Are you sure you want to delete invoice{" "}
              <strong>{invoice.invoiceNo}</strong>? This action cannot be
              undone.
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
            Delete Invoice
          </button>
        </div>
      </div>
    </div>
  );
}

function PaymentModal({ invoice, onSave, onClose }) {
  const balance = Math.max(0, Number(invoice.totalAmount || 0) - Number(invoice.paidAmount || 0));

  const [form, setForm] = useState({
    amount: balance,
    method: invoice.paymentMethod || "Bank Transfer",
    date: getToday(),
    note: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.amount || Number(form.amount) <= 0) return;

    onSave(invoice, {
      ...form,
      amount: Number(form.amount),
    });
  }

  const fieldClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-950";

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/50 px-4">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-7 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-slate-950 dark:text-white">
              Record Payment
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Add a payment against invoice {invoice.invoiceNo}.
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

        <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Total
            </p>
            <p className="mt-1 text-lg font-bold text-slate-950 dark:text-white">
              {formatCurrency(invoice.totalAmount)}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
              Paid
            </p>
            <p className="mt-1 text-lg font-bold text-emerald-800">
              {formatCurrency(invoice.paidAmount)}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-amber-700">
              Balance
            </p>
            <p className="mt-1 text-lg font-bold text-amber-800">
              {formatCurrency(balance)}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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
                min="1"
                max={balance}
                className={fieldClass}
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Method
              </label>
              <select
                name="method"
                value={form.method}
                onChange={handleChange}
                className={fieldClass}
              >
                {["Cash", "Bank Transfer", "JazzCash", "EasyPaisa", "Card", "Cheque"].map(
                  (method) => (
                    <option key={method}>{method}</option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Payment Date
              </label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className={fieldClass}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Payment Note
            </label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              placeholder="Transaction ID, payment reference, or internal note..."
              className={`${fieldClass} min-h-[110px] resize-none`}
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
              <WalletCards className="h-4 w-4" />
              Save Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function InvoiceViewModal({ invoice, onClose, onEdit, onRecordPayment, onSendReminder }) {
  const status = getInvoiceStatus(invoice);
  const balance = Math.max(0, Number(invoice.totalAmount || 0) - Number(invoice.paidAmount || 0));
  const collectionPercent =
    Number(invoice.totalAmount || 0) > 0
      ? Math.min(100, (Number(invoice.paidAmount || 0) / Number(invoice.totalAmount || 0)) * 100)
      : 0;

  const phoneNumber = String(invoice.phone || "").replace(/[^\d]/g, "");

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/50 px-4">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-7 flex items-start justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
              <ReceiptText className="h-7 w-7" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-slate-950 dark:text-white">
                {invoice.invoiceNo}
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {invoice.customer} {invoice.company ? `• ${invoice.company}` : ""}
              </p>

              <div className="mt-3">
                <StatusBadge status={status} />
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 p-2 text-slate-400 transition hover:bg-slate-50 hover:text-slate-700 dark:border-slate-800 dark:hover:bg-slate-900 dark:hover:text-slate-200"
            aria-label="Close invoice profile"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Total Amount
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
              {formatCurrency(invoice.totalAmount)}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
              Paid Amount
            </p>
            <p className="mt-2 text-2xl font-bold text-emerald-800">
              {formatCurrency(invoice.paidAmount)}
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
              Collection
            </p>
            <p className="mt-2 text-2xl font-bold text-blue-800">
              {collectionPercent.toFixed(0)}%
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              Payment Progress
            </span>
            <span className="font-bold text-slate-950 dark:text-white">
              {collectionPercent.toFixed(0)}%
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-slate-950 transition-all dark:bg-white"
              style={{ width: `${collectionPercent}%` }}
            />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-950 dark:text-white">
              <FileText className="h-4 w-4" />
              Invoice Details
            </div>

            <div className="space-y-3 text-sm">
              <p className="flex justify-between gap-3">
                <span className="text-slate-500">Service</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {invoice.service}
                </span>
              </p>

              <p className="flex justify-between gap-3">
                <span className="text-slate-500">Issue Date</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {formatDate(invoice.issueDate)}
                </span>
              </p>

              <p className="flex justify-between gap-3">
                <span className="text-slate-500">Due Date</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {formatDate(invoice.dueDate)}
                </span>
              </p>

              <p className="flex justify-between gap-3">
                <span className="text-slate-500">Method</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {invoice.paymentMethod}
                </span>
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-950 dark:text-white">
              <Phone className="h-4 w-4" />
              Customer Contact
            </div>

            <div className="space-y-3 text-sm">
              <p className="text-slate-600 dark:text-slate-300">
                {invoice.customer}
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                {invoice.phone || "No phone added"}
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                {invoice.email || "No email added"}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-950 dark:text-white">
              <WalletCards className="h-4 w-4" />
              Payment History
            </div>

            {invoice.paymentHistory.length === 0 ? (
              <p className="text-sm text-slate-400">No payment recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {invoice.paymentHistory.map((payment) => (
                  <div
                    key={payment.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {formatCurrency(payment.amount)}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {payment.method} • {formatDate(payment.date)}
                    </p>
                    {payment.note && (
                      <p className="mt-1 text-xs text-slate-500">{payment.note}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {invoice.notes && (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-bold text-slate-950 dark:text-white">
              Notes
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              {invoice.notes}
            </p>
          </div>
        )}

        <div className="mt-7 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
          <button
            onClick={() => onEdit(invoice)}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            <Edit3 className="h-4 w-4" />
            Edit
          </button>

          <button
            onClick={() => onRecordPayment(invoice)}
            disabled={balance <= 0}
            className="flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <WalletCards className="h-4 w-4" />
            Payment
          </button>

          <button
            onClick={() => onSendReminder(invoice)}
            disabled={balance <= 0}
            className="flex items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 py-3 text-sm font-semibold text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
            Reminder
          </button>

          {phoneNumber && (
            <a
              href={`https://wa.me/${phoneNumber}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          )}

          {invoice.email && (
            <a
              href={`mailto:${invoice.email}`}
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

function InvoiceFormModal({ invoice, onSave, onClose }) {
  const [form, setForm] = useState(() => ({
    ...(invoice ?? emptyForm),
    invoiceNo: invoice?.invoiceNo || `INV-${Date.now().toString().slice(-6)}`,
    issueDate: invoice?.issueDate || getToday(),
    dueDate: invoice?.dueDate || getFutureDate(7),
  }));

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => {
      const updated = { ...previous, [name]: value };

      const total = Number(updated.totalAmount || 0);
      const paid = Number(updated.paidAmount || 0);

      if (name === "totalAmount" || name === "paidAmount") {
        if (paid >= total && total > 0) updated.status = "Paid";
        else if (paid > 0) updated.status = "Partial";
        else updated.status = "Pending";
      }

      return updated;
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.invoiceNo.trim() || !form.customer.trim() || !form.totalAmount) {
      return;
    }

    onSave({
      ...form,
      totalAmount: Number(form.totalAmount || 0),
      paidAmount: Number(form.paidAmount || 0),
      paymentHistory: invoice?.paymentHistory || [],
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
              {invoice ? "Edit Invoice" : "Create New Invoice"}
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage customer invoice, amount, payment status, due date, and
              reminder details.
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
              Invoice Information
            </h4>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Invoice No *
                </label>
                <input
                  name="invoiceNo"
                  value={form.invoiceNo}
                  onChange={handleChange}
                  className={fieldClass}
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Issue Date
                </label>
                <input
                  type="date"
                  name="issueDate"
                  value={form.issueDate}
                  onChange={handleChange}
                  className={fieldClass}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Due Date
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleChange}
                  className={fieldClass}
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
                  {["Pending", "Partial", "Paid", "Overdue", "Cancelled"].map(
                    (status) => (
                      <option key={status}>{status}</option>
                    )
                  )}
                </select>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-bold text-slate-950 dark:text-white">
              Customer Details
            </h4>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Customer *
                </label>
                <input
                  name="customer"
                  value={form.customer}
                  onChange={handleChange}
                  placeholder="Customer name"
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
                  placeholder="customer@example.com"
                  className={fieldClass}
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-bold text-slate-950 dark:text-white">
              Payment Details
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
                  Total Amount *
                </label>
                <input
                  type="number"
                  name="totalAmount"
                  value={form.totalAmount}
                  onChange={handleChange}
                  placeholder="50000"
                  min="0"
                  className={fieldClass}
                  required
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
                  placeholder="10000"
                  min="0"
                  className={fieldClass}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Payment Method
                </label>
                <select
                  name="paymentMethod"
                  value={form.paymentMethod}
                  onChange={handleChange}
                  className={fieldClass}
                >
                  {["Cash", "Bank Transfer", "JazzCash", "EasyPaisa", "Card", "Cheque"].map(
                    (method) => (
                      <option key={method}>{method}</option>
                    )
                  )}
                </select>
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
              placeholder="Invoice notes, payment terms, transaction instructions..."
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
              {invoice ? (
                <>
                  <Edit3 className="h-4 w-4" />
                  Save Changes
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Create Invoice
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Payments() {
  const [invoiceList, setInvoiceList] = useState(() => buildInitialInvoices());
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState("dueDate");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  function handleAdd(form) {
    const newInvoice = {
      ...form,
      id: Date.now(),
      createdAt: getToday(),
      paymentHistory:
        Number(form.paidAmount || 0) > 0
          ? [
              {
                id: Date.now(),
                amount: Number(form.paidAmount || 0),
                method: form.paymentMethod,
                date: form.issueDate || getToday(),
                note: "Initial payment",
              },
            ]
          : [],
    };

    setInvoiceList((previous) => [newInvoice, ...previous]);
    setModal(null);
    showToast("Invoice created successfully.");
  }

  function handleEdit(form) {
    setInvoiceList((previous) =>
      previous.map((invoice) =>
        invoice.id === modal.invoice.id
          ? {
              ...modal.invoice,
              ...form,
              totalAmount: Number(form.totalAmount || 0),
              paidAmount: Number(form.paidAmount || 0),
            }
          : invoice
      )
    );

    setModal(null);
    showToast("Invoice updated successfully.");
  }

  function handleDelete() {
    setInvoiceList((previous) =>
      previous.filter((invoice) => invoice.id !== modal.invoice.id)
    );

    setModal(null);
    showToast("Invoice deleted successfully.", "error");
  }

  function handleRecordPayment(invoice, payment) {
    setInvoiceList((previous) =>
      previous.map((item) => {
        if (item.id !== invoice.id) return item;

        const paidAmount = Math.min(
          Number(item.totalAmount || 0),
          Number(item.paidAmount || 0) + Number(payment.amount || 0)
        );

        const updatedInvoice = {
          ...item,
          paidAmount,
          paymentMethod: payment.method,
          paymentHistory: [
            {
              id: Date.now(),
              amount: Number(payment.amount || 0),
              method: payment.method,
              date: payment.date,
              note: payment.note,
            },
            ...item.paymentHistory,
          ],
        };

        return {
          ...updatedInvoice,
          status: getInvoiceStatus(updatedInvoice),
        };
      })
    );

    setModal(null);
    showToast("Payment recorded successfully.");
  }

  function handleMarkPaid(invoice) {
    setInvoiceList((previous) =>
      previous.map((item) => {
        if (item.id !== invoice.id) return item;

        const balance = Math.max(
          0,
          Number(item.totalAmount || 0) - Number(item.paidAmount || 0)
        );

        return {
          ...item,
          paidAmount: Number(item.totalAmount || 0),
          status: "Paid",
          paymentHistory:
            balance > 0
              ? [
                  {
                    id: Date.now(),
                    amount: balance,
                    method: item.paymentMethod,
                    date: getToday(),
                    note: "Marked as paid",
                  },
                  ...item.paymentHistory,
                ]
              : item.paymentHistory,
        };
      })
    );

    showToast("Invoice marked as paid.");
  }

  function handleSendReminder(invoice) {
    showToast(`Payment reminder prepared for ${invoice.customer}.`, "info");
  }

  function exportCsv() {
    const rows = [
      [
        "Invoice No",
        "Customer",
        "Service",
        "Issue Date",
        "Due Date",
        "Total",
        "Paid",
        "Balance",
        "Status",
      ],
      ...invoiceList.map((invoice) => {
        const status = getInvoiceStatus(invoice);
        const balance = Math.max(
          0,
          Number(invoice.totalAmount || 0) - Number(invoice.paidAmount || 0)
        );

        return [
          invoice.invoiceNo,
          invoice.customer,
          invoice.service,
          invoice.issueDate,
          invoice.dueDate,
          invoice.totalAmount,
          invoice.paidAmount,
          balance,
          status,
        ];
      }),
    ];

    const csv = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "crm-payments.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  const stats = useMemo(() => {
    const totalInvoices = invoiceList.length;

    const totalAmount = invoiceList.reduce(
      (sum, invoice) => sum + Number(invoice.totalAmount || 0),
      0
    );

    const paidAmount = invoiceList.reduce(
      (sum, invoice) => sum + Number(invoice.paidAmount || 0),
      0
    );

    const pendingAmount = invoiceList.reduce((sum, invoice) => {
      return (
        sum +
        Math.max(0, Number(invoice.totalAmount || 0) - Number(invoice.paidAmount || 0))
      );
    }, 0);

    const overdueInvoices = invoiceList.filter(
      (invoice) => getInvoiceStatus(invoice) === "Overdue"
    ).length;

    return {
      totalInvoices,
      totalAmount,
      paidAmount,
      pendingAmount,
      overdueInvoices,
    };
  }, [invoiceList]);

  const filteredInvoices = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return invoiceList
      .filter((invoice) => {
        const status = getInvoiceStatus(invoice);

        const matchesSearch =
          !searchValue ||
          invoice.invoiceNo.toLowerCase().includes(searchValue) ||
          invoice.customer.toLowerCase().includes(searchValue) ||
          invoice.company.toLowerCase().includes(searchValue) ||
          invoice.service.toLowerCase().includes(searchValue) ||
          invoice.phone.toLowerCase().includes(searchValue) ||
          invoice.email.toLowerCase().includes(searchValue);

        const matchesStatus = filterStatus === "All" || status === filterStatus;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "highestAmount") {
          return Number(b.totalAmount || 0) - Number(a.totalAmount || 0);
        }

        if (sortBy === "pendingAmount") {
          const balanceA = Number(a.totalAmount || 0) - Number(a.paidAmount || 0);
          const balanceB = Number(b.totalAmount || 0) - Number(b.paidAmount || 0);

          return balanceB - balanceA;
        }

        if (sortBy === "latest") {
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }

        return new Date(a.dueDate || "9999-12-31") - new Date(b.dueDate || "9999-12-31");
      });
  }, [invoiceList, search, filterStatus, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);

  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="w-full max-w-full">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <PageTitle
          title="Payments"
          subtitle="Manage invoices, received payments, pending dues, due dates, and reminders"
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
            Create Invoice
          </button>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Total Invoices"
          value={stats.totalInvoices}
          subtitle="All invoice records"
          icon={<ReceiptText className="h-5 w-5" />}
          tone="info"
        />

        <StatCard
          title="Total Billing"
          value={formatCurrency(stats.totalAmount)}
          subtitle="Total invoice value"
          icon={<BadgeDollarSign className="h-5 w-5" />}
        />

        <StatCard
          title="Received"
          value={formatCurrency(stats.paidAmount)}
          subtitle="Collected amount"
          icon={<CheckCircle2 className="h-5 w-5" />}
          tone="success"
        />

        <StatCard
          title="Pending"
          value={formatCurrency(stats.pendingAmount)}
          subtitle="Receivable balance"
          icon={<WalletCards className="h-5 w-5" />}
          tone={stats.pendingAmount > 0 ? "warning" : "success"}
        />

        <StatCard
          title="Overdue"
          value={stats.overdueInvoices}
          subtitle="Needs follow-up"
          icon={<AlertTriangle className="h-5 w-5" />}
          tone={stats.overdueInvoices > 0 ? "danger" : "success"}
        />
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Search by invoice, customer, service, phone..."
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
          {["Pending", "Partial", "Paid", "Overdue", "Cancelled"].map((status) => (
            <option key={status}>{status}</option>
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
          <option value="pendingAmount">Highest Pending</option>
          <option value="highestAmount">Highest Amount</option>
          <option value="latest">Latest Created</option>
        </select>

        <button
          onClick={() => {
            setSearch("");
            setFilterStatus("All");
            setSortBy("dueDate");
            setPage(1);
          }}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
        >
          <RefreshCcw className="h-4 w-4" />
          Reset
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-950 dark:text-white">
              Invoice List
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Track invoice status, due dates, payments, and pending balances.
            </p>
          </div>

          <p className="text-xs font-medium text-slate-400">
            Showing {paginatedInvoices.length} of {filteredInvoices.length}
          </p>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[1160px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
                <th className="px-4 py-3 font-semibold text-slate-500">
                  Invoice
                </th>
                <th className="px-4 py-3 font-semibold text-slate-500">
                  Customer
                </th>
                <th className="px-4 py-3 font-semibold text-slate-500">
                  Service
                </th>
                <th className="px-4 py-3 font-semibold text-slate-500">
                  Due Date
                </th>
                <th className="px-4 py-3 font-semibold text-slate-500">
                  Total
                </th>
                <th className="px-4 py-3 font-semibold text-slate-500">
                  Paid
                </th>
                <th className="px-4 py-3 font-semibold text-slate-500">
                  Balance
                </th>
                <th className="px-4 py-3 font-semibold text-slate-500">
                  Status
                </th>
                <th className="px-4 py-3 font-semibold text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedInvoices.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-12 text-center text-slate-400"
                  >
                    No invoices found.
                  </td>
                </tr>
              ) : (
                paginatedInvoices.map((invoice) => {
                  const status = getInvoiceStatus(invoice);
                  const balance = Math.max(
                    0,
                    Number(invoice.totalAmount || 0) - Number(invoice.paidAmount || 0)
                  );

                  return (
                    <tr
                      key={invoice.id}
                      className="border-b border-slate-100 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                    >
                      <td className="px-4 py-3">
                        <p className="font-bold text-slate-900 dark:text-white">
                          {invoice.invoiceNo}
                        </p>
                        <p className="text-xs text-slate-400">
                          Issued {formatDate(invoice.issueDate)}
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">
                          {invoice.customer}
                        </p>
                        <p className="text-xs text-slate-400">
                          {invoice.phone || invoice.email || "No contact"}
                        </p>
                      </td>

                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                        {invoice.service}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={
                            status === "Overdue"
                              ? "font-bold text-rose-700"
                              : "font-semibold text-slate-700 dark:text-slate-300"
                          }
                        >
                          {formatDate(invoice.dueDate)}
                        </span>
                      </td>

                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                        {formatCurrency(invoice.totalAmount)}
                      </td>

                      <td className="px-4 py-3 font-semibold text-emerald-700">
                        {formatCurrency(invoice.paidAmount)}
                      </td>

                      <td className="px-4 py-3 font-semibold text-amber-700">
                        {formatCurrency(balance)}
                      </td>

                      <td className="px-4 py-3">
                        <StatusBadge status={status} />
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setModal({ type: "view", invoice })}
                            title="View"
                            className="rounded-lg border border-blue-200 bg-blue-50 p-2 text-blue-700 transition hover:bg-blue-100"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => setModal({ type: "edit", invoice })}
                            title="Edit"
                            className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() =>
                              setModal({ type: "payment", invoice })
                            }
                            disabled={balance <= 0}
                            title="Record Payment"
                            className="rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <WalletCards className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => handleSendReminder(invoice)}
                            disabled={balance <= 0}
                            title="Send Reminder"
                            className="rounded-lg border border-amber-200 bg-amber-50 p-2 text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Send className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => handleMarkPaid(invoice)}
                            disabled={balance <= 0}
                            title="Mark Paid"
                            className="rounded-lg border border-indigo-200 bg-indigo-50 p-2 text-indigo-700 transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => setModal({ type: "delete", invoice })}
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

      {modal?.type === "add" && (
        <InvoiceFormModal
          onSave={handleAdd}
          onClose={() => setModal(null)}
        />
      )}

      {modal?.type === "edit" && (
        <InvoiceFormModal
          invoice={modal.invoice}
          onSave={handleEdit}
          onClose={() => setModal(null)}
        />
      )}

      {modal?.type === "view" && (
        <InvoiceViewModal
          invoice={modal.invoice}
          onClose={() => setModal(null)}
          onEdit={(invoice) => setModal({ type: "edit", invoice })}
          onRecordPayment={(invoice) => setModal({ type: "payment", invoice })}
          onSendReminder={handleSendReminder}
        />
      )}

      {modal?.type === "payment" && (
        <PaymentModal
          invoice={modal.invoice}
          onSave={handleRecordPayment}
          onClose={() => setModal(null)}
        />
      )}

      {modal?.type === "delete" && (
        <ConfirmModal
          invoice={modal.invoice}
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

export default Payments;