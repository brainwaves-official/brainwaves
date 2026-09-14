/* =========================================================
   Brain Waves — shared site script
   ========================================================= */

/* ---- 1. Header scroll state ---- */
const header = document.getElementById('siteHeader');
if (header) {
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 30);
  document.addEventListener('scroll', onScroll);
  onScroll();
}

/* ---- 2. Mobile nav toggle ---- */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => navLinks.classList.remove('open'))
  );
}

/* ---- 3. Reveal on scroll ---- */
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); revealObserver.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));
}

/* ---- 4. Workflow / process node sequential light-up ---- */
const flowRail = document.getElementById('flowRail');
if (flowRail) {
  const flowNodes = flowRail.querySelectorAll('.flow-node');
  const flowObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        flowNodes.forEach((node, i) => setTimeout(() => node.classList.add('active'), i * 160));
        flowObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  flowObserver.observe(flowRail);
}

/* ---- 5. Ambient neural-particle background ---- */
const canvas = document.getElementById('bgfx');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let w, h, particles = [];
  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = document.body.scrollHeight;
  }
  function initParticles() {
    const count = Math.min(70, Math.floor(window.innerWidth / 22));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.15, vy: (Math.random() - 0.5) * 0.15,
      r: Math.random() * 1.6 + 0.6,
      hue: Math.random() > 0.5 ? 'rgba(37,99,235,' : 'rgba(124,58,237,'
    }));
  }
  function step() {
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.hue + '0.35)';
      ctx.fill();
    }
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y, dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = 'rgba(124,58,237,' + (0.06 * (1 - dist / 120)) + ')';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(step);
  }
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion) {
    resize(); initParticles(); step();
    window.addEventListener('resize', () => { resize(); initParticles(); });
  }
}

/* =========================================================
   6. Contact form -> Google Sheet (via Google Apps Script)
   ---------------------------------------------------------
   SETUP (one-time, takes about 5 minutes):
   1. Create a Google Sheet. Add a header row:
        Timestamp | Name | Email | Message
   2. In the Sheet, go to Extensions -> Apps Script.
   3. Delete any starter code and paste the contents of
      google-apps-script.gs (included in this project).
   4. Click Deploy -> New deployment -> select type "Web app".
        - Execute as: Me
        - Who has access: Anyone
   5. Click Deploy, authorize it, then copy the Web App URL
      (ends in /exec).
   6. Paste that URL below as SHEET_WEBAPP_URL.
   ========================================================= */
const SHEET_WEBAPP_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const submitBtn = contactForm.querySelector('.submit-btn');
  const msgBox = document.getElementById('formMsg');

  function showMessage(text, type) {
    msgBox.textContent = text;
    msgBox.className = 'form-msg show ' + type;
  }

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('cf-name').value.trim();
    const email = document.getElementById('cf-email').value.trim();
    const message = document.getElementById('cf-msg').value.trim();

    if (!name || !email || !message) {
      showMessage('Please fill in every field before sending.', 'err');
      return;
    }

    if (SHEET_WEBAPP_URL.indexOf('PASTE_YOUR') === 0) {
      showMessage(
        'This form isn\u2019t connected to a Google Sheet yet. Follow the setup steps in js/main.js / README.md, then paste your Apps Script Web App URL in.',
        'err'
      );
      return;
    }

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
      // Apps Script web apps don't return CORS headers when called cross-origin,
      // so we send the request in "no-cors" mode. We can't read the response body,
      // but the row is still appended to the Sheet on Google's side.
      await fetch(SHEET_WEBAPP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ name, email, message, page: 'contact.html' })
      });

      showMessage('Thanks, ' + name.split(' ')[0] + ' — your message has been saved. We\u2019ll get back to you soon.', 'ok');
      contactForm.reset();
    } catch (err) {
      showMessage('Something went wrong sending your message. Please try again, or email us directly.', 'err');
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });
}
