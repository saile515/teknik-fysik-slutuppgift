import BaseObject from "../Engine/Core/BaseClasses/BaseObject";
import Collider from "../Engine/Components/Collider";
import Engine from "../Engine/Core/Engine";
import Rectangle from "../Engine/Objects/Rectangle";
import Rigidbody from "../Engine/Components/Rigidbody";
import Vector2 from "../Engine/Core/BaseClasses/Vector2";

export function init(ctx: CanvasRenderingContext2D) {
	const engine = new Engine(ctx);

	const poly1 = new BaseObject();
	poly1.position = new Vector2(1.1, 5);
	poly1.path = [new Vector2(-1, 1), new Vector2(1, 1), new Vector2(0, -1)];
	poly1.addComponent(new Rigidbody());
	poly1.addComponent(new Collider());
	engine.addObject(poly1);

	const rect1 = new Rectangle(0, 0, 2, 2);
	rect1.addComponent(new Rigidbody());
	rect1.addComponent(new Collider());
	engine.addObject(rect1);

	const rect2 = new Rectangle(0, -2, 10, 1);
	rect2.addComponent(new Collider());
	engine.addObject(rect2);

	function update() {
		engine.update();
		engine.render();
		requestAnimationFrame(update);
	}

	requestAnimationFrame(update);
}
