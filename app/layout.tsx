import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
	title: "GRID WARS — Tactical Domination",
	description: "Real-time multiplayer territory capture. Claim sectors. Dominate the grid.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
			</head>
			<body className="min-h-screen">
				{/* bg set in CSS */}
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
