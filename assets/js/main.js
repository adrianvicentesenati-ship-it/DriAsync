// CURSOR PERSONALIZADO
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
});

function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animateRing);
}
animateRing();

// NAVBAR SCROLL EFFECT
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
});

// PARTÍCULAS (CANVAS)
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [];

function resizeCanvas() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.r = Math.random() * 1.5 + 0.3;
        this.alpha = Math.random() * 0.5 + 0.1;
        this.color = Math.random() > 0.5 ? '79,142,247' : '155,92,246';
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > W) this.vx *= -1;
        if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
        ctx.fill();
    }
}

for (let i = 0; i < 90; i++) particles.push(new Particle());

function drawParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    // Conexiones entre partículas cercanas
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 130) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(79, 142, 247, ${(1 - dist / 130) * 0.08})`;
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(drawParticles);
}
drawParticles();

// HERO SHOWCASE GRID (animación con iconos)
const industriesData = [
    { label: '🔧 Ferreterías', color: '#4F8EF7', bg: 'linear-gradient(135deg,rgba(79,142,247,0.25),rgba(4,5,12,0.8))' },
    { label: '🎨 Pintura', color: '#9B5CF6', bg: 'linear-gradient(135deg,rgba(155,92,246,0.25),rgba(4,5,12,0.8))' },
    { label: '🍔 Comida rápida', color: '#4F8EF7', bg: 'linear-gradient(135deg,rgba(79,142,247,0.2),rgba(155,92,246,0.15))' },
    { label: '☕ Cafeterías', color: '#9B5CF6', bg: 'linear-gradient(135deg,rgba(155,92,246,0.2),rgba(79,142,247,0.15))' },
    { label: '✂️ Barberías', color: '#4F8EF7', bg: 'linear-gradient(135deg,rgba(79,142,247,0.25),rgba(155,92,246,0.1))' },
    { label: '🎉 Eventos', color: '#C084FC', bg: 'linear-gradient(135deg,rgba(192,132,252,0.2),rgba(4,5,12,0.8))' },
    { label: '💻 Tecnología', color: '#4F8EF7', bg: 'linear-gradient(135deg,rgba(79,142,247,0.3),rgba(4,5,12,0.7))' },
    { label: '🛒 Ecommerce', color: '#9B5CF6', bg: 'linear-gradient(135deg,rgba(155,92,246,0.25),rgba(4,5,12,0.8))' },
    { label: '🏢 Empresas', color: '#7BB3FF', bg: 'linear-gradient(135deg,rgba(123,179,255,0.2),rgba(155,92,246,0.15))' }
];

const showcaseGrid = document.getElementById('showcase-grid');
if (showcaseGrid) {
    industriesData.forEach(ind => {
        const card = document.createElement('div');
        card.className = 'showcase-card';
        card.innerHTML = `
            <div style="position:absolute;inset:0;background:${ind.bg};z-index:1;display:flex;align-items:center;justify-content:center;">
                <div style="font-size:2.2rem;filter:drop-shadow(0 0 10px ${ind.color})">${ind.label.split(' ')[0]}</div>
            </div>
            <div class="label">${ind.label}</div>
        `;
        showcaseGrid.appendChild(card);
    });
}

// Activar tarjetas aleatorias cada 1.2 segundos
let activeTimeout;
function animateShowcase() {
    const cards = document.querySelectorAll('.showcase-card');
    if (!cards.length) return;
    cards.forEach(c => c.classList.remove('active'));
    const count = Math.floor(Math.random() * 2) + 2; // 2 o 3
    const indices = [];
    while (indices.length < count) {
        const r = Math.floor(Math.random() * cards.length);
        if (!indices.includes(r)) indices.push(r);
    }
    indices.forEach(i => cards[i].classList.add('active'));
}
setInterval(animateShowcase, 1200);
animateShowcase();

// ABOUT SECTION: código de líneas animadas
const aboutCode = document.getElementById('about-code');
if (aboutCode) {
    const widths = [80, 60, 90, 40, 70, 50, 85, 65, 45, 75, 55, 80, 35, 90, 60];
    const colors = ['rgba(79,142,247,0.4)', 'rgba(155,92,246,0.35)', 'rgba(79,142,247,0.2)', 'rgba(255,255,255,0.08)'];
    widths.forEach((w, i) => {
        const line = document.createElement('div');
        line.className = 'code-line';
        line.style.cssText = `width:${w}%;background:${colors[i % colors.length]};animation-delay:${i * 0.2}s;`;
        aboutCode.appendChild(line);
    });
}

// SCROLL REVEAL (Intersection Observer)
const revealElements = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });
revealElements.forEach(el => observer.observe(el));

// Forzar visibilidad inmediata en hero para evitar parpadeo
document.querySelectorAll('#hero .reveal').forEach(el => el.classList.add('visible'));

// SMOOTH SCROLL para enlaces internos (opcional, complementa scroll-behavior)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Botón "Hablemos" del navbar (scroll a CTA)
const contactBtn = document.getElementById('contactBtn');
if (contactBtn) {
    contactBtn.addEventListener('click', () => {
        window.open('https://wa.me/51925476289?text=Hola%2C%20vi%20tu%20portafolio%20y%20me%20interesa%20trabajar%20contigo.', '_blank');
    });
}

// Botón "Contactar" de la tarjeta de perfil
const profileContactBtn = document.getElementById('profileContactBtn');
if (profileContactBtn) {
    profileContactBtn.addEventListener('click', () => {
        window.open('https://wa.me/51925476289?text=Hola%2C%20vi%20tu%20portafolio%20y%20me%20interesa%20trabajar%20contigo.', '_blank');
    });
}

// Botones de proyecto (simular alerta o redirección)
document.querySelectorAll('.btn-icon').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const projectName = btn.getAttribute('data-project') || 'este proyecto';
        alert(`🔗 Demo de ${projectName} próximamente.`);
    });
});