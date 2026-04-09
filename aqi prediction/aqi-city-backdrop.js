/**
 * Visakhapatnam AQI Intelligence Dashboard — Premium Backdrop System
 * Highly stable, single-theme environmental manager with simplified scenery.
 */

class Cloud {
    constructor(x, y, scale, speed) {
        this.x = x;
        this.y = y;
        this.baseY = y;
        this.scale = scale;
        this.speed = speed;
        this.opacity = 0.15 + (scale * 0.1); 
        this.floatPhase = Math.random() * Math.PI * 2;
        this.turbulencePhase = Math.random() * Math.PI * 2;
        this.driftX = 0;
        this.driftY = 0;
        
        // Generate high-detail puff structure
        this.puffs = [];
        const puffCount = 12 + Math.floor(Math.random() * 8);
        for (let i = 0; i < puffCount; i++) {
            this.puffs.push({
                ox: (Math.random() - 0.5) * 100,
                oy: (Math.random() - 0.5) * 40,
                r: 20 + Math.random() * 30,
                // Depth shading: lower puffs are slightly darker
                colorShift: Math.random() * 15,
                phase: Math.random() * Math.PI * 2
            });
        }
    }

    update(windSpeed, mouse) {
        // Base drift + Wind Turbulence
        this.turbulencePhase += 0.002;
        const turbX = Math.sin(this.turbulencePhase) * 0.5;
        this.x += this.speed + (windSpeed * 0.015) + turbX;
        
        // Vertical Floating
        this.floatPhase += 0.006;
        this.y = this.baseY + Math.sin(this.floatPhase) * 12;

        // Mouse displacement logic (Air displacement feel)
        if (mouse && mouse.x > -100) {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const range = 300; // Increased range
            
            if (dist < range) {
                const force = (1 - dist / range) * 45; // Increased force
                this.driftX += (dx / dist) * force;
                this.driftY += (dy / dist) * force;
            }
        }

        // Return to base position
        this.driftX *= 0.94;
        this.driftY *= 0.94;

        if (this.x > window.innerWidth + 250) this.x = -250;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + this.driftX, this.y + this.driftY);
        ctx.scale(this.scale, this.scale);

        // Sort puffs by OY to draw bottom ones first for better layering
        const sortedPuffs = [...this.puffs].sort((a, b) => a.oy - b.oy);

        sortedPuffs.forEach(p => {
            const puffWiggle = Math.sin(this.floatPhase + p.phase) * 2;
            const px = p.ox;
            const py = p.oy + puffWiggle;
            
            const grad = ctx.createRadialGradient(px, py, 0, px, py, p.r);
            const brightness = 255 - p.colorShift;
            const op = this.opacity * (1 + (p.oy / 100)); // Lower puffs slightly more opaque
            
            grad.addColorStop(0, `rgba(${brightness}, ${brightness}, ${brightness+5}, ${op})`);
            grad.addColorStop(0.7, `rgba(${brightness-10}, ${brightness-10}, ${brightness}, ${op * 0.4})`);
            grad.addColorStop(1, 'rgba(255,255,255,0)');
            
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(px, py, p.r, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.restore();
    }
}

class BackdropSystem {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.groundY = 0;
        this.envType = 'urban';
        this.palmSway = 0;
    }

    setEnvType(type) { this.envType = type || 'urban'; }
    setGround(y) { this.groundY = y; }

    drawSky() {
        const grad = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        grad.addColorStop(0, '#bae6fd');
        grad.addColorStop(1, '#f8fafc');
        this.ctx.fillStyle = grad;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawEnvironment(aqi, emitSmoke, windSpeed) {
        this.palmSway = Math.sin(Date.now() * 0.001) * (windSpeed * 0.3);
        
        switch (this.envType) {
            case 'coastal': this.drawCoastal(); break;
            case 'industrial': this.drawIndustrial(aqi, emitSmoke); break;
            case 'rural': this.drawRural(); break;
        }

        this.drawSideInfrastructure(aqi, emitSmoke);
    }

    drawSideInfrastructure(aqi, emitSmoke) {
        const w = this.canvas.width;
        const h = this.canvas.height;
        const drawStack = (x, height, width = 24) => {
            const bx = w * x - width/2;
            const by = this.groundY - height;
            const g = this.ctx.createLinearGradient(bx, by, bx + width, by);
            g.addColorStop(0, 'rgba(15, 23, 42, 0.22)');
            g.addColorStop(1, 'rgba(15, 23, 42, 0.35)');
            this.ctx.fillStyle = g;
            this.ctx.fillRect(bx, by, width, height);
            this.ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
            this.ctx.fillRect(bx - 4, by, width + 8, 8);
            emitSmoke(bx + width/2, by, true);
        };
        drawStack(0.04, h * 0.4, 24); drawStack(0.08, h * 0.25, 18);
        drawStack(0.92, h * 0.3, 22); drawStack(0.96, h * 0.45, 28);
    }

    drawIndustrial(aqi, emitSmoke) {
        const w = this.canvas.width;
        const h = this.canvas.height;
        const drawUnit = (x, width, height) => {
            const bx = w * x;
            const by = this.groundY - height;
            this.ctx.fillStyle = 'rgba(15, 23, 42, 0.2)';
            this.ctx.fillRect(bx, by, width, height);
            const stackW = 18;
            const stackH = 100;
            const sx = bx + width/2 - stackW/2;
            const sy = by - stackH;
            this.ctx.fillStyle = 'rgba(15, 23, 42, 0.3)';
            this.ctx.fillRect(sx, sy, stackW, stackH);
            emitSmoke(sx + stackW/2, sy, true);
        };
        drawUnit(0.3, 120, h * 0.15);
        drawUnit(0.65, 140, h * 0.12);
    }

    drawCoastal() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        this.ctx.fillStyle = 'rgba(15, 23, 42, 0.06)';
        this.ctx.beginPath();
        this.ctx.moveTo(w * 0.2, this.groundY);
        this.ctx.quadraticCurveTo(w * 0.5, this.groundY - h * 0.4, w * 0.8, this.groundY);
        this.ctx.fill();
        const drawPalm = (x, s) => {
            this.ctx.save();
            this.ctx.translate(w * x, this.groundY);
            this.ctx.scale(s, s);
            this.ctx.strokeStyle = 'rgba(15, 23, 42, 0.2)'; this.ctx.lineWidth = 4;
            this.ctx.beginPath(); this.ctx.moveTo(0,0); this.ctx.quadraticCurveTo(this.palmSway, -60, this.palmSway*2, -100); this.ctx.stroke();
            this.ctx.restore();
        };
        drawPalm(0.2, 1.0); drawPalm(0.8, 0.7);
    }

    drawRural() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        this.ctx.fillStyle = 'rgba(15, 23, 42, 0.05)';
        this.ctx.beginPath();
        this.ctx.moveTo(w * 0.3, this.groundY);
        this.ctx.lineTo(w * 0.5, this.groundY - h * 0.35);
        this.ctx.lineTo(w * 0.7, this.groundY);
        this.ctx.fill();
    }

    drawRoad() {
        this.ctx.fillStyle = 'rgba(15, 23, 42, 0.03)';
        this.ctx.fillRect(0, this.groundY, this.canvas.width, this.canvas.height - this.groundY);
    }
}

const BALLOON_PATHS = {
    body: new Path2D('M0,0 C0,-40 30,-60 30,-90 C30,-120 0,-140 -30,-140 C-60,-140 -90,-120 -90,-90 C-90,-60 -60,-40 -60,0 Z'),
    basket: new Path2D('M-45,15 L-15,15 L-18,35 L-42,35 Z'),
    ropes: new Path2D('M-60,0 L-45,15 M0,0 L-15,15')
};

class HotAirBalloon {
    constructor(x, y) {
        this.baseX = x;
        this.baseY = y;
        this.x = x;
        this.y = y;
        this.bobPhase = 0;
        this.driftPhase = 0;
        this.smokeCounter = 0;
    }

    update(mouse) {
        // Gentle bobbing
        this.bobPhase += 0.015;
        this.driftPhase += 0.008;
        
        const bob = Math.sin(this.bobPhase) * 20;
        const drift = Math.cos(this.driftPhase) * 10;
        
        this.y = this.baseY + bob;
        // Subtle drift based on mouse
        if (mouse && mouse.x > -100) {
            const dx = this.x - mouse.x;
            if (Math.abs(dx) < 200) {
                this.x += (dx / 200) * 2;
            }
        }
        
        // Return to base X
        this.x += (this.baseX - this.x) * 0.01;

        this.smokeCounter++;
        if (this.smokeCounter > 45) {
            this.smokeCounter = 0;
            return true;
        }
        return false;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(0.5, 0.5); // "Small" as requested

        // DRAW ROPES
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;
        ctx.stroke(BALLOON_PATHS.ropes);

        // DRAW BASKET
        const basketGrad = ctx.createLinearGradient(-45, 15, -15, 35);
        basketGrad.addColorStop(0, '#78350f');
        basketGrad.addColorStop(1, '#451a03');
        ctx.fillStyle = basketGrad;
        ctx.fill(BALLOON_PATHS.basket);

        // DRAW BALLOON BODY
        const balloonGrad = ctx.createRadialGradient(-30, -100, 10, -30, -90, 80);
        balloonGrad.addColorStop(0, '#f87171'); // Bright Red/Coral
        balloonGrad.addColorStop(1, '#b91c1c'); // Deep Crimson
        ctx.fillStyle = balloonGrad;
        ctx.fill(BALLOON_PATHS.body);
        
        // Stripes for premium look
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.lineWidth = 8;
        ctx.stroke(BALLOON_PATHS.body);

        // Burner Glow
        const glow = Math.abs(Math.sin(this.bobPhase * 2));
        ctx.fillStyle = `rgba(253, 186, 116, ${glow * 0.6})`;
        ctx.beginPath();
        ctx.arc(-30, 0, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

class Airplane {
    constructor(x, y, speed) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.lightPhase = 0;
    }

    update() {
        this.x += this.speed;
        this.lightPhase += 0.05;
        
        if (this.x > window.innerWidth + 400) this.x = -400;
        if (this.x < -400) this.x = window.innerWidth + 400;

        // Subtle flight path oscillation
        this.y += Math.sin(Date.now() * 0.0004) * 0.15;

        return false; // No smoke
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(0.65, 0.65); // "Little small" as requested for better realism
        if (this.speed < 0) ctx.scale(-1, 1);

        // COLORS
        const colorDeepBlue = '#1e3a8a';
        const colorWhite = '#ffffff';
        const colorSteel = '#e2e8f0';

        // 1. DRAW UNDERBELLY & TAIL (Curved aerodynamic base)
        ctx.fillStyle = colorDeepBlue;
        ctx.beginPath();
        ctx.moveTo(-60, 0);
        ctx.bezierCurveTo(-60, 4, -40, 7, 40, 4);
        ctx.lineTo(60, 2);
        ctx.lineTo(60, 0);
        ctx.closePath();
        ctx.fill();

        // Vertical Stabilizer (Tail) - Sleeker swept back
        ctx.beginPath();
        ctx.moveTo(-40, 0);
        ctx.lineTo(-58, -22);
        ctx.lineTo(-46, -22);
        ctx.lineTo(-28, 0);
        ctx.closePath();
        ctx.fill();

        // 2. DRAW UPPER FUSELAGE (With subtle volume shading)
        const fuselageShield = ctx.createLinearGradient(0, -9, 0, 0);
        fuselageShield.addColorStop(0, colorSteel);
        fuselageShield.addColorStop(1, colorWhite);
        
        ctx.fillStyle = fuselageShield;
        ctx.beginPath();
        ctx.moveTo(-60, 0);
        ctx.bezierCurveTo(-60, -7, -40, -10, 42, -5);
        ctx.bezierCurveTo(58, -4, 66, -2, 66, 0); // Pointed nose
        ctx.lineTo(60, 2);
        ctx.lineTo(-60, 0);
        ctx.fill();

        // 3. DRAW ENGINES (Turbofan Pods - More detailed)
        const drawEngine = (ex, ey, isFar) => {
            ctx.save();
            ctx.fillStyle = isFar ? 'rgba(0,0,0,0.2)' : colorWhite;
            ctx.beginPath();
            ctx.ellipse(ex, ey, 12, 4.5, 0.08, 0, Math.PI * 2);
            ctx.fill();
            // Inlet detail
            ctx.fillStyle = '#1e293b';
            ctx.beginPath();
            ctx.ellipse(ex + 8, ey + 0.5, 2.5, 3.5, 0.08, 0, Math.PI * 2);
            ctx.fill();
            // Exhaust cone
            ctx.fillStyle = '#64748b';
            ctx.beginPath();
            ctx.moveTo(ex - 10, ey - 2);
            ctx.lineTo(ex - 14, ey);
            ctx.lineTo(ex - 10, ey + 2);
            ctx.fill();
            ctx.restore();
        };
        drawEngine(-8, -14, true);  // Far engine
        drawEngine(8, 14, false);   // Near engine

        // 4. DRAW WINGS (Realistic aerodynamic sweep)
        // Far Wing
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.beginPath();
        ctx.moveTo(5, -4);
        ctx.lineTo(-12, -42);
        ctx.lineTo(2, -42);
        ctx.lineTo(30, -4);
        ctx.fill();
        
        // Near Wing (White with depth)
        ctx.fillStyle = colorWhite;
        ctx.beginPath();
        ctx.moveTo(22, 4);
        ctx.lineTo(8, 38);
        ctx.lineTo(24, 38);
        ctx.lineTo(45, 4);
        ctx.fill();

        // 5. WINDOWS & DETAILS
        ctx.fillStyle = 'rgba(15, 23, 42, 0.6)'; // Cockpit windows
        ctx.beginPath();
        ctx.moveTo(48, -4);
        ctx.lineTo(56, -3);
        ctx.lineTo(54, -1);
        ctx.lineTo(46, -2);
        ctx.fill();

        // Passenger windows - Small and subtle
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        for(let i = 0; i < 10; i++) {
            ctx.beginPath();
            ctx.arc(4 + i * 4, -1, 0.6, 0, Math.PI * 2);
            ctx.fill();
        }

        // 6. NAVIGATION LIGHTS
        const glow = Math.sin(this.lightPhase) > 0.8;
        if (glow) {
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
