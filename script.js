(() => {
  const POSTS = window.POSTS || [];
  const $ = (id) => document.getElementById(id);
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------- little helpers ---------- */
  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const roman = (n) => {
    const t = [[1000, "m"], [900, "cm"], [500, "d"], [400, "cd"], [100, "c"], [90, "xc"], [50, "l"], [40, "xl"], [10, "x"], [9, "ix"], [5, "v"], [4, "iv"], [1, "i"]];
    let out = "";
    for (const [v, s] of t) while (n >= v) { out += s; n -= v; }
    return out;
  };
  const prettyDate = (iso) => {
    if (!iso) return "";
    const [y, m, d] = iso.split("-").map(Number);
    return `the ${d}${[, "st", "nd", "rd"][d % 10 > 3 || (d > 10 && d < 14) ? 0 : d % 10] || "th"} of ${MONTHS[m - 1]}, ${roman(y).toUpperCase()}`;
  };
  const shortDate = (iso) => (iso ? iso.slice(5).replace("-", ".") + "." + iso.slice(2, 4) : "");

  /* ---------- pictures, drawn in code ---------- */
  let uid = 0;
  const rnd = (seed) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const dust = (r, n, w, h) => {
    let s = "";
    for (let i = 0; i < n; i++) s += `<circle cx="${(r() * w).toFixed(1)}" cy="${(r() * h).toFixed(1)}" r="${(r() * 1.3 + 0.3).toFixed(2)}" fill="#fff" opacity="${(r() * 0.7 + 0.2).toFixed(2)}"/>`;
    return s;
  };
  const four = (x, y, s, fill = "#fff") =>
    `<path transform="translate(${x} ${y}) scale(${s})" d="M0-10C1-3 3-1 10 0 3 1 1 3 0 10-1 3-3 1-10 0-3-1-1-3 0-10Z" fill="${fill}"/>`;

  const ART = {
    moon(k) {
      const r = rnd(11);
      return `<svg viewBox="0 0 300 360" role="img" aria-label="A crescent moon over dark hills">
        <defs><linearGradient id="a${k}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b2140"/><stop offset=".6" stop-color="#4a4f86"/><stop offset="1" stop-color="#c9a3c9"/></linearGradient>
        <radialGradient id="b${k}"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
        <mask id="c${k}"><rect width="300" height="360" fill="#fff"/><circle cx="172" cy="118" r="50"/></mask></defs>
        <rect width="300" height="360" fill="url(#a${k})"/>${dust(r, 60, 300, 240)}
        <circle cx="150" cy="130" r="110" fill="url(#b${k})"/>
        <circle cx="150" cy="130" r="56" fill="#fdf6e3" mask="url(#c${k})"/>
        ${four(226, 70, 1.3)}${four(62, 190, 0.8, "#ffc9ea")}${four(250, 200, 0.6)}
        <path d="M0 300Q70 250 140 290T300 270V360H0Z" fill="#232848"/><path d="M0 330Q90 290 170 325T300 310V360H0Z" fill="#14172b"/>
      </svg>`;
    },
    constellation(k) {
      const r = rnd(29);
      const pts = [[50, 210], [95, 140], [150, 165], [190, 95], [245, 120], [215, 190], [150, 165]];
      return `<svg viewBox="0 0 300 280" role="img" aria-label="A chalk-drawn constellation">
        <defs><linearGradient id="a${k}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3a414e"/><stop offset="1" stop-color="#1d2128"/></linearGradient></defs>
        <rect width="300" height="280" fill="url(#a${k})"/>${dust(r, 45, 300, 280)}
        <polyline points="${pts.map((p) => p.join(",")).join(" ")}" fill="none" stroke="#ece8de" stroke-width="1.4" stroke-dasharray="2 5" stroke-linecap="round" opacity=".8"/>
        ${pts.slice(0, 6).map((p, i) => four(p[0], p[1], i % 2 ? 0.9 : 1.3, i === 3 ? "#ffc9ea" : "#fff")).join("")}
        <text x="150" y="252" text-anchor="middle" font-family="IM Fell English, Georgia, serif" font-style="italic" font-size="17" fill="#ece8de" opacity=".85">Stella Theae</text>
      </svg>`;
    },
    comet(k) {
      const r = rnd(53);
      return `<svg viewBox="0 0 300 220" role="img" aria-label="A comet crossing the sky">
        <defs><linearGradient id="a${k}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2a1f4a"/><stop offset="1" stop-color="#17203d"/></linearGradient>
        <linearGradient id="b${k}" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#ff9fd6" stop-opacity="0"/><stop offset=".7" stop-color="#aab6ff" stop-opacity=".7"/><stop offset="1" stop-color="#fff"/></linearGradient></defs>
        <rect width="300" height="220" fill="url(#a${k})"/>${dust(r, 55, 300, 220)}
        <path d="M30 190Q130 150 226 62L218 54Q120 130 30 190Z" fill="url(#b${k})"/>
        ${four(224, 58, 2.2)}${four(70, 50, 0.8, "#ffc9ea")}${four(262, 160, 0.7)}
      </svg>`;
    },
    star(k) {
      const p = [];
      for (let i = 0; i < 10; i++) {
        const a = (Math.PI / 5) * i - Math.PI / 2, rad = i % 2 ? 44 : 100;
        p.push((150 + Math.cos(a) * rad).toFixed(1) + "," + (155 + Math.sin(a) * rad).toFixed(1));
      }
      return `<svg viewBox="0 0 300 300" role="img" aria-label="A chrome star">
        <defs><linearGradient id="a${k}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffb8e2"/><stop offset=".5" stop-color="#cdb4f5"/><stop offset="1" stop-color="#aab6ff"/></linearGradient>
        <linearGradient id="b${k}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".42" stop-color="#b9c1ee"/><stop offset=".5" stop-color="#4b5285"/><stop offset=".58" stop-color="#f1ecff"/><stop offset="1" stop-color="#e3a7d6"/></linearGradient>
        <pattern id="c${k}" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="12" cy="12" r="1.6" fill="#fff" opacity=".6"/></pattern></defs>
        <rect width="300" height="300" fill="url(#a${k})"/><rect width="300" height="300" fill="url(#c${k})"/>
        <polygon points="${p.join(" ")}" fill="url(#b${k})" stroke="#fff" stroke-width="3" stroke-linejoin="round"/>
        <ellipse cx="118" cy="112" rx="20" ry="7" transform="rotate(-35 118 112)" fill="#fff" opacity=".8"/>
        ${four(238, 58, 1.8)}${four(52, 232, 1.3)}${four(250, 240, 0.8)}
      </svg>`;
    },
    rose(k) {
      let petals = "";
      for (let ring = 0; ring < 3; ring++) {
        const n = 6 + ring * 2, rad = 20 + ring * 24;
        for (let i = 0; i < n; i++) {
          const a = (360 / n) * i + ring * 18;
          petals += `<ellipse cx="150" cy="${130 - rad}" rx="${15 + ring * 4}" ry="${21 + ring * 5}" transform="rotate(${a} 150 130)" fill="${["#c93c5e", "#a3243f", "#7c1a31"][ring]}" stroke="#eadfc6" stroke-width=".8" opacity=".93"/>`;
        }
      }
      return `<svg viewBox="0 0 300 260" role="img" aria-label="An illuminated rose">
        <defs><radialGradient id="a${k}"><stop offset="0" stop-color="#3b4152"/><stop offset="1" stop-color="#1b1e26"/></radialGradient></defs>
        <rect width="300" height="260" fill="url(#a${k})"/>
        <rect x="10" y="10" width="280" height="240" fill="none" stroke="#d9b65a" stroke-width="1.5"/><rect x="16" y="16" width="268" height="228" fill="none" stroke="#d9b65a" stroke-width=".6"/>
        <g>${petals.split("/>").reverse().join("/>").replace(/^\/>/, "") + "/>"}</g>
        <circle cx="150" cy="130" r="9" fill="#d9b65a"/>
        ${four(40, 40, 1, "#d9b65a")}${four(260, 40, 1, "#d9b65a")}${four(40, 220, 1, "#d9b65a")}${four(260, 220, 1, "#d9b65a")}
      </svg>`;
    }
  };
  const picture = (p) => {
    if (p.image) return `<img src="${esc(p.image)}" alt="${esc(p.title || "")}" style="display:block;width:100%;height:auto;border-radius:13px 13px 0 0">`;
    return ART[p.art] ? ART[p.art](++uid) : "";
  };

  /* ---------- body text → html ---------- */
  const bodyHTML = (raw) =>
    String(raw || "").trim().split(/\n\s*\n/).map((block) => {
      block = block.trim();
      if (block.startsWith("<")) return block;
      if (block.startsWith(">")) return `<blockquote>${block.replace(/^>\s?/gm, "")}</blockquote>`;
      return `<p>${block}</p>`;
    }).join("");
  const excerpt = (raw) => {
    const first = String(raw || "").trim().split(/\n\s*\n/)[0].replace(/<[^>]+>/g, "");
    return first.length > 150 ? first.slice(0, first.lastIndexOf(" ", 150)) + "…" : first;
  };

  /* ---------- the board ---------- */
  const board = $("board"), tagsEl = $("tags");
  let filter = "all";
  const entries = POSTS.filter((p) => p.kind === "entry");

  function card(p, i) {
    const tilt = (((i * 37) % 5) - 2) * 0.6;
    const open = `class="card ${p.kind}" style="--tilt:${tilt}deg;--i:${i}" data-id="${esc(p.id)}"`;
    if (p.kind === "quote")
      return `<div ${open.replace('class="card', 'tabindex="-1" class="card')}><blockquote>${esc(p.text).replace(/ \/ /g, "<br>")}</blockquote><cite>— ${esc(p.by)}</cite></div>`;
    if (p.kind === "pin")
      return `<div ${open}>${picture(p)}<div class="cap"><div class="meta"><span>${esc(p.tag)}</span><span>${shortDate(p.date)}</span></div><h3>${esc(p.title)}</h3></div></div>`;
    return `<button ${open}><div class="meta"><span>${esc(p.tag)}</span><span>${shortDate(p.date)}</span></div><h3>${esc(p.title)}</h3><p>${esc(excerpt(p.body))}</p><span class="more">turn the page ☞</span></button>`;
  }

  function render() {
    const list = POSTS.filter((p) => filter === "all" || p.tag === filter);
    board.innerHTML = list.length ? list.map(card).join("") : `<p class="empty">Nothing written here yet. The page waits.</p>`;
  }

  function renderTags() {
    const tags = ["all", ...new Set(POSTS.map((p) => p.tag).filter(Boolean))];
    tagsEl.innerHTML = tags.map((t) => `<button aria-pressed="${t === filter}" data-tag="${esc(t)}">${t === filter ? "★" : "☆"} ${esc(t)}</button>`).join("");
  }

  tagsEl.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    filter = b.dataset.tag;
    renderTags();
    render();
  });

  board.addEventListener("click", (e) => {
    const c = e.target.closest(".card.entry");
    if (c) location.hash = c.dataset.id;
  });

  /* ---------- the open leaf ---------- */
  const veil = $("veil"), folio = $("folio");
  let lastFocus = null;

  function show(id) {
    const idx = entries.findIndex((p) => p.id === id);
    if (idx < 0) return hide();
    const p = entries[idx];
    const leaf = entries.length - idx; // oldest entry is leaf i
    $("folio-tag").textContent = "✦ " + (p.tag || "");
    $("folio-num").textContent = "fol. " + roman(leaf);
    $("folio-title").textContent = p.title;
    $("folio-date").textContent = "Written " + prettyDate(p.date);
    $("folio-art").innerHTML = p.image ? `<img src="${esc(p.image)}" alt="" style="display:block;width:100%;margin-bottom:24px">` : picture(p);
    $("folio-body").innerHTML = bodyHTML(p.body);
    $("prev").disabled = idx === entries.length - 1;
    $("next").disabled = idx === 0;
    $("prev").onclick = () => (location.hash = entries[idx + 1].id);
    $("next").onclick = () => (location.hash = entries[idx - 1].id);
    if (veil.hidden) lastFocus = document.activeElement;
    veil.hidden = false;
    document.body.style.overflow = "hidden";
    veil.scrollTop = 0;
    folio.focus();
    document.title = p.title + " ✦ Téa";
  }
  function hide() {
    if (veil.hidden) return;
    veil.hidden = true;
    document.body.style.overflow = "";
    document.title = "Téa ✦ a codex of stars";
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
  }
  const closeLeaf = () => history.pushState("", "", location.pathname + location.search) || hide();

  $("close").addEventListener("click", closeLeaf);
  veil.addEventListener("click", (e) => e.target === veil && closeLeaf());
  addEventListener("keydown", (e) => {
    if (veil.hidden) return;
    if (e.key === "Escape") closeLeaf();
    if (e.key === "ArrowLeft" && !$("prev").disabled) $("prev").click();
    if (e.key === "ArrowRight" && !$("next").disabled) $("next").click();
  });
  const route = () => (location.hash.length > 1 ? show(decodeURIComponent(location.hash.slice(1))) : hide());
  addEventListener("hashchange", route);
  addEventListener("popstate", route);

  /* ---------- visitor counter (lives in this browser only) ---------- */
  let hits = 1;
  try {
    hits = (parseInt(localStorage.getItem("tea-hits"), 10) || 0) + 1;
    localStorage.setItem("tea-hits", hits);
  } catch (_) {}
  document.querySelectorAll(".hits").forEach((el) => (el.textContent = String(hits).padStart(6, "0")));

  /* ---------- the sky ---------- */
  const sky = $("sky"), ctx = sky.getContext("2d");
  let stars = [];
  function sizeSky() {
    const d = Math.min(devicePixelRatio || 1, 2);
    sky.width = innerWidth * d;
    sky.height = innerHeight * d;
    ctx.setTransform(d, 0, 0, d, 0, 0);
    const n = Math.round((innerWidth * innerHeight) / 9000);
    stars = Array.from({ length: n }, () => ({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      r: Math.random() * 1.2 + 0.3,
      p: Math.random() * 6.28,
      s: Math.random() * 0.0015 + 0.0004,
      big: Math.random() < 0.06,
      hue: Math.random() < 0.2 ? "255,190,230" : Math.random() < 0.3 ? "180,190,255" : "255,255,255"
    }));
  }
  function drawSky(t) {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (const s of stars) {
      const a = calm ? 0.6 : 0.25 + 0.6 * (0.5 + 0.5 * Math.sin(s.p + t * s.s));
      ctx.fillStyle = `rgba(${s.hue},${a.toFixed(3)})`;
      if (s.big) {
        const k = 5 * (0.6 + a * 0.6);
        ctx.beginPath();
        ctx.moveTo(s.x, s.y - k);
        ctx.quadraticCurveTo(s.x, s.y, s.x + k, s.y);
        ctx.quadraticCurveTo(s.x, s.y, s.x, s.y + k);
        ctx.quadraticCurveTo(s.x, s.y, s.x - k, s.y);
        ctx.quadraticCurveTo(s.x, s.y, s.x, s.y - k);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, 6.28);
        ctx.fill();
      }
    }
    if (!calm) requestAnimationFrame(drawSky);
  }
  sizeSky();
  addEventListener("resize", () => { sizeSky(); if (calm) drawSky(0); });
  requestAnimationFrame(drawSky);

  /* ---------- cursor sparkles ---------- */
  if (!calm && matchMedia("(pointer: fine)").matches) {
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
  render();
  route();
})();
