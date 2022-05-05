import * as Engine from "../../Scenes/testScene";

import { useEffect, useRef, useState } from "react";

export default function Canvas() {
	const ref = useRef<HTMLCanvasElement>(null);
	const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

	useEffect(() => {
		if (!ref.current) return;
		setCtx(ref.current.getContext("2d"));
		ref.current.width = window.innerWidth;
		ref.current.height = window.innerHeight;
	}, [ref.current]);

	useEffect(() => {
		if (!ctx) return;
		Engine.init(ctx);
	}, [ctx]);

	return <canvas ref={ref}></canvas>;
}
