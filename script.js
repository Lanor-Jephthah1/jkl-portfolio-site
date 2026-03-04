const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

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
        link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
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
}

function initConstellation() {
  const canvas = document.getElementById("constellation");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = 0;
  let height = 0;
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
      ctx.fillStyle = "rgba(160, 196, 255, 0.48)";
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
        ctx.strokeStyle = `rgba(116, 174, 255, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener("resize", resize);
}

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  initConstellation();
}
