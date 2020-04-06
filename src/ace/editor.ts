/**
 * Represents a Editor.
 * @constructor
 */
import { VirtualRenderer } from './virtual-renderer';
import { EditSession } from './edit-session';
import { EventEmitter } from './lib/event-emitter';

export class Editor extends EventEmitter {
    static $uid = 0;
    renderer: VirtualRenderer;
    mouseHandler = {
        focusTimeout: 0
    };
    highlightTagPending: boolean = false;
    cursorLayer?: HTMLElement;
    session?: EditSession;
    private id = 'editor' + ++Editor.$uid;

    constructor(renderer: VirtualRenderer, session?: EditSession) {
        super();
        this.renderer = renderer;
        /* each editor should be unique */
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

}
