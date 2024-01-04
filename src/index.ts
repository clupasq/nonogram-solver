import fs from "fs/promises";
import {boardStateToString, Puzzle, solvePuzzle} from "./backend/boardSolver";

const parseTextPuzzle = (puzzleString: string): Puzzle => {
    const lines = puzzleString.split("\n");
    const puzzle: Puzzle = {
        verticalHints: [],
        horizontalHints: []
    };
    let currentHints = puzzle.verticalHints;
    for (const line of lines) {
        if (line === "") {
            currentHints = puzzle.horizontalHints;
            continue;
        }
        const hint = line.split(" ").map((s) => parseInt(s, 10));
        currentHints.push(hint);
    }
    return puzzle;
}

const checkPuzzleCounts = (puzzle: Puzzle) => {
    const sumUpHintValues = (hints: number[][]) => {
        return hints.map((hint) => hint.reduce((a, b) => a + b, 0));
    }
    const verticalHintCounts = sumUpHintValues(puzzle.verticalHints);
    const horizontalHintCounts = sumUpHintValues(puzzle.horizontalHints);
    if (verticalHintCounts.length !== horizontalHintCounts.length) {
        console.warn(
            `WARNING: Vertical hint count (${verticalHintCounts.length}) does not match ` +
            `horizontal hint count (${horizontalHintCounts.length})`
        );
    }
}

const parsePuzzle = (puzzleString: string): Puzzle => {

    const puzzle = puzzleString.startsWith("{")
        ? JSON.parse(puzzleString) as Puzzle
        : parseTextPuzzle(puzzleString);

    checkPuzzleCounts(puzzle);

    return puzzle;
};

const main = async () => {
    const data = await fs.readFile("/dev/stdin", "utf-8");
    const puzzle = parsePuzzle(data);
    const board = solvePuzzle(puzzle);
    console.log(boardStateToString(board));
}

main().catch(console.error);
