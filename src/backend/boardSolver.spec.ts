import {boardStateToString, Puzzle, solvePuzzle} from "./boardSolver";

describe("boardSolver", () => {

    it("Solves simple board", () => {
        const puzzle: Puzzle = {
            verticalHints: [
                [5],
                [1, 1, 1],
                [3, 1],
                [1, 1, 1],
                [5]
            ],
            horizontalHints: [
                [5],
                [1, 1, 1],
                [5],
                [1, 1],
                [5]
            ]
        };

        const board = solvePuzzle(puzzle);

        expect(boardStateToString(board)).toEqual(
            "█████\n" +
            "█ █ █\n" +
            "█████\n" +
            "█   █\n" +
            "█████\n"
        );
    });

    it("Throws error on unsolvable board TODO", () => {
    });

    it("Throws error on board with multiple solutions TODO", () => {
    });

});
