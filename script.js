(() => {
  // Set current copyright year
  const yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // Mobile navigation toggle
  const navToggle = document.querySelector(".nav-toggle");
  const primaryNav = document.getElementById("primary-nav");

  if (navToggle && primaryNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = primaryNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    primaryNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        primaryNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Lightbox for team gallery images
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxClose = document.getElementById("lightbox-close");

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.style.overflow = "";
  };

  document.querySelectorAll("[data-lightbox-src]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      if (!lightbox || !lightboxImg || !lightboxCaption) return;
      lightboxImg.src = trigger.getAttribute("data-lightbox-src") || "";
      lightboxImg.alt = trigger.getAttribute("data-lightbox-caption") || "";
      lightboxCaption.textContent = trigger.getAttribute("data-lightbox-caption") || "";
      lightbox.hidden = false;
      document.body.style.overflow = "hidden";
      if (lightboxClose) lightboxClose.focus();
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox && !lightbox.hidden) {
      closeLightbox();
    }
  });

  // Form submission handler: supports Formspree/Web3Forms (via data-endpoint) or Netlify Forms
  const form = document.getElementById("contact-form");
  const statusEl = document.getElementById("form-status");

  if (form && statusEl) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      statusEl.classList.remove("is-error");

      const endpoint = (form.getAttribute("data-endpoint") || "").trim();
      const isLocal =
        window.location.protocol === "file:" ||
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";

      if (isLocal && !endpoint) {
        statusEl.textContent =
          "Local preview mode: connect Netlify Forms or a Formspree endpoint (data-endpoint) so inquiries deliver to your team email.";
        form.reset();
        return;
      }

      try {
        const formData = new FormData(form);
        let response;

        if (endpoint) {
          response = await fetch(endpoint, {
            method: "POST",
            headers: { Accept: "application/json" },
            body: formData,
          });
        } else {
          const body = new URLSearchParams(formData).toString();
          response = await fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body,
          });
        }

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        statusEl.textContent =
          "Thank you! Your message for The Goonies #8777 has been received.";
        form.reset();
      } catch (_err) {
        statusEl.classList.add("is-error");
        statusEl.textContent =
          "Online form submission is not yet connected on this host. Please mail sponsorship details to Brownstown Middle School (Attn: 8777 – Goonies).";
      }
    });
  }
})();
