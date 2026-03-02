"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function Scoreboard() {
	const scores = useQuery(api.scores.getScores);

	const panelStyle: React.CSSProperties = {
		background: "var(--color-war-panel)",
		border: "1px solid var(--color-war-border)",
		padding: "16px 20px",
		position: "relative",
		width: "100%",
	};

	if (!scores) {
		return (
			<div style={panelStyle}>
				<div
					style={{
						fontFamily: "var(--font-mono)",
						fontSize: "11px",
						color: "var(--color-war-dim)",
						letterSpacing: "0.2em",
						textAlign: "center",
					}}
				>
					ESTABLISHING UPLINK...
				</div>
			</div>
		);
	}

	const total = (scores.red ?? 0) + (scores.blue ?? 0);

	return (
		<div style={panelStyle} className="bracket-tl bracket-tr bracket-bl bracket-br">
			{/* Panel header */}
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					marginBottom: "14px",
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
					WAR STATUS
				</span>
				<span
					style={{
						fontFamily: "var(--font-mono)",
						fontSize: "9px",
						letterSpacing: "0.15em",
						color: "var(--color-war-green-mid)",
					}}
				>
					<span className="status-blink">■</span> LIVE
				</span>
			</div>

			{/* Score display */}
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "1fr auto 1fr",
					alignItems: "center",
					gap: "12px",
				}}
			>
				{/* Red */}
				<div style={{ textAlign: "center" }}>
					<div
						style={{
							fontFamily: "var(--font-mono)",
							fontSize: "9px",
							letterSpacing: "0.2em",
							color: "var(--color-war-red)",
							marginBottom: "6px",
							textTransform: "uppercase",
						}}
					>
						▲ CRIMSON FORCE
					</div>
					<div
						className="score-red"
						style={{
							fontFamily: "var(--font-hud)",
							fontSize: "2.8rem",
							fontWeight: 900,
							lineHeight: 1,
						}}
					>
						{String(scores.red ?? 0).padStart(2, "0")}
					</div>
					<div
						style={{
							fontFamily: "var(--font-mono)",
							fontSize: "8px",
							color: "var(--color-war-red-dim)",
							marginTop: "4px",
							letterSpacing: "0.15em",
						}}
					>
						SECTORS WON
					</div>
				</div>

				{/* VS divider */}
				<div style={{ textAlign: "center" }}>
					<div
						style={{
							fontFamily: "var(--font-display)",
							fontSize: "1.1rem",
							color: "var(--color-war-amber)",
							textShadow: "0 0 8px var(--color-war-amber)",
							letterSpacing: "0.05em",
						}}
					>
						VS
					</div>
					{total > 0 && (
						<div
							style={{
								fontFamily: "var(--font-mono)",
								fontSize: "8px",
								color: "var(--color-war-dim)",
								marginTop: "4px",
								letterSpacing: "0.1em",
							}}
						>
							{total} RD
						</div>
					)}
				</div>

				{/* Blue */}
				<div style={{ textAlign: "center" }}>
					<div
						style={{
							fontFamily: "var(--font-mono)",
							fontSize: "9px",
							letterSpacing: "0.2em",
							color: "var(--color-war-blue)",
							marginBottom: "6px",
							textTransform: "uppercase",
						}}
					>
						▲ COBALT FORCE
					</div>
					<div
						className="score-blue"
						style={{
							fontFamily: "var(--font-hud)",
							fontSize: "2.8rem",
							fontWeight: 900,
							lineHeight: 1,
						}}
					>
						{String(scores.blue ?? 0).padStart(2, "0")}
					</div>
					<div
						style={{
							fontFamily: "var(--font-mono)",
							fontSize: "8px",
							color: "var(--color-war-blue-dim)",
							marginTop: "4px",
							letterSpacing: "0.15em",
						}}
					>
						SECTORS WON
					</div>
				</div>
			</div>

			{/* Bottom bar */}
			<div
				style={{
					marginTop: "14px",
					height: "2px",
					display: "flex",
					gap: "2px",
					overflow: "hidden",
				}}
			>
				{total > 0 && (
					<>
						<div
							style={{
								flex: scores.red ?? 0,
								background: "var(--color-war-red)",
								boxShadow: "0 0 6px var(--color-war-red)",
								transition: "flex 0.5s ease",
							}}
						/>
						<div
							style={{
								flex: scores.blue ?? 0,
								background: "var(--color-war-blue-bright)",
								boxShadow: "0 0 6px var(--color-war-blue-bright)",
								transition: "flex 0.5s ease",
							}}
						/>
					</>
				)}
				{total === 0 && (
					<div
						style={{
							flex: 1,
							background: "var(--color-war-border)",
						}}
					/>
				)}
			</div>
		</div>
	);
}
