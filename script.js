// Canvas Background with Flowing Particles
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
let animationId;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.alpha = Math.random() * 0.3 + 0.1;
        this.size = Math.random() * 1.5 + 0.5;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }

    draw() {
        ctx.fillStyle = `rgba(212, 165, 165, ${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles.length = 0;
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }
}

function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                ctx.strokeStyle = `rgba(212, 165, 165, ${0.1 * (1 - distance / 150)})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.fillStyle = 'rgba(15, 15, 15, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    drawConnections();
    animationId = requestAnimationFrame(animate);
}

initParticles();
animate();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Navigation
function initNav() {
    const enterBtn = document.getElementById('enterBtn');
    const resetBtn = document.getElementById('resetBtn');
    const intro = document.getElementById('intro');
    const confessions = document.getElementById('confessions');

    if (enterBtn) {
        enterBtn.onclick = function() {
            intro.style.display = 'none';
            confessions.style.display = 'block';
        };
    }

    if (resetBtn) {
        resetBtn.onclick = function() {
            document.querySelectorAll('.confession-card').forEach(card => {
                card.classList.remove('flipped');
            });
            intro.style.display = 'flex';
            confessions.style.display = 'none';
        };
    }
}

document.addEventListener('DOMContentLoaded', initNav);
if (document.readyState === 'complete') {
    initNav();
}

// Card interactions
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('close-card')) {
        e.stopPropagation();
        const card = e.target.closest('.confession-card');
        if (card) card.classList.remove('flipped');
        return;
    }

    const card = e.target.closest('.confession-card');
    if (card && !e.target.classList.contains('close-card')) {
        card.classList.toggle('flipped');
    }
});

// Escape to close cards
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.confession-card.flipped').forEach(card => {
            card.classList.remove('flipped');
        });
    }
});

// Mouse tilt effect
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.confession-card');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        const distance = Math.hypot(e.clientX - centerX, e.clientY - centerY);

        if (distance < 300) {
            const tilt = Math.sin(angle) * 5;
            card.style.transform = `perspective(1000px) rotateZ(${tilt}deg)`;
        } else {
            card.style.transform = 'perspective(1000px) rotateZ(0deg)';
        }
    });
});
