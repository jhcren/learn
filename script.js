const STORE_KEY = "shiye-blog-demo-v1";
const starter = {
  settings: { name: "拾页", tagline: "把日子过慢一点，把想法写下来。", description: "一个记录阅读、思考与日常的个人博客。", email: "hello@yourdomain.com" },
  posts: [
    { id: "p1", date: "2026-09-18", title: "给生活留一点没有安排的时间", excerpt: "关于空白、散步，以及那些不需要马上回答的问题。", category: "随笔", status: "published", content: "有一段时间，我把每个空隙都填满。通勤时听播客，吃饭时看视频，连散步也要设定一个目的地。后来才发现，偶尔不安排任何事情，反而能听见自己真正想做什么。\n\n今天试着把手机留在家里，沿着熟悉的街道走了一圈。阳光落在墙上，风吹动树叶。什么特别的事也没有发生，但这段空白让我重新有了呼吸的感觉。\n\n也许慢下来不是浪费时间，而是给生活留出一点生长的地方。", views: 128 },
    { id: "p2", date: "2026-08-26", title: "读完一本书之后，我留下了什么", excerpt: "读书不是收集结论，而是练习和一个念头相处。", category: "阅读", status: "published", content: "合上书以后，我常常忘记具体的情节，却会记得某个停顿、一个问题，或是作者描写的窗边光线。\n\n最近读到的一句话让我想了很久：我们如何对待微小的事物，往往就是如何对待生活本身。它没有给我答案，但让我开始留意每天经过的树、桌上的杯子，以及认真倾听一个人说话时的自己。\n\n好的阅读大概就是这样，它不会替你决定，而是把一盏灯放在你手边。", views: 96 },
    { id: "p3", date: "2026-08-09", title: "一个人也可以好好吃饭", excerpt: "从买菜到洗碗，把一顿饭变成照顾自己的小仪式。", category: "生活", status: "published", content: "一个人吃饭不一定要凑合。去市场挑一把青菜，慢慢切开番茄，等锅里的水烧开。厨房里有一点蒸汽的时候，屋子也变得柔软起来。\n\n饭后把碗洗干净，擦擦桌面，明天醒来就会有一个清爽的早晨。照顾自己不需要很大的仪式，可能就是认真为自己做一顿饭。", views: 73 },
    { id: "p4", date: "2026-07-14", title: "写作是把模糊的东西照亮", excerpt: "试着把脑海里的雾气写下来，轮廓就慢慢出现了。", category: "随笔", status: "published", content: "有些想法在脑海里盘旋很久，看起来很重要，却又说不清楚。开始写下来之后，我才发现它们有的只是担心，有的只是一个还没问出口的问题。\n\n写作不是把一切都想明白，而是给那些模糊的感觉一点形状。", views: 51 },
    { id: "p5", date: "2026-06-30", title: "最近喜欢的三本书", excerpt: "关于城市、植物和如何好好地度过普通的一天。", category: "阅读", status: "published", content: "最近读了三本风格完全不同的书：一本写城市的记忆，一本观察阳台上的植物，还有一本谈论如何安排普通的一天。\n\n它们共同提醒我，生活不是一连串待完成的任务。我们也可以停下来，看看窗外，再决定下一步要往哪里走。", views: 44 },
    { id: "p6", date: "2026-06-05", title: "从小事开始，给自己一点空间", excerpt: "不用立刻成为更好的人，先把窗户打开就很好。", category: "生活", status: "draft", content: "草稿：新的一年，不必急着给自己列出很多目标。可以从早晨打开窗户、给植物浇水开始。", views: 0 }
  ],
  users: [
    { id: "u1", name: "站点管理员", username: "admin", email: "hello@yourdomain.com", role: "管理员", status: "正常" },
    { id: "u2", name: "编辑示例", username: "editor", email: "editor@example.com", role: "编辑", status: "正常" },
    { id: "u3", name: "读者示例", username: "reader", email: "reader@example.com", role: "读者", status: "正常" }
  ]
};
let data = loadData();
let activeFilter = "全部";
let activeAdminPage = "dashboard";
let toastTimer;

function loadData() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || structuredClone(starter); }
  catch { return JSON.parse(JSON.stringify(starter)); }
}
function saveData() { localStorage.setItem(STORE_KEY, JSON.stringify(data)); }
function escapeHTML(value = "") { return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char])); }
function dateLabel(value) { return new Date(`${value}T12:00:00`).toLocaleDateString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" }).replaceAll("/", "."); }
function toast(message) { const box = document.querySelector("#toast"); box.textContent = message; box.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(() => box.classList.remove("show"), 2400); }

function renderPublic() {
  const published = data.posts.filter((post) => post.status === "published").sort((a, b) => b.date.localeCompare(a.date));
  const categories = ["全部", ...new Set(published.map((post) => post.category))];
  document.querySelector("#category-filters").innerHTML = categories.map((category) => `<button class="filter-chip ${activeFilter === category ? "selected" : ""}" data-category="${escapeHTML(category)}">${escapeHTML(category)}${category === "全部" ? ` <span>${String(published.length).padStart(2, "0")}</span>` : ""}</button>`).join("") + `<label class="search-box"><span aria-hidden="true">⌕</span><input id="search" type="search" placeholder="搜索文章" aria-label="搜索文章" /></label>`;
  document.querySelectorAll(".filter-chip").forEach((button) => button.addEventListener("click", () => { activeFilter = button.dataset.category; renderPublic(); }));
  document.querySelector("#search").addEventListener("input", filterPublicPosts);
  filterPublicPosts();
  document.querySelectorAll("#brand-name").forEach((el) => { el.innerHTML = `${escapeHTML(data.settings.name)}<span class="brand-dot">.</span>`; });
  document.querySelector("#hero-description").textContent = data.settings.description;
  document.querySelector("#about-tagline").textContent = data.settings.tagline;
  document.querySelectorAll('a[href="mailto:hello@yourdomain.com"]').forEach((link) => { link.href = `mailto:${encodeURIComponent(data.settings.email)}`; });
  document.querySelector("#year").textContent = new Date().getFullYear();
}
function filterPublicPosts() {
  const query = (document.querySelector("#search")?.value || "").trim().toLowerCase();
  const posts = data.posts.filter((post) => post.status === "published" && (activeFilter === "全部" || post.category === activeFilter) && `${post.title} ${post.excerpt} ${post.category}`.toLowerCase().includes(query)).sort((a, b) => b.date.localeCompare(a.date));
  document.querySelector("#post-list").innerHTML = posts.map((post) => `<button class="post-row post-button" data-open-post="${escapeHTML(post.id)}"><time class="post-date">${dateLabel(post.date)}</time><span class="post-main"><span><span class="post-title">${escapeHTML(post.title)}</span><span class="post-excerpt">${escapeHTML(post.excerpt)}</span></span><span class="post-category">${escapeHTML(post.category)}</span></span><span class="post-arrow" aria-hidden="true">↗</span></button>`).join("");
  document.querySelector("#empty-state").hidden = posts.length > 0;
  document.querySelectorAll("[data-open-post]").forEach((button) => button.addEventListener("click", () => openArticle(button.dataset.openPost)));
}
function openArticle(id) {
  const post = data.posts.find((item) => item.id === id);
  if (!post) return;
  const dialog = document.querySelector("#article-dialog");
  dialog.innerHTML = `<article class="dialog article-dialog" role="dialog" aria-modal="true"><button class="dialog-close" data-close-dialog aria-label="关闭">×</button><p class="eyebrow">${escapeHTML(post.category)}　·　${dateLabel(post.date)}</p><h2>${escapeHTML(post.title)}</h2><p class="article-lead">${escapeHTML(post.excerpt)}</p><div class="article-body">${escapeHTML(post.content).split("\n\n").map((p) => `<p>${p}</p>`).join("")}</div><div class="article-end">— 写于拾页 —</div></article>`;
  dialog.hidden = false;
  dialog.querySelector("[data-close-dialog]").addEventListener("click", () => dialog.hidden = true);
}

function openLogin() { document.querySelector("#login-dialog").hidden = false; }
function enterAdmin() { document.querySelector("#public-site").hidden = true; document.querySelector("#admin-app").hidden = false; renderAdmin(); }
function exitAdmin() { document.querySelector("#admin-app").hidden = true; document.querySelector("#public-site").hidden = false; }
document.querySelector("#admin-open").addEventListener("click", openLogin);
document.querySelector("#mobile-admin").addEventListener("click", openLogin);
document.querySelectorAll("[data-close-dialog]").forEach((button) => button.addEventListener("click", () => button.closest(".dialog-backdrop").hidden = true));
document.querySelectorAll(".dialog-backdrop").forEach((backdrop) => backdrop.addEventListener("click", (event) => { if (event.target === backdrop) backdrop.hidden = true; }));
document.addEventListener("keydown", (event) => { if (event.key === "Escape") document.querySelectorAll(".dialog-backdrop").forEach((dialog) => dialog.hidden = true); });
document.querySelector("#login-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  if (form.get("username") === "admin" && form.get("password") === "admin123") {
    document.querySelector("#login-error").textContent = "";
    document.querySelector("#login-dialog").hidden = true;
    enterAdmin();
  } else document.querySelector("#login-error").textContent = "账号或密码不正确，请使用上方演示账号。";
});
document.querySelector("#back-to-site").addEventListener("click", exitAdmin);
document.querySelector("#logout").addEventListener("click", exitAdmin);
document.querySelectorAll(".side-item").forEach((button) => button.addEventListener("click", () => { activeAdminPage = button.dataset.page; renderAdmin(); }));

function renderAdmin() {
  document.querySelectorAll(".side-item").forEach((button) => button.classList.toggle("active", button.dataset.page === activeAdminPage));
  document.querySelector("#sidebar-post-count").textContent = data.posts.length;
  const content = document.querySelector("#admin-content");
  if (activeAdminPage === "dashboard") renderDashboard(content);
  if (activeAdminPage === "posts") renderPostManagement(content);
  if (activeAdminPage === "users") renderUserManagement(content);
  if (activeAdminPage === "settings") renderSettings(content);
  bindAdminActions(content);
}
function pageTitle(kicker, title, description, action = "") {
  return `<div class="admin-page-heading"><div><p class="eyebrow">${kicker}</p><h1>${title}</h1><p>${description}</p></div>${action}</div>`;
}
function renderDashboard(root) {
  const live = data.posts.filter((p) => p.status === "published").length;
  const drafts = data.posts.filter((p) => p.status === "draft").length;
  const views = data.posts.reduce((total, p) => total + (p.views || 0), 0);
  root.innerHTML = pageTitle("OVERVIEW", "数据概览", "欢迎回来，这里是博客的最新状态。", `<button class="primary-button" data-action="new-post">＋ 写一篇文章</button>`) +
    `<div class="stat-grid"><article class="stat-card"><span>全部文章</span><strong>${data.posts.length}</strong><small>包含已发布和草稿</small><i>▤</i></article><article class="stat-card"><span>已发布</span><strong>${live}</strong><small>公开可见的文章</small><i>↗</i></article><article class="stat-card"><span>草稿</span><strong>${drafts}</strong><small>还未公开</small><i>✎</i></article><article class="stat-card"><span>累计阅读</span><strong>${views.toLocaleString()}</strong><small>演示阅读数据</small><i>◉</i></article></div><div class="dashboard-lower"><section class="panel recent-panel"><div class="panel-heading"><div><p class="eyebrow">RECENT ACTIVITY</p><h2>最近文章</h2></div><button class="quiet-button" data-page-link="posts">管理文章 →</button></div>${data.posts.slice().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,5).map(postRowAdmin).join("")}</section><section class="panel quick-panel"><p class="eyebrow">QUICK ACTIONS</p><h2>开始创作</h2><p>写下最近的想法，保存为草稿或直接发布。</p><button class="primary-button full-button" data-action="new-post">＋ 新建文章</button><button class="secondary-button full-button" data-page-link="posts">查看全部文章</button></section></div>`;
}
function postRowAdmin(post) {
  return `<div class="admin-post-row"><div class="post-mini-icon">${escapeHTML(post.category.slice(0,1))}</div><div class="admin-post-info"><strong>${escapeHTML(post.title)}</strong><small>${dateLabel(post.date)} · ${escapeHTML(post.category)}</small></div><span class="status-badge ${post.status}">${post.status === "published" ? "已发布" : "草稿"}</span></div>`;
}
function renderPostManagement(root) {
  const query = (root.querySelector("#admin-post-search")?.value || "").toLowerCase();
  const posts = data.posts.slice().sort((a,b)=>b.date.localeCompare(a.date)).filter((post) => `${post.title} ${post.category}`.toLowerCase().includes(query));
  root.innerHTML = pageTitle("CONTENT", "文章管理", `共 ${data.posts.length} 篇文章，管理你的创作。`, `<button class="primary-button" data-action="new-post">＋ 新建文章</button>`) +
    `<section class="panel table-panel"><div class="table-toolbar"><label class="table-search">⌕ <input id="admin-post-search" type="search" placeholder="搜索标题或分类" value="${escapeHTML(query)}" /></label><span>${posts.length} 篇文章</span></div><div class="table-wrap"><table><thead><tr><th>文章</th><th>分类</th><th>状态</th><th>日期</th><th>阅读</th><th>操作</th></tr></thead><tbody>${posts.map((post) => `<tr><td><strong class="table-post-title">${escapeHTML(post.title)}</strong><small class="table-excerpt">${escapeHTML(post.excerpt)}</small></td><td><span class="post-category">${escapeHTML(post.category)}</span></td><td><span class="status-badge ${post.status}">${post.status === "published" ? "已发布" : "草稿"}</span></td><td>${dateLabel(post.date)}</td><td>${post.views || 0}</td><td><div class="row-actions"><button data-action="edit-post" data-id="${escapeHTML(post.id)}" aria-label="编辑文章">编辑</button><button data-action="toggle-post" data-id="${escapeHTML(post.id)}">${post.status === "published" ? "转草稿" : "发布"}</button><button class="danger-text" data-action="delete-post" data-id="${escapeHTML(post.id)}">删除</button></div></td></tr>`).join("") || `<tr><td colspan="6" class="empty-table">没有匹配的文章</td></tr>`}</tbody></table></div></section>`;
  root.querySelector("#admin-post-search").addEventListener("input", () => { const cursor = root.querySelector("#admin-post-search").selectionStart; renderPostManagement(root); const input = root.querySelector("#admin-post-search"); input.focus(); input.setSelectionRange(cursor, cursor); bindAdminActions(root); });
}
function renderUserManagement(root) {
  root.innerHTML = pageTitle("PEOPLE", "用户管理", "管理演示站点的后台账号和角色。", `<button class="primary-button" data-action="new-user">＋ 添加用户</button>`) + `<div class="notice-box"><span>ⓘ</span><p>用户数据只保存在当前浏览器中。演示登录账号为 <b>admin</b>，密码为 <b>admin123</b>。</p></div><section class="panel table-panel"><div class="table-wrap"><table><thead><tr><th>用户</th><th>登录名</th><th>邮箱</th><th>角色</th><th>状态</th><th>操作</th></tr></thead><tbody>${data.users.map((user) => `<tr><td><div class="user-cell"><span class="user-avatar">${escapeHTML(user.name.slice(0,1))}</span><strong>${escapeHTML(user.name)}</strong></div></td><td>${escapeHTML(user.username)}</td><td>${escapeHTML(user.email)}</td><td><span class="role-badge">${escapeHTML(user.role)}</span></td><td><span class="status-badge ${user.status === "正常" ? "published" : "draft"}">${escapeHTML(user.status)}</span></td><td><div class="row-actions">${user.username !== "admin" ? `<button data-action="edit-user" data-id="${escapeHTML(user.id)}">编辑</button><button class="danger-text" data-action="delete-user" data-id="${escapeHTML(user.id)}">删除</button>` : `<span class="muted-cell">当前账号</span>`}</div></td></tr>`).join("")}</tbody></table></div></section>`;
}
function renderSettings(root) {
  root.innerHTML = pageTitle("CUSTOMIZE", "博客设置", "修改站点名称、介绍和联系邮箱。") + `<form id="settings-form" class="panel settings-form"><label>博客名称<input name="name" value="${escapeHTML(data.settings.name)}" required /></label><label>首页标语<input name="tagline" value="${escapeHTML(data.settings.tagline)}" required /></label><label>站点简介<textarea name="description" rows="3">${escapeHTML(data.settings.description)}</textarea></label><label>联系邮箱<input name="email" type="email" value="${escapeHTML(data.settings.email)}" /></label><div class="settings-footer"><button class="secondary-button" type="button" data-action="reset-demo">恢复初始演示数据</button><button class="primary-button" type="submit">保存设置</button></div></form><div class="notice-box"><span>ⓘ</span><p>这是一个静态演示站点。设置和内容保存在你的浏览器，不会同步到其他设备或访客。</p></div>`;
  root.querySelector("#settings-form").addEventListener("submit", (event) => { event.preventDefault(); const form = new FormData(event.currentTarget); data.settings = Object.fromEntries(form.entries()); saveData(); renderAdmin(); renderPublic(); toast("博客设置已保存"); });
}
function bindAdminActions(root) {
  root.querySelectorAll("[data-action]").forEach((button) => button.addEventListener("click", () => handleAction(button.dataset.action, button.dataset.id)));
  root.querySelectorAll("[data-page-link]").forEach((button) => button.addEventListener("click", () => { activeAdminPage = button.dataset.pageLink; renderAdmin(); }));
}
function handleAction(action, id) {
  if (action === "new-post") return openPostEditor();
  if (action === "edit-post") return openPostEditor(data.posts.find((p) => p.id === id));
  if (action === "delete-post") { const post = data.posts.find((p) => p.id === id); if (post && confirm(`确定删除《${post.title}》吗？此操作无法撤销。`)) { data.posts = data.posts.filter((p) => p.id !== id); saveData(); renderAdmin(); renderPublic(); toast("文章已删除"); } }
  if (action === "toggle-post") { const post = data.posts.find((p) => p.id === id); post.status = post.status === "published" ? "draft" : "published"; saveData(); renderAdmin(); renderPublic(); toast(post.status === "published" ? "文章已发布" : "文章已转为草稿"); }
  if (action === "new-user") openUserEditor();
  if (action === "edit-user") openUserEditor(data.users.find((u) => u.id === id));
  if (action === "delete-user") { const user = data.users.find((u) => u.id === id); if (user && confirm(`确定删除用户“${user.name}”吗？`)) { data.users = data.users.filter((u) => u.id !== id); saveData(); renderAdmin(); toast("用户已删除"); } }
  if (action === "reset-demo" && confirm("恢复初始演示数据？当前浏览器中的修改将被清除。")) { data = JSON.parse(JSON.stringify(starter)); saveData(); renderAdmin(); renderPublic(); toast("已恢复初始演示数据"); }
}
function openPostEditor(post = null) {
  const editing = Boolean(post);
  const dialog = document.querySelector("#editor-dialog");
  dialog.innerHTML = `<section class="dialog editor-dialog" role="dialog" aria-modal="true" aria-labelledby="editor-title"><button class="dialog-close" data-close-dialog aria-label="关闭">×</button><p class="eyebrow">${editing ? "EDIT STORY" : "NEW STORY"}</p><h2 id="editor-title">${editing ? "编辑文章" : "写一篇新文章"}</h2><form id="post-form"><label>文章标题<input name="title" maxlength="100" value="${escapeHTML(post?.title || "")}" placeholder="给文章起个标题" required /></label><div class="form-two-col"><label>分类<input name="category" value="${escapeHTML(post?.category || "随笔")}" placeholder="随笔、阅读、生活" required /></label><label>发布日期<input name="date" type="date" value="${escapeHTML(post?.date || new Date().toISOString().slice(0,10))}" required /></label></div><label>文章摘要<textarea name="excerpt" rows="2" maxlength="180" placeholder="用一两句话介绍文章">${escapeHTML(post?.excerpt || "")}</textarea></label><label>正文<textarea name="content" rows="8" placeholder="开始写作……段落之间空一行">${escapeHTML(post?.content || "")}</textarea></label><div class="form-two-col"><label>发布状态<select name="status"><option value="draft" ${post?.status === "draft" ? "selected" : ""}>保存为草稿</option><option value="published" ${post?.status === "published" || !post ? "selected" : ""}>立即发布</option></select></label><div class="editor-actions"><button class="secondary-button" type="button" data-close-dialog>取消</button><button class="primary-button" type="submit">${editing ? "保存修改" : "保存文章"}</button></div></div></form></section>`;
  dialog.hidden = false;
  dialog.querySelectorAll("[data-close-dialog]").forEach((button) => button.addEventListener("click", () => dialog.hidden = true));
  dialog.querySelector("#post-form").addEventListener("submit", (event) => { event.preventDefault(); const form = new FormData(event.currentTarget); const values = Object.fromEntries(form.entries()); if (post) Object.assign(post, values); else data.posts.unshift({ id: `p${Date.now()}`, ...values, views: 0 }); saveData(); dialog.hidden = true; renderAdmin(); renderPublic(); toast(post ? "文章已更新" : values.status === "published" ? "文章已发布" : "草稿已保存"); });
}
function openUserEditor(user = null) {
  const dialog = document.querySelector("#editor-dialog");
  dialog.innerHTML = `<section class="dialog editor-dialog compact-dialog" role="dialog" aria-modal="true"><button class="dialog-close" data-close-dialog aria-label="关闭">×</button><p class="eyebrow">USER ACCOUNT</p><h2>${user ? "编辑用户" : "添加用户"}</h2><form id="user-form"><label>显示名称<input name="name" value="${escapeHTML(user?.name || "")}" required /></label><label>登录用户名<input name="username" value="${escapeHTML(user?.username || "")}" required ${user ? "readonly" : ""} /></label><label>邮箱<input name="email" type="email" value="${escapeHTML(user?.email || "")}" required /></label><div class="form-two-col"><label>角色<select name="role"><option ${user?.role === "编辑" ? "selected" : ""}>编辑</option><option ${user?.role === "读者" ? "selected" : ""}>读者</option></select></label><label>状态<select name="status"><option ${user?.status === "正常" || !user ? "selected" : ""}>正常</option><option ${user?.status === "停用" ? "selected" : ""}>停用</option></select></label></div><div class="editor-actions"><button class="secondary-button" type="button" data-close-dialog>取消</button><button class="primary-button" type="submit">保存用户</button></div></form></section>`;
  dialog.hidden = false;
  dialog.querySelectorAll("[data-close-dialog]").forEach((button) => button.addEventListener("click", () => dialog.hidden = true));
  dialog.querySelector("#user-form").addEventListener("submit", (event) => { event.preventDefault(); const form = Object.fromEntries(new FormData(event.currentTarget).entries()); if (user) Object.assign(user, form); else { if (data.users.some((item) => item.username === form.username)) return toast("登录用户名已存在"); data.users.push({ id: `u${Date.now()}`, ...form }); } saveData(); dialog.hidden = true; renderAdmin(); toast(user ? "用户信息已更新" : "用户已添加"); });
}

renderPublic();
