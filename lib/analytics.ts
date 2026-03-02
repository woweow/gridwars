import posthog from "posthog-js";

let initialized = false;

export function initPostHog() {
	if (initialized || typeof window === "undefined" || !process.env.NEXT_PUBLIC_POSTHOG_KEY) {
		return;
	}

	posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
		api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
		capture_pageview: true,
	});
	initialized = true;
}

export function trackSquareClaimed(
	color: string,
	squareIndex: number,
	previousColor: string | null,
) {
	posthog.capture("square_claimed", { color, squareIndex, previousColor });
}

export function trackRoundWon(winningColor: string, roundDuration: number) {
	posthog.capture("round_won", { winningColor, roundDuration });
}

export function trackColorSwitched(from: string, to: string) {
	posthog.capture("color_switched", { from, to });
}
