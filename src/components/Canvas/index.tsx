import * as Engine from "../../Scenes/testScene";

import { useEffect, useRef, useState } from "react";

export default function Canvas() {
	const ref = useRef<HTMLCanvasElement>(null);
	const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
	const [mouseCoords, setMouseCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

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

	return (
		<>
			<canvas ref={ref} onMouseMove={(event) => setMouseCoords({ x: (event.clientX - window.innerWidth / 2) / 100, y: -(event.clientY - window.innerHeight / 2) / 100 })}></canvas>
			<p style={{ position: "fixed", left: 5, bottom: 0 }}>{mouseCoords.x + ", " + mouseCoords.y}</p>
		</>
	);
}
