import BaseObject from "../Engine/Core/BaseClasses/BaseObject";
import Collider from "../Engine/Components/Collider";
import Engine from "../Engine/Core/Engine";
import Rectangle from "../Engine/Objects/Rectangle";
import Rigidbody from "../Engine/Components/Rigidbody";
import Vector2 from "../Engine/Core/BaseClasses/Vector2";

export function init(ctx: CanvasRenderingContext2D) {
	const engine = new Engine(ctx);

	const rect1 = new Rectangle(2, 2, 2, 2);
	rect1.addComponent(new Rigidbody());
	rect1.addComponent(new Collider());
	(rect1.getComponent(Rigidbody) as Rigidbody).mass = 10;
	engine.addObject(rect1);

	// const rect2 = new Rectangle(-2, 3, 2, 2);
	// rect2.addComponent(new Rigidbody());
	// rect2.addComponent(new Collider());
	// (rect2.getComponent(Rigidbody) as Rigidbody).mass = 100;
	// engine.addObject(rect2);

	const poly1 = new BaseObject();
	poly1.path = [new Vector2(-1, 1.5), new Vector2(2, 1.5), new Vector2(1, -1), new Vector2(-1, -1)];
	poly1.position = new Vector2(-2, 5);
	poly1.addComponent(new Rigidbody());
	(poly1.getComponent(Rigidbody) as Rigidbody).mass = 20;
	poly1.addComponent(new Collider());
	engine.addObject(poly1);

	const rect3 = new Rectangle(0, -2, 10, 1);
	rect3.addComponent(new Collider());
	engine.addObject(rect3);

	function update() {
		engine.update();
		engine.render();
		(rect1.getComponent(Rigidbody) as Rigidbody).forces.push(new Vector2(-10, 0));
		requestAnimationFrame(update);
	}

	requestAnimationFrame(update);
}
