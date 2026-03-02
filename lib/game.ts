export type TeamColor = "red" | "blue";
export type CellColor = TeamColor | null;

export function getRandomColor(): TeamColor {
	return Math.random() < 0.5 ? "red" : "blue";
}

export function checkWinner(cells: CellColor[]): TeamColor | null {
	if (cells.length === 0) return null;
	const first = cells[0];
	if (first === null) return null;
	for (const cell of cells) {
		if (cell !== first) return null;
	}
	return first;
}

export function createEmptyGrid(size: number): CellColor[] {
	return Array.from({ length: size * size }, () => null);
}
