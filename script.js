(() => {
  const POSTS = (window.POSTS || []).slice().sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const main = document.getElementById("main");
  const tagsEl = document.getElementById("tags");
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const fmtDate = (iso) => {
    const [y, m, d] = String(iso || "").split("-").map(Number);
    return y && m && d ? `${MONTHS[m - 1]} ${d}, ${y}` : "";
  };

  const blocks = (raw) => String(raw || "").trim().split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  const blockHTML = (b) =>
    b.startsWith("<") ? b : b.startsWith(">") ? `<blockquote>${b.replace(/^>\s?/gm, "")}</blockquote>` : `<p>${b}</p>`;

  const meta = (p) =>
    `<p class="meta">${[fmtDate(p.date), p.tag].filter(Boolean).map((t) => `<span>${esc(t)}</span>`).join("")}</p>`;
  const image = (p) => (p.image ? `<img src="${esc(p.image)}" alt="">` : "");

  let filter = null;

  function renderTags() {
    const tags = [...new Set(POSTS.map((p) => p.tag).filter(Boolean))];
    tagsEl.innerHTML = tags.length < 2 ? "" :
      [null, ...tags].map((t) => `<button aria-pressed="${t === filter}" data-tag="${esc(t ?? "")}">${esc(t ?? "all")}</button>`).join("");
  }

  function renderList() {
    document.title = "Téa";
    const list = POSTS.filter((p) => !filter || p.tag === filter);
    if (!list.length) return (main.innerHTML = `<p class="empty">Nothing here yet.</p>`);
    main.innerHTML = list.map((p) => {
      const b = blocks(p.body);
      const long = b.length > 3;
      return `<article class="post">
        ${meta(p)}
        <h2><a href="#${esc(p.id)}">${esc(p.title)}</a></h2>
        ${image(p)}
        <div class="body">${(long ? b.slice(0, 2) : b).map(blockHTML).join("")}</div>
        ${long ? `<a class="more" href="#${esc(p.id)}">Keep reading →</a>` : ""}
      </article>`;
    }).join("");
  }

  function renderPost(i) {
    const p = POSTS[i], newer = POSTS[i - 1], older = POSTS[i + 1];
    document.title = p.title + " · Téa";
    main.innerHTML = `<article class="post single">
        ${meta(p)}
        <h2>${esc(p.title)}</h2>
        ${image(p)}
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

  renderTags();
  route();
})();
