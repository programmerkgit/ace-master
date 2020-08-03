import { Tokenizer } from './tokenizer';
import { Delta } from './document';

export class BackgroundTokenizer {
    running: number | false = false;
    lines: string[] = [];
    states = [];
    currentLine = 0;

    doc: Document | null = null;

    toeknizer;

    constructor(tokenizer: Tokenizer, editor) {
        this.toeknizer = tokenizer;
    }

    /**
     * return false if not running
     * */
    $worker(): boolean {
    }


    getState(row: number) {
        if (this.currentLine == row) {
            this.$tokenizeRow(row);
        }
        return this.states[ row ] || 'start';
    }

    scheduleStart() {
        if (!this.running)
            this.running = setTimeout(this.$worker, 700);
    }

    getTokens(row: number) {
        return this.lines[ row ] || this.$tokenizeRow(row);
    }

    stop() {
        if (this.running) {
            clearTimeout(this.running);
        }
        this.running = false;
    }

    setTokenizer(tokenizer: Tokenizer) {
        this.toeknizer = tokenizer;
        this.lines = [];
        this.states = [];
        this.start(0);
    }

    start(startRow: number = 0) {
        this.currentLine = Math.min(startRow, this.currentLine, this.doc.getLength());

        /**
         * lines
         * states
         * */
        this.lines.splice(this.currentLine, this.lines.length);
        this.states.splice(this.currentLine, this.states.length);

        this.stop();
        this.running = setTimeout(this.$worker, 700);
    }

    $updateOnChange(delta: Delta) {
        const startRow = delta.start.row;
        /* 1..3, length = 2. startIndex..endIndex  */
        const len = delta.end.row - startRow;
        if (len === 0) {
            this.lines[ startRow ] = null;
        } else if (delta.action == 'remove') {
            this.lines.splice(startRow, len + 1, null);
            this.states.splice(startRow, len + 1, null);
        } else {
            const args = Array(len + 1) as any[];
            this.lines.splice(startRow, 1, ...args);
            this.states.splice(startRow, 1, ...args);
        }
        this.currentLine = Math.min(startRow, this.currentLine, this.doc.getLength());
        this.stop();
    }

    /**
     *
     * Emits the `'update'` event. `firstRow` and `lsatRow` are used to define the boundaries of the region to be updated.
     * @param firstRow The starting row region
     * @param lastRow The final row region
     *
     * */
    fireUpdateEvent(firstRow: number, lastRow: number) {
        const data = {
            first: firstRow,
            last: lastRow
        };
        this._signal('update', {data});
    }

    $tokenizeRow(row) {
        const line = this.doc.getLine(row);
        const state = this.states[ row - 1 ];
        const data = this.toeknizer.getLineTokens(line, state);
        if (this.states[ row ] + '' !== data.state + '') {
        } else if (this.currentLine == row) {
            this.currentLine = row + 1;
        }
        return this.lines[ row ] = data.tokens;
    }

}
