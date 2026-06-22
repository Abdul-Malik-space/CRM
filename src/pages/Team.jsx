import { useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  Award,
  BarChart3,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  ClipboardCheck,
  Edit3,
  Eye,
  Filter,
  Globe2,
  History,
  KeyRound,
  Laptop,
  LockKeyhole,
  Mail,
  MessageCircle,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  Target,
  Trash2,
  TrendingDown,
  TrendingUp,
  Trophy,
  UserCheck,
  UserCog,
  UserPlus,
  Users,
  X,
} from "lucide-react";

const departments = [
  "All",
  "Sales",
  "Support",
  "Marketing",
  "Operations",
  "Finance",
  "Management",
];

const roles = [
  "All",
  "Super Admin",
  "Admin",
  "Sales Manager",
  "Sales Agent",
  "Support Agent",
  "Marketing User",
  "Finance User",
  "Viewer",
];

const statuses = ["All", "Active", "Invited", "Suspended", "Inactive"];

const permissionModules = [
  "Dashboard",
  "Leads",
  "Customers",
  "Deals",
  "Proposals",
  "Payments",
  "Projects",
  "Tasks",
  "Documents",
  "Reports",
  "Automations",
  "Settings",
];

const permissionActions = ["View", "Create", "Edit", "Delete", "Export"];

const profileTabs = [
  "Overview",
  "Performance",
  "Previous Performance",
  "Activity Timeline",
  "Permissions",
  "Security",
];

const rolePermissions = {
  "Super Admin": {
    level: "Full system access",
    modules: "All modules",
    color: "bg-slate-950 text-white ring-slate-950",
    recommendedOwner: "System Owner",
  },
  Admin: {
    level: "Manage users and CRM data",
    modules: "Most modules",
    color: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    recommendedOwner: "Operations Head",
  },
  "Sales Manager": {
    level: "Manage sales team and pipeline",
    modules: "Leads, Deals, Reports",
    color: "bg-blue-50 text-blue-700 ring-blue-200",
    recommendedOwner: "Sales Head",
  },
  "Sales Agent": {
    level: "Work assigned leads and deals",
    modules: "Leads, Customers, Deals",
    color: "bg-cyan-50 text-cyan-700 ring-cyan-200",
    recommendedOwner: "Sales Manager",
  },
  "Support Agent": {
    level: "Manage client support tasks",
    modules: "Customers, Tasks, Projects",
    color: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    recommendedOwner: "Support Manager",
  },
  "Marketing User": {
    level: "Manage campaigns and communication",
    modules: "Leads, Communications, Reports",
    color: "bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200",
    recommendedOwner: "Marketing Lead",
  },
  "Finance User": {
    level: "Manage invoices and payments",
    modules: "Payments, Proposals, Reports",
    color: "bg-amber-50 text-amber-700 ring-amber-200",
    recommendedOwner: "Finance Manager",
  },
  Viewer: {
    level: "Read-only access",
    modules: "Limited modules",
    color: "bg-slate-100 text-slate-600 ring-slate-200",
    recommendedOwner: "Admin",
  },
};

const demoMembers = [
  {
    id: "USR-1001",
    name: "Ahsan Ali",
    email: "ahsan@example.com",
    phone: "+92 300 1111111",
    role: "Sales Manager",
    department: "Sales",
    status: "Active",
    location: "Lahore",
    timezone: "PKT",
    joined: "2026-01-12",
    lastActive: "12 minutes ago",
    twoFactor: true,
    ipRestricted: false,
    seatType: "Paid Seat",
    manager: "Admin User",
    avatar: "AA",
    performanceHistory: [
      {
        month: "Jun 2026",
        target: 2000000,
        revenue: 1850000,
        assignedLeads: 42,
        contactedLeads: 38,
        qualifiedLeads: 22,
        dealsCreated: 16,
        closedDeals: 8,
        tasksAssigned: 34,
        tasksCompleted: 31,
        followupsCompleted: 41,
        followupsMissed: 3,
        avgResponseMinutes: 24,
        customerRating: 4.7,
        ticketsResolved: 0,
        invoicesProcessed: 0,
        collectionsRecovered: 0,
        reconciliations: 0,
      },
      {
        month: "May 2026",
        target: 1800000,
        revenue: 1520000,
        assignedLeads: 39,
        contactedLeads: 34,
        qualifiedLeads: 19,
        dealsCreated: 13,
        closedDeals: 6,
        tasksAssigned: 31,
        tasksCompleted: 27,
        followupsCompleted: 36,
        followupsMissed: 6,
        avgResponseMinutes: 36,
        customerRating: 4.4,
        ticketsResolved: 0,
        invoicesProcessed: 0,
        collectionsRecovered: 0,
        reconciliations: 0,
      },
      {
        month: "Apr 2026",
        target: 1700000,
        revenue: 1310000,
        assignedLeads: 35,
        contactedLeads: 29,
        qualifiedLeads: 16,
        dealsCreated: 10,
        closedDeals: 5,
        tasksAssigned: 28,
        tasksCompleted: 24,
        followupsCompleted: 30,
        followupsMissed: 8,
        avgResponseMinutes: 41,
        customerRating: 4.2,
        ticketsResolved: 0,
        invoicesProcessed: 0,
        collectionsRecovered: 0,
        reconciliations: 0,
      },
    ],
    activityTimeline: [
      {
        date: "2026-06-18",
        title: "Closed deal with Nova Builders",
        description: "Revenue added and deal marked as won.",
        type: "Deal",
      },
      {
        date: "2026-06-17",
        title: "Completed 8 follow-ups",
        description: "No missed follow-ups for assigned hot leads.",
        type: "Follow-up",
      },
      {
        date: "2026-06-15",
        title: "Qualified 4 leads",
        description: "Moved qualified leads to proposal stage.",
        type: "Lead",
      },
    ],
  },
  {
    id: "USR-1002",
    name: "Sara Khan",
    email: "sara@example.com",
    phone: "+92 300 2222222",
    role: "Support Agent",
    department: "Support",
    status: "Active",
    location: "Karachi",
    timezone: "PKT",
    joined: "2026-02-03",
    lastActive: "1 hour ago",
    twoFactor: true,
    ipRestricted: true,
    seatType: "Paid Seat",
    manager: "Ahsan Ali",
    avatar: "SK",
    performanceHistory: [
      {
        month: "Jun 2026",
        target: 500000,
        revenue: 420000,
        assignedLeads: 8,
        contactedLeads: 8,
        qualifiedLeads: 4,
        dealsCreated: 3,
        closedDeals: 2,
        tasksAssigned: 42,
        tasksCompleted: 37,
        followupsCompleted: 29,
        followupsMissed: 4,
        avgResponseMinutes: 18,
        customerRating: 4.8,
        ticketsResolved: 56,
        invoicesProcessed: 0,
        collectionsRecovered: 0,
        reconciliations: 0,
      },
      {
        month: "May 2026",
        target: 450000,
        revenue: 360000,
        assignedLeads: 6,
        contactedLeads: 6,
        qualifiedLeads: 3,
        dealsCreated: 2,
        closedDeals: 1,
        tasksAssigned: 39,
        tasksCompleted: 33,
        followupsCompleted: 24,
        followupsMissed: 7,
        avgResponseMinutes: 28,
        customerRating: 4.5,
        ticketsResolved: 47,
        invoicesProcessed: 0,
        collectionsRecovered: 0,
        reconciliations: 0,
      },
      {
        month: "Apr 2026",
        target: 400000,
        revenue: 315000,
        assignedLeads: 5,
        contactedLeads: 5,
        qualifiedLeads: 2,
        dealsCreated: 2,
        closedDeals: 1,
        tasksAssigned: 35,
        tasksCompleted: 30,
        followupsCompleted: 21,
        followupsMissed: 6,
        avgResponseMinutes: 33,
        customerRating: 4.3,
        ticketsResolved: 41,
        invoicesProcessed: 0,
        collectionsRecovered: 0,
        reconciliations: 0,
      },
    ],
    activityTimeline: [
      {
        date: "2026-06-18",
        title: "Resolved 12 support tickets",
        description: "Average response time improved to 18 minutes.",
        type: "Support",
      },
      {
        date: "2026-06-16",
        title: "Client satisfaction improved",
        description: "Customer rating reached 4.8/5 this month.",
        type: "Rating",
      },
      {
        date: "2026-06-14",
        title: "Escalation handled",
        description: "Resolved priority customer issue without SLA breach.",
        type: "Task",
      },
    ],
  },
  {
    id: "USR-1003",
    name: "Bilal Ahmed",
    email: "bilal@example.com",
    phone: "+92 300 3333333",
    role: "Sales Agent",
    department: "Sales",
    status: "Invited",
    location: "Islamabad",
    timezone: "PKT",
    joined: "2026-06-17",
    lastActive: "Invitation pending",
    twoFactor: false,
    ipRestricted: false,
    seatType: "Paid Seat",
    manager: "Ahsan Ali",
    avatar: "BA",
    performanceHistory: [
      {
        month: "Jun 2026",
        target: 800000,
        revenue: 0,
        assignedLeads: 12,
        contactedLeads: 0,
        qualifiedLeads: 0,
        dealsCreated: 0,
        closedDeals: 0,
        tasksAssigned: 4,
        tasksCompleted: 0,
        followupsCompleted: 0,
        followupsMissed: 0,
        avgResponseMinutes: 0,
        customerRating: 0,
        ticketsResolved: 0,
        invoicesProcessed: 0,
        collectionsRecovered: 0,
        reconciliations: 0,
      },
      {
        month: "May 2026",
        target: 0,
        revenue: 0,
        assignedLeads: 0,
        contactedLeads: 0,
        qualifiedLeads: 0,
        dealsCreated: 0,
        closedDeals: 0,
        tasksAssigned: 0,
        tasksCompleted: 0,
        followupsCompleted: 0,
        followupsMissed: 0,
        avgResponseMinutes: 0,
        customerRating: 0,
        ticketsResolved: 0,
        invoicesProcessed: 0,
        collectionsRecovered: 0,
        reconciliations: 0,
      },
    ],
    activityTimeline: [
      {
        date: "2026-06-17",
        title: "Invitation created",
        description: "Waiting for user to activate CRM account.",
        type: "Invite",
      },
    ],
  },
  {
    id: "USR-1004",
    name: "Malik Khan",
    email: "malik@example.com",
    phone: "+92 300 4444444",
    role: "Finance User",
    department: "Finance",
    status: "Active",
    location: "Multan",
    timezone: "PKT",
    joined: "2026-03-22",
    lastActive: "Today",
    twoFactor: true,
    ipRestricted: true,
    seatType: "Finance Seat",
    manager: "Admin User",
    avatar: "MK",
    performanceHistory: [
      {
        month: "Jun 2026",
        target: 1200000,
        revenue: 920000,
        assignedLeads: 0,
        contactedLeads: 0,
        qualifiedLeads: 0,
        dealsCreated: 0,
        closedDeals: 0,
        tasksAssigned: 28,
        tasksCompleted: 25,
        followupsCompleted: 18,
        followupsMissed: 2,
        avgResponseMinutes: 31,
        customerRating: 4.3,
        ticketsResolved: 0,
        invoicesProcessed: 74,
        collectionsRecovered: 920000,
        reconciliations: 61,
      },
      {
        month: "May 2026",
        target: 1100000,
        revenue: 840000,
        assignedLeads: 0,
        contactedLeads: 0,
        qualifiedLeads: 0,
        dealsCreated: 0,
        closedDeals: 0,
        tasksAssigned: 25,
        tasksCompleted: 21,
        followupsCompleted: 13,
        followupsMissed: 5,
        avgResponseMinutes: 45,
        customerRating: 4.0,
        ticketsResolved: 0,
        invoicesProcessed: 62,
        collectionsRecovered: 840000,
        reconciliations: 50,
      },
      {
        month: "Apr 2026",
        target: 1000000,
        revenue: 760000,
        assignedLeads: 0,
        contactedLeads: 0,
        qualifiedLeads: 0,
        dealsCreated: 0,
        closedDeals: 0,
        tasksAssigned: 21,
        tasksCompleted: 18,
        followupsCompleted: 11,
        followupsMissed: 6,
        avgResponseMinutes: 51,
        customerRating: 3.9,
        ticketsResolved: 0,
        invoicesProcessed: 55,
        collectionsRecovered: 760000,
        reconciliations: 43,
      },
    ],
    activityTimeline: [
      {
        date: "2026-06-18",
        title: "Reconciled 14 payments",
        description: "Matched payments with invoices and bank records.",
        type: "Finance",
      },
      {
        date: "2026-06-17",
        title: "Recovered overdue balance",
        description: "Collection entry recorded against overdue client.",
        type: "Collection",
      },
      {
        date: "2026-06-13",
        title: "Created monthly invoices",
        description: "Generated recurring invoices for retained clients.",
        type: "Invoice",
      },
    ],
  },
  {
    id: "USR-1005",
    name: "Support Team",
    email: "support@example.com",
    phone: "+92 300 5555555",
    role: "Viewer",
    department: "Operations",
    status: "Inactive",
    location: "Remote",
    timezone: "PKT",
    joined: "2026-04-01",
    lastActive: "7 days ago",
    twoFactor: false,
    ipRestricted: false,
    seatType: "Free Seat",
    manager: "Admin User",
    avatar: "ST",
    performanceHistory: [
      {
        month: "Jun 2026",
        target: 0,
        revenue: 0,
        assignedLeads: 0,
        contactedLeads: 0,
        qualifiedLeads: 0,
        dealsCreated: 0,
        closedDeals: 0,
        tasksAssigned: 0,
        tasksCompleted: 0,
        followupsCompleted: 0,
        followupsMissed: 0,
        avgResponseMinutes: 0,
        customerRating: 0,
        ticketsResolved: 0,
        invoicesProcessed: 0,
        collectionsRecovered: 0,
        reconciliations: 0,
      },
    ],
    activityTimeline: [
      {
        date: "2026-06-11",
        title: "Account inactive",
        description: "No recent CRM activity available.",
        type: "System",
      },
    ],
  },
];

const emptyPerformance = {
  month: "Current",
  target: 0,
  revenue: 0,
  assignedLeads: 0,
  contactedLeads: 0,
  qualifiedLeads: 0,
  dealsCreated: 0,
  closedDeals: 0,
  tasksAssigned: 0,
  tasksCompleted: 0,
  followupsCompleted: 0,
  followupsMissed: 0,
  avgResponseMinutes: 0,
  customerRating: 0,
  ticketsResolved: 0,
  invoicesProcessed: 0,
  collectionsRecovered: 0,
  reconciliations: 0,
};

const emptyInviteForm = {
  name: "",
  email: "",
  phone: "",
  role: "Sales Agent",
  department: "Sales",
  manager: "Admin User",
  location: "",
  seatType: "Paid Seat",
  sendWelcomeEmail: true,
  requireTwoFactor: true,
  restrictIp: false,
  notes: "",
};

function formatCurrency(value) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatDate(date) {
  if (!date) return "Not set";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function percent(value) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.round(value));
}

function safeRatio(value, total) {
  if (!total || total <= 0) return 0;
  return (value / total) * 100;
}

function getCurrentPerformance(member) {
  return member.performanceHistory?.[0] || emptyPerformance;
}

function getPreviousPerformance(member) {
  return member.performanceHistory?.[1] || emptyPerformance;
}

function getRevenueAchievement(performance) {
  return percent(safeRatio(performance.revenue, performance.target));
}

function getConversionRate(performance) {
  return percent(safeRatio(performance.closedDeals, performance.assignedLeads));
}

function getTaskCompletion(performance) {
  return percent(safeRatio(performance.tasksCompleted, performance.tasksAssigned));
}

function getFollowupCompletion(performance) {
  const total =
    Number(performance.followupsCompleted || 0) +
    Number(performance.followupsMissed || 0);

  return percent(safeRatio(performance.followupsCompleted, total));
}

function getResponseScore(performance) {
  if (!performance.avgResponseMinutes) return 0;
  if (performance.avgResponseMinutes <= 20) return 100;
  if (performance.avgResponseMinutes <= 40) return 85;
  if (performance.avgResponseMinutes <= 60) return 70;
  if (performance.avgResponseMinutes <= 120) return 50;
  return 30;
}

function getCustomerScore(performance) {
  return percent(safeRatio(performance.customerRating, 5));
}

function getPerformanceScore(performance) {
  const revenueScore = Math.min(getRevenueAchievement(performance), 120);
  const conversionScore = Math.min(getConversionRate(performance) * 5, 100);
  const taskScore = getTaskCompletion(performance);
  const followupScore = getFollowupCompletion(performance);
  const responseScore = getResponseScore(performance);
  const customerScore = getCustomerScore(performance);

  return Math.round(
    revenueScore * 0.35 +
      conversionScore * 0.2 +
      taskScore * 0.15 +
      followupScore * 0.15 +
      responseScore * 0.05 +
      customerScore * 0.1
  );
}

function getPerformanceGrade(score) {
  if (score >= 85) {
    return {
      label: "Excellent",
      color: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      bar: "bg-emerald-500",
    };
  }

  if (score >= 70) {
    return {
      label: "Good",
      color: "bg-blue-50 text-blue-700 ring-blue-200",
      bar: "bg-blue-500",
    };
  }

  if (score >= 55) {
    return {
      label: "Needs Coaching",
      color: "bg-amber-50 text-amber-700 ring-amber-200",
      bar: "bg-amber-500",
    };
  }

  return {
    label: "Critical",
    color: "bg-rose-50 text-rose-700 ring-rose-200",
    bar: "bg-rose-500",
  };
}

function getTrend(current, previous) {
  if (!previous || previous <= 0) {
    return current > 0 ? 100 : 0;
  }

  return Math.round(((current - previous) / previous) * 100);
}

function statusClass(status) {
  return (
    {
      Active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      Invited: "bg-blue-50 text-blue-700 ring-blue-200",
      Suspended: "bg-rose-50 text-rose-700 ring-rose-200",
      Inactive: "bg-slate-100 text-slate-600 ring-slate-200",
    }[status] || "bg-slate-100 text-slate-600 ring-slate-200"
  );
}

function getRoleKpis(member, performance) {
  if (member.department === "Support" || member.role === "Support Agent") {
    return [
      ["Tickets Resolved", performance.ticketsResolved, ClipboardCheck],
      ["Avg Response", `${performance.avgResponseMinutes || 0} min`, Clock3],
      ["Customer Rating", `${performance.customerRating || 0}/5`, Star],
      ["Tasks Completed", `${performance.tasksCompleted}/${performance.tasksAssigned}`, CheckCircle2],
    ];
  }

  if (member.department === "Finance" || member.role === "Finance User") {
    return [
      ["Invoices Processed", performance.invoicesProcessed, ClipboardCheck],
      ["Collections", formatCurrency(performance.collectionsRecovered), TrendingUp],
      ["Reconciliations", performance.reconciliations, CheckCircle2],
      ["Follow-ups Done", performance.followupsCompleted, MessageCircle],
    ];
  }

  return [
    ["Closed Deals", performance.closedDeals, Trophy],
    ["Conversion Rate", `${getConversionRate(performance)}%`, BarChart3],
    ["Qualified Leads", performance.qualifiedLeads, Users],
    ["Follow-ups Done", performance.followupsCompleted, MessageCircle],
  ];
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

function StatCard({ stat }) {
  const Icon = stat.icon;

  return (
    <div className="rounded-[1.4rem] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-700">
          <Icon size={21} />
        </div>

        <span className="text-right text-xs font-black text-slate-400">
          {stat.note}
        </span>
      </div>

      <p className="mt-4 text-sm font-bold text-slate-500">{stat.label}</p>

      <h2 className="mt-1 text-3xl font-black text-slate-950">{stat.value}</h2>
    </div>
  );
}

function ProgressBar({ value, color = "bg-indigo-600" }) {
  const width = Math.min(Math.max(Number(value || 0), 0), 100);

  return (
    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
      <div
        className={`h-full rounded-full ${color}`}
        style={{
          width: `${width}%`,
        }}
      />
    </div>
  );
}

function TrendBadge({ value }) {
  const positive = value >= 0;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-black ring-1 ${
        positive
          ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
          : "bg-rose-50 text-rose-700 ring-rose-200"
      }`}
    >
      {positive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
      {positive ? "+" : ""}
      {value}%
    </span>
  );
}

function MemberAvatar({ member, size = "h-10 w-10", text = "text-xs" }) {
  return (
    <div
      className={`flex ${size} shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 ${text} font-black text-white shadow-lg shadow-indigo-100`}
    >
      {member.avatar}
    </div>
  );
}

function PerformanceMiniCard({ label, value, note, icon: Icon }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-black uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <Icon size={15} className="text-slate-400" />
      </div>

      <p className="mt-2 text-lg font-black text-slate-950">{value}</p>

      {note && <p className="mt-1 text-xs text-slate-500">{note}</p>}
    </div>
  );
}

function Team() {
  const [members, setMembers] = useState(demoMembers);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedMember, setSelectedMember] = useState(null);
  const [profileTab, setProfileTab] = useState("Overview");
  const [showInvite, setShowInvite] = useState(false);
  const [inviteForm, setInviteForm] = useState(emptyInviteForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const enrichedMembers = useMemo(() => {
    return members.map((member) => {
      const current = getCurrentPerformance(member);
      const previous = getPreviousPerformance(member);
      const score = getPerformanceScore(current);
      const previousScore = getPerformanceScore(previous);
      const revenueTrend = getTrend(current.revenue, previous.revenue);
      const scoreTrend = getTrend(score, previousScore);
      const achievement = getRevenueAchievement(current);
      const conversion = getConversionRate(current);
      const taskCompletion = getTaskCompletion(current);
      const followupCompletion = getFollowupCompletion(current);
      const grade = getPerformanceGrade(score);

      return {
        ...member,
        current,
        previous,
        score,
        previousScore,
        revenueTrend,
        scoreTrend,
        achievement,
        conversion,
        taskCompletion,
        followupCompletion,
        grade,
        assignedLeads: current.assignedLeads,
        openDeals: current.dealsCreated,
        closedDeals: current.closedDeals,
        tasksDue: Math.max(
          Number(current.tasksAssigned || 0) - Number(current.tasksCompleted || 0),
          0
        ),
        revenue: current.revenue,
      };
    });
  }, [members]);

  const filteredMembers = useMemo(() => {
    const q = search.toLowerCase().trim();

    return enrichedMembers.filter((member) => {
      const searchOk =
        !q ||
        [
          member.id,
          member.name,
          member.email,
          member.phone,
          member.role,
          member.department,
          member.status,
          member.location,
          member.manager,
          member.seatType,
        ]
          .join(" ")
          .toLowerCase()
          .includes(q);

      const departmentOk =
        departmentFilter === "All" || member.department === departmentFilter;

      const roleOk = roleFilter === "All" || member.role === roleFilter;

      const statusOk = statusFilter === "All" || member.status === statusFilter;

      return searchOk && departmentOk && roleOk && statusOk;
    });
  }, [enrichedMembers, search, departmentFilter, roleFilter, statusFilter]);

  const activeMembers = enrichedMembers.filter(
    (member) => member.status === "Active"
  );

  const avgPerformanceScore =
    activeMembers.length > 0
      ? Math.round(
          activeMembers.reduce((sum, member) => sum + member.score, 0) /
            activeMembers.length
        )
      : 0;

  const totalRevenue = enrichedMembers.reduce(
    (sum, member) => sum + Number(member.current.revenue || 0),
    0
  );

  const totalTarget = enrichedMembers.reduce(
    (sum, member) => sum + Number(member.current.target || 0),
    0
  );

  const teamTargetAchievement = getRevenueAchievement({
    revenue: totalRevenue,
    target: totalTarget,
  });

  const lowPerformers = enrichedMembers.filter(
    (member) => member.status === "Active" && member.score < 60
  );

  const missedFollowupMembers = enrichedMembers.filter(
    (member) => Number(member.current.followupsMissed || 0) > 3
  );

  const mostImproved = [...enrichedMembers]
    .filter((member) => member.status === "Active")
    .sort((a, b) => b.scoreTrend - a.scoreTrend)[0];

  const bestScore = [...enrichedMembers]
    .filter((member) => member.status === "Active")
    .sort((a, b) => b.score - a.score)[0];

  const topRevenue = [...enrichedMembers]
    .filter((member) => member.status === "Active")
    .sort((a, b) => b.current.revenue - a.current.revenue)[0];

  const stats = [
    {
      label: "Total Members",
      value: members.length,
      note: "All CRM users",
      icon: Users,
    },
    {
      label: "Active Users",
      value: members.filter((member) => member.status === "Active").length,
      note: "Currently enabled",
      icon: UserCheck,
    },
    {
      label: "Avg Performance",
      value: `${avgPerformanceScore}%`,
      note: "Active team score",
      icon: Award,
    },
    {
      label: "Target Achieved",
      value: `${teamTargetAchievement}%`,
      note: "Team target",
      icon: Target,
    },
    {
      label: "Secured Accounts",
      value: members.filter((member) => member.twoFactor).length,
      note: "2FA enabled",
      icon: ShieldCheck,
    },
  ];

  const departmentStats = departments
    .filter((item) => item !== "All")
    .map((department) => {
      const departmentMembers = enrichedMembers.filter(
        (member) => member.department === department
      );

      const avgScore =
        departmentMembers.length > 0
          ? Math.round(
              departmentMembers.reduce((sum, member) => sum + member.score, 0) /
                departmentMembers.length
            )
          : 0;

      return {
        department,
        count: departmentMembers.length,
        avgScore,
      };
    });

  function setInviteField(name, value) {
    setInviteForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleInviteChange(event) {
    const { name, value } = event.target;
    setInviteField(name, value);
  }

  function resetInviteModal() {
    setInviteForm(emptyInviteForm);
    setError("");
    setSuccess("");
    setShowInvite(false);
  }

  function handleInviteSubmit(event) {
    event.preventDefault();
    setError("");

    if (!inviteForm.name.trim()) {
      setError("Member name is required.");
      return;
    }

    if (!inviteForm.email.trim()) {
      setError("Email address is required.");
      return;
    }

    const emailExists = members.some(
      (member) =>
        member.email.toLowerCase().trim() ===
        inviteForm.email.toLowerCase().trim()
    );

    if (emailExists) {
      setError("A member with this email already exists.");
      return;
    }

    const initials = inviteForm.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    const newMember = {
      id: `USR-${1000 + members.length + 1}`,
      name: inviteForm.name,
      email: inviteForm.email,
      phone: inviteForm.phone || "Not added",
      role: inviteForm.role,
      department: inviteForm.department,
      status: "Invited",
      location: inviteForm.location || "Not added",
      timezone: "PKT",
      joined: new Date().toISOString().slice(0, 10),
      lastActive: "Invitation pending",
      twoFactor: inviteForm.requireTwoFactor,
      ipRestricted: inviteForm.restrictIp,
      seatType: inviteForm.seatType,
      manager: inviteForm.manager,
      avatar: initials || "U",
      notes: inviteForm.notes,
      performanceHistory: [
        {
          ...emptyPerformance,
          month: "Jun 2026",
          target: inviteForm.department === "Sales" ? 800000 : 0,
        },
      ],
      activityTimeline: [
        {
          date: new Date().toISOString().slice(0, 10),
          title: "Invitation created",
          description: "New CRM member invitation created by admin.",
          type: "Invite",
        },
      ],
    };

    setMembers((prev) => [newMember, ...prev]);
    setSuccess("Team member invitation created successfully.");
    resetInviteModal();
  }

  function handleDeleteMember(id) {
    setMembers((prev) => prev.filter((member) => member.id !== id));

    if (selectedMember?.id === id) {
      setSelectedMember(null);
    }
  }

  function handleStatusChange(id, status) {
    setMembers((prev) =>
      prev.map((member) => (member.id === id ? { ...member, status } : member))
    );

    if (selectedMember?.id === id) {
      setSelectedMember((prev) => ({ ...prev, status }));
    }
  }

  function openProfile(member, tab = "Overview") {
    setSelectedMember(member);
    setProfileTab(tab);
  }

  const selectedEnrichedMember = selectedMember
    ? enrichedMembers.find((member) => member.id === selectedMember.id)
    : null;

  return (
    <div
      className="min-h-screen bg-[#f6f8fb] p-4 text-slate-900 sm:p-5 lg:p-6"
      style={{
        fontFamily:
          '"Inter", "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
      }}
    >
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
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500" />

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-indigo-700">
                  <ShieldCheck size={14} />
                  CRM Team Performance Center
                </div>

                <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                  Team Management
                </h1>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                  Manage CRM users, roles, permissions, access, workload,
                  targets, current performance, previous performance, activity
                  history, top performers and low performance alerts from one
                  owner workspace.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  <SlidersHorizontal size={18} />
                  Permission Settings
                </button>

                <button
                  type="button"
                  onClick={() => setShowInvite(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white shadow-lg shadow-slate-200 transition hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  <Plus size={18} />
                  Invite Member
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </section>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="rounded-[1.4rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-950">
                  Owner Performance Snapshot
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Current month team performance with target achievement,
                  previous month comparison and risk indicators.
                </p>
              </div>

              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-black text-indigo-700 ring-1 ring-indigo-200">
                <History size={14} />
                Current vs Previous Month
              </span>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <PerformanceMiniCard
                label="Team Revenue"
                value={formatCurrency(totalRevenue)}
                note={`Target: ${formatCurrency(totalTarget)}`}
                icon={TrendingUp}
              />

              <PerformanceMiniCard
                label="Target Achievement"
                value={`${teamTargetAchievement}%`}
                note="Combined team achievement"
                icon={Target}
              />

              <PerformanceMiniCard
                label="Best Performer"
                value={bestScore?.name || "—"}
                note={bestScore ? `${bestScore.score}% score` : "No active user"}
                icon={Trophy}
              />

              <PerformanceMiniCard
                label="At Risk Members"
                value={lowPerformers.length}
                note="Score below 60%"
                icon={AlertCircle}
              />
            </div>

            <div className="mt-5 rounded-2xl bg-slate-50 p-4">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-black text-slate-700">
                  Team Target Progress
                </span>

                <span className="font-black text-slate-950">
                  {teamTargetAchievement}%
                </span>
              </div>

              <ProgressBar
                value={teamTargetAchievement}
                color={
                  teamTargetAchievement >= 85
                    ? "bg-emerald-500"
                    : teamTargetAchievement >= 65
                    ? "bg-blue-500"
                    : "bg-amber-500"
                }
              />
            </div>
          </div>

          <div className="rounded-[1.4rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-black text-slate-950">
                  Owner Alerts
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Issues that need management attention.
                </p>
              </div>

              <AlertCircle size={22} className="text-amber-500" />
            </div>

            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border border-rose-100 bg-rose-50 p-3">
                <p className="text-sm font-black text-rose-700">
                  Low Performance
                </p>
                <p className="mt-1 text-xs leading-5 text-rose-600">
                  {lowPerformers.length > 0
                    ? `${lowPerformers.length} active member(s) need coaching.`
                    : "No critical low performance found."}
                </p>
              </div>

              <div className="rounded-2xl border border-amber-100 bg-amber-50 p-3">
                <p className="text-sm font-black text-amber-700">
                  Missed Follow-ups
                </p>
                <p className="mt-1 text-xs leading-5 text-amber-600">
                  {missedFollowupMembers.length > 0
                    ? `${missedFollowupMembers.length} member(s) have missed follow-ups.`
                    : "Follow-up discipline looks good."}
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3">
                <p className="text-sm font-black text-emerald-700">
                  Most Improved
                </p>
                <p className="mt-1 text-xs leading-5 text-emerald-600">
                  {mostImproved
                    ? `${mostImproved.name} improved by ${mostImproved.scoreTrend}% vs previous month.`
                    : "No improvement data available."}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_340px]">
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
                    placeholder="Search member, email, role, department..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    [
                      departmentFilter,
                      setDepartmentFilter,
                      departments,
                      "Department",
                    ],
                    [roleFilter, setRoleFilter, roles, "Role"],
                    [statusFilter, setStatusFilter, statuses, "Status"],
                  ].map(([value, setter, options, label]) => (
                    <div key={label} className="relative">
                      {label === "Department" && (
                        <Filter
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                          size={16}
                        />
                      )}

                      <select
                        value={value}
                        onChange={(event) => setter(event.target.value)}
                        className={`w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pr-9 text-sm font-bold text-slate-700 outline-none ${
                          label === "Department" ? "pl-10" : "pl-4"
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
              <table className="w-full min-w-[1260px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Member</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Workload</th>
                    <th className="px-4 py-3">Current Performance</th>
                    <th className="px-4 py-3">Previous Trend</th>
                    <th className="px-4 py-3">Security</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="transition hover:bg-slate-50/80">
                      <td className="px-4 py-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <MemberAvatar member={member} />

                          <div className="min-w-0">
                            <p className="truncate font-black text-slate-950">
                              {member.name}
                            </p>

                            <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                              <Mail size={12} />
                              {member.email}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {member.id} • {member.lastActive}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex w-fit items-center whitespace-nowrap rounded-full px-3 py-1 text-xs font-black leading-none ring-1 ${
                            rolePermissions[member.role]?.color ||
                            "bg-slate-100 text-slate-600 ring-slate-200"
                          }`}
                        >
                          {member.role}
                        </span>

                        <p className="mt-2 max-w-[150px] text-[11px] leading-4 text-slate-500">
                          {member.department} • Manager: {member.manager}
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <div className="grid grid-cols-3 gap-1.5">
                          <div className="rounded-lg bg-slate-50 p-1.5 text-center">
                            <p className="text-sm font-black text-slate-950">
                              {member.assignedLeads}
                            </p>
                            <p className="text-[9px] text-slate-500">Leads</p>
                          </div>

                          <div className="rounded-lg bg-slate-50 p-1.5 text-center">
                            <p className="text-sm font-black text-slate-950">
                              {member.openDeals}
                            </p>
                            <p className="text-[9px] text-slate-500">Deals</p>
                          </div>

                          <div className="rounded-lg bg-slate-50 p-1.5 text-center">
                            <p className="text-sm font-black text-slate-950">
                              {member.tasksDue}
                            </p>
                            <p className="text-[9px] text-slate-500">Due</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="min-w-[210px]">
                          <div className="mb-2 flex items-center justify-between gap-3">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-black ring-1 ${member.grade.color}`}
                            >
                              {member.grade.label}
                            </span>

                            <span className="text-sm font-black text-slate-950">
                              {member.score}%
                            </span>
                          </div>

                          <ProgressBar value={member.score} color={member.grade.bar} />

                          <div className="mt-2 flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-500">
                              Revenue
                            </span>
                            <span className="font-black text-slate-950">
                              {formatCurrency(member.current.revenue)}
                            </span>
                          </div>

                          <div className="mt-1 flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-500">
                              Target
                            </span>
                            <span className="font-black text-slate-950">
                              {member.achievement}%
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-xs font-bold text-slate-500">
                              Revenue
                            </span>
                            <TrendBadge value={member.revenueTrend} />
                          </div>

                          <div className="flex items-center justify-between gap-3">
                            <span className="text-xs font-bold text-slate-500">
                              Score
                            </span>
                            <TrendBadge value={member.scoreTrend} />
                          </div>

                          <p className="text-xs text-slate-400">
                            Previous: {member.previous.month}
                          </p>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1.5">
                          <span
                            className={`inline-flex w-fit items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-black ring-1 ${
                              member.twoFactor
                                ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                                : "bg-amber-50 text-amber-700 ring-amber-200"
                            }`}
                          >
                            <KeyRound size={12} />
                            {member.twoFactor ? "2FA On" : "2FA Off"}
                          </span>

                          <span
                            className={`inline-flex w-fit items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-black ring-1 ${
                              member.ipRestricted
                                ? "bg-blue-50 text-blue-700 ring-blue-200"
                                : "bg-slate-100 text-slate-600 ring-slate-200"
                            }`}
                          >
                            <LockKeyhole size={12} />
                            {member.ipRestricted ? "IP Locked" : "No IP Lock"}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex w-fit items-center whitespace-nowrap rounded-full px-3 py-1 text-xs font-black ring-1 ${statusClass(
                            member.status
                          )}`}
                        >
                          {member.status}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openProfile(member, "Overview")}
                            className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
                            title="View Profile"
                          >
                            <Eye size={15} />
                          </button>

                          <button
                            onClick={() => openProfile(member, "Performance")}
                            className="rounded-lg border border-indigo-100 p-2 text-indigo-600 hover:bg-indigo-50"
                            title="Performance"
                          >
                            <BarChart3 size={15} />
                          </button>

                          <button
                            onClick={() =>
                              openProfile(member, "Previous Performance")
                            }
                            className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
                            title="Previous Performance"
                          >
                            <History size={15} />
                          </button>

                          <select
                            value={member.status}
                            onChange={(event) =>
                              handleStatusChange(member.id, event.target.value)
                            }
                            className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs font-bold text-slate-600 outline-none"
                          >
                            {statuses
                              .filter((status) => status !== "All")
                              .map((status) => (
                                <option key={status}>{status}</option>
                              ))}
                          </select>

                          <button
                            onClick={() => handleDeleteMember(member.id)}
                            className="rounded-lg border border-rose-100 p-2 text-rose-500 hover:bg-rose-50"
                            title="Delete Member"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredMembers.length === 0 && (
                <div className="p-10 text-center">
                  <Users className="mx-auto text-slate-300" size={42} />

                  <h3 className="mt-3 text-lg font-black text-slate-900">
                    No team members found
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Change filters or invite a new team member.
                  </p>
                </div>
              )}
            </div>
          </div>

          <aside className="min-w-0 space-y-4">
            <div className="rounded-[1.4rem] border border-slate-200 bg-white p-4 shadow-sm 2xl:sticky 2xl:top-6">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-base font-black text-slate-950">
                  Department Overview
                </h3>

                <MoreHorizontal className="text-slate-400" size={18} />
              </div>

              <div className="mt-4 space-y-2">
                {departmentStats.map((item) => (
                  <div
                    key={item.department}
                    className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="rounded-lg bg-white p-1.5 text-indigo-700">
                          <BriefcaseBusiness size={15} />
                        </div>

                        <span className="text-xs font-black text-slate-700">
                          {item.department}
                        </span>
                      </div>

                      <span className="rounded-full bg-white px-2 py-1 text-xs font-black text-slate-500">
                        {item.count}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[11px] font-bold text-slate-500">
                      <span>Avg Score</span>
                      <span>{item.avgScore}%</span>
                    </div>

                    <div className="mt-1">
                      <ProgressBar value={item.avgScore} color="bg-indigo-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.4rem] border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-base font-black text-slate-950">
                Performance Leaders
              </h3>

              <div className="mt-4 space-y-2">
                {[
                  ["Top Revenue", topRevenue, formatCurrency(topRevenue?.current.revenue || 0), Trophy],
                  ["Best Score", bestScore, `${bestScore?.score || 0}%`, Award],
                  ["Most Improved", mostImproved, `${mostImproved?.scoreTrend || 0}%`, TrendingUp],
                ].map(([label, member, value, Icon]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2.5"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white">
                        <Icon size={15} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-xs font-black text-slate-900">
                          {label}
                        </p>

                        <p className="truncate text-[11px] text-slate-500">
                          {member?.name || "No data"}
                        </p>
                      </div>
                    </div>

                    <p className="shrink-0 text-xs font-black text-slate-950">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.4rem] border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-base font-black text-slate-950">
                Low Performance Alerts
              </h3>

              <div className="mt-4 space-y-2">
                {lowPerformers.length === 0 ? (
                  <div className="rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700">
                    No low performance alerts.
                  </div>
                ) : (
                  lowPerformers.map((member) => (
                    <button
                      key={member.id}
                      onClick={() => openProfile(member, "Performance")}
                      className="w-full rounded-xl bg-rose-50 p-3 text-left hover:bg-rose-100"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs font-black text-rose-700">
                          {member.name}
                        </p>

                        <span className="text-xs font-black text-rose-700">
                          {member.score}%
                        </span>
                      </div>

                      <p className="mt-1 text-[11px] text-rose-600">
                        Needs manager coaching and follow-up.
                      </p>
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-[1.4rem] border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-base font-black text-slate-950">
                Role Access Summary
              </h3>

              <div className="mt-4 max-h-[360px] space-y-2 overflow-y-auto pr-1">
                {Object.entries(rolePermissions).map(([role, info]) => (
                  <div key={role} className="rounded-xl bg-slate-50 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-black text-slate-900">{role}</p>

                      <ShieldCheck size={15} className="text-slate-400" />
                    </div>

                    <p className="mt-1 text-[11px] leading-4 text-slate-500">
                      {info.level}
                    </p>

                    <p className="mt-1 text-[11px] font-bold text-slate-600">
                      {info.modules}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>

        <section className="rounded-[1.4rem] border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-950">
                Permission Matrix
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Quick visual control of what each CRM area should allow by role.
              </p>
            </div>

            <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 hover:bg-slate-50">
              <UserCog size={17} />
              Manage Permission Sets
            </button>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="rounded-l-xl px-4 py-3">Module</th>

                  {permissionActions.map((action) => (
                    <th key={action} className="px-4 py-3 text-center">
                      {action}
                    </th>
                  ))}

                  <th className="rounded-r-xl px-4 py-3">Recommended Owner</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {permissionModules.map((module) => (
                  <tr key={module}>
                    <td className="px-4 py-3 font-black text-slate-900">
                      {module}
                    </td>

                    {permissionActions.map((action) => {
                      const risky =
                        action === "Delete" &&
                        !["Dashboard", "Reports"].includes(module);

                      return (
                        <td key={action} className="px-4 py-3 text-center">
                          <span
                            className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${
                              risky
                                ? "bg-amber-50 text-amber-700"
                                : "bg-emerald-50 text-emerald-700"
                            }`}
                          >
                            {risky ? (
                              <AlertCircle size={15} />
                            ) : (
                              <Check size={15} />
                            )}
                          </span>
                        </td>
                      );
                    })}

                    <td className="px-4 py-3 text-sm font-bold text-slate-600">
                      {module === "Payments"
                        ? "Finance User"
                        : module === "Settings" || module === "Automations"
                        ? "Admin"
                        : module === "Reports"
                        ? "Manager"
                        : "Team Lead"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-3 backdrop-blur-sm sm:p-5">
          <form
            onSubmit={handleInviteSubmit}
            className="my-4 flex h-[86vh] w-full max-w-5xl flex-col overflow-hidden rounded-[1.7rem] bg-white shadow-2xl"
          >
            <div className="shrink-0 border-b border-slate-100 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-950">
                    Invite Team Member
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Add a CRM user, assign role, department, manager, security
                    rules and seat type.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={resetInviteModal}
                  className="rounded-xl bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-5">
              <div className="grid gap-4 lg:grid-cols-[1fr_0.85fr]">
                <div className="space-y-4">
                  <div className="rounded-[1.3rem] border border-slate-200 p-4">
                    <h3 className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500">
                      <UserPlus size={15} />
                      Basic Information
                    </h3>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        name="name"
                        value={inviteForm.name}
                        onChange={handleInviteChange}
                        placeholder="Full Name"
                        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-500"
                      />

                      <input
                        name="email"
                        type="email"
                        value={inviteForm.email}
                        onChange={handleInviteChange}
                        placeholder="Email Address"
                        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-500"
                      />

                      <input
                        name="phone"
                        value={inviteForm.phone}
                        onChange={handleInviteChange}
                        placeholder="Phone Number"
                        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-500"
                      />

                      <input
                        name="location"
                        value={inviteForm.location}
                        onChange={handleInviteChange}
                        placeholder="Location"
                        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-500"
                      />
                    </div>
                  </div>

                  <div className="rounded-[1.3rem] border border-slate-200 p-4">
                    <h3 className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500">
                      <ShieldCheck size={15} />
                      Role & Access
                    </h3>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <select
                        name="role"
                        value={inviteForm.role}
                        onChange={handleInviteChange}
                        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold outline-none focus:border-slate-500"
                      >
                        {roles
                          .filter((role) => role !== "All")
                          .map((role) => (
                            <option key={role}>{role}</option>
                          ))}
                      </select>

                      <select
                        name="department"
                        value={inviteForm.department}
                        onChange={handleInviteChange}
                        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold outline-none focus:border-slate-500"
                      >
                        {departments
                          .filter((department) => department !== "All")
                          .map((department) => (
                            <option key={department}>{department}</option>
                          ))}
                      </select>

                      <select
                        name="manager"
                        value={inviteForm.manager}
                        onChange={handleInviteChange}
                        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold outline-none focus:border-slate-500"
                      >
                        {members.map((member) => (
                          <option key={member.id}>{member.name}</option>
                        ))}
                      </select>

                      <select
                        name="seatType"
                        value={inviteForm.seatType}
                        onChange={handleInviteChange}
                        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold outline-none focus:border-slate-500"
                      >
                        <option>Paid Seat</option>
                        <option>Free Seat</option>
                        <option>Finance Seat</option>
                        <option>Viewer Seat</option>
                      </select>
                    </div>
                  </div>

                  <div className="rounded-[1.3rem] border border-slate-200 p-4">
                    <h3 className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500">
                      <Target size={15} />
                      Initial Target Setup
                    </h3>

                    <p className="text-sm leading-6 text-slate-500">
                      New users start with default zero performance history.
                      After backend connection, monthly targets and KPI targets
                      will be saved from admin settings.
                    </p>
                  </div>

                  <div className="rounded-[1.3rem] border border-slate-200 p-4">
                    <h3 className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500">
                      <Edit3 size={15} />
                      Internal Notes
                    </h3>

                    <textarea
                      name="notes"
                      value={inviteForm.notes}
                      onChange={handleInviteChange}
                      rows={4}
                      placeholder="Add onboarding notes, responsibility details or special access instructions."
                      className="w-full resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-500"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-[1.3rem] border border-slate-200 p-4">
                    <h3 className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500">
                      <KeyRound size={15} />
                      Security Rules
                    </h3>

                    <div className="space-y-3">
                      <Toggle
                        checked={inviteForm.sendWelcomeEmail}
                        onChange={(value) =>
                          setInviteField("sendWelcomeEmail", value)
                        }
                        label="Send Welcome Email"
                        description="Send login instructions after invitation."
                      />

                      <Toggle
                        checked={inviteForm.requireTwoFactor}
                        onChange={(value) =>
                          setInviteField("requireTwoFactor", value)
                        }
                        label="Require Two-Factor Authentication"
                        description="Recommended for all CRM users."
                      />

                      <Toggle
                        checked={inviteForm.restrictIp}
                        onChange={(value) => setInviteField("restrictIp", value)}
                        label="Enable IP Restriction"
                        description="Useful for finance, admin and sensitive roles."
                      />
                    </div>
                  </div>

                  <div className="rounded-[1.3rem] border border-slate-200 bg-slate-50 p-4">
                    <h3 className="text-xs font-black uppercase tracking-wide text-slate-500">
                      Selected Role Preview
                    </h3>

                    <div className="mt-3 rounded-2xl bg-white p-4">
                      <span
                        className={`inline-flex w-fit items-center whitespace-nowrap rounded-full px-3 py-1 text-xs font-black ring-1 ${
                          rolePermissions[inviteForm.role]?.color ||
                          "bg-slate-100 text-slate-600 ring-slate-200"
                        }`}
                      >
                        {inviteForm.role}
                      </span>

                      <p className="mt-3 text-sm font-black text-slate-950">
                        {rolePermissions[inviteForm.role]?.level}
                      </p>

                      <p className="mt-1 text-sm leading-5 text-slate-500">
                        Access area: {rolePermissions[inviteForm.role]?.modules}
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
                  onClick={resetInviteModal}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-black text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-slate-950 px-6 py-2.5 text-sm font-black text-white hover:bg-slate-800"
                >
                  Create Invitation
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {selectedEnrichedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="my-8 flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-[1.7rem] bg-white shadow-2xl">
            <div className="shrink-0 border-b border-slate-100 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-4">
                  <MemberAvatar
                    member={selectedEnrichedMember}
                    size="h-14 w-14"
                    text="text-lg"
                  />

                  <div className="min-w-0">
                    <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                      {selectedEnrichedMember.id}
                    </p>

                    <h2 className="mt-1 break-words text-2xl font-black text-slate-950">
                      {selectedEnrichedMember.name}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {selectedEnrichedMember.role} •{" "}
                      {selectedEnrichedMember.department} • Score{" "}
                      {selectedEnrichedMember.score}%
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedMember(null)}
                  className="rounded-xl bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mt-5 overflow-x-auto">
                <div className="flex min-w-max gap-2">
                  {profileTabs.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setProfileTab(tab)}
                      className={`rounded-xl px-3.5 py-2 text-xs font-black transition ${
                        profileTab === tab
                          ? "bg-slate-950 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-5">
              {profileTab === "Overview" && (
                <div className="space-y-5">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <PerformanceMiniCard
                      label="Performance Score"
                      value={`${selectedEnrichedMember.score}%`}
                      note={selectedEnrichedMember.grade.label}
                      icon={Award}
                    />

                    <PerformanceMiniCard
                      label="Current Revenue"
                      value={formatCurrency(selectedEnrichedMember.current.revenue)}
                      note={`Target ${formatCurrency(
                        selectedEnrichedMember.current.target
                      )}`}
                      icon={TrendingUp}
                    />

                    <PerformanceMiniCard
                      label="Task Completion"
                      value={`${selectedEnrichedMember.taskCompletion}%`}
                      note={`${selectedEnrichedMember.current.tasksCompleted}/${selectedEnrichedMember.current.tasksAssigned} completed`}
                      icon={ClipboardCheck}
                    />

                    <PerformanceMiniCard
                      label="Follow-up Discipline"
                      value={`${selectedEnrichedMember.followupCompletion}%`}
                      note={`${selectedEnrichedMember.current.followupsMissed} missed follow-ups`}
                      icon={MessageCircle}
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                      ["Email", selectedEnrichedMember.email, Mail],
                      ["Phone", selectedEnrichedMember.phone, Phone],
                      ["Role", selectedEnrichedMember.role, ShieldCheck],
                      ["Department", selectedEnrichedMember.department, BriefcaseBusiness],
                      ["Manager", selectedEnrichedMember.manager, UserCheck],
                      ["Status", selectedEnrichedMember.status, CheckCircle2],
                      ["Seat Type", selectedEnrichedMember.seatType, Laptop],
                      ["Location", selectedEnrichedMember.location, Globe2],
                      ["Timezone", selectedEnrichedMember.timezone, Clock3],
                      ["Joined", formatDate(selectedEnrichedMember.joined), CalendarDays],
                      ["Last Active", selectedEnrichedMember.lastActive, Activity],
                      ["Current Month", selectedEnrichedMember.current.month, History],
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
                </div>
              )}

              {profileTab === "Performance" && (
                <div className="space-y-5">
                  <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
                    <div className="rounded-[1.3rem] border border-slate-200 p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="text-lg font-black text-slate-950">
                            Current Month Performance
                          </h3>
                          <p className="mt-1 text-sm text-slate-500">
                            {selectedEnrichedMember.current.month} KPI result.
                          </p>
                        </div>

                        <span
                          className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-black ring-1 ${selectedEnrichedMember.grade.color}`}
                        >
                          {selectedEnrichedMember.grade.label}
                        </span>
                      </div>

                      <div className="mt-5 space-y-5">
                        {[
                          [
                            "Performance Score",
                            selectedEnrichedMember.score,
                            selectedEnrichedMember.grade.bar,
                          ],
                          [
                            "Target Achievement",
                            selectedEnrichedMember.achievement,
                            "bg-indigo-500",
                          ],
                          [
                            "Task Completion",
                            selectedEnrichedMember.taskCompletion,
                            "bg-emerald-500",
                          ],
                          [
                            "Follow-up Completion",
                            selectedEnrichedMember.followupCompletion,
                            "bg-blue-500",
                          ],
                          [
                            "Lead Conversion",
                            selectedEnrichedMember.conversion,
                            "bg-amber-500",
                          ],
                        ].map(([label, value, color]) => (
                          <div key={label}>
                            <div className="mb-2 flex items-center justify-between text-sm">
                              <span className="font-black text-slate-700">
                                {label}
                              </span>
                              <span className="font-black text-slate-950">
                                {value}%
                              </span>
                            </div>
                            <ProgressBar value={value} color={color} />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[1.3rem] border border-slate-200 p-4">
                      <h3 className="text-lg font-black text-slate-950">
                        Role Based KPIs
                      </h3>

                      <div className="mt-4 space-y-3">
                        {getRoleKpis(
                          selectedEnrichedMember,
                          selectedEnrichedMember.current
                        ).map(([label, value, Icon]) => (
                          <div
                            key={label}
                            className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3"
                          >
                            <div className="flex items-center gap-2">
                              <div className="rounded-lg bg-white p-2 text-indigo-700">
                                <Icon size={16} />
                              </div>

                              <p className="text-xs font-black text-slate-700">
                                {label}
                              </p>
                            </div>

                            <p className="text-sm font-black text-slate-950">
                              {value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <PerformanceMiniCard
                      label="Revenue"
                      value={formatCurrency(selectedEnrichedMember.current.revenue)}
                      note={`Target: ${formatCurrency(
                        selectedEnrichedMember.current.target
                      )}`}
                      icon={TrendingUp}
                    />

                    <PerformanceMiniCard
                      label="Closed Deals"
                      value={selectedEnrichedMember.current.closedDeals}
                      note={`${selectedEnrichedMember.current.dealsCreated} deals created`}
                      icon={Trophy}
                    />

                    <PerformanceMiniCard
                      label="Avg Response"
                      value={`${selectedEnrichedMember.current.avgResponseMinutes || 0} min`}
                      note="Lower is better"
                      icon={Clock3}
                    />

                    <PerformanceMiniCard
                      label="Customer Rating"
                      value={`${selectedEnrichedMember.current.customerRating || 0}/5`}
                      note="Client satisfaction"
                      icon={Star}
                    />
                  </div>
                </div>
              )}

              {profileTab === "Previous Performance" && (
                <div className="space-y-5">
                  <div className="grid gap-4 lg:grid-cols-3">
                    <div className="rounded-[1.3rem] border border-slate-200 p-4">
                      <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                        Current Month Revenue
                      </p>
                      <h3 className="mt-2 text-2xl font-black text-slate-950">
                        {formatCurrency(selectedEnrichedMember.current.revenue)}
                      </h3>
                      <div className="mt-3">
                        <TrendBadge value={selectedEnrichedMember.revenueTrend} />
                      </div>
                    </div>

                    <div className="rounded-[1.3rem] border border-slate-200 p-4">
                      <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                        Previous Month Revenue
                      </p>
                      <h3 className="mt-2 text-2xl font-black text-slate-950">
                        {formatCurrency(selectedEnrichedMember.previous.revenue)}
                      </h3>
                      <p className="mt-3 text-xs font-bold text-slate-500">
                        {selectedEnrichedMember.previous.month}
                      </p>
                    </div>

                    <div className="rounded-[1.3rem] border border-slate-200 p-4">
                      <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                        Score Improvement
                      </p>
                      <h3 className="mt-2 text-2xl font-black text-slate-950">
                        {selectedEnrichedMember.score}%
                      </h3>
                      <div className="mt-3">
                        <TrendBadge value={selectedEnrichedMember.scoreTrend} />
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-[1.3rem] border border-slate-200">
                    <table className="w-full min-w-[920px] text-left text-sm">
                      <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                          <th className="px-4 py-3">Month</th>
                          <th className="px-4 py-3 text-right">Revenue</th>
                          <th className="px-4 py-3 text-right">Target</th>
                          <th className="px-4 py-3 text-right">Achieved</th>
                          <th className="px-4 py-3 text-right">Score</th>
                          <th className="px-4 py-3 text-right">Closed Deals</th>
                          <th className="px-4 py-3 text-right">Tasks</th>
                          <th className="px-4 py-3 text-right">Missed Follow-ups</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100">
                        {selectedEnrichedMember.performanceHistory.map((row) => {
                          const score = getPerformanceScore(row);
                          const achieved = getRevenueAchievement(row);

                          return (
                            <tr key={row.month}>
                              <td className="px-4 py-3 font-black text-slate-950">
                                {row.month}
                              </td>
                              <td className="px-4 py-3 text-right font-bold text-slate-800">
                                {formatCurrency(row.revenue)}
                              </td>
                              <td className="px-4 py-3 text-right font-bold text-slate-800">
                                {formatCurrency(row.target)}
                              </td>
                              <td className="px-4 py-3 text-right font-bold text-slate-800">
                                {achieved}%
                              </td>
                              <td className="px-4 py-3 text-right font-black text-slate-950">
                                {score}%
                              </td>
                              <td className="px-4 py-3 text-right font-bold text-slate-800">
                                {row.closedDeals}
                              </td>
                              <td className="px-4 py-3 text-right font-bold text-slate-800">
                                {row.tasksCompleted}/{row.tasksAssigned}
                              </td>
                              <td className="px-4 py-3 text-right font-bold text-rose-600">
                                {row.followupsMissed}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {profileTab === "Activity Timeline" && (
                <div className="space-y-3">
                  {selectedEnrichedMember.activityTimeline?.map((activity, index) => (
                    <div
                      key={`${activity.date}-${index}`}
                      className="flex gap-3 rounded-[1.3rem] border border-slate-200 bg-white p-4"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
                        <Activity size={18} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                          <h3 className="font-black text-slate-950">
                            {activity.title}
                          </h3>

                          <span className="text-xs font-bold text-slate-400">
                            {formatDate(activity.date)}
                          </span>
                        </div>

                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          {activity.description}
                        </p>

                        <span className="mt-2 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-black text-slate-600">
                          {activity.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {profileTab === "Permissions" && (
                <div className="space-y-5">
                  <div className="rounded-[1.3rem] border border-slate-200 p-4">
                    <h3 className="text-lg font-black text-slate-950">
                      Role Permission Summary
                    </h3>

                    <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                      <span
                        className={`inline-flex w-fit items-center whitespace-nowrap rounded-full px-3 py-1 text-xs font-black ring-1 ${
                          rolePermissions[selectedEnrichedMember.role]?.color ||
                          "bg-slate-100 text-slate-600 ring-slate-200"
                        }`}
                      >
                        {selectedEnrichedMember.role}
                      </span>

                      <p className="mt-3 text-sm font-black text-slate-950">
                        {rolePermissions[selectedEnrichedMember.role]?.level}
                      </p>

                      <p className="mt-1 text-sm leading-5 text-slate-500">
                        Access area:{" "}
                        {rolePermissions[selectedEnrichedMember.role]?.modules}
                      </p>

                      <p className="mt-1 text-sm leading-5 text-slate-500">
                        Recommended owner:{" "}
                        {
                          rolePermissions[selectedEnrichedMember.role]
                            ?.recommendedOwner
                        }
                      </p>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-[1.3rem] border border-slate-200">
                    <table className="w-full min-w-[820px] text-left text-sm">
                      <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                          <th className="px-4 py-3">Module</th>
                          {permissionActions.map((action) => (
                            <th key={action} className="px-4 py-3 text-center">
                              {action}
                            </th>
                          ))}
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100">
                        {permissionModules.map((module) => (
                          <tr key={module}>
                            <td className="px-4 py-3 font-black text-slate-950">
                              {module}
                            </td>

                            {permissionActions.map((action) => {
                              const deleteRisk =
                                action === "Delete" &&
                                selectedEnrichedMember.role !== "Super Admin" &&
                                selectedEnrichedMember.role !== "Admin";

                              return (
                                <td key={action} className="px-4 py-3 text-center">
                                  <span
                                    className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${
                                      deleteRisk
                                        ? "bg-amber-50 text-amber-700"
                                        : "bg-emerald-50 text-emerald-700"
                                    }`}
                                  >
                                    {deleteRisk ? (
                                      <AlertCircle size={15} />
                                    ) : (
                                      <Check size={15} />
                                    )}
                                  </span>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {profileTab === "Security" && (
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="rounded-[1.3rem] border border-slate-200 p-4">
                    <h3 className="text-lg font-black text-slate-950">
                      Security Controls
                    </h3>

                    <div className="mt-4 space-y-3">
                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-xs font-black uppercase text-slate-400">
                          Two-Factor Authentication
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-800">
                          {selectedEnrichedMember.twoFactor
                            ? "Enabled"
                            : "Disabled"}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-xs font-black uppercase text-slate-400">
                          IP Restriction
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-800">
                          {selectedEnrichedMember.ipRestricted
                            ? "Enabled"
                            : "Disabled"}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-xs font-black uppercase text-slate-400">
                          Seat Type
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-800">
                          {selectedEnrichedMember.seatType}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[1.3rem] border border-slate-200 p-4">
                    <h3 className="text-lg font-black text-slate-950">
                      Account Status
                    </h3>

                    <div className="mt-4 space-y-3">
                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-xs font-black uppercase text-slate-400">
                          Current Status
                        </p>

                        <select
                          value={selectedEnrichedMember.status}
                          onChange={(event) =>
                            handleStatusChange(
                              selectedEnrichedMember.id,
                              event.target.value
                            )
                          }
                          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-700 outline-none"
                        >
                          {statuses
                            .filter((status) => status !== "All")
                            .map((status) => (
                              <option key={status}>{status}</option>
                            ))}
                        </select>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-xs font-black uppercase text-slate-400">
                          Last Active
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-800">
                          {selectedEnrichedMember.lastActive}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-xs font-black uppercase text-slate-400">
                          Joined
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-800">
                          {formatDate(selectedEnrichedMember.joined)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="shrink-0 border-t border-slate-100 bg-white p-5">
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-black text-slate-700 hover:bg-slate-50"
                  onClick={() => setSelectedMember(null)}
                >
                  Close
                </button>

                <button className="flex-1 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-black text-white hover:bg-slate-800">
                  Edit Member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Team;