/**
 * Visakhapatnam AQI Intelligence Dashboard — Professional Realistic Vehicle System
 * High-fidelity, architectural vector models with metallic shading and realistic proportions.
 * Facing: Right-default for correct directional movement.
 */

const VEHICLE_COLORS = [
    { body: '#e2e8f0', shadow: '#94a3b8', highlight: '#f8fafc', window: '#cbd5e1', rims: '#64748b' }, // Metallic Silver
    { body: '#3b82f6', shadow: '#1e3a8a', highlight: '#60a5fa', window: '#bfdbfe', rims: '#f1f5f9' }, // Royal Blue
    { body: '#0f172a', shadow: '#020617', highlight: '#334155', window: '#475569', rims: '#94a3b8' }, // Obsidian Black
    { body: '#b91c1c', shadow: '#7f1d1d', highlight: '#f87171', window: '#fecaca', rims: '#e2e8f0' }, // Deep Crimson
    { body: '#71717a', shadow: '#3f3f46', highlight: '#a1a1aa', window: '#e4e4e7', rims: '#18181b' }  // Gunmetal
];

const VEHICLE_PATHS = {
    // Realistic Sedan: Right-facing (Hood on the right)
    sedanBody: new Path2D('M0,38 L0,23 L15,21 L28,10 L58,10 L68,21 L85,24 L85,38 Z'),
    sedanWindows: new Path2D('M30,12 L56,12 L64,21 L22,21 Z'),
    
    // Heavy Freight Lorry: Right-facing (Cabin on the right)
    lorryContainer: new Path2D('M0,5 L80,5 L80,38 L0,38 Z'),
    lorryCabin: new Path2D('M82,15 L108,15 L112,25 L112,38 L82,38 Z'),
    lorryWindows: new Path2D('M88,18 L105,18 L108,25 L88,25 Z'),
    
    // Professional Auto-Rickshaw: Right-facing
    autoBody: new Path2D('M0,38 L0,18 L6,8 L28,8 L35,22 L38,38 Z'),
    autoFrame: new Path2D('M10,12 L26,12 L26,26 L10,26 Z'),
    
    wheelRim: new Path2D('M0,0 m-5,0 a5,5 0 1,0 10,0 a5,5 0 1,0 -10,0 M0,0 m-2,0 a2,2 0 1,0 4,0 a2,2 0 1,0 -4,0')
};

class Vehicle {
    constructor(x, y, speed, type, lane = 0) {
        this.x = x;
        this.realY = y; // Target lane Y
        this.y = y;
        this.speed = speed;
        this.baseSpeed = speed;
        this.type = type;
        this.lane = lane;
        this.palette = VEHICLE_COLORS[Math.floor(Math.random() * VEHICLE_COLORS.length)];
        
        if (type === 'truck') { this.scale = 0.85; this.width = 112 * 0.85; }
        else if (type === 'auto') { this.scale = 0.95; this.width = 38 * 0.95; }
        else { this.scale = 1.0; this.width = 85; }

        this.height = 38 * this.scale;
        this.bounce = 0;
        this.bouncePhase = Math.random() * Math.PI;
        this.wheelRot = 0;
        this.smokeCounter = 0;
        this.interactionTimer = 0;
        this.isHovered = false;
    }

    update(aqi, mouse = null) {
        // Smooth speed adjustment (slowing down for AQI/Mouse)
        let targetSpeed = this.baseSpeed;
        
        this.isHovered = false;
        if (mouse && mouse.x > -100) {
            const dx = this.x + this.width/2 - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 100) {
                targetSpeed *= 0.6; // Slow down when cursor is near
                this.isHovered = true;
                this.interactionTimer = Math.min(this.interactionTimer + 0.1, 1);
            } else {
                this.interactionTimer = Math.max(this.interactionTimer - 0.05, 0);
            }
        }

        this.speed += (targetSpeed - this.speed) * 0.1;
        this.x += this.speed;

        if (this.x > window.innerWidth + 200) this.x = -200;
        if (this.x < -200) this.x = window.innerWidth + 200;

        this.bouncePhase += 0.08 + (Math.abs(this.speed) * 0.02);
        this.bounce = Math.sin(this.bouncePhase) * 0.6;
        this.wheelRot += Math.abs(this.speed) * 0.12;

        this.smokeCounter++;
        // BALANCED SMOKE: Reduced frequency from the previous "dense" mode.
        let interval = 8; 
        if (this.type === 'truck') interval = 4;
        if (this.type === 'auto') interval = 10;
        if (this.type === 'car') interval = 15;
        
        // Scale interval based on AQI
        interval = Math.max(2, Math.floor(interval * (1.5 - (aqi / 350))));

        if (this.smokeCounter >= interval) {
            this.smokeCounter = 0;
            return true;
        }
        return false;
    }

    draw(ctx) {
        ctx.save();
        
        // Dynamic Road Shadow
        ctx.fillStyle = 'rgba(15, 23, 42, 0.15)';
        ctx.beginPath();
        const sw = this.width * 1.1;
        const sh = 10;
        ctx.ellipse(this.x + this.width/2, this.y + this.height - 2, sw/2, sh/2, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.translate(Math.round(this.x), Math.round(this.y + this.bounce));
        
        // Directional Scaling
        const flip = this.speed < 0 ? -1 : 1;
        ctx.scale(this.scale * flip, this.scale);
        if (this.speed < 0) ctx.translate(-this.width / this.scale, 0);

        const drawBody = (path, overrideColor = null) => {
            const g = ctx.createLinearGradient(0, 5, 0, 38);
            g.addColorStop(0, this.palette.highlight);
            g.addColorStop(0.4, overrideColor || this.palette.body);
            g.addColorStop(1, this.palette.shadow);
            ctx.fillStyle = g;
            ctx.fill(path);
        };

        if (this.type === 'truck') {
            drawBody(VEHICLE_PATHS.lorryContainer, '#cbd5e1');
            drawBody(VEHICLE_PATHS.lorryCabin);
            ctx.fillStyle = this.palette.window;
            ctx.fill(VEHICLE_PATHS.lorryWindows);
        } else if (this.type === 'auto') {
            drawBody(VEHICLE_PATHS.autoBody);
            ctx.fillStyle = 'rgba(0,0,0,0.4)';
            ctx.fill(VEHICLE_PATHS.autoFrame);
        } else {
            drawBody(VEHICLE_PATHS.sedanBody);
            const wg = ctx.createLinearGradient(30, 12, 60, 21);
            wg.addColorStop(0, this.palette.window);
            wg.addColorStop(0.5, 'rgba(255,255,255,0.4)');
            wg.addColorStop(1, this.palette.window);
            ctx.fillStyle = wg;
            ctx.fill(VEHICLE_PATHS.sedanWindows);
        }

        const drawWheel = (wx, wy) => {
            ctx.save();
            ctx.translate(wx, wy);
            ctx.rotate(this.wheelRot);
            ctx.fillStyle = '#1e293b'; // Slightly lighter black for wheels
            ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = this.palette.rims;
            ctx.lineWidth = 1.6;
            ctx.stroke(VEHICLE_PATHS.wheelRim);
            ctx.restore();
        };

        if (this.type === 'truck') {
            drawWheel(15, 38); drawWheel(30, 38); drawWheel(95, 38); 
        } else if (this.type === 'auto') {
            drawWheel(8, 38); drawWheel(32, 38);
        } else {
            drawWheel(22, 38); drawWheel(68, 38);
        }

        // Headlight glow (Reactive to interaction)
        const glowOpacity = 0.4 + (this.interactionTimer * 0.4);
        const glowSize = 5 + (this.interactionTimer * 3);
        ctx.fillStyle = `rgba(254, 240, 138, ${glowOpacity})`;
        const hx = this.type === 'truck' ? 110 : (this.type === 'auto' ? 36 : 82);
        const hy = this.type === 'truck' ? 30 : (this.type === 'auto' ? 24 : 30);
        
        ctx.beginPath(); 
        ctx.arc(hx, hy, glowSize, 0, Math.PI * 2); 
        ctx.fill();
        
        // Interaction highlight
        if (this.interactionTimer > 0) {
            ctx.strokeStyle = `rgba(59, 130, 246, ${this.interactionTimer * 0.3})`;
            ctx.lineWidth = 2;
            ctx.strokeRect(-5, -5, this.width/this.scale + 10, this.height/this.scale + 10);
        }

        ctx.restore();
    }
}

window.Vehicle = Vehicle;

