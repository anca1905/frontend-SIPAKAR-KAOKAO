/* ============================================================
   SIPAKAR KAKAO – landing.js
   Landing Page Interactions & Animations
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

    // ---- Navbar scroll effect ----
    const navbar = document.getElementById('mainNav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ---- Mobile hamburger toggle ----
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.getElementById('navLinks');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
        // Close when a link is clicked
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => navLinks.classList.remove('open'));
        });
    }

    // ---- Animated number counter (stats strip) ----
    function animateCounter(el, target, duration) {
        let start = 0;
        const step = Math.ceil(target / (duration / 16));
        const timer = setInterval(() => {
            start += step;
            if (start >= target) {
                start = target;
                clearInterval(timer);
            }
            el.textContent = start.toLocaleString('id-ID');
        }, 16);
    }

    // Setup IntersectionObserver untuk memulai animasi counter saat terlihat
    function initCounterObserver() {
        const statNums = document.querySelectorAll('.stat-num');
        if (!statNums.length) return;

        const counterObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el     = entry.target;
                    const target = parseInt(el.getAttribute('data-target'), 10);
                    animateCounter(el, target, 1500);
                    obs.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        statNums.forEach(el => counterObserver.observe(el));
    }

    // Fetch statistik dinamis dari database, lalu mulai counter
    async function loadLandingStats() {
        try {
            const res  = await fetch('api/api_statistik_landing.php');
            const data = await res.json();

            if (data.status === 'ok') {
                // Petani Terbantu
                const elPetani = document.getElementById('stat-petani');
                if (elPetani && data.petani_terbantu > 0) {
                    elPetani.setAttribute('data-target', data.petani_terbantu);
                }

                // Jenis Penyakit / Hama
                const elPenyakit = document.getElementById('stat-penyakit');
                if (elPenyakit && data.jenis_penyakit > 0) {
                    elPenyakit.setAttribute('data-target', data.jenis_penyakit);
                }

                // Kasus Diagnosis
                const elKasus = document.getElementById('stat-kasus');
                if (elKasus && data.kasus_diagnosis > 0) {
                    elKasus.setAttribute('data-target', data.kasus_diagnosis);
                }

                // Tingkat Akurasi
                const elAkurasi = document.getElementById('stat-akurasi');
                if (elAkurasi && data.tingkat_akurasi > 0) {
                    elAkurasi.setAttribute('data-target', data.tingkat_akurasi);
                }

                // Hero float card — kasus tersimpan CBR
                const elHeroKasus = document.getElementById('hero-kasus-cbr');
                if (elHeroKasus && data.kasus_tersimpan > 0) {
                    // Format ribuan dengan titik (misal 1.200)
                    elHeroKasus.textContent = data.kasus_tersimpan.toLocaleString('id-ID');
                }
            }
        } catch (err) {
            // Gagal fetch → biarkan nilai default di data-target (tetap statis)
            console.warn('SIPAKAR: Gagal memuat statistik dari server.', err);
        } finally {
            // Selalu mulai animasi, baik API berhasil maupun gagal
            initCounterObserver();
        }
    }

    loadLandingStats();

    // ---- Scroll-reveal animation ----
    const revealEls = document.querySelectorAll(
        '.feature-card-new, .step-card, .testi-card, .team-card, .about-feature-item, .stat-item'
    );

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity    = '1';
                entry.target.style.transform  = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach((el, i) => {
        el.style.opacity   = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${(i % 4) * 0.1}s, transform 0.6s ease ${(i % 4) * 0.1}s`;
        revealObserver.observe(el);
    });

    // ---- Active nav link highlight on scroll ----
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinkEls = document.querySelectorAll('.nav-link');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinkEls.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').includes(id)) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(sec => sectionObserver.observe(sec));

    // ---- Smooth hero entrance ----
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity   = '0';
        heroContent.style.transform = 'translateY(40px)';
        setTimeout(() => {
            heroContent.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
            heroContent.style.opacity    = '1';
            heroContent.style.transform  = 'translateY(0)';
        }, 100);
    }
    const heroImageWrap = document.querySelector('.hero-image-wrap');
    if (heroImageWrap) {
        heroImageWrap.style.opacity   = '0';
        heroImageWrap.style.transform = 'translateY(40px)';
        setTimeout(() => {
            heroImageWrap.style.transition = 'opacity 0.9s ease 0.25s, transform 0.9s ease 0.25s';
            heroImageWrap.style.opacity    = '1';
            heroImageWrap.style.transform  = 'translateY(0)';
        }, 100);
    }

});
