import { useMemo, useState } from "react";
import {
  AlertCircle,
  Archive,
  BarChart3,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Copy,
  DollarSign,
  Edit3,
  Eye,
  Filter,
  Globe2,
  Layers3,
  MoreHorizontal,
  PackageCheck,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  Tag,
  Trash2,
  UserCheck,
  X,
} from "lucide-react";

const categories = [
  "All",
  "SEO",
  "Social Media",
  "Web Development",
  "Graphic Design",
  "Video Editing",
  "Ads Management",
  "Consulting",
  "Support",
];

const statuses = ["All", "Active", "Draft", "Paused", "Archived"];

const billingCycles = [
  "One-time",
  "Monthly",
  "Quarterly",
  "Yearly",
  "Per Project",
  "Per Hour",
];

const pricingTypes = ["Fixed", "Custom Quote", "Tiered", "Retainer", "Hourly"];

const visibilityOptions = ["Internal Only", "Public Catalog", "Client Portal"];

const serviceOwners = [
  "Admin User",
  "Sales Team",
  "Marketing Team",
  "Design Team",
  "Development Team",
  "Support Team",
];

const deliveryUnits = ["Hours", "Days", "Weeks", "Months"];

const demoServices = [
  {
    id: "SRV-1001",
    name: "Monthly SEO Management",
    sku: "SEO-MONTHLY-001",
    category: "SEO",
    status: "Active",
    visibility: "Public Catalog",
    pricingType: "Retainer",
    billingCycle: "Monthly",
    basePrice: 450,
    cost: 180,
    taxRate: 0,
    currency: "USD",
    deliveryTime: 30,
    deliveryUnit: "Days",
    sla: "Monthly reporting and weekly optimization",
    owner: "Marketing Team",
    pipeline: "SEO Sales Pipeline",
    dealsUsed: 18,
    activeClients: 9,
    revenue: 4050,
    margin: 60,
    tags: "seo, monthly, ranking",
    description:
      "Full monthly SEO service including audits, on-page optimization, keyword tracking and monthly reporting.",
    included:
      "Technical audit, keyword research, on-page SEO, monthly report, competitor tracking",
    exclusions:
      "Paid backlinks, website redesign, custom development, paid ads budget",
    addOns: "Content writing, backlink outreach, local SEO",
    approvalRequired: true,
    clientFacing: true,
    createdAt: "2026-05-12",
    updatedAt: "2026-06-18",
  },
  {
    id: "SRV-1002",
    name: "Social Media Management",
    sku: "SMM-MONTHLY-001",
    category: "Social Media",
    status: "Active",
    visibility: "Client Portal",
    pricingType: "Retainer",
    billingCycle: "Monthly",
    basePrice: 350,
    cost: 140,
    taxRate: 0,
    currency: "USD",
    deliveryTime: 30,
    deliveryUnit: "Days",
    sla: "Monthly content calendar and post scheduling",
    owner: "Marketing Team",
    pipeline: "Marketing Services",
    dealsUsed: 14,
    activeClients: 7,
    revenue: 2450,
    margin: 60,
    tags: "social, facebook, instagram",
    description:
      "Monthly social media management for brand posting, captions, scheduling and basic engagement.",
    included: "12 posts, captions, scheduling, monthly calendar",
    exclusions: "Ad spend, influencer charges, video shooting",
    addOns: "Reels editing, paid ads, creative design",
    approvalRequired: true,
    clientFacing: true,
    createdAt: "2026-05-20",
    updatedAt: "2026-06-17",
  },
  {
    id: "SRV-1003",
    name: "Business Website Development",
    sku: "WEB-DEV-001",
    category: "Web Development",
    status: "Active",
    visibility: "Public Catalog",
    pricingType: "Fixed",
    billingCycle: "Per Project",
    basePrice: 1200,
    cost: 550,
    taxRate: 0,
    currency: "USD",
    deliveryTime: 21,
    deliveryUnit: "Days",
    sla: "Project delivery with two revision rounds",
    owner: "Development Team",
    pipeline: "Website Sales",
    dealsUsed: 11,
    activeClients: 4,
    revenue: 4800,
    margin: 54,
    tags: "website, wordpress, business",
    description:
      "Professional business website development with responsive pages and basic SEO setup.",
    included: "Home page, service pages, contact form, responsive design, basic SEO",
    exclusions: "Hosting, domain, premium plugins, advanced custom systems",
    addOns: "Booking system, payment gateway, custom dashboard",
    approvalRequired: true,
    clientFacing: true,
    createdAt: "2026-04-10",
    updatedAt: "2026-06-15",
  },
  {
    id: "SRV-1004",
    name: "Logo & Brand Identity",
    sku: "DESIGN-BRAND-001",
    category: "Graphic Design",
    status: "Draft",
    visibility: "Internal Only",
    pricingType: "Fixed",
    billingCycle: "Per Project",
    basePrice: 250,
    cost: 90,
    taxRate: 0,
    currency: "USD",
    deliveryTime: 5,
    deliveryUnit: "Days",
    sla: "Three concepts and two revision rounds",
    owner: "Design Team",
    pipeline: "Design Services",
    dealsUsed: 5,
    activeClients: 2,
    revenue: 500,
    margin: 64,
    tags: "logo, branding, design",
    description:
      "Logo and basic brand identity package for small businesses and startups.",
    included: "Logo concepts, color palette, typography direction, final files",
    exclusions: "Brand strategy, packaging design, trademark registration",
    addOns: "Social kit, brand guidelines, stationery design",
    approvalRequired: false,
    clientFacing: false,
    createdAt: "2026-06-01",
    updatedAt: "2026-06-12",
  },
];

const emptyServiceForm = {
  name: "",
  sku: "",
  category: "SEO",
  status: "Active",
  visibility: "Public Catalog",
  pricingType: "Fixed",
  billingCycle: "One-time",
  basePrice: "",
  cost: "",
  taxRate: "0",
  currency: "USD",
  deliveryTime: "",
  deliveryUnit: "Days",
  sla: "",
  owner: "Admin User",
  pipeline: "",
  tags: "",
  description: "",
  included: "",
  exclusions: "",
  addOns: "",
  approvalRequired: true,
  clientFacing: true,
};

function formatCurrency(value, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatDate(date) {
  if (!date) return "Not set";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function statusClass(status) {
  return (
    {
      Active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      Draft: "bg-slate-100 text-slate-700 ring-slate-200",
      Paused: "bg-amber-50 text-amber-700 ring-amber-200",
      Archived: "bg-rose-50 text-rose-700 ring-rose-200",
    }[status] || "bg-slate-100 text-slate-700 ring-slate-200"
  );
}

function visibilityClass(visibility) {
  return (
    {
      "Internal Only": "bg-slate-100 text-slate-700 ring-slate-200",
      "Public Catalog": "bg-blue-50 text-blue-700 ring-blue-200",
      "Client Portal": "bg-violet-50 text-violet-700 ring-violet-200",
    }[visibility] || "bg-slate-100 text-slate-700 ring-slate-200"
  );
}

function Toggle({ checked, onChange, label, description }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex w-full items-start justify-between gap-3 rounded-xl border p-3 text-left transition ${
        checked
          ? "border-slate-950 bg-slate-950 text-white"
          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      }`}
    >
      <span>
        <span className="block text-xs font-black">{label}</span>

        {description && (
          <span
            className={`mt-1 block text-[11px] leading-4 ${
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

function Services() {
  const [services, setServices] = useState(demoServices);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [billingFilter, setBillingFilter] = useState("All");
  const [selectedService, setSelectedService] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [form, setForm] = useState(emptyServiceForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const filteredServices = useMemo(() => {
    const q = search.toLowerCase().trim();

    return services.filter((service) => {
      const searchOk =
        !q ||
        [
          service.id,
          service.name,
          service.sku,
          service.category,
          service.status,
          service.visibility,
          service.pricingType,
          service.billingCycle,
          service.owner,
          service.pipeline,
          service.tags,
        ]
          .join(" ")
          .toLowerCase()
          .includes(q);

      const categoryOk =
        categoryFilter === "All" || service.category === categoryFilter;

      const statusOk = statusFilter === "All" || service.status === statusFilter;

      const billingOk =
        billingFilter === "All" || service.billingCycle === billingFilter;

      return searchOk && categoryOk && statusOk && billingOk;
    });
  }, [services, search, categoryFilter, statusFilter, billingFilter]);

  const stats = [
    {
      label: "Total Services",
      value: services.length,
      note: "Catalog items",
      icon: PackageCheck,
    },
    {
      label: "Active Services",
      value: services.filter((service) => service.status === "Active").length,
      note: "Ready to sell",
      icon: CheckCircle2,
    },
    {
      label: "Monthly Revenue",
      value: formatCurrency(
        services.reduce((sum, service) => sum + service.revenue, 0)
      ),
      note: "Service revenue",
      icon: DollarSign,
    },
    {
      label: "Avg Margin",
      value: `${Math.round(
        services.reduce((sum, service) => sum + service.margin, 0) /
          services.length
      )}%`,
      note: "Profitability",
      icon: BarChart3,
    },
  ];

  const categoryStats = categories
    .filter((item) => item !== "All")
    .map((category) => ({
      category,
      count: services.filter((service) => service.category === category).length,
    }));

  const popularServices = [...services]
    .sort((a, b) => b.dealsUsed - a.dealsUsed)
    .slice(0, 4);

  function setField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setField(name, value);
  }

  function resetModal() {
    setForm(emptyServiceForm);
    setEditingServiceId(null);
    setError("");
    setSuccess("");
    setShowModal(false);
  }

  function openCreateModal() {
    setForm(emptyServiceForm);
    setEditingServiceId(null);
    setShowModal(true);
  }

  function openEditModal(service) {
    setEditingServiceId(service.id);
    setForm({
      name: service.name,
      sku: service.sku,
      category: service.category,
      status: service.status,
      visibility: service.visibility,
      pricingType: service.pricingType,
      billingCycle: service.billingCycle,
      basePrice: String(service.basePrice),
      cost: String(service.cost),
      taxRate: String(service.taxRate),
      currency: service.currency,
      deliveryTime: String(service.deliveryTime),
      deliveryUnit: service.deliveryUnit,
      sla: service.sla,
      owner: service.owner,
      pipeline: service.pipeline,
      tags: service.tags,
      description: service.description,
      included: service.included,
      exclusions: service.exclusions,
      addOns: service.addOns,
      approvalRequired: service.approvalRequired,
      clientFacing: service.clientFacing,
    });
    setShowModal(true);
  }

  function validateForm() {
    if (!form.name.trim()) return "Service name is required.";
    if (!form.sku.trim()) return "Service SKU/code is required.";
    if (!form.basePrice || Number(form.basePrice) < 0)
      return "Base price must be valid.";
    if (!form.cost || Number(form.cost) < 0) return "Cost must be valid.";
    if (!form.deliveryTime || Number(form.deliveryTime) <= 0)
      return "Delivery time must be valid.";
    return "";
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    const price = Number(form.basePrice || 0);
    const cost = Number(form.cost || 0);
    const margin = price > 0 ? Math.round(((price - cost) / price) * 100) : 0;

    const payload = {
      name: form.name,
      sku: form.sku,
      category: form.category,
      status: form.status,
      visibility: form.visibility,
      pricingType: form.pricingType,
      billingCycle: form.billingCycle,
      basePrice: price,
      cost,
      taxRate: Number(form.taxRate || 0),
      currency: form.currency,
      deliveryTime: Number(form.deliveryTime),
      deliveryUnit: form.deliveryUnit,
      sla: form.sla,
      owner: form.owner,
      pipeline: form.pipeline,
      tags: form.tags,
      description: form.description,
      included: form.included,
      exclusions: form.exclusions,
      addOns: form.addOns,
      approvalRequired: form.approvalRequired,
      clientFacing: form.clientFacing,
      margin,
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    if (editingServiceId) {
      setServices((prev) =>
        prev.map((service) =>
          service.id === editingServiceId ? { ...service, ...payload } : service
        )
      );
      setSuccess("Service updated successfully.");
      resetModal();
      return;
    }

    const newService = {
      id: `SRV-${1000 + services.length + 1}`,
      ...payload,
      dealsUsed: 0,
      activeClients: 0,
      revenue: 0,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    setServices((prev) => [newService, ...prev]);
    setSuccess("Service created successfully.");
    resetModal();
  }

  function handleDelete(id) {
    setServices((prev) => prev.filter((service) => service.id !== id));

    if (selectedService?.id === id) {
      setSelectedService(null);
    }
  }

  function handleDuplicate(service) {
    const copy = {
      ...service,
      id: `SRV-${1000 + services.length + 1}`,
      name: `${service.name} Copy`,
      sku: `${service.sku}-COPY`,
      status: "Draft",
      dealsUsed: 0,
      activeClients: 0,
      revenue: 0,
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    setServices((prev) => [copy, ...prev]);
    setSuccess("Service duplicated as draft.");
  }

  return (
    <div className="min-h-screen bg-[#f6f8fb] p-4 sm:p-5 lg:p-6">
      <div className="mx-auto max-w-[1500px] space-y-5">
        {(error || success) && (
          <div
            className={`fixed right-4 top-4 z-[70] max-w-md rounded-2xl border px-4 py-3 text-sm font-bold shadow-xl ${
              error
                ? "border-rose-200 bg-rose-50 text-rose-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            <div className="flex items-start gap-2">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
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

        <section className="overflow-hidden rounded-[1.7rem] border border-slate-200 bg-white shadow-sm">
          <div className="relative p-5 sm:p-6">
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-500" />

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-emerald-700">
                  <PackageCheck size={14} />
                  CRM Service Catalog
                </div>

                <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                  Services
                </h1>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                  Manage sellable services, pricing, delivery terms, billing
                  cycles, margins, visibility, add-ons and quote-ready catalog
                  data.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50">
                  <Settings2 size={18} />
                  Price Book Settings
                </button>

                <button
                  type="button"
                  onClick={openCreateModal}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white shadow-lg shadow-slate-200 transition hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  <Plus size={18} />
                  Add Service
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-[1.4rem] border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                    <Icon size={21} />
                  </div>

                  <span className="text-xs font-black text-slate-400">
                    {stat.note}
                  </span>
                </div>

                <p className="mt-4 text-sm font-bold text-slate-500">
                  {stat.label}
                </p>

                <h2 className="mt-1 text-3xl font-black text-slate-950">
                  {stat.value}
                </h2>
              </div>
            );
          })}
        </section>

        <section className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 rounded-[1.4rem] border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-4">
              <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />

                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search service, SKU, category, owner, tag..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    [categoryFilter, setCategoryFilter, categories, "Category"],
                    [statusFilter, setStatusFilter, statuses, "Status"],
                    [
                      billingFilter,
                      setBillingFilter,
                      ["All", ...billingCycles],
                      "Billing",
                    ],
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
                        onChange={(event) => setter(event.target.value)}
                        className={`w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pr-9 text-sm font-bold text-slate-700 outline-none ${
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
              <table className="w-full min-w-[1180px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Service</th>
                    <th className="px-4 py-3">Pricing</th>
                    <th className="px-4 py-3">Delivery</th>
                    <th className="px-4 py-3">Owner</th>
                    <th className="px-4 py-3">Usage</th>
                    <th className="px-4 py-3">Margin</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredServices.map((service) => (
                    <tr key={service.id} className="transition hover:bg-slate-50/80">
                      <td className="px-4 py-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-100">
                            <PackageCheck size={18} />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-black text-slate-950">
                              {service.name}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {service.id} • {service.sku}
                            </p>

                            <div className="mt-1 flex flex-wrap gap-1.5">
                              <span className="inline-flex w-fit items-center whitespace-nowrap rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-black text-slate-600">
                                {service.category}
                              </span>

                              <span
                                className={`inline-flex w-fit items-center whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-black ring-1 ${visibilityClass(
                                  service.visibility
                                )}`}
                              >
                                {service.visibility}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <p className="font-black text-slate-950">
                          {formatCurrency(service.basePrice, service.currency)}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {service.pricingType} • {service.billingCycle}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Cost: {formatCurrency(service.cost, service.currency)}
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <p className="font-bold text-slate-800">
                          {service.deliveryTime} {service.deliveryUnit}
                        </p>

                        <p className="mt-1 max-w-[180px] text-xs leading-4 text-slate-500">
                          {service.sla || "No SLA added"}
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <p className="font-bold text-slate-800">
                          {service.owner}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {service.pipeline || "No pipeline"}
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <div className="grid grid-cols-2 gap-1.5">
                          <div className="rounded-lg bg-slate-50 p-1.5 text-center">
                            <p className="text-sm font-black text-slate-950">
                              {service.dealsUsed}
                            </p>
                            <p className="text-[9px] text-slate-500">Deals</p>
                          </div>

                          <div className="rounded-lg bg-slate-50 p-1.5 text-center">
                            <p className="text-sm font-black text-slate-950">
                              {service.activeClients}
                            </p>
                            <p className="text-[9px] text-slate-500">Clients</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <p className="font-black text-slate-950">
                          {service.margin}%
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {formatCurrency(service.revenue, service.currency)} revenue
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex w-fit items-center whitespace-nowrap rounded-full px-3 py-1 text-xs font-black ring-1 ${statusClass(
                            service.status
                          )}`}
                        >
                          {service.status}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedService(service)}
                            className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
                            title="View Details"
                          >
                            <Eye size={15} />
                          </button>

                          <button
                            onClick={() => openEditModal(service)}
                            className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
                            title="Edit Service"
                          >
                            <Edit3 size={15} />
                          </button>

                          <button
                            onClick={() => handleDuplicate(service)}
                            className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
                            title="Duplicate Service"
                          >
                            <Copy size={15} />
                          </button>

                          <button
                            onClick={() => handleDelete(service.id)}
                            className="rounded-lg border border-rose-100 p-2 text-rose-500 hover:bg-rose-50"
                            title="Delete Service"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredServices.length === 0 && (
                <div className="p-10 text-center">
                  <PackageCheck className="mx-auto text-slate-300" size={42} />

                  <h3 className="mt-3 text-lg font-black text-slate-900">
                    No services found
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Change filters or add a new service.
                  </p>
                </div>
              )}
            </div>
          </div>

          <aside className="min-w-0 space-y-4">
            <div className="rounded-[1.4rem] border border-slate-200 bg-white p-4 shadow-sm 2xl:sticky 2xl:top-6">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-base font-black text-slate-950">
                  Category Overview
                </h3>

                <MoreHorizontal className="text-slate-400" size={18} />
              </div>

              <div className="mt-4 space-y-2">
                {categoryStats.map((item) => (
                  <div
                    key={item.category}
                    className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5"
                  >
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg bg-white p-1.5 text-emerald-700">
                        <Layers3 size={15} />
                      </div>

                      <span className="text-xs font-black text-slate-700">
                        {item.category}
                      </span>
                    </div>

                    <span className="rounded-full bg-white px-2 py-1 text-xs font-black text-slate-500">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.4rem] border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-base font-black text-slate-950">
                Most Used Services
              </h3>

              <div className="mt-4 space-y-2">
                {popularServices.map((service, index) => (
                  <div
                    key={service.id}
                    className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2.5"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-xs font-black text-white">
                        {index + 1}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-xs font-black text-slate-900">
                          {service.name}
                        </p>

                        <p className="text-[11px] text-slate-500">
                          {service.dealsUsed} deals
                        </p>
                      </div>
                    </div>

                    <p className="text-xs font-black text-slate-950">
                      {formatCurrency(service.basePrice, service.currency)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.4rem] border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-base font-black text-slate-950">
                Price Book Snapshot
              </h3>

              <div className="mt-4 space-y-2">
                {billingCycles.slice(0, 5).map((cycle) => (
                  <div key={cycle} className="rounded-xl bg-slate-50 p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-black text-slate-900">
                        {cycle}
                      </p>

                      <span className="rounded-full bg-white px-2 py-1 text-xs font-black text-slate-500">
                        {
                          services.filter(
                            (service) => service.billingCycle === cycle
                          ).length
                        }
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-3 backdrop-blur-sm sm:p-5">
          <form
            onSubmit={handleSubmit}
            className="my-4 flex h-[88vh] w-full max-w-6xl flex-col overflow-hidden rounded-[1.7rem] bg-white shadow-2xl"
          >
            <div className="shrink-0 border-b border-slate-100 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-950">
                    {editingServiceId ? "Edit Service" : "Add New Service"}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Create quote-ready service data with pricing, delivery,
                    catalog visibility and sales rules.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={resetModal}
                  className="rounded-xl bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-5">
              <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
                <div className="space-y-4">
                  <div className="rounded-[1.3rem] border border-slate-200 p-4">
                    <h3 className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500">
                      <PackageCheck size={15} />
                      Service Information
                    </h3>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Service Name"
                        className="sm:col-span-2 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-500"
                      />

                      <input
                        name="sku"
                        value={form.sku}
                        onChange={handleChange}
                        placeholder="Service Code / SKU"
                        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-500"
                      />

                      <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold outline-none focus:border-slate-500"
                      >
                        {categories
                          .filter((category) => category !== "All")
                          .map((category) => (
                            <option key={category}>{category}</option>
                          ))}
                      </select>

                      <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold outline-none focus:border-slate-500"
                      >
                        {statuses
                          .filter((status) => status !== "All")
                          .map((status) => (
                            <option key={status}>{status}</option>
                          ))}
                      </select>

                      <select
                        name="visibility"
                        value={form.visibility}
                        onChange={handleChange}
                        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold outline-none focus:border-slate-500"
                      >
                        {visibilityOptions.map((option) => (
                          <option key={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="rounded-[1.3rem] border border-slate-200 p-4">
                    <h3 className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500">
                      <DollarSign size={15} />
                      Pricing & Billing
                    </h3>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <select
                        name="pricingType"
                        value={form.pricingType}
                        onChange={handleChange}
                        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold outline-none focus:border-slate-500"
                      >
                        {pricingTypes.map((type) => (
                          <option key={type}>{type}</option>
                        ))}
                      </select>

                      <select
                        name="billingCycle"
                        value={form.billingCycle}
                        onChange={handleChange}
                        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold outline-none focus:border-slate-500"
                      >
                        {billingCycles.map((cycle) => (
                          <option key={cycle}>{cycle}</option>
                        ))}
                      </select>

                      <input
                        name="basePrice"
                        type="number"
                        min="0"
                        value={form.basePrice}
                        onChange={handleChange}
                        placeholder="Base Price"
                        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-500"
                      />

                      <input
                        name="cost"
                        type="number"
                        min="0"
                        value={form.cost}
                        onChange={handleChange}
                        placeholder="Internal Cost"
                        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-500"
                      />

                      <input
                        name="taxRate"
                        type="number"
                        min="0"
                        value={form.taxRate}
                        onChange={handleChange}
                        placeholder="Tax Rate %"
                        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-500"
                      />

                      <select
                        name="currency"
                        value={form.currency}
                        onChange={handleChange}
                        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold outline-none focus:border-slate-500"
                      >
                        <option>USD</option>
                        <option>PKR</option>
                        <option>AED</option>
                        <option>GBP</option>
                        <option>EUR</option>
                      </select>
                    </div>
                  </div>

                  <div className="rounded-[1.3rem] border border-slate-200 p-4">
                    <h3 className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500">
                      <Clock3 size={15} />
                      Delivery & Operations
                    </h3>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        name="deliveryTime"
                        type="number"
                        min="1"
                        value={form.deliveryTime}
                        onChange={handleChange}
                        placeholder="Delivery Time"
                        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-500"
                      />

                      <select
                        name="deliveryUnit"
                        value={form.deliveryUnit}
                        onChange={handleChange}
                        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold outline-none focus:border-slate-500"
                      >
                        {deliveryUnits.map((unit) => (
                          <option key={unit}>{unit}</option>
                        ))}
                      </select>

                      <select
                        name="owner"
                        value={form.owner}
                        onChange={handleChange}
                        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold outline-none focus:border-slate-500"
                      >
                        {serviceOwners.map((owner) => (
                          <option key={owner}>{owner}</option>
                        ))}
                      </select>

                      <input
                        name="pipeline"
                        value={form.pipeline}
                        onChange={handleChange}
                        placeholder="Linked Pipeline"
                        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-500"
                      />

                      <input
                        name="sla"
                        value={form.sla}
                        onChange={handleChange}
                        placeholder="SLA / Delivery Promise"
                        className="sm:col-span-2 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-[1.3rem] border border-slate-200 p-4">
                    <h3 className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500">
                      <Tag size={15} />
                      Description & Scope
                    </h3>

                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Service description"
                      className="w-full resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-500"
                    />

                    <textarea
                      name="included"
                      value={form.included}
                      onChange={handleChange}
                      rows={3}
                      placeholder="What is included"
                      className="mt-3 w-full resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-500"
                    />

                    <textarea
                      name="exclusions"
                      value={form.exclusions}
                      onChange={handleChange}
                      rows={3}
                      placeholder="What is excluded"
                      className="mt-3 w-full resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-500"
                    />

                    <input
                      name="addOns"
                      value={form.addOns}
                      onChange={handleChange}
                      placeholder="Add-ons / Upsells"
                      className="mt-3 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-500"
                    />

                    <input
                      name="tags"
                      value={form.tags}
                      onChange={handleChange}
                      placeholder="Tags e.g. seo, monthly, premium"
                      className="mt-3 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-500"
                    />
                  </div>

                  <div className="rounded-[1.3rem] border border-slate-200 p-4">
                    <h3 className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500">
                      <ShieldCheck size={15} />
                      Sales Controls
                    </h3>

                    <div className="space-y-3">
                      <Toggle
                        checked={form.approvalRequired}
                        onChange={(value) => setField("approvalRequired", value)}
                        label="Approval Required"
                        description="Use this for discounts, custom quotes or sensitive services."
                      />

                      <Toggle
                        checked={form.clientFacing}
                        onChange={(value) => setField("clientFacing", value)}
                        label="Client Facing"
                        description="Allow this service to appear in proposals or client portal."
                      />
                    </div>
                  </div>

                  <div className="rounded-[1.3rem] border border-slate-200 bg-slate-50 p-4">
                    <h3 className="text-xs font-black uppercase tracking-wide text-slate-500">
                      Pricing Preview
                    </h3>

                    <div className="mt-3 rounded-2xl bg-white p-4">
                      <p className="text-2xl font-black text-slate-950">
                        {formatCurrency(form.basePrice || 0, form.currency)}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {form.pricingType} • {form.billingCycle}
                      </p>

                      <p className="mt-3 text-sm font-bold text-slate-700">
                        Estimated Margin:{" "}
                        {Number(form.basePrice) > 0
                          ? Math.round(
                              ((Number(form.basePrice || 0) -
                                Number(form.cost || 0)) /
                                Number(form.basePrice || 1)) *
                                100
                            )
                          : 0}
                        %
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Delivery: {form.deliveryTime || 0} {form.deliveryUnit}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="shrink-0 border-t border-slate-100 bg-white p-5">
              <div className="flex flex-col justify-end gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={resetModal}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-black text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-slate-950 px-6 py-2.5 text-sm font-black text-white hover:bg-slate-800"
                >
                  {editingServiceId ? "Update Service" : "Create Service"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="my-8 w-full max-w-5xl rounded-[1.7rem] bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-100">
                  <PackageCheck size={24} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                    {selectedService.id} • {selectedService.sku}
                  </p>

                  <h2 className="mt-1 break-words text-2xl font-black text-slate-950">
                    {selectedService.name}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {selectedService.category} • {selectedService.billingCycle}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedService(null)}
                className="rounded-xl bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["Price", formatCurrency(selectedService.basePrice), DollarSign],
                ["Cost", formatCurrency(selectedService.cost), BarChart3],
                ["Margin", `${selectedService.margin}%`, CheckCircle2],
                ["Pricing Type", selectedService.pricingType, Tag],
                ["Billing Cycle", selectedService.billingCycle, Clock3],
                [
                  "Delivery",
                  `${selectedService.deliveryTime} ${selectedService.deliveryUnit}`,
                  Clock3,
                ],
                ["Owner", selectedService.owner, UserCheck],
                ["Pipeline", selectedService.pipeline || "Not linked", BriefcaseBusiness],
                ["Status", selectedService.status, CheckCircle2],
                ["Visibility", selectedService.visibility, Globe2],
                ["Deals Used", selectedService.dealsUsed, Archive],
                ["Active Clients", selectedService.activeClients, UserCheck],
                ["Revenue", formatCurrency(selectedService.revenue), DollarSign],
                ["Created", formatDate(selectedService.createdAt), Clock3],
                ["Updated", formatDate(selectedService.updatedAt), Clock3],
              ].map(([label, value, Icon]) => (
                <div key={label} className="rounded-xl bg-slate-50 p-3">
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

            <div className="mt-5 grid gap-3 lg:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-black uppercase text-slate-400">
                  Description
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {selectedService.description || "No description added."}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-black uppercase text-slate-400">
                  SLA
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {selectedService.sla || "No SLA added."}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-black uppercase text-slate-400">
                  Included
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {selectedService.included || "No included scope added."}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-black uppercase text-slate-400">
                  Exclusions
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {selectedService.exclusions || "No exclusions added."}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-black text-slate-700 hover:bg-slate-50"
                onClick={() => setSelectedService(null)}
              >
                Close
              </button>

              <button
                onClick={() => {
                  setSelectedService(null);
                  openEditModal(selectedService);
                }}
                className="flex-1 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-black text-white hover:bg-slate-800"
              >
                Edit Service
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Services;