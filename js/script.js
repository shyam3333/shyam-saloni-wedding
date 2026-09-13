/* =========================================================================
   WEDDING INVITATION - BEHAVIOUR
   All the logic lives here. Content/text lives in js/config.js instead.
   ========================================================================= */
(function () {
  "use strict";

  const CONFIG = window.WEDDING_CONFIG;
  const appFrame = document.getElementById("appFrame");

  /* ----------------------------------------------------------------
     Small helper: fill every [data-bind="path.to.value"] element with
     the matching value from CONFIG.
     ---------------------------------------------------------------- */
  function bindText(root, data) {
    root.querySelectorAll("[data-bind]").forEach((el) => {
      const path = el.getAttribute("data-bind");
      const value = path.split(".").reduce((o, k) => (o ? o[k] : undefined), data);
      if (value !== undefined && value !== null) el.textContent = value;
    });
  }
  bindText(document, CONFIG);

  /* ----------------------------------------------------------------
     Floating petals
     ---------------------------------------------------------------- */
  function spawnPetals() {
    const layer = document.getElementById("petalLayer");
    const count = window.innerWidth < 420 ? 14 : 20;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("div");
      p.className = "petal";
      const left = Math.random() * 100;
      const duration = 9 + Math.random() * 10;
      const delay = -Math.random() * duration;
      const drift = (Math.random() * 60 - 30).toFixed(0) + "px";
      const scale = (0.6 + Math.random() * 0.9).toFixed(2);
      p.style.left = left + "%";
      p.style.animationDuration = duration + "s";
      p.style.animationDelay = delay + "s";
      p.style.setProperty("--drift", drift);
      p.style.transform = `scale(${scale})`;
      layer.appendChild(p);
    }
  }
  spawnPetals();

  /* ----------------------------------------------------------------
     Cover -> Name splash -> Main content sequence
     ---------------------------------------------------------------- */
  const cover = document.getElementById("cover");
  const sealBtn = document.getElementById("sealBtn");
  const nameSplash = document.getElementById("nameSplash");

  function burstSparks(originEl) {
    const rect = originEl.getBoundingClientRect();
    const frameRect = appFrame.getBoundingClientRect();
    const cx = rect.left + rect.width / 2 - frameRect.left;
    const cy = rect.top + rect.height / 2 - frameRect.top;
    for (let i = 0; i < 14; i++) {
      const s = document.createElement("span");
      s.className = "spark";
      const angle = (Math.PI * 2 * i) / 14 + Math.random() * 0.3;
      const dist = 60 + Math.random() * 50;
      s.style.setProperty("--sx", Math.cos(angle) * dist + "px");
      s.style.setProperty("--sy", Math.sin(angle) * dist + "px");
      s.style.left = cx + "px";
      s.style.top = cy + "px";
      appFrame.appendChild(s);
      s.addEventListener("animationend", () => s.remove());
    }
  }

  /* ----------------------------------------------------------------
     Background music - shared play/pause so the seal-tap (a real user
     gesture, which browsers allow to start audio) can turn the music on
     by default, while the floating button can still toggle it afterwards
     ---------------------------------------------------------------- */
  let musicPlaying = false;
  function setMusicButtonState(playing) {
    const btn = document.getElementById("audioToggle");
    if (!btn) return;
    btn.classList.toggle("is-muted", !playing);
    btn.setAttribute("aria-pressed", playing ? "true" : "false");
  }
  function playMusic() {
    const audio = document.getElementById("bgAudio");
    if (!audio || musicPlaying) return;
    audio.play().then(() => {
      musicPlaying = true;
      setMusicButtonState(true);
    }).catch(() => {
      // Autoplay blocked, or no music file yet - fail silently; the
      // floating button still lets a visitor start it manually.
      setMusicButtonState(false);
    });
  }
  function pauseMusic() {
    const audio = document.getElementById("bgAudio");
    if (!audio) return;
    audio.pause();
    musicPlaying = false;
    setMusicButtonState(false);
  }

  let revealed = false;
  function revealInvitation() {
    if (revealed) return;
    revealed = true;

    // this tap is a genuine user gesture, so it's allowed to start audio
    // playback even under strict autoplay policies - this is what makes
    // the music "on by default" without the visitor tapping a second button
    playMusic();

    sealBtn.classList.add("is-cracking");
    burstSparks(sealBtn);

    setTimeout(() => {
      cover.classList.add("is-hiding");
      setTimeout(() => {
        cover.setAttribute("hidden", "");
        nameSplash.hidden = false;

        setTimeout(() => {
          nameSplash.classList.add("is-hiding");
          setTimeout(() => {
            nameSplash.setAttribute("hidden", "");
            appFrame.classList.remove("locked");
            initScrollReveal();
          }, 650);
        }, 2200);
      }, 700);
    }, 550);
  }

  sealBtn.addEventListener("click", revealInvitation);

  /* ----------------------------------------------------------------
     Scroll reveal for sections (runs once the invitation is open)
     ---------------------------------------------------------------- */
  let scrollRevealStarted = false;
  function initScrollReveal() {
    if (scrollRevealStarted) return;
    scrollRevealStarted = true;

    const sections = document.querySelectorAll(".section");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      // a small, fixed threshold (rather than a larger fraction like the
      // ~0.18 this used before) - .ceremonies-section is much taller than
      // the viewport now that it holds 7 photo cards, so a bigger ratio
      // threshold could need more of it visible than the viewport can
      // ever show at once, which would silently never fire and leave the
      // whole section stuck invisible (opacity:0) while scrolling through it
      { root: appFrame, threshold: 0.05 }
    );
    sections.forEach((s) => observer.observe(s));
  }

  /* ----------------------------------------------------------------
     Countdown timer
     ---------------------------------------------------------------- */
  function startCountdown() {
    const target = new Date(CONFIG.weddingDate).getTime();
    const daysEl = document.getElementById("cd-days");
    const hoursEl = document.getElementById("cd-hours");
    const minsEl = document.getElementById("cd-mins");
    const secsEl = document.getElementById("cd-secs");
    if (!daysEl || isNaN(target)) return;

    function pad(n) { return String(n).padStart(2, "0"); }

    function tick() {
      let diff = target - Date.now();
      if (diff < 0) diff = 0;
      const days = Math.floor(diff / 86400000);
      diff -= days * 86400000;
      const hours = Math.floor(diff / 3600000);
      diff -= hours * 3600000;
      const mins = Math.floor(diff / 60000);
      diff -= mins * 60000;
      const secs = Math.floor(diff / 1000);

      daysEl.textContent = pad(days);
      hoursEl.textContent = pad(hours);
      minsEl.textContent = pad(mins);
      secsEl.textContent = pad(secs);
    }
    tick();
    setInterval(tick, 1000);
  }
  startCountdown();

  /* ----------------------------------------------------------------
     Gallery
     ---------------------------------------------------------------- */
  function initGalleryCarousel() {
    const items = CONFIG.gallery || [];
    const viewport = document.getElementById("galleryViewport");
    const track = document.getElementById("galleryTrack");
    const captionEl = document.getElementById("galleryCaption");
    const dotsEl = document.getElementById("galleryDots");
    if (!viewport || !track || !items.length) return;

    track.innerHTML = items
      .map(
        (item) => `<div class="gallery-slide"><img src="${item.img}" alt="${item.caption}" loading="lazy"></div>`
      )
      .join("");

    dotsEl.innerHTML = items
      .map((_, i) => `<button type="button" class="gallery-dot" aria-label="Go to photo ${i + 1}"></button>`)
      .join("");
    const dots = [...dotsEl.querySelectorAll(".gallery-dot")];

    let index = 0;
    function render() {
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle("is-active", i === index));
      captionEl.textContent = items[index].caption;
    }
    function goTo(i) {
      index = (i + items.length) % items.length;
      render();
    }

    viewport.addEventListener("click", () => goTo(index + 1));
    viewport.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        goTo(index + 1);
      }
    });
    dots.forEach((d, i) =>
      d.addEventListener("click", (e) => {
        e.stopPropagation();
        goTo(i);
      })
    );

    render();
  }
  initGalleryCarousel();

  /* ----------------------------------------------------------------
     Embedded Google Maps iframes (venue + Manglik) capture touch-drag
     for panning the map itself, which silently "eats" a visitor's
     scroll gesture on a phone - it feels like the page has stopped
     scrolling/loading right at the map. A transparent guard button sits
     on top of every map until it's explicitly tapped once, so a normal
     swipe over that area keeps scrolling the page like everything else;
     only a real tap unlocks the map underneath for panning/zooming.
     ---------------------------------------------------------------- */
  document.addEventListener("click", (e) => {
    const guard = e.target.closest(".map-tap-guard");
    if (guard) guard.remove();
  });

  /* ----------------------------------------------------------------
     Venue map + directions
     ---------------------------------------------------------------- */
  function renderVenue() {
    const map = document.getElementById("venueMap");
    const dirBtn = document.getElementById("directionsBtn");
    const venue = CONFIG.venue || {};
    const query = venue.mapQuery || venue.address;
    if (map) map.src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
    if (dirBtn) {
      dirBtn.href = venue.directionsUrl
        || `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
    }
  }
  renderVenue();

  /* ----------------------------------------------------------------
     Ceremonies
     ---------------------------------------------------------------- */

  // a simple abstract couple silhouette, reused (recolored/repositioned)
  // across every ceremony scene background
  function coupleSilhouette(x, y, scale, color, opacity) {
    return `<g transform="translate(${x} ${y}) scale(${scale})" fill="${color}" opacity="${opacity}">
      <circle cx="0" cy="-50" r="9"/>
      <path d="M-15 8 L-15 -16 Q-15 -38 0 -42 Q15 -38 15 -16 L15 8 Z"/>
      <circle cx="34" cy="-50" r="9"/>
      <path d="M17 8 L25 -28 Q34 -40 43 -28 L51 8 Z"/>
    </g>`;
  }

  // an original flamingo silhouette (built from simple primitives, not
  // traced from any reference image) - used as a pair flanking the Haldi
  // Carnival card, echoing a classic lavender-garden-party look
  function flamingo(x, y, scale, flip, color) {
    const fx = flip ? -1 : 1;
    return `<g transform="translate(${x} ${y}) scale(${scale * fx} ${scale})" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round">
      <path d="M0 58 Q-3 66 0 74" />
      <path d="M7 58 Q11 68 7 78" />
      <ellipse cx="6" cy="44" rx="15" ry="10" fill="${color}" stroke="none"/>
      <path d="M-5 38 Q-13 22 -7 6 Q-3 -6 6 -8" stroke-width="5"/>
      <circle cx="7" cy="-9" r="4.5" fill="${color}" stroke="none"/>
      <path d="M11 -10 L19 -6 L11 -4 Z" fill="${color}" stroke="none" opacity=".8"/>
    </g>`;
  }

  // decorative background scene per theme: an arch/curtain/skyline motif up
  // top plus a small couple silhouette near the bottom, all low-opacity so
  // the card text stays perfectly readable on top
  const CEREMONY_SCENES = {
    lavender: `<svg viewBox="0 0 400 320" preserveAspectRatio="none">
      <path d="M0,60 Q25,15 50,60 Q75,15 100,60 Q125,15 150,60 Q175,15 200,60 Q225,15 250,60 Q275,15 300,60 Q325,15 350,60 Q375,15 400,60 L400,0 L0,0 Z" fill="#fff" opacity=".22"/>
      <circle cx="45" cy="52" r="5" fill="#fff" opacity=".3"/>
      <circle cx="130" cy="48" r="4" fill="#fff" opacity=".28"/>
      <circle cx="230" cy="50" r="4.5" fill="#fff" opacity=".3"/>
      <circle cx="320" cy="48" r="4" fill="#fff" opacity=".28"/>
      ${flamingo(58, 225, 1.5, false, "rgba(255,255,255,.4)")}
      ${flamingo(342, 225, 1.5, true, "rgba(255,255,255,.4)")}
      <circle cx="90" cy="150" r="2.6" fill="#fff" opacity=".22"/>
      <circle cx="300" cy="170" r="2.4" fill="#fff" opacity=".2"/>
    </svg>`,
    dark: `<svg viewBox="0 0 400 320" preserveAspectRatio="none">
      <path d="M0,0 L400,0 L400,34 Q300,58 200,40 Q100,58 0,34 Z" fill="#000" opacity=".28"/>
      <circle cx="40" cy="46" r="2.6" fill="#F4D06F" opacity=".7"/>
      <circle cx="100" cy="56" r="2.6" fill="#F4D06F" opacity=".7"/>
      <circle cx="160" cy="46" r="2.6" fill="#F4D06F" opacity=".7"/>
      <circle cx="240" cy="46" r="2.6" fill="#F4D06F" opacity=".7"/>
      <circle cx="300" cy="56" r="2.6" fill="#F4D06F" opacity=".7"/>
      <circle cx="360" cy="46" r="2.6" fill="#F4D06F" opacity=".7"/>
      ${coupleSilhouette(170, 300, 1.05, "#F4E6FF", 0.16)}
    </svg>`,
    fire: `<svg viewBox="0 0 400 320" preserveAspectRatio="none">
      <path d="M0,72 L0,34 Q200,-14 400,34 L400,72 Z" fill="#fff" opacity=".16"/>
      <circle cx="60" cy="78" r="3" fill="#FFE3B0" opacity=".55"/>
      <circle cx="140" cy="86" r="3" fill="#FFE3B0" opacity=".55"/>
      <circle cx="260" cy="86" r="3" fill="#FFE3B0" opacity=".55"/>
      <circle cx="340" cy="78" r="3" fill="#FFE3B0" opacity=".55"/>
      ${coupleSilhouette(150, 300, 0.95, "#FFF6E8", 0.24)}
      <path d="M196 278c-6 6-6 14 0 20 6-6 6-14 0-20z" fill="#FFD873" opacity=".5"/>
    </svg>`,
    royal: `<svg viewBox="0 0 400 320" preserveAspectRatio="none">
      <rect x="0" y="48" width="400" height="16" fill="#fff" opacity=".14"/>
      <circle cx="30" cy="52" r="16" fill="#fff" opacity=".14"/>
      <circle cx="90" cy="52" r="24" fill="#fff" opacity=".14"/>
      <circle cx="160" cy="52" r="14" fill="#fff" opacity=".14"/>
      <circle cx="200" cy="52" r="30" fill="#fff" opacity=".16"/>
      <circle cx="240" cy="52" r="14" fill="#fff" opacity=".14"/>
      <circle cx="310" cy="52" r="24" fill="#fff" opacity=".14"/>
      <circle cx="370" cy="52" r="16" fill="#fff" opacity=".14"/>
      <g stroke="#F4D06F" stroke-width="1.4" opacity=".5">
        <path d="M70 110l4 10M70 110l-4 10M70 110l8 4M70 110l-8 4M70 110l0 -12"/>
        <path d="M330 140l4 10M330 140l-4 10M330 140l8 4M330 140l-8 4M330 140l0 -12"/>
      </g>
      ${coupleSilhouette(170, 300, 1.05, "#FFF7E6", 0.24)}
    </svg>`
  };

  const CEREMONY_ICONS = {
    // marigold bloom - Haldi Carnival
    haldiCarnival: `<svg viewBox="0 0 64 64" fill="none">
      <g>
        <ellipse cx="32" cy="14" rx="6.5" ry="13" fill="#F2A93B" transform="rotate(0 32 32)"/>
        <ellipse cx="32" cy="14" rx="6.5" ry="13" fill="#F0994F" transform="rotate(45 32 32)"/>
        <ellipse cx="32" cy="14" rx="6.5" ry="13" fill="#F2A93B" transform="rotate(90 32 32)"/>
        <ellipse cx="32" cy="14" rx="6.5" ry="13" fill="#F0994F" transform="rotate(135 32 32)"/>
        <ellipse cx="32" cy="14" rx="6.5" ry="13" fill="#F2A93B" transform="rotate(180 32 32)"/>
        <ellipse cx="32" cy="14" rx="6.5" ry="13" fill="#F0994F" transform="rotate(225 32 32)"/>
        <ellipse cx="32" cy="14" rx="6.5" ry="13" fill="#F2A93B" transform="rotate(270 32 32)"/>
        <ellipse cx="32" cy="14" rx="6.5" ry="13" fill="#F0994F" transform="rotate(315 32 32)"/>
      </g>
      <circle cx="32" cy="32" r="8" fill="#FFD873" stroke="#B9862B" stroke-width="1.4"/>
      <circle cx="29" cy="30" r="1.1" fill="#8A5A1E"/>
      <circle cx="35" cy="30" r="1.1" fill="#8A5A1E"/>
      <circle cx="32" cy="35.5" r="1.1" fill="#8A5A1E"/>
    </svg>`,
    // disco ball + sparkles - Engagement & Sangeet
    sangeetDark: `<svg viewBox="0 0 64 64" fill="none">
      <defs>
        <radialGradient id="discoGrad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#fff7dd"/>
          <stop offset="55%" stop-color="#e9c766"/>
          <stop offset="100%" stop-color="#9c7a2e"/>
        </radialGradient>
        <clipPath id="discoClip"><circle cx="32" cy="34" r="18"/></clipPath>
      </defs>
      <line x1="32" y1="2" x2="32" y2="14" stroke="#D9B44A" stroke-width="1.5"/>
      <circle cx="32" cy="34" r="18" fill="url(#discoGrad)" stroke="#D9B44A" stroke-width="1.2"/>
      <g clip-path="url(#discoClip)" stroke="#3a3550" stroke-width=".8" opacity=".55">
        <path d="M14 34h36M32 16v36M18 22l28 24M46 22l-28 24"/>
      </g>
      <g class="sparkle-a"><path d="M10 12l1.2 3 3 1.2-3 1.2-1.2 3-1.2-3-3-1.2 3-1.2z" fill="#fff2c0"/></g>
      <g class="sparkle-b"><path d="M52 16l1 2.4 2.4 1-2.4 1-1 2.4-1-2.4-2.4-1 2.4-1z" fill="#fff2c0"/></g>
    </svg>`,
    // sacred fire / diya - Pheras
    pheras: `<svg viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="50" rx="16" ry="5" fill="#8A4A1E"/>
      <path d="M14 50c0-8 6-10 18-10s18 2 18 10" fill="#C1440E" stroke="#7A1F2B" stroke-width="1.2"/>
      <path class="flame" d="M32 46c-7 0-11-5-11-11 0-6 4-10 6-14 0 3 1 5 3 6 0-5 2-9 6-12 1 6 5 10 5 16 0 8-5 15-9 15z" fill="#FFB648"/>
      <path class="flame-inner" d="M32 42c-3.5 0-5.5-2.6-5.5-5.6 0-3 1.8-5.2 3-7.2.3 1.5.8 2.6 1.8 3.2.3-2.6 1.2-4.6 3-6.2.7 3.2 2.7 5.4 2.7 8.6 0 4.2-2.5 7.2-5 7.2z" fill="#FFE9A8"/>
    </svg>`,
    // festive burst + bell - Barat & Reception
    baratReception: `<svg viewBox="0 0 64 64" fill="none">
      <g class="burst-rays" stroke="#F4D06F" stroke-width="2" stroke-linecap="round">
        <path d="M32 4v10M32 50v10M4 32h10M50 32h10M11 11l7 7M46 46l7 7M53 11l-7 7M18 46l-7 7"/>
      </g>
      <g class="bell">
        <circle cx="32" cy="32" r="12" fill="#7A1F2B" stroke="#F4D06F" stroke-width="1.5"/>
        <path d="M26 30a6 6 0 0 1 12 0c0 4 2 5 2 8h-16c0-3 2-4 2-8z" fill="#F4D06F"/>
        <circle cx="32" cy="40" r="1.6" fill="#7A1F2B"/>
      </g>
    </svg>`
  };

  function ceremonyMapEmbedSrc(venueMap) {
    const query = venueMap.mapQuery || venueMap.address;
    return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
  }
  function ceremonyDirectionsHref(venueMap) {
    if (venueMap.directionsUrl) return venueMap.directionsUrl;
    const query = venueMap.mapQuery || venueMap.address;
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
  }

  // Real pixel dimensions of each ceremony background photo. Passed as the
  // <img>'s width/height attributes below so the browser can reserve the
  // correct aspect-ratio box BEFORE the file downloads - without this, an
  // image with no intrinsic size (plus `loading="lazy"`) renders at ~0
  // height until it finishes loading, so the card is invisible/collapsed
  // and the IntersectionObserver driving the scroll-reveal (js above, see
  // initScrollReveal) can misjudge the section's real height, which is
  // what made this section feel slow or blank while scrolling into it.
  const CEREMONY_IMAGE_DIMS = {
    "assets/images/ceremonies/manglik-bg.jpg": [800, 1200],
    "assets/images/ceremonies/haldi-carnival-bg.jpg": [675, 1200],
    "assets/images/ceremonies/sangeet-bg.jpg": [675, 1200],
    "assets/images/ceremonies/pheras-bg.jpg": [675, 1200],
    "assets/images/ceremonies/barat-reception-bg.jpg": [675, 1200],
    "assets/images/ceremonies/bheegi-palkein-bg.jpg": [848, 1200],
    "assets/images/ceremonies/khatu-shyam-bhajan-bg.jpg": [676, 1200]
  };
  function ceremonyImageAttrs(src) {
    const dims = CEREMONY_IMAGE_DIMS[src];
    return dims ? ` width="${dims[0]}" height="${dims[1]}"` : "";
  }

  function renderCeremonies() {
    const list = document.getElementById("ceremonyList");
    if (!list) return;
    list.innerHTML = CONFIG.ceremonies
      .map((c) => {
        // a ceremony spanning several dates (e.g. Manglik Programme): the
        // photo overlay shows just the name, and a panel below the photo
        // (still inside the same card) carries the full multi-date
        // schedule plus the venue/map - too much text to overlay directly
        if (c.scheduleGroups) {
          const groupsHtml = c.scheduleGroups
            .map(
              (g) => `
              <div class="ceremony-schedule-group">
                <p class="ceremony-schedule-date">${g.date}</p>
                ${g.items
                  .map(
                    (s) =>
                      `<p class="ceremony-schedule-item"><span class="ceremony-schedule-label">${s.label}</span> &middot; ${s.time}</p>`
                  )
                  .join("")}
              </div>`
            )
            .join("");

          // the map/button is a real interactive widget, not photo-overlay
          // text, so it stays in its own plain panel below the photo
          const mapHtml = c.venueMap
            ? `
            <div class="ceremony-extra">
              <div class="ceremony-venue-map">
                <iframe title="${c.venue || "Venue"} location" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="${ceremonyMapEmbedSrc(c.venueMap)}"></iframe>
                <button type="button" class="map-tap-guard" aria-label="Tap to interact with the map"><span>Tap to explore map</span></button>
              </div>
              <a class="btn btn-primary ceremony-directions-btn" href="${ceremonyDirectionsHref(c.venueMap)}" target="_blank" rel="noopener">Get Directions</a>
            </div>`
            : "";

          const styleAttr = c.textTop ? ` style="--photo-text-top:${c.textTop}"` : "";
          const modifierClasses = [
            c.darkText ? "ceremony-card--photo-dark" : "",
            c.textTop ? "ceremony-card--photo-anchored" : "",
            c.boldText ? "ceremony-card--extra-bold" : "",
            "ceremony-card--photo-compact"
          ]
            .filter(Boolean)
            .join(" ");

          return `
          <div class="ceremony-card ceremony-card--photo ${modifierClasses} theme-${c.theme}"${styleAttr}>
            <div class="ceremony-bg-photo${mapHtml ? " ceremony-bg-photo--top-only" : ""}">
              <img src="${c.bgImage}" alt="" loading="lazy"${ceremonyImageAttrs(c.bgImage)}>
              <div class="ceremony-photo-overlay"></div>
              <div class="ceremony-photo-content">
                <h3 class="ceremony-name script">${c.name}</h3>
                ${c.subtitle ? `<p class="ceremony-subtitle">${c.subtitle}</p>` : ""}
                <div class="ceremony-schedule-groups">${groupsHtml}</div>
                ${c.venue ? `<p class="ceremony-venue-line">Venue &mdash; ${c.venue}</p>` : ""}
              </div>
            </div>
            ${mapHtml}
          </div>`;
        }

        const scheduleOrTime = c.schedule
          ? `<div class="ceremony-schedule">${c.schedule
              .map(
                (s) =>
                  `<p class="ceremony-schedule-item"><span class="ceremony-schedule-label">${s.label}</span> &middot; ${s.time}</p>`
              )
              .join("")}</div>`
          : `<p class="ceremony-meta">${c.time}</p>`;

        const textBlock = `
          <h3 class="ceremony-name script">${c.name}</h3>
          ${c.subtitle ? `<p class="ceremony-subtitle">${c.subtitle}</p>` : ""}
          <p class="ceremony-meta">${c.date}</p>
          ${scheduleOrTime}
          ${c.venue ? `<p class="ceremony-venue-line">Venue &mdash; ${c.venue}</p>` : ""}
          ${c.themeLabel ? `<span class="ceremony-theme-badge">${c.themeLabel}</span>` : ""}
        `;

        // photo-background card: the given photo fills the whole card,
        // with the ceremony details overlaid on top of it
        if (c.bgImage) {
          const modifierClasses = [
            c.darkText ? "ceremony-card--photo-dark" : "",
            c.textTop ? "ceremony-card--photo-anchored" : "",
            c.boldText ? "ceremony-card--extra-bold" : "",
            c.compactText ? "ceremony-card--photo-compact" : ""
          ]
            .filter(Boolean)
            .join(" ");
          const styleVars = [
            c.textTop ? `--photo-text-top:${c.textTop}` : "",
            c.titleMaxWidth ? `--ceremony-title-max:${c.titleMaxWidth}` : ""
          ]
            .filter(Boolean)
            .join(";");
          const styleAttr = styleVars ? ` style="${styleVars}"` : "";
          return `
          <div class="ceremony-card ceremony-card--photo ${modifierClasses} theme-${c.theme}"${styleAttr}>
            <div class="ceremony-bg-photo">
              <img src="${c.bgImage}" alt="" loading="lazy"${ceremonyImageAttrs(c.bgImage)}>
              <div class="ceremony-photo-overlay"></div>
              <div class="ceremony-photo-content">${textBlock}</div>
            </div>
          </div>`;
        }

        // default card: themed gradient + decorative scene + animated avatar
        return `
      <div class="ceremony-card theme-${c.theme}">
        <div class="ceremony-scene">${CEREMONY_SCENES[c.theme] || ""}</div>
        <div class="ceremony-avatar avatar-${c.icon}">${CEREMONY_ICONS[c.icon] || ""}</div>
        ${textBlock}
        ${c.photo ? `<div class="ceremony-photo"><img src="${c.photo}" alt="Shyam &amp; Saloni" loading="lazy"></div>` : ""}
      </div>`;
      })
      .join("");
  }
  renderCeremonies();

  /* ----------------------------------------------------------------
     Footer blocks (RSVP / Awaiting Eyes / Compliments / Invitation host)
     ---------------------------------------------------------------- */
  function renderFooter() {
    const footer = (CONFIG.footer) || {};

    function setText(id, text) {
      const el = document.getElementById(id);
      if (el && text) el.textContent = text;
    }
    function renderNames(id, names) {
      const el = document.getElementById(id);
      if (!el) return;
      el.innerHTML = (names || []).map((n) => `<li>${n}</li>`).join("");
    }
    function renderLines(id, lines) {
      const el = document.getElementById(id);
      if (!el) return;
      el.innerHTML = (lines || []).map((l) => `<p>${l}</p>`).join("");
    }
    function mobilesText(mobiles) {
      if (!mobiles || !mobiles.length) return "";
      return (mobiles.length > 1 ? "Mob : " : "Mob : ") + mobiles.join(", ");
    }

    const rsvp = footer.rsvp || {};
    setText("rsvpTitle", rsvp.title);
    renderNames("rsvpNames", rsvp.names);
    setText("rsvpMobiles", mobilesText(rsvp.mobiles));

    const awaiting = footer.awaitingEyes || {};
    setText("awaitingTitle", awaiting.title);
    renderNames("awaitingNames", awaiting.names);

    const compliments = footer.compliments || {};
    setText("complimentsTitle", compliments.title);
    renderLines("complimentsLines", compliments.lines);

    const invitation = footer.invitation || {};
    setText("invitationTitle", invitation.title);
    setText("invitationName", invitation.name);
    renderLines("invitationAddress", invitation.address);
    setText("invitationMobiles", mobilesText(invitation.mobiles));
  }
  renderFooter();

  /* ----------------------------------------------------------------
     Audio toggle
     ---------------------------------------------------------------- */
  function initAudio() {
    const btn = document.getElementById("audioToggle");
    const audio = document.getElementById("bgAudio");
    if (!btn || !audio) return;
    if (CONFIG.audio && CONFIG.audio.src) audio.src = CONFIG.audio.src;

    setMusicButtonState(false);
    btn.addEventListener("click", () => {
      if (musicPlaying) pauseMusic();
      else playMusic();
    });
  }
  initAudio();

})();
