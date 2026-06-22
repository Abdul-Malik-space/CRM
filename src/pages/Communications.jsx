import { useMemo, useState } from "react";
import {
  AlertCircle,
  Archive,
  BellRing,
  Bot,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Edit3,
  Eye,
  Filter,
  Globe2,
  Headphones,
  Inbox,
  Mail,
  MessageCircle,
  MessageSquareText,
  MoreHorizontal,
  Phone,
  Plus,
  Reply,
  Search,
  Send,
  ShieldCheck,
  Smartphone,
  Star,
  Tag,
  Trash2,
  UserCheck,
  Users,
  X,
  Zap,
} from "lucide-react";

const channels = [
  "All",
  "Email",
  "WhatsApp",
  "Phone",
  "Live Chat",
  "Social",
  "SMS",
];

const statuses = [
  "All",
  "Open",
  "Pending",
  "Waiting Customer",
  "Resolved",
  "Archived",
];

const priorities = ["All", "Low", "Medium", "High", "Urgent"];

const agents = [
  "Admin User",
  "Ahsan Ali",
  "Sara Khan",
  "Bilal Ahmed",
  "Support Team",
  "Sales Team",
];

const relatedTypes = ["Lead", "Customer", "Deal", "Project", "Ticket"];

const templates = [
  {
    id: "TMP-001",
    name: "Initial Response",
    channel: "Email",
    text: "Hi, thank you for reaching out. We have received your message and our team is reviewing it now.",
  },
  {
    id: "TMP-002",
    name: "Follow-up Reminder",
    channel: "WhatsApp",
    text: "Hi, just following up on our previous conversation. Please let us know if you would like to proceed.",
  },
  {
    id: "TMP-003",
    name: "Proposal Sent",
    channel: "Email",
    text: "Hi, we have shared the proposal for your review. Please check it and let us know if any changes are required.",
  },
  {
    id: "TMP-004",
    name: "Support Resolution",
    channel: "Live Chat",
    text: "Your request has been resolved. Please confirm if everything is working properly now.",
  },
];

const demoConversations = [
  {
    id: "COM-1001",
    subject: "Website development pricing inquiry",
    contactName: "Ali Raza",
    contactEmail: "ali@example.com",
    contactPhone: "+92 300 1111111",
    company: "ABC School",
    channel: "Email",
    status: "Open",
    priority: "High",
    assignedTo: "Ahsan Ali",
    relatedType: "Lead",
    relatedRecord: "ABC School Website Lead",
    source: "Website Form",
    sentiment: "Positive",
    tags: "website, pricing, hot lead",
    slaDue: "2026-06-20T15:00",
    lastMessageAt: "2026-06-19T10:20",
    createdAt: "2026-06-19T09:45",
    unread: true,
    starred: true,
    messages: [
      {
        from: "Ali Raza",
        type: "customer",
        time: "10:20 AM",
        body: "Hi, I want pricing details for a business website. Please share package details.",
      },
      {
        from: "Ahsan Ali",
        type: "agent",
        time: "10:25 AM",
        body: "Thank you for contacting us. I will share the website packages shortly.",
      },
    ],
    internalNotes: "Hot lead. Follow up today with website package and timeline.",
  },
  {
    id: "COM-1002",
    subject: "Monthly SEO report follow-up",
    contactName: "Sara Client",
    contactEmail: "sara.client@example.com",
    contactPhone: "+92 300 2222222",
    company: "Growth Mart",
    channel: "WhatsApp",
    status: "Pending",
    priority: "Medium",
    assignedTo: "Support Team",
    relatedType: "Customer",
    relatedRecord: "Growth Mart",
    source: "WhatsApp Business",
    sentiment: "Neutral",
    tags: "seo, report, existing client",
    slaDue: "2026-06-21T12:00",
    lastMessageAt: "2026-06-18T16:10",
    createdAt: "2026-06-18T15:40",
    unread: false,
    starred: false,
    messages: [
      {
        from: "Sara Client",
        type: "customer",
        time: "4:10 PM",
        body: "Can you send the latest SEO report and ranking update?",
      },
      {
        from: "Support Team",
        type: "agent",
        time: "4:20 PM",
        body: "Yes, we are preparing the report and will send it soon.",
      },
    ],
    internalNotes: "Need report from SEO team before sending final reply.",
  },
  {
    id: "COM-1003",
    subject: "Payment confirmation call",
    contactName: "Ahmed Khan",
    contactEmail: "ahmed@example.com",
    contactPhone: "+92 300 3333333",
    company: "Khan Traders",
    channel: "Phone",
    status: "Waiting Customer",
    priority: "High",
    assignedTo: "Admin User",
    relatedType: "Deal",
    relatedRecord: "Khan Traders Social Media Deal",
    source: "Outbound Call",
    sentiment: "Neutral",
    tags: "payment, invoice, follow-up",
    slaDue: "2026-06-20T18:00",
    lastMessageAt: "2026-06-19T11:00",
    createdAt: "2026-06-19T10:50",
    unread: false,
    starred: true,
    messages: [
      {
        from: "Admin User",
        type: "agent",
        time: "11:00 AM",
        body: "Called client for payment confirmation. Client asked to send invoice again.",
      },
    ],
    internalNotes: "Send invoice copy and follow up tomorrow.",
  },
  {
    id: "COM-1004",
    subject: "Instagram ad creative revision",
    contactName: "Maria Designs",
    contactEmail: "maria@example.com",
    contactPhone: "+92 300 4444444",
    company: "Maria Boutique",
    channel: "Social",
    status: "Open",
    priority: "Low",
    assignedTo: "Sara Khan",
    relatedType: "Project",
    relatedRecord: "Maria Boutique Ads Project",
    source: "Instagram DM",
    sentiment: "Positive",
    tags: "ads, creative, design",
    slaDue: "2026-06-22T10:00",
    lastMessageAt: "2026-06-19T08:30",
    createdAt: "2026-06-19T08:10",
    unread: true,
    starred: false,
    messages: [
      {
        from: "Maria Designs",
        type: "customer",
        time: "8:30 AM",
        body: "Please make the ad creative more premium and add a stronger offer line.",
      },
    ],
    internalNotes: "Design team should update the ad creative.",
  },
  {
    id: "COM-1005",
    subject: "Live chat support request",
    contactName: "Usman",
    contactEmail: "usman@example.com",
    contactPhone: "+92 300 5555555",
    company: "Walk-in Visitor",
    channel: "Live Chat",
    status: "Resolved",
    priority: "Medium",
    assignedTo: "Bilal Ahmed",
    relatedType: "Ticket",
    relatedRecord: "Chat Ticket 218",
    source: "Website Live Chat",
    sentiment: "Positive",
    tags: "support, live chat",
    slaDue: "2026-06-19T14:00",
    lastMessageAt: "2026-06-19T12:40",
    createdAt: "2026-06-19T12:05",
    unread: false,
    starred: false,
    messages: [
      {
        from: "Usman",
        type: "customer",
        time: "12:05 PM",
        body: "I need help understanding your monthly social media package.",
      },
      {
        from: "Bilal Ahmed",
        type: "agent",
        time: "12:20 PM",
        body: "I explained the package details and shared the pricing.",
      },
    ],
    internalNotes: "Resolved. Client may come back for package confirmation.",
  },
];

const emptyConversationForm = {
  subject: "",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  company: "",
  channel: "Email",
  status: "Open",
  priority: "Medium",
  assignedTo: "Admin User",
  relatedType: "Lead",
  relatedRecord: "",
  source: "",
  sentiment: "Neutral",
  tags: "",
  slaDue: "",
  firstMessage: "",
  internalNotes: "",
};

function channelIcon(channel) {
  const icons = {
    Email: Mail,
    WhatsApp: Smartphone,
    Phone: Phone,
    "Live Chat": MessageCircle,
    Social: Globe2,
    SMS: MessageSquareText,
  };

  return icons[channel] || MessageSquareText;
}

function channelClass(channel) {
  return (
    {
      Email: "bg-blue-50 text-blue-700 ring-blue-200",
      WhatsApp: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      Phone: "bg-amber-50 text-amber-700 ring-amber-200",
      "Live Chat": "bg-violet-50 text-violet-700 ring-violet-200",
      Social: "bg-pink-50 text-pink-700 ring-pink-200",
      SMS: "bg-cyan-50 text-cyan-700 ring-cyan-200",
    }[channel] || "bg-slate-100 text-slate-700 ring-slate-200"
  );
}

function statusClass(status) {
  return (
    {
      Open: "bg-blue-50 text-blue-700 ring-blue-200",
      Pending: "bg-amber-50 text-amber-700 ring-amber-200",
      "Waiting Customer": "bg-violet-50 text-violet-700 ring-violet-200",
      Resolved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      Archived: "bg-slate-100 text-slate-600 ring-slate-200",
    }[status] || "bg-slate-100 text-slate-700 ring-slate-200"
  );
}

function priorityClass(priority) {
  return (
    {
      Low: "bg-slate-100 text-slate-600 ring-slate-200",
      Medium: "bg-blue-50 text-blue-700 ring-blue-200",
      High: "bg-orange-50 text-orange-700 ring-orange-200",
      Urgent: "bg-rose-50 text-rose-700 ring-rose-200",
    }[priority] || "bg-slate-100 text-slate-700 ring-slate-200"
  );
}

function sentimentClass(sentiment) {
  return (
    {
      Positive: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      Neutral: "bg-slate-100 text-slate-600 ring-slate-200",
      Negative: "bg-rose-50 text-rose-700 ring-rose-200",
    }[sentiment] || "bg-slate-100 text-slate-600 ring-slate-200"
  );
}

function formatDateTime(value) {
  if (!value) return "Not set";

  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isOverdue(value, status) {
  if (!value || status === "Resolved" || status === "Archived") return false;

  return new Date(value).getTime() < new Date().getTime();
}

function Communications() {
  const [conversations, setConversations] = useState(demoConversations);
  const [search, setSearch] = useState("");
  const [channelFilter, setChannelFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState(emptyConversationForm);
  const [replyText, setReplyText] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const filteredConversations = useMemo(() => {
    const q = search.toLowerCase().trim();

    return conversations.filter((conversation) => {
      const searchOk =
        !q ||
        [
          conversation.id,
          conversation.subject,
          conversation.contactName,
          conversation.contactEmail,
          conversation.contactPhone,
          conversation.company,
          conversation.channel,
          conversation.status,
          conversation.priority,
          conversation.assignedTo,
          conversation.relatedType,
          conversation.relatedRecord,
          conversation.source,
          conversation.tags,
        ]
          .join(" ")
          .toLowerCase()
          .includes(q);

      const channelOk =
        channelFilter === "All" || conversation.channel === channelFilter;

      const statusOk =
        statusFilter === "All" || conversation.status === statusFilter;

      const priorityOk =
        priorityFilter === "All" || conversation.priority === priorityFilter;

      return searchOk && channelOk && statusOk && priorityOk;
    });
  }, [conversations, search, channelFilter, statusFilter, priorityFilter]);

  const stats = [
    {
      label: "Total Conversations",
      value: conversations.length,
      note: "All channels",
      icon: Inbox,
    },
    {
      label: "Open Threads",
      value: conversations.filter((item) => item.status === "Open").length,
      note: "Need response",
      icon: MessageSquareText,
    },
    {
      label: "Unread",
      value: conversations.filter((item) => item.unread).length,
      note: "New messages",
      icon: BellRing,
    },
    {
      label: "SLA Risk",
      value: conversations.filter((item) => isOverdue(item.slaDue, item.status))
        .length,
      note: "Overdue",
      icon: AlertCircle,
    },
  ];

  const channelStats = channels
    .filter((item) => item !== "All")
    .map((channel) => ({
      channel,
      count: conversations.filter((item) => item.channel === channel).length,
    }));

  const agentStats = agents.map((agent) => ({
    agent,
    open: conversations.filter(
      (item) => item.assignedTo === agent && item.status !== "Resolved"
    ).length,
  }));

  function setField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setField(name, value);
  }

  function resetCreateModal() {
    setForm(emptyConversationForm);
    setError("");
    setSuccess("");
    setShowCreateModal(false);
  }

  function handleCreateConversation(event) {
    event.preventDefault();
    setError("");

    if (!form.subject.trim()) {
      setError("Conversation subject is required.");
      return;
    }

    if (!form.contactName.trim()) {
      setError("Contact name is required.");
      return;
    }

    if (!form.firstMessage.trim()) {
      setError("First message is required.");
      return;
    }

    const newConversation = {
      id: `COM-${1000 + conversations.length + 1}`,
      subject: form.subject,
      contactName: form.contactName,
      contactEmail: form.contactEmail || "Not added",
      contactPhone: form.contactPhone || "Not added",
      company: form.company || "Not added",
      channel: form.channel,
      status: form.status,
      priority: form.priority,
      assignedTo: form.assignedTo,
      relatedType: form.relatedType,
      relatedRecord: form.relatedRecord || "Not linked",
      source: form.source || form.channel,
      sentiment: form.sentiment,
      tags: form.tags,
      slaDue: form.slaDue,
      lastMessageAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      unread: true,
      starred: false,
      messages: [
        {
          from: form.contactName,
          type: "customer",
          time: "Now",
          body: form.firstMessage,
        },
      ],
      internalNotes: form.internalNotes,
    };

    setConversations((prev) => [newConversation, ...prev]);
    setSuccess("Conversation created successfully.");
    resetCreateModal();
  }

  function openConversation(conversation) {
    setSelectedConversation(conversation);
    setConversations((prev) =>
      prev.map((item) =>
        item.id === conversation.id ? { ...item, unread: false } : item
      )
    );
  }

  function updateConversation(id, updates) {
    setConversations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );

    setSelectedConversation((prev) =>
      prev && prev.id === id ? { ...prev, ...updates } : prev
    );
  }

  function handleSendReply() {
    if (!selectedConversation) return;

    if (!replyText.trim()) {
      setError("Reply message cannot be empty.");
      return;
    }

    const newMessage = {
      from: selectedConversation.assignedTo,
      type: "agent",
      time: "Now",
      body: replyText,
    };

    const updatedMessages = [...selectedConversation.messages, newMessage];

    updateConversation(selectedConversation.id, {
      messages: updatedMessages,
      lastMessageAt: new Date().toISOString(),
      status: "Pending",
    });

    setReplyText("");
    setSuccess("Reply added successfully.");
  }

  function handleAddInternalNote() {
    if (!selectedConversation) return;

    if (!internalNote.trim()) {
      setError("Internal note cannot be empty.");
      return;
    }

    const currentNotes = selectedConversation.internalNotes || "";
    const updatedNotes = currentNotes
      ? `${currentNotes}\n\n${internalNote}`
      : internalNote;

    updateConversation(selectedConversation.id, {
      internalNotes: updatedNotes,
    });

    setInternalNote("");
    setSuccess("Internal note added successfully.");
  }

  function handleDelete(id) {
    setConversations((prev) => prev.filter((item) => item.id !== id));

    if (selectedConversation?.id === id) {
      setSelectedConversation(null);
    }
  }

  function toggleStar(conversation) {
    updateConversation(conversation.id, {
      starred: !conversation.starred,
    });
  }

  function applyTemplate(templateId) {
    const template = templates.find((item) => item.id === templateId);

    if (!template) return;

    setReplyText(template.text);
    setSelectedTemplate(templateId);
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
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600" />

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-sky-700">
                  <MessageSquareText size={14} />
                  Omnichannel Communication Center
                </div>

                <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                  Communications
                </h1>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                  Manage customer conversations across email, WhatsApp, phone,
                  live chat, social and SMS with ownership, SLA, priority,
                  notes, templates and CRM record linking.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50">
                  <Bot size={18} />
                  Automation Rules
                </button>

                <button
                  type="button"
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white shadow-lg shadow-slate-200 transition hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  <Plus size={18} />
                  New Conversation
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
                  <div className="rounded-2xl bg-sky-50 p-3 text-sky-700">
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
                    placeholder="Search contact, company, subject, channel, tags..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    [channelFilter, setChannelFilter, channels, "Channel"],
                    [statusFilter, setStatusFilter, statuses, "Status"],
                    [priorityFilter, setPriorityFilter, priorities, "Priority"],
                  ].map(([value, setter, options, label]) => (
                    <div key={label} className="relative">
                      {label === "Channel" && (
                        <Filter
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                          size={16}
                        />
                      )}

                      <select
                        value={value}
                        onChange={(event) => setter(event.target.value)}
                        className={`w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pr-9 text-sm font-bold text-slate-700 outline-none ${
                          label === "Channel" ? "pl-10" : "pl-4"
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
                    <th className="px-4 py-3">Conversation</th>
                    <th className="px-4 py-3">Contact</th>
                    <th className="px-4 py-3">Channel</th>
                    <th className="px-4 py-3">Owner</th>
                    <th className="px-4 py-3">SLA</th>
                    <th className="px-4 py-3">Priority</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredConversations.map((conversation) => {
                    const Icon = channelIcon(conversation.channel);
                    const overdue = isOverdue(
                      conversation.slaDue,
                      conversation.status
                    );

                    return (
                      <tr
                        key={conversation.id}
                        className="transition hover:bg-slate-50/80"
                      >
                        <td className="px-4 py-3">
                          <div className="flex min-w-0 items-start gap-3">
                            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-600 to-indigo-600 text-white shadow-lg shadow-sky-100">
                              <Icon size={18} />

                              {conversation.unread && (
                                <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-rose-500 ring-2 ring-white" />
                              )}
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="truncate font-black text-slate-950">
                                  {conversation.subject}
                                </p>

                                {conversation.starred && (
                                  <Star
                                    size={14}
                                    className="shrink-0 fill-amber-400 text-amber-400"
                                  />
                                )}
                              </div>

                              <p className="mt-1 text-xs text-slate-500">
                                {conversation.id} • {conversation.source}
                              </p>

                              <p className="mt-1 max-w-[300px] truncate text-xs text-slate-400">
                                {conversation.messages.at(-1)?.body}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <p className="font-bold text-slate-800">
                            {conversation.contactName}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {conversation.company}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {conversation.relatedType}:{" "}
                            {conversation.relatedRecord}
                          </p>
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex w-fit items-center gap-1 whitespace-nowrap rounded-full px-3 py-1 text-xs font-black ring-1 ${channelClass(
                              conversation.channel
                            )}`}
                          >
                            <Icon size={12} />
                            {conversation.channel}
                          </span>

                          <p className="mt-2 text-xs text-slate-500">
                            {formatDateTime(conversation.lastMessageAt)}
                          </p>
                        </td>

                        <td className="px-4 py-3">
                          <p className="font-bold text-slate-800">
                            {conversation.assignedTo}
                          </p>

                          <span
                            className={`mt-2 inline-flex w-fit items-center whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-black ring-1 ${sentimentClass(
                              conversation.sentiment
                            )}`}
                          >
                            {conversation.sentiment}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <p
                            className={`font-bold ${
                              overdue ? "text-rose-600" : "text-slate-800"
                            }`}
                          >
                            {formatDateTime(conversation.slaDue)}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {overdue ? "Overdue" : "On track"}
                          </p>
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex w-fit items-center whitespace-nowrap rounded-full px-3 py-1 text-xs font-black ring-1 ${priorityClass(
                              conversation.priority
                            )}`}
                          >
                            {conversation.priority}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex w-fit items-center whitespace-nowrap rounded-full px-3 py-1 text-xs font-black ring-1 ${statusClass(
                              conversation.status
                            )}`}
                          >
                            {conversation.status}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openConversation(conversation)}
                              className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
                              title="Open Conversation"
                            >
                              <Eye size={15} />
                            </button>

                            <button
                              onClick={() => toggleStar(conversation)}
                              className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
                              title="Star"
                            >
                              <Star
                                size={15}
                                className={
                                  conversation.starred
                                    ? "fill-amber-400 text-amber-400"
                                    : ""
                                }
                              />
                            </button>

                            <select
                              value={conversation.status}
                              onChange={(event) =>
                                updateConversation(conversation.id, {
                                  status: event.target.value,
                                })
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
                              onClick={() => handleDelete(conversation.id)}
                              className="rounded-lg border border-rose-100 p-2 text-rose-500 hover:bg-rose-50"
                              title="Delete"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredConversations.length === 0 && (
                <div className="p-10 text-center">
                  <MessageSquareText
                    className="mx-auto text-slate-300"
                    size={42}
                  />

                  <h3 className="mt-3 text-lg font-black text-slate-900">
                    No conversations found
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Change filters or create a new conversation.
                  </p>
                </div>
              )}
            </div>
          </div>

          <aside className="min-w-0 space-y-4">
            <div className="rounded-[1.4rem] border border-slate-200 bg-white p-4 shadow-sm 2xl:sticky 2xl:top-6">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-base font-black text-slate-950">
                  Channel Overview
                </h3>

                <MoreHorizontal className="text-slate-400" size={18} />
              </div>

              <div className="mt-4 space-y-2">
                {channelStats.map((item) => {
                  const Icon = channelIcon(item.channel);

                  return (
                    <div
                      key={item.channel}
                      className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5"
                    >
                      <div className="flex items-center gap-2">
                        <div className="rounded-lg bg-white p-1.5 text-sky-700">
                          <Icon size={15} />
                        </div>

                        <span className="text-xs font-black text-slate-700">
                          {item.channel}
                        </span>
                      </div>

                      <span className="rounded-full bg-white px-2 py-1 text-xs font-black text-slate-500">
                        {item.count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[1.4rem] border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-base font-black text-slate-950">
                Agent Workload
              </h3>

              <div className="mt-4 space-y-2">
                {agentStats.map((item) => (
                  <div
                    key={item.agent}
                    className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2.5"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-xs font-black text-white">
                        {item.agent
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .slice(0, 2)}
                      </div>

                      <p className="truncate text-xs font-black text-slate-900">
                        {item.agent}
                      </p>
                    </div>

                    <span className="rounded-full bg-white px-2 py-1 text-xs font-black text-slate-500">
                      {item.open}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.4rem] border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-base font-black text-slate-950">
                Quick Templates
              </h3>

              <div className="mt-4 space-y-2">
                {templates.map((template) => (
                  <div key={template.id} className="rounded-xl bg-slate-50 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-black text-slate-900">
                        {template.name}
                      </p>

                      <span className="rounded-full bg-white px-2 py-1 text-[10px] font-black text-slate-500">
                        {template.channel}
                      </span>
                    </div>

                    <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-slate-500">
                      {template.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-3 backdrop-blur-sm sm:p-5">
          <form
            onSubmit={handleCreateConversation}
            className="my-4 flex h-[88vh] w-full max-w-6xl flex-col overflow-hidden rounded-[1.7rem] bg-white shadow-2xl"
          >
            <div className="shrink-0 border-b border-slate-100 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-950">
                    New Conversation
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Create a new customer communication thread and link it with
                    a CRM record.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={resetCreateModal}
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
                      <MessageSquareText size={15} />
                      Conversation Details
                    </h3>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        placeholder="Subject"
                        className="sm:col-span-2 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-500"
                      />

                      <select
                        name="channel"
                        value={form.channel}
                        onChange={handleChange}
                        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold outline-none focus:border-slate-500"
                      >
                        {channels
                          .filter((channel) => channel !== "All")
                          .map((channel) => (
                            <option key={channel}>{channel}</option>
                          ))}
                      </select>

                      <select
                        name="source"
                        value={form.source}
                        onChange={handleChange}
                        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold outline-none focus:border-slate-500"
                      >
                        <option value="">Select Source</option>
                        <option>Website Form</option>
                        <option>WhatsApp Business</option>
                        <option>Outbound Call</option>
                        <option>Instagram DM</option>
                        <option>Website Live Chat</option>
                        <option>Manual Entry</option>
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
                        name="priority"
                        value={form.priority}
                        onChange={handleChange}
                        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold outline-none focus:border-slate-500"
                      >
                        {priorities
                          .filter((priority) => priority !== "All")
                          .map((priority) => (
                            <option key={priority}>{priority}</option>
                          ))}
                      </select>
                    </div>
                  </div>

                  <div className="rounded-[1.3rem] border border-slate-200 p-4">
                    <h3 className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500">
                      <Users size={15} />
                      Contact Information
                    </h3>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        name="contactName"
                        value={form.contactName}
                        onChange={handleChange}
                        placeholder="Contact Name"
                        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-500"
                      />

                      <input
                        name="company"
                        value={form.company}
                        onChange={handleChange}
                        placeholder="Company"
                        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-500"
                      />

                      <input
                        name="contactEmail"
                        type="email"
                        value={form.contactEmail}
                        onChange={handleChange}
                        placeholder="Email"
                        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-500"
                      />

                      <input
                        name="contactPhone"
                        value={form.contactPhone}
                        onChange={handleChange}
                        placeholder="Phone"
                        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-500"
                      />
                    </div>
                  </div>

                  <div className="rounded-[1.3rem] border border-slate-200 p-4">
                    <h3 className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500">
                      <Reply size={15} />
                      First Message
                    </h3>

                    <textarea
                      name="firstMessage"
                      value={form.firstMessage}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Write or paste the first customer message..."
                      className="w-full resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-500"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-[1.3rem] border border-slate-200 p-4">
                    <h3 className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500">
                      <ShieldCheck size={15} />
                      Assignment & CRM Link
                    </h3>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <select
                        name="assignedTo"
                        value={form.assignedTo}
                        onChange={handleChange}
                        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold outline-none focus:border-slate-500"
                      >
                        {agents.map((agent) => (
                          <option key={agent}>{agent}</option>
                        ))}
                      </select>

                      <select
                        name="sentiment"
                        value={form.sentiment}
                        onChange={handleChange}
                        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold outline-none focus:border-slate-500"
                      >
                        <option>Positive</option>
                        <option>Neutral</option>
                        <option>Negative</option>
                      </select>

                      <select
                        name="relatedType"
                        value={form.relatedType}
                        onChange={handleChange}
                        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold outline-none focus:border-slate-500"
                      >
                        {relatedTypes.map((type) => (
                          <option key={type}>{type}</option>
                        ))}
                      </select>

                      <input
                        name="relatedRecord"
                        value={form.relatedRecord}
                        onChange={handleChange}
                        placeholder="Related Record Name"
                        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-500"
                      />

                      <input
                        name="slaDue"
                        type="datetime-local"
                        value={form.slaDue}
                        onChange={handleChange}
                        className="sm:col-span-2 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-500"
                      />
                    </div>
                  </div>

                  <div className="rounded-[1.3rem] border border-slate-200 p-4">
                    <h3 className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500">
                      <Tag size={15} />
                      Tags & Internal Notes
                    </h3>

                    <input
                      name="tags"
                      value={form.tags}
                      onChange={handleChange}
                      placeholder="Tags e.g. hot lead, payment, support"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-500"
                    />

                    <textarea
                      name="internalNotes"
                      value={form.internalNotes}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Private internal note for your team..."
                      className="mt-3 w-full resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-500"
                    />
                  </div>

                  <div className="rounded-[1.3rem] border border-slate-200 bg-slate-50 p-4">
                    <h3 className="text-xs font-black uppercase tracking-wide text-slate-500">
                      Routing Preview
                    </h3>

                    <div className="mt-3 rounded-2xl bg-white p-4">
                      <p className="text-sm font-black text-slate-950">
                        {form.channel} → {form.assignedTo}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Priority: {form.priority} • Status: {form.status}
                      </p>

                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        Linked with {form.relatedType}:{" "}
                        {form.relatedRecord || "Not selected"}
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
                  onClick={resetCreateModal}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-black text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-slate-950 px-6 py-2.5 text-sm font-black text-white hover:bg-slate-800"
                >
                  Create Conversation
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {selectedConversation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="my-8 flex h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-[1.7rem] bg-white shadow-2xl">
            <div className="shrink-0 border-b border-slate-100 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                    {selectedConversation.id} • {selectedConversation.channel}
                  </p>

                  <h2 className="mt-1 break-words text-2xl font-black text-slate-950">
                    {selectedConversation.subject}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {selectedConversation.contactName} •{" "}
                    {selectedConversation.company}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedConversation(null)}
                  className="rounded-xl bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-5">
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_330px]">
                <div className="space-y-4">
                  <div className="rounded-[1.3rem] border border-slate-200 p-4">
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-black ring-1 ${channelClass(
                          selectedConversation.channel
                        )}`}
                      >
                        {selectedConversation.channel}
                      </span>

                      <span
                        className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-black ring-1 ${priorityClass(
                          selectedConversation.priority
                        )}`}
                      >
                        {selectedConversation.priority}
                      </span>

                      <span
                        className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-black ring-1 ${statusClass(
                          selectedConversation.status
                        )}`}
                      >
                        {selectedConversation.status}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {selectedConversation.messages.map((message, index) => (
                        <div
                          key={`${message.time}-${index}`}
                          className={`flex ${
                            message.type === "agent"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[78%] rounded-2xl p-4 ${
                              message.type === "agent"
                                ? "bg-slate-950 text-white"
                                : "bg-slate-50 text-slate-800"
                            }`}
                          >
                            <div className="mb-1 flex items-center justify-between gap-3">
                              <p className="text-xs font-black">
                                {message.from}
                              </p>

                              <p
                                className={`text-[11px] ${
                                  message.type === "agent"
                                    ? "text-slate-300"
                                    : "text-slate-400"
                                }`}
                              >
                                {message.time}
                              </p>
                            </div>

                            <p className="text-sm leading-6">{message.body}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[1.3rem] border border-slate-200 p-4">
                    <div className="mb-3 flex flex-col gap-3 sm:flex-row">
                      <select
                        value={selectedTemplate}
                        onChange={(event) => applyTemplate(event.target.value)}
                        className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold outline-none focus:border-slate-500"
                      >
                        <option value="">Use Template</option>

                        {templates.map((template) => (
                          <option key={template.id} value={template.id}>
                            {template.name}
                          </option>
                        ))}
                      </select>

                      <select
                        value={selectedConversation.status}
                        onChange={(event) =>
                          updateConversation(selectedConversation.id, {
                            status: event.target.value,
                          })
                        }
                        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold outline-none focus:border-slate-500"
                      >
                        {statuses
                          .filter((status) => status !== "All")
                          .map((status) => (
                            <option key={status}>{status}</option>
                          ))}
                      </select>
                    </div>

                    <textarea
                      value={replyText}
                      onChange={(event) => setReplyText(event.target.value)}
                      rows={4}
                      placeholder="Write reply..."
                      className="w-full resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-500"
                    />

                    <div className="mt-3 flex justify-end">
                      <button
                        type="button"
                        onClick={handleSendReply}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-black text-white hover:bg-slate-800"
                      >
                        <Send size={16} />
                        Send Reply
                      </button>
                    </div>
                  </div>
                </div>

                <aside className="space-y-4">
                  <div className="rounded-[1.3rem] border border-slate-200 p-4">
                    <h3 className="text-sm font-black text-slate-950">
                      Contact & CRM Link
                    </h3>

                    <div className="mt-4 space-y-3">
                      {[
                        ["Contact", selectedConversation.contactName, Users],
                        ["Email", selectedConversation.contactEmail, Mail],
                        ["Phone", selectedConversation.contactPhone, Phone],
                        ["Company", selectedConversation.company, Globe2],
                        [
                          "Assigned To",
                          selectedConversation.assignedTo,
                          UserCheck,
                        ],
                        [
                          "Related",
                          `${selectedConversation.relatedType}: ${selectedConversation.relatedRecord}`,
                          Archive,
                        ],
                        [
                          "SLA Due",
                          formatDateTime(selectedConversation.slaDue),
                          CalendarClock,
                        ],
                        ["Tags", selectedConversation.tags || "No tags", Tag],
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

                  <div className="rounded-[1.3rem] border border-slate-200 p-4">
                    <h3 className="text-sm font-black text-slate-950">
                      Internal Notes
                    </h3>

                    <div className="mt-3 rounded-xl bg-slate-50 p-3">
                      <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                        {selectedConversation.internalNotes ||
                          "No internal notes added."}
                      </p>
                    </div>

                    <textarea
                      value={internalNote}
                      onChange={(event) => setInternalNote(event.target.value)}
                      rows={3}
                      placeholder="Add private note..."
                      className="mt-3 w-full resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-500"
                    />

                    <button
                      type="button"
                      onClick={handleAddInternalNote}
                      className="mt-3 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-black text-slate-700 hover:bg-slate-50"
                    >
                      Add Internal Note
                    </button>
                  </div>

                  <div className="rounded-[1.3rem] border border-slate-200 p-4">
                    <h3 className="text-sm font-black text-slate-950">
                      Quick Actions
                    </h3>

                    <div className="mt-3 grid gap-2">
                      <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-50 px-4 py-2.5 text-sm font-black text-sky-700">
                        <Zap size={15} />
                        Create Follow-up
                      </button>

                      <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-black text-emerald-700">
                        <CheckCircle2 size={15} />
                        Mark Resolved
                      </button>

                      <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-black text-slate-700">
                        <Archive size={15} />
                        Archive Thread
                      </button>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Communications;