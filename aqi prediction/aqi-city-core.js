/**
 * Visakhapatnam AQI Intelligence Dashboard — Premium City Orchestrator
 * High-fidelity environment manager with stabilized theme and simplified scenery.
 */

class CitySimulation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        
        this.aqi = 50;
        this.targetAqi = 50;
        this.windSpeed = 5;
        this.envType = 'urban';
        this.mouse = { x: -1000, y: -1000 };
        
        this.smoke = new SmokeSystem(800);
        this.backdrop = new BackdropSystem(this.canvas, this.ctx);
        this.vehicles = [];
        this.clouds = [];
        
        this.resize();
        this.initVehicles();
        this.initClouds();
        this.initEvents();
        this.initBalloon();
        this.initAirplane();
        
        document.documentElement.style.setProperty('--accent', '#3b82f6'); 
        
        window.addEventListener('resize', () => this.resize());
        this.animate();
    }

    initEvents() {
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        window.addEventListener('mouseleave', () => {
            this.mouse.x = -1000;
            this.mouse.y = -1000;
        });
    }

    initBalloon() {
        this.balloon = new HotAirBalloon(this.canvas.width * 0.85, 150);
    }

    initAirplane() {
        this.airplane = new Airplane(-200, 130, 0.5);
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.groundY = this.canvas.height * 0.94;
        this.backdrop.setGround(this.groundY);
        this.initVehicles();
        this.initClouds();
        this.initBalloon();
        this.initAirplane();
    }

    initClouds() {
        this.clouds = [];
        const count = Math.min(8, Math.floor(this.canvas.width / 250));
        for (let i = 0; i < count; i++) {
            const scale = 0.5 + Math.random() * 1.5;
            const speed = (0.05 + Math.random() * 0.1) * (2 - scale); // Layered speed
            this.clouds.push(new Cloud(
                Math.random() * this.canvas.width,
                50 + Math.random() * 180,
                scale,
                speed
            ));
        }
    }

    initVehicles() {
        this.vehicles = [];
        const laneCount = 2;
        const vehiclesPerLane = Math.min(4, Math.floor(window.innerWidth / 400));
        
        for (let l = 0; l < laneCount; l++) {
            const laneY = this.groundY - (l * 12) - 5;
            for (let i = 0; i < vehiclesPerLane; i++) {
                const speed = (0.3 + Math.random() * 0.8) * (Math.random() > 0.5 ? 1 : -1);
                const types = ['truck', 'car', 'car', 'auto'];
                const type = types[Math.floor(Math.random() * types.length)];
                this.vehicles.push(new Vehicle(
                    Math.random() * this.canvas.width, 
                    laneY, 
                    speed, 
                    type,
                    l
                ));
            }
        }
        
        // Sort vehicles by lane (Y) for correct painter's algorithm
        this.vehicles.sort((a, b) => a.y - b.y);
    }

    emitSmoke(x, y, isFactory = false, type = 'gray') {
        const intensity = isFactory ? 0.6 : 0.25;
        if (Math.random() > intensity) return;

        const size = (isFactory ? 14 : 6) * (0.9 + Math.random() * 0.4);
        const opacity = (isFactory ? 0.35 : 0.25) * (0.8 + Math.random() * 0.4);
        const vx = (Math.random() - 0.5) * 0.3 + (this.windSpeed * 0.02);
        const vy = -(0.5 + Math.random() * 0.8);
        const life = (isFactory ? 200 : 150) + Math.random() * 200;
        
        this.smoke.emit(x, y, size, opacity, vx, vy, life, type);
    }

    updateAQI(aqi, wind = 5, envType = 'urban') {
        const typeChanged = this.envType !== envType;
        this.targetAqi = aqi;
        this.windSpeed = wind;
        this.envType = envType;
        this.backdrop.setEnvType(envType);
        
        if (typeChanged) this.initVehicles();
    }

    animate() {
        this.aqi += (this.targetAqi - this.aqi) * 0.012;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.backdrop.drawSky(this.aqi);

        // Update & Draw Clouds (Back layers first)
        this.clouds.sort((a, b) => a.scale - b.scale);
        this.clouds.forEach(c => {
            c.update(this.windSpeed, this.mouse);
            c.draw(this.ctx);
        });

        this.backdrop.drawEnvironment(this.aqi, (x, y, isF) => this.emitSmoke(x, y, isF), this.windSpeed);
        this.backdrop.drawRoad();

        // Update & Draw Balloon
        if (this.balloon && this.balloon.update(this.mouse)) {
            this.emitSmoke(this.balloon.x - 15, this.balloon.y, false, 'gray');
        }
        if (this.balloon) this.balloon.draw(this.ctx);

        // Update & Draw Airplane
        if (this.airplane) {
            this.airplane.update();
            this.airplane.draw(this.ctx);
        }
        
        this.vehicles.forEach(v => {
            if (v.update(this.aqi, this.mouse)) {
                const ex = v.speed > 0 ? v.x : v.x + v.width;
                const smokeType = v.type === 'truck' ? 'soot' : 'gray';
                this.emitSmoke(ex, v.y + v.bounce + v.height - 4, false, smokeType);
            }
            v.draw(this.ctx);
        });

        this.smoke.update(this.windSpeed);
        this.smoke.draw(this.ctx);
        
        requestAnimationFrame(() => this.animate());
    }
}

window.initAQIBackground = (canvasId) => {
    window.AQIBackground = new CitySimulation(canvasId);
};
