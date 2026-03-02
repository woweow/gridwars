"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function Scoreboard() {
	const scores = useQuery(api.scores.getScores);

	if (!scores) {
		return <div className="text-gray-400">Loading...</div>;
	}

	return (
		<div className="flex gap-8 text-2xl font-bold">
			<div className="text-red-500">Red: {scores.red}</div>
			<div className="text-blue-500">Blue: {scores.blue}</div>
		</div>
	);
}
