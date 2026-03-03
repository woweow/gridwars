"use client";

import { useEffect, useState } from "react";
import { ColorToggle } from "@/components/ColorToggle";
import { Grid } from "@/components/Grid";
import { RatioBar } from "@/components/RatioBar";
import { Scoreboard } from "@/components/Scoreboard";
import type { TeamColor } from "@/lib/game";
import { getRandomColor } from "@/lib/game";

export default function Home() {
	const [playerColor, setPlayerColor] = useState<TeamColor>("red");
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setPlayerColor(getRandomColor());
		setMounted(true);
	}, []);

	return (
		<main
			style={{
				minHeight: "100vh",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				padding: "24px 16px 40px",
				gap: "0",
				maxWidth: "520px",
				margin: "0 auto",
				position: "relative",
			}}
		>
			{/* Header */}
			<header style={{ width: "100%", textAlign: "center", marginBottom: "28px" }}>
				{/* Operation label */}
				<div
					style={{
						fontFamily: "var(--font-mono)",
						fontSize: "11px",
						color: "var(--color-war-amber)",
						letterSpacing: "0.3em",
						marginBottom: "6px",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						gap: "10px",
					}}
				>
					<span
						style={{
							display: "inline-block",
							width: "24px",
							height: "1px",
							background: "var(--color-war-amber-dim)",
						}}
					/>
					OPERATION: GRID WARS
					<span
						style={{
							display: "inline-block",
							width: "24px",
							height: "1px",
							background: "var(--color-war-amber-dim)",
						}}
					/>
				</div>

				{/* Main Title */}
				<h1
					style={{
						fontFamily: "var(--font-display)",
						fontSize: "clamp(2.8rem, 10vw, 4.5rem)",
						lineHeight: 1,
						letterSpacing: "0.06em",
						color: "var(--color-war-green)",
						textShadow: "0 0 20px rgba(57,255,20,0.5), 0 0 40px rgba(57,255,20,0.2)",
						margin: "0 0 8px",
					}}
				>
					GRID WARS
				</h1>

				{/* Subtitle */}
				<div
					style={{
						fontFamily: "var(--font-tactical)",
						fontSize: "1.6rem",
						fontWeight: 600,
						letterSpacing: "0.05em",
						color: "var(--color-war-text-bright)",
						marginBottom: "16px",
						lineHeight: 1.2,
					}}
				>
					Help your team dominate the grid!
				</div>

				{/* March bar */}
				<RatioBar />

				{/* Status row */}
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						gap: "16px",
						fontFamily: "var(--font-mono)",
						fontSize: "10px",
						color: "var(--color-war-dim)",
						letterSpacing: "0.15em",
					}}
				>
					<span>
						<span
							className="status-blink"
							style={{ color: "var(--color-war-green)", marginRight: "5px" }}
						>
							●
						</span>
						<span className="status-active">UPLINK ACTIVE</span>
					</span>
					<span style={{ color: "var(--color-war-border-bright)" }}>|</span>
					<span>SECTOR 5×5</span>
					<span style={{ color: "var(--color-war-border-bright)" }}>|</span>
					<span>
						{mounted ? (
							<>
								FACTION:{" "}
								<span
									style={{
										color:
											playerColor === "red"
												? "var(--color-war-red-bright)"
												: "var(--color-war-blue-bright)",
										fontWeight: 700,
									}}
								>
									{playerColor.toUpperCase()}
								</span>
							</>
						) : (
							"FACTION: —"
						)}
					</span>
				</div>
			</header>

			{/* Scoreboard */}
			<section style={{ width: "100%", marginBottom: "20px" }} aria-label="War Status">
				<Scoreboard />
			</section>

			{/* Faction selector */}
			<section
				style={{
					width: "100%",
					marginBottom: "20px",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: "8px",
				}}
				aria-label="Faction Selection"
			>
				<div
					style={{
						fontFamily: "var(--font-mono)",
						fontSize: "9px",
						letterSpacing: "0.25em",
						color: "var(--color-war-dim)",
						marginBottom: "2px",
					}}
				>
					— SELECT FACTION —
				</div>
				<ColorToggle color={playerColor} onColorChange={setPlayerColor} />
			</section>

			{/* Divider */}
			<div
				style={{
					width: "100%",
					display: "flex",
					alignItems: "center",
					gap: "10px",
					marginBottom: "16px",
				}}
			>
				<div style={{ flex: 1, height: "1px", background: "var(--color-war-border)" }} />
				<span
					style={{
						fontFamily: "var(--font-mono)",
						fontSize: "9px",
						letterSpacing: "0.2em",
						color: "var(--color-war-dim)",
					}}
				>
					TACTICAL GRID
				</span>
				<div style={{ flex: 1, height: "1px", background: "var(--color-war-border)" }} />
			</div>

			{/* Grid area */}
			<section style={{ width: "100%" }} aria-label="Battle Grid">
				<Grid playerColor={playerColor} />
			</section>

			{/* Footer */}
			<footer
				style={{
					marginTop: "32px",
					fontFamily: "var(--font-mono)",
					fontSize: "9px",
					letterSpacing: "0.2em",
					color: "var(--color-war-dim)",
					textAlign: "center",
					lineHeight: 1.8,
				}}
			>
				<div>CLAIM ALL 25 SECTORS TO WIN THE ROUND</div>
				<div style={{ marginTop: "4px", color: "var(--color-war-border-bright)" }}>
					⚡ REAL-TIME COMBAT ENABLED
				</div>
			</footer>
		</main>
	);
}
