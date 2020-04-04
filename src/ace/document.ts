import { EventEmitter } from './lib/event-emitter';
import { Range } from './range';
import { applyDelta } from './apply-delta';

export type Point = {
    row: number,
    column: number
}

export type Delta = {
    action: 'insert' | 'remove',
    lines: string[],
    start: Point,
    end: Point
}

export class Document extends EventEmitter {
    private readonly lines = [ '' ];
    private autoNewLine: string = '';
    private newLineMode = 'auto';

    constructor(lines: string | string[]) {
        super();
        if (typeof lines === 'string') {

        } else {

        }
        /* ensure line has at least one char */
        if (this.lines.length === 0) {
            this.lines = [ '' ];
        }
    }

    getLine(row: number): string {
        return this.lines[ row ] || '';
    }

    getLines(firstRow: number, lastRow: number): string[] {
        return this.lines.slice(firstRow, lastRow + 1);
    }

    /**
     * return copy of lines
     * */
    getAllLines(): string[] {
        return this.getLines(0, this.getLength());
    }

    getLength(): number {
        return this.lines.length;
    }

    positionToIndex(pos: Point, startRow: number = 0) {
        const lines = this.getAllLines();
        const newlineLength = this.getNewLineCharacter().length;
        let index = 0;
        const row = Math.min(pos.row, lines.length);
        for (let i = startRow; i < row; i++) {
            index += lines[ i ].length + newlineLength;
        }
        return index + pos.column;
    }

    getLinesForRange(range: Range): string[] {
        if (range.start.row === range.end.row) {
            return [ this.getLine(range.start.row).substring(range.start.column, range.end.column) ];
        } else {
            const lines = this.getLines(range.start.row, range.end.row);
            lines[ 0 ] = lines[ 0 ].substring(range.start.column);
            const lastRow = lines.length - 1;
            lines[ lastRow ] = lines[ lastRow ].substring(0, range.end.column);
            return lines;
        }
    }

    getNewLineCharacter(): string {
        switch (this.newLineMode) {
            case 'windows':
                return '\r\n';
            case 'unix':
                return '\n';
            default:
                return this.autoNewLine || '\n';
        }
    }

    setNewLineMode(newLineMode: string) {
        if (this.newLineMode !== newLineMode) {
            this.newLineMode = newLineMode;
            this.signal('changeNewLineMode');
        }
    }

    isNewLine(text: string) {
        return text === '\r\n' || text === '\n' || text === '\r';
    }

    insertFullLines(row: number, lines: string[]) {
        const row2 = Math.min(Math.max(0, row), this.getLength());
        let column = 0;
        if (row2 < this.getLength()) {
            //   lines =
        }
    };

    insertMergedLines(position: Point, lines: string[]) {
        const start = this.clippedPos(position.row, position.column);
        const end = {
            row: start.row + lines.length - 1,
            column: (lines.length == 1 ? start.column : 0) + lines[ lines.length - 1 ].length
        };
    }


    /**
     * Applies `delta` to the document.
     * @param delta - A delta object (can include "insert" and "remove" actions)
     **/
    applyDelta(delta: Delta, doNotValidate: boolean) {
        // An empty range is a NOOP.
        if (delta.action === 'insert' && delta.lines.length <= 1 && !delta.lines[ 0 ]) {
            return;
        }
        if (delta.action === 'remove' && !Range.isSamePoint(delta.start, delta.end)) {
            return;
        }
        if (delta.action === 'insert' && delta.lines.length > 20000) {
            this.splitAndapplyLargeDelta(delta, 20000);
            return;
        }
        applyDelta(this.lines, delta, doNotValidate);
        this.signal('change', delta);
    }

    splitAndapplyLargeDelta(delta: Delta, n: number) {

    }


    /**
     * point to lines
     * [abc
     *  edf
     *  ghi]
     * row 1, column 4 => 1, 3
     * row 5, column 8 => 3, 3
     * row 3, column 2 => 3, 2
     * row 2, column 5 => 3, 5
     * */
    clippedPos(row: number, column: number): Point {
        const length = this.getLength();
        row = Math.min(Math.max(row, 0), this.getLength());
        let line = this.getLine(row);
        column = Math.min(Math.max(column, 0), line.length);
        return {row, column};
    }

}
