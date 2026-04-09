/**
 * AQI Dashboard — Backdrop System
 * Mouse-following airplane, transparent sky for glass cards
 */

class Cloud {
    constructor(x, y, scale, speed) {
        this.x = x; this.y = y; this.baseY = y;
        this.scale = scale; this.speed = speed;
        this.opacity = 0.12 + scale * 0.08;
        this.floatPhase = Math.random() * Math.PI * 2;
        this.turbPhase  = Math.random() * Math.PI * 2;
        this.driftX = 0; this.driftY = 0;
        this.puffs = [];
        const n = 10 + Math.floor(Math.random() * 8);
        for (let i = 0; i < n; i++) {
            this.puffs.push({
                ox: (Math.random() - 0.5) * 100,
                oy: (Math.random() - 0.5) * 36,
                r:  18 + Math.random() * 28,
                cs: Math.random() * 12,
                ph: Math.random() * Math.PI * 2,
            });
        }
    }
    update(windSpeed, mouse) {
        this.turbPhase += 0.002;
        this.x += this.speed + windSpeed * 0.012 + Math.sin(this.turbPhase) * 0.4;
        this.floatPhase += 0.005;
        this.y = this.baseY + Math.sin(this.floatPhase) * 10;
        if (mouse && mouse.x > -100) {
            const dx = this.x - mouse.x, dy = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 280) {
                const f = (1 - dist / 280) * 40;
                this.driftX += (dx / dist) * f;
                this.driftY += (dy / dist) * f;
            }
        }
        this.driftX *= 0.93; this.driftY *= 0.93;
        if (this.x > window.innerWidth + 250) this.x = -250;
    }
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + this.driftX, this.y + this.driftY);
        ctx.scale(this.scale, this.scale);
        [...this.puffs].sort((a, b) => a.oy - b.oy).forEach(p => {
            const wig = Math.sin(this.floatPhase + p.ph) * 2;
            const grad = ctx.createRadialGradient(p.ox, p.oy + wig, 0, p.ox, p.oy + wig, p.r);
            const b = 255 - p.cs;
            grad.addColorStop(0,   `rgba(${b},${b},${b+4},${this.opacity})`);
            grad.addColorStop(0.7, `rgba(${b-8},${b-8},${b},${this.opacity * 0.35})`);
            grad.addColorStop(1,   'rgba(255,255,255,0)');
            ctx.fillStyle = grad;
            ctx.beginPath(); ctx.arc(p.ox, p.oy + wig, p.r, 0, Math.PI * 2); ctx.fill();
        });
        ctx.restore();
    }
}

class BackdropSystem {
    constructor(canvas, ctx) {
        this.canvas = canvas; this.ctx = ctx;
        this.groundY = 0; this.envType = 'urban'; this.palmSway = 0;
    }
    setEnvType(t) { this.envType = t || 'urban'; }
    setGround(y)  { this.groundY = y; }

    drawSky() {
        // Very light gradient — lets canvas background show through glass cards
        const g = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        g.addColorStop(0,   '#e0f2fe');
        g.addColorStop(0.6, '#f0f9ff');
        g.addColorStop(1,   '#f8fafc');
        this.ctx.fillStyle = g;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawEnvironment(aqi, emitSmoke, windSpeed) {
        this.palmSway = Math.sin(Date.now() * 0.001) * (windSpeed * 0.3);
        switch (this.envType) {
            case 'coastal':    this.drawCoastal();              break;
            case 'industrial': this.drawIndustrial(emitSmoke);  break;
            case 'rural':      this.drawRural();                break;
        }
        this.drawSideInfrastructure(emitSmoke);
    }

    drawSideInfrastructure(emitSmoke) {
        const w = this.canvas.width, h = this.canvas.height;
        const stack = (x, ht, wd = 22) => {
            const bx = w * x - wd / 2, by = this.groundY - ht;
            const g = this.ctx.createLinearGradient(bx, by, bx + wd, by);
            g.addColorStop(0, 'rgba(15,23,42,0.18)'); g.addColorStop(1, 'rgba(15,23,42,0.30)');
            this.ctx.fillStyle = g; this.ctx.fillRect(bx, by, wd, ht);
            this.ctx.fillStyle = 'rgba(15,23,42,0.35)'; this.ctx.fillRect(bx - 3, by, wd + 6, 7);
            emitSmoke(bx + wd / 2, by, true);
        };
        stack(0.04, h * 0.38, 22); stack(0.08, h * 0.22, 16);
        stack(0.92, h * 0.28, 20); stack(0.96, h * 0.42, 26);
    }

    drawIndustrial(emitSmoke) {
        const w = this.canvas.width, h = this.canvas.height;
        [[0.3, 120, h * 0.14], [0.65, 140, h * 0.11]].forEach(([x, wd, ht]) => {
            const bx = w * x, by = this.groundY - ht;
            this.ctx.fillStyle = 'rgba(15,23,42,0.18)'; this.ctx.fillRect(bx, by, wd, ht);
            const sx = bx + wd / 2 - 9, sy = by - 90;
            this.ctx.fillStyle = 'rgba(15,23,42,0.28)'; this.ctx.fillRect(sx, sy, 18, 90);
            emitSmoke(sx + 9, sy, true);
        });
    }

    drawCoastal() {
        const w = this.canvas.width, h = this.canvas.height;
        this.ctx.fillStyle = 'rgba(15,23,42,0.05)';
        this.ctx.beginPath();
        this.ctx.moveTo(w * 0.2, this.groundY);
        this.ctx.quadraticCurveTo(w * 0.5, this.groundY - h * 0.38, w * 0.8, this.groundY);
        this.ctx.fill();
        [[0.2, 1.0], [0.8, 0.7]].forEach(([x, s]) => {
            this.ctx.save(); this.ctx.translate(w * x, this.groundY); this.ctx.scale(s, s);
            this.ctx.strokeStyle = 'rgba(15,23,42,0.18)'; this.ctx.lineWidth = 4;
            this.ctx.beginPath(); this.ctx.moveTo(0, 0);
            this.ctx.quadraticCurveTo(this.palmSway, -55, this.palmSway * 2, -95); this.ctx.stroke();
            this.ctx.restore();
        });
    }

    drawRural() {
        const w = this.canvas.width, h = this.canvas.height;
        this.ctx.fillStyle = 'rgba(15,23,42,0.04)';
        this.ctx.beginPath();
        this.ctx.moveTo(w * 0.3, this.groundY);
        this.ctx.lineTo(w * 0.5, this.groundY - h * 0.32);
        this.ctx.lineTo(w * 0.7, this.groundY); this.ctx.fill();
    }

    drawRoad() {
        this.ctx.fillStyle = 'rgba(15,23,42,0.025)';
        this.ctx.fillRect(0, this.groundY, this.canvas.width, this.canvas.height - this.groundY);
    }
}

// ── Hot Air Balloon ────────────────────────────────────────────────────────────
const BALLOON_PATHS = {
    body:   new Path2D('M0,0 C0,-40 30,-60 30,-90 C30,-120 0,-140 -30,-140 C-60,-140 -90,-120 -90,-90 C-90,-60 -60,-40 -60,0 Z'),
    basket: new Path2D('M-45,15 L-15,15 L-18,35 L-42,35 Z'),
    ropes:  new Path2D('M-60,0 L-45,15 M0,0 L-15,15'),
};

class HotAirBalloon {
    constructor(x, y) {
        this.baseX = x; this.baseY = y;
        this.x = x; this.y = y;
        this.bobPhase = 0; this.driftPhase = 0; this.smokeCounter = 0;
    }
    update(mouse) {
        this.bobPhase += 0.015; this.driftPhase += 0.008;
        this.y = this.baseY + Math.sin(this.bobPhase) * 18;
        if (mouse && mouse.x > -100) {
            const dx = this.x - mouse.x;
            if (Math.abs(dx) < 200) this.x += (dx / 200) * 2;
        }
        this.x += (this.baseX - this.x) * 0.01;
        if (++this.smokeCounter > 45) { this.smokeCounter = 0; return true; }
        return false;
    }
    draw(ctx) {
        ctx.save(); ctx.translate(this.x, this.y); ctx.scale(0.5, 0.5);
        ctx.strokeStyle = '#475569'; ctx.lineWidth = 2; ctx.stroke(BALLOON_PATHS.ropes);
        const bg = ctx.createLinearGradient(-45, 15, -15, 35);
        bg.addColorStop(0, '#78350f'); bg.addColorStop(1, '#451a03');
        ctx.fillStyle = bg; ctx.fill(BALLOON_PATHS.basket);
        const ballG = ctx.createRadialGradient(-30, -100, 10, -30, -90, 80);
        ballG.addColorStop(0, '#f87171'); ballG.addColorStop(1, '#b91c1c');
        ctx.fillStyle = ballG; ctx.fill(BALLOON_PATHS.body);
        ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 8; ctx.stroke(BALLOON_PATHS.body);
        const glow = Math.abs(Math.sin(this.bobPhase * 2));
        ctx.fillStyle = `rgba(253,186,116,${glow * 0.6})`;
        ctx.beginPath(); ctx.arc(-30, 0, 10, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
    }
}

// ── Airplane — smooth zig-zag left to right ──────────────────────────────────
class Airplane {
    constructor(x, y, speed) {
        this.x = x;
        this.y = y;
        this.baseY = y;
        this.speed = speed;
        this.zigPhase = Math.random() * Math.PI * 2;
        this.angle = 0;
        this.lightPhase = 0;
        this.trailPts = [];
    }

    update() {
        // Move left to right continuously
        this.x += this.speed;
        if (this.x > window.innerWidth + 400) {
            this.x = -400;
            this.trailPts = [];
        }

        // Zig-zag vertical motion
        this.zigPhase += 0.018;
        const targetY = this.baseY + Math.sin(this.zigPhase) * 80;
        this.y += (targetY - this.y) * 0.04;

        // Bank angle follows the zig-zag direction
        const dy = targetY - this.y;
        this.angle = Math.atan2(dy, 60) * 0.5;

        this.lightPhase += 0.05;

        // Contrail
        this.trailPts.unshift({ x: this.x, y: this.y });
        if (this.trailPts.length > 50) this.trailPts.pop();

        return false;
    }

    draw(ctx) {
        // Draw contrail first
        if (this.trailPts.length > 2) {
            ctx.save();
            for (let i = 1; i < this.trailPts.length; i++) {
                const alpha = (1 - i / this.trailPts.length) * 0.18;
                ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
                ctx.lineWidth = 3 - i * 0.06;
                ctx.beginPath();
                ctx.moveTo(this.trailPts[i - 1].x, this.trailPts[i - 1].y);
                ctx.lineTo(this.trailPts[i].x, this.trailPts[i].y);
                ctx.stroke();
            }
            ctx.restore();
        }

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.scale(0.65, 0.65);

        const colorWhite = '#ffffff';
        const colorSteel = '#e2e8f0';
        const colorBlue  = '#1e3a8a';

        // Underbelly + tail
        ctx.fillStyle = colorBlue;
        ctx.beginPath();
        ctx.moveTo(-60, 0);
        ctx.bezierCurveTo(-60, 4, -40, 7, 40, 4);
        ctx.lineTo(60, 2); ctx.lineTo(60, 0); ctx.closePath(); ctx.fill();
        // Vertical stabilizer
        ctx.beginPath();
        ctx.moveTo(-40, 0); ctx.lineTo(-58, -22); ctx.lineTo(-46, -22); ctx.lineTo(-28, 0);
        ctx.closePath(); ctx.fill();

        // Fuselage
        const fus = ctx.createLinearGradient(0, -9, 0, 0);
        fus.addColorStop(0, colorSteel); fus.addColorStop(1, colorWhite);
        ctx.fillStyle = fus;
        ctx.beginPath();
        ctx.moveTo(-60, 0);
        ctx.bezierCurveTo(-60, -7, -40, -10, 42, -5);
        ctx.bezierCurveTo(58, -4, 66, -2, 66, 0);
        ctx.lineTo(60, 2); ctx.lineTo(-60, 0); ctx.fill();

        // Engines
        [[- 8, -14, true], [8, 14, false]].forEach(([ex, ey, far]) => {
            ctx.fillStyle = far ? 'rgba(0,0,0,0.18)' : colorWhite;
            ctx.beginPath(); ctx.ellipse(ex, ey, 12, 4.5, 0.08, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#1e293b';
            ctx.beginPath(); ctx.ellipse(ex + 8, ey + 0.5, 2.5, 3.5, 0.08, 0, Math.PI * 2); ctx.fill();
        });

        // Wings
        ctx.fillStyle = 'rgba(0,0,0,0.08)';
        ctx.beginPath(); ctx.moveTo(5,-4); ctx.lineTo(-12,-42); ctx.lineTo(2,-42); ctx.lineTo(30,-4); ctx.fill();
        ctx.fillStyle = colorWhite;
        ctx.beginPath(); ctx.moveTo(22,4); ctx.lineTo(8,38); ctx.lineTo(24,38); ctx.lineTo(45,4); ctx.fill();

        // Cockpit
        ctx.fillStyle = 'rgba(15,23,42,0.55)';
        ctx.beginPath(); ctx.moveTo(48,-4); ctx.lineTo(56,-3); ctx.lineTo(54,-1); ctx.lineTo(46,-2); ctx.fill();

        // Windows
        ctx.fillStyle = 'rgba(0,0,0,0.12)';
        for (let i = 0; i < 10; i++) {
            ctx.beginPath(); ctx.arc(4 + i * 4, -1, 0.6, 0, Math.PI * 2); ctx.fill();
        }

        // Nav lights
        if (Math.sin(this.lightPhase) > 0.8) {
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#ef4444'; ctx.fillStyle = '#ef4444';
            ctx.beginPath(); ctx.arc(-10, -42, 3, 0, Math.PI * 2); ctx.fill();
            ctx.shadowColor = '#22c55e'; ctx.fillStyle = '#22c55e';
            ctx.beginPath(); ctx.arc(-55, -22, 3, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;
        }

        ctx.restore();
    }
}

window.Cloud = Cloud;
window.BackdropSystem = BackdropSystem;
window.HotAirBalloon = HotAirBalloon;
window.Airplane = Airplane;
