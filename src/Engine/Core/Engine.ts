import DefaultObject from "./BaseClasses/BaseObject";
import Vector2 from "./BaseClasses/Vector2";

interface PhysicsProperties {
	gravity: number;
}

export default class Engine {
	ctx: CanvasRenderingContext2D;
	deltaTime: number;
	children: DefaultObject[];
	properties: PhysicsProperties;
	private debugShapes: { type: string; points: Vector2 | Vector2[] }[];
	private frameDelays: number[];
	private lastDeltaTime: number;
	private stopped: boolean;
	fps: number;
	constructor(ctx: CanvasRenderingContext2D) {
		this.ctx = ctx;
		this.deltaTime = 0;
		this.lastDeltaTime = performance.now();
		this.stopped = false;
		this.children = [];
		this.properties = { gravity: 9.82 };
		this.debugShapes = [];
		this.frameDelays = [0];
		this.fps = 0;
	}

	addObject(object: DefaultObject) {
		object.engine = this;
		this.children.push(object);
	}

	render() {
		this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
		this.children.forEach((object) => {
			this.ctx.beginPath();
			object.path.forEach((vector) => {
				this.ctx.lineTo((vector.x + object.position.x) * 100 + window.innerWidth / 2, -(vector.y + object.position.y) * 100 + window.innerHeight / 2);
			});
			this.ctx.closePath();
			this.ctx.stroke();
		});

		this.debugShapes.forEach((shape) => {
			switch (shape.type) {
				case "dot":
					shape.points = shape.points as Vector2;
					this.ctx.beginPath();
					this.ctx.arc(shape.points.x * 100 + window.innerWidth / 2, -shape.points.y * 100 + window.innerHeight / 2, 5, 0, 2 * Math.PI, false);
					this.ctx.fillStyle = "#ff0000";
					this.ctx.fill();
					break;
				case "line":
					shape.points = shape.points as Vector2[];
					this.ctx.beginPath();
					this.ctx.moveTo(shape.points[0].x * 100 + window.innerWidth / 2, -shape.points[0].y * 100 + window.innerHeight / 2);
					this.ctx.lineTo(shape.points[1].x * 100 + window.innerWidth / 2, -shape.points[1].y * 100 + window.innerHeight / 2);
					this.ctx.fillStyle = "#ff0000";
					this.ctx.stroke();
					break;
			}
		});

		this.debugShapes = [];
	}

	update() {
		if (this.frameDelays.length >= 100) {
			this.frameDelays.shift();
		}
		this.frameDelays.push(this.deltaTime);
		this.fps = Math.floor(1 / (this.frameDelays.reduce((sum, num) => sum + num, 0) / this.frameDelays.length) + 0.5);
		if (this.stopped) return;
		const perf = performance.now();
		this.deltaTime = (perf - this.lastDeltaTime) / 1000;
		this.lastDeltaTime = perf;
		this.children.forEach((object) => {
			object.update();
		});
	}

	stop() {
		this.stopped = true;
	}

	debugPoint(position: Vector2) {
		this.debugShapes.push({ type: "dot", points: position });
	}

	debugLine(p1: Vector2, p2: Vector2) {
		this.debugShapes.push({ type: "line", points: [p1, p2] });
	}
}
