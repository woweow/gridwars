"use client";

import * as Switch from "@radix-ui/react-switch";
import { trackColorSwitched } from "@/lib/analytics";
import type { TeamColor } from "@/lib/game";

type ColorToggleProps = {
	color: TeamColor;
	onColorChange: (color: TeamColor) => void;
};

export function ColorToggle({ color, onColorChange }: ColorToggleProps) {
	const isBlue = color === "blue";

	return (
		<div className="flex items-center gap-3">
			<span className={`font-bold text-lg ${color === "red" ? "text-red-500" : "text-gray-400"}`}>
				Red
			</span>
			<Switch.Root
				checked={isBlue}
				onCheckedChange={(checked) => {
					const newColor: TeamColor = checked ? "blue" : "red";
					trackColorSwitched(color, newColor);
					onColorChange(newColor);
				}}
				className="w-12 h-7 bg-gray-700 rounded-full relative cursor-pointer transition-colors data-[state=checked]:bg-gray-700"
			>
				<Switch.Thumb
					className={`block w-5 h-5 rounded-full transition-transform translate-x-1 data-[state=checked]:translate-x-6 ${
						isBlue ? "bg-blue-500" : "bg-red-500"
					}`}
				/>
			</Switch.Root>
			<span className={`font-bold text-lg ${color === "blue" ? "text-blue-500" : "text-gray-400"}`}>
				Blue
			</span>
		</div>
	);
}
