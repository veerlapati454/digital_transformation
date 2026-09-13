// ─── ADMIN SESSION ───
function getCurrentUser() {
  try {
    const raw = localStorage.getItem('user');
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!raw || !isAuthenticated) return null;
    return JSON.parse(raw);
  } catch { return null; }
}
function usernameFromEmail(email) { if (!email) return ''; return email.includes('@') ? email.split('@')[0] : email; }
function getInitial(name, email) {
  const source = (name || email || '').trim();
  return source ? source.charAt(0).toUpperCase() : '?';
}

const currentUser = getCurrentUser();
const currentEmail = currentUser?.email || '';
const currentName = currentUser?.name || '';
const currentUsername = currentName || usernameFromEmail(currentEmail);
const currentInitial = getInitial(currentName, currentEmail);

function paintUserChrome() {
  const nameToShow = currentUsername || currentEmail || 'Signed out';
  const displayEmail = currentEmail || 'No account signed in';
  document.getElementById('sidebar-user-avatar').textContent = currentInitial;
  document.getElementById('sidebar-user-name').textContent = nameToShow;
  document.getElementById('sidebar-user-email').textContent = displayEmail;
  document.getElementById('topbar-user-avatar').textContent = currentInitial;
  document.getElementById('topbar-user-name').textContent = nameToShow;
  document.getElementById('topbar-user-email').textContent = displayEmail;
}
function logout() {
  localStorage.removeItem('user');
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('adminActiveNav');
  window.location.href = 'login.html';
}

// ─── ADMIN DATA (portfolio-wide: every client, engagement, consultant and invoice) ───
const engagementTypeAccents = {
  governance: "#1F9184",
  cloud: "#F15A29",
  automation: "#E0518F",
  analytics: "#7C4DDB",
  security: "#8E93A6"
};
const engagementTypeName = { governance: "Data Governance", cloud: "Cloud Migration", automation: "Process Automation", analytics: "Analytics & BI", security: "Security & Compliance" };

const clients = [
  { name: "Meridian Retail Group", industry: "Retail", owner: "Ananya Rao", status: "Active", health: "On Track", engagementsActive: 2, contractValue: 420000, since: "Feb 2026" },
  { name: "Vantage Freight Co", industry: "Logistics", owner: "Rohan Mehta", status: "Active", health: "At Risk", engagementsActive: 1, contractValue: 210000, since: "Jul 2026" },
  { name: "Northbridge Capital", industry: "Financial Services", owner: "Divya Nair", status: "Active", health: "On Track", engagementsActive: 1, contractValue: 380000, since: "Jan 2026" },
  { name: "Solace Health Network", industry: "Healthcare", owner: "Nisha Kapoor", status: "Onboarding", health: "On Track", engagementsActive: 1, contractValue: 150000, since: "Aug 2026" },
  { name: "Fernwood Manufacturing", industry: "Manufacturing", owner: "Arjun Verma", status: "Paused", health: "Blocked", engagementsActive: 1, contractValue: 95000, since: "Apr 2026" },
  { name: "Kestrel Media Group", industry: "Media", owner: "Ananya Rao", status: "Active", health: "On Track", engagementsActive: 1, contractValue: 260000, since: "May 2026" }
];

const consultants = [
  { name: "Ananya Rao", role: "Governance Lead", utilization: 88, activeEngagements: 3, online: true },
  { name: "Nisha Kapoor", role: "Automation Lead", utilization: 92, activeEngagements: 3, online: true },
  { name: "Divya Nair", role: "Security Lead", utilization: 70, activeEngagements: 2, online: true },
  { name: "Rohan Mehta", role: "Cloud Architect", utilization: 64, activeEngagements: 2, online: false },
  { name: "Arjun Verma", role: "Analytics Lead", utilization: 55, activeEngagements: 2, online: false },
  { name: "Karan Bhatt", role: "Associate Consultant", utilization: 40, activeEngagements: 1, online: true }
];

const engagementsAll = [
  { client: "Meridian Retail Group", type: "governance", title: "Data Governance Overhaul — Phase 2", consultant: "Ananya Rao", status: "Active", progress: 62, nextMilestone: "Policy sign-off review", nextDate: "Sep 5, 2026" },
  { client: "Meridian Retail Group", type: "analytics", title: "Store Performance Dashboard", consultant: "Arjun Verma", status: "Active", progress: 48, nextMilestone: "Data model review", nextDate: "Sep 18, 2026" },
  { client: "Vantage Freight Co", type: "cloud", title: "Cloud Migration — AWS Landing Zone", consultant: "Rohan Mehta", status: "Kickoff Pending", progress: 10, nextMilestone: "Kickoff call with cloud lead", nextDate: "Sep 8, 2026" },
  { client: "Northbridge Capital", type: "security", title: "Security & Compliance Baseline", consultant: "Divya Nair", status: "Active", progress: 74, nextMilestone: "Control testing sign-off", nextDate: "Sep 20, 2026" },
  { client: "Solace Health Network", type: "automation", title: "Patient Intake Automation", consultant: "Nisha Kapoor", status: "Kickoff Pending", progress: 15, nextMilestone: "Process mapping workshop", nextDate: "Sep 9, 2026" },
  { client: "Fernwood Manufacturing", type: "analytics", title: "Plant Floor Analytics Rollout", consultant: "Arjun Verma", status: "Paused", progress: 34, nextMilestone: "Awaiting data access renewal", nextDate: "TBD" },
  { client: "Kestrel Media Group", type: "automation", title: "CRM & Sales Ops Automation", consultant: "Nisha Kapoor", status: "Active", progress: 78, nextMilestone: "UAT walkthrough", nextDate: "Sep 12, 2026" }
];

const invoicesAll = [
  { client: "Meridian Retail Group", facility: "governance", invoiceNo: "INV-2026-0847", amount: 180000, dueDate: "Sep 1, 2026", status: "Due" },
  { client: "Vantage Freight Co", facility: "cloud", invoiceNo: "INV-2026-0839", amount: 42000, dueDate: "Aug 20, 2026", status: "Overdue" },
  { client: "Kestrel Media Group", facility: "automation", invoiceNo: "INV-2026-0851", amount: 66000, dueDate: "Sep 10, 2026", status: "Due" },
  { client: "Fernwood Manufacturing", facility: "analytics", invoiceNo: "INV-2026-0812", amount: 91000, dueDate: "Jul 30, 2026", status: "Paid" },
  { client: "Northbridge Capital", facility: "security", invoiceNo: "INV-2026-0798", amount: 58500, dueDate: "Jul 15, 2026", status: "Paid" },
  { client: "Meridian Retail Group", facility: "analytics", invoiceNo: "INV-2026-0863", amount: 74000, dueDate: "Sep 25, 2026", status: "Due" },
  { client: "Solace Health Network", facility: "automation", invoiceNo: "INV-2026-0871", amount: 38000, dueDate: "Aug 5, 2026", status: "Overdue" }
];

const pipeline = [
  { prospect: "Ridgeline Insurance", stage: "Proposal Sent", value: 240000, owner: "Divya Nair", closeDate: "Oct 2026" },
  { prospect: "Amara Foods", stage: "Discovery", value: 130000, owner: "Nisha Kapoor", closeDate: "Nov 2026" },
  { prospect: "Blue Harbor Logistics", stage: "Negotiation", value: 310000, owner: "Rohan Mehta", closeDate: "Sep 2026" },
  { prospect: "Solstice Energy", stage: "Closed Won", value: 275000, owner: "Ananya Rao", closeDate: "Sep 2026" },
  { prospect: "Praxis Legal Partners", stage: "Discovery", value: 98000, owner: "Arjun Verma", closeDate: "Dec 2026" }
];

const liveFeed = [
  { icon: "fa-file-invoice-dollar", text: "Invoice INV-2026-0839 (Vantage Freight Co) is now overdue", time: "1h ago" },
  { icon: "fa-user-plus", text: "Solace Health Network moved from Onboarding to first kickoff", time: "5h ago" },
  { icon: "fa-file-signature", text: "Meridian Retail Group signed off on the data flow audit", time: "1d ago" },
  { icon: "fa-triangle-exclamation", text: "Fernwood Manufacturing engagement flagged At Risk by Arjun Verma", time: "2d ago" },
  { icon: "fa-handshake", text: "Solstice Energy pipeline deal marked Closed Won", time: "2d ago" },
  { icon: "fa-circle-check", text: "Northbridge Capital compliance controls passed testing", time: "3d ago" }
];

const navItemsList = [
  { icon: "fa-gauge-high", label: "Overview", id: "overview" },
  { icon: "fa-building", label: "Clients", id: "clients" },
  { icon: "fa-diagram-project", label: "Engagements", id: "engagements" },
  { icon: "fa-user-group", label: "Consultants", id: "consultants" },
  { icon: "fa-file-invoice-dollar", label: "Billing", id: "billing" },
  { icon: "fa-chart-line", label: "Pipeline", id: "pipeline" },
  { icon: "fa-gear", label: "Settings", id: "settings" }
];

const clientStatusColor = { "Active": "status-active", "Onboarding": "status-gold", "Paused": "status-review", "Churned": "status-complete" };
const healthColor = { "On Track": "status-active", "At Risk": "status-gold", "Blocked": "status-review" };
const engagementStatusColor = { "Active": "status-active", "Kickoff Pending": "status-gold", "Paused": "status-review", "Completed": "status-complete" };
const invoiceColor = { "Paid": "#1F9184", "Due": "#F15A29", "Overdue": "#E4483A" };
const pipelineStageColor = { "Discovery": "status-gold", "Proposal Sent": "status-field", "Negotiation": "status-review", "Closed Won": "status-active" };

const pageMap = {
  overview:    { title: "Overview", sub: "Portfolio health across every client, consultant and invoice" },
  clients:     { title: "Clients", sub: "Every account on the platform and who owns it" },
  engagements: { title: "Engagements", sub: "All active and pending work, across every client" },
  consultants: { title: "Consultants", sub: "Team utilization and current workload" },
  billing:     { title: "Billing", sub: "Invoices and outstanding balances across the portfolio" },
  pipeline:    { title: "Pipeline", sub: "Prospective accounts moving through the funnel" },
  settings:    { title: "Settings", sub: "Admin account and preferences" }
};

let state = {
  activeNav: (function () {
    const saved = localStorage.getItem('adminActiveNav');
    return saved && pageMap[saved] ? saved : "overview";
  })(),
  settings: { notifications: true, emailDigest: true, darkMode: false, language: "English" }
};

function fmt(n) { return "₹" + n.toLocaleString("en-IN"); }
function go404() { window.location.href = "404.html"; }

function regionTag(facility, labelMap) {
  const c = engagementTypeAccents[facility] || "#F15A29";
  const label = labelMap ? labelMap[facility] : facility;
  return `<span class="region-tag" style="color:${c};border-color:${c};background:${c}1F;">${label}</span>`;
}

function animateStatBars() {
  requestAnimationFrame(() => {
    document.querySelectorAll('.stat-bar-fill, .progress-fill').forEach(el => {
      const target = el.getAttribute('data-w');
      if (target) el.style.width = target + '%';
    });
    const donut = document.querySelector('.donut-svg');
    if (donut) donut.classList.add('drawn');
  });
}

function initAOS() {
  AOS.init({ duration: 600, once: true, offset: 20, easing: 'ease-out-cubic', disable: window.innerWidth < 768 });
}

// Build donut segments proportional to invoiced amount per engagement type, on a 212-unit ring
function buildDonutSegments() {
  const totals = {};
  invoicesAll.forEach(i => { totals[i.facility] = (totals[i.facility] || 0) + i.amount; });
  const grandTotal = Object.values(totals).reduce((a, b) => a + b, 0);
  let offset = 0;
  const order = ["governance", "cloud", "automation", "analytics", "security"];
  return order.filter(k => totals[k]).map(k => {
    const units = Math.max(2, Math.round((totals[k] / grandTotal) * 212));
    const seg = { color: engagementTypeAccents[k], label: engagementTypeName[k], units, offset: -offset, pct: Math.round((totals[k] / grandTotal) * 100) };
    offset += units;
    return seg;
  });
}

// ─── RENDER FUNCTIONS ───
function renderOverview() {
  const activeClients = clients.filter(c => c.status === "Active").length;
  const engagementsInFlight = engagementsAll.filter(e => e.status !== "Completed").length;
  const avgUtilization = Math.round(consultants.reduce((a, c) => a + c.utilization, 0) / consultants.length);
  const revenueAtRisk = invoicesAll.filter(i => i.status === "Overdue").reduce((a, i) => a + i.amount, 0);

  const stats = [
    { icon: "fa-building", delta: clients.length + " total", value: String(activeClients), label: "Active Clients", bar: Math.round((activeClients / clients.length) * 100), accent: true },
    { icon: "fa-diagram-project", delta: "In flight", value: String(engagementsInFlight), label: "Open Engagements", bar: 70 },
    { icon: "fa-gauge", delta: "Team average", value: avgUtilization + "%", label: "Consultant Utilization", bar: avgUtilization, warn: avgUtilization > 85 },
    { icon: "fa-triangle-exclamation", delta: invoicesAll.filter(i => i.status === "Overdue").length + " overdue", value: fmt(revenueAtRisk), label: "Revenue At Risk", bar: 55, warn: revenueAtRisk > 0 }
  ];
  const statsHtml = stats.map((s, i) =>
    `<div class="stat-card ${s.accent ? "stat-accent" : ""}" data-aos="fade-up" data-aos-delay="${i * 60}" onclick="go404()">
      <div class="stat-top"><i class="fa-solid ${s.icon} stat-icon"></i><span class="stat-delta ${s.warn ? "warn" : "up"}">${s.delta}</span></div>
      <div class="stat-value" style="font-size:${String(s.value).length > 8 ? '21px' : '27px'}">${s.value}</div><div class="stat-label">${s.label}</div>
      <div class="stat-bar"><div class="stat-bar-fill" data-w="${s.bar}"></div></div>
    </div>`
  ).join("");

  const pipelineRows = engagementsAll.slice(0, 6).map(e =>
    `<tr onclick="go404()">
      <td><div class="t-name">${e.title}</div><div class="t-sub">${e.client}</div></td>
      <td>${regionTag(e.type, engagementTypeName)}</td>
      <td class="type-col">${e.consultant}</td>
      <td><span class="status-badge ${engagementStatusColor[e.status]}">${e.status}</span></td>
      <td><div class="progress-wrap"><div class="progress-bar"><div class="progress-fill" data-w="${e.progress}"></div></div><span class="progress-pct">${e.progress}%</span></div></td>
    </tr>`
  ).join("");

  const feedHtml = liveFeed.map(a =>
    `<li class="activity-item" onclick="go404()">
      <i class="fa-solid ${a.icon} act-icon"></i>
      <div class="act-body"><p class="act-text">${a.text}</p><span class="act-time">${a.time}</span></div>
    </li>`
  ).join("");

  const atRiskClients = clients.filter(c => c.health !== "On Track").map(c =>
    `<li class="team-item" onclick="go404()">
      <div class="member-avatar">${c.name.split(" ").map(p => p.charAt(0)).join("").slice(0,2)}</div>
      <div class="member-info"><div class="member-name">${c.name}</div><div class="member-role">Owner: ${c.owner}</div></div>
      <span class="status-badge ${healthColor[c.health]}">${c.health}</span>
    </li>`
  ).join("") || `<li class="team-item"><div class="member-info"><div class="member-name">No accounts flagged</div><div class="member-role">Every client is on track</div></div></li>`;

  const topUtilized = [...consultants].sort((a, b) => b.utilization - a.utilization).slice(0, 5).map(c =>
    `<li class="team-item" onclick="go404()">
      <div class="member-avatar">${c.name.split(" ").map(p => p.charAt(0)).join("")}<span class="online-dot ${c.online ? "dot-active" : "dot-away"}"></span></div>
      <div class="member-info"><div class="member-name">${c.name}</div><div class="member-role">${c.role}</div></div>
      <div class="member-projects"><span class="proj-count">${c.utilization}%</span><span class="proj-label">Utilized</span></div>
    </li>`
  ).join("");

  const totalInvoiced = invoicesAll.reduce((a, i) => a + i.amount, 0);
  const segments = buildDonutSegments();
  const circles = segments.map(s => `<circle cx="60" cy="60" r="48" fill="none" stroke="${s.color}" stroke-width="16" stroke-dasharray="${s.units} 212" stroke-dashoffset="${s.offset}" stroke-linecap="round" transform="rotate(-90 60 60)"/>`).join("");
  const legendHtml = segments.map(s =>
    `<li class="legend-item" onclick="go404()">
      <span class="legend-dot" style="background:${s.color}"></span>
      <span class="legend-label">${s.label}</span>
      <span class="legend-count">${s.pct}%</span>
    </li>`
  ).join("");

  return `
    <div class="hero-banner" data-aos="fade">
      <div class="hero-banner-inner">
        <div class="hero-eyebrow">Admin Console</div>
        <h2>Run the whole engagement portfolio from one place</h2>
        <p>Track every client relationship, keep consultant workload balanced, catch invoices before they slip, and see what's moving through the pipeline — all from a single view.</p>
      </div>
    </div>
    <section class="stats-grid" data-aos="fade-up" data-aos-delay="0">${statsHtml}</section>
    <section class="mid-grid">
      <div class="card" data-aos="fade-up" data-aos-delay="100">
        <div class="card-header"><div><h2 class="card-title">Engagements In Flight</h2><p class="card-sub">Across every client, most recently started first</p></div></div>
        <div class="table-wrapper"><table class="runs-table"><thead><tr><th>Engagement</th><th>Type</th><th>Consultant</th><th>Status</th><th>Progress</th></tr></thead><tbody>${pipelineRows}</tbody></table></div>
      </div>
      <div class="card" data-aos="fade-up" data-aos-delay="150">
        <div class="card-header"><div><h2 class="card-title">Recent Activity</h2><p class="card-sub">Latest platform-wide updates</p></div></div>
        <ul class="activity-list">${feedHtml}</ul>
      </div>
    </section>
    <section class="bottom-grid">
      <div class="card" data-aos="fade-up" data-aos-delay="200">
        <div class="card-header"><div><h2 class="card-title">Accounts Needing Attention</h2><p class="card-sub">Flagged At Risk or Blocked</p></div></div>
        <ul class="team-list">${atRiskClients}</ul>
      </div>
      <div class="card" data-aos="fade-up" data-aos-delay="250">
        <div class="card-header"><div><h2 class="card-title">Highest Utilized</h2><p class="card-sub">Consultants closest to capacity</p></div></div>
        <ul class="team-list">${topUtilized}</ul>
      </div>
      <div class="card" data-aos="fade-up" data-aos-delay="300">
        <div class="card-header"><div><h2 class="card-title">Revenue Mix</h2><p class="card-sub">${fmt(totalInvoiced)} invoiced by practice area</p></div></div>
        <div class="donut-chart" onclick="go404()">
          <svg viewBox="0 0 120 120" class="donut-svg">
            <circle cx="60" cy="60" r="48" fill="none" stroke="#241D3B" stroke-width="16"/>
            ${circles}
            <text x="60" y="56" text-anchor="middle" class="donut-num">${clients.length}</text>
            <text x="60" y="68" text-anchor="middle" class="donut-label">Clients</text>
          </svg>
        </div>
        <ul class="legend-list">${legendHtml}</ul>
      </div>
    </section>
  `;
}

function renderClients() {
  const stats = [
    { icon: "fa-building", value: clients.length, label: "Total Clients", bar: 100, accent: true },
    { icon: "fa-circle-check", value: clients.filter(c => c.status === "Active").length, label: "Active", bar: 70 },
    { icon: "fa-user-clock", value: clients.filter(c => c.status === "Onboarding").length, label: "Onboarding", bar: 30 },
    { icon: "fa-triangle-exclamation", value: clients.filter(c => c.health !== "On Track").length, label: "Flagged", bar: 40, warn: true }
  ];
  const statsHtml = stats.map((s, i) =>
    `<div class="stat-card ${s.accent ? "stat-accent" : ""}" data-aos="fade-up" data-aos-delay="${i * 60}" onclick="go404()">
      <div class="stat-top"><i class="fa-solid ${s.icon} stat-icon"></i></div>
      <div class="stat-value">${s.value}</div><div class="stat-label">${s.label}</div>
      <div class="stat-bar"><div class="stat-bar-fill" data-w="${s.bar}"></div></div>
    </div>`
  ).join("");

  const rows = clients.map(c =>
    `<tr onclick="go404()">
      <td><div class="t-name">${c.name}</div><div class="t-sub">Client since ${c.since}</div></td>
      <td class="type-col">${c.industry}</td>
      <td class="type-col">${c.owner}</td>
      <td><span class="status-badge ${clientStatusColor[c.status]}">${c.status}</span></td>
      <td><span class="status-badge ${healthColor[c.health]}">${c.health}</span></td>
      <td class="budget-col">${fmt(c.contractValue)}</td>
    </tr>`
  ).join("");

  return `
    <section class="stats-grid">${statsHtml}</section>
    <div class="card" data-aos="fade-up" data-aos-delay="100">
      <div class="card-header"><div><h2 class="card-title">All Clients</h2><p class="card-sub">Every account on the platform and who owns it</p></div></div>
      <div class="table-wrapper"><table class="runs-table"><thead><tr><th>Client</th><th>Industry</th><th>Account Owner</th><th>Status</th><th>Health</th><th>Contract Value</th></tr></thead><tbody>${rows}</tbody></table></div>
    </div>
  `;
}

function renderEngagements() {
  const stats = [
    { icon: "fa-diagram-project", value: engagementsAll.length, label: "Total Engagements", bar: 100, accent: true },
    { icon: "fa-circle-check", value: engagementsAll.filter(e => e.status === "Active").length, label: "Active", bar: 70 },
    { icon: "fa-hourglass-half", value: engagementsAll.filter(e => e.status === "Kickoff Pending").length, label: "Pending Kickoff", bar: 40 },
    { icon: "fa-pause", value: engagementsAll.filter(e => e.status === "Paused").length, label: "Paused", bar: 20, warn: true }
  ];
  const statsHtml = stats.map((s, i) =>
    `<div class="stat-card ${s.accent ? "stat-accent" : ""}" data-aos="fade-up" data-aos-delay="${i * 60}" onclick="go404()">
      <div class="stat-top"><i class="fa-solid ${s.icon} stat-icon"></i></div>
      <div class="stat-value">${s.value}</div><div class="stat-label">${s.label}</div>
      <div class="stat-bar"><div class="stat-bar-fill" data-w="${s.bar}"></div></div>
    </div>`
  ).join("");

  const rows = engagementsAll.map(e =>
    `<tr onclick="go404()">
      <td><div class="t-name">${e.title}</div><div class="t-sub">${e.client}</div></td>
      <td>${regionTag(e.type, engagementTypeName)}</td>
      <td class="type-col">${e.consultant}</td>
      <td><span class="status-badge ${engagementStatusColor[e.status]}">${e.status}</span></td>
      <td><div class="progress-wrap"><div class="progress-bar"><div class="progress-fill" data-w="${e.progress}"></div></div><span class="progress-pct">${e.progress}%</span></div></td>
      <td class="date-col">${e.nextMilestone} — ${e.nextDate}</td>
    </tr>`
  ).join("");

  return `
    <section class="stats-grid">${statsHtml}</section>
    <div class="card" data-aos="fade-up" data-aos-delay="100">
      <div class="card-header"><div><h2 class="card-title">All Engagements</h2><p class="card-sub">Every project in flight, across every client</p></div></div>
      <div class="table-wrapper"><table class="runs-table"><thead><tr><th>Engagement</th><th>Type</th><th>Consultant</th><th>Status</th><th>Progress</th><th>Next Step</th></tr></thead><tbody>${rows}</tbody></table></div>
    </div>
  `;
}

function renderConsultants() {
  const avgUtilization = Math.round(consultants.reduce((a, c) => a + c.utilization, 0) / consultants.length);
  const stats = [
    { icon: "fa-user-group", value: consultants.length, label: "Total Consultants", bar: 100, accent: true },
    { icon: "fa-gauge", value: avgUtilization + "%", label: "Average Utilization", bar: avgUtilization },
    { icon: "fa-circle-check", value: consultants.filter(c => c.online).length, label: "Online Now", bar: 60 },
    { icon: "fa-triangle-exclamation", value: consultants.filter(c => c.utilization >= 85).length, label: "Near Capacity", bar: 40, warn: true }
  ];
  const statsHtml = stats.map((s, i) =>
    `<div class="stat-card ${s.accent ? "stat-accent" : ""}" data-aos="fade-up" data-aos-delay="${i * 60}" onclick="go404()">
      <div class="stat-top"><i class="fa-solid ${s.icon} stat-icon"></i></div>
      <div class="stat-value">${s.value}</div><div class="stat-label">${s.label}</div>
      <div class="stat-bar"><div class="stat-bar-fill" data-w="${s.bar}"></div></div>
    </div>`
  ).join("");

  const cards = consultants.map((c, i) =>
    `<div class="research-card" data-aos="fade-up" data-aos-delay="${i * 40}">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
        <div class="member-avatar" style="width:42px;height:42px;font-size:15px">${c.name.split(" ").map(p => p.charAt(0)).join("")}<span class="online-dot ${c.online ? "dot-active" : "dot-away"}"></span></div>
        <div style="min-width:0">
          <div style="font-weight:600;color:var(--ink);font-size:14px;font-family:var(--font-display)">${c.name}</div>
          <div style="font-size:12px;color:var(--ink-faintest)">${c.role}</div>
        </div>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--ink-soft);margin-bottom:6px">
        <span>Utilization</span><span style="font-family:var(--font-mono);color:var(--ink)">${c.utilization}%</span>
      </div>
      <div class="progress-bar" style="margin-bottom:14px"><div class="progress-fill" data-w="${c.utilization}"></div></div>
      <button class="btn-outline" style="width:100%" onclick="go404()">${c.activeEngagements} active engagement${c.activeEngagements === 1 ? "" : "s"}</button>
    </div>`
  ).join("");

  return `
    <section class="stats-grid">${statsHtml}</section>
    <div class="card" data-aos="fade-up" data-aos-delay="100">
      <div class="card-header"><div><h2 class="card-title">Consulting Team</h2><p class="card-sub">Utilization and current workload</p></div></div>
      <div class="team-grid">${cards}</div>
    </div>
  `;
}

function renderBilling() {
  const totalInvoiced = invoicesAll.reduce((a, i) => a + i.amount, 0);
  const totalPaid = invoicesAll.filter(i => i.status === "Paid").reduce((a, i) => a + i.amount, 0);
  const totalOutstanding = invoicesAll.filter(i => i.status !== "Paid").reduce((a, i) => a + i.amount, 0);
  const overdueCount = invoicesAll.filter(i => i.status === "Overdue").length;
  const stats = [
    { icon: "fa-file-invoice-dollar", value: fmt(totalInvoiced), label: "Total Invoiced", bar: 100, accent: true },
    { icon: "fa-circle-check", value: fmt(totalPaid), label: "Collected", bar: Math.round((totalPaid / totalInvoiced) * 100) },
    { icon: "fa-clock", value: fmt(totalOutstanding), label: "Outstanding", bar: Math.round((totalOutstanding / totalInvoiced) * 100), warn: totalOutstanding > 0 },
    { icon: "fa-triangle-exclamation", value: overdueCount, label: "Overdue Invoices", bar: overdueCount > 0 ? 80 : 10, warn: overdueCount > 0 }
  ];
  const statsHtml = stats.map((s, i) =>
    `<div class="stat-card ${s.accent ? "stat-accent" : ""}" data-aos="fade-up" data-aos-delay="${i * 60}" onclick="go404()">
      <div class="stat-top"><i class="fa-solid ${s.icon} stat-icon"></i></div>
      <div class="stat-value" style="font-size:${s.label === 'Overdue Invoices' ? '27px' : '20px'}">${s.value}</div><div class="stat-label">${s.label}</div>
      <div class="stat-bar"><div class="stat-bar-fill" data-w="${s.bar}"></div></div>
    </div>`
  ).join("");

  const rows = invoicesAll.map(i => {
    const col = invoiceColor[i.status];
    return `<tr onclick="go404()">
      <td><div class="t-name">${i.invoiceNo}</div><div class="t-sub">${i.client}</div></td>
      <td>${regionTag(i.facility, engagementTypeName)}</td>
      <td class="budget-col">${fmt(i.amount)}</td>
      <td class="date-col">${i.dueDate}</td>
      <td><span class="status-badge" style="background:${col}1F;color:${col}">${i.status}</span></td>
    </tr>`;
  }).join("");

  return `
    <section class="stats-grid">${statsHtml}</section>
    <div class="card" data-aos="fade-up" data-aos-delay="100">
      <div class="card-header"><div><h2 class="card-title">Invoices</h2><p class="card-sub">Billing across every client</p></div></div>
      <div class="table-wrapper"><table class="runs-table"><thead><tr><th>Invoice</th><th>Practice Area</th><th>Amount</th><th>Due Date</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table></div>
    </div>
    <div class="card" data-aos="fade-up" data-aos-delay="150">
      <div class="card-header"><div><h2 class="card-title">Collections</h2><p class="card-sub">Chase down what's outstanding</p></div></div>
      <div style="display:flex;gap:12px;flex-wrap:wrap">
        <button class="btn-solid" onclick="go404()">Send Payment Reminders</button>
        <button class="btn-outline" onclick="go404()">Export Statement</button>
      </div>
    </div>
  `;
}

function renderPipeline() {
  const totalValue = pipeline.reduce((a, p) => a + p.value, 0);
  const stats = [
    { icon: "fa-chart-line", value: pipeline.length, label: "Open Opportunities", bar: 100, accent: true },
    { icon: "fa-sack-dollar", value: fmt(totalValue), label: "Pipeline Value", bar: 70 },
    { icon: "fa-handshake", value: pipeline.filter(p => p.stage === "Closed Won").length, label: "Closed Won", bar: 40 },
    { icon: "fa-magnifying-glass", value: pipeline.filter(p => p.stage === "Discovery").length, label: "In Discovery", bar: 30 }
  ];
  const statsHtml = stats.map((s, i) =>
    `<div class="stat-card ${s.accent ? "stat-accent" : ""}" data-aos="fade-up" data-aos-delay="${i * 60}" onclick="go404()">
      <div class="stat-top"><i class="fa-solid ${s.icon} stat-icon"></i></div>
      <div class="stat-value" style="font-size:${String(s.value).length > 6 ? '21px' : '27px'}">${s.value}</div><div class="stat-label">${s.label}</div>
      <div class="stat-bar"><div class="stat-bar-fill" data-w="${s.bar}"></div></div>
    </div>`
  ).join("");

  const rows = pipeline.map(p =>
    `<tr onclick="go404()">
      <td><div class="t-name">${p.prospect}</div><div class="t-sub">Owner: ${p.owner}</div></td>
      <td><span class="status-badge ${pipelineStageColor[p.stage]}">${p.stage}</span></td>
      <td class="budget-col">${fmt(p.value)}</td>
      <td class="date-col">Est. close ${p.closeDate}</td>
    </tr>`
  ).join("");

  return `
    <section class="stats-grid">${statsHtml}</section>
    <div class="card" data-aos="fade-up" data-aos-delay="100">
      <div class="card-header"><div><h2 class="card-title">Pipeline</h2><p class="card-sub">Prospective accounts moving through the funnel</p></div></div>
      <div class="table-wrapper"><table class="runs-table"><thead><tr><th>Prospect</th><th>Stage</th><th>Est. Value</th><th>Close Date</th></tr></thead><tbody>${rows}</tbody></table></div>
    </div>
  `;
}

function renderSettings() {
  const s = state.settings;
  const displayName = currentUsername || currentEmail || "Signed out";
  const displayEmail = currentEmail || "No account signed in";
  return `
    <div class="card" data-aos="fade-up" data-aos-delay="100">
      <div class="card-header"><div><h2 class="card-title">Account</h2><p class="card-sub">Profile and session</p></div></div>
      <div style="display:flex;align-items:center;gap:18px;margin-bottom:20px;flex-wrap:wrap">
        <div style="width:64px;height:64px;border-radius:50%;border:1px solid var(--line-bright);background:linear-gradient(150deg, var(--orange), var(--orange-deep));color:#0A0712;display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:26px;text-transform:uppercase;flex-shrink:0">${currentInitial}</div>
        <div><div style="font-weight:600;color:var(--ink);font-size:16px;font-family:var(--font-display)">${displayName}</div>
        <div style="font-size:13px;color:var(--ink-soft);margin-top:2px">${displayEmail}</div>
        <div style="font-family:var(--font-body);font-size:11.5px;font-weight:600;color:var(--orange);margin-top:4px">Admin Console · Full Portfolio Access</div></div>
      </div>
      <button class="btn-outline" onclick="go404()">Edit Profile</button>
    </div>
    <div class="card" data-aos="fade-up" data-aos-delay="150">
      <div class="card-header"><div><h2 class="card-title">Preferences</h2><p class="card-sub">Notifications and display</p></div></div>
      <div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:18px 0;border-bottom:1px solid var(--line)">
          <div><div style="font-weight:600;color:var(--ink);font-size:13.5px">Push Notifications</div><div style="font-size:12.5px;color:var(--ink-soft);margin-top:2px">Account and billing alerts</div></div>
          <div class="toggle-switch" id="toggle-notifications" data-toggle="notifications" style="background:${s.notifications ? '#F15A29' : 'rgba(241,90,41,0.16)'}">
            <div class="toggle-knob" id="toggle-knob-notifications" style="left:${s.notifications ? '20px' : '3px'}"></div>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:18px 0;border-bottom:1px solid var(--line)">
          <div><div style="font-weight:600;color:var(--ink);font-size:13.5px">Weekly Digest</div><div style="font-size:12.5px;color:var(--ink-soft);margin-top:2px">Portfolio summary every Monday</div></div>
          <div class="toggle-switch" id="toggle-emailDigest" data-toggle="emailDigest" style="background:${s.emailDigest ? '#F15A29' : 'rgba(241,90,41,0.16)'}">
            <div class="toggle-knob" id="toggle-knob-emailDigest" style="left:${s.emailDigest ? '20px' : '3px'}"></div>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:18px 0;border-bottom:1px solid var(--line)">
          <div><div style="font-weight:600;color:var(--ink);font-size:13.5px">Dark Mode</div><div style="font-size:12.5px;color:var(--ink-soft);margin-top:2px">Dark theme</div></div>
          <div class="toggle-switch" id="toggle-darkMode" data-toggle="darkMode" style="background:${s.darkMode ? '#F15A29' : 'rgba(241,90,41,0.16)'}">
            <div class="toggle-knob" id="toggle-knob-darkMode" style="left:${s.darkMode ? '20px' : '3px'}"></div>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding-top:18px">
          <div><div style="font-weight:600;color:var(--ink);font-size:13.5px">Language</div><div style="font-size:12.5px;color:var(--ink-soft);margin-top:2px">Interface language</div></div>
          <select class="pref-select" id="lang-select">${["English", "Hindi", "Tamil", "French", "Spanish"].map(l => `<option ${s.language === l ? "selected" : ""}>${l}</option>`).join("")}</select>
        </div>
      </div>
    </div>
    <div class="card" data-aos="fade-up" data-aos-delay="200">
      <div class="card-header"><div><h2 class="card-title">Session</h2><p class="card-sub">Sign out</p></div></div>
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:14px">
        <div style="font-size:12.5px;color:var(--ink-soft)">Signed in as <strong style="color:var(--ink)">${displayEmail}</strong>.</div>
        <button class="btn-outline" style="border-color:rgba(228,72,58,0.35);color:var(--danger);flex-shrink:0" id="settings-logout-btn"><i class="fa-solid fa-right-from-bracket"></i>&nbsp; Logout</button>
      </div>
    </div>
  `;
}

const pageRenderers = {
  overview: renderOverview,
  clients: renderClients,
  engagements: renderEngagements,
  consultants: renderConsultants,
  billing: renderBilling,
  pipeline: renderPipeline,
  settings: renderSettings
};

// ─── NAVIGATION ───
function renderNav() {
  const mainItems = navItemsList.slice(0, 3);
  const mgmtItems = navItemsList.slice(3);
  function itemHtml(item) {
    const badge = item.id === "billing" ? `<span class="nav-badge">${invoicesAll.filter(i => i.status === "Overdue").length}</span>` : "";
    return `<button class="nav-item ${state.activeNav === item.id ? "nav-active" : ""}" data-nav="${item.id}">
      <i class="fa-solid ${item.icon} nav-icon"></i><span>${item.label}</span>${badge}</button>`;
  }
  document.getElementById("nav-main").innerHTML = mainItems.map(itemHtml).join("");
  document.getElementById("nav-management").innerHTML = mgmtItems.map(itemHtml).join("");
}

function renderPage() {
  const page = pageMap[state.activeNav];
  document.getElementById("page-title-text").textContent = page.title;
  document.getElementById("content-area").innerHTML = pageRenderers[state.activeNav]();
  renderNav();
  const settingsLogoutBtn = document.getElementById("settings-logout-btn");
  if (settingsLogoutBtn) settingsLogoutBtn.addEventListener("click", logout);
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  animateStatBars();
  initAOS();
}

function navigateTo(id) {
  state.activeNav = id;
  localStorage.setItem('adminActiveNav', id);
  closeSidebar();
  closeTopbarUserMenu();
  renderPage();
}

function openSidebar() {
  document.getElementById("sidebar").classList.add("sidebar-open");
  document.getElementById("sidebar-overlay").classList.add("show");
}
function closeSidebar() {
  document.getElementById("sidebar").classList.remove("sidebar-open");
  document.getElementById("sidebar-overlay").classList.remove("show");
}
function closeTopbarUserMenu() {
  document.getElementById("topbar-user").classList.remove("open");
}

// ─── SETTINGS TOGGLES ───
function toggleSetting(key) {
  state.settings[key] = !state.settings[key];
  const track = document.getElementById(`toggle-${key}`);
  const knob = document.getElementById(`toggle-knob-${key}`);
  if (!track || !knob) return;
  const isOn = state.settings[key];
  track.style.background = isOn ? '#F15A29' : 'rgba(241,90,41,0.16)';
  knob.style.left = isOn ? '20px' : '3px';
}

// ─── EVENT BINDING ───
document.getElementById("hamburger-btn").addEventListener("click", openSidebar);
document.getElementById("close-sidebar-btn").addEventListener("click", closeSidebar);
document.getElementById("sidebar-overlay").addEventListener("click", closeSidebar);
document.getElementById("notif-btn").addEventListener("click", go404);
document.getElementById("logout-btn").addEventListener("click", logout);
document.getElementById("topbar-logout-btn").addEventListener("click", logout);
document.getElementById("topbar-user-btn").addEventListener("click", function(e) {
  e.stopPropagation();
  document.getElementById("topbar-user").classList.toggle("open");
});
document.addEventListener("click", closeTopbarUserMenu);

document.addEventListener("click", function(e) {
  const navBtn = e.target.closest("[data-nav]");
  if (navBtn) { navigateTo(navBtn.getAttribute("data-nav")); return; }
  const toggle = e.target.closest("[data-toggle]");
  if (toggle) {
    toggleSetting(toggle.getAttribute("data-toggle"));
    return;
  }
});

document.addEventListener("change", function(e) {
  if (e.target && e.target.id === "lang-select") {
    state.settings.language = e.target.value;
    go404();
  }
});

// ─── INIT ───
paintUserChrome();
renderPage();