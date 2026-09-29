const posts = [
  { date: "2026.09.18", title: "给生活留一点没有安排的时间", excerpt: "关于空白、散步，以及那些不需要马上回答的问题。", category: "随笔" },
  { date: "2026.08.26", title: "读完一本书之后，我留下了什么", excerpt: "读书不是收集结论，而是练习和一个念头相处。", category: "阅读" },
  { date: "2026.08.09", title: "一个人也可以好好吃饭", excerpt: "从买菜到洗碗，把一顿饭变成照顾自己的小仪式。", category: "生活" },
  { date: "2026.07.14", title: "写作是把模糊的东西照亮", excerpt: "试着把脑海里的雾气写下来，轮廓就慢慢出现了。", category: "随笔" },
  { date: "2026.06.30", title: "最近喜欢的三本书", excerpt: "关于城市、植物和如何好好地度过普通的一天。", category: "阅读" },
  { date: "2026.06.05", title: "从小事开始，给自己一点空间", excerpt: "不用立刻成为更好的人，先把窗户打开就很好。", category: "生活" },
];
const postList = document.querySelector("#post-list");
const searchInput = document.querySelector("#search");
const emptyState = document.querySelector("#empty-state");
let activeCategory = "全部";
function renderPosts() {
  const query = searchInput.value.trim().toLowerCase();
  const visiblePosts = posts.filter((post) => (activeCategory === "全部" || post.category === activeCategory) && `${post.title} ${post.excerpt} ${post.category}`.toLowerCase().includes(query));
  postList.innerHTML = visiblePosts.map((post) => `<article class="post-row"><time class="post-date">${post.date}</time><div class="post-main"><div><h3 class="post-title">${post.title}</h3><p class="post-excerpt">${post.excerpt}</p></div><span class="post-category">${post.category}</span></div><span class="post-arrow" aria-hidden="true">↗</span></article>`).join("");
  emptyState.hidden = visiblePosts.length > 0;
}
document.querySelectorAll(".filter-chip").forEach((button) => button.addEventListener("click", () => {
  activeCategory = button.dataset.filter;
  document.querySelector(".filter-chip.selected").classList.remove("selected");
  button.classList.add("selected");
  renderPosts();
}));
searchInput.addEventListener("input", renderPosts);
document.querySelector("#year").textContent = new Date().getFullYear();
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector("#main-nav");
menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "关闭导航" : "打开导航");
});
mainNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));
document.querySelector("#subscribe-form").addEventListener("submit", (event) => {
  event.preventDefault();
  document.querySelector("#subscribe-message").textContent = "感谢订阅！接入邮件服务后即可收到更新。";
  event.currentTarget.reset();
});
renderPosts();
