// require fix-browser

// require dom
// require event

/**
 * // The following require()s are for inclusion in the built ace file
 * require("./worker/worker_client");
 * require("./keyboard/hash_handler");
 * require("./placeholder");
 * require("./multi_select");
 * require("./mode/folding/fold_mode");
 * require("./theme/textmate");
 * require("./ext/error_marker");
 * exports.config = require("./config");
 */

class Range {
}

class Editor {
}

class EditSession {
    constructor(...args: any[]) {
    }

    setUndoManager(manager: UndoManager) {
    }
}

class UndoManager {
}

class Renderer {
}

/**
 * Ace has three methods
 * ace.require
 * ace.config
 * ace.createEditSession
 * ace.edit
 * Range
 * Editor
 * EditorSession
 * UndoManager
 * VirtualRenderer => Renderer
 * version config.version
 * */


class Ace {
    createEditSession(text: Document | string, mode?: any): EditSession {
        /* Edit sessionを作るとともに  undomanagerをセット。 */
        const doc = new EditSession(text, mode);
        doc.setUndoManager(new UndoManager());
        return doc;
    }

    static getElementByIdOrThrow(element: string): Element {
        const el = document.getElementById(element);
        if (!el)
            throw new Error('ace.edit can\'t find div #' + element);
        return el;
    }

    static isAceElement(el: Element): boolean {
        return el && (el as any).env && (el as any).env.editor instanceof Editor;
    }

    static isFormElement(el: Element): boolean {
        return /input|textarea/i.test(el.tagName);
    }

    static getValue(el: Element): string {
        if (this.isFormElement(el)) {
            return (el as (HTMLInputElement | HTMLTextAreaElement)).value;
        } else {
            return el.textContent || '';
        }
    }

    static initializeEditorElement(el: Element): Element {
        if (Ace.isFormElement(el)) {
            const oldNode = el;
            el = document.createElement('pre');
            if (oldNode.parentElement) {
                oldNode.parentElement && oldNode.parentElement.replaceChild(el, oldNode);
            } else {
                throw new Error('root element shouldn\'t be ace editor target.');
            }
        } else {
            el.innerHTML = '';
        }
        return el;
    }

    /**
     * element is identifier or element
     * */
    edit(element: Element | string, options: any): Editor {

        /* set element */
        let el: Element = typeof element === 'string' ?
            Ace.getElementByIdOrThrow(element) : element;
        if (Ace.isAceElement(el)) {
            return (el as any).env.editor;
        }

        const value = Ace.getValue(el);
        el = Ace.initializeEditorElement(el);

        /* todo: know createEditSession */
        const doc = this.createEditSession(value);

        window.addEventListener('resize', () => {
            /* TODO: env.onResize eidor.resize */
        });
        /* editor.ondestory, remove listnner of winwdow */
        /* return Editor */
    }
}

export const ace = new Ace();
