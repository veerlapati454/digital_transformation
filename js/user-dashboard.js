// ─── USER SESSION ───
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
  localStorage.removeItem('clientActiveNav');
  window.location.href = 'login.html';
}

// ─── CLIENT DATA (this client's own engagements, deliverables, invoices and consultants) ───
const engagementTypeAccents = {
  "governance": "#1F9184",
  "cloud": "#F15A29",
  "automation": "#E0518F",
  "analytics": "#7C4DDB",
  "security": "#8E93A6"
};
const engagementTypeName = { governance: "Data Governance", cloud: "Cloud Migration", automation: "Process Automation", analytics: "Analytics & BI", security: "Security & Compliance" };

const engagements = [
  { type: "governance", title: "Data Governance Overhaul — Phase 2", consultant: "Ananya Rao", started: "Feb 2026", status: "Active", progress: 62, nextMilestone: "Policy sign-off review", nextDate: "Sep 5, 2026" },
  { type: "cloud", title: "Cloud Migration — AWS Landing Zone", consultant: "Rohan Mehta", started: "Jul 2026", status: "Kickoff Pending", progress: 10, nextMilestone: "Kickoff call with cloud lead", nextDate: "Sep 8, 2026" },
  { type: "automation", title: "CRM & Sales Ops Automation", consultant: "Nisha Kapoor", started: "May 2026", status: "Active", progress: 78, nextMilestone: "UAT walkthrough", nextDate: "Sep 12, 2026" },
  { type: "analytics", title: "Executive Analytics Dashboard Build", consultant: "Arjun Verma", started: "Jun 2026", status: "Paused", progress: 34, nextMilestone: "Awaiting data access renewal", nextDate: "TBD" },
  { type: "security", title: "Security & Compliance Baseline", consultant: "Divya Nair", started: "Jan 2026", status: "Completed", progress: 100, nextMilestone: "Engagement complete", nextDate: "Aug 15, 2026" }
];

const deliverables = [
  { title: "Data flow audit — client sign-off", track: engagementTypeName.governance, type: "Audit", status: "Needs Review", urgency: "High", updated: "4h ago" },
  { title: "Migration runbook — draft for review", track: engagementTypeName.cloud, type: "Runbook", status: "In Progress", urgency: "High", updated: "1d ago" },
  { title: "Automation scope proposal", track: engagementTypeName.automation, type: "Proposal", status: "In Progress", urgency: "Medium", updated: "2d ago" },
  { title: "Dashboard wireframes — v2", track: engagementTypeName.analytics, type: "Design Review", status: "Approved", urgency: "Low", updated: "3d ago" },
  { title: "Compliance baseline report", track: engagementTypeName.security, type: "Report", status: "Delivered", urgency: "Low", updated: "5d ago" },
  { title: "Peer QA — Sprint 4 automation build", track: engagementTypeName.governance, type: "QA Review", status: "Needs Review", urgency: "Medium", updated: "6d ago" }
];

const reports = [
  { track: "Security & Compliance Baseline", status: "Delivered", date: "Delivered Aug 15, 2026" },
  { track: "CRM & Sales Ops Automation", status: "In Progress", date: "Est. Sep 2026" },
  { track: "Data Governance Overhaul — Phase 2", status: "In Progress", date: "Est. Dec 2026" },
  { track: "Cloud Migration — AWS Landing Zone", status: "Locked", date: "Unlocks after kickoff" },
  { track: "Executive Analytics Dashboard Build", status: "Paused", date: "Resumes after data access renewal" }
];

const engagementInvoices = [
  { site: engagementTypeName.governance, facility: "governance", invoiceNo: "INV-2026-0847", amount: 180000, dueDate: "Sep 1, 2026", status: "Due" },
  { site: engagementTypeName.cloud, facility: "cloud", invoiceNo: "INV-2026-0839", amount: 42000, dueDate: "Aug 20, 2026", status: "Overdue" },
  { site: engagementTypeName.automation, facility: "automation", invoiceNo: "INV-2026-0851", amount: 66000, dueDate: "Sep 10, 2026", status: "Due" },
  { site: engagementTypeName.analytics, facility: "analytics", invoiceNo: "INV-2026-0812", amount: 91000, dueDate: "Jul 30, 2026", status: "Paid" },
  { site: engagementTypeName.security, facility: "security", invoiceNo: "INV-2026-0798", amount: 58500, dueDate: "Jul 15, 2026", status: "Paid" }
];

const scheduleEvents = [
  { date: "Sep 1", event: "Invoice INV-2026-0847 due", site: engagementTypeName.governance, type: "normal" },
  { date: "Sep 5", event: "Policy sign-off review", site: engagementTypeName.governance, type: "urgent" },
  { date: "Sep 8", event: "Kickoff call — Cloud Migration", site: "Virtual", type: "meeting" },
  { date: "Sep 10", event: "Invoice INV-2026-0851 due", site: engagementTypeName.automation, type: "normal" },
  { date: "Sep 12", event: "UAT walkthrough", site: engagementTypeName.automation, type: "meeting" },
  { date: "Sep 22", event: "Cloud landing zone go-live rehearsal", site: engagementTypeName.cloud, type: "urgent" }
];

const liveFeed = [
  { icon: "fa-file-signature", text: "Data flow audit is ready for your sign-off", time: "4h ago" },
  { icon: "fa-comment-dots", text: "Ananya Rao left feedback on the governance charter draft", time: "1d ago" },
  { icon: "fa-file-invoice-dollar", text: "Invoice INV-2026-0839 is now overdue — please review", time: "1d ago" },
  { icon: "fa-circle-check", text: "Dashboard wireframes v2 were approved", time: "3d ago" },
  { icon: "fa-shield-halved", text: "Compliance baseline report was delivered", time: "5d ago" },
  { icon: "fa-comments", text: "New message from Rohan Mehta on Cloud Migration", time: "6d ago" }
];

const navItemsList = [
  { icon: "fa-gauge-high", label: "Dashboard", id: "dashboard" },
  { icon: "fa-diagram-project", label: "My Engagements", id: "engagements" },
  { icon: "fa-file-signature", label: "Deliverables", id: "deliverables" },
  { icon: "fa-shield-halved", label: "Reports", id: "reports" },
  { icon: "fa-user-group", label: "Consulting Team", id: "team" },
  { icon: "fa-file-invoice-dollar", label: "Billing & Invoices", id: "billing" },
  { icon: "fa-gear", label: "Settings", id: "settings" }
];

const engagementStatusColor = { "Active": "status-active", "Kickoff Pending": "status-gold", "Paused": "status-review", "Completed": "status-complete" };
const deliverableStatusColor = { "Needs Review": "status-gold", "In Progress": "status-field", "Approved": "status-active", "Delivered": "status-complete" };
const reportStatusColor = { "Delivered": "status-active", "In Progress": "status-field", "Locked": "status-complete", "Paused": "status-review" };
const urgencyColor = { "High": "var(--danger)", "Medium": "var(--orange)", "Low": "var(--ink-faint)" };
const urgencyBg = { "High": "rgba(228,72,58,0.14)", "Medium": "rgba(241,90,41,0.16)", "Low": "rgba(142,147,166,0.18)" };
const invoiceColor = { "Paid": "#1F9184", "Due": "#F15A29", "Overdue": "#E4483A" };
const scheduleTypeColor = { urgent: "#E4483A", normal: "#8E93A6", meeting: "#2EC4B6" };

const pageMap = {
  dashboard:    { title: "Dashboard", sub: "An overview of your engagements, deliverables and account" },
  engagements:  { title: "My Engagements", sub: "Every project and workstream in your transformation program" },
  deliverables: { title: "Deliverables", sub: "Drafts, sign-offs and reviews awaiting your action" },
  reports:      { title: "Reports", sub: "Audits and reports issued across your engagements" },
  team:         { title: "Consulting Team", sub: "Updates and messages from your consultants" },
  billing:      { title: "Billing & Invoices", sub: "Invoices, payment status and balances by engagement" },
  settings:     { title: "Settings", sub: "Account and preferences" }
};

let state = {
  activeNav: (function () {
    const saved = localStorage.getItem('clientActiveNav');
    return saved && pageMap[saved] ? saved : "dashboard";
  })(),
  settings: { notifications: true, emailDigest: false, darkMode: false, language: "English" }
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

// ─── RENDER FUNCTIONS ───
function renderDashboard() {
  const activeEngagements = engagements.filter(m => m.status !== "Completed").length;
  const needsReview = deliverables.filter(d => d.status === "Needs Review").length;
  const outstandingBalance = engagementInvoices.filter(i => i.status !== "Paid").reduce((a, i) => a + i.amount, 0);
  const nextEvent = scheduleEvents[0];

  const stats = [
    { icon: "fa-diagram-project", delta: engagements.length + " total", value: String(activeEngagements), label: "Active Engagements", bar: Math.round((activeEngagements / engagements.length) * 100), accent: true },
    { icon: "fa-file-signature", delta: "Needs your action", value: String(needsReview), label: "Deliverables Due", bar: 70, warn: needsReview > 0 },
    { icon: "fa-file-invoice-dollar", delta: engagementInvoices.filter(i => i.status === "Overdue").length + " overdue", value: fmt(outstandingBalance), label: "Outstanding Balance", bar: 55, warn: engagementInvoices.some(i => i.status === "Overdue") },
    { icon: "fa-calendar-days", delta: nextEvent.date, value: nextEvent.event.length > 22 ? nextEvent.event.slice(0, 20) + "…" : nextEvent.event, label: "Next Deadline", bar: 40 }
  ];

  const statsHtml = stats.map((s, i) =>
    `<div class="stat-card ${s.accent ? "stat-accent" : ""}" data-aos="fade-up" data-aos-delay="${i * 60}" onclick="go404()">
      <div class="stat-top"><i class="fa-solid ${s.icon} stat-icon"></i><span class="stat-delta ${s.warn ? "warn" : "up"}">${s.delta}</span></div>
      <div class="stat-value" style="font-size:${s.label === 'Next Deadline' ? '19px' : '28px'}">${s.value}</div><div class="stat-label">${s.label}</div>
      <div class="stat-bar"><div class="stat-bar-fill" data-w="${s.bar}"></div></div>
    </div>`
  ).join("");

  const rows = engagements.map(m => {
    return `<tr onclick="go404()">
      <td><div class="t-name">${m.title}</div><div class="t-sub">Consultant: ${m.consultant}</div></td>
      <td>${regionTag(m.type, engagementTypeName)}</td>
      <td><span class="status-badge ${engagementStatusColor[m.status]}">${m.status}</span></td>
      <td><div class="progress-wrap"><div class="progress-bar"><div class="progress-fill" data-w="${m.progress}"></div></div><span class="progress-pct">${m.progress}%</span></div></td>
      <td class="date-col">${m.nextMilestone}</td>
      <td class="date-col">${m.nextDate}</td>
    </tr>`;
  }).join("");

  const feedHtml = liveFeed.map(a =>
    `<li class="activity-item" onclick="go404()">
      <i class="fa-solid ${a.icon} act-icon"></i>
      <div class="act-body"><p class="act-text">${a.text}</p><span class="act-time">${a.time}</span></div>
    </li>`
  ).join("");

  const actionItems = deliverables.filter(d => d.status === "Needs Review" || d.status === "In Progress").slice(0, 5).map(d =>
    `<li class="team-item" onclick="go404()">
      <div class="member-avatar" style="background:${urgencyBg[d.urgency]};color:${urgencyColor[d.urgency]}">${d.type.charAt(0)}</div>
      <div class="member-info"><div class="member-name">${d.title}</div><div class="member-role">${d.track} · ${d.status}</div></div>
      <div class="member-projects"><span class="proj-count" style="font-size:13px;color:${urgencyColor[d.urgency]}">${d.updated}</span><span class="proj-label">${d.urgency}</span></div>
    </li>`
  ).join("");

  const upcomingMs = scheduleEvents.slice(0, 5).map(ev => {
    const c2 = scheduleTypeColor[ev.type];
    const parts = ev.date.split(" ");
    return `<li class="milestone-item" onclick="go404()">
      <div class="ms-date"><span>${parts[0]}</span><span style="font-size:18px;font-family:var(--font-display)">${parts[1]}</span></div>
      <div class="ms-line"><div class="ms-dot" style="background:${c2}"></div></div>
      <div class="ms-body"><div class="ms-event">${ev.event}</div><div class="ms-project">${ev.site}</div></div>
      <span class="ms-tag" style="background:${c2}1F;color:${c2}">${ev.type}</span>
    </li>`;
  }).join("");

  const totalInvoiced = engagementInvoices.reduce((a, i) => a + i.amount, 0);
  const legend = engagementInvoices.map(i => ({ color: invoiceColor[i.status], label: i.invoiceNo, count: Math.round((i.amount / totalInvoiced) * 100) }));
  const legendHtml = legend.map(l =>
    `<li class="legend-item" onclick="go404()">
      <span class="legend-dot" style="background:${l.color}"></span>
      <span class="legend-label">${l.label}</span>
      <span class="legend-count">${l.count}%</span>
    </li>`
  ).join("");

  return `
    <div class="hero-banner" data-aos="fade">
      <div class="hero-banner-inner">
        <div class="hero-eyebrow">Client Portal</div>
        <h2>Your transformation, one line of sight</h2>
        <p>Track engagement progress, review and sign off on deliverables, message your consultants, and stay on top of invoices — all in one workspace shared with your account team.</p>
      </div>
    </div>
    <section class="stats-grid" data-aos="fade-up" data-aos-delay="0">${statsHtml}</section>
    <section class="mid-grid">
      <div class="card" data-aos="fade-up" data-aos-delay="100">
        <div class="card-header"><div><h2 class="card-title">Engagement Snapshot</h2><p class="card-sub">Progress and next steps, at a glance</p></div></div>
        <div class="table-wrapper"><table class="runs-table"><thead><tr><th>Engagement</th><th>Type</th><th>Status</th><th>Progress</th><th>Next Milestone</th><th>Date</th></tr></thead><tbody>${rows}</tbody></table></div>
      </div>
      <div class="card" data-aos="fade-up" data-aos-delay="150">
        <div class="card-header"><div><h2 class="card-title">Recent Updates</h2><p class="card-sub">From your consultants</p></div></div>
        <ul class="activity-list">${feedHtml}</ul>
      </div>
    </section>
    <section class="bottom-grid">
      <div class="card" data-aos="fade-up" data-aos-delay="200">
        <div class="card-header"><div><h2 class="card-title">Needs Your Action</h2><p class="card-sub">Deliverables to review or approve</p></div></div>
        <ul class="team-list">${actionItems}</ul>
      </div>
      <div class="card" data-aos="fade-up" data-aos-delay="250">
        <div class="card-header"><div><h2 class="card-title">Upcoming Dates</h2><p class="card-sub">Deadlines & sessions</p></div></div>
        <ul class="milestone-list">${upcomingMs}</ul>
      </div>
      <div class="card" data-aos="fade-up" data-aos-delay="300">
        <div class="card-header"><div><h2 class="card-title">Billing Mix</h2><p class="card-sub">Share of total invoiced</p></div></div>
        <div class="donut-chart" onclick="go404()">
          <svg viewBox="0 0 120 120" class="donut-svg">
            <circle cx="60" cy="60" r="48" fill="none" stroke="#241D3B" stroke-width="16"/>
            <circle cx="60" cy="60" r="48" fill="none" stroke="#7C4DDB" stroke-width="16" stroke-dasharray="87 212" stroke-dashoffset="0" stroke-linecap="round" transform="rotate(-90 60 60)"/>
            <circle cx="60" cy="60" r="48" fill="none" stroke="#F15A29" stroke-width="16" stroke-dasharray="20 212" stroke-dashoffset="-87" stroke-linecap="round" transform="rotate(-90 60 60)"/>
            <circle cx="60" cy="60" r="48" fill="none" stroke="#D6431A" stroke-width="16" stroke-dasharray="32 212" stroke-dashoffset="-107" stroke-linecap="round" transform="rotate(-90 60 60)"/>
            <circle cx="60" cy="60" r="48" fill="none" stroke="#2EC4B6" stroke-width="16" stroke-dasharray="45 212" stroke-dashoffset="-139" stroke-linecap="round" transform="rotate(-90 60 60)"/>
            <circle cx="60" cy="60" r="48" fill="none" stroke="#8E93A6" stroke-width="16" stroke-dasharray="28 212" stroke-dashoffset="-184" stroke-linecap="round" transform="rotate(-90 60 60)"/>
            <text x="60" y="56" text-anchor="middle" class="donut-num">${engagementInvoices.length}</text>
            <text x="60" y="68" text-anchor="middle" class="donut-label">Invoices</text>
          </svg>
        </div>
        <ul class="legend-list">${legendHtml}</ul>
      </div>
    </section>
  `;
}

function renderEngagements() {
  const stats = [
    { icon: "fa-diagram-project", value: engagements.length, label: "Total Engagements", bar: 100, accent: true },
    { icon: "fa-circle-check", value: engagements.filter(m => m.status === "Active").length, label: "Active", bar: 70 },
    { icon: "fa-hourglass-half", value: engagements.filter(m => m.status === "Kickoff Pending").length, label: "Pending Kickoff", bar: 40 },
    { icon: "fa-check", value: engagements.filter(m => m.status === "Completed").length, label: "Completed", bar: 20 }
  ];
  const statsHtml = stats.map((s, i) =>
    `<div class="stat-card ${s.accent ? "stat-accent" : ""}" data-aos="fade-up" data-aos-delay="${i * 60}" onclick="go404()">
      <div class="stat-top"><i class="fa-solid ${s.icon} stat-icon"></i></div>
      <div class="stat-value">${s.value}</div><div class="stat-label">${s.label}</div>
      <div class="stat-bar"><div class="stat-bar-fill" data-w="${s.bar}"></div></div>
    </div>`
  ).join("");

  const rows = engagements.map(m => {
    return `<tr onclick="go404()">
      <td><div class="t-name">${m.title}</div><div class="t-sub">Started ${m.started}</div></td>
      <td>${regionTag(m.type, engagementTypeName)}</td>
      <td class="type-col">${m.consultant}</td>
      <td><span class="status-badge ${engagementStatusColor[m.status]}">${m.status}</span></td>
      <td><div class="progress-wrap"><div class="progress-bar"><div class="progress-fill" data-w="${m.progress}"></div></div><span class="progress-pct">${m.progress}%</span></div></td>
      <td class="date-col">${m.nextMilestone} — ${m.nextDate}</td>
    </tr>`;
  }).join("");

  return `
    <section class="stats-grid">${statsHtml}</section>
    <div class="card" data-aos="fade-up" data-aos-delay="100">
      <div class="card-header"><div><h2 class="card-title">My Engagements</h2><p class="card-sub">Every project and workstream in your transformation program</p></div></div>
      <div class="table-wrapper"><table class="runs-table"><thead><tr><th>Engagement</th><th>Type</th><th>Consultant</th><th>Status</th><th>Progress</th><th>Next Step</th></tr></thead><tbody>${rows}</tbody></table></div>
    </div>
  `;
}

function renderDeliverables() {
  const stats = [
    { icon: "fa-file-signature", value: deliverables.length, label: "Total Deliverables", bar: 100, accent: true },
    { icon: "fa-hourglass-half", value: deliverables.filter(d => d.status === "Needs Review").length, label: "Needs Review", bar: 60, warn: true },
    { icon: "fa-eye", value: deliverables.filter(d => d.status === "In Progress").length, label: "In Progress", bar: 45 },
    { icon: "fa-circle-check", value: deliverables.filter(d => d.status === "Approved" || d.status === "Delivered").length, label: "Completed", bar: 30 }
  ];
  const statsHtml = stats.map((s, i) =>
    `<div class="stat-card ${s.accent ? "stat-accent" : ""}" data-aos="fade-up" data-aos-delay="${i * 60}" onclick="go404()">
      <div class="stat-top"><i class="fa-solid ${s.icon} stat-icon"></i></div>
      <div class="stat-value">${s.value}</div><div class="stat-label">${s.label}</div>
      <div class="stat-bar"><div class="stat-bar-fill" data-w="${s.bar}"></div></div>
    </div>`
  ).join("");

  const cards = deliverables.map((d, i) =>
    `<div class="research-card" data-aos="fade-up" data-aos-delay="${i * 40}">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap">
        <div style="flex:1;min-width:220px">
          <div style="font-weight:700;color:var(--ink);font-size:14.5px;font-family:var(--font-display);margin-bottom:4px">${d.title}</div>
          <div style="font-size:12.5px;color:var(--ink-soft);margin-bottom:6px">${d.type} · ${d.track}</div>
          <div style="font-size:12px;color:var(--ink-faintest);font-family:var(--font-mono)">Updated ${d.updated}</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;flex-shrink:0">
          <span class="status-badge ${deliverableStatusColor[d.status]}">${d.status}</span>
        </div>
      </div>
      <div style="display:flex;gap:10px;margin-top:14px">
        ${d.status === "Needs Review" ? `<button class="btn-solid" onclick="go404()">Review & Sign Off</button>` : `<button class="btn-outline" onclick="go404()">View Feedback</button>`}
        <button class="btn-outline" onclick="go404()">Download</button>
      </div>
    </div>`
  ).join("");

  return `
    <section class="stats-grid">${statsHtml}</section>
    <div class="card" data-aos="fade-up" data-aos-delay="100">
      <div class="card-header"><div><h2 class="card-title">Deliverables</h2><p class="card-sub">Drafts, sign-offs and reviews awaiting your action</p></div></div>
      <div style="display:flex;flex-direction:column;gap:14px">${cards}</div></div>
  `;
}

function renderReports() {
  const stats = [
    { icon: "fa-shield-halved", value: reports.length, label: "Total Reports", bar: 100, accent: true },
    { icon: "fa-circle-check", value: reports.filter(c => c.status === "Delivered").length, label: "Delivered", bar: 60 },
    { icon: "fa-hourglass-half", value: reports.filter(c => c.status === "In Progress").length, label: "In Progress", bar: 45 },
    { icon: "fa-lock", value: reports.filter(c => c.status === "Locked" || c.status === "Paused").length, label: "Not Yet Available", bar: 20 }
  ];
  const statsHtml = stats.map((s, i) =>
    `<div class="stat-card ${s.accent ? "stat-accent" : ""}" data-aos="fade-up" data-aos-delay="${i * 60}" onclick="go404()">
      <div class="stat-top"><i class="fa-solid ${s.icon} stat-icon"></i></div>
      <div class="stat-value">${s.value}</div><div class="stat-label">${s.label}</div>
      <div class="stat-bar"><div class="stat-bar-fill" data-w="${s.bar}"></div></div>
    </div>`
  ).join("");

  const cards = reports.map((c, i) =>
    `<div class="research-card" data-aos="fade-up" data-aos-delay="${i * 40}">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap">
        <div style="flex:1;min-width:220px">
          <div style="font-weight:700;color:var(--ink);font-size:14.5px;font-family:var(--font-display);margin-bottom:4px">${c.track}</div>
          <div style="font-size:12.5px;color:var(--ink-faintest);font-family:var(--font-mono)">${c.date}</div>
        </div>
        <span class="status-badge ${reportStatusColor[c.status]}">${c.status}</span>
      </div>
      <div style="display:flex;gap:10px;margin-top:14px">
        ${c.status === "Delivered" ? `<button class="btn-solid" onclick="go404()">Download Report</button>` : `<button class="btn-outline" onclick="go404()">View Requirements</button>`}
      </div>
    </div>`
  ).join("");

  return `
    <section class="stats-grid">${statsHtml}</section>
    <div class="card" data-aos="fade-up" data-aos-delay="100">
      <div class="card-header"><div><h2 class="card-title">Reports</h2><p class="card-sub">Audits and reports issued across your engagements</p></div></div>
      <div style="display:flex;flex-direction:column;gap:14px">${cards}</div></div>
  `;
}

function renderTeam() {
  const stats = [
    { icon: "fa-comments", value: liveFeed.length, label: "Recent Updates", bar: 100, accent: true },
    { icon: "fa-file-signature", value: deliverables.filter(d => d.status === "Needs Review").length, label: "Awaiting Your Action", bar: 60, warn: true },
    { icon: "fa-user-group", value: [...new Set(engagements.map(m => m.consultant))].length, label: "Consultants on Your Team", bar: 50 },
    { icon: "fa-diagram-project", value: engagements.filter(m => m.status !== "Completed").length, label: "Open Engagements", bar: 40 }
  ];
  const statsHtml = stats.map((s, i) =>
    `<div class="stat-card ${s.accent ? "stat-accent" : ""}" data-aos="fade-up" data-aos-delay="${i * 60}" onclick="go404()">
      <div class="stat-top"><i class="fa-solid ${s.icon} stat-icon"></i></div>
      <div class="stat-value">${s.value}</div><div class="stat-label">${s.label}</div>
      <div class="stat-bar"><div class="stat-bar-fill" data-w="${s.bar}"></div></div>
    </div>`
  ).join("");

  const feedHtml = liveFeed.map(a =>
    `<li class="activity-item" onclick="go404()">
      <i class="fa-solid ${a.icon} act-icon"></i>
      <div class="act-body"><p class="act-text">${a.text}</p><span class="act-time">${a.time}</span></div>
    </li>`
  ).join("");

  const teamHtml = [...new Map(engagements.map(m => [m.consultant, m])).values()].map(m =>
    `<li class="team-item" onclick="go404()">
      <div class="member-avatar">${m.consultant.split(" ").map(p => p.charAt(0)).join("")}
        <span class="online-dot dot-active"></span>
      </div>
      <div class="member-info"><div class="member-name">${m.consultant}</div><div class="member-role">Leading: ${m.title}</div></div>
      <button class="btn-outline" onclick="event.stopPropagation();go404()">Message</button>
    </li>`
  ).join("");

  return `
    <section class="stats-grid">${statsHtml}</section>
    <section class="mid-grid">
      <div class="card" data-aos="fade-up" data-aos-delay="100">
        <div class="card-header"><div><h2 class="card-title">Recent Updates</h2><p class="card-sub">From your consultants</p></div></div>
        <ul class="activity-list">${feedHtml}</ul>
      </div>
      <div class="card" data-aos="fade-up" data-aos-delay="150">
        <div class="card-header"><div><h2 class="card-title">Your Consultants</h2><p class="card-sub">Practitioners working on your engagements</p></div></div>
        <ul class="team-list">${teamHtml}</ul>
      </div>
    </section>
    <div class="card" data-aos="fade-up" data-aos-delay="200">
      <div class="card-header"><div><h2 class="card-title">Send a Message</h2><p class="card-sub">Reach your consulting team directly</p></div></div>
      <div style="display:flex;gap:12px;flex-wrap:wrap">
        <button class="btn-solid" onclick="go404()">New Message</button>
        <button class="btn-outline" onclick="go404()">Book Office Hours</button>
      </div>
    </div>
  `;
}

function renderBilling() {
  const totalOutstanding = engagementInvoices.filter(i => i.status !== "Paid").reduce((a, i) => a + i.amount, 0);
  const totalPaid = engagementInvoices.filter(i => i.status === "Paid").reduce((a, i) => a + i.amount, 0);
  const overdueCount = engagementInvoices.filter(i => i.status === "Overdue").length;
  const totalInvoiced = engagementInvoices.reduce((a, i) => a + i.amount, 0);
  const stats = [
    { icon: "fa-file-invoice-dollar", value: fmt(totalInvoiced), label: "Total Invoiced", bar: 100, accent: true },
    { icon: "fa-circle-check", value: fmt(totalPaid), label: "Paid to Date", bar: Math.round((totalPaid / totalInvoiced) * 100) },
    { icon: "fa-clock", value: fmt(totalOutstanding), label: "Outstanding Balance", bar: Math.round((totalOutstanding / totalInvoiced) * 100), warn: totalOutstanding > 0 },
    { icon: "fa-triangle-exclamation", value: overdueCount, label: "Overdue Invoices", bar: overdueCount > 0 ? 80 : 10, warn: overdueCount > 0 }
  ];
  const statsHtml = stats.map((s, i) =>
    `<div class="stat-card ${s.accent ? "stat-accent" : ""}" data-aos="fade-up" data-aos-delay="${i * 60}" onclick="go404()">
      <div class="stat-top"><i class="fa-solid ${s.icon} stat-icon"></i></div>
      <div class="stat-value" style="font-size:${s.label === 'Overdue Invoices' ? '28px' : '22px'}">${s.value}</div><div class="stat-label">${s.label}</div>
      <div class="stat-bar"><div class="stat-bar-fill" data-w="${s.bar}"></div></div>
    </div>`
  ).join("");

  const rows = engagementInvoices.map(i => {
    const col = invoiceColor[i.status];
    return `<tr onclick="go404()">
      <td><div class="t-name">${i.invoiceNo}</div><div class="t-sub">${i.site}</div></td>
      <td>${regionTag(i.facility, engagementTypeName)}</td>
      <td class="budget-col">${fmt(i.amount)}</td>
      <td class="date-col">${i.dueDate}</td>
      <td><span class="status-badge" style="background:${col}1F;color:${col}">${i.status}</span></td>
    </tr>`;
  }).join("");

  return `
    <section class="stats-grid">${statsHtml}</section>
    <div class="card" data-aos="fade-up" data-aos-delay="100">
      <div class="card-header"><div><h2 class="card-title">Invoices</h2><p class="card-sub">Billing across all your engagements</p></div></div>
      <div class="table-wrapper"><table class="runs-table"><thead><tr><th>Invoice</th><th>Engagement Type</th><th>Amount</th><th>Due Date</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table></div>
    </div>
    <div class="card" data-aos="fade-up" data-aos-delay="150">
      <div class="card-header"><div><h2 class="card-title">Make a Payment</h2><p class="card-sub">Settle an outstanding balance</p></div></div>
      <div style="display:flex;gap:12px;flex-wrap:wrap">
        <button class="btn-solid" onclick="go404()">Pay Outstanding Balance</button>
        <button class="btn-outline" onclick="go404()">Download Statement</button>
      </div>
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
        <div style="width:64px;height:64px;border-radius:50%;border:2px solid rgba(241,90,41,0.4);background:var(--orange-soft);color:var(--orange);display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:26px;text-transform:uppercase;flex-shrink:0">${currentInitial}</div>
        <div><div style="font-weight:700;color:var(--ink);font-size:16px;text-transform:capitalize;font-family:var(--font-display)">${displayName}</div>
        <div style="font-size:13px;color:var(--ink-soft);margin-top:2px">${displayEmail}</div>
        <div style="font-family:var(--font-mono);font-size:11.5px;color:var(--orange);margin-top:4px">Client Portal · Engagement Access</div></div>
      </div>
      <button class="btn-outline" style="border-color:var(--orange);color:var(--orange)" onclick="go404()">Edit Profile</button>
    </div>
    <div class="card" data-aos="fade-up" data-aos-delay="150">
      <div class="card-header"><div><h2 class="card-title">Preferences</h2><p class="card-sub">Notifications and display</p></div></div>
      <div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:18px 0;border-bottom:1px solid var(--line)">
          <div><div style="font-weight:700;color:var(--ink);font-size:13.5px">Push Notifications</div><div style="font-size:12.5px;color:var(--ink-soft);margin-top:2px">Deliverable & invoice alerts</div></div>
          <div class="toggle-switch" id="toggle-notifications" data-toggle="notifications" style="background:${s.notifications ? '#F15A29' : 'rgba(241,90,41,0.16)'}">
            <div class="toggle-knob" id="toggle-knob-notifications" style="left:${s.notifications ? '20px' : '3px'}"></div>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:18px 0;border-bottom:1px solid var(--line)">
          <div><div style="font-weight:700;color:var(--ink);font-size:13.5px">Weekly Digest</div><div style="font-size:12.5px;color:var(--ink-soft);margin-top:2px">Engagement summary every Monday</div></div>
          <div class="toggle-switch" id="toggle-emailDigest" data-toggle="emailDigest" style="background:${s.emailDigest ? '#F15A29' : 'rgba(241,90,41,0.16)'}">
            <div class="toggle-knob" id="toggle-knob-emailDigest" style="left:${s.emailDigest ? '20px' : '3px'}"></div>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:18px 0;border-bottom:1px solid var(--line)">
          <div><div style="font-weight:700;color:var(--ink);font-size:13.5px">Dark Mode</div><div style="font-size:12.5px;color:var(--ink-soft);margin-top:2px">Dark theme</div></div>
          <div class="toggle-switch" id="toggle-darkMode" data-toggle="darkMode" style="background:${s.darkMode ? '#F15A29' : 'rgba(241,90,41,0.16)'}">
            <div class="toggle-knob" id="toggle-knob-darkMode" style="left:${s.darkMode ? '20px' : '3px'}"></div>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding-top:18px">
          <div><div style="font-weight:700;color:var(--ink);font-size:13.5px">Language</div><div style="font-size:12.5px;color:var(--ink-soft);margin-top:2px">Interface language</div></div>
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
    <div class="card" data-aos="fade-up" data-aos-delay="250" style="border-color:rgba(228,72,58,0.25);">
      <div class="card-header"><div><h2 class="card-title">Account Controls</h2><p class="card-sub">Irreversible actions</p></div></div>
      <div style="display:flex;gap:12px;flex-wrap:wrap">
        <button class="btn-outline" style="border-color:rgba(228,72,58,0.35);color:var(--danger)" onclick="go404()">Reset Password</button>
        <button class="btn-outline" style="border-color:rgba(228,72,58,0.35);color:var(--danger)" onclick="go404()">Delete Account</button>
      </div>
    </div>
  `;
}

const pageRenderers = {
  dashboard: renderDashboard,
  engagements: renderEngagements,
  deliverables: renderDeliverables,
  reports: renderReports,
  team: renderTeam,
  billing: renderBilling,
  settings: renderSettings
};

// ─── NAVIGATION ───
function renderNav() {
  const mainItems = navItemsList.slice(0, 3);
  const mgmtItems = navItemsList.slice(3);
  function itemHtml(item) {
    const badge = item.id === "deliverables" ? `<span class="nav-badge">${deliverables.filter(d => d.status === "Needs Review").length}</span>` : "";
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
  localStorage.setItem('clientActiveNav', id);
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

// ─── SETTINGS TOGGLES (update in place — no full re-render, no scroll reset) ───
function toggleSetting(key) {
  state.settings[key] = !state.settings[key];
  const track = document.getElementById(`toggle-${key}`);
  const knob = document.getElementById(`toggle-knob-${key}`);
  if (!track || !knob) return; // toggle isn't on screen (e.g. different page); nothing to update
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