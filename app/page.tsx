"use client";

import { useState } from "react";
import { ColorToggle } from "@/components/ColorToggle";
import { Grid } from "@/components/Grid";
import { Scoreboard } from "@/components/Scoreboard";
import type { TeamColor } from "@/lib/game";
import { getRandomColor } from "@/lib/game";

export default function Home() {
	const [playerColor, setPlayerColor] = useState<TeamColor>(getRandomColor);

	return (
		<main className="flex flex-col items-center gap-6 p-4 max-w-lg mx-auto pt-8">
			<h1 className="text-3xl font-bold">Grid Wars</h1>
			<Scoreboard />
			<ColorToggle color={playerColor} onColorChange={setPlayerColor} />
			<Grid playerColor={playerColor} />
		</main>
	);
}
