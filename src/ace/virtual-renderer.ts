import { EventEmitter } from './lib/event-emitter';
import { dom } from './lib/dom';
import { RenderLoop } from './render-loop';


type Theme = string;


/**
 * VirtualRenderer renders everything you see on the screen.
 */
export class VirtualRenderer extends EventEmitter {
    maxLines = 4;
    keepTextAreaAtCursor: boolean = false;
    readonly content: HTMLElement = VirtualRenderer.createContent();
    cursorLayer: {
        restartTimer: Function
        element: HTMLElement
    } = {} as any;
    $changeLines: any;
    layerConfig: {
        firstRow: number;
        lastRow: number
    } = {firstRow: 0, lastRow: 0};
    $loop = new RenderLoop(
        this.$renderChanges.bind(this),
        this.container.ownerDocument.defaultView as (WindowProxy & typeof globalThis)
    );
    $changes: any;
    private readonly scroller: HTMLElement = VirtualRenderer.createScroller();
    private readonly gutter: HTMLElement = VirtualRenderer.createGutter();

    /**
     * @param container is a container of virtual renderer. if container is not specified, "div" element is a container
     * @param theme - theme of virtual renderer??
     * */
    constructor(
        public readonly container: HTMLElement = dom.createElement('div'),
        theme?: Theme
    ) {
        super();
        /* gutter */
        container.appendChild(this.gutter);
        /* scroll */
        container.appendChild(this.scroller);
        this.scroller.appendChild(this.content);
    }

    private static createGutterLayer() {

    }

    private static createScroller(): HTMLElement {
        const scroller = document.createElement('div');
        scroller.className = 'ace_scroller';
        return scroller;
    }

    private static createGutter(): HTMLElement {
        const gutter = dom.createElement('div');
        gutter.className = 'ace_gutter';
        gutter.setAttribute('aria-hidden', 'true');
        return gutter;
    };

    private static createContent(): HTMLElement {
        const content = document.createElement('div');
        content.className = 'ace_content';
        return content;
    }

    setStyle(style: string) {

    }

    setShowGutter(option: boolean) {

    }

    setHighlightGutterLine(boolean: boolean) {

    }

    updateLines(firstRow: number, lastRow = Infinity, force = false) {
        if (!this.$changeLines) {
            this.$changeLines = {
                firstRow: firstRow,
                lastRow: lastRow
            };
        } else {
            /* firstRowは小さい方に */
            if (this.$changeLines.firstRow > firstRow)
                this.$changeLines.firstRow = firstRow;
            /* lastRowは大きい方 */
            if (this.$changeLines.lastRow < lastRow)
                this.$changeLines.lastRow = lastRow;
        }
        if (this.$changeLines.lastRow < this.layerConfig.firstRow) {
            if (force)
                this.$changeLines.lastRow = this.layerConfig.lastRow;
            else
                return;
        }
        if (this.$changeLines.firstRow > this.layerConfig.lastRow)
            return;
        this.$loop.schdule(this.CHANGE_LINES);
    }

    $renderChanges(changes: number, force: boolean) {
        if (this.$changes) {
            changes |= this.$changes;
        }
    }

}
