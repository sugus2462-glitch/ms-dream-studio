/**
 * M.S Dream Studio - Main JavaScript
 * Interactive functionality, navigation, portfolio filtering, lightbox & contact form
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const header = document.getElementById('header');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTopBtn = document.getElementById('back-to-top');
  const currentYearSpan = document.getElementById('current-year');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');

  // Lightbox elements
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxOverlay = document.getElementById('lightbox-overlay');

  // Set dynamic year in footer
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // --- Sticky Header on Scroll ---
  const handleScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset;

    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    if (scrollY > 400) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }

    highlightNavOnScroll();
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  // --- Mobile Hamburger Menu Toggle ---
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.toggle('open');
      navToggle.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu if clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navMenu.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close menu if resized back to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- Active Link Highlighting Based on Section ---
  const sections = document.querySelectorAll('section[id]');

  function highlightNavOnScroll() {
    const scrollY = window.scrollY || window.pageYOffset;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    // If at the very bottom of the page, activate Contact
    if (scrollY + windowHeight >= docHeight - 40) {
      navLinks.forEach(link => {
        if (link.getAttribute('href') === '#contact') {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
      return;
    }

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 140;
      const sectionId = current.getAttribute('id');
      const matchingLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (matchingLink) {
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          matchingLink.classList.add('active');
        } else {
          matchingLink.classList.remove('active');
        }
      }
    });
  }

  // --- Portfolio Category Filtering ---
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');

        if (filterValue === 'all' || itemCategory === filterValue) {
          item.classList.remove('hidden');
          // Re-trigger animation cleanly
          item.style.animation = 'none';
          item.offsetHeight; // force reflow
          item.style.animation = 'fadeInUp 0.35s ease forwards';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // --- Lightbox Modal Logic ---
  window.openLightbox = function (imageUrl, captionText) {
    if (!lightboxModal || !lightboxImage) return;

    lightboxImage.src = imageUrl;
    lightboxCaption.textContent = captionText || 'M.S Dream Studio Portfolio Showcase';
    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Stop background scrolling
  };

  const closeLightbox = () => {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);

  // Close lightbox when clicking anywhere on the modal backdrop
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('active')) {
      closeLightbox();
    }
  });

  // Enable click on whole portfolio card (helpful on mobile & desktop)
  portfolioItems.forEach(item => {
    const card = item.querySelector('.portfolio-card');
    const previewBtn = item.querySelector('.preview-btn');

    if (card && previewBtn) {
      card.addEventListener('click', (e) => {
        // Prevent double trigger if user clicked directly on the preview-btn
        if (e.target.closest('.preview-btn')) return;
        previewBtn.click();
      });
    }
  });

  // --- Back to Top Click ---
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- Toast Notification Helper ---
  window.showToast = function (message, duration = 3500) {
    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;
    toast.classList.add('show');

    if (window._toastTimeout) {
      clearTimeout(window._toastTimeout);
    }

    window._toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  };

  // --- Global Service Selection Trigger ---
  window.selectService = function (event, serviceName) {
    if (event && event.preventDefault) {
      event.preventDefault();
    }

    // Support single parameter call fallback
    if (!serviceName && typeof event === 'string') {
      serviceName = event;
    }

    const serviceSelect = document.getElementById('service-select');
    const contactSection = document.getElementById('contact');

    if (serviceSelect && serviceName) {
      let found = false;
      for (let i = 0; i < serviceSelect.options.length; i++) {
        const optVal = serviceSelect.options[i].value.toLowerCase();
        const target = serviceName.toLowerCase();
        if (optVal.includes(target) || target.includes(optVal)) {
          serviceSelect.selectedIndex = i;
          found = true;
          break;
        }
      }

      if (!found) {
        serviceSelect.value = serviceName;
      }

      // Highlight the select input
      serviceSelect.focus();
      serviceSelect.parentElement.style.boxShadow = '0 0 0 3px rgba(236, 72, 153, 0.45)';
      setTimeout(() => {
        serviceSelect.parentElement.style.boxShadow = '';
      }, 2000);
    }

    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }

    window.showToast(`Selected "${serviceName}" in booking form!`);
  };

  // --- Contact Form Submission & Validation ---
  if (contactForm) {
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const serviceSelect = document.getElementById('service-select');
    const messageInput = document.getElementById('message');

    const nameError = document.getElementById('name-error');
    const phoneError = document.getElementById('phone-error');
    const emailError = document.getElementById('email-error');
    const serviceError = document.getElementById('service-error');
    const messageError = document.getElementById('message-error');

    const clearErrors = () => {
      [nameError, phoneError, emailError, serviceError, messageError].forEach(err => {
        if (err) err.textContent = '';
      });
    };

    // Real-time error clearing as user types
    nameInput.addEventListener('input', () => { if (nameError) nameError.textContent = ''; });
    phoneInput.addEventListener('input', () => { if (phoneError) phoneError.textContent = ''; });
    emailInput.addEventListener('input', () => { if (emailError) emailError.textContent = ''; });
    serviceSelect.addEventListener('change', () => { if (serviceError) serviceError.textContent = ''; });
    messageInput.addEventListener('input', () => { if (messageError) messageError.textContent = ''; });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();
      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        nameError.textContent = 'Please enter your full name.';
        isValid = false;
      } else if (nameInput.value.trim().length < 2) {
        nameError.textContent = 'Name should be at least 2 characters.';
        isValid = false;
      }

      // Validate Phone
      const phoneVal = phoneInput.value.trim();
      const phoneDigits = phoneVal.replace(/[^0-9]/g, '');
      if (!phoneVal) {
        phoneError.textContent = 'Please enter your contact phone number.';
        isValid = false;
      } else if (phoneDigits.length < 8) {
        phoneError.textContent = 'Please enter a valid phone number (at least 8 digits).';
        isValid = false;
      }

      // Validate Email (Optional, but if filled, validate format)
      const emailVal = emailInput.value.trim();
      if (emailVal) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailVal)) {
          emailError.textContent = 'Please enter a valid email address.';
          isValid = false;
        }
      }

      // Validate Service
      if (!serviceSelect.value) {
        serviceError.textContent = 'Please select a service you are interested in.';
        isValid = false;
      }

      // Validate Message
      if (!messageInput.value.trim()) {
        messageError.textContent = 'Please share a brief note about your requirements.';
        isValid = false;
      } else if (messageInput.value.trim().length < 5) {
        messageError.textContent = 'Please write at least 5 characters.';
        isValid = false;
      }

      if (!isValid) {
        window.showToast('Please fix the highlighted form errors.');
        return;
      }

      // Submit Success Handling
      const submitBtn = document.getElementById('submit-btn');
      const originalBtnHTML = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;

        // Show inline success message
        if (formSuccess) {
          formSuccess.style.display = 'flex';
          formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        window.showToast('Inquiry submitted! M.S Dream Studio will contact you soon.');

        // Reset inputs
        contactForm.reset();

        // Hide success message after 7 seconds
        setTimeout(() => {
          if (formSuccess) formSuccess.style.display = 'none';
        }, 7000);
      }, 850);
    });
  }

  // Image load fallback for offline testing
  const fallbackSvg = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22600%22%20viewBox%3D%220%200%20800%20600%22%3E%3Crect%20fill%3D%22%230f172a%22%20width%3D%22800%22%20height%3D%22600%22%2F%3E%3Ctext%20fill%3D%22%23ec4899%22%20font-family%3D%22sans-serif%22%20font-size%3D%2228%22%20font-weight%3D%22bold%22%20x%3D%2250%25%22%20y%3D%2248%25%22%20text-anchor%3D%22middle%22%3EM.S%20Dream%20Studio%3C%2Ftext%3E%3Ctext%20fill%3D%22%2394a3b8%22%20font-family%3D%22sans-serif%22%20font-size%3D%2218%22%20x%3D%2250%25%22%20y%3D%2255%25%22%20text-anchor%3D%22middle%22%3EStudio%20Showcase%20Preview%3C%2Ftext%3E%3C%2Fsvg%3E';

  document.querySelectorAll('img').forEach(img => {
    if (img.complete && img.naturalWidth === 0) {
      img.src = fallbackSvg;
    } else {
      img.addEventListener('error', function () {
        this.src = fallbackSvg;
      }, { once: true });
    }
  });
});
