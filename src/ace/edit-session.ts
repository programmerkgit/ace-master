import { Event, EventEmitter } from './lib/event-emitter';

const initialFoldData: any[] = [];
initialFoldData.toString = function () {
    return this.join('\n');
};
const config: any = {};

export class EditSession extends EventEmitter {

    static uid = 0;
    searchHighlight?: {
        clazz: string
    };
    id = 'editor' + ++EditSession.uid;
    docRowCache: any[] = [];
    screenRowCache: any[] = [];
    bgTokenizer: any;
    mode: any;
    private onChange: any;
    private breakpoints = [];
    private decorators = [];
    /* ?? */
    private frontMarkers = {};
    private backMarkers = {};
    private markerId = 1;
    private undoSelect = true;
    private readonly foldData = initialFoldData;
    private worker: any;
    private selection: any;
    private doc: any;
    /**
     * Returns the current [[Document `Document`]] as a string.
     * @alias EditSession.toString
     **/
    getValue = this.toString = function (): string {
        return this.doc.getValue();
    };
    private scrollTop = 0;
    private scrollLeft = 0;

    constructor(text: any, mode: any) {
        super();
        this.addEventListener('changeFold', this.onChangeFold);
    }

    highlight(a: string) {

    }

    setDocument(doc: Document) {
        /* clearOld Document */
        this.clearOldDocument();
        /* setDocument */
        this.setNewDocument(doc);
        /* setDocument on bgTokenizer */
        this.setDocumentOnTokenizer(doc);
        /* reset Cache */
        this.resetCaches();
    }

    resetCaches() {
    }

    getScrollLeft() {
        return this.scrollLeft;
    }

    setScrollLeft(scrollLeft: number) {
        if (this.scrollLeft !== null) {
            this.scrollLeft = scrollLeft;
            this.signal('changeScrollLeft', scrollLeft);
        }
    }

    setScrollTop(scrollTop: number) {
        if (this.scrollTop !== scrollTop) {
            this.scrollTop = scrollTop;
            this.signal('changeScrollTop', scrollTop);
        }
    }

    getScrollTop() {
        return this.scrollTop;
    }

    onChangeFold(e: Event) {
        var fold = e.data;
        this.resetRowCache(fold.start.row);
    };

    getTokens(row: number) {
        return this.bgTokenizer.getTokens(row);
    }

    startWorker() {
        try {
            this.worker = this.mode.createWorker(this);
        } catch (e) {
            config.warn('Could not load worker', e);
            this.worker = null;
        }
    }

    stopWorker() {
        if (this.worker) {
            this.worker.terminate();
            this.worker = null;
        }
    }

    getMode() {
        return this.mode;
    }

    /**
     * Returns selection object.
     **/
    getSelection() {
        return this.selection;
    }

    private setDocumentOnTokenizer(doc: Document) {
        if (this.bgTokenizer) {
            this.bgTokenizer.setDocument(doc);
        }
    }

    private getDocument(): Document {
        return this.doc;
    }

    private clearOldDocument() {
        /* onChangeを削除 */
        if (this.doc) {
            this.doc.removeListener('change', this.onChange);
        }
    }

    private setNewDocument(doc: Document) {
        this.doc = doc;
        doc.addEventListener('change', this.onChange);
    }

    private signal(...args: any[]) {

    }

    private resetRowCache(docRow: number) {
        if (!docRow) {
            this.docRowCache = [];
            this.screenRowCache = [];
            return;
        }
        const l = this.docRowCache.length;
        const i = this.getRowCacheIndex(this.docRowCache, docRow) + 1;
        if (i < l) {
            this.docRowCache.splice(i, l);
            this.screenRowCache.splice(i, l);
        }
    }

    private getRowCacheIndex(cacheArray: any[], val: any): number {
        let low = 0;
        let hi = cacheArray.length - 1;

        /* ?? what is val and cacheArray[mid] */
        while (low <= hi) {
            const mid = (low + hi) >> 1;
            const c = cacheArray[ mid ];
            if (val < c) {
                hi = mid - 1;
            } else if (val === c) {
                return mid;
            } else if (c < val) {
                low = mid + 1;
            }
        }
        return low - 1;
    };

}
