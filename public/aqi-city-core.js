/**
 * AQI Dashboard — City Simulation Orchestrator
 * Bikes, motos, cars, trucks, autos — airplane follows mouse
 */

class CitySimulation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');

        this.aqi       = 50;
        this.targetAqi = 50;
        this.windSpeed = 5;
        this.envType   = 'urban';
        this.mouse     = { x: -1000, y: -1000 };

        this.smoke    = new SmokeSystem(800);
        this.backdrop = new BackdropSystem(this.canvas, this.ctx);
        this.vehicles = [];
        this.clouds   = [];

        this.resize();
        this.initVehicles();
        this.initClouds();
        this.initEvents();
        this.initBalloon();
        this.initAirplane();

        window.addEventListener('resize', () => this.resize());
        this.animate();
    }

    initEvents() {
        window.addEventListener('mousemove', e => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        window.addEventListener('mouseleave', () => {
            this.mouse.x = -1000;
            this.mouse.y = -1000;
        });
    }

    initBalloon() {
        this.balloon = new HotAirBalloon(this.canvas.width * 0.82, 140);
    }

    initAirplane() {
        // Start at center-ish so it's visible immediately
        this.airplane = new Airplane(
            this.canvas.width * 0.3,
            this.canvas.height * 0.18,
            0.5
        );
    }

    resize() {
        this.canvas.width  = window.innerWidth;
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
        const count = Math.min(9, Math.floor(this.canvas.width / 220));
        for (let i = 0; i < count; i++) {
            const scale = 0.5 + Math.random() * 1.4;
            const speed = (0.04 + Math.random() * 0.09) * (2 - scale);
            this.clouds.push(new Cloud(
                Math.random() * this.canvas.width,
                40 + Math.random() * 170,
                scale, speed
            ));
        }
    }

    initVehicles() {
        this.vehicles = [];
        const laneCount = 3;
        // More vehicles per lane — bikes and motos included
        const perLane = Math.min(6, Math.floor(window.innerWidth / 280));

        for (let l = 0; l < laneCount; l++) {
            const laneY = this.groundY - l * 14 - 5;
            for (let i = 0; i < perLane; i++) {
                const speed = (0.3 + Math.random() * 1.0) * (Math.random() > 0.5 ? 1 : -1);
                // Weighted type distribution — more bikes/motos
                const roll = Math.random();
                let type;
                if (roll < 0.20)      type = 'bike';
                else if (roll < 0.38) type = 'moto';
                else if (roll < 0.55) type = 'truck';
                else if (roll < 0.70) type = 'auto';
                else                  type = 'car';

                this.vehicles.push(new Vehicle(
                    Math.random() * this.canvas.width,
                    laneY, speed, type, l
                ));
            }
        }
        this.vehicles.sort((a, b) => a.y - b.y);
    }

    emitSmoke(x, y, isFactory = false, type = 'gray') {
        if (Math.random() > (isFactory ? 0.6 : 0.25)) return;
        const size    = (isFactory ? 14 : 5) * (0.9 + Math.random() * 0.4);
        const opacity = (isFactory ? 0.30 : 0.20) * (0.8 + Math.random() * 0.4);
        const vx      = (Math.random() - 0.5) * 0.3 + this.windSpeed * 0.02;
        const vy      = -(0.4 + Math.random() * 0.7);
        const life    = (isFactory ? 180 : 130) + Math.random() * 180;
        this.smoke.emit(x, y, size, opacity, vx, vy, life, type);
    }

    updateAQI(aqi, wind = 5, envType = 'urban') {
        const changed = this.envType !== envType;
        this.targetAqi = aqi;
        this.windSpeed = wind;
        this.envType   = envType;
        this.backdrop.setEnvType(envType);
        if (changed) this.initVehicles();
    }

    animate() {
        this.aqi += (this.targetAqi - this.aqi) * 0.012;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.backdrop.drawSky(this.aqi);

        // Clouds — back to front
        this.clouds.sort((a, b) => a.scale - b.scale);
        this.clouds.forEach(c => { c.update(this.windSpeed, this.mouse); c.draw(this.ctx); });

        this.backdrop.drawEnvironment(this.aqi, (x, y, isF) => this.emitSmoke(x, y, isF), this.windSpeed);
        this.backdrop.drawRoad();

        // Balloon
        if (this.balloon && this.balloon.update(this.mouse)) {
            this.emitSmoke(this.balloon.x - 12, this.balloon.y, false, 'gray');
        }
        if (this.balloon) this.balloon.draw(this.ctx);

        // Airplane — zig-zag, no mouse needed
        if (this.airplane) {
            this.airplane.update();
            this.airplane.draw(this.ctx);
        }

        // Vehicles
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

window.initAQIBackground = canvasId => {
    window.AQIBackground = new CitySimulation(canvasId);
};
