export const leads = [
  {
    id: 1,
    name: "Ali Khan",
    phone: "0300-1234567",
    service: "Website Design",
    source: "Facebook",
    status: "New",
    priority: "Hot",
  },
  {
    id: 2,
    name: "ABC School",
    phone: "0312-9876543",
    service: "School CRM",
    source: "Referral",
    status: "Contacted",
    priority: "Warm",
  },
  {
    id: 3,
    name: "Usman Traders",
    phone: "0321-5552233",
    service: "Business Website",
    source: "WhatsApp",
    status: "Interested",
    priority: "Hot",
  },
  {
    id: 4,
    name: "Farhan Ahmed",
    phone: "0333-4455667",
    service: "Mobile App",
    source: "Google",
    status: "New",
    priority: "Cold",
  },
  {
    id: 5,
    name: "Sunrise Clinic",
    phone: "0341-7788990",
    service: "Clinic Website",
    source: "Facebook",
    status: "Contacted",
    priority: "Warm",
  },
  {
    id: 6,
    name: "Hassan Textiles",
    phone: "0300-9988776",
    service: "E-Commerce Store",
    source: "WhatsApp",
    status: "Interested",
    priority: "Hot",
  },
  {
    id: 7,
    name: "Noor Academy",
    phone: "0322-1122334",
    service: "LMS Website",
    source: "Referral",
    status: "New",
    priority: "Warm",
  },
  {
    id: 8,
    name: "Bilal Enterprises",
    phone: "0311-6677889",
    service: "Business Website",
    source: "Google",
    status: "Contacted",
    priority: "Cold",
  },
];

export const customers = [
  {
    id: 1,
    name: "Illmussaba Training",
    phone: "0301-2223344",
    service: "LMS Website",
    status: "Active",
  },
  {
    id: 2,
    name: "Bright Academy",
    phone: "0345-9988776",
    service: "Admission Website",
    status: "Active",
  },
];

export const followUps = [
  {
    id: 1,
    client: "Ali Khan",
    type: "Call",
    date: "18 June 2026",
    time: "3:00 PM",
    status: "Pending",
  },
  {
    id: 2,
    client: "ABC School",
    type: "WhatsApp",
    date: "18 June 2026",
    time: "5:30 PM",
    status: "Done",
  },
];

export const deals = [
  {
    id: 1,
    title: "School Website Project",
    client: "ABC School",
    amount: "PKR 80,000",
    stage: "Proposal Sent",
  },
  {
    id: 2,
    title: "CRM Development",
    client: "Usman Traders",
    amount: "PKR 150,000",
    stage: "Negotiation",
  },
  {
    id: 3,
    title: "Landing Page",
    client: "Ali Khan",
    amount: "PKR 35,000",
    stage: "Requirement Taken",
  },
];

export const tasks = [
  {
    id: 1,
    title: "Send proposal to ABC School",
    assigned: "Admin",
    due: "19 June 2026",
    priority: "High",
    status: "Pending",
  },
  {
    id: 2,
    title: "Call Ali Khan for follow-up",
    assigned: "Sales",
    due: "18 June 2026",
    priority: "Medium",
    status: "In Progress",
  },
];

export const dashboardStats = [
  { title: "Total Leads", value: "128", note: "+12 this week" },
  { title: "Customers", value: "36", note: "Active clients" },
  { title: "Pending Follow-ups", value: "18", note: "Need action" },
  { title: "Expected Revenue", value: "PKR 520K", note: "Open deals" },
];

export const revenueChartData = [
  { month: "Jan", revenue: 120000, expenses: 45000 },
  { month: "Feb", revenue: 180000, expenses: 62000 },
  { month: "Mar", revenue: 150000, expenses: 58000 },
  { month: "Apr", revenue: 240000, expenses: 76000 },
  { month: "May", revenue: 310000, expenses: 90000 },
  { month: "Jun", revenue: 520000, expenses: 135000 },
];

export const leadSourceChartData = [
  { source: "Facebook", leads: 46 },
  { source: "WhatsApp", leads: 32 },
  { source: "Website", leads: 24 },
  { source: "Referral", leads: 18 },
  { source: "Google", leads: 8 },
];

export const dealStageChartData = [
  { stage: "New Leads", value: 35 },
  { stage: "Contacted", value: 25 },
  { stage: "Proposal Sent", value: 18 },
  { stage: "Negotiation", value: 12 },
  { stage: "Won", value: 10 },
];

export const conversionChartData = [
  { month: "Jan", conversion: 12 },
  { month: "Feb", conversion: 18 },
  { month: "Mar", conversion: 16 },
  { month: "Apr", conversion: 22 },
  { month: "May", conversion: 26 },
  { month: "Jun", conversion: 31 },
];
