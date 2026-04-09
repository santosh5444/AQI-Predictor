/**
 * AQI Dashboard — Enhanced Vehicle System
 * Bikes, cars, trucks, autos — 15 vivid colors
 */

const VEHICLE_COLORS = [
    { body: '#e2e8f0', shadow: '#94a3b8', highlight: '#f8fafc', window: '#cbd5e1', rims: '#64748b' },   // Silver
    { body: '#3b82f6', shadow: '#1e3a8a', highlight: '#60a5fa', window: '#bfdbfe', rims: '#f1f5f9' },   // Blue
    { body: '#0f172a', shadow: '#020617', highlight: '#334155', window: '#475569', rims: '#94a3b8' },   // Black
    { body: '#b91c1c', shadow: '#7f1d1d', highlight: '#f87171', window: '#fecaca', rims: '#e2e8f0' },   // Red
    { body: '#71717a', shadow: '#3f3f46', highlight: '#a1a1aa', window: '#e4e4e7', rims: '#18181b' },   // Gunmetal
    { body: '#16a34a', shadow: '#14532d', highlight: '#4ade80', window: '#bbf7d0', rims: '#f0fdf4' },   // Green
    { body: '#d97706', shadow: '#92400e', highlight: '#fbbf24', window: '#fef3c7', rims: '#fffbeb' },   // Amber
    { body: '#7c3aed', shadow: '#4c1d95', highlight: '#a78bfa', window: '#ede9fe', rims: '#f5f3ff' },   // Purple
    { body: '#0891b2', shadow: '#164e63', highlight: '#22d3ee', window: '#cffafe', rims: '#ecfeff' },   // Cyan
    { body: '#db2777', shadow: '#831843', highlight: '#f472b6', window: '#fce7f3', rims: '#fdf2f8' },   // Pink
    { body: '#ea580c', shadow: '#7c2d12', highlight: '#fb923c', window: '#ffedd5', rims: '#fff7ed' },   // Orange
    { body: '#ca8a04', shadow: '#713f12', highlight: '#facc15', window: '#fef9c3', rims: '#fefce8' },   // Yellow
    { body: '#0f766e', shadow: '#134e4a', highlight: '#2dd4bf', window: '#ccfbf1', rims: '#f0fdfa' },   // Teal
    { body: '#be185d', shadow: '#831843', highlight: '#ec4899', window: '#fce7f3', rims: '#fdf2f8' },   // Rose
    { body: '#1d4ed8', shadow: '#1e3a8a', highlight: '#60a5fa', window: '#dbeafe', rims: '#eff6ff' },   // Indigo
];

const VEHICLE_PATHS = {
    sedanBody:      new Path2D('M0,38 L0,23 L15,21 L28,10 L58,10 L68,21 L85,24 L85,38 Z'),
    sedanWindows:   new Path2D('M30,12 L56,12 L64,21 L22,21 Z'),
    lorryContainer: new Path2D('M0,5 L80,5 L80,38 L0,38 Z'),
    lorryCabin:     new Path2D('M82,15 L108,15 L112,25 L112,38 L82,38 Z'),
    lorryWindows:   new Path2D('M88,18 L105,18 L108,25 L88,25 Z'),
    autoBody:       new Path2D('M0,38 L0,18 L6,8 L28,8 L35,22 L38,38 Z'),
    autoFrame:      new Path2D('M10,12 L26,12 L26,26 L10,26 Z'),
    wheelRim:       new Path2D('M0,0 m-5,0 a5,5 0 1,0 10,0 a5,5 0 1,0 -10,0 M0,0 m-2,0 a2,2 0 1,0 4,0 a2,2 0 1,0 -4,0'),
};

class Vehicle {
    constructor(x, y, speed, type, lane = 0) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.baseSpeed = speed;
        this.type = type;
        this.lane = lane;
        this.palette = VEHICLE_COLORS[Math.floor(Math.random() * VEHICLE_COLORS.length)];
        this.bounce = 0;
        this.bouncePhase = Math.random() * Math.PI;
        this.wheelRot = 0;
        this.smokeCounter = 0;
        this.interactionTimer = 0;

        if (type === 'truck')      { this.scale = 0.85; this.width = 112 * 0.85; this.height = 38 * 0.85; }
        else if (type === 'auto')  { this.scale = 0.95; this.width = 38 * 0.95;  this.height = 38 * 0.95; }
        else if (type === 'bike')  { this.scale = 0.7;  this.width = 36;          this.height = 28; }
        else if (type === 'moto')  { this.scale = 0.75; this.width = 42;          this.height = 30; }
        else                       { this.scale = 1.0;  this.width = 85;          this.height = 38; }
    }

    update(aqi, mouse = null) {
        let targetSpeed = this.baseSpeed;
        if (mouse && mouse.x > -100) {
            const dx = this.x + this.width / 2 - mouse.x;
            const dy = this.y - mouse.y;
            if (Math.sqrt(dx * dx + dy * dy) < 100) {
                targetSpeed *= 0.5;
                this.interactionTimer = Math.min(this.interactionTimer + 0.1, 1);
            } else {
                this.interactionTimer = Math.max(this.interactionTimer - 0.05, 0);
            }
        }
        this.speed += (targetSpeed - this.speed) * 0.1;
        this.x += this.speed;
        if (this.x > window.innerWidth + 200) this.x = -200;
        if (this.x < -200) this.x = window.innerWidth + 200;

        this.bouncePhase += 0.08 + Math.abs(this.speed) * 0.02;
        this.bounce = Math.sin(this.bouncePhase) * (this.type === 'bike' || this.type === 'moto' ? 1.2 : 0.6);
        this.wheelRot += Math.abs(this.speed) * 0.14;

        this.smokeCounter++;
        let interval = this.type === 'truck' ? 4 : this.type === 'auto' ? 10 : this.type === 'bike' ? 20 : this.type === 'moto' ? 16 : 15;
        interval = Math.max(2, Math.floor(interval * (1.5 - aqi / 350)));
        if (this.smokeCounter >= interval) { this.smokeCounter = 0; return true; }
        return false;
    }

    draw(ctx) {
        ctx.save();
        // Shadow
        ctx.fillStyle = 'rgba(15,23,42,0.12)';
        ctx.beginPath();
        ctx.ellipse(this.x + this.width / 2, this.y + this.height, this.width * 0.55, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.translate(Math.round(this.x), Math.round(this.y + this.bounce));
        const flip = this.speed < 0 ? -1 : 1;
        ctx.scale(this.scale * flip, this.scale);
        if (this.speed < 0) ctx.translate(-this.width / this.scale, 0);

        if (this.type === 'bike') {
            this._drawBike(ctx);
        } else if (this.type === 'moto') {
            this._drawMoto(ctx);
        } else {
            this._drawVehicle(ctx);
        }
        ctx.restore();
    }

    _drawVehicle(ctx) {
        const drawBody = (path, override = null) => {
            const g = ctx.createLinearGradient(0, 5, 0, 38);
            g.addColorStop(0, this.palette.highlight);
            g.addColorStop(0.4, override || this.palette.body);
            g.addColorStop(1, this.palette.shadow);
            ctx.fillStyle = g; ctx.fill(path);
        };
        if (this.type === 'truck') {
            drawBody(VEHICLE_PATHS.lorryContainer, '#cbd5e1');
            drawBody(VEHICLE_PATHS.lorryCabin);
            ctx.fillStyle = this.palette.window; ctx.fill(VEHICLE_PATHS.lorryWindows);
        } else if (this.type === 'auto') {
            drawBody(VEHICLE_PATHS.autoBody);
            ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.fill(VEHICLE_PATHS.autoFrame);
        } else {
            drawBody(VEHICLE_PATHS.sedanBody);
            const wg = ctx.createLinearGradient(30, 12, 60, 21);
            wg.addColorStop(0, this.palette.window);
            wg.addColorStop(0.5, 'rgba(255,255,255,0.4)');
            wg.addColorStop(1, this.palette.window);
            ctx.fillStyle = wg; ctx.fill(VEHICLE_PATHS.sedanWindows);
        }
        const drawWheel = (wx, wy) => {
            ctx.save(); ctx.translate(wx, wy); ctx.rotate(this.wheelRot);
            ctx.fillStyle = '#1e293b'; ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = this.palette.rims; ctx.lineWidth = 1.6; ctx.stroke(VEHICLE_PATHS.wheelRim);
            ctx.restore();
        };
        if (this.type === 'truck')     { drawWheel(15, 38); drawWheel(30, 38); drawWheel(95, 38); }
        else if (this.type === 'auto') { drawWheel(8, 38); drawWheel(32, 38); }
        else                           { drawWheel(22, 38); drawWheel(68, 38); }

        // Headlight
        const hx = this.type === 'truck' ? 110 : this.type === 'auto' ? 36 : 82;
        const hy = this.type === 'truck' ? 30  : this.type === 'auto' ? 24 : 30;
        ctx.fillStyle = `rgba(254,240,138,${0.4 + this.interactionTimer * 0.4})`;
        ctx.beginPath(); ctx.arc(hx, hy, 5 + this.interactionTimer * 3, 0, Math.PI * 2); ctx.fill();
    }

    _drawBike(ctx) {
        const c = this.palette;
        // Frame
        ctx.strokeStyle = c.body; ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(8, 28); ctx.lineTo(18, 10); ctx.lineTo(28, 10); ctx.lineTo(36, 28);
        ctx.moveTo(18, 10); ctx.lineTo(28, 28);
        ctx.stroke();
        // Handlebars
        ctx.strokeStyle = c.shadow; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(26, 10); ctx.lineTo(32, 6); ctx.lineTo(36, 8); ctx.stroke();
        // Seat
        ctx.fillStyle = c.shadow;
        ctx.beginPath(); ctx.roundRect(14, 8, 14, 4, 2); ctx.fill();
        // Wheels
        const drawBikeWheel = (cx, cy) => {
            ctx.save(); ctx.translate(cx, cy); ctx.rotate(this.wheelRot);
            ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI * 2); ctx.stroke();
            ctx.strokeStyle = c.rims; ctx.lineWidth = 1.5;
            for (let i = 0; i < 6; i++) {
                const a = (i / 6) * Math.PI * 2;
                ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * 8, Math.sin(a) * 8); ctx.stroke();
            }
            ctx.restore();
        };
        drawBikeWheel(10, 28); drawBikeWheel(34, 28);
        // Rider silhouette
        ctx.fillStyle = c.shadow;
        ctx.beginPath(); ctx.arc(20, 4, 4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.moveTo(18, 8); ctx.lineTo(16, 18); ctx.lineTo(24, 18); ctx.lineTo(22, 8); ctx.fill();
    }

    _drawMoto(ctx) {
        const c = this.palette;
        // Body fairing
        const g = ctx.createLinearGradient(0, 0, 0, 30);
        g.addColorStop(0, c.highlight); g.addColorStop(1, c.body);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(6, 30); ctx.lineTo(4, 16); ctx.lineTo(14, 6); ctx.lineTo(30, 6);
        ctx.lineTo(40, 14); ctx.lineTo(38, 30); ctx.closePath(); ctx.fill();
        // Windshield
        ctx.fillStyle = 'rgba(186,230,253,0.6)';
        ctx.beginPath(); ctx.moveTo(14, 8); ctx.lineTo(28, 8); ctx.lineTo(26, 14); ctx.lineTo(16, 14); ctx.fill();
        // Exhaust pipe
        ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(6, 24); ctx.lineTo(0, 26); ctx.stroke();
        // Wheels
        const drawMotoWheel = (cx, cy) => {
            ctx.save(); ctx.translate(cx, cy); ctx.rotate(this.wheelRot);
            ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 4;
            ctx.beginPath(); ctx.arc(0, 0, 11, 0, Math.PI * 2); ctx.stroke();
            ctx.strokeStyle = c.rims; ctx.lineWidth = 1.5;
            for (let i = 0; i < 8; i++) {
                const a = (i / 8) * Math.PI * 2;
                ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * 9, Math.sin(a) * 9); ctx.stroke();
            }
            ctx.restore();
        };
        drawMotoWheel(10, 30); drawMotoWheel(34, 30);
        // Rider
        ctx.fillStyle = c.shadow;
        ctx.beginPath(); ctx.arc(22, 2, 4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.moveTo(18, 6); ctx.lineTo(16, 18); ctx.lineTo(28, 18); ctx.lineTo(26, 6); ctx.fill();
        // Headlight
        ctx.fillStyle = 'rgba(254,240,138,0.9)';
        ctx.beginPath(); ctx.arc(40, 16, 4, 0, Math.PI * 2); ctx.fill();
    }
}

window.Vehicle = Vehicle;
