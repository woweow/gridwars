import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getGrid = query({
	handler: async (ctx) => {
		const squares = await ctx.db.query("grid").withIndex("by_squareIndex").collect();
		return squares;
	},
});

export const claimSquare = mutation({
	args: {
		squareIndex: v.number(),
		color: v.union(v.literal("red"), v.literal("blue")),
	},
	handler: async (ctx, { squareIndex, color }) => {
		const square = await ctx.db
			.query("grid")
			.withIndex("by_squareIndex", (q) => q.eq("squareIndex", squareIndex))
			.unique();

		if (!square) throw new Error(`Square ${squareIndex} not found`);

		await ctx.db.patch(square._id, { color });

		const config = await ctx.db.query("gameConfig").first();
		if (!config) return;

		const allSquares = await ctx.db.query("grid").collect();
		const totalExpected = config.gridSize * config.gridSize;
		if (allSquares.length !== totalExpected) return;

		const firstColor = allSquares[0]?.color;
		if (firstColor === null || firstColor === undefined) return;

		const allSame = allSquares.every((s) => s.color === firstColor);
		if (!allSame) return;

		// Win! Increment score and reset grid atomically.
		const scores = await ctx.db.query("scores").first();
		if (scores) {
			await ctx.db.patch(scores._id, {
				[firstColor]: scores[firstColor] + 1,
			});
		}

		for (const sq of allSquares) {
			await ctx.db.patch(sq._id, { color: null });
		}
	},
});
