/**
 * Represents a Editor.
 * @constructor
 */
import { VirtualRenderer } from './virtual-renderer';
import { EditSession } from './edit-session';
import { EventEmitter } from './lib/event-emitter';
import { CommandManager } from './commands/command-manager';
import { useragent } from './lib/useragent';
import { commands as defaultCommands } from './commands/default_commands';
import { KeyBinding } from './key-bindings';
import { Delta } from './document';

export class Editor extends EventEmitter {
    static $uid = 0;
    mouseHandler = {
        focusTimeout: 0
    };
    $toDestroy = [];
    highlightTagPending: boolean = false;
    cursorLayer?: HTMLElement;
    session?: EditSession;
    commands: CommandManager = new CommandManager(useragent.isMac ? 'mac' : 'win', defaultCommands);
    $search = new Search().set({wrap: true});
    keyBinding = new KeyBinding(this);

    private id = 'editor' + ++Editor.$uid;

    constructor(
        public renderer: VirtualRenderer,
        session?: EditSession,
        options: any = {}
    ) {
        super();
        const container = renderer.getContainerElement();
        this.commands.on('exec', this.$historyTracker);
    }

    setOption(key: string, value: boolean | number) {

    }

    setHighlightActiveLine(option: boolean) {
    }

    setShowPrintMargin(option: boolean) {
    }

    onTextInput(text: string, composition: boolean) {

    }

    /*
       * var container = renderer.getContainerElement();
       this.commands = new CommandManager(useragent.isMac ? "mac" : "win", defaultCommands);
       if (typeof document == "object") {
           this.textInput = new TextInput(renderer.getTextAreaContainer(), this);
           this.renderer.textarea = this.textInput.getElement();
           this.$mouseHandler = new MouseHandler(this);
           new FoldHandler(this);
       }

       this.keyBinding = new KeyBinding(this);
       this.$search = new Search().set({
           wrap: true
       });
       this.$historyTracker = this.$historyTracker.bind(this);
       this.commands.on("exec", this.$historyTracker);
       this.$initOperationListeners();
       this._$emitInputEvent = lang.delayedCall(function () {
           this._signal("input", {});
           if (this.session && this.session.bgTokenizer)
               this.session.bgTokenizer.scheduleStart();
       }.bind(this));
       this.on("change", function (_, _self) {
           _self._$emitInputEvent.schedule(31);
       });
       this.setSession(session || options && options.session || new EditSession(""));
       config.resetOptions(this);
       if (options)
           this.setOptions(options);
       config._signal("editor", this);
       * */

    setSession(session: EditSession) {
        /* ignore if already session is set */
        if (this.session == session)
            return;
        /*  ??*/
        if (this.curOp) this.endOperation();
        this.curOp = {};
        const oldSession = this.session;
        if (this.session) {
            this.session.off('change', this.$onDocumentChange);
        }
    }

    onDocumentChange(delta: Delta) {
        const wrap: boolean = this.session.$useWrapMode;
        const lastRow = (delta.start.row == delta.end.row ? delta.end.row : Infinity);
        this.renderer.updateLines(delta.start.row, lastRow, wrap)
    }

}
