import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	grid: defineTable({
		squareIndex: v.number(),
		color: v.union(v.literal("red"), v.literal("blue"), v.null()),
	}).index("by_squareIndex", ["squareIndex"]),

	scores: defineTable({
		red: v.number(),
		blue: v.number(),
	}),

	gameConfig: defineTable({
		gridSize: v.number(),
	}),
});
