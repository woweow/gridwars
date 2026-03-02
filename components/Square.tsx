"use client";

import type { CellColor } from "@/lib/game";

type SquareProps = {
	color: CellColor;
	onClick: () => void;
};

const colorClasses: Record<string, string> = {
	red: "bg-red-500 hover:bg-red-400",
	blue: "bg-blue-500 hover:bg-blue-400",
	empty: "bg-gray-300 hover:bg-gray-200",
};

export function Square({ color, onClick }: SquareProps) {
	const colorClass = color ? colorClasses[color] : colorClasses.empty;

	return (
		<button
			type="button"
			onClick={onClick}
			className={`${colorClass} min-w-[44px] min-h-[44px] w-full aspect-square rounded-md cursor-pointer transition-colors border-2 border-gray-400/30`}
			aria-label={`Square: ${color ?? "empty"}`}
		/>
	);
}
