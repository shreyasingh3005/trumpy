/**
 * Trumpy Adventure & Trampoline Park - Master Interactive Script
 * Sector 83, Gurugram | WhatsApp & Phone: +91 93151 25012
 */

document.addEventListener('DOMContentLoaded', () => {
  const WHATSAPP_NUMBER = '919315125012';

  /* ==========================================================================
     1. Sticky Navigation Header State
     ========================================================================== */
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  /* ==========================================================================
     2. Mobile Navigation Drawer
     ========================================================================== */
  const navToggles = document.querySelectorAll('.nav-toggle');
  const navDrawer = document.querySelector('.mobile-nav-drawer');
  const drawerClose = document.querySelector('.drawer-close');
  const drawerOverlay = document.querySelector('.drawer-overlay');

  function openDrawer() {
    navDrawer?.classList.add('active');
    drawerOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    navDrawer?.classList.remove('active');
    drawerOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  navToggles.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openDrawer();
    });
  });

  drawerClose?.addEventListener('click', closeDrawer);
  drawerOverlay?.addEventListener('click', closeDrawer);

  document.querySelectorAll('.mobile-nav-links a').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navDrawer?.classList.contains('active')) {
      closeDrawer();
    }
  });

  /* ==========================================================================
     3. Generic & Embedded Lead Form Handler (Auto WhatsApp Bridge)
     ========================================================================== */
  const successModal = document.querySelector('#successModal');
  const successClose = document.querySelector('#successClose');
  const whatsappSendBtn = document.querySelector('#whatsappSendBtn');

  let currentLeadData = null;

  document.querySelectorAll('form.lead-capture-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.querySelector('[name="name"]')?.value.trim() || 'Visitor';
      const phone = form.querySelector('[name="phone"]')?.value.trim() || '';
      const date = form.querySelector('[name="date"]')?.value || 'Upcoming Weekend';
      const guests = form.querySelector('[name="guests"]')?.value || 'Not specified';
      const packageSelected = form.querySelector('[name="package"]')?.value || 'General Jump & Adventure';
      const notes = form.querySelector('[name="notes"]')?.value || '';

      // Phone validation (at least 10 digits)
      const cleanPhone = phone.replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        alert('Please enter a valid 10-digit mobile number for booking confirmation.');
        return;
      }

      currentLeadData = {
        name,
        phone: cleanPhone,
        date,
        guests,
        packageSelected,
        notes
      };

      // Construct formatted WhatsApp message
      const textMessage = `*New Booking Request - Trumpy Trampoline Park*%0A%0A` +
        `👤 *Name:* ${encodeURIComponent(name)}%0A` +
        `📞 *Phone:* ${encodeURIComponent(cleanPhone)}%0A` +
        `📅 *Date:* ${encodeURIComponent(date)}%0A` +
        `👥 *Guests:* ${encodeURIComponent(guests)}%0A` +
        `🎯 *Package / Interest:* ${encodeURIComponent(packageSelected)}` +
        (notes ? `%0A📝 *Notes:* ${encodeURIComponent(notes)}` : '') +
        `%0A%0A_Sent via Trumpy Website Official Booking Engine_`;

      const waUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${textMessage}`;

      if (whatsappSendBtn) {
        whatsappSendBtn.href = waUrl;
      }

      // Show success modal
      if (successModal) {
        successModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      } else {
        // Fallback direct open
        window.open(waUrl, '_blank');
      }

      form.reset();
    });
  });

  successClose?.addEventListener('click', () => {
    successModal?.classList.remove('active');
    document.body.style.overflow = '';
  });

  /* ==========================================================================
     4. Quick Callback Drawer ("Request a 60-Sec Callback")
     ========================================================================== */
  const callbackToggle = document.querySelector('.callback-drawer-toggle');
  const callbackDrawer = document.querySelector('.callback-drawer');
  const callbackClose = document.querySelector('.callback-drawer-close');
  const callbackForm = document.querySelector('#callbackQuickForm');

  callbackToggle?.addEventListener('click', () => {
    callbackDrawer?.classList.toggle('active');
  });

  callbackClose?.addEventListener('click', () => {
    callbackDrawer?.classList.remove('active');
  });

  callbackForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = callbackForm.querySelector('[name="name"]')?.value.trim() || 'Visitor';
    const phone = callbackForm.querySelector('[name="phone"]')?.value.trim() || '';
    const cleanPhone = phone.replace(/\D/g, '');

    if (cleanPhone.length < 10) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }

    callbackDrawer?.classList.remove('active');

    const textMessage = `*⚡ Quick Callback Request - Trumpy Trampoline Park*%0A%0A` +
      `👤 *Name:* ${encodeURIComponent(name)}%0A` +
      `📞 *Phone:* ${encodeURIComponent(cleanPhone)}%0A` +
      `Requesting immediate callback for slot availability and pricing.`;

    const waUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${textMessage}`;
    
    if (whatsappSendBtn) {
      whatsappSendBtn.href = waUrl;
    }

    if (successModal) {
      successModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    } else {
      window.open(waUrl, '_blank');
    }

    callbackForm.reset();
  });

  /* ==========================================================================
     5. Exit-Intent & Scroll Discount Voucher Popup
     ========================================================================== */
  const exitModal = document.querySelector('#exitPopupModal');
  const exitClose = document.querySelector('#exitPopupClose');
  const exitForm = document.querySelector('#exitPopupForm');
  let popupShown = sessionStorage.getItem('trumpy_discount_shown') === 'true';

  function showExitModal() {
    if (!popupShown && exitModal) {
      exitModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      popupShown = true;
      sessionStorage.setItem('trumpy_discount_shown', 'true');
    }
  }

  // Desktop exit intent: mouse moving out towards address bar
  document.addEventListener('mouseleave', (e) => {
    if (e.clientY <= 10) {
      showExitModal();
    }
  });

  // Mobile fallback: trigger after 20 seconds or 55% scroll
  setTimeout(() => {
    if (!popupShown) showExitModal();
  }, 22000);

  window.addEventListener('scroll', () => {
    const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
    if (scrollPercent > 0.6 && !popupShown) {
      showExitModal();
    }
  });

  exitClose?.addEventListener('click', () => {
    exitModal?.classList.remove('active');
    document.body.style.overflow = '';
  });

  exitForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const phone = exitForm.querySelector('[name="phone"]')?.value.trim() || '';
    const cleanPhone = phone.replace(/\D/g, '');

    if (cleanPhone.length < 10) {
      alert('Please enter a valid 10-digit mobile number to claim discount.');
      return;
    }

    exitModal?.classList.remove('active');

    const textMessage = `*🎁 15% OFF Voucher Claimed - Trumpy Trampoline Park*%0A%0A` +
      `📞 *Phone:* ${encodeURIComponent(cleanPhone)}%0A` +
      `Voucher Code: *TRUMPY15*%0A` +
      `Please apply this 15% OFF discount on my upcoming booking!`;

    const waUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${textMessage}`;

    if (whatsappSendBtn) {
      whatsappSendBtn.href = waUrl;
    }

    if (successModal) {
      successModal.classList.add('active');
    } else {
      window.open(waUrl, '_blank');
    }

    exitForm.reset();
  });

  /* ==========================================================================
     6. Countdown Timer (Offers & Weekend Rush)
     ========================================================================== */
  function updateCountdown() {
    const timerHours = document.querySelector('#timerHours');
    const timerMinutes = document.querySelector('#timerMinutes');
    const timerSeconds = document.querySelector('#timerSeconds');

    if (!timerHours || !timerMinutes || !timerSeconds) return;

    const now = new Date();
    // Count down to midnight of today
    const midnight = new Date(now);
    midnight.setHours(23, 59, 59, 999);

    const diff = midnight - now;

    if (diff <= 0) {
      timerHours.textContent = '00';
      timerMinutes.textContent = '00';
      timerSeconds.textContent = '00';
      return;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    timerHours.textContent = String(hours).padStart(2, '0');
    timerMinutes.textContent = String(minutes).padStart(2, '0');
    timerSeconds.textContent = String(seconds).padStart(2, '0');
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  /* ==========================================================================
     7. Gallery Lightbox & Filter Tabs
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.querySelector('#lightboxModal');
  const lightboxImg = document.querySelector('#lightboxImg');
  const lightboxClose = document.querySelector('#lightboxClose');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img && lightboxModal && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  lightboxClose?.addEventListener('click', () => {
    lightboxModal?.classList.remove('active');
    document.body.style.overflow = '';
  });

  lightboxModal?.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  /* ==========================================================================
     8. FAQ Accordion Toggle
     ========================================================================== */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      // Close others
      faqItems.forEach(other => other.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

});
