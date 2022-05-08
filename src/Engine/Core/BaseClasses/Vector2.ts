export default class Vector2 {
	x: number;
	y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	add(vector: Vector2) {
		this.x += vector.x;
		this.y += vector.y;
	}

	multiply(num: number) {
		return new Vector2(this.x * num, this.y * num);
	}

	length() {
		return Math.sqrt(this.x ** 2 + this.y ** 2);
	}
}

export function AddVector2(vector1: Vector2, vector2: Vector2) {
	return new Vector2(vector1.x + vector2.x, vector1.y + vector2.y);
}
