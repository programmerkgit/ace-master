export class KeyBinding {
    private defaultHandler: any;
    private readonly editor: any;
    private readonly handlers: any[] = [];

    constructor(editor: any) {
        this.editor = editor;
        /* what is set default handler?? */
        this.setDefaultHandler(editor.commands);
    }

    private get data() {
        return {editor: this.editor};
    }

    setDefaultHandler(kb: any) {
        this.removeKeyboardHandler(this.defaultHandler);
        this.defaultHandler = kb;
        this.addKeyboardHandler(kb, 0);
    }

    addKeyboardHandler = (kb: any, pos: any) => {
        /* what is kb */
        if (!kb) return;
        if (typeof kb == 'function' && !kb.handleKeyboard) kb.handleKeyboard = kb;
        const i = this.handlers.indexOf(kb);
        if (i != -1) this.handlers.splice(i, 1);
        if (pos == undefined) this.handlers.push(kb);
        else this.handlers.splice(pos, 0, kb);
        /*if (!kb)
            return;
        if (typeof kb == "function" && !kb.handleKeyboard)
            kb.handleKeyboard = kb;
        var i = this.handlers.indexOf(kb);
        if (i != -1)
            this.handlers.splice(i, 1);

        if (pos == undefined)
            this.handlers.push(kb);
        else
            this.handlers.splice(pos, 0, kb);

        if (i == -1 && kb.attach)
            kb.attach(this.editor);*/
    };

    onTextInput(text: string) {
        return this.callKeyboardHandlers(-1, text);
    }

    removeKeyboardHandler(kb: any) {

    }

    private callKeyboardHandlers(hashId: number, keyString: string, keyCode?: string, e?: Event): boolean {
        let success = false;
        let toExecute;
        const commands = this.editor.commands;
        /* depends on commands of editor */
        return success;

    }
}
