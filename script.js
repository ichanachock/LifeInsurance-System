const STORAGE_KEY = "life-insurance-crm-v1";
const GOOGLE_SHEETS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyxdFNjTDCPNfbTAxd2cHKtaDLb9IUZdy5zzB_fksxHlR33dB0_smEp8yTuQ_nYMVrpJA/exec";

const statusMap = {
    prospect: { label: "ลูกค้าเป้าหมาย", color: "#64748b", bg: "#eef2f7" },
    contacted: { label: "ติดต่อแล้ว", color: "#9a6700", bg: "#fff4cf" },
    meeting: { label: "นัดพบ", color: "#075985", bg: "#e0f2fe" },
    proposal: { label: "เสนอแบบแล้ว", color: "#7c3aed", bg: "#f1e8ff" },
    closed: { label: "ปิดการขาย", color: "#0f7a55", bg: "#ddf7ec" },
    lost: { label: "ไม่สนใจ", color: "#b42318", bg: "#fff0ee" }
};

function uid() {
    if (window.crypto?.randomUUID) {
        return window.crypto.randomUUID();
    }

    return `lead-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const scripts = [
    {
        stage: "เปิดการสนทนา",
        title: "10 คำแรก สร้างความไว้วางใจ",
        content: "สวัสดีครับท่าน ผมโทรมาเพื่อแบ่งปันวิธีวางแผนคุ้มครองครอบครัวที่หลายท่านในพื้นที่ให้ความสนใจ ใช้เวลาสั้น ๆ ไม่ขายกดดันครับ",
        tips: ["เริ่มด้วยชื่อและที่มาชัดเจน", "ขออนุญาตใช้เวลาก่อนพูดรายละเอียด", "เน้นประโยชน์ต่อครอบครัว"]
    },
    {
        stage: "สำรวจความต้องการ",
        title: "ค้นหา Pain Point",
        content: "ถ้าวันหนึ่งรายได้หลักหายไปกะทันหัน ครอบครัวควรมีเงินสำรองดูแลบ้าน ค่าเรียนลูก และค่าใช้จ่ายจำเป็นประมาณกี่เดือนถึงจะสบายใจครับ",
        tips: ["ถามก่อนเสนอ", "ฟังมากกว่าพูด", "จดคำพูดสำคัญของลูกค้า"]
    },
    {
        stage: "นำเสนอสินค้า",
        title: "Super Life 99/20",
        content: "แผนนี้คุ้มครองยาวถึงอายุ 99 ปี จ่ายเบี้ย 20 ปี เหมาะกับคนที่อยากวางแผนระยะยาวให้ครอบครัว โดยเราจะดูงบที่ลูกค้าสบายใจก่อนเสมอครับ",
        tips: ["พูดด้วยภาษาง่าย", "ย้ำว่างบต้องไม่ตึง", "แยกความคุ้มครองกับเงินออมให้ชัด"]
    },
    {
        stage: "รับมือข้อโต้แย้ง",
        title: "เมื่อลูกค้ายังไม่พร้อม",
        content: "เข้าใจครับ การวางแผนแบบนี้ควรคิดให้รอบคอบ ผมขอช่วยเทียบให้เห็นก่อนว่า ถ้าเริ่มตอนนี้กับรอไปอีก 1 ปี ต่างกันอย่างไร แล้วค่อยตัดสินใจก็ได้ครับ",
        tips: ["ยอมรับความรู้สึกลูกค้า", "ไม่เร่งปิด", "เสนอข้อมูลเพื่อช่วยตัดสินใจ"]
    },
    {
        stage: "ปิดการขาย",
        title: "Assumptive Close",
        content: "จากที่คุยกัน ถ้าเลือกแผนที่ดูแลครอบครัวได้และยังอยู่ในงบที่สบายใจ ระหว่างเบี้ยประมาณ 1,500 บาทกับ 2,500 บาทต่อเดือน แบบไหนเหมาะกับบ้านท่านมากกว่าครับ",
        tips: ["ให้เลือกจากทางเลือกที่เหมาะสม", "ย้ำเป้าหมายเดิม", "กำหนดขั้นตอนถัดไปให้ชัด"]
    }
];

const seedLeads = [
    {
        id: uid(),
        name: "นายสมชาย ใจดี",
        type: "กำนัน",
        village: "บ้านหนองแค",
        phone: "081-234-5678",
        status: "prospect",
        score: 85,
        product: "Super Life 99/20",
        lastContact: "2026-05-05",
        nextFollowUp: "2026-05-09",
        notes: "สนใจแผนคุ้มครองครอบครัว ต้องการดูตัวอย่างเบี้ยรายเดือน"
    },
    {
        id: uid(),
        name: "นายวิชัย แสนดี",
        type: "ผู้ใหญ่บ้าน",
        village: "บ้านท่าขอนยาง",
        phone: "082-345-6789",
        status: "meeting",
        score: 72,
        product: "Super Life 99/20",
        lastContact: "2026-05-06",
        nextFollowUp: "2026-05-08",
        notes: "นัดพบเพื่ออธิบายความคุ้มครองเพิ่มเติม"
    },
    {
        id: uid(),
        name: "นางสาวอรทัย สุขใจ",
        type: "ครู",
        village: "บ้านโนนสะอาด",
        phone: "083-456-7890",
        status: "proposal",
        score: 91,
        product: "Super Life 99/20",
        lastContact: "2026-05-07",
        nextFollowUp: "2026-05-10",
        notes: "ต้องการดูแลทุนการศึกษาบุตร 2 คน"
    },
    {
        id: uid(),
        name: "นายสุรศักดิ์ เพียรดี",
        type: "เจ้าของกิจการ",
        village: "บ้านสระแก้ว",
        phone: "084-567-8901",
        status: "closed",
        score: 95,
        product: "Super Life 99/20",
        lastContact: "2026-05-01",
        nextFollowUp: "",
        notes: "ปิดการขายสำเร็จ เบี้ย 25,000 บาทต่อปี"
    }
];

let state = loadState();
let selectedLeadId = state.leads[0]?.id || null;
let activeScriptIndex = 0;

const els = {
    viewTitle: document.getElementById("viewTitle"),
    navButtons: document.querySelectorAll(".nav-button"),
    views: document.querySelectorAll(".view"),
    statsGrid: document.getElementById("statsGrid"),
    priorityLeads: document.getElementById("priorityLeads"),
    todayTasks: document.getElementById("todayTasks"),
    leadList: document.getElementById("leadList"),
    leadDetail: document.getElementById("leadDetail"),
    searchInput: document.getElementById("searchInput"),
    statusFilter: document.getElementById("statusFilter"),
    taskList: document.getElementById("taskList"),
    taskCount: document.getElementById("taskCount"),
    scriptTabs: document.getElementById("scriptTabs"),
    scriptCard: document.getElementById("scriptCard"),
    intakeForm: document.getElementById("intakeForm"),
    intakeStatus: document.getElementById("intakeStatus"),
    leadDialog: document.getElementById("leadDialog"),
    leadForm: document.getElementById("leadForm"),
    leadDialogTitle: document.getElementById("leadDialogTitle"),
    saveLeadButton: document.getElementById("saveLeadButton"),
    openLeadDialogButton: document.getElementById("openLeadDialogButton"),
    exportCsvButton: document.getElementById("exportCsvButton")
};

function loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
        return { leads: seedLeads };
    }

    try {
        const parsed = JSON.parse(saved);
        return { leads: Array.isArray(parsed.leads) ? parsed.leads : seedLeads };
    } catch {
        return { leads: seedLeads };
    }
}

function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function formatDate(value) {
    if (!value) return "-";
    return new Intl.DateTimeFormat("th-TH", { dateStyle: "medium" }).format(new Date(`${value}T00:00:00`));
}

function todayISO() {
    return new Date().toISOString().slice(0, 10);
}

function escapeHtml(value) {
    return String(value || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function setView(viewName) {
    const titles = {
        dashboard: "ภาพรวมงานขาย",
        leads: "จัดการลูกค้า",
        tasks: "งานติดตาม",
        scripts: "สคริปต์ขาย",
        intake: "ฟอร์มรับลูกค้า"
    };

    els.viewTitle.textContent = titles[viewName];
    els.navButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.view === viewName));
    els.views.forEach((view) => view.classList.toggle("is-active", view.id === `${viewName}View`));
    render();
}

function getFilteredLeads() {
    const term = els.searchInput.value.trim().toLowerCase();
    const status = els.statusFilter.value;

    return state.leads.filter((lead) => {
        const haystack = [lead.name, lead.village, lead.phone, lead.product, lead.type].join(" ").toLowerCase();
        const matchTerm = !term || haystack.includes(term);
        const matchStatus = status === "all" || lead.status === status;
        return matchTerm && matchStatus;
    });
}

function render() {
    renderDashboard();
    renderLeads();
    renderTasks();
    renderScripts();
}

function renderDashboard() {
    const total = state.leads.length;
    const closed = state.leads.filter((lead) => lead.status === "closed").length;
    const meetings = state.leads.filter((lead) => lead.status === "meeting").length;
    const hot = state.leads.filter((lead) => Number(lead.score) >= 80 && lead.status !== "closed").length;

    const stats = [
        ["ลูกค้าทั้งหมด", total],
        ["ปิดการขาย", closed],
        ["นัดพบ", meetings],
        ["โอกาสสูง", hot]
    ];

    els.statsGrid.innerHTML = stats.map(([label, value]) => `
        <article class="stat-card">
            <span>${label}</span>
            <strong>${value}</strong>
        </article>
    `).join("");

    const priority = [...state.leads]
        .filter((lead) => lead.status !== "closed" && lead.status !== "lost")
        .sort((a, b) => Number(b.score) - Number(a.score))
        .slice(0, 5);

    els.priorityLeads.innerHTML = priority.length ? priority.map(leadCardTemplate).join("") : emptyTemplate("ยังไม่มีลูกค้าที่ต้องติดตาม");
    els.todayTasks.innerHTML = taskItems().slice(0, 5).map(taskTemplate).join("") || emptyTemplate("ยังไม่มีงานวันนี้");
}

function renderLeads() {
    const leads = getFilteredLeads();
    els.leadList.innerHTML = leads.length ? leads.map(leadCardTemplate).join("") : emptyTemplate("ไม่พบลูกค้าตามเงื่อนไข");

    if (!selectedLeadId || !state.leads.some((lead) => lead.id === selectedLeadId)) {
        selectedLeadId = state.leads[0]?.id || null;
    }

    const selected = state.leads.find((lead) => lead.id === selectedLeadId);
    els.leadDetail.innerHTML = selected ? leadDetailTemplate(selected) : `
        <div class="detail-empty">เลือกลูกค้าจากรายการเพื่อดูรายละเอียด</div>
    `;
}

function renderTasks() {
    const tasks = taskItems();
    els.taskCount.textContent = `${tasks.length} งาน`;
    els.taskList.innerHTML = tasks.length ? tasks.map(taskTemplate).join("") : emptyTemplate("ยังไม่มีงานติดตาม");
}

function renderScripts() {
    els.scriptTabs.innerHTML = scripts.map((script, index) => `
        <button class="script-tab ${index === activeScriptIndex ? "is-active" : ""}" data-script-index="${index}" type="button">
            ${index + 1}. ${escapeHtml(script.stage)}
        </button>
    `).join("");

    const script = scripts[activeScriptIndex];
    els.scriptCard.innerHTML = `
        <p class="eyebrow">ขั้นตอน ${activeScriptIndex + 1}/${scripts.length}</p>
        <h2>${escapeHtml(script.title)}</h2>
        <blockquote>${escapeHtml(script.content)}</blockquote>
        <div class="tips-grid">
            ${script.tips.map((tip) => `<div class="tip">${escapeHtml(tip)}</div>`).join("")}
        </div>
        <div class="dialog-actions">
            <button class="ghost-button" id="copyScriptButton" type="button">คัดลอกสคริปต์</button>
        </div>
    `;
}

function leadCardTemplate(lead) {
    const status = statusMap[lead.status] || statusMap.prospect;
    return `
        <article class="lead-item ${lead.id === selectedLeadId ? "is-selected" : ""}" data-lead-id="${lead.id}">
            <div class="lead-row">
                <div>
                    <p class="lead-name">${escapeHtml(lead.name)}</p>
                    <span class="muted">${escapeHtml(lead.type || "-")} · ${escapeHtml(lead.village || "-")}</span>
                </div>
                <span class="status-pill" style="color:${status.color};background:${status.bg}">${status.label}</span>
            </div>
            <div class="score-bar" aria-label="คะแนนโอกาสขาย ${lead.score}">
                <span style="width:${Number(lead.score) || 0}%"></span>
            </div>
            <span class="muted">ติดตามถัดไป: ${formatDate(lead.nextFollowUp)}</span>
        </article>
    `;
}

function leadDetailTemplate(lead) {
    const status = statusMap[lead.status] || statusMap.prospect;
    return `
        <div class="panel-header">
            <div>
                <h2>${escapeHtml(lead.name)}</h2>
                <span class="muted">${escapeHtml(lead.type || "-")} · ${escapeHtml(lead.village || "-")}</span>
            </div>
            <span class="status-pill" style="color:${status.color};background:${status.bg}">${status.label}</span>
        </div>

        <div class="detail-grid">
            <div class="detail-box"><span>เบอร์โทร</span><strong>${escapeHtml(lead.phone)}</strong></div>
            <div class="detail-box"><span>สินค้าที่สนใจ</span><strong>${escapeHtml(lead.product || "-")}</strong></div>
            <div class="detail-box"><span>ติดต่อล่าสุด</span><strong>${formatDate(lead.lastContact)}</strong></div>
            <div class="detail-box"><span>นัดติดตาม</span><strong>${formatDate(lead.nextFollowUp)}</strong></div>
            <div class="detail-box"><span>คะแนนโอกาสขาย</span><strong>${Number(lead.score) || 0}/100</strong></div>
            <div class="detail-box"><span>สถานะ</span><strong>${status.label}</strong></div>
        </div>

        <h3>หมายเหตุ</h3>
        <div class="notes-box">${escapeHtml(lead.notes || "ยังไม่มีหมายเหตุ")}</div>

        <div class="lead-actions" style="margin-top:16px">
            <a class="primary-button" href="tel:${escapeHtml(lead.phone)}">โทรหาลูกค้า</a>
            <button class="ghost-button" data-edit-lead="${lead.id}" type="button">แก้ไข</button>
            <button class="ghost-button" data-mark-contacted="${lead.id}" type="button">บันทึกว่าติดต่อแล้ว</button>
            <button class="ghost-button" data-delete-lead="${lead.id}" type="button">ลบ</button>
        </div>
    `;
}

function taskItems() {
    const today = todayISO();
    return state.leads
        .filter((lead) => lead.nextFollowUp && lead.status !== "closed" && lead.status !== "lost")
        .sort((a, b) => a.nextFollowUp.localeCompare(b.nextFollowUp))
        .map((lead) => ({
            ...lead,
            overdue: lead.nextFollowUp < today
        }));
}

function taskTemplate(lead) {
    return `
        <article class="task-item ${lead.overdue ? "is-overdue" : ""}">
            <div>
                <strong>${escapeHtml(lead.name)}</strong>
                <div class="muted">${lead.overdue ? "เลยกำหนด" : "กำหนด"} ${formatDate(lead.nextFollowUp)} · ${escapeHtml(lead.phone)}</div>
            </div>
            <button class="ghost-button" data-edit-lead="${lead.id}" type="button">อัปเดต</button>
        </article>
    `;
}

function emptyTemplate(message) {
    return `<div class="empty-state">${escapeHtml(message)}</div>`;
}

function openLeadDialog(lead = null) {
    els.leadForm.reset();
    els.leadDialogTitle.textContent = lead ? "แก้ไขลูกค้า" : "เพิ่มลูกค้า";

    if (lead) {
        Object.entries(lead).forEach(([key, value]) => {
            const field = els.leadForm.elements[key];
            if (field) field.value = value || "";
        });
    } else {
        els.leadForm.elements.id.value = "";
        els.leadForm.elements.product.value = "Super Life 99/20";
        els.leadForm.elements.score.value = 50;
        els.leadForm.elements.status.value = "prospect";
    }

    els.leadDialog.showModal();
}

function upsertLeadFromForm(form) {
    const formData = new FormData(form);
    const id = formData.get("id") || uid();
    const existing = state.leads.find((lead) => lead.id === id);
    const lead = {
        id,
        name: formData.get("name").trim(),
        phone: formData.get("phone").trim(),
        type: formData.get("type").trim() || "ไม่ระบุ",
        village: formData.get("village").trim(),
        status: formData.get("status") || "prospect",
        score: Math.max(0, Math.min(100, Number(formData.get("score")) || 0)),
        product: formData.get("product").trim() || "Super Life 99/20",
        lastContact: existing?.lastContact || todayISO(),
        nextFollowUp: formData.get("nextFollowUp"),
        notes: formData.get("notes").trim()
    };

    if (!lead.name || !lead.phone) return false;

    if (existing) {
        state.leads = state.leads.map((item) => item.id === id ? lead : item);
    } else {
        state.leads.unshift(lead);
    }

    selectedLeadId = id;
    saveState();
    render();
    return true;
}

async function addLeadFromIntake(event) {
    event.preventDefault();
    const formData = new FormData(els.intakeForm);
    const name = formData.get("name").trim();
    const phone = formData.get("phone").trim();
    const age = formData.get("age").trim();
    const occupation = formData.get("occupation").trim();
    const budget = formData.get("budget").trim();

    if (!name || !phone || !age || !occupation || !budget) {
        els.intakeStatus.textContent = "กรุณากรอกชื่อ เบอร์โทร อายุ อาชีพ และงบประมาณต่อเดือน";
        els.intakeStatus.className = "form-status error full-span";
        return;
    }

    const notes = [
        formData.get("notes"),
        age ? `อายุ: ${age} ปี` : "",
        budget ? `งบประมาณต่อเดือน: ${Number(budget).toLocaleString("th-TH")} บาท` : "",
        formData.get("interest") ? `สนใจ: ${formData.get("interest")}` : ""
    ].filter(Boolean).join("\n");

    const lead = {
        id: uid(),
        name,
        phone,
        age,
        occupation,
        budget,
        type: occupation || "ลูกค้าใหม่",
        village: formData.get("village") || "",
        status: "prospect",
        score: 60,
        product: "Super Life 99/20",
        lastContact: todayISO(),
        nextFollowUp: todayISO(),
        notes
    };

    state.leads.unshift(lead);
    selectedLeadId = lead.id;
    saveState();
    render();

    els.intakeStatus.textContent = "กำลังส่งข้อมูลไป Google Sheets...";
    els.intakeStatus.className = "form-status full-span";

    const sheetResult = await sendLeadToGoogleSheets(lead, formData);
    els.intakeForm.reset();
    if (sheetResult === "sent") {
        els.intakeStatus.textContent = "บันทึกลูกค้าใหม่และส่งข้อมูลไป Google Sheets แล้ว";
        els.intakeStatus.className = "form-status full-span";
        return;
    }

    els.intakeStatus.textContent = sheetResult === "not-configured"
        ? "บันทึกในระบบแล้ว แต่ยังไม่ได้ตั้งค่า Google Sheets Web App URL"
        : "บันทึกในระบบแล้ว แต่ส่งข้อมูลไป Google Sheets ไม่สำเร็จ";
    els.intakeStatus.className = "form-status error full-span";
}

async function sendLeadToGoogleSheets(lead, formData) {
    if (!GOOGLE_SHEETS_WEB_APP_URL) {
        return "not-configured";
    }

    const payload = new URLSearchParams({
        name: lead.name,
        phone: lead.phone,
        age: lead.age,
        occupation: lead.occupation,
        budget: lead.budget,
        interest: formData.get("interest") || "",
        notes: formData.get("notes") || ""
    });

    try {
        await fetch(GOOGLE_SHEETS_WEB_APP_URL, {
            method: "POST",
            mode: "no-cors",
            body: payload
        });
        return "sent";
    } catch (error) {
        console.error("Google Sheets submit failed", error);
        return "failed";
    }
}

function exportCsv() {
    const headers = ["ชื่อ", "เบอร์โทร", "อายุ", "อาชีพ", "งบประมาณต่อเดือน", "ประเภท", "พื้นที่", "สถานะ", "คะแนน", "สินค้า", "ติดต่อล่าสุด", "นัดติดตาม", "หมายเหตุ"];
    const rows = state.leads.map((lead) => [
        lead.name,
        lead.phone,
        lead.age,
        lead.occupation,
        lead.budget,
        lead.type,
        lead.village,
        statusMap[lead.status]?.label || lead.status,
        lead.score,
        lead.product,
        lead.lastContact,
        lead.nextFollowUp,
        lead.notes
    ]);

    const csv = [headers, ...rows]
        .map((row) => row.map((cell) => `"${String(cell || "").replaceAll('"', '""')}"`).join(","))
        .join("\n");

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `life-crm-${todayISO()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
}

els.navButtons.forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.view));
});

document.querySelectorAll("[data-view-link]").forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.viewLink));
});

els.searchInput.addEventListener("input", renderLeads);
els.statusFilter.addEventListener("change", renderLeads);
els.openLeadDialogButton.addEventListener("click", () => openLeadDialog());
els.exportCsvButton.addEventListener("click", exportCsv);
els.intakeForm.addEventListener("submit", addLeadFromIntake);

els.saveLeadButton.addEventListener("click", () => {
    if (upsertLeadFromForm(els.leadForm)) {
        els.leadDialog.close();
    }
});

document.addEventListener("click", async (event) => {
    const leadCard = event.target.closest("[data-lead-id]");
    if (leadCard) {
        selectedLeadId = leadCard.dataset.leadId;
        setView("leads");
        return;
    }

    const editButton = event.target.closest("[data-edit-lead]");
    if (editButton) {
        const lead = state.leads.find((item) => item.id === editButton.dataset.editLead);
        if (lead) openLeadDialog(lead);
        return;
    }

    const contactedButton = event.target.closest("[data-mark-contacted]");
    if (contactedButton) {
        state.leads = state.leads.map((lead) => lead.id === contactedButton.dataset.markContacted
            ? { ...lead, status: "contacted", lastContact: todayISO() }
            : lead);
        saveState();
        render();
        return;
    }

    const deleteButton = event.target.closest("[data-delete-lead]");
    if (deleteButton && confirm("ต้องการลบลูกค้ารายนี้ใช่ไหม")) {
        state.leads = state.leads.filter((lead) => lead.id !== deleteButton.dataset.deleteLead);
        selectedLeadId = state.leads[0]?.id || null;
        saveState();
        render();
        return;
    }

    const scriptTab = event.target.closest("[data-script-index]");
    if (scriptTab) {
        activeScriptIndex = Number(scriptTab.dataset.scriptIndex);
        renderScripts();
        return;
    }

    if (event.target.id === "copyScriptButton") {
        await navigator.clipboard.writeText(scripts[activeScriptIndex].content);
        event.target.textContent = "คัดลอกแล้ว";
        setTimeout(() => renderScripts(), 1000);
    }
});

render();
