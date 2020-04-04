/* https://jsdoc.app/index.html#block-tags */

export type Event = any
export type EventCallback = (e: Event) => any
type DefaultHandlers = { __disabled__: { [ key: string ]: EventCallback[] } } & { [ key: string ]: EventCallback }

/** Class representing a point. */
export class EventEmitter {

    /**
     *
     * key: event name value is eventlistners
     *
     * */
    private eventRegistry: { [ key: string ]: EventCallback[] } = {};
    private defaultHandlers: DefaultHandlers = {__disabled__: {}} as DefaultHandlers;

    /**
     * constructor description
     */
    constructor() {
    }

    /**
     * 特定のイベントが発生した時に呼ばれるデフォルトのハンドラー。イベント1種類につき一つのハンドラーが登録できる。
     * @param{string} eventName - イベントの名前
     * @param{EventCallback} callback - 実行されるハンドラ
     * */
    setDefaultHandlers(eventName: string, callback: EventCallback): this {
        const handlers = this.defaultHandlers;
        if (handlers[ eventName ]) {
            /* 元々のデフォルトハンドラーをDisableに格納 */
            const oldHandler = handlers[ eventName ];
            const disabled = this.safeGetDisabledDefaultHandlers(eventName);
            disabled.push(oldHandler);
            /* disabledにcallbackが存在していたら削除 */
            const index = disabled.indexOf(callback);
            if (index != -1) {
                disabled.splice(index, 1);
            }
        }
        handlers[ eventName ] = callback;
        return this;
    }

    /**
     * add event listner
     * @function
     * @param {string} eventName - name of event to listen to
     * @param {EventCallback} listener - function which is called when emitted event of eventName
     * */
    addEventListener(eventName: string, listener: EventCallback): this {
        this.safeGetListeners(eventName).push(listener);
        return this;
    }

    /**
     * alias for addEventListner
     * */
    on(eventName: string, callback: EventCallback): this {
        return this.addEventListener(eventName, callback);
    }

    /**
     * Get the x value.
     * @return {number} The x value.
     */
    removeListener(eventName: string, callback: EventCallback): void {
        const index = (this.safeGetListeners(eventName)).indexOf(callback);
        if (0 < index) {
            this.safeGetListeners(eventName).splice(index, 1);
        }
    }

    /**
     * alias for removeListener
     * */
    off(eventName: string, callback: EventCallback): void {
        return this.removeListener(eventName, callback);
    }

    // otherwise remove all event listeners
    removeAllListener(eventName?: string): this {
        if (eventName === null || eventName === undefined) {
            this.eventRegistry = {};
        } else {
            this.eventRegistry[ eventName ] = [];
        }
        return this;
    }

    emit(eventName: string, e: {}): this {
        (this.safeGetListeners(eventName)).forEach(callback => {
            callback(e);
        });
        return this;
    }

    // if eventName passed remove listeners of event name

    signal(eventName: string, e?: Event) {
        const listeners = this.safeGetListeners(eventName);
        listeners.forEach(listener => {
            listener(e);
        });
    };

    private safeGetListeners(eventName: string): EventCallback[] {
        this.eventRegistry[ eventName ] || (this.eventRegistry[ eventName ] = []);
        return this.eventRegistry[ eventName ];
    }

    private safeGetDisabledDefaultHandlers(eventName: string): EventCallback[] {
        this.defaultHandlers.__disabled__[ eventName ] || (this.defaultHandlers.__disabled__[ eventName ] = []);
        return this.defaultHandlers.__disabled__[ eventName ];
    }
}
