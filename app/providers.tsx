"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { type ReactNode, useEffect, useMemo } from "react";
import { initPostHog } from "@/lib/analytics";

export function Providers({ children }: { children: ReactNode }) {
	const client = useMemo(() => {
		const url = process.env.NEXT_PUBLIC_CONVEX_URL;
		if (!url) throw new Error("NEXT_PUBLIC_CONVEX_URL is not set");
		return new ConvexReactClient(url);
	}, []);

	useEffect(() => {
		initPostHog();
	}, []);

	return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
