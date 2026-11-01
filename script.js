/**
 * ============================================================================
 * MR.SALL – CYBERSECURITY ACADEMY
 * Official Interactive Script
 * Pure Vanilla JavaScript (No Frameworks, No Backend, 100% Client-Side)
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. PRELOADER INITIALIZATION
     ========================================================================== */
  const initPreloader = () => {
    const preloader = document.getElementById('cyber-preloader');
    const progressBar = document.getElementById('preloader-progress');
    const statusText = document.getElementById('preloader-status');

    if (!preloader) return;

    const statuses = [
      '[SYS_INIT]: BOOTING ACADEMY MATRIX...',
      '[SEC_PROTOCOLS]: ESTABLISHING 256-BIT ENCRYPTION...',
      '[MODULES]: LOADING ARABIC & ENGLISH CURRICULUM...',
      '[FIREWALL]: INTEGRITY VERIFIED. ACCESS GRANTED.'
    ];

    let progress = 0;
    let statusIndex = 0;

    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 20) + 15;
      if (progress > 100) progress = 100;

      if (progressBar) progressBar.style.width = `${progress}%`;

      if (statusIndex < statuses.length && progress >= (statusIndex + 1) * 25) {
        if (statusText) statusText.textContent = statuses[statusIndex];
        statusIndex++;
      }

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          preloader.classList.add('fade-out');
          setTimeout(() => preloader.remove(), 700);
        }, 300);
      }
    }, 90);
  };

  /* ==========================================================================
     2. DYNAMIC CYBER PARTICLES CANVAS
     ========================================================================== */
  const initCyberCanvas = () => {
    const canvas = document.getElementById('cyber-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor((width * height) / 18000), 75);

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.radius = Math.random() * 1.8 + 0.8;
        // Alternating neon colors
        this.color = Math.random() > 0.5 ? '#00ff9d' : '#00d2ff';
        this.alpha = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const connectParticles = () => {
      const maxDistance = 120;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxDistance) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = '#00ff9d';
            ctx.globalAlpha = (1 - dist / maxDistance) * 0.15;
            ctx.lineWidth = 0.7;
            ctx.stroke();
            ctx.restore();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      connectParticles();
      requestAnimationFrame(animate);
    };

    animate();
  };

  /* ==========================================================================
     3. NAVIGATION, SCROLL STATES & MOBILE MENU
     ========================================================================== */
  const initNavigation = () => {
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sticky shadow on scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar?.classList.add('scrolled');
      } else {
        navbar?.classList.remove('scrolled');
      }
    });

    // Mobile Toggle
    if (menuToggle && navMenu) {
      menuToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('open');
        menuToggle.classList.toggle('open', isOpen);
        menuToggle.setAttribute('aria-expanded', isOpen);
      });

      // Close mobile menu when a nav link is clicked
      navLinks.forEach((link) => {
        link.addEventListener('click', () => {
          navMenu.classList.remove('open');
          menuToggle.classList.remove('open');
          menuToggle.setAttribute('aria-expanded', 'false');
        });
      });

      // Close when clicking outside
      document.addEventListener('click', (e) => {
        if (!navbar?.contains(e.target)) {
          navMenu.classList.remove('open');
          menuToggle.classList.remove('open');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // Active link highlighting on scroll
    const sections = document.querySelectorAll('section[id]');
    const highlightActiveNav = () => {
      const scrollY = window.pageYOffset;
      sections.forEach((current) => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 120;
        const sectionId = current.getAttribute('id');
        const activeLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach((l) => l.classList.remove('active'));
          activeLink?.classList.add('active');
        }
      });
    };
    window.addEventListener('scroll', highlightActiveNav);
  };

  /* ==========================================================================
     4. LOCAL STORAGE REGISTRATION SYSTEM (SECTION 5)
     ========================================================================== */
  const initRegistration = () => {
    const form = document.getElementById('academy-registration-form');
    const firstNameInput = document.getElementById('first-name');
    const lastNameInput = document.getElementById('last-name');
    const firstNameError = document.getElementById('first-name-error');
    const lastNameError = document.getElementById('last-name-error');
    const feedbackBox = document.getElementById('registration-feedback');
    const feedbackIcon = document.getElementById('feedback-icon');
    const feedbackMessage = document.getElementById('feedback-message');
    const existingBadge = document.getElementById('existing-student-badge');
    const badgeDisplayName = document.getElementById('badge-display-name');
    const badgeDisplayId = document.getElementById('badge-display-id');
    const btnEditStudent = document.getElementById('btn-edit-student');
    const btnResetStudent = document.getElementById('btn-reset-student');
    const navStudentPill = document.getElementById('nav-student-pill');
    const navStudentName = document.getElementById('nav-student-name');

    const STORAGE_KEY = 'mrsall_academy_student';

    // Show feedback alert
    const showFeedback = (type, message) => {
      if (!feedbackBox || !feedbackMessage || !feedbackIcon) return;
      feedbackBox.className = `feedback-alert ${type}`;
      feedbackIcon.textContent = type === 'success' ? '🎉' : '⚠️';
      feedbackMessage.innerHTML = message;
      feedbackBox.classList.remove('hidden');
    };

    // Hide feedback alert
    const hideFeedback = () => {
      if (feedbackBox) feedbackBox.classList.add('hidden');
    };

    // Update UI when registered
    const updateStudentUI = (student) => {
      if (student && student.firstName && student.lastName) {
        // Nav pill
        if (navStudentPill && navStudentName) {
          navStudentName.textContent = `${student.firstName} ${student.lastName}`;
          navStudentPill.classList.remove('hidden');
        }

        // Registration badge
        if (existingBadge && badgeDisplayName && badgeDisplayId) {
          badgeDisplayName.textContent = `${student.firstName} ${student.lastName}`;
          badgeDisplayId.textContent = student.studentId || '#MR-2026';
          existingBadge.classList.remove('hidden');
        }

        // Fill inputs
        if (firstNameInput) firstNameInput.value = student.firstName;
        if (lastNameInput) lastNameInput.value = student.lastName;
      } else {
        if (navStudentPill) navStudentPill.classList.add('hidden');
        if (existingBadge) existingBadge.classList.add('hidden');
        if (firstNameInput) firstNameInput.value = '';
        if (lastNameInput) lastNameInput.value = '';
      }
    };

    // Load from LocalStorage
    const loadStoredStudent = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const student = JSON.parse(raw);
          updateStudentUI(student);
          return student;
        }
      } catch (err) {
        console.warn('LocalStorage error:', err);
      }
      return null;
    };

    // Initial check
    loadStoredStudent();

    // Reset button
    btnResetStudent?.addEventListener('click', () => {
      if (confirm('هل أنت متأكد من رغبتك في إلغاء تسجيل الطالب المحلي من هذا المتصفح؟')) {
        localStorage.removeItem(STORAGE_KEY);
        updateStudentUI(null);
        hideFeedback();
        showFeedback('success', 'تم إلغاء التسجيل المحلي بنجاح. يمكنك التسجيل مجدداً في أي وقت.');
      }
    });

    // Edit button
    btnEditStudent?.addEventListener('click', () => {
      firstNameInput?.focus();
    });

    // Form submission
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        hideFeedback();

        // Clear previous errors
        if (firstNameError) firstNameError.textContent = '';
        if (lastNameError) lastNameError.textContent = '';
        firstNameInput?.classList.remove('is-invalid');
        lastNameInput?.classList.remove('is-invalid');

        const firstName = firstNameInput?.value.trim() || '';
        const lastName = lastNameInput?.value.trim() || '';

        let isValid = true;

        if (!firstName) {
          isValid = false;
          firstNameInput?.classList.add('is-invalid');
          if (firstNameError) firstNameError.textContent = 'يرجى إدخال الاسم الأول.';
        }

        if (!lastName) {
          isValid = false;
          lastNameInput?.classList.add('is-invalid');
          if (lastNameError) lastNameError.textContent = 'يرجى إدخال اسم العائلة / اللقب.';
        }

        if (!isValid) {
          showFeedback('error', 'يرجى ملء كلا الحقلين لإتمام التسجيل المحلي.');
          return;
        }

        // Generate student ID
        const studentId = '#MR-' + Math.floor(1000 + Math.random() * 9000);
        const studentData = {
          firstName,
          lastName,
          studentId,
          registeredAt: new Date().toISOString()
        };

        // Save to localStorage
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(studentData));
        } catch (err) {
          console.error('LocalStorage write error:', err);
        }

        // Update UI
        updateStudentUI(studentData);

        // Display success message
        showFeedback(
          'success',
          `<strong>تهانينا يا ${firstName} ${lastName}!</strong> تم تسجيلك بنجاح في أكاديمية MR.SALL برقم العضوية <code>${studentId}</code>. جاري نقلك إلى قسم الدورات التعليمية...`
        );

        // Requirement: Automatically scroll to the courses section after successful registration!
        setTimeout(() => {
          const coursesSection = document.getElementById('courses');
          if (coursesSection) {
            coursesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // Highlight courses briefly
            coursesSection.style.transition = 'box-shadow 0.8s ease';
            coursesSection.style.boxShadow = 'inset 0 0 40px rgba(0, 255, 157, 0.3)';
            setTimeout(() => {
              coursesSection.style.boxShadow = '';
            }, 2000);
          }
        }, 1200);
      });
    }
  };

  /* ==========================================================================
     5. COURSES FILTER & LIVE SEARCH (SECTION 6)
     ========================================================================== */
  const initCoursesFilter = () => {
    const tabButtons = document.querySelectorAll('.course-tab-btn');
    const searchInput = document.getElementById('course-search-input');
    const searchClearBtn = document.getElementById('search-clear-btn');
    const courseCards = document.querySelectorAll('.course-card');
    const resultsCountText = document.getElementById('results-count-text');
    const noCoursesMsg = document.getElementById('no-courses-msg');
    const resetFilterBtn = document.getElementById('reset-filter-btn');

    let currentFilter = 'all';
    let currentSearchQuery = '';

    const filterCourses = () => {
      let visibleCount = 0;
      const query = currentSearchQuery.toLowerCase().trim();

      courseCards.forEach((card) => {
        const category = card.getAttribute('data-category'); // 'arabic' or 'english'
        const title = (card.getAttribute('data-title') || '').toLowerCase();
        const author = (card.getAttribute('data-author') || '').toLowerCase();

        const matchesCategory = currentFilter === 'all' || category === currentFilter;
        const matchesSearch = !query || title.includes(query) || author.includes(query);

        if (matchesCategory && matchesSearch) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      // Update counter
      if (resultsCountText) {
        resultsCountText.textContent = `يتم عرض ${visibleCount} من أصل 8 دورات تدريبية متوفرة`;
      }

      // No results message
      if (noCoursesMsg) {
        if (visibleCount === 0) {
          noCoursesMsg.classList.remove('hidden');
        } else {
          noCoursesMsg.classList.add('hidden');
        }
      }
    };

    // Tab button click
    tabButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        tabButtons.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        currentFilter = btn.getAttribute('data-filter') || 'all';
        filterCourses();
      });
    });

    // Search input typing
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        currentSearchQuery = e.target.value;
        if (searchClearBtn) {
          if (currentSearchQuery.length > 0) {
            searchClearBtn.classList.remove('hidden');
          } else {
            searchClearBtn.classList.add('hidden');
          }
        }
        filterCourses();
      });
    }

    // Search clear button
    searchClearBtn?.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      currentSearchQuery = '';
      searchClearBtn.classList.add('hidden');
      filterCourses();
      searchInput?.focus();
    });

    // Reset filter button
    resetFilterBtn?.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      currentSearchQuery = '';
      searchClearBtn?.classList.add('hidden');

      tabButtons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      const allTab = document.querySelector('.course-tab-btn[data-filter="all"]');
      allTab?.classList.add('active');
      allTab?.setAttribute('aria-selected', 'true');

      currentFilter = 'all';
      filterCourses();
    });
  };

  /* ==========================================================================
     6. EMBEDDED VIDEO MODAL PLAYER
     ========================================================================== */
  const initVideoModal = () => {
    const modal = document.getElementById('video-modal');
    const modalIframe = document.getElementById('modal-video-iframe');
    const modalTitle = document.getElementById('modal-video-title');
    const modalExternalLink = document.getElementById('modal-external-link');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalBackdrop = document.getElementById('modal-backdrop');

    if (!modal) return;

    const openModal = (embedUrl, title, directUrl) => {
      if (modalIframe) {
        // Add autoplay parameter to embed
        const hasQuery = embedUrl.includes('?');
        const sep = hasQuery ? '&' : '?';
        modalIframe.src = `${embedUrl}${sep}autoplay=1`;
      }
      if (modalTitle) modalTitle.textContent = title;
      if (modalExternalLink) modalExternalLink.href = directUrl || embedUrl;

      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
      modal.classList.add('hidden');
      if (modalIframe) modalIframe.src = ''; // Stops playback immediately
      document.body.style.overflow = '';
    };

    // Attach to all watch buttons & play triggers
    document.querySelectorAll('.btn-play-course, .btn-play-trigger').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const embedUrl = btn.getAttribute('data-embed');
        const title = btn.getAttribute('data-title') || 'دورة تدريبية';
        const directUrl = btn.getAttribute('data-url') || embedUrl;

        if (embedUrl) {
          openModal(embedUrl, title, directUrl);
        }
      });
    });

    modalCloseBtn?.addEventListener('click', closeModal);
    modalBackdrop?.addEventListener('click', closeModal);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
      }
    });
  };

  /* ==========================================================================
     7. COPY EMAIL TO CLIPBOARD
     ========================================================================== */
  const initCopyEmail = () => {
    const copyBtn = document.getElementById('copy-email-btn');
    const tooltip = document.getElementById('copy-tooltip');
    const emailToCopy = 'salehebachike@gmail.com';

    if (!copyBtn) return;

    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(emailToCopy);
        copyBtn.classList.add('copied');
        if (tooltip) tooltip.textContent = 'تم النسخ بنجاح! ✔';

        setTimeout(() => {
          copyBtn.classList.remove('copied');
          if (tooltip) tooltip.textContent = 'نسخ البريد';
        }, 2200);
      } catch (err) {
        // Fallback
        const textArea = document.createElement('textarea');
        textArea.value = emailToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);

        copyBtn.classList.add('copied');
        if (tooltip) tooltip.textContent = 'تم النسخ بنجاح! ✔';
        setTimeout(() => {
          copyBtn.classList.remove('copied');
          if (tooltip) tooltip.textContent = 'نسخ البريد';
        }, 2200);
      }
    });
  };

  /* ==========================================================================
     8. BACK TO TOP BUTTON WITH SCROLL PROGRESS RING
     ========================================================================== */
  const initBackToTop = () => {
    const backToTopBtn = document.getElementById('back-to-top');
    const progressCircle = document.querySelector('.progress-ring-circle');
    if (!backToTopBtn) return;

    const circumference = 2 * Math.PI * 21; // ~131.9

    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? scrollPos / docHeight : 0;

      // Toggle button visibility
      if (scrollPos > 320) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }

      // Update ring offset
      if (progressCircle) {
        const offset = circumference - scrollPercent * circumference;
        progressCircle.style.strokeDashoffset = offset;
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  /* ==========================================================================
     9. SCROLL REVEAL ENTRANCE ANIMATIONS
     ========================================================================== */
  const initScrollAnimations = () => {
    const targets = document.querySelectorAll(
      '.definition-card, .triad-card, .branch-card, .course-card, .founder-card, .registration-card, .contact-card'
    );

    targets.forEach((el) => el.classList.add('reveal-on-scroll'));

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );

      targets.forEach((el) => observer.observe(el));
    } else {
      // Fallback for older browsers
      targets.forEach((el) => el.classList.add('is-visible'));
    }
  };

  /* ==========================================================================
     10. INITIALIZE ALL COMPONENTS
     ========================================================================== */
  initPreloader();
  initCyberCanvas();
  initNavigation();
  initRegistration();
  initCoursesFilter();
  initVideoModal();
  initCopyEmail();
  initBackToTop();
  initScrollAnimations();
});
