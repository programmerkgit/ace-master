/**
 * Represents a Editor.
 * @constructor
 */
import {Ace} from "../../ace";
import VirtualRenderer = Ace.VirtualRenderer;

export class Editor {
    static $uid = 0;
    private id = "editor" + ++Editor.$uid;

    constructor(renderer: VirtualRenderer, session: EditSession) {
        /* each editor should be unique */
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
