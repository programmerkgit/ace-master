export class KeyBinding {
    constructor(editor: any) {
        this.editor = editor;
        /* what is set default handler?? */
        this.setDefaultHandler(editor.commands);
    }

    setDefaultHandler(kb: any) {
        this.removeKeyboardHandler(this.defaultHandler);
        this.defaultHandler = kb;
        this.addKeyboardHandler(kb, 0);
    }

    addKeyboardHandler = (kb: any, pos: any) => {
        /* what is kb */
        if (!kb) return;
        if (typeof kb == "function" && !kb.handleKeyboard) kb.handleKeyboard = kb;
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

    removeKeyboardHandler(kb: any) {

    }

    private defaultHandler: any;


    private readonly editor: any;

    private get data() {
        return {editor: this.editor};
    }

    private readonly handlers: any[] = [];
}
