/**
 * CITRUS LEISURE PLC — ALMARIS LUXURY HOTEL THEME JAVASCRIPT
 * Inspired by Almaris Luxury Hotel Template (Designesia)
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initSidebarDrawer();
  initBookingBar();
  initCurrencyEngine();
  initHeroParticles();
  initHeroSlider();
  initHeroParallax();
  initRoomFilterTabs();
  initScrollAnimations();
});

/* ==========================================================================
   1. STICKY HEADER WITH DYNAMIC SCROLL HIDE/SHOW
   ========================================================================== */
function initHeaderScroll() {
  const header = document.getElementById('almarisHeader');
  if (!header) return;

  let lastScrollY = window.scrollY;
  let ticking = false;

  // On page load: ALWAYS make sure header is visible and interactive
  header.classList.remove('nav-hidden');
  if (window.scrollY > 30) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const delta = currentScrollY - lastScrollY;

        // When at or near the top of the page (currentScrollY <= 40):
        // ALWAYS visible and natural!
        if (currentScrollY <= 40) {
          header.classList.remove('nav-hidden');
          header.classList.remove('nav-visible');
          header.classList.remove('scrolled');
        } else {
          header.classList.add('scrolled');

          // Scroll DOWN ("jb wapas niche aaye to show kr de"):
          if (delta > 6) {
            header.classList.remove('nav-hidden');
            header.classList.add('nav-visible');
          } 
          // Scroll UP ("jb upar jaye to gayab kr do"):
          else if (delta < -6) {
            header.classList.remove('nav-visible');
            header.classList.add('nav-hidden');
          }
        }

        lastScrollY = currentScrollY;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Mobile Top Edge Reveal: tapping near top (clientY < 55) reveals navbar immediately
  window.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches[0] && e.touches[0].clientY < 55) {
      header.classList.remove('nav-hidden');
      header.classList.add('nav-visible');
    }
  }, { passive: true });

  // Desktop Top Edge Reveal: moving mouse to top edge (clientY < 35) reveals navbar
  window.addEventListener('mousemove', (e) => {
    if (e.clientY < 35) {
      header.classList.remove('nav-hidden');
      header.classList.add('nav-visible');
    }
  }, { passive: true });
}

/* ==========================================================================
   2. ALMARIS LEFT LUXURY MANDALA SIDEBAR DRAWER (SCREENSHOT 5)
   ========================================================================== */
function initSidebarDrawer() {
  const openBtn = document.getElementById('sidebarOpenBtn');
  const drawer = document.getElementById('sidebarDrawer');
  const overlay = document.getElementById('sidebarOverlay');
  const closeBtn = document.getElementById('sidebarCloseBtn');

  if (!openBtn || !drawer || !overlay) return;

  const open = (e) => {
    if (e) e.preventDefault();
    drawer.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const close = (e) => {
    if (e) e.preventDefault();
    drawer.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  openBtn.addEventListener('click', open);
  openBtn.addEventListener('touchend', open);

  if (closeBtn) {
    closeBtn.addEventListener('click', close);
    closeBtn.addEventListener('touchend', close);
  }

  overlay.addEventListener('click', close);
  overlay.addEventListener('touchend', close);

  const links = drawer.querySelectorAll('a');
  links.forEach(l => {
    l.addEventListener('click', close);
    l.addEventListener('touchend', close);
  });
}

/* ==========================================================================
   3. HERO AMBIENT GOLDEN DUST PARTICLE SYSTEM (CINEMATIC LUXURY)
   ========================================================================== */
function initHeroParticles() {
  const canvas = document.getElementById('heroDustCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const PARTICLE_COUNT = 36;

  function resize() {
    if (!canvas.parentElement) return;
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  class DustParticle {
    constructor() {
      this.reset(true);
    }
    reset(initial = false) {
      this.x = Math.random() * (width || window.innerWidth);
      this.y = initial ? Math.random() * (height || window.innerHeight) : (height || window.innerHeight) + 10;
      this.size = Math.random() * 2.2 + 0.8;
      this.speedY = Math.random() * 0.4 + 0.15;
      this.speedX = (Math.random() - 0.5) * 0.25;
      this.opacity = Math.random() * 0.45 + 0.15;
      this.sinSeed = Math.random() * 100;
    }
    update() {
      this.y -= this.speedY;
      this.sinSeed += 0.015;
      this.x += Math.sin(this.sinSeed) * 0.3 + this.speedX;
      if (this.y < -10) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = 'rgba(212, 175, 55, 0.5)';
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new DustParticle());
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    requestAnimationFrame(loop);
  }
  loop();
}

/* ==========================================================================
   3B. HERO SLIDER TRANSITIONS & INTERACTIVE PROPERTY SELECTION
   ========================================================================== */
const heroData = {
  all: {
    title: 'Experience Hospitality Like Never Before',
    desc: 'Discover the perfect blend of luxury, comfort, and authentic Sri Lankan warmth across our three iconic beachfront and boutique city sanctuaries.'
  },
  waskaduwa: {
    title: 'Oceanfront Grandeur at Citrus Waskaduwa',
    desc: '150 ocean-facing luxury suites, endless beachfront swimming pool, Citron Senses Balinese Spa & Mandarin Shore Ballroom.'
  },
  hikkaduwa: {
    title: 'Vibrant Surf & Coral Reefs at Citrus Hikkaduwa',
    desc: 'Golden beach living, snorkeling alongside giant sea turtles, fresh ocean catches at Lemon Fish, and sunset cocktails at Summer Salt.'
  },
  steuart: {
    title: '1835 Scottish Heritage at The Steuart Colombo',
    desc: 'Historic mercantile elegance in Colombo 01 Fort. Named Scottish suites, executive boardrooms, and the iconic &Co Pub and Kitchen.'
  }
};

const heroKeys = ['all', 'waskaduwa', 'hikkaduwa', 'steuart'];
let heroCurrentIdx = 0;
let heroProgressMs = 0;
const HERO_CYCLE_DURATION = 8500; // 8.5 seconds
let heroIsPaused = false;

window.switchHeroSlide = (key) => {
  const targetIdx = heroKeys.indexOf(key);
  if (targetIdx !== -1) heroCurrentIdx = targetIdx;
  heroProgressMs = 0; // reset timeline progress

  // Update slide visuals in both blurred background and crisp center capsule
  const stages = document.querySelectorAll('.hero-slider-stage, .arch-capsule-media');
  stages.forEach(stage => {
    const currentActive = stage.querySelector('.hero-slide-item.active');
    const nextSlide = stage.querySelector(`.hero-slide-item[data-slide="${key}"]`);

    if (currentActive === nextSlide) return;

    if (currentActive) {
      currentActive.classList.remove('active');
      currentActive.classList.add('leaving');
      setTimeout(() => {
        currentActive.classList.remove('leaving');
      }, 1800);
    }

    if (nextSlide) {
      nextSlide.classList.remove('leaving');
      nextSlide.classList.add('active');
    }
  });

  // Update property selector active pill
  const pills = document.querySelectorAll('.hero-prop-pill');
  pills.forEach(pill => {
    if (pill.getAttribute('data-slide') === key) {
      pill.classList.add('active');
    } else {
      pill.classList.remove('active');
    }
  });

  // Update text with silky micro-translate
  const titleEl = document.getElementById('archTitle');
  const descEl = document.getElementById('archDesc');
  const data = heroData[key] || heroData.all;

  if (titleEl && descEl) {
    titleEl.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    descEl.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    titleEl.style.opacity = '0';
    titleEl.style.transform = 'translateY(6px)';
    descEl.style.opacity = '0';
    descEl.style.transform = 'translateY(6px)';

    setTimeout(() => {
      titleEl.textContent = data.title;
      descEl.textContent = data.desc;
      titleEl.style.opacity = '1';
      titleEl.style.transform = 'translateY(0)';
      descEl.style.opacity = '1';
      descEl.style.transform = 'translateY(0)';
    }, 350);
  }
};

window.nextHeroSlide = () => {
  heroCurrentIdx = (heroCurrentIdx + 1) % heroKeys.length;
  switchHeroSlide(heroKeys[heroCurrentIdx]);
};

window.prevHeroSlide = () => {
  heroCurrentIdx = (heroCurrentIdx - 1 + heroKeys.length) % heroKeys.length;
  switchHeroSlide(heroKeys[heroCurrentIdx]);
};

function initHeroSlider() {
  const progressBar = document.getElementById('heroTimelineProgress');
  const prevBtn = document.getElementById('heroPrevBtn');
  const nextBtn = document.getElementById('heroNextBtn');
  const archStage = document.getElementById('archStage');

  if (prevBtn) prevBtn.addEventListener('click', window.prevHeroSlide);
  if (nextBtn) nextBtn.addEventListener('click', window.nextHeroSlide);

  if (archStage) {
    archStage.addEventListener('mouseenter', () => { heroIsPaused = true; });
    archStage.addEventListener('mouseleave', () => { heroIsPaused = false; });
  }

  // Smooth 80ms step progress bar animation
  const stepMs = 80;
  setInterval(() => {
    if (!heroIsPaused) {
      heroProgressMs += stepMs;
      const pct = Math.min((heroProgressMs / HERO_CYCLE_DURATION) * 100, 100);
      if (progressBar) progressBar.style.width = `${pct}%`;

      if (heroProgressMs >= HERO_CYCLE_DURATION) {
        window.nextHeroSlide();
      }
    }
  }, stepMs);
}

/* ==========================================================================
   3C. HERO INTERACTIVE 3D PARALLAX MOVEMENT
   ========================================================================== */
function initHeroParallax() {
  const heroSection = document.getElementById('hero');
  const sliderStage = document.querySelector('.hero-slider-stage');
  const archStage = document.querySelector('.almaris-arch-stage');
  const floatingBadges = document.querySelectorAll('.hero-floating-badge');
  if (!heroSection || !sliderStage) return;

  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    // Smooth subtle luxury 3D depth movement
    sliderStage.style.transform = `translate(${x * -24}px, ${y * -16}px)`;
    if (archStage) {
      archStage.style.transform = `translate(${x * 14}px, ${y * 10}px)`;
    }
    floatingBadges.forEach((badge, i) => {
      const factor = i === 0 ? -28 : 28;
      badge.style.transform = `translate(${x * factor}px, ${y * -14}px)`;
    });
  }, { passive: true });

  heroSection.addEventListener('mouseleave', () => {
    sliderStage.style.transition = 'transform 0.8s ease-out';
    sliderStage.style.transform = 'translate(0, 0)';
    if (archStage) {
      archStage.style.transition = 'transform 0.8s ease-out';
      archStage.style.transform = 'translate(0, 0)';
    }
    floatingBadges.forEach(b => {
      b.style.transition = 'transform 0.8s ease-out';
      b.style.transform = 'translate(0, 0)';
    });
    setTimeout(() => {
      sliderStage.style.transition = '';
      if (archStage) archStage.style.transition = '';
      floatingBadges.forEach(b => { b.style.transition = ''; });
    }, 800);
  });
}

/* ==========================================================================
   4. ALMARIS FLOATING BOOKING BAR
   ========================================================================== */
let adults = 2;
let children = 0;

function initBookingBar() {
  const checkin = document.getElementById('almarisCheckIn');
  const checkout = document.getElementById('almarisCheckOut');
  const guestBtn = document.getElementById('guestTriggerBtn');
  const popover = document.getElementById('guestPopover');
  const display = document.getElementById('guestDisplay');
  const form = document.getElementById('almarisBookingForm');

  // Dates defaults
  const today = new Date();
  const arr = new Date(today);
  arr.setDate(arr.getDate() + 1);
  const dep = new Date(arr);
  dep.setDate(dep.getDate() + 3);

  const format = d => d.toISOString().split('T')[0];

  if (checkin) {
    checkin.value = format(arr);
    checkin.min = format(today);
  }
  if (checkout) {
    checkout.value = format(dep);
    checkout.min = format(arr);
  }

  // Stepper Popover
  if (guestBtn && popover) {
    guestBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      popover.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!popover.contains(e.target) && e.target !== guestBtn) {
        popover.classList.remove('active');
      }
    });

    const updateDisplay = () => {
      if (display) display.textContent = `${adults} Adults, ${children} Children`;
    };

    document.getElementById('adultDec')?.addEventListener('click', e => {
      e.stopPropagation();
      if (adults > 1) { adults--; document.getElementById('adultVal').textContent = adults; updateDisplay(); }
    });
    document.getElementById('adultInc')?.addEventListener('click', e => {
      e.stopPropagation();
      if (adults < 8) { adults++; document.getElementById('adultVal').textContent = adults; updateDisplay(); }
    });
    document.getElementById('childDec')?.addEventListener('click', e => {
      e.stopPropagation();
      if (children > 0) { children--; document.getElementById('childVal').textContent = children; updateDisplay(); }
    });
    document.getElementById('childInc')?.addEventListener('click', e => {
      e.stopPropagation();
      if (children < 6) { children++; document.getElementById('childVal').textContent = children; updateDisplay(); }
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const sel = document.getElementById('almarisSanctuarySelect');
      const hotel = sel ? sel.options[sel.selectedIndex].text : 'Citrus Waskaduwa';
      quickBook('Selected Luxury Suite', hotel);
    });
  }
}

/* ==========================================================================
   5. CURRENCY SWITCHER
   ========================================================================== */
const rates = {
  USD: { symbol: '$', rate: 1 },
  LKR: { symbol: 'Rs. ', rate: 305 },
  GBP: { symbol: '£', rate: 0.78 },
  EUR: { symbol: '€', rate: 0.92 },
  AUD: { symbol: 'A$', rate: 1.52 }
};

function initCurrencyEngine() {
  const sel = document.getElementById('currencySelector');
  if (!sel) return;

  sel.addEventListener('change', () => {
    const cur = sel.value;
    const { symbol, rate } = rates[cur] || rates.USD;

    const prices = document.querySelectorAll('[data-usd]');
    prices.forEach(p => {
      const base = parseFloat(p.getAttribute('data-usd'));
      if (!isNaN(base)) {
        const converted = Math.round(base * rate);
        p.innerHTML = `${symbol}${converted.toLocaleString()} <span>/ night</span>`;
      }
    });

    showToast(`Currency updated to ${cur}`);
  });
}

/* ==========================================================================
   6. MODAL UTILITY
   ========================================================================== */
window.quickBook = (roomName, hotel) => {
  const overlay = document.getElementById('bookingModalOverlay');
  const title = document.getElementById('modalRoomTitle');
  const sub = document.getElementById('modalHotelSub');

  if (title) title.textContent = roomName;
  if (sub) sub.textContent = `${hotel} • 5-Star Direct Privilege`;
  if (overlay) {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

window.openDiningModal = (restaurant, hotel) => {
  quickBook(`Table at ${restaurant}`, hotel);
};

window.closeModal = () => {
  const overlay = document.getElementById('bookingModalOverlay');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
};

window.confirmBooking = () => {
  closeModal();
  showToast('✨ Reservation request received! Our luxury concierge will contact you momentarily.');
};

/* ==========================================================================
   7. TOAST NOTIFICATION
   ========================================================================== */
function showToast(msg) {
  let toast = document.getElementById('almarisToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'almarisToast';
    toast.style.cssText = 'position: fixed; bottom: 24px; right: 24px; background: #FFFFFF; border: 1px solid #B3864C; color: #1A1D20; padding: 14px 24px; border-radius: 4px; box-shadow: 0 10px 30px rgba(45,30,15,0.15); z-index: 4000; font-size: 0.88rem; font-weight: 500; transform: translateY(20px); opacity: 0; transition: all 0.3s ease;';
    document.body.appendChild(toast);
  }

  toast.textContent = msg;
  setTimeout(() => {
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
  }, 10);

  setTimeout(() => {
    toast.style.transform = 'translateY(20px)';
    toast.style.opacity = '0';
  }, 4000);
}

/* ==========================================================================
   8. ALMARIS ROOM FILTER TABS (SCREENSHOT 5)
   ========================================================================== */
function initRoomFilterTabs() {
  const filterBtns = document.querySelectorAll('.filter-tab-btn');
  const cards = document.querySelectorAll('.arch-room-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const sanctuary = card.getAttribute('data-sanctuary');
        if (filter === 'all' || sanctuary === filter) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.transition = 'all 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   9. ALMARIS LUXURY SCROLL REVEAL ANIMATIONS (VIEWPORT TRIGGERED)
   ========================================================================== */
function initScrollAnimations() {
  // 1. Automatically assign luxury animation classes to semantic sections & children
  const sections = document.querySelectorAll('section, footer');
  sections.forEach(sec => {
    // Avoid double-animating the hero stage on scroll (it has page-load CSS keyframes)
    if (sec.id === 'hero') return;

    // Headings, Sub-badges and Paragraphs glide up
    const sectionHeaders = sec.querySelectorAll('.almaris-sub-badge, .almaris-heading, .almaris-desc');
    sectionHeaders.forEach((el, idx) => {
      if (!el.classList.contains('reveal-fade-up')) {
        el.classList.add('reveal-fade-up');
        el.style.transitionDelay = `${idx * 0.1}s`;
      }
    });

    // Dual Arches Welcome Layout
    const dualArch = sec.querySelector('.almaris-dual-arch-grid');
    if (dualArch) {
      const photos = dualArch.querySelectorAll('.arch-frame-photo');
      if (photos[0] && !photos[0].classList.contains('reveal-slide-left')) {
        photos[0].classList.add('reveal-slide-left');
      }
      if (photos[1] && !photos[1].classList.contains('reveal-slide-right')) {
        photos[1].classList.add('reveal-slide-right');
      }
      const center = dualArch.querySelector('.welcome-center-content');
      if (center && !center.classList.contains('reveal-zoom-in')) {
        center.classList.add('reveal-zoom-in');
      }
    }

    // Ocean Dreams Color Block Section
    const oceanGrid = sec.querySelector('.ocean-dreams-grid');
    if (oceanGrid) {
      const teal = oceanGrid.querySelector('.ocean-teal-pane');
      const sand = oceanGrid.querySelector('.ocean-sand-pane');
      if (teal && !teal.classList.contains('reveal-slide-left')) {
        teal.classList.add('reveal-slide-left');
      }
      if (sand && !sand.classList.contains('reveal-slide-right')) {
        sand.classList.add('reveal-slide-right');
      }
    }

    // Hotel Facilities 6-Box Grid (Progressive wave ripple)
    const facilityGrid = sec.querySelector('.facilities-grid-6');
    if (facilityGrid) {
      Array.from(facilityGrid.children).forEach((box, i) => {
        if (!box.classList.contains('reveal-fade-up')) {
          box.classList.add('reveal-fade-up');
          box.style.transitionDelay = `${(i % 3) * 0.15 + Math.floor(i / 3) * 0.1}s`;
        }
      });
    }

    // Triple Arched Room Showcase Cards
    const roomsGrid = sec.querySelector('.almaris-triple-arch-grid, .almaris-rooms-grid');
    if (roomsGrid) {
      Array.from(roomsGrid.children).forEach((card, i) => {
        if (!card.classList.contains('reveal-fade-up')) {
          card.classList.add('reveal-fade-up');
          card.style.transitionDelay = `${(i % 3) * 0.14}s`;
        }
      });
    }

    // Dining Tiles Cards
    const diningGrid = sec.querySelector('.dining-tiles-grid');
    if (diningGrid) {
      Array.from(diningGrid.children).forEach((tile, i) => {
        if (!tile.classList.contains('reveal-fade-up')) {
          tile.classList.add('reveal-fade-up');
          tile.style.transitionDelay = `${(i % 3) * 0.14}s`;
        }
      });
    }

    // Instagram 6-Photo Strip
    const instaGrid = sec.querySelector('.instagram-grid-6');
    if (instaGrid) {
      Array.from(instaGrid.children).forEach((tile, i) => {
        if (!tile.classList.contains('reveal-zoom-in')) {
          tile.classList.add('reveal-zoom-in');
          tile.style.transitionDelay = `${i * 0.08}s`;
        }
      });
    }

    // Citron Senses Balinese Spa split
    if (sec.id === 'wellness') {
      const containerRow = sec.querySelector('.container > div');
      if (containerRow && containerRow.children.length === 2) {
        if (!containerRow.children[0].classList.contains('reveal-slide-left')) {
          containerRow.children[0].classList.add('reveal-slide-left');
        }
        if (!containerRow.children[1].classList.contains('reveal-slide-right')) {
          containerRow.children[1].classList.add('reveal-slide-right');
        }
      }
    }

    // Sanctuaries deep-dive showcase rows (sanctuaries.html)
    const sanctuaryRow = sec.querySelectorAll('.sanctuary-showcase-row');
    sanctuaryRow.forEach((row, i) => {
      const media = row.querySelector('.sanctuary-showcase-media');
      const info = row.querySelector('.sanctuary-showcase-info');
      if (i % 2 === 0) {
        if (media) media.classList.add('reveal-slide-left');
        if (info) info.classList.add('reveal-slide-right');
      } else {
        if (media) media.classList.add('reveal-slide-right');
        if (info) info.classList.add('reveal-slide-left');
      }
    });

    // Spa rituals menu (wellness.html)
    const spaGrid = sec.querySelector('.spa-rituals-grid');
    if (spaGrid) {
      Array.from(spaGrid.children).forEach((rit, i) => {
        if (!rit.classList.contains('reveal-fade-up')) {
          rit.classList.add('reveal-fade-up');
          rit.style.transitionDelay = `${(i % 2) * 0.15}s`;
        }
      });
    }

    // Contact layout (contact.html)
    const contactGrid = sec.querySelector('.contact-layout-grid');
    if (contactGrid && contactGrid.children.length === 2) {
      if (!contactGrid.children[0].classList.contains('reveal-slide-left')) {
        contactGrid.children[0].classList.add('reveal-slide-left');
      }
      if (!contactGrid.children[1].classList.contains('reveal-slide-right')) {
        contactGrid.children[1].classList.add('reveal-slide-right');
      }
    }

    // Footer Columns Stagger
    const footerRow = sec.querySelector('.footer-top-row');
    if (footerRow) {
      Array.from(footerRow.children).forEach((col, i) => {
        if (!col.classList.contains('reveal-fade-up')) {
          col.classList.add('reveal-fade-up');
          col.style.transitionDelay = `${i * 0.12}s`;
        }
      });
    }
  });

  // 2. Also register hero arch stage and booking bar for bi-directional re-animation
  const archStage = document.querySelector('.almaris-arch-stage');
  if (archStage && !archStage.classList.contains('reveal-zoom-in')) {
    archStage.classList.add('reveal-zoom-in');
  }

  const bookingBar = document.querySelector('.almaris-booking-bar-wrapper');
  if (bookingBar && !bookingBar.classList.contains('reveal-fade-up')) {
    bookingBar.classList.add('reveal-fade-up');
  }

  // Query all animated elements
  const animTargets = document.querySelectorAll(
    '.reveal-fade-up, .reveal-slide-left, .reveal-slide-right, .reveal-zoom-in, .reveal-section'
  );

  if ('IntersectionObserver' in window) {
    // Bi-directional observer: animates both scrolling down AND scrolling up!
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        } else {
          // When scrolled out of viewport, reset so it smoothly re-animates when scrolling back in from top or bottom
          entry.target.classList.remove('revealed');
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -30px 0px',
      threshold: 0.12
    });

    animTargets.forEach(el => {
      observer.observe(el);
      // If in viewport on load, reveal immediately
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('revealed');
      }
    });

    // Safety for very top of the page
    window.addEventListener('scroll', () => {
      if (window.scrollY < 80) {
        if (archStage) archStage.classList.add('revealed');
        if (bookingBar) bookingBar.classList.add('revealed');
      }
    }, { passive: true });
  } else {
    // Fallback for older browsers
    animTargets.forEach(el => el.classList.add('revealed'));
  }
}
