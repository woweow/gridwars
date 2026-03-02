"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { trackSquareClaimed } from "@/lib/analytics";
import type { TeamColor } from "@/lib/game";
import { Square } from "./Square";

type GridProps = {
	playerColor: TeamColor;
};

export function Grid({ playerColor }: GridProps) {
	const config = useQuery(api.config.getConfig);
	const grid = useQuery(api.grid.getGrid);
	const claimSquare = useMutation(api.grid.claimSquare);

	if (!config || !grid) {
		return <div className="text-gray-400">Loading...</div>;
	}

	const gridSize = config.gridSize;

	const handleClick = (squareIndex: number, previousColor: string | null) => {
		trackSquareClaimed(playerColor, squareIndex, previousColor);
		claimSquare({ squareIndex, color: playerColor });
	};

	return (
		<div
			className="grid gap-1 w-full max-w-md mx-auto"
			style={{
				gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
			}}
		>
			{grid.map((square) => (
				<Square
					key={square._id}
					color={square.color}
					onClick={() => handleClick(square.squareIndex, square.color)}
				/>
			))}
		</div>
	);
}
