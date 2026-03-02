import { describe, expect, it } from "vitest";
import { checkWinner, createEmptyGrid, getRandomColor } from "@/lib/game";

describe("getRandomColor", () => {
	it("returns only red or blue", () => {
		const results = new Set<string>();
		for (let i = 0; i < 100; i++) {
			results.add(getRandomColor());
		}
		expect(results.has("red") || results.has("blue")).toBe(true);
		for (const r of results) {
			expect(["red", "blue"]).toContain(r);
		}
	});
});

describe("checkWinner", () => {
	it("returns null for empty grid", () => {
		expect(checkWinner([])).toBe(null);
	});

	it("returns null for mixed grid", () => {
		expect(checkWinner(["red", "blue", "red", null])).toBe(null);
	});

	it("returns null when grid has null cells", () => {
		expect(checkWinner([null, null, null])).toBe(null);
	});

	it("returns red when all cells are red", () => {
		expect(checkWinner(["red", "red", "red", "red"])).toBe("red");
	});

	it("returns blue when all cells are blue", () => {
		const cells = Array.from({ length: 25 }, () => "blue" as const);
		expect(checkWinner(cells)).toBe("blue");
	});
});

describe("createEmptyGrid", () => {
	it("creates a grid of the right size", () => {
		expect(createEmptyGrid(5)).toHaveLength(25);
		expect(createEmptyGrid(3)).toHaveLength(9);
	});

	it("fills all cells with null", () => {
		const grid = createEmptyGrid(5);
		for (const cell of grid) {
			expect(cell).toBe(null);
		}
	});
});
