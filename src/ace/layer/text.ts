import {dom} from '../lib/dom';
import {Lines} from './lines';
import {EventEmitter} from '../lib/event-emitter';

export class Text extends EventEmitter {
    element: HTMLElement = document.createElement('div');
    dom = dom;

    private initElement(parentElement: HTMLElement) {
    }

    /* endof char depends on environment  */
    private updateEolChar() {
        const doc = this.session.doc;
    }

    /* ?? set margin */
    setPadding(padding: number) {
        this.padding = padding;
        this.element.style.margin = '0 ' + padding + 'px';
    }

    getLingHeight() {
        return this.fontMetrics.characterSize.height || 0;
    }

    private padding?: number = 0;

    constructor(parentElement: HTMLElement) {
        super();
        this.element = this.dom.createElement('div');
        this.element.className = 'ace_layer ace_text-layer';
        parentElement.appendChild(this.element);
        this.lines = new Lines(this.element);
    }

    private lines: Lines;

}
