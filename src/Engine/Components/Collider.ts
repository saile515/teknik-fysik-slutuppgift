import Vector2, { AddVector2 } from "../Core/BaseClasses/Vector2";

import BaseComponent from "../Core/BaseClasses/BaseComponent";
import BaseObject from "../Core/BaseClasses/BaseObject";
import Rigidbody from "./Rigidbody";

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

	calculateIntersection(p1: Vector2, p2: Vector2, p3: Vector2, p4: Vector2) {
		var c2x = p3.x - p4.x; // (x3 - x4)
		var c3x = p1.x - p2.x; // (x1 - x2)
		var c2y = p3.y - p4.y; // (y3 - y4)
		var c3y = p1.y - p2.y; // (y1 - y2)

		// down part of intersection point formula
		var d = c3x * c2y - c3y * c2x;

		if (d == 0) {
			return null;
		}

		// upper part of intersection point formula
		var u1 = p1.x * p2.y - p1.y * p2.x; // (x1 * y2 - y1 * x2)
		var u4 = p3.x * p4.y - p3.y * p4.x; // (x3 * y4 - y3 * x4)

		// intersection point formula

		var px = (u1 * c2x - c3x * u4) / d;
		var py = (u1 * c2y - c3y * u4) / d;

		var p = new Vector2(px, py);

		return p;
	}

	calculateNormal(p1: Vector2, p2: Vector2) {
		const normal = new Vector2(-(p2.y - p1.y), p2.x - p1.x);
		return normal.multiply(1 / normal.length());
	}
	combinedVelocity(v1: number, v2: number, m1: number, m2: number) {
		return (m1 * v1 + m2 * v2) / (m1 + m2);
	}

	update() {
		const rigidbody = this.parent.getComponent(Rigidbody) as Rigidbody;
		// Collisions only run on objects with rigidbodies
		if (!rigidbody) return;

		// Iterate all objects in scene
		this.parent.engine.children.forEach((object) => {
			// Return if object lacks collider
			if (object == this.parent) return;
			if (!object.getComponent(Collider)) return;

			// Iterate all points in object
			const collision = this.parent.path.some((vector) => {
				// Check if point is inside object
				if (this.isInside(object, AddVector2(vector, this.parent.position))) {
					// Initiate shortest vector as largest possible vector
					let shortestVector: Vector2 = new Vector2(this.INF, this.INF);

					// Iterate all sides of object to find closest edge
					for (let i = 0; i < object.path.length; i++) {
						const normal = this.calculateNormal(object.path[i], object.path[(i + 1) % object.path.length]);
						const extreme = AddVector2(AddVector2(vector, this.parent.position), normal.multiply(this.INF));
						const exit = this.calculateIntersection(
							AddVector2(vector, this.parent.position),
							extreme,
							AddVector2(object.path[i], object.position),
							AddVector2(object.path[(i + 1) % object.path.length], object.position)
						);

						shortestVector =
							AddVector2(exit, AddVector2(this.parent.position, vector).multiply(-1)).length() <
							AddVector2(shortestVector, AddVector2(this.parent.position, vector).multiply(-1)).length()
								? exit
								: shortestVector;
					}

					const objectRigidbody = object.getComponent(Rigidbody) as Rigidbody;
					// Total distance objects have to move
					const diff = AddVector2(AddVector2(this.parent.position, vector).multiply(-1), shortestVector);

					if (objectRigidbody) {
						// Move objects relative to mass
						this.parent.position.add(diff.multiply(objectRigidbody.mass / (rigidbody.mass + objectRigidbody.mass)));
						object.position.add(diff.multiply(-1 * (rigidbody.mass / (rigidbody.mass + objectRigidbody.mass))));
						// Determine combined velocity
						if (!rigidbody.isGrounded) {
							const combinedVelocity: Vector2 = new Vector2(
								this.combinedVelocity(rigidbody.velocity.x, objectRigidbody.velocity.x, rigidbody.mass, objectRigidbody.mass),
								this.combinedVelocity(rigidbody.velocity.y, objectRigidbody.velocity.y, rigidbody.mass, objectRigidbody.mass)
							);

							rigidbody.velocity = combinedVelocity;
							objectRigidbody.velocity = combinedVelocity;
						}
					} else {
						this.parent.position = AddVector2(shortestVector, vector.multiply(-1));
					}

					rigidbody.isGrounded = true;

					return true;
				}
			});

			if (!collision) {
				// Temporary variable to prevent clipping with static objects
				rigidbody.isGrounded = false;
			}
		});
	}
}
