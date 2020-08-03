type Point = { column: number, row: number }
type CompareResult = -1 | 0 | 1

export class Range {
    start: Point;
    end: Point;

    /**
     * Range is consist of start and end point.
     * Start point and End point has column, and row.
     * */
    constructor(
        startRow: number,
        startColumn: number,
        endRow: number,
        endColumn: number
    ) {
        this.start = {
            column: startColumn,
            row: startRow
        };
        this.end = {
            column: endColumn,
            row: endColumn
        };
    }

    /**
     * Creates and returns a new `Range` based on the row and column of the given parametesrs.
     * @param start A starting point to use
     * @param end An ending point to use
     * */
    static fromPoints(start: Point, end: Point): Range {
        return new Range(start.row, start.column, end.row, end.column);
    }

    /* a is less, -1 : a is grater, 1 */
    static comparePoints(a: Point, b: Point): CompareResult {
        if (a.row < b.row) {
            return -1;
        } else if (a.row === b.row) {
            if (a.column < b.column) {
                return -1;
            } else if (a.column === b.column) {
                return 0;
            } else {
                return 1;
            }
        } else {
            return 1;
        }
    }

    /* same point */
    static isSamePoint(a: Point, b: Point): boolean {
        return a.column == b.column && a.row === b.row;
    }

    /**
     * Check equality of Range.
     * If start and end matches, both ranges are equal.
     **/
    isEqual(range: Range): boolean {
        return this.start.column === range.start.column &&
            this.start.row === range.start.row &&
            this.end.column === range.end.column &&
            this.end.row === range.end.row;
    }

    toString(): string {
        return ('Range: [' + this.start.row + '/' + this.start.column +
            '] -> [' + this.end.row + '/' + this.end.column + ']');
    };

    isEnd(column: number, row: number): boolean {
        return this.end.column === column && this.end.row === row;
    }

    isStart(column: number, row: number): boolean {
        return this.start.column === column &&
            this.start.row === row;
    }

    setStart(point: Point): void

    setStart(row: number, column: number): void

    setStart(rowOrPoint: Point | number, column?: number) {
        if (typeof rowOrPoint === 'number') {
            this.start.row = rowOrPoint;
            this.start.column = column!!;
        } else {
            this.start.column = rowOrPoint.column;
            this.start.row = rowOrPoint.row;
        }
    }

    setEnd(point: Point): void

    setEnd(row: number, column: number): void

    setEnd(rowOrPoint: Point | number, column?: number) {
        if (typeof rowOrPoint === 'number') {
            this.end.row = rowOrPoint;
            this.end.column = column!!;
        } else {
            this.end.column = rowOrPoint.column;
            this.end.row = rowOrPoint.row;
        }
    }

    isMultiLine(): boolean {
        return this.start.row !== this.end.row;
    }

    compare(row: number, col: number): CompareResult {
        if (row < this.start.row) {
            return -1;
        }
        if (this.start.row === row && col < this.start.column) {
            return -1;
        }
        if (this.end.row === row && this.end.column < col) {
            return 1;
        }
        if (this.end.row < row) {
            return 1;
        }
        return 0;
    }

    compareStart(row: number, col: number): CompareResult {
        if (this.start.row === row && this.start.column === col) {
            return -1;
        }
        return this.compare(row, col);
    }

    compareEnd(row: number, col: number): CompareResult {
        if (this.end.row === row && this.end.column === col) {
            return 1;
        }
        return this.compare(row, col);
    }

    compareInside(row: number, col: number): CompareResult {
        if (this.start.row === row && this.start.column === col) {
            return -1;
        }
        if (this.end.row === row && this.end.column === col) {
            return 1;
        }
        return this.compareEnd(row, col);
    }

    isEmpty() {
        return this.start.row === this.end.row && this.start.column === this.end.column;
    }

    /**
     * check if row, column pairs are within Range
     * */
    contains(row: number, column: number): boolean {
        return this.compare(row, column) === 0;
    }

    /**
     *
     * return new rage extended
     * */
    extend(row: number, column: number) {
        const result = this.compare(row, column);
        const start: Point = {
            row: this.start.row,
            column: this.start.column
        };
        const end: Point = {
            row: this.end.row,
            column: this.end.column
        };
        switch (result) {
            case -1:
                start.row = row;
                start.column = column;
                break;
            case 1:
                end.row = row;
                end.column = column;
                break;
        }
        return Range.fromPoints(start, end);
    }

    collapseRows(): Range {
        /*
                if (this.end.column == 0)
                    return new Range(this.start.row, 0, Math.max(this.start.row, this.end.row-1), 0);
        */
        return new Range(this.start.row, 0, this.end.row, 0);
    }

    /**
     * return cloned Range
     * */
    clone(): Range {
        return Range.fromPoints(this.start, this.end);
    }

}
