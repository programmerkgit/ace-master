import { useragent } from './useragent';


export const dom = {

    buildDom(arr: string | any[] | any, parent: HTMLElement, refs?: any): Text | HTMLElement | any {
        if (typeof arr == 'string' && arr) {
            const txt = document.createTextNode(arr);
            parent.appendChild(txt);
            return txt;
        }
        if (!Array.isArray(arr)) {
            return arr;
        }
        if (typeof arr[ 0 ] != 'string' || !arr[ 0 ]) {
            const els = [];
            for (let i = 0; i < arr.length; i++) {
                const ch = this.buildDom(arr[ i ], parent, refs);
                ch && els.push(ch);
            }
            return els;
        }
        const el = dom.createElement(arr[ 0 ]);
        const options = arr[ 1 ];
        const childIndex = (options && typeof options == 'object' && !Array.isArray(options)) ? 2 : 1;
        for (let i = childIndex; i < arr.length; i++)
            this.buildDom(arr[ i ], el, refs);
        if (childIndex == 2) {
            Object.keys(options).forEach(n => {
                const val = options[ n ];
                if (n === 'class') {
                    el.className = Array.isArray(val) ? val.join(' ') : val;
                } else if (typeof val == 'function' || n == 'value') {
                    (el as any)[ n ] = val;
                } else if (n === 'ref') {
                    if (refs) refs[ val ] = el;
                } else if (val != null) {
                    el.setAttribute(n, val);
                }
            });
        }
        if (parent)
            parent.appendChild(el);
        return el;
    },

    createElement(tagName: string): HTMLElement {
        return document.createElement(tagName);
    },
    removeChildren(element: HTMLElement) {
        element.innerHTML = '';
    },
    createTextNode(textContent: string, element?: HTMLElement): Text {
        /**
         * When iframe is used, document and node.ownerDocument is different
         * https://stackoverflow.com/questions/9845043/when-node-ownerdocument-is-not-window-document
         * */
        const doc = element ? element.ownerDocument : document;
        return doc.createTextNode(textContent);
    },
    getDocumentHead(doc = document): Document | HTMLElement {
        /* document.documentElement is HTMLElement. document is not HTMLElement */
        return doc.head || doc.getElementsByName('head') || doc.documentElement;
    },
    createFragment(element?: HTMLElement) {
        const doc = element ? element.ownerDocument : document;
        /**
         * document fragment: https://developer.mozilla.org/en-US/docs/Web/API/Document/createDocumentFragment
         * */
        return doc.createDocumentFragment();
    },
    hasCssClass(element: HTMLElement, name: string): boolean {
        const classes = element.className.split(/\s+/g);
        return classes.indexOf(name) !== -1;
    },
    addCssClass(element: HTMLElement, name: string) {
        if (!this.hasCssClass(element, name)) {
            element.className += ' ' + name;
        }
    },
    removeCssClass(element: HTMLElement, name: string) {
        const classes = element.className.split(/\s+/g);
        while (true) {
            const i = classes.indexOf(name);
            if (i === -1)
                break;
            classes.splice(i, 1);
        }
        element.className = classes.join(' ');
    },
    /**
     * return true if added
     * return false if removed
     * */
    toggleCssClass(element: HTMLElement, name: string): boolean {
        if (this.hasCssClass(element, name)) {
            this.removeCssClass(element, name);
            return false;
        } else {
            this.addCssClass(element, name);
            return true;
        }
    },
    setCssClass(element: HTMLElement, name: string, include: boolean) {
        if (include) {
            this.addCssClass(element, name);
        } else {
            this.removeCssClass(element, name);
        }
    },
    /**
     *  if css style has @id id return true
     */
    hasCssString(id: any, doc: Document | HTMLElement = document): boolean {
        const sheets = doc.querySelectorAll('style');
        for (let i = 0; i < sheets.length; i++)
            if (sheets[ i ].id === id)
                return true;
        return false;

    },
    importCssString(cssText: string, id: string, target: HTMLElement | Document = document) {
        /* Root Container. container is documentElement of root HTMLElement */
        let container: Document | HTMLElement = target.getRootNode() as Document || document;
        if (this.hasCssString(id, container))
            return null;

        /* Document.ownerDocument may return null */
        /* HTMLElement.ownerDocument return Document */
        const doc = container.ownerDocument || container;
        const style = this.createElement('style');
        style.id = id;
        style.appendChild(doc.createTextNode(`${ cssText }\n/*# sourceURL=ace/css/${ id } */`));
        if (container == doc)
            container = this.getDocumentHead(doc);
        container.insertBefore(style, container.firstChild);
    },
    importCssStylesheet(uri: string, doc: Document) {
        this.buildDom([ 'link', {rel: 'stylesheet', href: uri} ], this.getDocumentHead(doc) as HTMLElement);
    },
    scrollbarWith(doc: Document) {
        const inner = this.createElement('ace_inner');
        {
            inner.style.width = '100%';
            inner.style.minWidth = '0px';
            inner.style.height = '200px';
            inner.style.display = 'block';
        }
        const outer = this.createElement('ace_outer');
        const style = outer.style;
        style.position = 'absolute';
        style.left = '-10000px';
        style.overflow = 'hidden';
        style.width = '200px';
        style.height = '150px';
        outer.appendChild(inner);

        const body = document.documentElement;
        body.appendChild(outer);
        const noScrollbar = inner.offsetWidth;

        style.overflow = 'scroll';
        const withScrollbar = outer.clientWidth;

        body.removeChild(outer);
        return noScrollbar - withScrollbar;
    },
    computedStyle(element: HTMLElement, style: any) {
        return window.getComputedStyle(element, '') || {};
    },
    setStyle(styles: any, property: any, value: any) {
        if (styles[ property ] !== value) {
            styles[ property ] = value;
        }
    },
    HAS_CSS_ANIMATION: false,
    HAS_CSS_TRANSFORMS: false,
    HI_DPI: useragent.isWin ? typeof window !== 'undefined' && window.devicePixelRatio >= 1.5
        : true,
    translate(element: HTMLElement, tx: number, ty: number) {
        if (dom.HAS_CSS_TRANSFORMS) {
            element.style.transform = `translate(${ Math.round(tx) }px, ${ Math.round(ty) }px)`;
        } else {
            element.style.top = Math.round(ty) + 'px';
            element.style.left = Math.round(tx) + 'px';
        }
    }
};


if (typeof document !== 'undefined') {
    const div: HTMLElement | null = document.createElement('div');
    if (dom.HI_DPI && div.style.transform !== undefined) {
        dom.HAS_CSS_TRANSFORMS = true;
    }
    if (!useragent.isEdge && typeof div.style.animationName !== 'undefined') {
        dom.HAS_CSS_ANIMATION = true;
    }
    div.remove();
}


