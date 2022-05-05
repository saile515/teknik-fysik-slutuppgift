import BaseObject from "./BaseObject";

export default class BaseComponent {
	parent: BaseObject | null;

	constructor() {
		this.parent = null;
	}

	update() {}
}
