import { useState } from "react";
import PageTitle from "../components/PageTitle";
import {
  AlertTriangle,
  CheckCircle2,
  Edit3,
  Flame,
  Globe2,
  Handshake,
  MessageCircle,
  Monitor,
  Pin,
  Plus,
  Search,
  Snowflake,
  ThermometerSun,
  Trash2,
  UserPlus,
  X,
} from "lucide-react";

import { leads as initialLeads } from "../data/crmData";

function getInitials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const avatarColors = [
  { bg: "bg-blue-100", text: "text-blue-800" },
  { bg: "bg-amber-100", text: "text-amber-800" },
  { bg: "bg-emerald-100", text: "text-emerald-800" },
  { bg: "bg-rose-100", text: "text-rose-800" },
  { bg: "bg-purple-100", text: "text-purple-800" },
  { bg: "bg-orange-100", text: "text-orange-800" },
];

function avatarColor(id) {
  return avatarColors[id % avatarColors.length];
}

function StatusBadge({ status }) {
  const map = {
    New: "bg-blue-100 text-blue-800",
    Contacted: "bg-amber-100 text-amber-800",
    Interested: "bg-emerald-100 text-emerald-800",
    "Not Interested": "bg-slate-100 text-slate-600",
    Closed: "bg-rose-100 text-rose-800",
  };

  return (
    <span
      className={`inline-block rounded-lg px-2.5 py-1 text-xs font-semibold ${
        map[status] ?? "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const map = {
    Hot: "bg-rose-100 text-rose-800",
    Warm: "bg-amber-100 text-amber-800",
    Cold: "bg-blue-100 text-blue-700",
  };

  return (
    <span
      className={`inline-block rounded-lg px-2.5 py-1 text-xs font-semibold ${
        map[priority] ?? "bg-slate-100 text-slate-600"
      }`}
    >
      {priority}
    </span>
  );
}

function SourceIcon({ source }) {
  const iconClass = "h-4 w-4";

  const icons = {
    Facebook: <Globe2 className={iconClass} />,
    WhatsApp: <MessageCircle className={iconClass} />,
    Referral: <Handshake className={iconClass} />,
    Google: <Search className={iconClass} />,
    Website: <Monitor className={iconClass} />,
  };

  return (
    <span className="flex items-center gap-1.5 text-sm text-slate-600">
      {icons[source] ?? <Pin className={iconClass} />}
      {source}
    </span>
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
        className="ml-2 rounded-md p-1 opacity-60 transition hover:bg-black/5 hover:opacity-100"
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function ConfirmModal({ name, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/50 px-4">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
            <AlertTriangle className="h-6 w-6" />
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-950">Delete Lead?</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Are you sure you want to delete <strong>{name}</strong>? This
              action cannot be undone.
            </p>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-rose-600 py-3 text-sm font-semibold text-white hover:bg-rose-700"
          >
            Delete Lead
          </button>
        </div>
      </div>
    </div>
  );
}

const emptyForm = {
  name: "",
  phone: "",
  service: "",
  source: "Facebook",
  status: "New",
  priority: "Hot",
};

function LeadModal({ lead, onSave, onClose }) {
  const [form, setForm] = useState(lead ?? emptyForm);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.name.trim() || !form.phone.trim() || !form.service.trim()) {
      return;
    }

    onSave(form);
  }

  const fieldClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white";

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/50 px-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="mb-7 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-slate-950">
              {lead ? "Edit Lead" : "Add New Lead"}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Fill in the lead details and save the record.
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

        <form onSubmit={handleSubmit} className="space-y-5">
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
          </div>

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

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
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
                {["Facebook", "WhatsApp", "Google", "Referral", "Website"].map(
                  (source) => (
                    <option key={source}>{source}</option>
                  )
                )}
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
                {[
                  "New",
                  "Contacted",
                  "Interested",
                  "Not Interested",
                  "Closed",
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
                {["Hot", "Warm", "Cold"].map((priority) => (
                  <option key={priority}>{priority}</option>
                ))}
              </select>
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
              {lead ? (
                <>
                  <Edit3 className="h-4 w-4" />
                  Save Changes
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Add Lead
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const ITEMS_PER_PAGE = 5;

function Leads() {
  const [leads, setLeads] = useState(initialLeads);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [filterSource, setFilterSource] = useState("All");
  const [page, setPage] = useState(1);

  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  function handleAdd(form) {
    const newLead = { ...form, id: Date.now() };
    setLeads((prev) => [newLead, ...prev]);
    setModal(null);
    showToast("Lead added successfully.");
  }

  function handleEdit(form) {
    setLeads((prev) =>
      prev.map((item) =>
        item.id === modal.lead.id ? { ...modal.lead, ...form } : item
      )
    );
    setModal(null);
    showToast("Lead updated successfully.");
  }

  function handleDelete() {
    setLeads((prev) => prev.filter((item) => item.id !== modal.lead.id));
    setModal(null);
    showToast("Lead deleted successfully.", "error");
  }

  function handleConvert(lead) {
    setLeads((prev) => prev.filter((item) => item.id !== lead.id));
    showToast(`${lead.name} converted to customer.`, "info");
  }

  const filtered = leads.filter((lead) => {
    const searchValue = search.toLowerCase();

    const matchSearch =
      lead.name.toLowerCase().includes(searchValue) ||
      lead.phone.includes(search);

    const matchStatus =
      filterStatus === "All" || lead.status === filterStatus;

    const matchPriority =
      filterPriority === "All" || lead.priority === filterPriority;

    const matchSource =
      filterSource === "All" || lead.source === filterSource;

    return matchSearch && matchStatus && matchPriority && matchSource;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);

  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const hotCount = leads.filter((lead) => lead.priority === "Hot").length;
  const warmCount = leads.filter((lead) => lead.priority === "Warm").length;
  const coldCount = leads.filter((lead) => lead.priority === "Cold").length;

  return (
    <div className="w-full max-w-full">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <PageTitle
            title="Leads"
            subtitle="Manage new inquiries and potential clients"
          />

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              Total: {leads.length}
            </span>

            <span className="flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
              <Flame className="h-3.5 w-3.5" />
              Hot: {hotCount}
            </span>

            <span className="flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
              <ThermometerSun className="h-3.5 w-3.5" />
              Warm: {warmCount}
            </span>

            <span className="flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
              <Snowflake className="h-3.5 w-3.5" />
              Cold: {coldCount}
            </span>
          </div>
        </div>

        <button
          onClick={() => setModal("add")}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" />
          Add New Lead
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none focus:border-slate-400"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-400"
        >
          <option value="All">All Status</option>
          {["New", "Contacted", "Interested", "Not Interested", "Closed"].map(
            (status) => (
              <option key={status}>{status}</option>
            )
          )}
        </select>

        <select
          value={filterPriority}
          onChange={(e) => {
            setFilterPriority(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-400"
        >
          <option value="All">All Priority</option>
          {["Hot", "Warm", "Cold"].map((priority) => (
            <option key={priority}>{priority}</option>
          ))}
        </select>

        <select
          value={filterSource}
          onChange={(e) => {
            setFilterSource(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-400"
        >
          <option value="All">All Sources</option>
          {["Facebook", "WhatsApp", "Google", "Referral", "Website"].map(
            (source) => (
              <option key={source}>{source}</option>
            )
          )}
        </select>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h3 className="text-base font-bold text-slate-950">Lead List</h3>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[780px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-4 py-3 font-semibold text-slate-500">
                  Name
                </th>
                <th className="px-4 py-3 font-semibold text-slate-500">
                  Phone
                </th>
                <th className="px-4 py-3 font-semibold text-slate-500">
                  Service
                </th>
                <th className="px-4 py-3 font-semibold text-slate-500">
                  Source
                </th>
                <th className="px-4 py-3 font-semibold text-slate-500">
                  Status
                </th>
                <th className="px-4 py-3 font-semibold text-slate-500">
                  Priority
                </th>
                <th className="px-4 py-3 font-semibold text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-slate-400"
                  >
                    No leads found.
                  </td>
                </tr>
              ) : (
                paginated.map((lead) => {
                  const avatar = avatarColor(lead.id);

                  return (
                    <tr
                      key={lead.id}
                      className="border-b border-slate-100 transition hover:bg-slate-50"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatar.bg} ${avatar.text}`}
                          >
                            {getInitials(lead.name)}
                          </div>

                          <span className="font-medium text-slate-900">
                            {lead.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {lead.phone}
                      </td>

                      <td className="px-4 py-3 text-slate-700">
                        {lead.service}
                      </td>

                      <td className="px-4 py-3">
                        <SourceIcon source={lead.source} />
                      </td>

                      <td className="px-4 py-3">
                        <StatusBadge status={lead.status} />
                      </td>

                      <td className="px-4 py-3">
                        <PriorityBadge priority={lead.priority} />
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setModal({ type: "edit", lead })}
                            title="Edit"
                            className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-600 transition hover:bg-slate-100"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => setModal({ type: "delete", lead })}
                            title="Delete"
                            className="rounded-lg border border-rose-200 bg-rose-50 p-2 text-rose-600 transition hover:bg-rose-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => handleConvert(lead)}
                            title="Convert to Customer"
                            className="rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-emerald-700 transition hover:bg-emerald-100"
                          >
                            <CheckCircle2 className="h-4 w-4" />
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
            Showing {paginated.length} of {filtered.length} leads
          </p>

          <div className="flex gap-1">
            <button
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={currentPage === 1}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
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
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <Edit3 className="h-3.5 w-3.5" />
          Edit lead
        </span>

        <span className="flex items-center gap-1">
          <Trash2 className="h-3.5 w-3.5" />
          Delete lead
        </span>

        <span className="flex items-center gap-1">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Convert to customer
        </span>
      </div>

      {modal === "add" && (
        <LeadModal onSave={handleAdd} onClose={() => setModal(null)} />
      )}

      {modal?.type === "edit" && (
        <LeadModal
          lead={modal.lead}
          onSave={handleEdit}
          onClose={() => setModal(null)}
        />
      )}

      {modal?.type === "delete" && (
        <ConfirmModal
          name={modal.lead.name}
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

export default Leads;