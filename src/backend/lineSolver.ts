
export type Hints = number[];

export const UNKNOWN = "?";
export const FILLED = "█";
export const EMPTY = " ";

const POSSIBLE_STATES = [UNKNOWN, FILLED, EMPTY];

export type State = typeof UNKNOWN | typeof FILLED | typeof EMPTY;

export type Line = State[];

export type SolveInput = {
    line: Line;
    hints: Hints;
};

export type SolveResult = {
    line: Line;
    changed: number[];
};

const internalSolveLine = (input: SolveInput): Line => {
    if (input.hints.length === 0) {
        return input.line.map(_ => FILLED);
    }
    return input.line;
};

export const solveLine = (input: SolveInput): SolveResult => {
    const resultingLine = internalSolveLine(input);
    const changed = [];
    console.log(`---+ ---+ ---+ ---+ ---+ ---+ ---+ ---+ ---+ ---+ `);
    console.log(`---+ ---+ ---+ ---+ ---+ ---+ ---+ ---+ ---+ ---+ `);
    console.log(`---+ ---+ ---+ ---+ ---+ ---+ ---+ ---+ ---+ ---+ `);
    console.log(`---+ ---+ ---+ ---+ ---+ ---+ ---+ ---+ ---+ ---+ `);
    console.log(resultingLine);
    console.log(`---+ ---+ ---+ ---+ ---+ ---+ ---+ ---+ ---+ ---+ `);
    console.log(`---+ ---+ ---+ ---+ ---+ ---+ ---+ ---+ ---+ ---+ `);
    console.log(`---+ ---+ ---+ ---+ ---+ ---+ ---+ ---+ ---+ ---+ `);

    for (let i = 0; i < resultingLine.length; i++) {
        if (resultingLine[i] !== input.line[i]) {
            changed.push(i);
        }
    }
    return {
        line: resultingLine,
        changed
    };
};

export const stringToLine = (s: string): Line => {
    const line: Line = [];
    for (const c of s) {
        if (POSSIBLE_STATES.includes(c)) {
            line.push(c as State);
        }
        throw new Error(`Invalid character ${c} in line ${s}`);
    }
    return line;
};

export const lineToString = (line: Line): string => line.join("");
