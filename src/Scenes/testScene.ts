import Collider from "../Engine/Components/Collider";
import Engine from "../Engine/Core/Engine";
import Rectangle from "../Engine/Objects/Rectangle";
import Rigidbody from "../Engine/Components/Rigidbody";
import Vector2 from "../Engine/Core/BaseClasses/Vector2";

export function init(ctx: CanvasRenderingContext2D) {
	const engine = new Engine(ctx);

	const rect1 = new Rectangle(0, -1, 3, 1);
	rect1.addComponent(new Collider());
	rect1.addComponent(new Rigidbody());
	engine.addObject(rect1);

	const rect2 = new Rectangle(0, -2, 10, 1);
	rect2.addComponent(new Collider());
	engine.addObject(rect2);

	const rect3 = new Rectangle(0, 2, 1, 1);
	rect3.addComponent(new Collider());
	rect3.addComponent(new Rigidbody());
	engine.addObject(rect3);

	function update() {
		engine.update();
		engine.render();
		(rect1.getComponent(Rigidbody) as Rigidbody).forces.push(new Vector2(30, 0));
		requestAnimationFrame(update);
	}

	requestAnimationFrame(update);
}
