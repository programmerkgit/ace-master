/* Gutterと呼ばれるパーツ */

type Cell = any;

import {EventEmitter} from "./lib/event-emitter";

/* 何故EventEmitterなのか */
export class Gutter extends EventEmitter {
    element: Element;

    constructor(parentElement: Element) {
        super();

        const element = document.createElement("div");
        this.element = element;
        element.classList.add("ace_layer");
        element.classList.add("ace_gutter-layer");
        /* ?? */
        // this.setSh   owFoldWidgets(this.$showFoldWidgets);
        parentElement.appendChild(element);
    }

    /**
     * render cell (line number and some components of gutter)
     * */
    renderCell(cell: Cell, config: any, fold: any, row: any) {
        const element: HTMLElement = cell.elment;
        const session = this.session;
        /* line nuber and fold widget such as 8▼  10▲ */
        /* i 8▼. i is ace_info and background image */
        const text = element.childNodes[0];
        const foldWidget = element.childNodes[1];
    }

    /**
     * set Session and add updateAnnotation to session change event
     * */
    setSession(session: any) {
        if (this.session) {
            this.session.removeListner("change", this.updateAnnotations());
        }
        this.session = session;
        session.on("change", this.updateAnnotations);
    }

    private updateAnnotations() {

    }


    session: any;
}
