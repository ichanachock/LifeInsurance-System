const quoteForm = document.getElementById("quoteForm");
const formNote = document.getElementById("formNote");

quoteForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(quoteForm);
    const lead = Object.fromEntries(formData.entries());
    const savedLeads = JSON.parse(localStorage.getItem("motor-insurance-leads") || "[]");

    savedLeads.unshift({
        ...lead,
        createdAt: new Date().toISOString()
    });

    localStorage.setItem("motor-insurance-leads", JSON.stringify(savedLeads.slice(0, 50)));
    quoteForm.reset();

    if (formNote) {
        formNote.textContent = "บันทึกข้อมูลเรียบร้อยแล้ว ทีมงานสามารถนำข้อมูลนี้ไปเชื่อม Google Sheets ในขั้นถัดไป";
        formNote.classList.add("success");
    }
});
