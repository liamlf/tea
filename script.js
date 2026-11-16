(async () => {
  const main = document.getElementById("main");
  const tagsEl = document.getElementById("tags");
  const SITE = "Aurora Hate Kid";
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

  // songs are stored as "track/abc123"; anything else is ignored
  const songPlayers = (p) =>
    (p.songs || []).filter((s) => /^(track|album|playlist|episode|show)\/[A-Za-z0-9]+$/.test(s)).map((s) =>
      `<iframe class="song" src="https://open.spotify.com/embed/${s}" height="${/^(track|episode)\//.test(s) ? 80 : 352}" loading="lazy" title="Spotify player" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>`).join("");

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
        ${songPlayers(p)}
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
        ${songPlayers(p)}
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
    drawForest(r);
  }

  /* a forest at night along the bottom: far rows paler and misty, near rows almost black */
  function drawForest(r) {
    const W = innerWidth, H = innerHeight;
    const scale = Math.min(H, W * 1.1); // keeps trees sensible on very wide or very tall screens
    const rows = [
      { base: 0.83, tall: 0.12, color: "#263439" },
      { base: 0.88, tall: 0.15, color: "#19262a" },
      { base: 0.94, tall: 0.19, color: "#0f1a19" },
      { base: 1.02, tall: 0.24, color: "#070e0c" }
    ];

    // spruce: many narrow, slightly ragged tiers
    const pine = (x, y, h) => {
      const tiers = 8 + ((r() * 4) | 0), w = h * (0.24 + r() * 0.08);
      ctx.fillRect(x - h * 0.015, y - h * 0.12, h * 0.03, h * 0.14);
      for (let t = 0; t < tiers; t++) {
        const k = t / tiers;
        const bottom = y - h * 0.08 - h * k * 0.8;
        const half = w * (1 - k) * 0.5 * (0.85 + r() * 0.3) + h * 0.01;
        ctx.beginPath();
        ctx.moveTo(x, bottom - h * 0.2);
        ctx.lineTo(x + half, bottom + h * 0.015);
        ctx.lineTo(x - half, bottom + h * 0.015);
        ctx.closePath();
        ctx.fill();
      }
    };

    // broadleaf: a full, lumpy crown
    const leafy = (x, y, h) => {
      const cr = h * 0.27, cy = y - h * 0.6;
      ctx.fillRect(x - h * 0.025, y - h * 0.45, h * 0.05, h * 0.47);
      for (let i = 0; i < 11; i++) {
        const a = r() * 6.28, dist = r() * cr * 0.8;
        ctx.beginPath();
        ctx.arc(x + Math.cos(a) * dist * 1.3, cy + Math.sin(a) * dist * 0.75, cr * (0.4 + r() * 0.35), 0, 6.28);
        ctx.fill();
      }
    };

    rows.forEach((row, i) => {
      const baseY = row.base * H, maxH = row.tall * scale;
      ctx.fillStyle = row.color;
      ctx.fillRect(0, baseY - maxH * 0.15, W, H);
      for (let x = -maxH * 0.3; x < W + maxH * 0.3; x += maxH * (0.08 + r() * 0.12)) {
        const h = maxH * (0.6 + r() * 0.5), y = baseY + (r() - 0.5) * maxH * 0.08;
        r() < 0.62 ? pine(x, y, h) : leafy(x, y, h);
      }
      if (i < rows.length - 1) { // mist rising in front of every row but the nearest
        const g = ctx.createLinearGradient(0, baseY - maxH * 0.6, 0, baseY);
        g.addColorStop(0, "rgba(150,165,200,0)");
        g.addColorStop(1, "rgba(150,165,200,0.10)");
        ctx.fillStyle = g;
        ctx.fillRect(0, baseY - maxH * 0.6, W, H);
      }
    });

    // a few fireflies in the near trees, kept well apart so no two read as a pair of eyes
    const flies = [], want = Math.max(3, Math.round(W / 150));
    for (let tries = 0; flies.length < want && tries < 200; tries++) {
      const fx = r() * W, fy = H * (0.86 + r() * 0.12);
      if (flies.every(([x, y]) => Math.hypot(x - fx, y - fy) > 110)) flies.push([fx, fy]);
    }
    for (const [fx, fy] of flies) {
      const fr = 3 + r() * 3;
      const g = ctx.createRadialGradient(fx, fy, 0, fx, fy, fr);
      g.addColorStop(0, "rgba(232,255,170,0.85)");
      g.addColorStop(0.25, "rgba(210,255,140,0.35)");
      g.addColorStop(1, "rgba(210,255,140,0)");
      ctx.fillStyle = g;
      ctx.fillRect(fx - fr, fy - fr, fr * 2, fr * 2);
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
