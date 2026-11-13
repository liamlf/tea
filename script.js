(async () => {
  const main = document.getElementById("main");
  const tagsEl = document.getElementById("tags");
  const SITE = "Star Slate Téa";
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* posts live in posts.json, which the writing desk (write.html) edits */
  let POSTS = [];
  try {
    const r = await fetch("posts.json?t=" + Date.now(), { cache: "no-store" });
    if (r.ok) POSTS = await r.json();
  } catch (_) {}
  POSTS = POSTS.map((p, i) => [p, i]).sort((a, b) => String(b[0].date).localeCompare(String(a[0].date)) || a[1] - b[1]).map((x) => x[0]);

  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const fmtDate = (iso) => {
    const [y, m, d] = String(iso || "").split("-").map(Number);
    return y && m && d ? `${MONTHS[m - 1]} ${d}, ${y}` : "";
  };

  const blocks = (raw) => String(raw || "").trim().split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  const blockHTML = (b) =>
    b.startsWith(">") ? `<blockquote>${esc(b.replace(/^>\s?/gm, ""))}</blockquote>` : `<p>${esc(b)}</p>`;

  const meta = (p) =>
    `<p class="meta">${[fmtDate(p.date), p.tag].filter(Boolean).map((t) => `<span>${esc(t)}</span>`).join("")}</p>`;
  const pictures = (p, max) =>
    (p.images || []).slice(0, max).map((src) => `<img src="${esc(src)}" alt="" loading="lazy">`).join("");

  let filter = null;

  function renderTags() {
    const tags = [...new Set(POSTS.map((p) => p.tag).filter(Boolean))];
    let html = tags.length < 2 ? "" :
      [null, ...tags].map((t) => `<button aria-pressed="${t === filter}" data-tag="${esc(t ?? "")}">${esc(t ?? "all")}</button>`).join("");
    // only the browser that is signed in at the writing desk sees this link
    try { if (localStorage.getItem("ssk-key")) html += `<a class="write-link" href="write.html">✦ write</a>`; } catch (_) {}
    tagsEl.innerHTML = html;
  }

  function renderList() {
    document.title = SITE;
    const list = POSTS.filter((p) => !filter || p.tag === filter);
    if (!list.length) return (main.innerHTML = `<p class="empty">Nothing here yet.</p>`);
    main.innerHTML = list.map((p) => {
      const b = blocks(p.body);
      const nPics = (p.images || []).length;
      const long = b.length > 3 || nPics > 1;
      return `<article class="post">
        ${meta(p)}
        <h2><a href="#${esc(p.id)}">${esc(p.title)}</a></h2>
        ${pictures(p, 1)}
        <div class="body">${(b.length > 3 ? b.slice(0, 2) : b).map(blockHTML).join("")}</div>
        ${long ? `<a class="more" href="#${esc(p.id)}">${b.length > 3 ? "Keep reading" : `See all ${nPics} pictures`} →</a>` : ""}
      </article>`;
    }).join("");
  }

  function renderPost(i) {
    const p = POSTS[i], newer = POSTS[i - 1], older = POSTS[i + 1];
    document.title = p.title + " · " + SITE;
    main.innerHTML = `<article class="post single">
        ${meta(p)}
        <h2>${esc(p.title)}</h2>
        ${pictures(p)}
        <div class="body">${blocks(p.body).map(blockHTML).join("")}</div>
        <a class="back" href="#">← all posts</a>
      </article>
      <nav class="pager">
        ${older ? `<a href="#${esc(older.id)}">← ${esc(older.title)}</a>` : "<span></span>"}
        ${newer ? `<a href="#${esc(newer.id)}">${esc(newer.title)} →</a>` : ""}
      </nav>`;
    scrollTo(0, 0);
  }

  function route() {
    const id = decodeURIComponent(location.hash.slice(1));
    const i = POSTS.findIndex((p) => p.id === id);
    i >= 0 ? renderPost(i) : renderList();
  }

  tagsEl.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    filter = b.dataset.tag || null;
    renderTags();
    location.hash.length > 1 ? (location.hash = "") : renderList();
  });
  addEventListener("hashchange", route);

  /* a quiet, still sky */
  const sky = document.getElementById("sky"), ctx = sky.getContext("2d");
  function drawSky() {
    const d = Math.min(devicePixelRatio || 1, 2);
    sky.width = innerWidth * d;
    sky.height = innerHeight * d;
    ctx.setTransform(d, 0, 0, d, 0, 0);
    let seed = 7;
    const r = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    const n = Math.round((innerWidth * innerHeight) / 14000);
    for (let i = 0; i < n; i++) {
      ctx.fillStyle = `rgba(255,255,255,${(r() * 0.4 + 0.1).toFixed(2)})`;
      ctx.beginPath();
      ctx.arc(r() * innerWidth, r() * innerHeight, r() * 1.1 + 0.3, 0, 6.28);
      ctx.fill();
    }
  }
  drawSky();
  addEventListener("resize", drawSky);

  /* little stars that follow the mouse */
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches && matchMedia("(pointer: fine)").matches) {
    let last = 0;
    const glyphs = ["✦", "✧", "⋆", "★"];
    addEventListener("pointermove", (e) => {
      const now = performance.now();
      if (now - last < 55) return;
      last = now;
      const g = document.createElement("span");
      g.className = "glint";
      g.textContent = glyphs[(Math.random() * glyphs.length) | 0];
      g.style.left = e.clientX + 6 + "px";
      g.style.top = e.clientY + 6 + "px";
      g.style.setProperty("--dx", (Math.random() * 30 - 15).toFixed(0) + "px");
      if (Math.random() < 0.4) g.style.color = "#ffc9ea";
      document.body.appendChild(g);
      setTimeout(() => g.remove(), 800);
    });
  }

  renderTags();
  route();
})();
