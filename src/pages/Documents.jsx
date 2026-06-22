import { useMemo, useRef, useState } from "react";
import {
  Archive,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Download,
  Eye,
  FileArchive,
  FileCheck2,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileUp,
  Filter,
  Folder,
  FolderOpen,
  Globe2,
  HardDrive,
  Info,
  Link2,
  LockKeyhole,
  MoreHorizontal,
  Plus,
  Search,
  ShieldCheck,
  Tag,
  Trash2,
  UploadCloud,
  UserCheck,
  Users,
  X,
} from "lucide-react";

const MAX_FILE_SIZE = 25 * 1024 * 1024;

const teamMembers = [
  "Admin",
  "Ahsan Ali",
  "Sara Khan",
  "Bilal Ahmed",
  "Malik Khan",
  "Support Team",
];

const folders = [
  "Sales Documents",
  "Legal & Contracts",
  "Accounts",
  "Project Files",
  "Client Assets",
  "Internal SOPs",
];

const categories = [
  "All",
  "Proposal",
  "Contract",
  "Invoice",
  "Requirement",
  "Asset",
  "SOP",
  "Other",
];

const statuses = [
  "All",
  "Draft",
  "Review",
  "Approved",
  "Sent",
  "Active",
  "Expired",
  "Archived",
];

const accessScopes = [
  "Private",
  "Team",
  "Selected Members",
  "Public Link",
  "Client Portal",
];

const allowedExtensions = [
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "png",
  "jpg",
  "jpeg",
  "zip",
  "txt",
];

const demoDocuments = [
  {
    id: "DOC-1001",
    title: "ABC School CRM Proposal",
    name: "ABC School CRM Proposal.pdf",
    client: "ABC School",
    relatedTo: "Deal: CRM Implementation",
    category: "Proposal",
    folder: "Sales Documents",
    uploadedBy: "Ahsan Ali",
    owner: "Admin",
    size: "2.4 MB",
    type: "application/pdf",
    version: "v1.3",
    status: "Approved",
    accessScope: "Team",
    selectedMembers: [],
    allowDownload: true,
    passwordProtected: false,
    clientCanView: false,
    publicLinkEnabled: false,
    tags: "proposal, school, crm",
    notes: "Final proposal approved for client sharing.",
    updated: "2026-06-18",
    expiry: "2026-07-10",
    fileUrl: null,
  },
];

const emptyForm = {
  title: "",
  client: "",
  relatedTo: "",
  category: "Proposal",
  folder: "Sales Documents",
  uploadedBy: "Admin",
  owner: "Admin",
  version: "v1.0",
  status: "Active",
  accessScope: "Team",
  selectedMembers: [],
  allowDownload: true,
  passwordProtected: false,
  clientCanView: false,
  publicLinkEnabled: false,
  expiry: "",
  tags: "",
  notes: "",
};

function formatDate(date) {
  if (!date) return "Not set";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatFileSize(bytes) {
  if (!bytes) return "0 KB";

  const kb = bytes / 1024;

  if (kb < 1024) {
    return `${kb.toFixed(1)} KB`;
  }

  return `${(kb / 1024).toFixed(1)} MB`;
}

function fileExtension(fileName = "") {
  return fileName.split(".").pop()?.toLowerCase() || "";
}

function getFileIcon(type, category, name) {
  const ext = fileExtension(name);

  if (type?.includes("image") || ["png", "jpg", "jpeg"].includes(ext)) {
    return FileImage;
  }

  if (
    type?.includes("spreadsheet") ||
    ["xls", "xlsx"].includes(ext) ||
    category === "Invoice"
  ) {
    return FileSpreadsheet;
  }

  if (type?.includes("zip") || ext === "zip" || category === "Asset") {
    return FileArchive;
  }

  if (category === "Contract") {
    return FileCheck2;
  }

  return FileText;
}

function statusClass(status) {
  return (
    {
      Draft: "bg-slate-100 text-slate-700 ring-slate-200",
      Review: "bg-amber-50 text-amber-700 ring-amber-200",
      Approved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      Sent: "bg-blue-50 text-blue-700 ring-blue-200",
      Active: "bg-indigo-50 text-indigo-700 ring-indigo-200",
      Expired: "bg-rose-50 text-rose-700 ring-rose-200",
      Archived: "bg-slate-100 text-slate-600 ring-slate-200",
    }[status] || "bg-slate-100 text-slate-700 ring-slate-200"
  );
}

function accessClass(accessScope) {
  return (
    {
      Private: "bg-rose-50 text-rose-700 ring-rose-200",
      Team: "bg-cyan-50 text-cyan-700 ring-cyan-200",
      "Selected Members": "bg-violet-50 text-violet-700 ring-violet-200",
      "Public Link": "bg-orange-50 text-orange-700 ring-orange-200",
      "Client Portal": "bg-green-50 text-green-700 ring-green-200",
    }[accessScope] || "bg-slate-100 text-slate-700 ring-slate-200"
  );
}

function Toggle({ checked, onChange, label, description }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex w-full items-start justify-between gap-4 rounded-2xl border p-4 text-left transition ${
        checked
          ? "border-slate-900 bg-slate-950 text-white"
          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      }`}
    >
      <span>
        <span className="block text-sm font-black">{label}</span>

        {description && (
          <span
            className={`mt-1 block text-xs leading-5 ${
              checked ? "text-slate-300" : "text-slate-500"
            }`}
          >
            {description}
          </span>
        )}
      </span>

      <span
        className={`mt-1 h-5 w-9 rounded-full p-0.5 transition ${
          checked ? "bg-white" : "bg-slate-200"
        }`}
      >
        <span
          className={`block h-4 w-4 rounded-full transition ${
            checked ? "translate-x-4 bg-slate-950" : "bg-white"
          }`}
        />
      </span>
    </button>
  );
}

function Documents() {
  const fileInputRef = useRef(null);

  const [documents, setDocuments] = useState(demoDocuments);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [accessFilter, setAccessFilter] = useState("All");
  const [showUpload, setShowUpload] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const filteredDocuments = useMemo(() => {
    const q = search.toLowerCase().trim();

    return documents.filter((doc) => {
      const categoryOk =
        categoryFilter === "All" || doc.category === categoryFilter;

      const statusOk = statusFilter === "All" || doc.status === statusFilter;

      const accessOk =
        accessFilter === "All" || doc.accessScope === accessFilter;

      const searchOk =
        !q ||
        [
          doc.id,
          doc.title,
          doc.name,
          doc.client,
          doc.relatedTo,
          doc.category,
          doc.folder,
          doc.uploadedBy,
          doc.owner,
          doc.status,
          doc.accessScope,
          doc.tags,
        ]
          .join(" ")
          .toLowerCase()
          .includes(q);

      return categoryOk && statusOk && accessOk && searchOk;
    });
  }, [documents, search, categoryFilter, statusFilter, accessFilter]);

  const stats = [
    {
      label: "Total Documents",
      value: documents.length,
      icon: FolderOpen,
      note: "All CRM files",
    },
    {
      label: "Need Review",
      value: documents.filter((d) => d.status === "Review").length,
      icon: CalendarDays,
      note: "Action required",
    },
    {
      label: "Approved",
      value: documents.filter((d) => d.status === "Approved").length,
      icon: CheckCircle2,
      note: "Ready files",
    },
    {
      label: "Restricted",
      value: documents.filter(
        (d) => d.accessScope === "Private" || d.accessScope === "Selected Members"
      ).length,
      icon: LockKeyhole,
      note: "Limited access",
    },
  ];

  const folderCounts = folders.map((folder) => ({
    name: folder,
    count: documents.filter((doc) => doc.folder === folder).length,
  }));

  function setField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setField(name, value);
  }

  function validateFiles(files) {
    const validFiles = [];
    const errors = [];

    Array.from(files || []).forEach((file) => {
      const ext = fileExtension(file.name);

      if (!allowedExtensions.includes(ext)) {
        errors.push(`${file.name}: unsupported file type`);
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: file size must be under 25 MB`);
        return;
      }

      validFiles.push(file);
    });

    if (errors.length) {
      setError(errors.join(". "));
    } else {
      setError("");
    }

    return validFiles;
  }

  function handleFileSelect(files) {
    const validFiles = validateFiles(files);

    if (!validFiles.length) return;

    setSelectedFiles((prev) => [...prev, ...validFiles]);
    setSuccess(`${validFiles.length} file(s) selected successfully.`);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  }

  function resetUploadModal() {
    setForm(emptyForm);
    setSelectedFiles([]);
    setDragActive(false);
    setError("");
    setSuccess("");
    setShowUpload(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleAddDocument(e) {
    e.preventDefault();
    setError("");

    if (!selectedFiles.length) {
      setError("Please upload or drag and drop at least one file from your PC.");
      return;
    }

    if (form.accessScope === "Selected Members" && form.selectedMembers.length === 0) {
      setError("Selected Members access requires at least one team member.");
      return;
    }

    const now = new Date().toISOString().slice(0, 10);

    const newDocuments = selectedFiles.map((file, index) => {
      const fileUrl = URL.createObjectURL(file);
      const title = form.title?.trim() || file.name.replace(/\.[^/.]+$/, "");

      return {
        id: `DOC-${1000 + documents.length + index + 1}`,
        title,
        name: file.name,
        client: form.client || "General Client",
        relatedTo: form.relatedTo || "Not linked",
        category: form.category,
        folder: form.folder,
        uploadedBy: form.uploadedBy,
        owner: form.owner,
        size: formatFileSize(file.size),
        type: file.type || "Unknown",
        version: form.version,
        status: form.status,
        accessScope: form.accessScope,
        selectedMembers: form.selectedMembers,
        allowDownload: form.allowDownload,
        passwordProtected: form.passwordProtected,
        clientCanView: form.accessScope === "Client Portal" || form.clientCanView,
        publicLinkEnabled:
          form.accessScope === "Public Link" || form.publicLinkEnabled,
        tags: form.tags,
        notes: form.notes,
        updated: now,
        expiry: form.expiry,
        fileUrl,
      };
    });

    setDocuments((prev) => [...newDocuments, ...prev]);
    resetUploadModal();
  }

  function handleDelete(id) {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));

    if (selectedDoc?.id === id) {
      setSelectedDoc(null);
    }
  }

  function handleDownload(doc) {
    if (!doc.allowDownload) {
      setError("Download is disabled for this document.");
      return;
    }

    if (!doc.fileUrl) {
      setSelectedDoc(doc);
      return;
    }

    const link = document.createElement("a");
    link.href = doc.fileUrl;
    link.download = doc.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function handlePreview(doc) {
    if (!doc.fileUrl) {
      setSelectedDoc(doc);
      return;
    }

    window.open(doc.fileUrl, "_blank", "noopener,noreferrer");
  }

  function toggleMember(member) {
    setForm((prev) => {
      const exists = prev.selectedMembers.includes(member);

      return {
        ...prev,
        selectedMembers: exists
          ? prev.selectedMembers.filter((item) => item !== member)
          : [...prev.selectedMembers, member],
      };
    });
  }

  return (
    <div className="min-h-screen bg-[#f6f8fb] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1500px] space-y-6">
        {(error || success) && (
          <div
            className={`fixed right-4 top-4 z-[70] max-w-md rounded-2xl border px-4 py-3 text-sm font-bold shadow-xl ${
              error
                ? "border-rose-200 bg-rose-50 text-rose-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            <div className="flex items-start gap-2">
              <Info size={18} className="mt-0.5 shrink-0" />
              <span>{error || success}</span>

              <button
                type="button"
                onClick={() => {
                  setError("");
                  setSuccess("");
                }}
                className="ml-2"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="relative p-6 sm:p-8">
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-slate-950 via-blue-700 to-cyan-500" />

            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-black uppercase tracking-wide text-slate-600">
                  <ShieldCheck size={14} />
                  Secure CRM Document Vault
                </div>

                <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                  Documents
                </h1>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                  Upload, classify, preview, protect, share and audit client
                  documents from one professional CRM workspace.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowUpload(true)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-lg shadow-slate-200 transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                <Plus size={18} />
                Upload Document
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-[1.7rem] border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="rounded-2xl bg-slate-100 p-3 text-slate-900">
                    <Icon size={22} />
                  </div>

                  <span className="text-xs font-black text-slate-400">
                    {stat.note}
                  </span>
                </div>

                <p className="mt-5 text-sm font-bold text-slate-500">
                  {stat.label}
                </p>

                <h2 className="mt-1 text-3xl font-black text-slate-950">
                  {stat.value}
                </h2>
              </div>
            );
          })}
        </section>

        <section className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="min-w-0 rounded-[1.7rem] border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-5">
              <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />

                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search document, client, deal, folder, tag, uploader..."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    [categoryFilter, setCategoryFilter, categories, "Category"],
                    [statusFilter, setStatusFilter, statuses, "Status"],
                    [accessFilter, setAccessFilter, ["All", ...accessScopes], "Access"],
                  ].map(([value, setter, options, label]) => (
                    <div key={label} className="relative">
                      {label === "Category" && (
                        <Filter
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                          size={16}
                        />
                      )}

                      <select
                        value={value}
                        onChange={(e) => setter(e.target.value)}
                        className={`w-full appearance-none rounded-2xl border border-slate-200 bg-white py-3 pr-9 text-sm font-bold text-slate-700 outline-none ${
                          label === "Category" ? "pl-10" : "pl-4"
                        }`}
                      >
                        {options.map((option) => (
                          <option key={option}>{option}</option>
                        ))}
                      </select>

                      <ChevronDown
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                        size={16}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1250px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Document</th>
                    <th className="px-5 py-4">Client / Related</th>
                    <th className="px-5 py-4">Folder</th>
                    <th className="px-5 py-4">Owner</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Access</th>
                    <th className="px-5 py-4">Updated</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredDocuments.map((doc) => {
                    const Icon = getFileIcon(doc.type, doc.category, doc.name);

                    return (
                      <tr key={doc.id} className="transition hover:bg-slate-50/80">
                        <td className="px-5 py-4">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="rounded-2xl bg-slate-100 p-3 text-slate-800">
                              <Icon size={20} />
                            </div>

                            <div className="min-w-0">
                              <p className="truncate font-black text-slate-950">
                                {doc.title || doc.name}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                {doc.id} • {doc.category} • {doc.size} •{" "}
                                {doc.version}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-bold text-slate-800">
                            {doc.client}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {doc.relatedTo}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          {doc.folder}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-slate-700">
                            <UserCheck size={16} className="text-slate-400" />
                            <span className="font-bold">{doc.owner}</span>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${statusClass(
                              doc.status
                            )}`}
                          >
                            {doc.status}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${accessClass(
                              doc.accessScope
                            )}`}
                          >
                            {doc.accessScope}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          {formatDate(doc.updated)}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handlePreview(doc)}
                              className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
                              title="Preview"
                            >
                              <Eye size={16} />
                            </button>

                            <button
                              onClick={() => handleDownload(doc)}
                              className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
                              title="Download"
                            >
                              <Download size={16} />
                            </button>

                            <button
                              onClick={() => setSelectedDoc(doc)}
                              className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
                              title="Details"
                            >
                              <Archive size={16} />
                            </button>

                            <button
                              onClick={() => handleDelete(doc.id)}
                              className="rounded-xl border border-rose-100 p-2 text-rose-500 hover:bg-rose-50"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredDocuments.length === 0 && (
                <div className="p-12 text-center">
                  <Folder className="mx-auto text-slate-300" size={42} />

                  <h3 className="mt-3 text-lg font-black text-slate-900">
                    No documents found
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Change filters or upload a new document.
                  </p>
                </div>
              )}
            </div>
          </div>

          <aside className="min-w-0 space-y-6">
            <div className="rounded-[1.7rem] border border-slate-200 bg-white p-5 shadow-sm 2xl:sticky 2xl:top-6">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-black text-slate-950">
                  Folder Structure
                </h3>

                <MoreHorizontal className="text-slate-400" size={20} />
              </div>

              <div className="mt-5 max-h-[460px] space-y-3 overflow-y-auto pr-1">
                {folderCounts.map((folder) => (
                  <div
                    key={folder.name}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <FolderOpen
                        size={18}
                        className="shrink-0 text-slate-600"
                      />

                      <span className="break-words text-sm font-bold leading-5 text-slate-700">
                        {folder.name}
                      </span>
                    </div>

                    <span className="shrink-0 rounded-full bg-white px-2 py-1 text-xs font-black text-slate-500">
                      {folder.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.7rem] border border-dashed border-slate-300 bg-white p-6 text-center shadow-sm">
              <UploadCloud className="mx-auto text-slate-400" size={36} />

              <h3 className="mt-3 font-black text-slate-950">Quick Upload</h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                PDF, Word, Excel, images, ZIP and text files. Max 25 MB per file.
              </p>

              <button
                onClick={() => setShowUpload(true)}
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white"
              >
                <FileUp size={17} />
                Add File
              </button>
            </div>
          </aside>
        </section>
      </div>

      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-3 backdrop-blur-sm sm:p-5">
          <form
            onSubmit={handleAddDocument}
            className="my-5 flex h-[92vh] w-full max-w-7xl flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl"
          >
            <div className="shrink-0 border-b border-slate-100 p-5 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-950">
                    Upload New Document
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Attach files, set ownership, choose public/private access,
                    add audit details and control download permissions.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={resetUploadModal}
                  className="rounded-xl bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-7">
              <div className="grid gap-6 xl:grid-cols-[1.05fr_1fr]">
                <div className="space-y-4">
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragActive(true);
                    }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex min-h-[360px] cursor-pointer flex-col items-center justify-center rounded-[1.7rem] border-2 border-dashed p-8 text-center transition ${
                      dragActive
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-300 bg-slate-50 hover:border-slate-500 hover:bg-white"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFileSelect(e.target.files)}
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.zip,.txt"
                    />

                    <UploadCloud size={54} className="text-slate-400" />

                    <h3 className="mt-4 text-xl font-black text-slate-950">
                      Drag and drop files here
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Click the Browse File button to select files from your PC.
                    </p>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="mt-5 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white"
                    >
                      Browse File
                    </button>

                    <p className="mt-4 text-xs font-bold text-slate-400">
                      Allowed: PDF, DOC, DOCX, XLS, XLSX, PNG, JPG, ZIP, TXT •
                      Max 25 MB each
                    </p>
                  </div>

                  {selectedFiles.length > 0 && (
                    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-black text-slate-900">
                          Selected Files
                        </p>

                        <button
                          type="button"
                          onClick={() => setSelectedFiles([])}
                          className="text-xs font-black text-rose-600"
                        >
                          Clear all
                        </button>
                      </div>

                      <div className="max-h-52 space-y-2 overflow-y-auto pr-1">
                        {selectedFiles.map((file, index) => {
                          const Icon = getFileIcon(
                            file.type,
                            form.category,
                            file.name
                          );

                          return (
                            <div
                              key={`${file.name}-${index}`}
                              className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-3"
                            >
                              <div className="flex min-w-0 items-center gap-3">
                                <Icon
                                  size={18}
                                  className="shrink-0 text-slate-600"
                                />

                                <div className="min-w-0">
                                  <p className="truncate text-sm font-black text-slate-900">
                                    {file.name}
                                  </p>

                                  <p className="text-xs text-slate-500">
                                    {formatFileSize(file.size)} •{" "}
                                    {file.type || "Unknown type"}
                                  </p>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedFiles((prev) =>
                                    prev.filter((_, i) => i !== index)
                                  )
                                }
                                className="shrink-0 rounded-lg p-1 text-rose-500 hover:bg-rose-50"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-5">
                  <div className="rounded-[1.5rem] border border-slate-200 p-4">
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-500">
                      <FileText size={16} />
                      Document Details
                    </h3>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Document Title (optional)"
                        className="sm:col-span-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-500"
                      />

                      <input
                        name="client"
                        value={form.client}
                        onChange={handleChange}
                        placeholder="Client Name"
                        className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-500"
                      />

                      <input
                        name="relatedTo"
                        value={form.relatedTo}
                        onChange={handleChange}
                        placeholder="Related Deal / Lead / Project"
                        className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-500"
                      />

                      <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-slate-500"
                      >
                        {categories
                          .filter((item) => item !== "All")
                          .map((item) => (
                            <option key={item}>{item}</option>
                          ))}
                      </select>

                      <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-slate-500"
                      >
                        {statuses
                          .filter((item) => item !== "All")
                          .map((item) => (
                            <option key={item}>{item}</option>
                          ))}
                      </select>

                      <select
                        name="folder"
                        value={form.folder}
                        onChange={handleChange}
                        className="sm:col-span-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-slate-500"
                      >
                        {folders.map((folder) => (
                          <option key={folder}>{folder}</option>
                        ))}
                      </select>

                      <input
                        name="version"
                        value={form.version}
                        onChange={handleChange}
                        placeholder="Version"
                        className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-500"
                      />

                      <input
                        name="expiry"
                        type="date"
                        value={form.expiry}
                        onChange={handleChange}
                        className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-500"
                      />
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-slate-200 p-4">
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-500">
                      <ShieldCheck size={16} />
                      Access & Visibility
                    </h3>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <select
                        name="uploadedBy"
                        value={form.uploadedBy}
                        onChange={handleChange}
                        className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-slate-500"
                      >
                        {teamMembers.map((member) => (
                          <option key={member}>{member}</option>
                        ))}
                      </select>

                      <select
                        name="owner"
                        value={form.owner}
                        onChange={handleChange}
                        className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-slate-500"
                      >
                        {teamMembers.map((member) => (
                          <option key={member}>{member}</option>
                        ))}
                      </select>

                      <select
                        name="accessScope"
                        value={form.accessScope}
                        onChange={handleChange}
                        className="sm:col-span-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-slate-500"
                      >
                        {accessScopes.map((option) => (
                          <option key={option}>{option}</option>
                        ))}
                      </select>
                    </div>

                    {form.accessScope === "Selected Members" && (
                      <div className="mt-4 rounded-2xl bg-slate-50 p-3">
                        <p className="mb-2 text-xs font-black uppercase text-slate-400">
                          Select Team Members
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {teamMembers
                            .filter((member) => member !== "Admin")
                            .map((member) => (
                              <button
                                key={member}
                                type="button"
                                onClick={() => toggleMember(member)}
                                className={`rounded-full px-3 py-2 text-xs font-black ring-1 ${
                                  form.selectedMembers.includes(member)
                                    ? "bg-slate-950 text-white ring-slate-950"
                                    : "bg-white text-slate-600 ring-slate-200"
                                }`}
                              >
                                {member}
                              </button>
                            ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <Toggle
                        checked={form.allowDownload}
                        onChange={(value) => setField("allowDownload", value)}
                        label="Allow Download"
                        description="Disable this for view-only files."
                      />

                      <Toggle
                        checked={form.passwordProtected}
                        onChange={(value) =>
                          setField("passwordProtected", value)
                        }
                        label="Password Protected"
                        description="Useful for sensitive contracts."
                      />

                      <Toggle
                        checked={
                          form.publicLinkEnabled ||
                          form.accessScope === "Public Link"
                        }
                        onChange={(value) =>
                          setField("publicLinkEnabled", value)
                        }
                        label="Public Link"
                        description="Use this for shareable external links."
                      />

                      <Toggle
                        checked={
                          form.clientCanView ||
                          form.accessScope === "Client Portal"
                        }
                        onChange={(value) => setField("clientCanView", value)}
                        label="Client Can View"
                        description="Visible inside the client portal."
                      />
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-slate-200 p-4">
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-500">
                      <Tag size={16} />
                      Tags & Notes
                    </h3>

                    <input
                      name="tags"
                      value={form.tags}
                      onChange={handleChange}
                      placeholder="Tags e.g. proposal, urgent, signed"
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-500"
                    />

                    <textarea
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      placeholder="Internal notes / instructions"
                      rows={3}
                      className="mt-4 w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-500"
                    />

                    <div className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-800">
                      Frontend demo only: uploaded local files will be cleared
                      after refresh. For a real CRM, connect backend storage,
                      database records, role-based permissions, audit logs and
                      secure file URLs.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="shrink-0 border-t border-slate-100 bg-white p-5 sm:p-7">
              <div className="flex flex-col justify-end gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={resetUploadModal}
                  className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-black text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-2xl bg-slate-950 px-6 py-3 text-sm font-black text-white hover:bg-slate-800"
                >
                  Save & Upload Document
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="my-8 w-full max-w-4xl rounded-[2rem] bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                  {selectedDoc.id}
                </p>

                <h2 className="mt-1 break-words text-2xl font-black text-slate-950">
                  {selectedDoc.title || selectedDoc.name}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {selectedDoc.name}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedDoc(null)}
                className="rounded-xl bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["Client", selectedDoc.client, Users],
                ["Related To", selectedDoc.relatedTo, Link2],
                ["Category", selectedDoc.category, FileText],
                ["Folder", selectedDoc.folder, FolderOpen],
                ["Owner", selectedDoc.owner, UserCheck],
                ["Uploaded By", selectedDoc.uploadedBy, Users],
                ["Access", selectedDoc.accessScope, ShieldCheck],
                ["Status", selectedDoc.status, CheckCircle2],
                ["Size", selectedDoc.size, HardDrive],
                ["Version", selectedDoc.version, Archive],
                ["Updated", formatDate(selectedDoc.updated), CalendarDays],
                ["Expiry", formatDate(selectedDoc.expiry), CalendarDays],
                [
                  "Download",
                  selectedDoc.allowDownload ? "Allowed" : "Disabled",
                  Download,
                ],
                [
                  "Public Link",
                  selectedDoc.publicLinkEnabled ? "Enabled" : "Disabled",
                  Globe2,
                ],
                [
                  "Client Portal",
                  selectedDoc.clientCanView ? "Visible" : "Hidden",
                  Eye,
                ],
              ].map(([label, value, Icon]) => (
                <div key={label} className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-xs font-black uppercase text-slate-400">
                    <Icon size={14} />
                    {label}
                  </div>

                  <p className="mt-1 break-words text-sm font-bold text-slate-800">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {(selectedDoc.tags || selectedDoc.notes) && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase text-slate-400">
                    Tags
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-800">
                    {selectedDoc.tags || "No tags"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase text-slate-400">
                    Notes
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-800">
                    {selectedDoc.notes || "No notes"}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => handlePreview(selectedDoc)}
                className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700 hover:bg-slate-50"
              >
                Preview
              </button>

              <button
                onClick={() => handleDownload(selectedDoc)}
                className="flex-1 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white hover:bg-slate-800"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Documents;