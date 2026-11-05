/* =========================================================
   STAR-BOUND PORTFOLIO
   1. Animated starfield (canvas) with parallax + shooting stars
   2. Typing effect
   3. Scroll reveal
   4. Card spotlight + cursor glow
   5. Constellation lines between project cards
   ========================================================= */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- 1. STARFIELD ---------- */
const canvas = document.getElementById('sky');
const ctx = canvas.getContext('2d');

let w, h, dpr;
let stars = [];
let shooting = [];
let mouseX = 0, mouseY = 0;      // target (-1 to 1)
let smoothX = 0, smoothY = 0;    // eased

const STAR_COLORS = ['255,255,255', '200,215,255', '255,235,200', '230,200,255'];

function resizeSky() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.min(Math.floor((w * h) / 4000), 500);
    stars = Array.from({ length: count }, () => {
        const depth = Math.random();                 // 0 = far, 1 = near
        return {
            x: Math.random() * w,
            y: Math.random() * h,
            depth,
            r: 0.3 + depth * 1.5,
            phase: Math.random() * Math.PI * 2,
            speed: 0.5 + Math.random() * 1.8,
            color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
        };
    });
}

function spawnShootingStar() {
    const startX = Math.random() * w * 0.8;
    const startY = Math.random() * h * 0.4;
    shooting.push({
        x: startX,
        y: startY,
        vx: 9 + Math.random() * 6,
        vy: 4 + Math.random() * 3,
        life: 0,
        max: 55 + Math.random() * 25,
    });
}

function drawSky(t) {
    ctx.clearRect(0, 0, w, h);

    smoothX += (mouseX - smoothX) * 0.05;
    smoothY += (mouseY - smoothY) * 0.05;
    const scroll = window.scrollY;

    for (const s of stars) {
        // Nearer stars move more = parallax depth
        const px = s.x + smoothX * 40 * s.depth;
        let py = (s.y - scroll * 0.15 * s.depth + smoothY * 40 * s.depth) % h;
        if (py < 0) py += h;

        const twinkle = 0.55 + 0.45 * Math.sin(t * 0.001 * s.speed + s.phase);
        const alpha = (0.25 + s.depth * 0.75) * twinkle;

        // soft glow for bigger stars
        if (s.r > 1.1) {
            ctx.beginPath();
            ctx.fillStyle = `rgba(${s.color}, ${alpha * 0.15})`;
            ctx.arc(px, py, s.r * 4, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.beginPath();
        ctx.fillStyle = `rgba(${s.color}, ${alpha})`;
        ctx.arc(px, py, s.r, 0, Math.PI * 2);
        ctx.fill();

        // little cross sparkle on the brightest stars
        if (s.r > 1.6 && twinkle > 0.85) {
            ctx.strokeStyle = `rgba(${s.color}, ${alpha * 0.7})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(px - s.r * 4, py); ctx.lineTo(px + s.r * 4, py);
            ctx.moveTo(px, py - s.r * 4); ctx.lineTo(px, py + s.r * 4);
            ctx.stroke();
        }
    }

    // shooting stars
    for (let i = shooting.length - 1; i >= 0; i--) {
        const m = shooting[i];
        m.x += m.vx; m.y += m.vy; m.life++;
        const fade = 1 - m.life / m.max;
        const tail = 14;
        const grad = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * tail, m.y - m.vy * tail);
        grad.addColorStop(0, `rgba(255,255,255,${fade})`);
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x - m.vx * tail, m.y - m.vy * tail);
        ctx.stroke();
        if (m.life > m.max) shooting.splice(i, 1);
    }

    if (!reduceMotion) requestAnimationFrame(drawSky);
}

function shootingLoop() {
    spawnShootingStar();
    setTimeout(shootingLoop, 3500 + Math.random() * 5000);
}

window.addEventListener('resize', () => { resizeSky(); drawConstellation(); });
window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / w) * 2 - 1;
    mouseY = (e.clientY / h) * 2 - 1;
});

resizeSky();
requestAnimationFrame(drawSky);
if (!reduceMotion) setTimeout(shootingLoop, 2000);

/* ---------- 2. TYPING EFFECT ---------- */
const roles = [
    'BSc Computer Science Student @ Leeds Beckett',
    'Aspiring Software Engineer',
    'Data & Analytics Enthusiast',
    'Full-Stack Web Explorer',
];
const typedEl = document.getElementById('typed');
let roleIdx = 0, charIdx = 0, deleting = false;

function typeLoop() {
    const current = roles[roleIdx];
    typedEl.textContent = current.slice(0, charIdx);

    if (!deleting && charIdx < current.length) {
        charIdx++;
        setTimeout(typeLoop, 55);
    } else if (!deleting) {
        deleting = true;
        setTimeout(typeLoop, 1800);
    } else if (charIdx > 0) {
        charIdx--;
        setTimeout(typeLoop, 28);
    } else {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        setTimeout(typeLoop, 400);
    }
}
if (reduceMotion) typedEl.textContent = roles[0]; else typeLoop();

/* ---------- 3. SCROLL REVEAL ---------- */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 90}ms`;
    revealObserver.observe(el);
});

/* ---------- 4. CARD SPOTLIGHT + CURSOR GLOW ---------- */
document.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
});

const glow = document.getElementById('cursorGlow');
window.addEventListener('mousemove', (e) => {
    glow.style.opacity = '1';
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
});

/* ---------- 5. CONSTELLATION LINES ---------- */
function drawConstellation() {
    const svg = document.getElementById('constellationLines');
    const grid = document.getElementById('projectGrid');
    if (!svg || !grid) return;

    svg.innerHTML = '';
    if (window.innerWidth <= 760) return;   // hidden on mobile

    const nodes = [...grid.querySelectorAll('.star-node')];
    const points = nodes.map((n) => {
        const card = n.parentElement;
        return { x: card.offsetLeft + card.offsetWidth - 24, y: card.offsetTop + 22 };
    });

    for (let i = 0; i < points.length - 1; i++) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', points[i].x);
        line.setAttribute('y1', points[i].y);
        line.setAttribute('x2', points[i + 1].x);
        line.setAttribute('y2', points[i + 1].y);
        svg.appendChild(line);
    }
}
window.addEventListener('load', drawConstellation);
// Cards animate in, so redraw once things have settled
setTimeout(drawConstellation, 1200);

/* ---------- FOOTER YEAR ---------- */
document.getElementById('year').textContent = new Date().getFullYear();