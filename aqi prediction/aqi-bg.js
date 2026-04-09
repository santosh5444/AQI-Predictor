/**
 * Visakhapatnam AQI Intelligence Dashboard — Dynamic Background System
 * Handles particle animations, wind flow, and ambient transitions based on AQI.
 */

class BackgroundManager {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.aqi = 50;
        this.windSpeed = 5;
        this.windAngle = Math.PI; // Drift left by default
        this.targetAqi = 50;
        this.state = 'good'; // 'good', 'moderate', 'poor', 'dangerous'
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        this.initParticles();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.particleCount = Math.min(window.innerWidth / 10, 150);
        if (window.innerWidth < 768) this.particleCount /= 2; // Performance for mobile
    }

    initParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(this.createParticle());
        }
    }

    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            size: 1 + Math.random() * 3,
            speed: 0.2 + Math.random() * 0.5,
            opacity: 0.1 + Math.random() * 0.4,
            hue: 200, // Default blueish
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: 0.01 + Math.random() * 0.02
        };
    }

    updateAQI(aqi, wind = 5) {
        this.targetAqi = aqi;
        this.windSpeed = wind;
        
        // Update state
        if (aqi <= 50) this.state = 'good';
        else if (aqi <= 100) this.state = 'moderate';
        else if (aqi <= 200) this.state = 'poor';
        else this.state = 'dangerous';

        // Transition background gradient via CSS variables or body class
        this.updateTheme();
    }

    updateTheme() {
        let bg, accent, primary;
        if (this.state === 'good') {
            bg = '#f0f9ff'; // Light sky blue
            accent = '#10b981';
        } else if (this.state === 'moderate') {
            bg = '#fffbeb'; // Light amber
            accent = '#f59e0b';
        } else if (this.state === 'poor') {
            bg = '#fff7ed'; // Light orange/grey
            accent = '#f97316';
        } else {
            bg = '#fef2f2'; // Light red
            accent = '#ef4444';
        }
        
        document.documentElement.style.setProperty('--bg', bg);
        document.documentElement.style.setProperty('--accent', accent);
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // AQI easing
        this.aqi += (this.targetAqi - this.aqi) * 0.05;

        this.particles.forEach(p => {
            // Motion
            p.wobble += p.wobbleSpeed;
            const driftX = Math.cos(this.windAngle) * (this.windSpeed * 0.1);
            const driftY = Math.sin(p.wobble) * 0.2;
            
            p.x += driftX - p.speed;
            p.y += driftY;

            // Boundary wrap
            if (p.x < -50) p.x = this.canvas.width + 50;
            if (p.x > this.canvas.width + 50) p.x = -50;
            if (p.y < -50) p.y = this.canvas.height + 50;
            if (p.y > this.canvas.height + 50) p.y = -50;

            // Visual properties based on AQI
            let color;
            if (this.aqi <= 50) {
                // Clear sky: Small crisp dots
                color = `rgba(147, 197, 253, ${p.opacity * 0.5})`;
                p.size = Math.max(1, p.size * 0.99);
            } else if (this.aqi <= 150) {
                // Hazy: Larger, softer yellower particles
                const mix = (this.aqi - 50) / 100;
                const r = 147 + (245 - 147) * mix;
                const g = 197 + (158 - 197) * mix;
                const b = 253 + (11 - 253) * mix;
                color = `rgba(${r}, ${g}, ${b}, ${p.opacity})`;
                p.size = 2 + Math.random() * 2;
            } else {
                // Polluted: Smoke-like blobs
                const mix = Math.min(1, (this.aqi - 150) / 150);
                const grey = 150 - (mix * 100);
                color = `rgba(${grey}, ${grey-10}, ${grey-20}, ${p.opacity * 1.5})`;
                p.size = 5 + Math.random() * 10;
            }

            // Draw
            this.ctx.beginPath();
            if (this.aqi > 150) {
                // Smoke effect: fuzzy
                const grad = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
                grad.addColorStop(0, color);
                grad.addColorStop(1, 'rgba(0,0,0,0)');
                this.ctx.fillStyle = grad;
            } else {
                this.ctx.fillStyle = color;
            }
            
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // Pulsing glow if dangerous
        if (this.aqi > 200) {
            const pulse = (Math.sin(Date.now() / 500) + 1) / 2;
            this.canvas.style.opacity = 0.6 + (pulse * 0.4);
        } else {
            this.canvas.style.opacity = 0.8;
        }

        requestAnimationFrame(() => this.animate());
    }
}

// Global instance
window.AQIBackground = null;
window.initAQIBackground = (canvasId) => {
    window.AQIBackground = new BackgroundManager(canvasId);
};
