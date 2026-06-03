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
    // Clear with fade effect
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

// Resize handler
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Navigation Logic
const enterBtn = document.getElementById('enterBtn');
const resetBtn = document.getElementById('resetBtn');
const introSection = document.getElementById('intro');
const confessionsSection = document.getElementById('confessions');

enterBtn.addEventListener('click', () => {
    introSection.style.display = 'none';
    confessionsSection.style.display = 'block';
});

resetBtn.addEventListener('click', () => {
    // Reset all cards
    document.querySelectorAll('.confession-card').forEach(card => {
        card.classList.remove('flipped');
    });
    
    introSection.style.display = 'flex';
    confessionsSection.style.display = 'none';
});

// Card Flip Logic
document.querySelectorAll('.confession-card').forEach(card => {
    card.addEventListener('click', (e) => {
        // Don't flip if clicking close button
        if (e.target.classList.contains('close-card')) {
            card.classList.remove('flipped');
            return;
        }

        card.classList.toggle('flipped');
    });

    // Close button functionality
    const closeBtn = card.querySelector('.close-card');
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        card.classList.remove('flipped');
    });
});

// Smooth scroll for reflection section
document.addEventListener('scroll', () => {
    const reflection = document.querySelector('.reflection');
    if (reflection) {
        const scrollPos = window.scrollY;
        const elementPos = reflection.offsetTop;
        const distance = elementPos - scrollPos;

        if (distance < window.innerHeight && distance > 0) {
            reflection.style.opacity = Math.min(1, (window.innerHeight - distance) / 200);
        }
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (confessionsSection.style.display === 'block') {
            document.querySelectorAll('.confession-card.flipped').forEach(card => {
                card.classList.remove('flipped');
            });
        }
    }
});

// Add subtle mouse following effect to cards
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.confession-card');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const cardCenterX = rect.left + rect.width / 2;
        const cardCenterY = rect.top + rect.height / 2;

        const angleToMouse = Math.atan2(e.clientY - cardCenterY, e.clientX - cardCenterX);
        const distance = Math.hypot(e.clientX - cardCenterX, e.clientY - cardCenterY);

        if (distance < 300) {
            const tilt = (Math.sin(angleToMouse) * 5);
            card.style.transform = `perspective(1000px) rotateZ(${tilt}deg)`;
        } else {
            card.style.transform = 'perspective(1000px) rotateZ(0deg)';
        }
    });
});

// Add depth to cards on load
window.addEventListener('load', () => {
    const cards = document.querySelectorAll('.confession-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
});

// Add some interactivity to intro on load
window.addEventListener('load', () => {
    const title = document.querySelector('.title');
    if (title) {
        title.style.animation = 'fadeIn 1.2s ease-out';
    }
});
