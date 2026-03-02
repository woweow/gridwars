import { mutation, query } from "./_generated/server";

const DEFAULT_GRID_SIZE = 5;

export const getConfig = query({
	handler: async (ctx) => {
		const config = await ctx.db.query("gameConfig").first();
		return config ?? { gridSize: DEFAULT_GRID_SIZE };
	},
});

export const seed = mutation({
	handler: async (ctx) => {
		const existing = await ctx.db.query("gameConfig").first();
		if (existing) return;

		await ctx.db.insert("gameConfig", { gridSize: DEFAULT_GRID_SIZE });

		const totalSquares = DEFAULT_GRID_SIZE * DEFAULT_GRID_SIZE;
		for (let i = 0; i < totalSquares; i++) {
			await ctx.db.insert("grid", { squareIndex: i, color: null });
		}

		await ctx.db.insert("scores", { red: 0, blue: 0 });
	},
});
