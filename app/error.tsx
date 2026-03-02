"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function ErrorPage({
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
		<div className="flex flex-col items-center gap-4 p-8">
			<h2 className="text-xl font-bold text-red-400">Something went wrong</h2>
			<button
				type="button"
				onClick={reset}
				className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 cursor-pointer"
			>
				Try again
			</button>
		</div>
	);
}
