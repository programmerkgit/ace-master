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
    createEditSession(text: Document | string, mode: any): EditSession {
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

    /**
     * element is identifier or element
     * */
    edit(element: string, options: any): Editor
    edit(element: Element, options: any): Editor
    edit(element: Element | string, options: any): Editor {
        /* set element */
        let el: Element;
        if (typeof element === 'string') {
            el = Ace.getElementByIdOrThrow(element);
        } else {
            el = element;
        }
        /* todo what is el.env.editor? el.env.editor = Editor */
        if (Ace.isAceElement(el)) {
            return (el as any).env.editor;
        }

        let value = '';
        if (/input|textarea/i.test(el.tagName)) {
            /* inputかtextareaの場合、pre要素に置き換える */
            const oldNode = el;
            value = (oldNode as (HTMLInputElement | HTMLTextAreaElement)).value;
            el = document.createElement('pre');
            if (oldNode.parentElement) {
                oldNode.parentElement && oldNode.parentElement.replaceChild(el, oldNode);
            } else {
                throw new Error('root element shouldn\'t be ace editor target.');
            }
        } else {
            value = el.textContent || '';
            el.innerHTML = '';
        }

        window.addEventListener('resize', () => {
            /* TODO: env.onResize eidor.resize */
        });
        /* editor.ondestory, remove listnner of winwdow */
        /* return Editor */
    }
}

export const ace = new Ace();
