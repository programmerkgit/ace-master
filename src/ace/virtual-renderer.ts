import { EventEmitter } from './lib/event-emitter';


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
    private readonly container: HTMLElement;
    private readonly scroller: HTMLElement = VirtualRenderer.createScroller();
    private readonly gutter: HTMLElement = VirtualRenderer.createGutter();

    /**
     * @param container is a container of virtual renderer. if container is not specified, "div" element is a container
     * @param theme - theme of virtual renderer??
     * */
    constructor(container?: HTMLElement, theme?: Theme) {
        super();
        this.container = container || document.createElement('div');
        /* gutter */
        this.container.appendChild(this.gutter);
        /* scroll */
        this.container.appendChild(this.scroller);
        this.scroller.appendChild(this.content);
    }

    private static createScroller(): HTMLElement {
        const scroller = document.createElement('div');
        scroller.className = 'ace_scroller';
        return scroller;
    }

    private static createGutter(): HTMLElement {
        const gutter = document.createElement('div');
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

}
