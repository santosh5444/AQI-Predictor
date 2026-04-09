/**
 * Visakhapatnam AQI Intelligence Dashboard — Premium Emission System
 * High-visibility volumetric smoke with atmospheric shading.
 */

class SmokeParticle {
    constructor() {
        this.active = false;
    }

    spawn(x, y, size, opacity, vx, vy, life, type = 'gray') {
        this.x = x;
        this.y = y;
        this.size = size;
        this.startSize = size;
        this.opacity = opacity;
        this.startOpacity = opacity;
        this.vx = vx;
        this.vy = vy;
        this.life = life;
        this.maxLife = life;
        this.type = type;
        this.active = true;
    }

    update(windSpeed) {
        if (!this.active) return;
        
        this.x += this.vx + (windSpeed * 0.05);
        this.y += this.vy;
        
        this.life--;
        const progress = 1 - (this.life / this.maxLife);
        this.opacity = this.startOpacity * (1 - progress);
        this.size = this.startSize + (progress * this.startSize * 3);
        
        if (this.life <= 0 || this.opacity <= 0.005) {
            this.active = false;
        }
    }

    draw(ctx) {
        if (!this.active) return;
        
        ctx.save();
        ctx.beginPath();
        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        // Richer colors for visibility
        const color = this.type === 'soot' ? '20, 25, 30' : '100, 116, 139';
        grad.addColorStop(0, `rgba(${color}, ${this.opacity})`);
        grad.addColorStop(1, `rgba(${color}, 0)`);
        
        ctx.fillStyle = grad;
        ctx.arc(this.x, this.y, this.size, 0,Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

class SmokeSystem {
    constructor(maxParticles = 600) {
        this.pool = Array.from({ length: maxParticles }, () => new SmokeParticle());
    }

    emit(x, y, size, opacity, vx, vy, life, type) {
        const p = this.pool.find(p => !p.active);
        if (p) p.spawn(x, y, size, opacity, vx, vy, life, type);
    }

    update(windSpeed) {
        this.pool.forEach(p => p.update(windSpeed));
    }

    draw(ctx) {
        this.pool.forEach(p => p.draw(ctx));
    }
}

window.SmokeSystem = SmokeSystem;
