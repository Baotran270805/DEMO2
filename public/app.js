/*
 * JournalDesk - website tĩnh dành cho mục đích học tập.
 * KHÔNG có API hoặc server nhận bài. Mọi bản thảo chỉ là dữ liệu demo lưu localStorage.
 * File input KHÔNG upload, KHÔNG lưu nội dung tệp, chỉ ghi nhận tên file.
 */
(() => {
  "use strict";

  const STORE_KEY = "journaldesk-manuscripts-v1";
  const STATUS = Object.freeze({
    submitted: { label: "Mới nộp" },
    screening: { label: "Kiểm tra hình thức" },
    review: { label: "Đang phản biện" },
    revision: { label: "Cần chỉnh sửa" },
    accepted: { label: "Đã chấp nhận" },
    rejected: { label: "Từ chối" },
  });

  const el = (id) => document.getElementById(id);
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
  const readStatus = (value) => Object.hasOwn(STATUS, value) ? value : "submitted";
  const daysAgo = (days) => new Date(Date.now() - days * 86400000).toISOString();

  function demoPapers() {
    return [
      {
        id: "JD-2026-001", title: "Ứng dụng học máy trong phát hiện bất thường mạng",
        type: "Nghiên cứu gốc", field: "An toàn thông tin", author: "Nguyễn Minh Anh",
        email: "minhanh@example.com", coauthors: "Trần Hải Nam",
        abstract: "Bài viết trình bày một quy trình thử nghiệm phát hiện bất thường trên lưu lượng mạng sử dụng các kỹ thuật học máy. Các bước tiền xử lý và đánh giá được xây dựng nhằm minh họa phương pháp nghiên cứu.",
        keywords: "an toàn mạng, học máy, phát hiện bất thường", fileName: "manuscript-demo-01.pdf",
        status: "review", createdAt: daysAgo(2),
      },
      {
        id: "JD-2026-002", title: "Khảo sát mô hình ngôn ngữ trong giáo dục đại học",
        type: "Bài tổng quan", field: "Trí tuệ nhân tạo", author: "Lê Thùy Dương",
        email: "thuyduong@example.com", coauthors: "",
        abstract: "Bản thảo tổng hợp các nhóm ứng dụng của mô hình ngôn ngữ trong môi trường học tập đại học, đồng thời thảo luận những thách thức liên quan tới đánh giá, độ tin cậy và đạo đức sử dụng.",
        keywords: "mô hình ngôn ngữ, giáo dục, tổng quan", fileName: "survey-demo.docx",
        status: "screening", createdAt: daysAgo(5),
      },
      {
        id: "JD-2026-003", title: "Phân tích dữ liệu cảm biến trong hệ thống IoT",
        type: "Nghiên cứu gốc", field: "Khoa học dữ liệu", author: "Phạm Quốc Bảo",
        email: "quocbao@example.com", coauthors: "Võ Gia Huy",
        abstract: "Nghiên cứu đề xuất một quy trình phân tích chuỗi dữ liệu cảm biến phục vụ phát hiện các thay đổi trong môi trường IoT. Nội dung được xây dựng làm ví dụ cho quy trình quản lý bản thảo.",
        keywords: "IoT, cảm biến, dữ liệu chuỗi thời gian", fileName: "iot-data-demo.pdf",
        status: "revision", createdAt: daysAgo(10),
      },
      {
        id: "JD-2026-004", title: "Phương pháp hỗ trợ phân loại văn bản tiếng Việt",
        type: "Bài báo ngắn", field: "Công nghệ thông tin", author: "Đặng Khánh Linh",
        email: "khanhlinh@example.com", coauthors: "",
        abstract: "Bài viết mô tả cách tổ chức dữ liệu, trích xuất đặc trưng và đánh giá một số phương pháp phân loại văn bản ngắn tiếng Việt trong khuôn khổ ví dụ học thuật.",
        keywords: "xử lý ngôn ngữ, văn bản tiếng Việt", fileName: "text-demo.pdf",
        status: "accepted", createdAt: daysAgo(15),
      },
      {
        id: "JD-2026-005", title: "Một giao diện trực quan cho quản lý công bố khoa học",
        type: "Báo cáo kỹ thuật", field: "Công nghệ thông tin", author: "Trần Hải Nam",
        email: "hainam@example.com", coauthors: "Nguyễn Minh Anh",
        abstract: "Báo cáo mô tả quá trình thiết kế giao diện người dùng cho một hệ thống theo dõi bản thảo, tập trung vào khả năng tìm kiếm hồ sơ và trình bày trạng thái xử lý trực quan.",
        keywords: "giao diện, quản lý bản thảo, ứng dụng web", fileName: "journal-ui-demo.docx",
        status: "submitted", createdAt: daysAgo(18),
      },
      {
        id: "JD-2026-006", title: "Khảo sát kỹ thuật trực quan hóa dữ liệu nghiên cứu",
        type: "Bài tổng quan", field: "Khoa học dữ liệu", author: "Võ Gia Huy",
        email: "giahuy@example.com", coauthors: "",
        abstract: "Bản thảo hệ thống hóa các phương pháp trực quan hóa thường dùng trong báo cáo nghiên cứu và nêu một số tiêu chí lựa chọn biểu đồ phù hợp với loại dữ liệu.",
        keywords: "trực quan hóa, biểu đồ, khoa học dữ liệu", fileName: "visualization-demo.pdf",
        status: "rejected", createdAt: daysAgo(26),
      },
    ];
  }

  function safeRead() {
    try {
      const stored = localStorage.getItem(STORE_KEY);
      if (stored === null) return demoPapers();
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) return demoPapers();
      return parsed.filter((paper) => paper && typeof paper.id === "string" && typeof paper.title === "string")
        .map((paper) => ({ ...paper, status: readStatus(paper.status) }));
    } catch (error) {
      console.warn("Không đọc được localStorage; dùng dữ liệu mẫu.", error);
      return demoPapers();
    }
  }

  let papers = safeRead();
  let currentView = "dashboard";
  let detailPaperId = null;
  let toastTimer;
  let storageOk = true;

  function save() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(papers));
      return true;
    } catch (error) {
      console.warn("Không thể ghi localStorage.", error);
      if (storageOk) toast("Trình duyệt đang chặn lưu dữ liệu. Các thay đổi có thể mất khi tải lại trang.", true);
      storageOk = false;
      return false;
    }
  }

  function formatDate(date) {
    const parsed = new Date(date);
    return Number.isNaN(parsed.getTime()) ? "—" : new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit", month: "2-digit", year: "numeric",
    }).format(parsed);
  }
  function sortedPapers() { return [...papers].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); }
  function badge(status) {
    const key = readStatus(status);
    return `<span class="badge badge--${key}">${STATUS[key].label}</span>`;
  }
  function notify(message, isError = false) {
    const element = el("toast");
    element.textContent = message;
    element.classList.toggle("is-error", isError);
    element.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => element.classList.remove("is-visible"), 3900);
  }
  function toast(message, isError = false) { notify(message, isError); }

  function renderStats() {
    const counts = {
      total: papers.length,
      active: papers.filter((paper) => ["submitted", "screening", "review"].includes(paper.status)).length,
      revision: papers.filter((paper) => paper.status === "revision").length,
      accepted: papers.filter((paper) => paper.status === "accepted").length,
    };
    el("statTotal").textContent = counts.total;
    el("statActive").textContent = counts.active;
    el("statRevision").textContent = counts.revision;
    el("statAccepted").textContent = counts.accepted;
    el("sidebarCount").textContent = counts.total;
  }

  function renderRecent() {
    const recent = sortedPapers().slice(0, 4);
    el("recentList").innerHTML = recent.length ? recent.map((paper) => `
      <button type="button" class="recent-row" data-action="view-detail" data-id="${escapeHtml(paper.id)}">
        <span class="recent-icon"><svg class="icon"><use href="#i-file" /></svg></span>
        <span class="recent-main"><strong title="${escapeHtml(paper.title)}">${escapeHtml(paper.title)}</strong><span>${escapeHtml(paper.id)} · ${formatDate(paper.createdAt)}</span></span>
        ${badge(paper.status)}<svg class="icon"><use href="#i-chevron" /></svg>
      </button>`).join("") : `<div class="empty-recent">Chưa có bản thảo. Nhấn “Nộp bản thảo mới” để bắt đầu.</div>`;
  }

  function renderList() {
    const search = el("searchInput").value.trim().toLocaleLowerCase("vi-VN");
    const status = el("statusFilter").value;
    const visible = sortedPapers().filter((paper) => {
      const content = `${paper.title} ${paper.id} ${paper.author} ${paper.email ?? ""}`.toLocaleLowerCase("vi-VN");
      return (!search || content.includes(search)) && (status === "all" || paper.status === status);
    });
    el("manuscriptsBody").innerHTML = visible.length ? visible.map((paper) => `
      <tr>
        <td><div class="title-stack"><strong>${escapeHtml(paper.title)}</strong><span>${escapeHtml(paper.id)} · ${escapeHtml(paper.field ?? "")}</span></div></td>
        <td><div class="author-stack"><strong>${escapeHtml(paper.author)}</strong><span>${escapeHtml(paper.email ?? "")}</span></div></td>
        <td>${formatDate(paper.createdAt)}</td><td>${badge(paper.status)}</td>
        <td><button type="button" class="table-action" data-action="view-detail" data-id="${escapeHtml(paper.id)}">Xem chi tiết</button></td>
      </tr>`).join("") : `<tr><td colspan="5"><div class="empty-state"><strong>Không tìm thấy bản thảo phù hợp</strong>Thử đổi từ khóa tìm kiếm hoặc chọn trạng thái khác.</div></td></tr>`;
    el("listSummary").textContent = `Hiển thị ${visible.length} / ${papers.length} bản thảo`;
    el("exportBtn").disabled = visible.length === 0;
  }

  function renderAll() { renderStats(); renderRecent(); renderList(); }

  function closeMobileMenu() {
    el("sidebar").classList.remove("is-open");
    el("mobileScrim").hidden = true;
    el("menuButton").setAttribute("aria-expanded", "false");
  }
  function showView(view) {
    if (!["dashboard", "manuscripts", "guidelines"].includes(view)) return;
    currentView = view;
    for (const name of ["dashboard", "manuscripts", "guidelines"]) el(`view-${name}`).hidden = name !== view;
    document.querySelectorAll(".nav-link[data-view]").forEach((button) => {
      const active = button.dataset.view === view;
      button.classList.toggle("is-active", active);
      if (active) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });
    el("breadcrumbCurrent").textContent = ({ dashboard: "Tổng quan", manuscripts: "Bài đã gửi", guidelines: "Hướng dẫn nộp bài" })[view];
    closeMobileMenu();
    window.scrollTo({ top: 0, behavior: "auto" });
    // Thay đổi view mà không cần server hay route động.
  }

  function openSubmit() {
    closeMobileMenu();
    el("submitForm").reset();
    el("filePickerLabel").innerHTML = `<strong>Chọn tệp từ máy tính</strong><small>PDF, DOC hoặc DOCX · Chỉ ghi nhớ tên tệp</small>`;
    el("submitDialog").showModal();
    el("paperTitle").focus();
  }

  function addPaper(event) {
    event.preventDefault();
    const form = el("submitForm");
    if (!form.reportValidity()) return;
    const info = new FormData(form);
    const title = String(info.get("title") ?? "").trim();
    const author = String(info.get("author") ?? "").trim();
    const email = String(info.get("email") ?? "").trim();
    const abstract = String(info.get("abstract") ?? "").trim();
    const keywords = String(info.get("keywords") ?? "").trim();
    if (!title || !author || !email || !keywords || abstract.length < 20) {
      notify("Vui lòng nhập đầy đủ thông tin; tóm tắt cần ít nhất 20 ký tự.", true);
      return;
    }
    const file = el("paperFile").files[0];
    if (file && !/\.(pdf|doc|docx)$/i.test(file.name)) {
      notify("Chỉ chọn tệp có đuôi PDF, DOC hoặc DOCX.", true);
      return;
    }
    const id = `JD-${new Date().getFullYear()}-${Date.now().toString(36).slice(-6).toUpperCase()}`;
    const paper = {
      id, title, author, email,
      type: String(info.get("type") ?? "Nghiên cứu gốc"),
      field: String(info.get("field") ?? "Công nghệ thông tin"),
      coauthors: String(info.get("coauthors") ?? "").trim(),
      abstract, keywords, fileName: file?.name ?? "",
      status: "submitted", createdAt: new Date().toISOString(),
    };
    papers.unshift(paper);
    save();
    renderAll();
    el("submitDialog").close();
    showView("manuscripts");
    notify(`Đã lưu bài gửi ${id} trong trình duyệt (demo).`);
  }

  function openDetail(id) {
    const paper = papers.find((item) => item.id === id);
    if (!paper) return;
    detailPaperId = paper.id;
    el("detailId").textContent = paper.id;
    const fields = {
      detailPaperTitle: paper.title, detailType: paper.type || "—", detailField: paper.field || "—",
      detailAuthor: paper.author, detailEmail: paper.email || "—", detailCoauthors: paper.coauthors || "Không có",
      detailDate: formatDate(paper.createdAt), detailFile: paper.fileName || "Không có tệp",
      detailKeywords: paper.keywords || "—", detailAbstract: paper.abstract || "—",
    };
    Object.entries(fields).forEach(([key, value]) => { el(key).textContent = value; });
    el("detailBadge").innerHTML = badge(paper.status);
    el("detailStatus").value = paper.status;
    el("detailDialog").showModal();
  }

  function updateStatus(event) {
    const paper = papers.find((item) => item.id === detailPaperId);
    if (!paper) return;
    paper.status = readStatus(event.target.value);
    save();
    renderAll();
    el("detailBadge").innerHTML = badge(paper.status);
    notify("Đã cập nhật trạng thái mô phỏng.");
  }

  function deletePaper() {
    const paper = papers.find((item) => item.id === detailPaperId);
    if (!paper) return;
    if (!window.confirm(`Xóa hồ sơ ${paper.id}? Thao tác này không thể hoàn tác.`)) return;
    papers = papers.filter((item) => item.id !== detailPaperId);
    detailPaperId = null;
    save();
    renderAll();
    el("detailDialog").close();
    notify("Đã xóa hồ sơ khỏi bộ nhớ trình duyệt.");
  }

  function resetDemo() {
    if (!window.confirm("Khôi phục bộ dữ liệu mẫu? Tất cả bản thảo đã thêm và các cập nhật trên trình duyệt sẽ bị thay thế.")) return;
    papers = demoPapers();
    save();
    el("searchInput").value = "";
    el("statusFilter").value = "all";
    renderAll();
    notify("Đã khôi phục 6 bản thảo mẫu.");
  }

  function exportCsv() {
    const search = el("searchInput").value.trim().toLocaleLowerCase("vi-VN");
    const status = el("statusFilter").value;
    const shown = sortedPapers().filter((paper) => {
      const text = `${paper.title} ${paper.id} ${paper.author} ${paper.email ?? ""}`.toLocaleLowerCase("vi-VN");
      return (!search || text.includes(search)) && (status === "all" || paper.status === status);
    });
    if (!shown.length) return;
    const columns = ["Mã bài", "Tiêu đề", "Loại bài", "Lĩnh vực", "Tác giả", "Email", "Đồng tác giả", "Từ khóa", "Tóm tắt", "Tên tệp", "Ngày gửi", "Trạng thái"];
    const quote = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
    const records = shown.map((p) => [p.id, p.title, p.type, p.field, p.author, p.email, p.coauthors, p.keywords, p.abstract, p.fileName, formatDate(p.createdAt), STATUS[readStatus(p.status)].label]);
    const csv = "\ufeff" + [columns, ...records].map((row) => row.map(quote).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "journaldesk-ban-thao-demo.csv";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify(`Đã xuất ${shown.length} bản thảo ra CSV.`);
  }

  // Mọi nút điều hướng / thao tác được xử lý tại đây để không tạo sự kiện trùng.
  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest("[data-action], [data-view]");
    if (!button) return;
    if (button.dataset.view) { showView(button.dataset.view); return; }
    switch (button.dataset.action) {
      case "open-submit": openSubmit(); break;
      case "close-submit": el("submitDialog").close(); break;
      case "view-detail": openDetail(button.dataset.id); break;
      case "close-detail": el("detailDialog").close(); break;
    }
  });
  el("submitForm").addEventListener("submit", addPaper);
  el("detailStatus").addEventListener("change", updateStatus);
  el("deletePaperBtn").addEventListener("click", deletePaper);
  el("resetDemoBtn").addEventListener("click", resetDemo);
  el("exportBtn").addEventListener("click", exportCsv);
  el("searchInput").addEventListener("input", renderList);
  el("statusFilter").addEventListener("change", renderList);
  el("paperFile").addEventListener("change", (event) => {
    const file = event.target.files[0];
    el("filePickerLabel").replaceChildren();
    const title = document.createElement("strong");
    title.textContent = file ? file.name : "Chọn tệp từ máy tính";
    const hint = document.createElement("small");
    hint.textContent = file ? "Đã chọn · Chỉ lưu tên tệp, không upload" : "PDF, DOC hoặc DOCX · Chỉ ghi nhớ tên tệp";
    el("filePickerLabel").append(title, hint);
  });
  el("menuButton").addEventListener("click", () => {
    const opened = !el("sidebar").classList.contains("is-open");
    el("sidebar").classList.toggle("is-open", opened);
    el("mobileScrim").hidden = !opened;
    el("menuButton").setAttribute("aria-expanded", String(opened));
  });
  el("mobileScrim").addEventListener("click", closeMobileMenu);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMobileMenu();
  });
  renderAll();
  showView(currentView);
})();
