import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";

export const getScores = query({
	handler: async (ctx) => {
		const scores = await ctx.db.query("scores").first();
		return scores ?? { red: 0, blue: 0 };
	},
});

export const updateScores = internalMutation({
	args: {
		red: v.number(),
		blue: v.number(),
	},
	handler: async (ctx, { red, blue }) => {
		const existing = await ctx.db.query("scores").first();
		if (existing) {
			await ctx.db.patch(existing._id, { red, blue });
		} else {
			await ctx.db.insert("scores", { red, blue });
		}
		return { red, blue };
	},
});
