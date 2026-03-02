import * as Sentry from "@sentry/nextjs";

export function register() {
	if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
		Sentry.init({
			dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
			tracesSampleRate: 1.0,
		});
	}
}

export const onRequestError = Sentry.captureRequestError;
