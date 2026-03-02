"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		Sentry.captureException(error);
	}, [error]);

	return (
		<html lang="en">
			<body className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center gap-4">
				<h2 className="text-xl font-bold text-red-400">Something went wrong</h2>
				<button
					type="button"
					onClick={reset}
					className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 cursor-pointer"
				>
					Try again
				</button>
			</body>
		</html>
	);
}
