import BaseObject from "../Core/BaseClasses/BaseObject";
import Vector2 from "../Core/BaseClasses/Vector2";

export default class Rectangle extends BaseObject {
	constructor(x: number, y: number, width: number, height: number) {
		super();
		this.position = new Vector2(x, y);
		const rectangle: Vector2[] = [];
		rectangle.push(new Vector2(-width / 2, height / 2));
		rectangle.push(new Vector2(width / 2, height / 2));
		rectangle.push(new Vector2(width / 2, -height / 2));
		rectangle.push(new Vector2(-width / 2, -height / 2));

		this.setPath(rectangle);
	}
}
