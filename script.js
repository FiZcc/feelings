// Affirmations Array
const affirmations = [
    "You are safe here. Take all the time you need.",
    "It's okay to feel peaceful and small right now.",
    "You deserve rest and comfort.",
    "This moment is just for you.",
    "Breathe slowly. Everything is gentle here.",
    "You are loved and protected.",
    "It's okay to let go and be yourself.",
    "Your feelings are valid and beautiful.",
    "Take one breath at a time.",
    "You are exactly where you need to be.",
    "Softness and kindness surround you.",
    "You can be vulnerable here.",
];

let currentAffirmationIndex = 0;

// Particle Generator
function createParticles(x, y, emoji = '✨') {
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.textContent = emoji;
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.fontSize = (Math.random() * 20 + 15) + 'px';
        particle.style.setProperty('--tx', (Math.random() - 0.5) * 100 + 'px');
        document.body.appendChild(particle);

        setTimeout(() => particle.remove(), 2000);
    }
}

// Interactive Items Handler
document.querySelectorAll('.interactive-item').forEach(item => {
    item.addEventListener('click', function (e) {
        const action = this.dataset.action;
        const rect = this.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        switch(action) {
            case 'stars':
                createParticles(x, y, '✨');
                rotateAffirmation();
                playSound('sparkle');
                break;
            case 'heart':
                createParticles(x, y, '💫');
                triggerHeartbeat();
                playSound('glow');
                break;
            case 'sparkle':
                createParticles(x, y, '🎀');
                playSound('touch');
                break;
            case 'rain':
                createRain();
                playSound('rain');
                break;
        }
    });

    // Hover effect
    item.addEventListener('mouseenter', function () {
        this.style.animation = 'none';
        setTimeout(() => {
            this.style.animation = '';
        }, 10);
    });
});

// Rotate Affirmation
function rotateAffirmation() {
    const affirmationBox = document.querySelector('.affirmation');
    currentAffirmationIndex = (currentAffirmationIndex + 1) % affirmations.length;
    
    affirmationBox.style.opacity = '0.5';
    affirmationBox.textContent = affirmations[currentAffirmationIndex];
    
    setTimeout(() => {
        affirmationBox.style.opacity = '1';
    }, 200);
}

// Breathing Circle Click Handler
document.querySelector('.breathing-circle').addEventListener('click', function () {
    rotateAffirmation();
    playSound('breathe');
});

// Trigger Heartbeat Animation
function triggerHeartbeat() {
    const circle = document.querySelector('.breathing-circle');
    circle.style.animation = 'none';
    setTimeout(() => {
        circle.style.animation = 'breathe 6s ease-in-out infinite';
    }, 10);
}

// Rain Effect
function createRain() {
    for (let i = 0; i < 20; i++) {
        const drop = document.createElement('div');
        drop.style.position = 'fixed';
        drop.style.left = Math.random() * window.innerWidth + 'px';
        drop.style.top = '-10px';
        drop.style.fontSize = '1.5rem';
        drop.style.pointerEvents = 'none';
        drop.style.zIndex = '5';
        drop.textContent = '💧';
        document.body.appendChild(drop);

        const duration = Math.random() * 1 + 1;
        drop.style.animation = `rainFall ${duration}s linear forwards`;
        
        drop.addEventListener('animationend', () => drop.remove());
    }
}

// Add Rain Animation to CSS Dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes rainFall {
        to {
            transform: translateY(${window.innerHeight + 20}px) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Web Audio API - Simple tone generation
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    try {
        const now = audioContext.currentTime;
        const gainNode = audioContext.createGain();
        gainNode.connect(audioContext.destination);
        
        if (type === 'sparkle') {
            // High sparkly tone
            const osc = audioContext.createOscillator();
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
            gainNode.gain.setValueAtTime(0.1, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            osc.connect(gainNode);
            osc.start(now);
            osc.stop(now + 0.2);
        } else if (type === 'glow') {
            // Soft warm tone
            const osc = audioContext.createOscillator();
            osc.frequency.setValueAtTime(440, now);
            gainNode.gain.setValueAtTime(0.08, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
            osc.connect(gainNode);
            osc.start(now);
            osc.stop(now + 0.4);
        } else if (type === 'touch') {
            // Gentle bell tone
            const osc = audioContext.createOscillator();
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(400, now + 0.3);
            gainNode.gain.setValueAtTime(0.05, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            osc.connect(gainNode);
            osc.start(now);
            osc.stop(now + 0.3);
        } else if (type === 'breathe') {
            // Calm ambient sound
            const osc = audioContext.createOscillator();
            osc.frequency.setValueAtTime(200, now);
            gainNode.gain.setValueAtTime(0.03, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 2);
            osc.connect(gainNode);
            osc.start(now);
            osc.stop(now + 2);
        } else if (type === 'rain') {
            // Multiple rain drops
            for (let i = 0; i < 3; i++) {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.frequency.setValueAtTime(100 + i * 50, now);
                osc.frequency.exponentialRampToValueAtTime(80 + i * 40, now + 0.2);
                gain.gain.setValueAtTime(0.03, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                osc.connect(gain);
                gain.connect(gainNode);
                osc.start(now + i * 0.05);
                osc.stop(now + 0.2 + i * 0.05);
            }
        }
    } catch (e) {
        console.log('Audio context restricted until user interaction');
    }
}

// Audio Toggle
let isAudioPlaying = false;
const audioToggle = document.getElementById('audio-toggle');
const audioElement = document.getElementById('ambient-audio');

// Enable audio context on first interaction
document.addEventListener('click', function initAudio() {
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    document.removeEventListener('click', initAudio);
});

audioToggle.addEventListener('click', function () {
    if (isAudioPlaying) {
        audioToggle.classList.remove('active');
        isAudioPlaying = false;
        audioToggle.textContent = '🎵 Ambient Sounds';
    } else {
        audioToggle.classList.add('active');
        isAudioPlaying = true;
        audioToggle.textContent = '🎵 Ambient Sounds (playing)';
        playAmbientSound();
    }
});

// Ambient Sound Generator
function playAmbientSound() {
    if (!isAudioPlaying) return;

    try {
        const now = audioContext.currentTime;
        const duration = 3;
        
        // Create a soft, layered ambient sound
        for (let i = 0; i < 3; i++) {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            
            // Different frequencies for layering
            const baseFrequency = 100 + i * 50;
            osc.frequency.setValueAtTime(baseFrequency, now);
            
            // Slight frequency modulation
            osc.frequency.setValueAtTime(baseFrequency + 5, now);
            osc.frequency.setValueAtTime(baseFrequency - 5, now + 0.5);
            osc.frequency.setValueAtTime(baseFrequency, now + duration);
            
            gain.gain.setValueAtTime(0.02, now);
            gain.gain.setValueAtTime(0.03, now + 0.5);
            gain.gain.setValueAtTime(0.02, now + duration);
            
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.start(now);
            osc.stop(now + duration);
        }
    } catch (e) {
        console.log('Could not play ambient sound');
    }

    // Repeat
    if (isAudioPlaying) {
        setTimeout(playAmbientSound, 3000);
    }
}

// Keyboard Shortcuts
document.addEventListener('keydown', function (e) {
    if (e.code === 'Space') {
        e.preventDefault();
        rotateAffirmation();
        playSound('breathe');
    }
});

// Mouse Movement Effect (subtle glow follow)
document.addEventListener('mousemove', function (e) {
    const items = document.querySelectorAll('.interactive-item');
    
    items.forEach(item => {
        const rect = item.getBoundingClientRect();
        const itemX = rect.left + rect.width / 2;
        const itemY = rect.top + rect.height / 2;
        
        const distance = Math.sqrt(
            Math.pow(e.clientX - itemX, 2) + 
            Math.pow(e.clientY - itemY, 2)
        );
        
        if (distance < 200) {
            const intensity = 1 - (distance / 200);
            item.style.boxShadow = `0 20px 60px rgba(212, 165, 165, ${0.2 + intensity * 0.2})`;
        }
    });
});

// Initialize with random affirmation
window.addEventListener('load', function () {
    currentAffirmationIndex = Math.floor(Math.random() * affirmations.length);
    document.querySelector('.affirmation').textContent = affirmations[currentAffirmationIndex];
});

// Smooth scroll
document.addEventListener('wheel', function (e) {
    // Already handled by browser
}, { passive: true });

// Add gentle auto-rotation of affirmations every 30 seconds
setInterval(function () {
    if (!isAudioPlaying && Math.random() > 0.7) {
        rotateAffirmation();
    }
}, 30000);
