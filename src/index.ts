import fs from "fs/promises";
import {boardStateToString, Puzzle, solvePuzzle} from "./backend/boardSolver";


const main = async () => {
    const data = await fs.readFile("/dev/stdin", "utf-8");
    const puzzle = JSON.parse(data) as Puzzle; // todo: validate
    const board = solvePuzzle(puzzle);
    console.log(boardStateToString(board));
}

main().catch(console.error);
