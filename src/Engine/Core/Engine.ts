import DefaultObject from "./BaseClasses/BaseObject";

interface PhysicsProperties {
	gravity: number;
}

export default class Engine {
	ctx: CanvasRenderingContext2D;
	deltaTime: number;
	private lastDeltaTime: number;
	children: DefaultObject[];
	properties: PhysicsProperties;
	constructor(ctx: CanvasRenderingContext2D) {
		this.ctx = ctx;
		this.deltaTime = 0;
		this.lastDeltaTime = performance.now();
		this.children = [];
		this.properties = { gravity: 9.82 };
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
				this.ctx.lineTo((vector.x + object.position.x) * 10 + window.innerWidth / 2, -(vector.y + object.position.y) * 10 + window.innerHeight / 2);
			});
			this.ctx.closePath();
			this.ctx.stroke();
		});
	}

	update() {
		const perf = performance.now();
		this.deltaTime = (perf - this.lastDeltaTime) / 1000;
		this.lastDeltaTime = perf;
		this.children.forEach((object) => {
			object.update();
		});
	}
}
