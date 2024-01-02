
export type Hints = number[];

export const UNKNOWN = "?";
export const FILLED = "█";
export const EMPTY = " ";

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

const generateAllPossibleStates = (hints: Hints, remainingLength: number): Line[] => {
    const hintSum = hints.reduce((a, b) => a + b, 0);
    const necessaryLength = hintSum + hints.length - 1;
    if (remainingLength < 0 || necessaryLength > remainingLength) {
        return [];
    }
    if (hints.length === 0) {
        const line: Line = [];
        for (let i = 0; i < remainingLength; i++) {
            line.push(EMPTY);
        }
        return [line];
    }
    const states: Line[] = [];
    let skip = 0;
    while (true) {
        const state: Line = [];
        for (let i = 0; i < skip; i++) {
            state.push(EMPTY);
        }
        for (let i = 0; i < hints[0]; i++) {
            state.push(FILLED);
        }
        let remainingLengthForRest = remainingLength - skip - hints[0];

        if (hints.length > 1) {
            remainingLengthForRest -= 1;
            state.push(EMPTY);
        }

        const remainingHints = hints.slice(1);
        const remainingStates = generateAllPossibleStates(remainingHints, remainingLengthForRest);
        if (remainingStates.length === 0) {
            break;
        }
        for (const remainingState of remainingStates) {
            states.push([...state, ...remainingState]);
        }
        skip += 1;
    }
    return states;
};

const matchesLine = (potentialLine: Line, state: Line): boolean => {
    for (let i = 0; i < state.length; i++) {
        if (state[i] !== UNKNOWN && state[i] !== potentialLine[i]) {
            return false;
        }
    }
    return true;
};

const internalSolveLine = (input: SolveInput): Line => {

    const possibleStates = generateAllPossibleStates(input.hints, input.line.length)
        .filter(state => matchesLine(state, input.line));
    for (let i = 0; i < input.line.length; i++) {
        if (input.line[i] !== UNKNOWN) {
            continue;
        }
        const statesWithFilled = possibleStates.filter(state => state[i] === FILLED);
        const statesWithEmpty = possibleStates.filter(state => state[i] === EMPTY);



        if (statesWithEmpty.length === 0) {
            input.line[i] = FILLED;
        }
        if (statesWithFilled.length === 0) {
            input.line[i] = EMPTY;
        }
    }

    return input.line;
};

export const solveLine = (input: SolveInput): SolveResult => {
    const inputCopy = {
        line: [...input.line],
        hints: input.hints
    };
    const resultingLine = internalSolveLine(inputCopy);
    const changed = [];

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
        if (c === UNKNOWN || c === FILLED || c === EMPTY) {
            line.push(c as State);
        } else {
            throw new Error(`Invalid character '${c}' in line '${s}'`);
        }
    }
    return line;
};

export const lineToString = (line: Line): string => line.join("");
