type Cell = any

export class Lines {
    readonly cells: Cell[] = [];
    readonly cellCache: Cell[] = [];

    readonly element: HTMLElement;
    readonly canvasHeight: number;

    constructor(element: HTMLElement, canvasHeight = 500000) {
        this.element = element;
        this.canvasHeight = canvasHeight;
        this.element.style.height = (canvasHeight * 2).toString() + "px";
    }

    /* what is coefficient */
    private offsetCoefficient = 0;

    /* elementをconfigの値にしたがってtransformする */
    moveContainer(config: any) {
        // this.element.style.transform = "translate(" + Math.round(tx) + "px, " + Math.round(ty) + "px)";
    }

    /* configによって変更があったかどうかを確認する? */
    pageChanged(oldConfig: any, newConfig: any): boolean {
        return true;
    }

    getLength() {
        return this.cells.length;
    }

    get(index: number) {
        return this.cells[index];
    }

    push(cell: Cell) {
        this.cells.push(cell);
        // https://developer.mozilla.org/en-US/docs/Web/API/Document/createDocumentFragment
        const fragment = document.createDocumentFragment();
    }
}
