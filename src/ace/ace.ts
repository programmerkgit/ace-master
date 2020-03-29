class UndoManager {

}

class EditSession {
    constructor(...args: any[]) {
    }

    setUndoManager(manager: UndoManager) {

    }
}

class Editor {
}

class Ace {
    createEditSession(text: Document | string, mode: any): EditSession {
        /* Edit sessionを作るとともに  undomanagerをセット。 */
        const doc = new EditSession(text, mode);
        doc.setUndoManager(new UndoManager());
        return doc;
    }

    edit(element: string, options: any): void
    edit(element: Element, options: any): void
    edit(element: Element | string, options: any): void {
        /* set el */
        let el: Element | null;
        if (typeof element === "string") {
            /* if element is string, get element by id */
            el = document.getElementById(element);
            if (!el)
                throw new Error("ace.edit can't find div #" + element);
        } else {
            el = element;
        }
        /* todo check: it would be Editor's property ?? */
        if ((el as any).env.editor instanceof Editor) {

        }

        let value = "";
        if (/input|textarea/i.test(el.tagName)) {
            /* inputかtextareaの場合、pre要素に置き換える */
            const oldNode = el;
            value = (oldNode as (HTMLInputElement | HTMLTextAreaElement)).value;
            el = document.createElement("pre");
            if (oldNode.parentElement) {
                oldNode.parentElement && oldNode.parentElement.replaceChild(el, oldNode);
            } else {
                throw new Error("root element shouldn't be ace editor target.");
            }
        } else {
            value = el.textContent || "";
            el.innerHTML = "";
        }

        window.addEventListener("resize", () => {
            /* TODO: env.onResize eidor.resize */
        });
        /* editor.ondestory, remove listnner of winwdow */
        /* return Editor */
    }
}
