import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

// Sentry wraps the config but gracefully does nothing without SENTRY_AUTH_TOKEN
export default withSentryConfig(nextConfig, {
	org: process.env.SENTRY_ORG,
	project: process.env.SENTRY_PROJECT,
	silent: true,
	widenClientFileUpload: true,
});
