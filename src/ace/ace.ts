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

/** Very Important Part. Delegate all focus to the background text area.
 * All we see is created by logical process. what we are editing is not what we are editting.
 * Background structure is editted.
 * All element is automatically created in the foront.
 * selection is on the background and
 *
 * Brings the current `textInput` into focus.
 this.focus = function () {
    // focusing after timeout is not needed now, but some code using ace
    // depends on being able to call focus when textarea is not visible,
    // so to keep backwards compatibility we keep this until the next major release
    var _self = this;
    setTimeout(function () {
        if (!_self.isFocused())
            _self.textInput.focus();
    });
    this.textInput.focus();
};
 */

import { Document } from './document';
import { EditSession } from './edit-session';
import { UndoManager } from './undo-manager';
import { Editor } from './editor';
import { VirtualRenderer } from './virtual-renderer';

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

/**
 * Ace is editor instance
 *
 * TODO: what is createEditSession?
 * */
class Ace {
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
     *
     *
     *
     * */
    createEditSession(text: Document | string, mode?: any): EditSession {
        const doc = new EditSession(text, mode);
        doc.setUndoManager(new UndoManager());
        return doc;
    }

    /**
     * Create ace instance.
     * @param element element is query string or Element class.
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
        const editor = new Editor(new VirtualRenderer(el), doc, options);

        window.addEventListener('resize', () => {
            /* TODO: env.onResize eidor.resize */
        });
        const env: any = {};


        /* editor.ondestory, remove listnner of winwdow */
        /* return Editor */
        /*
        * When window resized, resize event occur
        * */
        event.addEventListner(window, 'resize', env.onReize);
        editor.container.env = editr.env = env;
        editor.on('destory', () => {
            event.removeListner(window, 'resize', env.onReize);
            env.editor.container.nev = null; // prevent memory leak
        });
        return editor;
    }
}

export const ace = new Ace();
