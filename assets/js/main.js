// Main custom JS for portfolio

(function () {
  const root = document.documentElement;

  // Theme toggle -----------------------------------------------------------
  const THEME_KEY = "dbc-portfolio-theme";
  const themeToggle = document.getElementById("themeToggle");

  function applyTheme(theme) {
    if (theme === "light") {
      root.classList.add("theme-light");
    } else {
      root.classList.remove("theme-light");
    }
    updateThemeIcon(theme === "light");
  }

  function updateThemeIcon(isLight) {
    if (!themeToggle) return;
    const icon = themeToggle.querySelector("i");
    if (icon) {
      icon.className = isLight ? "bi bi-moon-stars-fill" : "bi bi-sun-fill";
    }
  }

  function getStoredTheme() {
    try { return localStorage.getItem(THEME_KEY); } catch { return null; }
  }

  function setStoredTheme(theme) {
    try { localStorage.setItem(THEME_KEY, theme); } catch {}
  }

  const initialTheme = getStoredTheme();
  if (initialTheme) applyTheme(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isLight = root.classList.contains("theme-light");
      const nextTheme = isLight ? "dark" : "light";
      applyTheme(nextTheme);
      setStoredTheme(nextTheme);
    });
  }

  // Back to top & navbar scroll state --------------------------------------
  const backToTop = document.getElementById("backToTop");
  const navbar = document.getElementById("mainNav");
  
  function handleScroll() {
    const scrollY = window.scrollY;
    if (backToTop) backToTop.classList.toggle("show", scrollY > 320);
    if (navbar) navbar.classList.toggle("scrolled", scrollY > 50);
  }
  
  window.addEventListener("scroll", handleScroll);
  handleScroll();

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Skills animation -------------------------------------------------------
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
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectItems = document.querySelectorAll(".project-item");

  if (filterButtons.length && projectItems.length) {
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.getAttribute("data-filter");

        filterButtons.forEach((b) => {
          b.classList.remove("active", "btn-neon");
          b.classList.add("btn-outline-neon");
        });
        btn.classList.add("active", "btn-neon");
        btn.classList.remove("btn-outline-neon");

        projectItems.forEach((item) => {
          const year = item.getAttribute("data-year");
          const shouldShow = filter === "all" || year === filter;
          item.classList.toggle("d-none", !shouldShow);
        });
      });
    });
  }

  // Toast notification -----------------------------------------------------
  function showToast(message, type = "success") {
    const existingToast = document.querySelector(".toast-notification");
    if (existingToast) existingToast.remove();

    const toast = document.createElement("div");
    toast.className = `toast-notification ${type}`;
    toast.innerHTML = `<i class="bi ${type === "success" ? "bi-check-circle" : "bi-exclamation-circle"} me-2"></i>${message}`;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = "slideIn 0.3s ease reverse";
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // Contact form validation ------------------------------------------------
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", (event) => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
        form.classList.add("was-validated");
        showToast("Please fill in all required fields correctly.", "error");
        return;
      }
      form.classList.add("was-validated");
    });
  }

  // Smooth scroll ----------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#") return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Nav indicator ----------------------------------------------------------
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-lineup .nav-link");
  const navWrapper = document.querySelector(".nav-lineup-wrapper");

  if (sections.length && navLinks.length && navWrapper) {
    const indicator = document.createElement("span");
    indicator.className = "nav-indicator";
    navWrapper.appendChild(indicator);

    function moveIndicator(link) {
      if (!link) {
        indicator.style.opacity = "0";
        return;
      }
      const linkRect = link.getBoundingClientRect();
      const wrapperRect = navWrapper.getBoundingClientRect();
      indicator.style.opacity = "1";
      indicator.style.left = (linkRect.left - wrapperRect.left) + "px";
      indicator.style.width = linkRect.width + "px";
    }

    function updateActiveNav() {
      const scrollPos = window.scrollY + 100;
      let activeLink = null;

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute("id");

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === "#" + sectionId) {
              link.classList.add("active");
              activeLink = link;
            }
          });
        }
      });
      moveIndicator(activeLink);
    }

    window.addEventListener("scroll", updateActiveNav);
    window.addEventListener("resize", updateActiveNav);
    setTimeout(updateActiveNav, 100);
  }

  // Section scroll animations ----------------------------------------------
  const animatedSections = document.querySelectorAll(".section-padding");
  
  if ("IntersectionObserver" in window && animatedSections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    animatedSections.forEach((section) => sectionObserver.observe(section));
  } else {
    animatedSections.forEach((section) => section.classList.add("in-view"));
  }

  // ========================================================================
  // INTERACTIVE FEATURES
  // ========================================================================

  // Typewriter Effect ------------------------------------------------------
  const typewriterEl = document.getElementById("typewriter");
  if (typewriterEl) {
    const phrases = ["Full-Stack Developer", "Problem Solver", "Team Leader", "Creative Thinker", "Quick Learner"];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function typeWrite() {
      const currentPhrase = phrases[phraseIndex];
      
      if (isDeleting) {
        typewriterEl.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
      } else {
        typewriterEl.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        typeSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500;
      }

      setTimeout(typeWrite, typeSpeed);
    }
    setTimeout(typeWrite, 1000);
  }

  // Animated Counters ------------------------------------------------------
  const counters = document.querySelectorAll(".counter");
  if (counters.length) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const counter = entry.target;
            const target = parseInt(counter.dataset.target);
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
              current += increment;
              if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
              } else {
                counter.textContent = target;
              }
            };
            updateCounter();
            counterObserver.unobserve(counter);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((counter) => counterObserver.observe(counter));
  }

  // Copy to Clipboard ------------------------------------------------------
  const copyButtons = document.querySelectorAll(".copy-btn");
  copyButtons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const textToCopy = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(textToCopy);
        const icon = btn.querySelector("i");
        icon.className = "bi bi-check-lg";
        btn.classList.add("btn-success");
        btn.classList.remove("btn-outline-neon");
        showToast("Copied to clipboard!");
        setTimeout(() => {
          icon.className = "bi bi-clipboard";
          btn.classList.remove("btn-success");
          btn.classList.add("btn-outline-neon");
        }, 2000);
      } catch (err) {
        showToast("Failed to copy", "error");
      }
    });
  });

  // Keyboard Navigation ----------------------------------------------------
  document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    
    const sectionKeys = {
      "1": "#about", "2": "#education", "3": "#projects",
      "4": "#experience", "5": "#skills", "6": "#hobbies",
      "7": "#contact", "0": "#hero"
    };

    if (sectionKeys[e.key]) {
      e.preventDefault();
      const target = document.querySelector(sectionKeys[e.key]);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
        showToast(`Navigating to ${e.key === "0" ? "Home" : "Section " + e.key}`);
      }
    }
  });

  // Hero Parallax Effect ----------------------------------------------------
  const heroSection = document.querySelector(".hero-section");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  
  if (heroSection && !prefersReducedMotion) {
    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * 0.5;
      heroSection.style.setProperty("--parallax-offset", `${rate}px`);
    }, { passive: true });
  }

  // Project Modal Handler --------------------------------------------------
  const projectCards = document.querySelectorAll(".project-card[role='button']");
  const projectModal = document.getElementById("projectModal");
  
  if (projectCards.length && projectModal) {
    const bsModal = new bootstrap.Modal(projectModal);
    
    projectCards.forEach((card) => {
      card.addEventListener("click", () => {
        document.getElementById("pm-title").textContent = card.dataset.title || "";
        document.getElementById("pm-year").textContent = card.dataset.year || "";
        document.getElementById("pm-date").textContent = card.dataset.date || "";
        document.getElementById("pm-desc").textContent = card.dataset.desc || "";
        
        const featuresList = document.getElementById("pm-features");
        featuresList.innerHTML = "";
        (card.dataset.features || "").split("|").filter(f => f).forEach(f => {
          const li = document.createElement("li");
          li.textContent = f;
          featuresList.appendChild(li);
        });
        
        const techContainer = document.getElementById("pm-tech");
        techContainer.innerHTML = "";
        (card.dataset.tech || "").split(",").filter(t => t).forEach(t => {
          const span = document.createElement("span");
          span.className = "meta-pill";
          span.textContent = t;
          techContainer.appendChild(span);
        });
        
        const footer = document.getElementById("pm-footer");
        const existingGithub = footer.querySelector(".github-link");
        if (existingGithub) existingGithub.remove();
        
        if (card.dataset.github) {
          const githubBtn = document.createElement("a");
          githubBtn.href = card.dataset.github;
          githubBtn.target = "_blank";
          githubBtn.className = "btn btn-outline-neon github-link";
          githubBtn.innerHTML = '<i class="bi bi-github me-1"></i>View on GitHub';
          footer.insertBefore(githubBtn, footer.firstChild);
        }
        
        bsModal.show();
      });
      
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          card.click();
        }
      });
    });
  }

})();