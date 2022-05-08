import BaseComponent from "../Core/BaseClasses/BaseComponent";
import Vector2 from "../Core/BaseClasses/Vector2";

export default class Rigidbody extends BaseComponent {
	forces: Vector2[];
	velocity: Vector2;
	mass: number;
	isGrounded: boolean;
	constructor() {
		super();
		this.forces = [];
		this.velocity = new Vector2(0, 0);
		this.mass = 10;
		this.isGrounded = false;
	}

	update() {
		//Add gravity
		this.forces.push(new Vector2(0, -this.parent.engine.properties.gravity * this.mass));
		if (this.isGrounded) this.forces.push(new Vector2(0, this.parent.engine.properties.gravity * this.mass));
		//Calculate total force
		const totalForce = new Vector2(0, 0);
		this.forces.forEach((force) => {
			totalForce.add(force);
		});

		//Add force to velocity and apply velocity
		this.velocity.add(totalForce.multiply(1 / this.mass).multiply(this.parent.engine.deltaTime));
		this.parent.position.add(this.velocity.multiply(this.parent.engine.deltaTime));

		//Clear forces
		this.forces = [];
	}
}
