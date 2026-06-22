import { useEffect, useMemo, useState } from "react";
import PageTitle from "../components/PageTitle";
import {
  AlertTriangle,
  BellRing,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronRight,
  DatabaseBackup,
  Download,
  Eye,
  FileClock,
  Globe2,
  KeyRound,
  Layers3,
  LockKeyhole,
  Mail,
  Palette,
  RefreshCcw,
  Save,
  ShieldCheck,
  SlidersHorizontal,
  Trash2,
  Upload,
  UserCog,
  UsersRound,
  WalletCards,
  X,
} from "lucide-react";

const STORAGE_KEY = "crm-production-settings";

const tabs = [
  { key: "company", label: "Company", icon: Building2 },
  { key: "preferences", label: "Preferences", icon: SlidersHorizontal },
  { key: "roles", label: "Roles", icon: ShieldCheck },
  { key: "notifications", label: "Notifications", icon: BellRing },
  { key: "security", label: "Security", icon: LockKeyhole },
  { key: "pipeline", label: "Pipeline", icon: Layers3 },
  { key: "data", label: "Data", icon: DatabaseBackup },
];

const permissionGroups = [
  {
    key: "leads",
    label: "Leads",
    permissions: ["View", "Create", "Edit", "Delete", "Convert"],
  },
  {
    key: "customers",
    label: "Customers",
    permissions: ["View", "Create", "Edit", "Delete", "Payments"],
  },
  {
    key: "deals",
    label: "Deals",
    permissions: ["View", "Create", "Edit", "Delete", "Won/Lost"],
  },
  {
    key: "tasks",
    label: "Tasks",
    permissions: ["View", "Create", "Edit", "Delete", "Reassign"],
  },
  {
    key: "reports",
    label: "Reports",
    permissions: ["View", "Export"],
  },
  {
    key: "settings",
    label: "Settings",
    permissions: ["View", "Edit"],
  },
];

const initialSettings = {
  companyName: "Ardrixas Agency",
  adminEmail: "admin@example.com",
  phone: "0300-1234567",
  website: "https://example.com",
  address: "Renala Khurd, Pakistan",
  defaultCurrency: "PKR",
  timezone: "Asia/Karachi",
  dateFormat: "DD MMM YYYY",
  fiscalYearStart: "January",
  defaultLeadStatus: "New",
  defaultDealStage: "Requirement Taken",
  defaultTaskStatus: "To Do",
  defaultOwner: "Admin",
  autoFollowUpDays: "2",
  dealProbabilityMode: "Auto by stage",
  duplicateCheck: true,
  autoAssignLeads: false,
  showRevenueInReports: true,
  enableDarkModePreference: true,
  emailNotifications: true,
  desktopNotifications: true,
  followUpReminders: true,
  taskReminders: true,
  paymentReminders: true,
  dealAlerts: true,
  weeklyReportEmail: true,
  twoFactorAuth: false,
  sessionTimeout: "30",
  passwordExpiry: "90",
  loginAlerts: true,
  allowExport: true,
  auditLogs: true,
  backupFrequency: "Weekly",
};

const initialRoles = [
  {
    id: 1,
    name: "Admin",
    description: "Full access to all CRM modules and settings.",
    permissions: {
      leads: ["View", "Create", "Edit", "Delete", "Convert"],
      customers: ["View", "Create", "Edit", "Delete", "Payments"],
      deals: ["View", "Create", "Edit", "Delete", "Won/Lost"],
      tasks: ["View", "Create", "Edit", "Delete", "Reassign"],
      reports: ["View", "Export"],
      settings: ["View", "Edit"],
    },
  },
  {
    id: 2,
    name: "Manager",
    description: "Manage sales activity, team tasks, customers, and reports.",
    permissions: {
      leads: ["View", "Create", "Edit", "Convert"],
      customers: ["View", "Create", "Edit", "Payments"],
      deals: ["View", "Create", "Edit", "Won/Lost"],
      tasks: ["View", "Create", "Edit", "Reassign"],
      reports: ["View", "Export"],
      settings: ["View"],
    },
  },
  {
    id: 3,
    name: "Sales Agent",
    description: "Handle assigned leads, follow-ups, deals, and tasks.",
    permissions: {
      leads: ["View", "Create", "Edit"],
      customers: ["View"],
      deals: ["View", "Create", "Edit"],
      tasks: ["View", "Create", "Edit"],
      reports: ["View"],
      settings: [],
    },
  },
];

const initialUsers = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@example.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: 2,
    name: "Sales Manager",
    email: "manager@example.com",
    role: "Manager",
    status: "Active",
  },
  {
    id: 3,
    name: "Sales Agent",
    email: "sales@example.com",
    role: "Sales Agent",
    status: "Active",
  },
];

const initialPipelineStages = [
  { id: 1, name: "Requirement Taken", probability: 20 },
  { id: 2, name: "Proposal Sent", probability: 40 },
  { id: 3, name: "Negotiation", probability: 70 },
  { id: 4, name: "Won", probability: 100 },
  { id: 5, name: "Lost", probability: 0 },
];

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function getCurrentTime() {
  return new Date().toTimeString().slice(0, 5);
}

function getSavedState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return null;
    }

    return JSON.parse(saved);
  } catch {
    return null;
  }
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

function ConfirmModal({ title, message, confirmText, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/50 px-4">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
            <AlertTriangle className="h-6 w-6" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-950 dark:text-white">
              {title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              {message}
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
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

function SectionCard({ title, subtitle, icon, children, right }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
            {icon}
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-950 dark:text-white">
              {title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          </div>
        </div>

        {right}
      </div>

      <div className="p-5">{children}</div>
    </div>
  );
}

function TabButton({ tab, active, onClick }) {
  const Icon = tab.icon;

  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
        active
          ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
          : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
      }`}
    >
      <span className="flex items-center gap-3">
        <Icon className="h-4 w-4" />
        {tab.label}
      </span>

      <ChevronRight className="h-4 w-4 opacity-60" />
    </button>
  );
}

function TextInput({ label, name, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-950"
      />
    </div>
  );
}

function SelectInput({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-950"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}

function TextAreaInput({ label, name, value, onChange, placeholder }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </label>

      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="min-h-[120px] w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-950"
      />
    </div>
  );
}

function ToggleSwitch({ label, description, checked, onChange }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
      <div>
        <p className="text-sm font-bold text-slate-950 dark:text-white">
          {label}
        </p>
        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={onChange}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-slate-950 dark:bg-white" : "bg-slate-300 dark:bg-slate-700"
        }`}
        aria-label={label}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition dark:bg-slate-950 ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

function PermissionCell({ enabled, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border transition ${
        enabled
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-slate-200 bg-slate-50 text-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-600"
      }`}
    >
      {enabled ? <CheckCircle2 className="h-4 w-4" /> : <X className="h-4 w-4" />}
    </button>
  );
}

function Settings() {
  const savedState = getSavedState();

  const [activeTab, setActiveTab] = useState("company");
  const [settings, setSettings] = useState(savedState?.settings || initialSettings);
  const [roles, setRoles] = useState(savedState?.roles || initialRoles);
  const [users] = useState(savedState?.users || initialUsers);
  const [pipelineStages, setPipelineStages] = useState(
    savedState?.pipelineStages || initialPipelineStages
  );
  const [newStageName, setNewStageName] = useState("");
  const [newStageProbability, setNewStageProbability] = useState("10");
  const [toast, setToast] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [auditLog, setAuditLog] = useState(
    savedState?.auditLog || [
      {
        id: 1,
        action: "Settings initialized",
        by: "Admin",
        date: getToday(),
        time: getCurrentTime(),
      },
    ]
  );

  const settingsSummary = useMemo(() => {
    return [
      {
        title: "Company",
        value: settings.companyName || "Not Set",
        icon: <Building2 className="h-5 w-5" />,
      },
      {
        title: "Currency",
        value: settings.defaultCurrency,
        icon: <WalletCards className="h-5 w-5" />,
      },
      {
        title: "Timezone",
        value: settings.timezone,
        icon: <Globe2 className="h-5 w-5" />,
      },
      {
        title: "Roles",
        value: `${roles.length} roles`,
        icon: <ShieldCheck className="h-5 w-5" />,
      },
    ];
  }, [settings, roles]);

  useEffect(() => {
    const payload = {
      settings,
      roles,
      users,
      pipelineStages,
      auditLog,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [settings, roles, users, pipelineStages, auditLog]);

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  function addAudit(action) {
    setAuditLog((previous) => [
      {
        id: Date.now(),
        action,
        by: "Admin",
        date: getToday(),
        time: getCurrentTime(),
      },
      ...previous,
    ]);
  }

  function handleSettingChange(event) {
    const { name, value } = event.target;
    setSettings((previous) => ({ ...previous, [name]: value }));
  }

  function handleToggle(name) {
    setSettings((previous) => ({ ...previous, [name]: !previous[name] }));
  }

  function handleSave() {
    addAudit("Settings saved");
    showToast("Settings saved successfully.");
  }

  function handleReset() {
    setSettings(initialSettings);
    setRoles(initialRoles);
    setPipelineStages(initialPipelineStages);
    setAuditLog([
      {
        id: Date.now(),
        action: "Settings reset to default",
        by: "Admin",
        date: getToday(),
        time: getCurrentTime(),
      },
    ]);
    setConfirmReset(false);
    showToast("Settings reset successfully.", "info");
  }

  function togglePermission(roleId, groupKey, permission) {
    setRoles((previous) =>
      previous.map((role) => {
        if (role.id !== roleId) return role;

        const currentPermissions = role.permissions[groupKey] || [];
        const hasPermission = currentPermissions.includes(permission);

        const updatedPermissions = hasPermission
          ? currentPermissions.filter((item) => item !== permission)
          : [...currentPermissions, permission];

        return {
          ...role,
          permissions: {
            ...role.permissions,
            [groupKey]: updatedPermissions,
          },
        };
      })
    );

    addAudit(`Permission updated for ${permission}`);
  }

  function handleStageChange(id, field, value) {
    setPipelineStages((previous) =>
      previous.map((stage) =>
        stage.id === id
          ? {
              ...stage,
              [field]: field === "probability" ? Number(value || 0) : value,
            }
          : stage
      )
    );
  }

  function addPipelineStage() {
    if (!newStageName.trim()) return;

    setPipelineStages((previous) => [
      ...previous,
      {
        id: Date.now(),
        name: newStageName.trim(),
        probability: Number(newStageProbability || 0),
      },
    ]);

    setNewStageName("");
    setNewStageProbability("10");
    addAudit(`Pipeline stage added: ${newStageName}`);
    showToast("Pipeline stage added successfully.");
  }

  function removePipelineStage(id) {
    setPipelineStages((previous) => previous.filter((stage) => stage.id !== id));
    addAudit("Pipeline stage removed");
    showToast("Pipeline stage removed.", "error");
  }

  function exportSettings() {
    const payload = {
      settings,
      roles,
      users,
      pipelineStages,
      auditLog,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "crm-settings-backup.json";
    link.click();

    URL.revokeObjectURL(url);
    addAudit("Settings exported");
    showToast("Settings exported successfully.", "info");
  }

  return (
    <div className="w-full max-w-full">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <PageTitle
          title="Settings"
          subtitle="Manage CRM preferences, roles, permissions, security, notifications, and data controls"
        />

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setConfirmReset(true)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            <RefreshCcw className="h-4 w-4" />
            Reset
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            <Save className="h-4 w-4" />
            Save Settings
          </button>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {settingsSummary.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {item.title}
                </p>
                <p className="mt-2 truncate text-xl font-bold text-slate-950 dark:text-white">
                  {item.value}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[280px_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="mb-3 px-3 py-2">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Settings Menu
            </p>
          </div>

          <div className="space-y-1">
            {tabs.map((tab) => (
              <TabButton
                key={tab.key}
                tab={tab}
                active={activeTab === tab.key}
                onClick={() => setActiveTab(tab.key)}
              />
            ))}
          </div>
        </div>

        <div className="space-y-5">
          {activeTab === "company" && (
            <>
              <SectionCard
                title="Company Profile"
                subtitle="Basic business identity and contact information"
                icon={<Building2 className="h-5 w-5" />}
              >
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <TextInput
                    label="Company Name"
                    name="companyName"
                    value={settings.companyName}
                    onChange={handleSettingChange}
                    placeholder="Enter company name"
                  />

                  <TextInput
                    label="Admin Email"
                    name="adminEmail"
                    value={settings.adminEmail}
                    onChange={handleSettingChange}
                    placeholder="admin@example.com"
                  />

                  <TextInput
                    label="Phone"
                    name="phone"
                    value={settings.phone}
                    onChange={handleSettingChange}
                    placeholder="0300-1234567"
                  />

                  <TextInput
                    label="Website"
                    name="website"
                    value={settings.website}
                    onChange={handleSettingChange}
                    placeholder="https://example.com"
                  />

                  <div className="md:col-span-2">
                    <TextAreaInput
                      label="Business Address"
                      name="address"
                      value={settings.address}
                      onChange={handleSettingChange}
                      placeholder="Enter business address"
                    />
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                title="Localization"
                subtitle="Currency, timezone, date format, and fiscal settings"
                icon={<Globe2 className="h-5 w-5" />}
              >
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                  <SelectInput
                    label="Default Currency"
                    name="defaultCurrency"
                    value={settings.defaultCurrency}
                    onChange={handleSettingChange}
                    options={["PKR", "USD", "AED", "SAR", "GBP", "EUR"]}
                  />

                  <SelectInput
                    label="Timezone"
                    name="timezone"
                    value={settings.timezone}
                    onChange={handleSettingChange}
                    options={[
                      "Asia/Karachi",
                      "Asia/Dubai",
                      "Asia/Riyadh",
                      "Europe/London",
                      "America/New_York",
                    ]}
                  />

                  <SelectInput
                    label="Date Format"
                    name="dateFormat"
                    value={settings.dateFormat}
                    onChange={handleSettingChange}
                    options={["DD MMM YYYY", "MM/DD/YYYY", "YYYY-MM-DD"]}
                  />

                  <SelectInput
                    label="Fiscal Year Start"
                    name="fiscalYearStart"
                    value={settings.fiscalYearStart}
                    onChange={handleSettingChange}
                    options={[
                      "January",
                      "April",
                      "July",
                      "October",
                    ]}
                  />
                </div>
              </SectionCard>
            </>
          )}

          {activeTab === "preferences" && (
            <>
              <SectionCard
                title="CRM Defaults"
                subtitle="Default values used when creating new records"
                icon={<SlidersHorizontal className="h-5 w-5" />}
              >
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                  <SelectInput
                    label="Default Lead Status"
                    name="defaultLeadStatus"
                    value={settings.defaultLeadStatus}
                    onChange={handleSettingChange}
                    options={["New", "Contacted", "Interested", "Not Interested", "Closed"]}
                  />

                  <SelectInput
                    label="Default Deal Stage"
                    name="defaultDealStage"
                    value={settings.defaultDealStage}
                    onChange={handleSettingChange}
                    options={pipelineStages.map((stage) => stage.name)}
                  />

                  <SelectInput
                    label="Default Task Status"
                    name="defaultTaskStatus"
                    value={settings.defaultTaskStatus}
                    onChange={handleSettingChange}
                    options={["Backlog", "To Do", "In Progress", "Review", "Completed", "Blocked"]}
                  />

                  <TextInput
                    label="Default Owner"
                    name="defaultOwner"
                    value={settings.defaultOwner}
                    onChange={handleSettingChange}
                    placeholder="Admin"
                  />

                  <TextInput
                    label="Auto Follow-up Days"
                    name="autoFollowUpDays"
                    value={settings.autoFollowUpDays}
                    onChange={handleSettingChange}
                    placeholder="2"
                    type="number"
                  />

                  <SelectInput
                    label="Deal Probability Mode"
                    name="dealProbabilityMode"
                    value={settings.dealProbabilityMode}
                    onChange={handleSettingChange}
                    options={["Auto by stage", "Manual only"]}
                  />
                </div>
              </SectionCard>

              <SectionCard
                title="Automation Preferences"
                subtitle="Control smart CRM behaviors and record handling"
                icon={<Palette className="h-5 w-5" />}
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <ToggleSwitch
                    label="Duplicate Check"
                    description="Warn users when a lead or customer with the same phone or email already exists."
                    checked={settings.duplicateCheck}
                    onChange={() => handleToggle("duplicateCheck")}
                  />

                  <ToggleSwitch
                    label="Auto Assign Leads"
                    description="Automatically assign new leads to the default owner or sales team."
                    checked={settings.autoAssignLeads}
                    onChange={() => handleToggle("autoAssignLeads")}
                  />

                  <ToggleSwitch
                    label="Show Revenue in Reports"
                    description="Display revenue, pipeline value, and payment summaries inside reports."
                    checked={settings.showRevenueInReports}
                    onChange={() => handleToggle("showRevenueInReports")}
                  />

                  <ToggleSwitch
                    label="Theme Preference Control"
                    description="Allow users to use light and dark mode across the CRM interface."
                    checked={settings.enableDarkModePreference}
                    onChange={() => handleToggle("enableDarkModePreference")}
                  />
                </div>
              </SectionCard>
            </>
          )}

          {activeTab === "roles" && (
            <>
              <SectionCard
                title="Users"
                subtitle="Team members and assigned roles"
                icon={<UsersRound className="h-5 w-5" />}
              >
                <div className="w-full overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
                        <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                          User
                        </th>
                        <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                          Email
                        </th>
                        <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                          Role
                        </th>
                        <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {users.map((user) => (
                        <tr
                          key={user.id}
                          className="border-b border-slate-100 dark:border-slate-800"
                        >
                          <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                            {user.name}
                          </td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                            {user.email}
                          </td>
                          <td className="px-4 py-3">
                            <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                              {user.role}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                              {user.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </SectionCard>

              <SectionCard
                title="Roles and Permissions"
                subtitle="Control module access for each role"
                icon={<ShieldCheck className="h-5 w-5" />}
              >
                <div className="space-y-6">
                  {roles.map((role) => (
                    <div
                      key={role.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900"
                    >
                      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h4 className="text-base font-bold text-slate-950 dark:text-white">
                            {role.name}
                          </h4>
                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {role.description}
                          </p>
                        </div>

                        <span className="rounded-lg bg-white px-3 py-1 text-xs font-bold text-slate-500 dark:bg-slate-950 dark:text-slate-300">
                          {Object.values(role.permissions).flat().length} permissions
                        </span>
                      </div>

                      <div className="w-full overflow-x-auto">
                        <table className="w-full min-w-[860px] text-left text-sm">
                          <thead>
                            <tr>
                              <th className="px-3 py-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                                Module
                              </th>

                              {Array.from(
                                new Set(permissionGroups.flatMap((group) => group.permissions))
                              ).map((permission) => (
                                <th
                                  key={permission}
                                  className="px-3 py-2 text-center text-xs font-bold uppercase tracking-wide text-slate-500"
                                >
                                  {permission}
                                </th>
                              ))}
                            </tr>
                          </thead>

                          <tbody>
                            {permissionGroups.map((group) => {
                              const allPermissions = Array.from(
                                new Set(permissionGroups.flatMap((item) => item.permissions))
                              );

                              return (
                                <tr
                                  key={group.key}
                                  className="border-t border-slate-200 dark:border-slate-800"
                                >
                                  <td className="px-3 py-3 font-semibold text-slate-900 dark:text-white">
                                    {group.label}
                                  </td>

                                  {allPermissions.map((permission) => {
                                    const isApplicable = group.permissions.includes(permission);
                                    const enabled =
                                      role.permissions[group.key]?.includes(permission);

                                    return (
                                      <td key={permission} className="px-3 py-3 text-center">
                                        {isApplicable ? (
                                          <PermissionCell
                                            enabled={enabled}
                                            onClick={() =>
                                              togglePermission(
                                                role.id,
                                                group.key,
                                                permission
                                              )
                                            }
                                          />
                                        ) : (
                                          <span className="text-slate-300 dark:text-slate-700">
                                            —
                                          </span>
                                        )}
                                      </td>
                                    );
                                  })}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </>
          )}

          {activeTab === "notifications" && (
            <SectionCard
              title="Notification Settings"
              subtitle="Control alerts for follow-ups, tasks, payments, and reports"
              icon={<BellRing className="h-5 w-5" />}
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <ToggleSwitch
                  label="Email Notifications"
                  description="Send important CRM alerts to the admin and assigned users by email."
                  checked={settings.emailNotifications}
                  onChange={() => handleToggle("emailNotifications")}
                />

                <ToggleSwitch
                  label="Desktop Notifications"
                  description="Show browser notifications for important CRM activities."
                  checked={settings.desktopNotifications}
                  onChange={() => handleToggle("desktopNotifications")}
                />

                <ToggleSwitch
                  label="Follow-up Reminders"
                  description="Notify users before scheduled calls, WhatsApp messages, emails, and meetings."
                  checked={settings.followUpReminders}
                  onChange={() => handleToggle("followUpReminders")}
                />

                <ToggleSwitch
                  label="Task Reminders"
                  description="Notify assignees when tasks are due soon or overdue."
                  checked={settings.taskReminders}
                  onChange={() => handleToggle("taskReminders")}
                />

                <ToggleSwitch
                  label="Payment Reminders"
                  description="Alert admin when customer payments are pending or overdue."
                  checked={settings.paymentReminders}
                  onChange={() => handleToggle("paymentReminders")}
                />

                <ToggleSwitch
                  label="Deal Alerts"
                  description="Notify sales users when a deal stage changes or closing date is near."
                  checked={settings.dealAlerts}
                  onChange={() => handleToggle("dealAlerts")}
                />

                <ToggleSwitch
                  label="Weekly Report Email"
                  description="Send a weekly CRM summary with leads, deals, revenue, and tasks."
                  checked={settings.weeklyReportEmail}
                  onChange={() => handleToggle("weeklyReportEmail")}
                />
              </div>
            </SectionCard>
          )}

          {activeTab === "security" && (
            <>
              <SectionCard
                title="Security Controls"
                subtitle="Protect CRM access and user sessions"
                icon={<LockKeyhole className="h-5 w-5" />}
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <ToggleSwitch
                    label="Two-Factor Authentication"
                    description="Require an extra verification step when users sign in."
                    checked={settings.twoFactorAuth}
                    onChange={() => handleToggle("twoFactorAuth")}
                  />

                  <ToggleSwitch
                    label="Login Alerts"
                    description="Send an alert when a new device or location signs in."
                    checked={settings.loginAlerts}
                    onChange={() => handleToggle("loginAlerts")}
                  />

                  <ToggleSwitch
                    label="Allow Data Export"
                    description="Allow permitted users to export reports and backups."
                    checked={settings.allowExport}
                    onChange={() => handleToggle("allowExport")}
                  />

                  <ToggleSwitch
                    label="Audit Logs"
                    description="Track important user actions such as edits, exports, and permission changes."
                    checked={settings.auditLogs}
                    onChange={() => handleToggle("auditLogs")}
                  />
                </div>
              </SectionCard>

              <SectionCard
                title="Session and Password Policy"
                subtitle="Control session timeout and password expiry"
                icon={<KeyRound className="h-5 w-5" />}
              >
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <TextInput
                    label="Session Timeout Minutes"
                    name="sessionTimeout"
                    value={settings.sessionTimeout}
                    onChange={handleSettingChange}
                    placeholder="30"
                    type="number"
                  />

                  <TextInput
                    label="Password Expiry Days"
                    name="passwordExpiry"
                    value={settings.passwordExpiry}
                    onChange={handleSettingChange}
                    placeholder="90"
                    type="number"
                  />
                </div>
              </SectionCard>
            </>
          )}

          {activeTab === "pipeline" && (
            <SectionCard
              title="Deal Pipeline Stages"
              subtitle="Manage deal stages and default probability"
              icon={<BriefcaseBusiness className="h-5 w-5" />}
            >
              <div className="space-y-3">
                {pipelineStages.map((stage) => (
                  <div
                    key={stage.id}
                    className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900 md:grid-cols-[1fr_160px_auto]"
                  >
                    <input
                      value={stage.name}
                      onChange={(event) =>
                        handleStageChange(stage.id, "name", event.target.value)
                      }
                      className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />

                    <input
                      type="number"
                      value={stage.probability}
                      onChange={(event) =>
                        handleStageChange(
                          stage.id,
                          "probability",
                          event.target.value
                        )
                      }
                      min="0"
                      max="100"
                      className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />

                    <button
                      onClick={() => removePipelineStage(stage.id)}
                      className="flex items-center justify-center rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 rounded-2xl border border-dashed border-slate-300 p-4 dark:border-slate-700 md:grid-cols-[1fr_160px_auto]">
                <input
                  value={newStageName}
                  onChange={(event) => setNewStageName(event.target.value)}
                  placeholder="New stage name"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                />

                <input
                  type="number"
                  value={newStageProbability}
                  onChange={(event) => setNewStageProbability(event.target.value)}
                  placeholder="Probability"
                  min="0"
                  max="100"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                />

                <button
                  onClick={addPipelineStage}
                  className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                >
                  Add Stage
                </button>
              </div>
            </SectionCard>
          )}

          {activeTab === "data" && (
            <>
              <SectionCard
                title="Data Management"
                subtitle="Backup, export, import, and restore CRM settings"
                icon={<DatabaseBackup className="h-5 w-5" />}
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <button
                    onClick={exportSettings}
                    className="flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-5 py-4 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
                  >
                    <Download className="h-4 w-4" />
                    Export Settings
                  </button>

                  <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
                    <Upload className="h-4 w-4" />
                    Import Backup
                  </button>

                  <button className="flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100">
                    <DatabaseBackup className="h-4 w-4" />
                    Create Backup
                  </button>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                  <SelectInput
                    label="Backup Frequency"
                    name="backupFrequency"
                    value={settings.backupFrequency}
                    onChange={handleSettingChange}
                    options={["Daily", "Weekly", "Monthly", "Manual only"]}
                  />

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Last Backup
                    </p>
                    <p className="mt-2 text-sm font-bold text-slate-950 dark:text-white">
                      No cloud backup connected
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Connect backend storage later for automated backups.
                    </p>
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                title="Audit Log"
                subtitle="Recent settings and permission changes"
                icon={<FileClock className="h-5 w-5" />}
              >
                <div className="space-y-3">
                  {auditLog.slice(0, 8).map((log) => (
                    <div
                      key={log.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900"
                    >
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          {log.action}
                        </p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          By {log.by} • {log.date} • {log.time}
                        </p>
                      </div>

                      <Eye className="h-4 w-4 text-slate-400" />
                    </div>
                  ))}
                </div>
              </SectionCard>
            </>
          )}
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {confirmReset && (
        <ConfirmModal
          title="Reset Settings?"
          message="This will restore company settings, roles, permissions, and pipeline stages to default values."
          confirmText="Reset Settings"
          onConfirm={handleReset}
          onCancel={() => setConfirmReset(false)}
        />
      )}
    </div>
  );
}

export default Settings;