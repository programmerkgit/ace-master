/* textarea to be editted */

import { dom } from '../lib/dom';
import { Editor } from '../editor';
/* very important line */

// event.addCommandKeyListener(text, host.onCommandKey.bind(host));
export class TextInput {
    textArea: HTMLTextAreaElement | null;
    ignoreFocusEvent: boolean = false;
    host: Editor;
    isFocused = false;
    parentNode: any;
    inComposition: boolean | any;

    constructor(parentNode: HTMLElement, host: Editor) {
        const textArea = dom.createElement('textarea') as HTMLTextAreaElement;
        this.textArea = textArea;
        this.host = host;
        textArea.className = 'ace_text-input';
        textArea.setAttribute('wrap', 'off');
        textArea.setAttribute('autocorrect', 'off');
        textArea.setAttribute('autocapitalize', 'off');
        textArea.setAttribute('spellcheck', 'false');

        textArea.style.opacity = '0';
        parentNode.prepend(textArea);
        textArea.addEventListener('input', this.onInput);
    }

    onInput(e: Event) {
        /* ?? */
        if (this.inComposition) {
            return this.onCompositionUpdate();
        }
        /* [InputEvent.inputType](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent/inputType) */
        /* delete by back, delete by cut, and so on */
        if (this.isInputEvent(e)) {
            switch (e.inputType) {
                case 'historyUndo':
                    return this.host.execCommand('undo');
                case 'historyRedo':
                    return this.host.execCommand('redo');
                default:
                    break;
            }
        }

        if (this.textArea) {
            const data = this.textArea.value;
            const inserted = this.sendText(data, true);
        }
    }

    onCompositionStart(e: Event) {

    }

    onCompositionUpdate() {
    }

    sendText(data: string, formInput: boolean) {
        /* index of selected text */
        if (this.textArea) {
            const selectionStart: number = this.textArea.selectionStart;
            const selectionEnd: number = this.textArea.selectionEnd;
            /* delegate to host.onTextInput */
            // host.onTextInput
        }
    }

    /* この要素を削除する */
    destroy() {
        if (this.textArea.parentElement) {
            this.textArea.parentElement.removeChild(this.textArea);
        }
        this.host = this.textArea = this.parentNode = null;
    }

    private isInputEvent(e: Event | InputEvent): e is InputEvent {
        return (e as InputEvent).inputType !== undefined;
    }

    private focus() {
        this.isFocused = true;
    }

    private onBlurHost(e: Event) {
        this.host.onBlur(e);
    }

    private onFocusHost(e: Event) {
        this.host.onFocus(e);
    }

    private setBlurListener() {
        this.textArea.addEventListener('blur', (e: Event) => {
            if (!this.ignoreFocusEvent) {
                this.onBlurHost(e);
                this.focus();
            }
        });
    }

    private isEdge(): boolean {
        return false;
    }

    private setFocusListener(e: Event) {
        if (!this.ignoreFocusEvent) {
            this.focus();
        }
    }
}
