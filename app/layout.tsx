import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
	title: "Grid Wars",
	description: "Real-time multiplayer grid capture game",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className="bg-gray-900 text-white min-h-screen">
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
