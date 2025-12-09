// Main custom JS for portfolio
// Includes: theme toggle, scroll interactions, skills animation, project filters, contact form demo

(function () {
  const root = document.documentElement;

  // Theme toggle (dark / light) -------------------------------------------
  const THEME_KEY = "dbc-portfolio-theme";

  function applyTheme(theme) {
    if (theme === "light") {
      root.classList.add("theme-light");
    } else {
      root.classList.remove("theme-light");
    }
  }

  function getStoredTheme() {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch {
      return null;
    }
  }

  function setStoredTheme(theme) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // ignore storage errors
    }
  }

  const initialTheme = getStoredTheme();
  if (initialTheme) {
    applyTheme(initialTheme);
  }

  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isLight = root.classList.contains("theme-light");
      const nextTheme = isLight ? "dark" : "light";
      applyTheme(nextTheme);
      setStoredTheme(nextTheme);
      const icon = themeToggle.querySelector("i");
      if (icon) {
        icon.className = isLight ? "bi bi-moon-stars-fill" : "bi bi-sun-fill";
      }
    });
  }

  // Back to top button -----------------------------------------------------
  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    window.addEventListener("scroll", () => {
      const show = window.scrollY > 320;
      backToTop.classList.toggle("show", show);
    });

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Skills telemetry (animate on scroll) ----------------------------------
  const skillBars = document.querySelectorAll(".skill-bar");
  if (skillBars.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const level = el.getAttribute("data-level") || "0";
            el.style.setProperty("--skill-level", `${level}%`);
            el.classList.add("visible");
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.4 }
    );

    skillBars.forEach((bar) => observer.observe(bar));
  }

  // Project filter buttons -------------------------------------------------
  const filterButtons = document.querySelectorAll(".filter-pills .pill");
  const projectItems = document.querySelectorAll(".project-item");

  if (filterButtons.length && projectItems.length) {
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.getAttribute("data-filter");

        filterButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        projectItems.forEach((item) => {
          const year = item.getAttribute("data-year");
          const shouldShow = filter === "all" || year === filter;
          item.classList.toggle("d-none", !shouldShow);
        });
      });
    });
  }

  // Contact form demo validation ------------------------------------------
  const form = document.getElementById("contactForm");
  if (form) {
    const alertBox = document.getElementById("contactAlert");

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
      }

      form.classList.remove("was-validated");
      if (alertBox) {
        alertBox.classList.remove("d-none");
        alertBox.focus();
      }
    });
  }

  // Footer year ------------------------------------------------------------
  const yearSpan = document.getElementById("currentYear");
  if (yearSpan) {
    yearSpan.textContent = String(new Date().getFullYear());
  }
})();


