const GITHUB_USERNAME = "Lanor-Jephthah1";
const CLICK_STORE_KEY = "jkl_portfolio_clicks_v1";
const COUNTAPI_NAMESPACE = "lanor-jephthah1-portfolio";
const COUNTAPI_TOTAL_KEY = "total_clicks";

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const progressEl = document.getElementById("scroll-progress");
function updateScrollProgress() {
  if (!progressEl) return;
  const scrollTop = window.scrollY;
  const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollRange > 0 ? Math.min(scrollTop / scrollRange, 1) : 0;
  progressEl.style.transform = `scaleX(${ratio})`;
}
window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress);
updateScrollProgress();

const reveals = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
    });
  },
  { threshold: 0.15 }
);

reveals.forEach((el, idx) => {
  el.style.transitionDelay = `${Math.min(360, idx * 100)}ms`;
  revealObserver.observe(el);
});

function animateCount(el) {
  const target = Number(el.dataset.count || "0");
  const duration = 1200;
  const start = performance.now();

  function tick(now) {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.floor(target * eased).toString();
    if (t < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCount(entry.target);
      statObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.45 }
);

document.querySelectorAll("[data-count]").forEach((el) => statObserver.observe(el));

const desktopLinks = [...document.querySelectorAll(".desktop-nav a")];
const sections = [...document.querySelectorAll("main section[id]")];
const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute("id");
      desktopLinks.forEach((link) => {
        const href = link.getAttribute("href") || "";
        link.classList.toggle("is-active", href === `#${id}`);
      });
    });
  },
  { threshold: 0.52 }
);
sections.forEach((section) => navObserver.observe(section));

const roleEl = document.getElementById("typed-role");
const rolePhrases = [
  "for teams that value clean execution.",
  "across web, data, and automation systems.",
  "with production-minded engineering discipline.",
  "that move from idea to shipped product."
];

if (roleEl) {
  let phrase = 0;
  let char = 0;
  let deleting = false;

  function typeLoop() {
    const current = rolePhrases[phrase];
    roleEl.textContent = deleting ? current.slice(0, char--) : current.slice(0, char++);

    if (!deleting && char === current.length + 1) {
      deleting = true;
      setTimeout(typeLoop, 1200);
      return;
    }

    if (deleting && char < 0) {
      deleting = false;
      phrase = (phrase + 1) % rolePhrases.length;
      setTimeout(typeLoop, 220);
      return;
    }

    setTimeout(typeLoop, deleting ? 26 : 46);
  }

  typeLoop();
}

const spotlightCards = document.querySelectorAll(".spotlight-card");
spotlightCards.forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    card.style.setProperty("--my", `${event.clientY - rect.top}px`);
  });
});

const magneticButtons = document.querySelectorAll(".magnetic");
if (window.matchMedia("(min-width: 901px)").matches) {
  magneticButtons.forEach((btn) => {
    btn.addEventListener("mousemove", (event) => {
      const rect = btn.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      btn.style.transform = `translate(${x * 8}px, ${y * 6}px)`;
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
    });
  });
}

const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    const open = mobileMenu.classList.toggle("open");
    menuToggle.classList.toggle("is-open", open);
    menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    mobileMenu.setAttribute("aria-hidden", open ? "false" : "true");
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      menuToggle.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      mobileMenu.setAttribute("aria-hidden", "true");
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) {
      mobileMenu.classList.remove("open");
      menuToggle.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      mobileMenu.setAttribute("aria-hidden", "true");
    }
  });
}

function setBadgeText(id, value) {
  const node = document.getElementById(id);
  if (node) node.textContent = String(value);
}

function formatMonthYear(isoDate) {
  if (!isoDate) return "Recent";
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "Recent";
  return date.toLocaleDateString(undefined, { month: "short", year: "numeric" });
}

async function loadGitHubProof() {
  try {
    const [userResp, reposResp] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`)
    ]);

    if (!userResp.ok || !reposResp.ok) return;

    const user = await userResp.json();
    const repos = await reposResp.json();
    if (!Array.isArray(repos)) return;

    const repoCount = Number(user.public_repos || repos.length || 0);
    const stars = repos.reduce((sum, repo) => sum + Number(repo.stargazers_count || 0), 0);

    const languageTally = {};
    repos.forEach((repo) => {
      if (!repo.language) return;
      languageTally[repo.language] = (languageTally[repo.language] || 0) + 1;
    });

    const topLanguage = Object.entries(languageTally)
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => name)[0] || "Python";

    const latest = repos
      .map((repo) => repo.pushed_at)
      .filter(Boolean)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0];

    setBadgeText("badge-repos", repoCount);
    setBadgeText("badge-stars", stars);
    setBadgeText("badge-language", topLanguage);
    setBadgeText("badge-updated", formatMonthYear(latest));
  } catch (_error) {
    // Keep fallback values if network call fails.
  }
}

function loadClickStore() {
  try {
    const raw = localStorage.getItem(CLICK_STORE_KEY);
    if (!raw) return { total: 0 };
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : { total: 0 };
  } catch (_error) {
    return { total: 0 };
  }
}

function saveClickStore(store) {
  try {
    localStorage.setItem(CLICK_STORE_KEY, JSON.stringify(store));
  } catch (_error) {
    // Ignore storage failures.
  }
}

function bumpRemoteTotal() {
  fetch(`https://api.countapi.xyz/hit/${COUNTAPI_NAMESPACE}/${COUNTAPI_TOTAL_KEY}`, {
    method: "GET",
    mode: "cors",
    keepalive: true,
    cache: "no-store"
  }).catch(() => undefined);
}

function incrementTrackedClicks(trackName) {
  const store = loadClickStore();
  store.total = Number(store.total || 0) + 1;
  store[trackName] = Number(store[trackName] || 0) + 1;
  saveClickStore(store);
  setBadgeText("badge-clicks", store.total);
  bumpRemoteTotal();
}

function hydrateTrackedClicks() {
  const store = loadClickStore();
  setBadgeText("badge-clicks", Number(store.total || 0));

  fetch(`https://api.countapi.xyz/get/${COUNTAPI_NAMESPACE}/${COUNTAPI_TOTAL_KEY}`, {
    method: "GET",
    mode: "cors",
    cache: "no-store"
  })
    .then((resp) => (resp.ok ? resp.json() : null))
    .then((payload) => {
      if (!payload || typeof payload.value !== "number") return;
      const local = Number(store.total || 0);
      const merged = Math.max(local, payload.value);
      if (merged !== local) {
        store.total = merged;
        saveClickStore(store);
      }
      setBadgeText("badge-clicks", merged);
    })
    .catch(() => undefined);
}

const trackables = document.querySelectorAll("[data-track]");
trackables.forEach((node) => {
  node.addEventListener("click", () => {
    const trackName = node.getAttribute("data-track") || "unknown";
    incrementTrackedClicks(trackName);
  });
});

function initConstellation() {
  const canvas = document.getElementById("constellation");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let rafId = 0;
  const points = [];

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * window.devicePixelRatio);
    canvas.height = Math.floor(height * window.devicePixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);

    points.length = 0;
    const count = Math.max(36, Math.floor(width / 34));
    for (let i = 0; i < count; i += 1) {
      points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < points.length; i += 1) {
      const p = points[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(243, 178, 74, 0.45)";
      ctx.fill();

      for (let j = i + 1; j < points.length; j += 1) {
        const q = points[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 110) continue;

        const alpha = (1 - dist / 110) * 0.22;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = `rgba(243, 178, 74, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    rafId = requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener("resize", resize);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
      return;
    }
    rafId = requestAnimationFrame(draw);
  });
}

loadGitHubProof();
hydrateTrackedClicks();

if (!prefersReducedMotion) {
  initConstellation();
}
