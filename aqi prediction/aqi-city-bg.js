/**
 * Visakhapatnam AQI Intelligence Dashboard — Living City Environment Engine
 * A dynamic, layered scene representing urban and industrial pollution sources.
 */

class SmokeParticle {
    constructor(x, y, size, opacity, vx, vy, life) {
        this.reset(x, y, size, opacity, vx, vy, life);
    }

    reset(x, y, size, opacity, vx, vy, life) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.opacity = opacity;
        this.vx = vx;
        this.vy = vy;
        this.life = life;
        this.maxLife = life;
        this.active = true;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
        this.opacity *= 0.98;
        this.size *= 1.01;
        if (this.life <= 0 || this.opacity < 0.01) this.active = false;
    }

    draw(ctx) {
        ctx.beginPath();
        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        grad.addColorStop(0, `rgba(80, 80, 85, ${this.opacity})`);
        grad.addColorStop(1, 'rgba(80, 80, 85, 0)');
        ctx.fillStyle = grad;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Vehicle {
    constructor(laneY, speed, type) {
        this.laneY = laneY;
        this.speed = speed;
        this.type = type; // 'car' or 'truck'
        this.x = Math.random() * window.innerWidth;
        this.width = type === 'truck' ? 40 : 25;
        this.height = type === 'truck' ? 18 : 12;
        this.smokeCounter = 0;
    }

    update(aqi, windSpeed) {
        this.x += this.speed;
        if (this.x > window.innerWidth + 50) this.x = -50;
        if (this.x < -50) this.x = window.innerWidth + 50;

        // Smoke production increases with AQI
        this.smokeCounter++;
        const interval = Math.max(2, 20 - Math.floor(aqi / 20));
        if (this.smokeCounter >= interval) {
            this.smokeCounter = 0;
            return true; // Signal to spawn smoke
        }
        return false;
    }

    draw(ctx) {
        ctx.fillStyle = 'rgba(30, 41, 59, 0.4)'; // Subtle silhouette
        ctx.fillRect(this.x, this.laneY - this.height, this.width, this.height);
        // Headlights (subtle)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        const headX = this.speed > 0 ? this.x + this.width : this.x;
        ctx.fillRect(headX, this.laneY - this.height + 2, 2, 2);
    }
}

class CityEnvironmentManager {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.aqi = 50;
        this.targetAqi = 50;
        this.windSpeed = 5;
        this.particles = [];
        this.vehicles = [];
        this.factories = [
            { x: 0.15, w: 60, h: 80, chimneys: [{ ox: 20, oy: -80 }, { ox: 45, oy: -60 }] },
            { x: 0.65, w: 100, h: 50, chimneys: [{ ox: 15, oy: -110 }, { ox: 80, oy: -90 }] }
        ];
        
        this.smokePool = [];
        this.resize();
        this.initVehicles();
        
        window.addEventListener('resize', () => this.resize());
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.groundY = this.canvas.height * 0.92;
        this.initVehicles(); // Restart vehicles for new width
    }

    initVehicles() {
        this.vehicles = [];
        const count = Math.min(12, Math.floor(window.innerWidth / 150));
        for (let i = 0; i < count; i++) {
            const lane = this.groundY - (Math.random() * 10);
            const speed = (0.5 + Math.random() * 1.5) * (Math.random() > 0.5 ? 1 : -1);
            const type = Math.random() > 0.7 ? 'truck' : 'car';
            this.vehicles.push(new Vehicle(lane, speed, type));
        }
    }

    getParticle() {
        const p = this.smokePool.find(p => !p.active);
        if (p) return p;
        const newP = new SmokeParticle(0, 0, 0, 0, 0, 0, 0);
        this.smokePool.push(newP);
        return newP;
    }

    spawnSmoke(x, y, isFactory = false) {
        const intensity = isFactory ? (this.aqi / 100) : (this.aqi / 200);
        if (Math.random() > intensity) return;

        const size = (isFactory ? 15 : 5) * (0.8 + Math.random() * 0.4);
        const opacity = (isFactory ? 0.3 : 0.15) * (0.8 + Math.random() * 0.4);
        const vx = (Math.random() - 0.5) * 0.5 + (this.windSpeed * 0.05);
        const vy = -(0.5 + Math.random() * 1);
        const life = 60 + Math.random() * 120;
        
        const p = this.getParticle();
        p.reset(x, y, size, opacity, vx, vy, life);
    }

    updateAQI(aqi, wind = 5) {
        this.targetAqi = aqi;
        this.windSpeed = wind;

        // Transition theme colors
        const states = [
            { aqi: 50, bg: '#f0f9ff', accent: '#10b981' },
            { aqi: 100, bg: '#fffbeb', accent: '#f59e0b' },
            { aqi: 200, bg: '#fff7ed', accent: '#f97316' },
            { aqi: 300, bg: '#fef2f2', accent: '#ef4444' }
        ];
        
        let state = states[0];
        for (let s of states) {
            if (aqi >= s.aqi) state = s;
        }
        
        document.documentElement.style.setProperty('--bg', state.bg);
        document.documentElement.style.setProperty('--accent', state.accent);
    }

    drawSky() {
        const grad = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        let color1, color2;
        
        if (this.aqi < 50) {
            color1 = '#93c5fd'; color2 = '#f0f9ff';
        } else if (this.aqi < 150) {
            color1 = '#fde68a'; color2 = '#fff7ed';
        } else {
            color1 = '#fb923c'; color2 = '#7c2d12';
        }
        
        grad.addColorStop(0, color1);
        grad.addColorStop(1, color2);
        this.ctx.fillStyle = grad;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawMountains() {
        this.ctx.fillStyle = 'rgba(30, 41, 59, 0.05)';
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.groundY);
        // Vizag Dolphin's Nose Shape
        this.ctx.quadraticCurveTo(this.canvas.width * 0.2, this.groundY - 150, this.canvas.width * 0.5, this.groundY - 20);
        this.ctx.quadraticCurveTo(this.canvas.width * 0.7, this.groundY - 80, this.canvas.width, this.groundY);
        this.ctx.fill();
    }

    drawCityscape() {
        this.ctx.fillStyle = 'rgba(30, 41, 59, 0.08)';
        // Draw factories
        this.factories.forEach(f => {
            const fx = f.x * this.canvas.width;
            this.ctx.fillRect(fx, this.groundY - f.h, f.w, f.h);
            // Smokestacks
            f.chimneys.forEach(c => {
                const cx = fx + c.ox;
                const cy = this.groundY - f.h + c.oy;
                this.ctx.fillRect(cx - 5, cy, 10, -c.oy);
                this.spawnSmoke(cx, cy, true);
            });
        });
        
        // Ground/Road
        this.ctx.fillStyle = 'rgba(15, 23, 42, 0.03)';
        this.ctx.fillRect(0, this.groundY, this.canvas.width, this.canvas.height - this.groundY);
    }

    drawHaze() {
        const opacity = Math.min(0.7, (this.aqi / 400));
        this.ctx.fillStyle = `rgba(148, 163, 184, ${opacity})`;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    animate() {
        // AQI Easing
        this.aqi += (this.targetAqi - this.aqi) * 0.02;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawSky();
        this.drawMountains();
        this.drawCityscape();
        
        // Update & Draw Vehicles
        this.vehicles.forEach(v => {
            if (v.update(this.aqi, this.windSpeed)) {
                this.spawnSmoke(v.x + (v.speed > 0 ? 0 : v.width), v.laneY);
            }
            v.draw(this.ctx);
        });

        // Update & Draw Particles
        this.smokePool.forEach(p => {
            if (p.active) {
                p.update();
                p.draw(this.ctx);
            }
        });
        
        this.drawHaze();

        // Dangerous effect
        if (this.aqi > 250) {
            const pulse = (Math.sin(Date.now() / 400) + 1) / 2;
            this.ctx.fillStyle = `rgba(239, 68, 68, ${pulse * 0.05})`;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        requestAnimationFrame(() => this.animate());
    }
}

// Global initialization
window.AQIBackground = null;
window.initAQIBackground = (canvasId) => {
    window.AQIBackground = new CityEnvironmentManager(canvasId);
};
