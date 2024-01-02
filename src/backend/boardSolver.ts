import {Hints, Line, solveLine, SolveResult, State, UNKNOWN} from "./lineSolver";

export type Puzzle = {
    verticalHints: Hints[];
    horizontalHints: Hints[];
}

export type Board = {
    puzzle: Puzzle;
    stateRows: State[][];
}

const ROW = "row";
const COL = "col";

type LineId = {
    type: typeof ROW | typeof COL;
    id: number;
}

const lineIdToString = (lineId: LineId): string => {
    return `${lineId.type} ${lineId.id}`;
};

const createEmptyBoard = (puzzle: Puzzle): Board => {
    const rowCount = puzzle.horizontalHints.length;
    const colCount = puzzle.verticalHints.length;
    const stateRows: State[][] = [];
    for (let i = 0; i < rowCount; i++) {
        const row: State[] = [];
        stateRows.push(row);
        for (let i = 0; i < colCount; i++) {
            row.push(UNKNOWN);
        }
    }
    return {
        puzzle,
        stateRows
    };
};

export const boardStateToString = (board: Board): string => {
    const rowCount = board.puzzle.horizontalHints.length;
    const colCount = board.puzzle.verticalHints.length;
    let str = "";
    for (let i = 0; i < rowCount; i++) {
        const row = board.stateRows[i];
        for (let j = 0; j < colCount; j++) {
            str += row[j];
        }
        str += "\n";
    }
    return str;
};

class ProcessQueue {

    private readonly set: Set<string> = new Set();
    private readonly todo: LineId[] = [];

    add(lineId: LineId) {
        const key = lineIdToString(lineId);
        if (this.set.has(key)) {
            return;
        }
        this.todo.push(lineId);
        this.set.add(key);
    }

    pop() {
        const lineId = this.todo.pop();
        if (lineId === undefined) {
            throw new Error("Cannot pop from empty ProcessQueue!");
        }
        const key = lineIdToString(lineId);
        this.set.delete(key);
        return lineId;
    }

    isEmpty() {
        return this.todo.length === 0;
    }
}

const makeProcessQueueForBoard = (board: Board): ProcessQueue => {
    const pq = new ProcessQueue();
    const rowCount = board.puzzle.horizontalHints.length;
    const colCount = board.puzzle.verticalHints.length;
    for (let i = 0; i < rowCount; i++) {
        pq.add({
            type: ROW,
            id: i
        });
    }
    for (let i = 0; i < colCount; i++) {
        pq.add({
            type: COL,
            id: i
        });
    }
    return pq;
};

const extractRow = (board: Board, id: number): Line => {
    const line: Line = [];
    for (const s of board.stateRows[id]) {
        line.push(s);
    }
    return line;
};
const extractCol = (board: Board, id: number): Line => {
    const line: Line = [];
    for (const row of board.stateRows) {
        line.push(row[id]);
    }
    return line;
};
const extract = (board: Board, lineId: LineId): Line => {
    return lineId.type === ROW
        ? extractRow(board, lineId.id)
        : extractCol(board, lineId.id);
}

const updateRow = (board: Board, id: number, solveResult: SolveResult): LineId[] => {
    const affectedLineIds: LineId[] = [];
    for (const i of solveResult.changed) {
        board.stateRows[id][i] = solveResult.line[i];
        affectedLineIds.push({ type: COL, id: i });
    }
    return affectedLineIds;
};

const updateCol = (board: Board, id: number, solveResult: SolveResult): LineId[] => {
    const affectedLineIds: LineId[] = [];
    for (const i of solveResult.changed) {
        board.stateRows[i][id] = solveResult.line[i];
        affectedLineIds.push({ type: ROW, id: i });
    }
    return affectedLineIds;
};

const updateBoard = (board: Board, lineId: LineId, solveResult: SolveResult): LineId[] => {
    return lineId.type === ROW
        ? updateRow(board, lineId.id, solveResult)
        : updateCol(board, lineId.id, solveResult);
}

const isSolved = (board: Board): boolean => {
    for (const row of board.stateRows) {
        for (const state of row) {
            if (state === UNKNOWN) {
                return false;
            }
        }
    }
    return true;
};

export const solvePuzzle = (puzzle: Puzzle): Board => {
    const board = createEmptyBoard(puzzle);
    const pq = makeProcessQueueForBoard(board);
    while (!pq.isEmpty()) {
        const lineId = pq.pop();
        const line = extract(board, lineId);
        const hints = lineId.type === ROW
            ? puzzle.horizontalHints[lineId.id]
            : puzzle.verticalHints[lineId.id];
        const solveResult = solveLine({ line, hints });
        const affectedLineIds = updateBoard(board, lineId, solveResult);
        for (const affectedLineId of affectedLineIds) {
            pq.add(affectedLineId);
        }
    }
    if (!isSolved(board)) {
        throw new Error("Board is not solved!");
    }
    return board;
};

