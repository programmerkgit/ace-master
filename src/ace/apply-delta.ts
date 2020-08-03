import { Delta, Position } from './document';


export const applyDelta = function (docLines: string[], delta: Delta, doNotValidate: boolean): void {
    switch (delta.action) {
        case 'insert':
            insertDelta(docLines, delta.start, delta.$lines,);
            break;
        case 'remove':
            removeDelta(docLines, delta.start, delta.end);
            break;
        default:
            throw new Error('unexpected delta action');
    }
};

function insertDelta(docLines: string[], start: Position, lines: string[],) {
    const row = start.row;
    const startColumn = start.column;
    const line = docLines[ row ] || '';
    if (lines.length === 1) {
        docLines[ row ] = line.substring(0, startColumn) + lines[ 0 ] + line.substring(startColumn);
    } else {
        /* lineを削ってlinesを挿入 */
        docLines.splice(row, 1, ...lines);
        /* line = ありがとうございます */
        /*　ありがとう「挿入行 delta.lines」ございます　*/
        /*　ありがとう + 行　*/
        /*　行 + ございます　*/
        docLines[ row ] = line.substring(0, startColumn) + docLines[ row ];
        docLines[ row + lines.length - 1 ] += line.substring(startColumn);

    }
}

function removeDelta(docLines: string[], start: Position, end: Position) {
    const endColumn = end.column;
    const endRow = end.row;
    const row = start.row;
    const startColumn = start.column;
    const line = docLines[ row ];
    if (row === endRow) {
        docLines[ row ] = line.substring(0, startColumn) + line.substring(endColumn);
    } else {
        const endLine = docLines[ endRow ];
        docLines.splice(
            row,
            endRow - row + 1,
            line.substring(0, startColumn) + endLine.substring(endColumn)
        );
    }
};
