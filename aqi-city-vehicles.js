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
    sedanBody:      new Path2D('M4,34 C4,28 6,24 16,22 C30,12 45,10 60,10 C75,10 84,20 88,24 C100,24 100,34 96,38 L4,38 Z'),
    sedanWindows:   new Path2D('M32,12 L56,12 C64,12 70,16 78,21 L22,21 C24,18 28,12 32,12 Z'),
    lorryContainer: new Path2D('M0,4 C0,2 2,0 4,0 L84,0 C86,0 88,2 88,4 L88,38 L0,38 Z'),
    lorryCabin:     new Path2D('M90,14 C90,12 92,10 94,10 L112,10 C120,10 125,18 126,24 L126,38 L90,38 Z'),
    lorryWindows:   new Path2D('M96,14 L110,14 C116,14 118,18 120,24 L96,24 Z'),
    autoBody:       new Path2D('M4,38 L4,18 C4,10 8,6 18,6 L26,6 C34,6 38,14 42,24 L46,38 Z'),
    autoFrame:      new Path2D('M10,10 L24,10 C28,10 30,12 32,16 L32,24 L10,24 Z'),
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

        if (type === 'truck')      { this.scale = 0.85; this.width = 126 * 0.85; this.height = 46 * 0.85; }
        else if (type === 'auto')  { this.scale = 0.95; this.width = 46 * 0.95;  this.height = 46 * 0.95; }
        else if (type === 'bike')  { this.scale = 0.70; this.width = 44 * 0.70;  this.height = 38 * 0.70; }
        else if (type === 'moto')  { this.scale = 0.75; this.width = 50 * 0.75;  this.height = 42 * 0.75; }
        else                       { this.scale = 1.00; this.width = 100;        this.height = 46; }
    }

    update(aqi, mouse = null) {
        let targetSpeed = this.baseSpeed;
        this.isBraking = false;
        if (mouse && mouse.x > -100) {
            const dx = this.x + this.width / 2 - mouse.x;
            const dy = this.y + this.height / 2 - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 200) {
                // Smooth hysteresis to prevent vibrating/jittering at the braking threshold
                const factor = Math.min(1, Math.max(0, (200 - dist) / 100));
                targetSpeed = this.baseSpeed * (1 - factor * 0.85); 
                this.isBraking = factor > 0.05;
                this.interactionTimer = Math.min(this.interactionTimer + 0.15, 1);
            } else {
                this.interactionTimer = Math.max(this.interactionTimer - 0.05, 0);
            }
        }
        const accel = targetSpeed - this.speed;
        this.speed += accel * 0.15;
        this.x += this.speed;
        this.tilt = (accel / this.baseSpeed) * -8 * (this.speed > 0 ? 1 : -1);
        
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

        ctx.translate(Math.round(this.x + this.width / 2), Math.round(this.y + this.bounce + this.height));
        if (this.tilt) ctx.rotate(this.tilt * Math.PI / 180);
        ctx.translate(-this.width / 2, -this.height);
        
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
        if (this.type === 'truck')     { drawWheel(15, 38); drawWheel(30, 38); drawWheel(105, 38); }
        else if (this.type === 'auto') { drawWheel(8, 38); drawWheel(34, 38); }
        else                           { drawWheel(22, 38); drawWheel(78, 38); }

        // Headlight
        const hx = this.type === 'truck' ? 126 : this.type === 'auto' ? 44 : 96;
        const hy = this.type === 'truck' ? 30  : this.type === 'auto' ? 24 : 26;
        ctx.fillStyle = `rgba(254,240,138,${0.4 + this.interactionTimer * 0.4})`;
        ctx.beginPath(); ctx.arc(hx, hy, 5 + this.interactionTimer * 3, 0, Math.PI * 2); ctx.fill();

        // Brake lights / Tail lights
        const bx = this.type === 'truck' ? 2 : this.type === 'auto' ? 4 : 4;
        const by = this.type === 'truck' ? 30 : this.type === 'auto' ? 22 : 22;
        ctx.fillStyle = this.isBraking ? '#ef4444' : '#7f1d1d';
        ctx.beginPath(); ctx.arc(bx, by, this.isBraking ? 4 : 2, 0, Math.PI * 2); ctx.fill();
        if (this.isBraking) {
            ctx.fillStyle = 'rgba(239,68,68,0.4)';
            ctx.beginPath(); ctx.arc(bx - 2, by, 8, 0, Math.PI * 2); ctx.fill();
        }
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
