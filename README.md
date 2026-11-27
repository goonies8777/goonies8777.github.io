# The Goonies — FTC Team #8777 Website

Official static website for **The Goonies**, FIRST® Tech Challenge (FTC) Team #8777 at Brownstown Middle School (Brownstown Charter Township, MI), feeder team to Woodhaven High School's FRC Team #3604 The Goon Squad.

- **GitHub:** https://github.com/goonies8777
- **Target Custom Domain:** `goonies8777.com`

## Project Structure

- `index.html` — Responsive homepage with sections for Who We Are, Parents & Roles, Robot & Season, Sponsors, Season Fundraising, and Contact/Sponsorship Inquiry.
- `photos-2025-2026.html` — 2025–2026 season photo album highlights page linking to the full Google Photos album (`https://photos.app.goo.gl/qhLLqhg66otmuC6A7`), with a season switcher ready for future seasons (`photos-2026-2027.html`).
- `styles.css` — Royal purple (`#55298A`), obsidian black, and metallic silver theme matching the Woodhaven-Brownstown / Goon Squad robotics family.
- `script.js` — Mobile navigation menu, prev/next keyboard lightbox viewer, and form submission handler.
- `.nojekyll` — Ensures GitHub Pages serves static files directly without Jekyll processing.
- `netlify.toml` — Optional Netlify hosting and security/caching header configuration.
- `assets/images/` — Official team logos, banner, shirt graphics, cropped sponsor logos, and `season-2025-2026/` highlight photos.
- `assets/docs/Goonies-8777-Sponsorship-Packet.pdf` — Downloadable sponsorship letter and season budget.
- `assets/docs/Goonies-8777-Basic-Information-Sheet.pdf` — Downloadable parent and family guide covering practice schedule, competitions, and student roles.

## Hosting on GitHub Pages (`goonies8777.github.io` + `goonies8777.com`)

1. Create a public repository named **`goonies8777.github.io`** under `https://github.com/goonies8777`.
2. Push this local repository to GitHub:
   ```powershell
   git remote add origin https://github.com/goonies8777/goonies8777.github.io.git
   git push -u origin main
   ```
3. In GitHub, open **Settings -> Pages**:
   - Set **Source** to **Deploy from a branch**, branch `main`, folder `/ (root)`, and click **Save**.
   - Your site will go live immediately at `https://goonies8777.github.io`.
4. **Connect `goonies8777.com` (once registered):**
   At your domain registrar's DNS settings, add:
   - **4 `A` records** for apex (`@`):
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - **1 `CNAME` record** for `www` pointing to `goonies8777.github.io`
   - *(Optional)* **4 `AAAA` records** for IPv6: `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`.
   Then in GitHub **Settings -> Pages -> Custom domain**, enter `goonies8777.com`, click **Save**, and enable **Enforce HTTPS** once DNS finishes propagating.

## Enabling the Contact Form on GitHub Pages

GitHub Pages is static-only and does not process HTML form POSTs by itself. Two easy options:
1. **Formspree (recommended with GitHub Pages):** Create a free form at https://formspree.io, copy the form endpoint URL (e.g. `https://formspree.io/f/xxxxxxxx`), and add `data-endpoint="https://formspree.io/f/xxxxxxxx"` to `<form id="contact-form">` in `index.html`.
2. **Or host the same GitHub repo on Netlify:** Connect `goonies8777/goonies8777.github.io` in Netlify so every `git push` auto-deploys, custom domain `goonies8777.com` gets free HTTPS, and the built-in Netlify Form works with zero extra services.
