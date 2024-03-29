import {stringToLine, solveLine} from "./lineSolver";

describe("lineSolver", () => {

    it("Solves empty lines", () => {
        expect(solveLine({
            line: stringToLine("??????????"),
            hints: []
        })).toMatchObject({
            line: stringToLine("          "),
            changed: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        });
    });

    it("Solves full lines", () => {
        expect(solveLine({
            line: stringToLine("??????????"),
            hints: [10]
        })).toMatchObject({
            line: stringToLine("██████████"),
            changed: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        });
    });

    it("Sets known states", () => {
        /**
         * ..........
         * ---- ----
         *  ---- ----
         *  ###  ###
         */
        expect(solveLine({
            line: stringToLine("??????????"),
            hints: [4, 4]
        })).toMatchObject({
            line: stringToLine("?███??███?"),
            changed: [1, 2, 3, 6, 7, 8]
        });
    });

    it("Takes into acount existing state", () => {
        expect(solveLine({
            line: stringToLine("? ?????? ?"),
            hints: [6]
        })).toMatchObject({
            line: stringToLine("  ██████  "),
            changed: [0, 2, 3, 4, 5, 6, 7, 9]
        });

        expect(solveLine({
            line: stringToLine("? ?????? ?"),
            hints: [5]
        })).toMatchObject({
            line: stringToLine("  ?████?  "),
            changed: [0, 3, 4, 5, 6, 9]
        });
    });

});
