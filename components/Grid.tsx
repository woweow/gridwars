"use client";

import { useMutation, useQuery } from "convex/react";
import React from "react";
import { api } from "@/convex/_generated/api";
import { trackSquareClaimed } from "@/lib/analytics";
import type { TeamColor } from "@/lib/game";
import { Square } from "./Square";

type GridProps = {
	playerColor: TeamColor;
};

const COL_LABELS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
const ROW_LABELS = ["A", "B", "C", "D", "E", "F", "G", "H"];

export function Grid({ playerColor }: GridProps) {
	const config = useQuery(api.config.getConfig);
	const grid = useQuery(api.grid.getGrid);
	const claimSquare = useMutation(api.grid.claimSquare);

	const loadingStyle: React.CSSProperties = {
		fontFamily: "var(--font-mono)",
		fontSize: "11px",
		color: "var(--color-war-dim)",
		letterSpacing: "0.2em",
		textAlign: "center",
		padding: "40px 20px",
	};

	if (!config || !grid) {
		return (
			<div style={loadingStyle}>
				<span className="status-blink">▮</span> ESTABLISHING UPLINK...
			</div>
		);
	}

	const gridSize = config.gridSize;

	const handleClick = (squareIndex: number, previousColor: string | null) => {
		trackSquareClaimed(playerColor, squareIndex, previousColor);
		claimSquare({ squareIndex, color: playerColor });
	};

	const colLabels = COL_LABELS.slice(0, gridSize);
	const rowLabels = ROW_LABELS.slice(0, gridSize);

	// Unified grid: first col = row labels, first row = col labels
	// gridTemplateColumns: [label col] [gridSize data cols]
	// gridTemplateRows: [label row] [gridSize data rows]

	return (
		<div
			style={{
				background: "var(--color-war-panel)",
				border: "1px solid var(--color-war-border)",
				padding: "16px",
				position: "relative",
				width: "100%",
			}}
			className="bracket-tl bracket-tr bracket-bl bracket-br"
		>
			{/* Panel header */}
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: "12px",
				}}
			>
				<span
					style={{
						fontFamily: "var(--font-mono)",
						fontSize: "9px",
						letterSpacing: "0.25em",
						color: "var(--color-war-dim)",
					}}
				>
					TERRITORIAL MAP
				</span>
				<span
					style={{
						fontFamily: "var(--font-mono)",
						fontSize: "9px",
						letterSpacing: "0.15em",
						color: "var(--color-war-dim)",
					}}
				>
					{gridSize}×{gridSize} SECTORS
				</span>
			</div>

			{/* Unified grid with coordinate labels */}
			<div
				style={{
					display: "grid",
					gridTemplateColumns: `20px repeat(${gridSize}, 1fr)`,
					gridTemplateRows: `18px repeat(${gridSize}, 1fr)`,
					gap: "4px",
				}}
			>
				{/* [0,0] — empty corner */}
				<div />

				{/* [0, 1..n] — column labels */}
				{colLabels.map((label) => (
					<div
						key={label}
						className="coord-label"
						style={{
							textAlign: "center",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						{label}
					</div>
				))}

				{/* Rows: [r, 0] = row label, [r, 1..n] = squares */}
				{rowLabels.map((rowLabel, rowIdx) => (
					<React.Fragment key={rowLabel}>
						{/* Row label */}
						<div
							className="coord-label"
							style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
						>
							{rowLabel}
						</div>

						{/* Squares in this row */}
						{grid
							.filter((sq) => Math.floor(sq.squareIndex / gridSize) === rowIdx)
							.map((square) => (
								<Square
									key={square._id}
									color={square.color}
									onClick={() => handleClick(square.squareIndex, square.color)}
								/>
							))}
					</React.Fragment>
				))}
			</div>

			{/* Bottom status bar */}
			<div
				style={{
					marginTop: "12px",
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<div
					style={{
						fontFamily: "var(--font-mono)",
						fontSize: "8px",
						color: "var(--color-war-dim)",
						letterSpacing: "0.15em",
					}}
				>
					CLICK TO CAPTURE SECTOR
				</div>
				<div
					style={{
						display: "flex",
						gap: "8px",
						fontFamily: "var(--font-mono)",
						fontSize: "8px",
					}}
				>
					<span style={{ color: "var(--color-war-red)" }}>■ RED</span>
					<span style={{ color: "var(--color-war-blue-bright)" }}>■ BLUE</span>
					<span style={{ color: "var(--color-war-dim)" }}>□ EMPTY</span>
				</div>
			</div>
		</div>
	);
}
