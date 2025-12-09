// Main custom JS for portfolio
// Includes: theme toggle, scroll interactions, skills animation, project filters, contact form

(function () {
  const root = document.documentElement;

  // Theme toggle (dark / light) -------------------------------------------
  const THEME_KEY = "dbc-portfolio-theme";
  const themeToggle = document.getElementById("themeToggle");

  function applyTheme(theme) {
    if (theme === "light") {
      root.classList.add("theme-light");
    } else {
      root.classList.remove("theme-light");
    }
    // Update icon to match theme
    updateThemeIcon(theme === "light");
  }

  function updateThemeIcon(isLight) {
    if (!themeToggle) return;
    const icon = themeToggle.querySelector("i");
    if (icon) {
      // Show sun in dark mode (click to go light), moon in light mode (click to go dark)
      icon.className = isLight ? "bi bi-moon-stars-fill" : "bi bi-sun-fill";
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

  // Initialize theme on load
  const initialTheme = getStoredTheme();
  if (initialTheme) {
    applyTheme(initialTheme);
  }

  // Theme toggle click handler
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isLight = root.classList.contains("theme-light");
      const nextTheme = isLight ? "dark" : "light";
      applyTheme(nextTheme);
      setStoredTheme(nextTheme);
    });
  }

  // Back to top button & navbar scroll state --------------------------------
  const backToTop = document.getElementById("backToTop");
  const navbar = document.getElementById("mainNav");
  
  function handleScroll() {
    const scrollY = window.scrollY;
    
    // Back to top visibility
    if (backToTop) {
      backToTop.classList.toggle("show", scrollY > 320);
    }
    
    // Navbar background on scroll
    if (navbar) {
      navbar.classList.toggle("scrolled", scrollY > 50);
    }
  }
  
  window.addEventListener("scroll", handleScroll);
  handleScroll(); // Initial call

  if (backToTop) {
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

        // Update active state
        filterButtons.forEach((b) => {
          b.classList.remove("active");
          b.setAttribute("aria-selected", "false");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-selected", "true");

        // Filter projects with animation
        projectItems.forEach((item) => {
          const year = item.getAttribute("data-year");
          const shouldShow = filter === "all" || year === filter;
          
          if (shouldShow) {
            item.classList.remove("d-none");
            item.style.opacity = "0";
            item.style.transform = "translateY(10px)";
            requestAnimationFrame(() => {
              item.style.transition = "opacity 0.3s ease, transform 0.3s ease";
              item.style.opacity = "1";
              item.style.transform = "translateY(0)";
            });
          } else {
            item.style.opacity = "0";
            item.style.transform = "translateY(10px)";
            setTimeout(() => {
              item.classList.add("d-none");
            }, 300);
          }
        });
      });
    });

    // Add ARIA attributes for accessibility
    filterButtons.forEach((btn, index) => {
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", btn.classList.contains("active") ? "true" : "false");
    });
  }

  // Toast notification helper ----------------------------------------------
  function showToast(message, type = "success") {
    // Remove any existing toast
    const existingToast = document.querySelector(".toast-notification");
    if (existingToast) {
      existingToast.remove();
    }

    // Create toast element
    const toast = document.createElement("div");
    toast.className = `toast-notification ${type}`;
    toast.innerHTML = `
      <i class="bi ${type === "success" ? "bi-check-circle" : "bi-exclamation-circle"} me-2"></i>
      ${message}
    `;
    document.body.appendChild(toast);

    // Remove after 4 seconds
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
      // Form is valid - let it submit to Formspree
      form.classList.add("was-validated");
    });

    // Real-time validation feedback
    const inputs = form.querySelectorAll("input, textarea");
    inputs.forEach((input) => {
      input.addEventListener("blur", () => {
        if (form.classList.contains("was-validated")) {
          input.classList.toggle("is-invalid", !input.checkValidity());
          input.classList.toggle("is-valid", input.checkValidity());
        }
      });
    });
  }

  // Footer year ------------------------------------------------------------
  const yearSpan = document.getElementById("currentYear");
  if (yearSpan) {
    yearSpan.textContent = String(new Date().getFullYear());
  }

  // Smooth scroll for anchor links -----------------------------------------
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

  // Navbar active state on scroll with sliding indicator ----------------------
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-lineup .nav-link");
  const navWrapper = document.querySelector(".nav-lineup-wrapper");

  if (sections.length && navLinks.length && navWrapper) {
    // Create sliding indicator and append to wrapper
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
    
    // Initial call after small delay to ensure layout is ready
    setTimeout(updateActiveNav, 100);
  }

  // Project cards keyboard interaction -------------------------------------
  const projectCards = document.querySelectorAll(".project-card[tabindex='0']");
  projectCards.forEach((card) => {
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        card.click(); // Trigger modal
      }
    });
  });

  // Section scroll animations -----------------------------------------------
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
      {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
      }
    );

    animatedSections.forEach((section) => {
      sectionObserver.observe(section);
    });
  } else {
    // Fallback: just show everything
    animatedSections.forEach((section) => {
      section.classList.add("in-view");
    });
  }

  // =========================================================================
  // INTERACTIVE FEATURES
  // =========================================================================

  // 1. Dynamic Greeting based on time of day --------------------------------
  const greetingEl = document.getElementById("greeting");
  if (greetingEl) {
    const hour = new Date().getHours();
    let greeting = "Hello";
    if (hour >= 5 && hour < 12) greeting = "Good morning";
    else if (hour >= 12 && hour < 18) greeting = "Good afternoon";
    else if (hour >= 18 && hour < 22) greeting = "Good evening";
    else greeting = "Good night";
    greetingEl.textContent = greeting;
  }

  // 2. Typewriter Effect ----------------------------------------------------
  const typewriterEl = document.getElementById("typewriter");
  if (typewriterEl) {
    const phrases = [
      "Full-Stack Developer",
      "Problem Solver",
      "Team Leader",
      "Creative Thinker",
      "Quick Learner"
    ];
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
        // Pause at end of phrase
        typeSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500;
      }

      setTimeout(typeWrite, typeSpeed);
    }

    // Start after a short delay
    setTimeout(typeWrite, 1000);
  }

  // 3. Animated Counters ----------------------------------------------------
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

  // 4. Copy to Clipboard ----------------------------------------------------
  const copyButtons = document.querySelectorAll(".copy-btn");
  copyButtons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const textToCopy = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(textToCopy);
        // Change icon to checkmark
        const icon = btn.querySelector("i");
        icon.className = "bi bi-check-lg";
        btn.classList.add("btn-success");
        btn.classList.remove("btn-outline-neon");
        
        // Show toast
        showToast("Copied to clipboard!");
        
        // Reset after 2 seconds
        setTimeout(() => {
          icon.className = "bi bi-clipboard";
          btn.classList.remove("btn-success");
          btn.classList.add("btn-outline-neon");
        }, 2000);
      } catch (err) {
        showToast("Failed to copy", true);
      }
    });
  });

  // 5. Keyboard Navigation --------------------------------------------------
  document.addEventListener("keydown", (e) => {
    // Only if not typing in an input
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    
    const sectionKeys = {
      "1": "#about",
      "2": "#education",
      "3": "#projects",
      "4": "#experience",
      "5": "#skills",
      "6": "#hobbies",
      "7": "#contact",
      "0": "#hero"
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

  // 7. Theme Toggle Celebration (subtle) ------------------------------------
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      // Add a subtle animation
      document.body.style.transition = "background 0.5s ease";
    });
  }

})();