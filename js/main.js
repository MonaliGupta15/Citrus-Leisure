/**
 * CITRUS LEISURE PLC — ALMARIS LUXURY HOTEL THEME JAVASCRIPT
 * Inspired by Almaris Luxury Hotel Template (Designesia)
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initSidebarDrawer();
  initBookingBar();
  initCurrencyEngine();
  initHeroSlider();
  initRoomFilterTabs();
});

/* ==========================================================================
   1. STICKY HEADER
   ========================================================================== */
function initHeaderScroll() {
  const header = document.getElementById('almarisHeader');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
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

  const open = () => {
    drawer.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    drawer.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  openBtn.addEventListener('click', open);
  if (closeBtn) closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', close);

  const links = drawer.querySelectorAll('a');
  links.forEach(l => l.addEventListener('click', close));
}

/* ==========================================================================
   3. HERO SLIDER TRANSITIONS
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

window.switchHeroSlide = (key) => {
  const slides = document.querySelectorAll('.hero-slide-item');
  slides.forEach(s => {
    if (s.getAttribute('data-slide') === key) {
      s.classList.add('active');
    } else {
      s.classList.remove('active');
    }
  });

  const titleEl = document.getElementById('archTitle');
  const descEl = document.getElementById('archDesc');
  const data = heroData[key] || heroData.all;

  if (titleEl && descEl) {
    titleEl.style.opacity = '0';
    descEl.style.opacity = '0';
    setTimeout(() => {
      titleEl.textContent = data.title;
      descEl.textContent = data.desc;
      titleEl.style.opacity = '1';
      descEl.style.opacity = '1';
    }, 200);
  }
};

function initHeroSlider() {
  let idx = 0;
  const keys = ['all', 'waskaduwa', 'hikkaduwa', 'steuart'];
  // Auto subtle cycle every 9 seconds
  setInterval(() => {
    idx = (idx + 1) % keys.length;
    switchHeroSlide(keys[idx]);
  }, 9000);
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
    toast.style.cssText = 'position: fixed; bottom: 24px; right: 24px; background: #1a1d24; border: 1px solid #c5a880; color: #fff; padding: 14px 24px; border-radius: 4px; box-shadow: 0 10px 30px rgba(0,0,0,0.6); z-index: 4000; font-size: 0.85rem; transform: translateY(20px); opacity: 0; transition: all 0.3s ease;';
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
