import Collider from "../Engine/Components/Collider";
import Engine from "../Engine/Core/Engine";
import Rectangle from "../Engine/Objects/Rectangle";
import Rigidbody from "../Engine/Components/Rigidbody";

export function init(ctx: CanvasRenderingContext2D) {
	const engine = new Engine(ctx);

	const rect1 = new Rectangle(0, 0, 1, 1);
	rect1.addComponent(new Rigidbody());
	rect1.addComponent(new Collider());
	engine.addObject(rect1);

	const rect2 = new Rectangle(0.1, -5, 1, 1);
	rect2.addComponent(new Collider());
	engine.addObject(rect2);

	//const rect2 = new Rectangle(2, 0, 1, 1);
	//const initialTime = performance.now();
	//engine.addObject(rect2);

	function update() {
		engine.update();
		engine.render();
		//rect2.position.y = -(9.82 * ((performance.now() - initialTime) / 1000) ** 2);
		requestAnimationFrame(update);
	}

	requestAnimationFrame(update);
}
