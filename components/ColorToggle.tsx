"use client";

import { trackColorSwitched } from "@/lib/analytics";
import type { TeamColor } from "@/lib/game";

type ColorToggleProps = {
	color: TeamColor;
	onColorChange: (color: TeamColor) => void;
};

export function ColorToggle({ color, onColorChange }: ColorToggleProps) {
	const handleChange = (next: TeamColor) => {
		if (next !== color) {
			trackColorSwitched(color, next);
			onColorChange(next);
		}
	};

	return (
		<div
			style={{
				display: "flex",
				alignItems: "stretch",
				gap: "0",
				border: "1px solid var(--color-war-border)",
				overflow: "hidden",
				position: "relative",
			}}
		>
			{/* RED faction button */}
			<button
				type="button"
				onClick={() => handleChange("red")}
				aria-pressed={color === "red"}
				aria-label="Join Crimson Force"
				style={{
					fontFamily: "var(--font-display)",
					fontSize: "1rem",
					letterSpacing: "0.12em",
					padding: "10px 22px",
					cursor: "pointer",
					border: "none",
					borderRight: "1px solid var(--color-war-border)",
					transition: "all 0.2s",
					position: "relative",
					color: color === "red" ? "var(--color-war-red-bright)" : "var(--color-war-dim)",
					background:
						color === "red"
							? "linear-gradient(135deg, rgba(204,17,17,0.2) 0%, rgba(204,17,17,0.08) 100%)"
							: "var(--color-war-panel)",
					boxShadow:
						color === "red"
							? "0 0 12px rgba(204,17,17,0.3), inset 0 0 12px rgba(204,17,17,0.08)"
							: "none",
				}}
			>
				{color === "red" && (
					<span
						style={{
							position: "absolute",
							top: "4px",
							right: "6px",
							fontSize: "6px",
							color: "var(--color-war-red)",
						}}
						className="status-blink"
					>
						●
					</span>
				)}
				CRIMSON
			</button>

			{/* Center separator */}
			<div
				style={{
					display: "flex",
					alignItems: "center",
					padding: "0 10px",
					background: "var(--color-war-panel-alt)",
					fontFamily: "var(--font-mono)",
					fontSize: "9px",
					color: "var(--color-war-amber)",
					letterSpacing: "0.1em",
					borderRight: "1px solid var(--color-war-border)",
					userSelect: "none",
				}}
			>
				OR
			</div>

			{/* BLUE faction button */}
			<button
				type="button"
				onClick={() => handleChange("blue")}
				aria-pressed={color === "blue"}
				aria-label="Join Cobalt Force"
				style={{
					fontFamily: "var(--font-display)",
					fontSize: "1rem",
					letterSpacing: "0.12em",
					padding: "10px 22px",
					cursor: "pointer",
					border: "none",
					transition: "all 0.2s",
					position: "relative",
					color: color === "blue" ? "var(--color-war-blue-bright)" : "var(--color-war-dim)",
					background:
						color === "blue"
							? "linear-gradient(135deg, rgba(0,85,187,0.2) 0%, rgba(0,85,187,0.08) 100%)"
							: "var(--color-war-panel)",
					boxShadow:
						color === "blue"
							? "0 0 12px rgba(0,85,187,0.3), inset 0 0 12px rgba(0,85,187,0.08)"
							: "none",
				}}
			>
				{color === "blue" && (
					<span
						style={{
							position: "absolute",
							top: "4px",
							right: "6px",
							fontSize: "6px",
							color: "var(--color-war-blue-bright)",
						}}
						className="status-blink"
					>
						●
					</span>
				)}
				COBALT
			</button>
		</div>
	);
}
