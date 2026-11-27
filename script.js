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

  // Lightbox with Prev/Next and keyboard navigation
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxCounter = document.getElementById("lightbox-counter");
  const lightboxClose = document.getElementById("lightbox-close");
  const lightboxPrev = document.getElementById("lightbox-prev");
  const lightboxNext = document.getElementById("lightbox-next");

  let activeItems = [];
  let activeIndex = 0;

  const renderLightbox = () => {
    if (!lightboxImg || !lightboxCaption || activeItems.length === 0) return;
    const item = activeItems[activeIndex];
    lightboxImg.src = item.src;
    lightboxImg.alt = item.caption;
    lightboxCaption.textContent = item.caption;

    const hasMultiple = activeItems.length > 1;
    if (lightboxCounter) {
      lightboxCounter.textContent = hasMultiple ? `${activeIndex + 1} / ${activeItems.length}` : "";
    }
    if (lightboxPrev) lightboxPrev.hidden = !hasMultiple;
    if (lightboxNext) lightboxNext.hidden = !hasMultiple;
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.style.overflow = "";
  };

  const stepLightbox = (delta) => {
    if (activeItems.length <= 1) return;
    activeIndex = (activeIndex + delta + activeItems.length) % activeItems.length;
    renderLightbox();
  };

  const triggers = Array.from(document.querySelectorAll("[data-lightbox-src]"));
  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      if (!lightbox || !lightboxImg || !lightboxCaption) return;

      const groupName = trigger.getAttribute("data-lightbox-group") || "";
      const groupTriggers = groupName
        ? triggers.filter((el) => (el.getAttribute("data-lightbox-group") || "") === groupName)
        : triggers;

      // Deduplicate by src while preserving gallery order
      const seen = new Set();
      activeItems = [];
      groupTriggers.forEach((el) => {
        const src = el.getAttribute("data-lightbox-src") || "";
        const caption = el.getAttribute("data-lightbox-caption") || "";
        if (src && !seen.has(src)) {
          seen.add(src);
          activeItems.push({ src, caption });
        }
      });

      const clickedSrc = trigger.getAttribute("data-lightbox-src") || "";
      activeIndex = Math.max(
        0,
        activeItems.findIndex((it) => it.src === clickedSrc)
      );

      renderLightbox();
      lightbox.hidden = false;
      document.body.style.overflow = "hidden";
      if (lightboxClose) lightboxClose.focus();
    });
  });

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener("click", () => stepLightbox(-1));
  if (lightboxNext) lightboxNext.addEventListener("click", () => stepLightbox(1));

  if (lightbox) {
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener("keydown", (event) => {
    if (!lightbox || lightbox.hidden) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") stepLightbox(-1);
    if (event.key === "ArrowRight") stepLightbox(1);
  });

  // Form submission handler: supports Formspree (data-endpoint), Netlify Forms, or direct coach email (data-mailto)
  const form = document.getElementById("contact-form");
  const statusEl = document.getElementById("form-status");

  if (form && statusEl) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      statusEl.classList.remove("is-error");

      const endpoint = (form.getAttribute("data-endpoint") || "").trim();
      const mailtoRecipients = (form.getAttribute("data-mailto") || "").trim();
      const formData = new FormData(form);

      if (endpoint) {
        try {
          const response = await fetch(endpoint, {
            method: "POST",
            headers: { Accept: "application/json" },
            body: formData,
          });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          statusEl.textContent =
            "Thank you! Your message for The Goonies #8777 has been received.";
          form.reset();
          return;
        } catch (_err) {
          // Fall through to mailto if available
        }
      }

      if (mailtoRecipients) {
        const name = String(formData.get("contact_name") || "").trim();
        const business = String(formData.get("business_name") || "").trim();
        const email = String(formData.get("email") || "").trim();
        const phone = String(formData.get("phone") || "").trim();
        const inquiryType = String(formData.get("inquiry_type") || "Website Inquiry").trim();
        const website = String(formData.get("website") || "").trim();
        const message = String(formData.get("message") || "").trim();

        const subject = `FTC Team #8777 — ${inquiryType}${business ? ` (${business})` : ""}`;
        const lines = [
          `Inquiry Type: ${inquiryType}`,
          `Contact Person: ${name}`,
          business ? `Business / Organization: ${business}` : null,
          `Email: ${email}`,
          phone ? `Phone: ${phone}` : null,
          website ? `Website: ${website}` : null,
          "",
          "Message:",
          message,
        ].filter((line) => line !== null);

        const mailtoUrl = `mailto:${mailtoRecipients}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
        window.location.href = mailtoUrl;
        statusEl.textContent =
          "Opening your email client addressed to Coaches Desiderio Villalobos and Christopher Sims. If it did not open, email villald@wbsdweb.com or simsc@wbsdweb.com directly.";
        return;
      }

      statusEl.classList.add("is-error");
      statusEl.textContent =
        "Please email our coaches directly at villald@wbsdweb.com or simsc@wbsdweb.com.";
    });
  }
})();
