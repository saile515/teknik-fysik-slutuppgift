import BaseComponent from "../Core/BaseClasses/BaseComponent";
import Vector from "../Core/BaseClasses/Vector";
import Vector2 from "../Core/BaseClasses/Vector2";

export default class Rigidbody extends BaseComponent {
	forces: Vector[];
	velocity: Vector2;
	mass: number;
	constructor() {
		super();
		this.forces = [];
		this.velocity = new Vector2(0, 0);
		this.mass = 10;
	}

	update() {
		//Clear forces
		this.forces = [];
		//Add gravity
		this.forces.push(new Vector(this.parent.engine.properties.gravity * this.parent.engine.deltaTime, Math.PI * (3 / 2)));
		//Calculate total force
		const totalForce = new Vector2(0, 0);
		this.forces.forEach((force) => {
			totalForce.x += Math.cos(force.direction) * force.length;
			totalForce.y += Math.sin(force.direction) * force.length;
		});

		//Add force to velocity and apply velocity
		this.velocity.add(totalForce);
		this.parent.position.add(this.velocity.multiply(this.parent.engine.deltaTime));
	}
}
