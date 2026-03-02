import { query } from "./_generated/server";

export const getScores = query({
	handler: async (ctx) => {
		const scores = await ctx.db.query("scores").first();
		return scores ?? { red: 0, blue: 0 };
	},
});
