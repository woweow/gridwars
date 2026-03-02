"use client";

import type { CellColor } from "@/lib/game";

type SquareProps = {
	color: CellColor;
	onClick: () => void;
};

export function Square({ color, onClick }: SquareProps) {
	const colorClass = color === "red" ? "red" : color === "blue" ? "blue" : "empty";

	return (
		<button
			type="button"
			onClick={onClick}
			className={`battle-square ${colorClass}`}
			style={{
				minWidth: "44px",
				minHeight: "44px",
				width: "100%",
				aspectRatio: "1",
			}}
			aria-label={`Sector: ${color ?? "unclaimed"}`}
		/>
	);
}
