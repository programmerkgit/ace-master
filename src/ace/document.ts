import { EventEmitter } from './lib/event-emitter';
import { Range } from './range';
import { applyDelta } from './apply-delta';
import { RegexRule } from './mode/rule';

export type Position = {
    row: number,
    column: number
}

/**
 * Delta is difference. What lines and where inserted or removed.
 *
 * Delta.start is point of change
 * Delta.end is end of inserted characters
 * Delta.$lines is inserted lines.
 * If you inserted "abc\ndef" in between first and second line,
 * start:row: 1, start:column:0,
 * end.row: 2, end.column: 3
 * lines: ["abc", "def"]
 *
 * ```
 * firstline
 * secondline
 * ```
 * */

export type Delta = {
    action: 'insert' | 'remove',
    $lines: string[],
    start: Position,
    end: Position
}

/**
 * Document contains the text of the document.
 * Document can be attached to several [[EditSession `EditSession`]]s.
 *
 * At its core, `Document`s are just an array of strings, with each row in the document matching up to the array index.
 *
 * */
export class Document extends EventEmitter {
    tokenArray: string[] = [];
    $autoNewLine?: string;
    private readonly $lines = [ '' ];
    private autoNewLine: string = '';
    private $newLineMode = 'auto';

    /**
     * Lines are text or lines
     *
     * */
    constructor(lines: string | string[]) {
        super();
        if (this.$lines.length === 0) {
            this.$lines = [ '' ];
        } else if (Array.isArray(lines)) {
            /* When lines are array, no need for detect new Line */
            this.insertMergedLines({row: 0, column: 0}, lines);
        } else {
            /* When lines are text and first time to insert, necessary to detect new line */
            this.insertAndDetectNewLine({row: 0, column: 0}, lines);
        }
    }

    getLine(row: number): string {
        return this.$lines[ row ] || '';
    }

    $applyToken = function (this: RegexRule, str: string) {
        const values = this.splitRegex.ecec(str).slice(1);
        const types = this.token.apply(this, values);
        if (typeof types === 'string')
            return [ {type: types, value: str} ];
        const tokens: { type: string, value: string }[] = [];
        for (let i = 0, l = types.length; i < l; i++) {
            if (values[ i ])
                tokens[ tokens.length ] = {
                    type: types[ i ],
                    value: values[ i ]
                };
        }
        return tokens;
    };

    $arrayTokens(str: string): { type: string, value: string }[] {
        const tokens = [] as { type: string, value: string }[];
        const values = this.splitRegex.exec(str);
        const types = this.tokenArray;
        for (let i = 0, l = types.length; i < l; i++) {
            if (values[ i + 1 ])
                tokens[ tokens.length ] = {
                    type: types[ i ],
                    value: values[ i + 1 ]
                };
        }
        return tokens;
    }

    /**
     * Returns an array of strings of the rows between `firstRow` and `lastRow`.
     * This function is inclusive of `lastRow`.
     * @param firstRow The first row index to retrieve
     * @param lastRow The final row index to retrieve
     **/
    getLines(firstRow: number, lastRow: number): string[] {
        return this.$lines.slice(firstRow, lastRow + 1);
    }

    /**
     * return copy of lines
     * */
    getAllLines(): string[] {
        return this.getLines(0, this.getLength());
    }

    getLength(): number {
        return this.$lines.length;
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
        switch (this.$newLineMode) {
            case 'windows':
                return '\r\n';
            case 'unix':
                return '\n';
            default:
                return this.autoNewLine || '\n';
        }
    }

    setNewLineMode(newLineMode: string) {
        if (this.$newLineMode !== newLineMode) {
            this.$newLineMode = newLineMode;
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

    insertMergedLines(position: Position, lines: string[]) {
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
        if (delta.action === 'insert' && delta.$lines.length <= 1 && !delta.$lines[ 0 ]) {
            return;
        }
        if (delta.action === 'remove' && !Range.isSamePoint(delta.start, delta.end)) {
            return;
        }
        if (delta.action === 'insert' && delta.$lines.length > 20000) {
            this.splitAndapplyLargeDelta(delta, 20000);
            return;
        }
        applyDelta(this.$lines, delta, doNotValidate);
        this.signal('change', delta);
    }

    splitAndapplyLargeDelta(delta: Delta, n: number) {

    }

    /**
     * Fixed postion so that position is Valid
     * TODO: Why length is this.getLength() || this.getLength() - 1 ?
     * point to lines
     * [abc
     *  edf
     *  ghi]
     * row 1, column 4 => 1, 3
     * row 5, column 8 => 2, 3
     * row 3, column 2 => 2, 2
     * row 2, column 5 => 2, 3
     * row undefined, column undefined => 3, 3
     * */
    clippedPos(row: number, column: number): Position {
        const length = this.getLength();
        row = Math.min(Math.max(row, 0), this.getLength());
        let line = this.getLine(row);
        column = Math.min(Math.max(column, 0), line.length);
        return {row, column};
    }

    setValue(text: string) {
        const len = this.getLength() - 1;
        this.remove(new Range(0, 0, len, this.getLine(len).length));
        this.insert({row: 0, column: 0}, text);
    }

    /**
     * detectNewLine before insertMergedLines
     *
     * */
    insertAndDetectNewLine(position: Position, text: string) {
        if (this.getLength() <= 1)
            this.$detectNewLine(text);
        return this.insertMergedLines(position, this.$split(text));
    }

    $detectNewLine(text: string) {
        var match = text.match(/^.*?(\r?\n)/m);
        if (match) {
            this.$autoNewLine = match[ 1 ];
        } else {
            this.$autoNewLine = '\n';
        }
    };

    remove(rage: Range) {
    }


    /**
     * clone position
     * @param position position to be cloned.
     * */
    clonePos(position: Position): Position {
        return {row: position.row, column: position.column};
    }

    /**
     * create position from row, column
     * */
    pos(row: number, column: number): Position {
        return {row, column};
    }


    /**
     * Converts the `{row, column}` position in a document to the character's index.
     *
     * Index refers to the "absolute position" of a character in the document. For example:
     *
     * ```javascript
     * var x = 0; // 10 characters, plus one for newline
     * var y = -1;
     * ```
     *.
     * Here, `y` is an index 15: 11 characters for the first row, and 5 characters until `y` in the second.
     *
     * @param {Object} pos The `{row, column}` to convert
     * @param {Number} startRow=0 The row from which to start the conversion
     * @returns {Number} The index position in the document
     */
    positionToIndex(pos: Position, startRow: number = 0): number {
        const lines = this.$lines || this.getAllLines();
        const newLineLength = this.getNewLineCharacter().length;
        let index = 0;

        const row = Math.min(pos.row, lines.length);

        for (let i = startRow; i < row; i++)
            index += lines[ i ].length + newLineLength;

        return index + pos.column;

    }

    /**
     * Converts an index position in a document to a `{row, column}` object.
     *
     * Index refers to the "absolute position" of a character in the document. For example:
     *
     * ```javascript
     * var x = 0; // 10 characters, plus one for newline
     * var y = -1;
     * ```
     *
     * Here, `y` is an index 15: 11 characters for the first row, and 5 characters until `y` in the second.
     *
     * @param {Number} index An index to convert
     * @param {Number} startRow=0 The row from which to start the conversion
     * @returns {Object} A `{row, column}` object of the `index` position
     */
    indexToPosition(index: number, startRow: number = 0) {
        const lines = this.$lines || this.getAllLines();
        const newlineLength = this.getNewLineCharacter().length;
        let l: number = 0;
        for (let i = startRow, l = lines.length; i < l; i++) {
            index -= lines[ i ].length + newlineLength;
            if (index < 0)
                return {row: i, column: index + lines[ i ].length + newlineLength};
        }
        return {row: l - 1, column: index + lines[ l - 1 ].length + newlineLength};
    };


}
