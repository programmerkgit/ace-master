import { dom } from '../lib/dom';
import { EventEmitter } from '../lib/event-emitter';

export class Gutter extends EventEmitter {
    element: HTMLElement;
    gutterWidth = 0;
    $annotations = [];
    session: any;

    constructor(parentElement: HTMLElement) {
        super();
        const element = dom.createElement('div');
        element.className = 'ace_layer ace_gutter-layer';
        this.element = element;
        parentElement.appendChild(this.element);
    }

    private static createGutterElement() {
    }

    setSession(session: any) {
        if (this.session) {
            this.session.off('change', this.$updateAnnotations);
        }
        this.session = session;
        if (session) {
            session.on('change', this.$updateAnnotations);
        }
    }

    $updateAnnotations() {
    }

    addGutterDecoration(row: any, className: any) {
        if (window.console) {
            console.warn && console.warn('deprecated use session.addGutterDecoration');
        }
        this.session.addGutterDecoration(row, className);
    }
}
