"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function RatioBar() {
	const grid = useQuery(api.grid.getGrid);

	if (!grid) {
		return (
			<div
				style={{
					width: "100%",
					height: "6px",
					background: "var(--color-war-border)",
					marginBottom: "12px",
				}}
			/>
		);
	}

	const total = grid.length;
	const red = grid.filter((sq) => sq.color === "red").length;
	const blue = grid.filter((sq) => sq.color === "blue").length;
	const grey = total - red - blue;

	return (
		<div
			style={{
				width: "100%",
				height: "6px",
				display: "flex",
				gap: "0",
				marginBottom: "12px",
				borderRadius: "2px",
				overflow: "hidden",
				boxShadow: "inset 0 0 4px rgba(0,0,0,0.5)",
			}}
		>
			{red > 0 && (
				<div
					style={{
						flex: red,
						background: "var(--color-war-red)",
						boxShadow: "0 0 8px var(--color-war-red)",
						transition: "flex 0.4s ease",
					}}
				/>
			)}
			{grey > 0 && (
				<div
					style={{
						flex: grey,
						background: "var(--color-war-border)",
						transition: "flex 0.4s ease",
					}}
				/>
			)}
			{blue > 0 && (
				<div
					style={{
						flex: blue,
						background: "var(--color-war-blue-bright)",
						boxShadow: "0 0 8px var(--color-war-blue-bright)",
						transition: "flex 0.4s ease",
					}}
				/>
			)}
		</div>
	);
}
