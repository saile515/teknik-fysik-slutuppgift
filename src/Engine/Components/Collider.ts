import Vector2, { AddVector2 } from "../Core/BaseClasses/Vector2";

import BaseComponent from "../Core/BaseClasses/BaseComponent";
import BaseObject from "../Core/BaseClasses/BaseObject";

export default class Collider extends BaseComponent {
	INF: number;
	parent: BaseObject;
	constructor() {
		super();
		this.INF = 10000;
	}

	//Collider code based on https://www.geeksforgeeks.org/how-to-check-if-a-given-point-lies-inside-a-polygon/

	// Given three collinear points p, q, r,
	// the function checks if point q lies
	// on line segment 'pr'
	onSegment(p: Vector2, q: Vector2, r: Vector2) {
		if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y)) {
			return true;
		}
		return false;
	}

	// To find orientation of ordered triplet (p, q, r).
	// The function returns following values
	// 0 --> p, q and r are collinear
	// 1 --> Clockwise
	// 2 --> Counterclockwise
	orientation(p: Vector2, q: Vector2, r: Vector2) {
		let val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);

		if (val == 0) {
			return 0; // collinear
		}
		return val > 0 ? 1 : 2; // clock or counterclock wise
	}

	// The function that returns true if
	// line segment 'p1q1' and 'p2q2' intersect.
	doIntersect(p1: Vector2, q1: Vector2, p2: Vector2, q2: Vector2) {
		// Find the four orientations needed for
		// general and special cases
		let o1 = this.orientation(p1, q1, p2);
		let o2 = this.orientation(p1, q1, q2);
		let o3 = this.orientation(p2, q2, p1);
		let o4 = this.orientation(p2, q2, q1);

		// General case
		if (o1 != o2 && o3 != o4) {
			return true;
		}

		// Special Cases
		// p1, q1 and p2 are collinear and
		// p2 lies on segment p1q1
		if (o1 == 0 && this.onSegment(p1, p2, q1)) {
			return true;
		}

		// p1, q1 and p2 are collinear and
		// q2 lies on segment p1q1
		if (o2 == 0 && this.onSegment(p1, q2, q1)) {
			return true;
		}

		// p2, q2 and p1 are collinear and
		// p1 lies on segment p2q2
		if (o3 == 0 && this.onSegment(p2, p1, q2)) {
			return true;
		}

		// p2, q2 and q1 are collinear and
		// q1 lies on segment p2q2
		if (o4 == 0 && this.onSegment(p2, q1, q2)) {
			return true;
		}

		// Doesn't fall in any of the above cases
		return false;
	}

	// Returns true if the point p lies
	// inside the polygon[] with n vertices
	isInside(object: BaseObject, p: Vector2) {
		// There must be at least 3 vertices in polygon[]
		if (object.path.length < 3) {
			return false;
		}

		// Create a point for line segment from p to infinite
		const extreme = new Vector2(this.INF, p.y);

		// Count intersections of the above line
		// with sides of polygon
		let count = 0,
			i = 0;
		do {
			let next = (i + 1) % object.path.length;

			// Check if the line segment from 'p' to
			// 'extreme' intersects with the line
			// segment from 'polygon[i]' to 'polygon[next]'
			if (this.doIntersect(AddVector2(object.path[i], object.position), AddVector2(object.path[next], object.position), p, extreme)) {
				// If the point 'p' is collinear with line
				// segment 'i-next', then check if it lies
				// on segment. If it lies, return true, otherwise false
				if (this.orientation(AddVector2(object.path[i], object.position), p, AddVector2(object.path[next], object.position)) == 0) {
					return this.onSegment(AddVector2(object.path[i], object.position), p, AddVector2(object.path[next], object.position));
				}

				count++;
			}
			i = next;
		} while (i != 0);

		return count % 2 == 1;
	}

	update() {
		this.parent.engine.children.forEach((object) => {
			if (object == this.parent) return;
			if (!object.getComponent(Collider)) return;

			this.parent.path.forEach((vector) => {
				if (this.isInside(object, AddVector2(vector, this.parent.position))) console.log("Collision");
			});
		});
	}
}
