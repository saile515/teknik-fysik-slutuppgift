import BaseComponent from "./BaseComponent";
import Engine from "../Engine";
import Vector2 from "./Vector2";

export default class BaseObject {
	engine: Engine;
	private components: BaseComponent[];
	path: Vector2[];
	position: Vector2;
	dimensions: Vector2;

	constructor() {
		this.engine = null;
		this.components = [];
		this.path = [];
		this.position = new Vector2(0, 0);
		this.dimensions = new Vector2(0, 0);
	}

	update() {
		this.components.forEach((component) => {
			component.update();
		});
	}

	addComponent(component: BaseComponent) {
		component.parent = this;
		this.components.push(component);
	}

	getComponent(type: typeof BaseComponent) {
		return this.components.find((component) => component instanceof type);
	}

	setPath(path: Vector2[]) {
		this.path = path;
		this.calculateDimensions();
	}

	calculateDimensions() {
		const boundingBox = { top: 0, right: 0, bottom: 0, left: 0 };

		this.path.forEach((vector) => {
			if (vector.x < boundingBox.left) boundingBox.left = vector.x;
			if (vector.x > boundingBox.right) boundingBox.right = vector.x;
			if (vector.y < boundingBox.top) boundingBox.top = vector.y;
			if (vector.x > boundingBox.bottom) boundingBox.bottom = vector.y;
		});

		this.dimensions = new Vector2(boundingBox.right - boundingBox.left, boundingBox.bottom - boundingBox.top);
	}
}
