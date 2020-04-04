import { VirtualRenderer } from '../virtual-renderer';
import { Editor } from '../editor';
import { EditSession } from '../edit-session';

class SingleLineEditor extends Editor {

    constructor(el: HTMLElement) {
        const renderer = new VirtualRenderer(el);
        renderer.maxLines = 4;
        super(renderer);
        this.setHighlightActiveLine(false);
        this.setShowPrintMargin(false);
        this.renderer.setShowGutter(false);
        this.renderer.setHighlightGutterLine(false);

        this.mouseHandler.focusTimeout = 0;
        this.highlightTagPending = true;
    }

}

export class AcePopup extends SingleLineEditor {

    isFocused = true;

    constructor(parentNode: HTMLElement) {
        super(document.createElement('div'));
        this.renderer.content.style.cursor = 'default';
        this.renderer.setStyle('ace_autocomplete');
        this.setOption('displayIndentGuides', false);
        this.setOption('dragDelay', 150);
        const noop = () => {
        };
        this.renderer.cursorLayer.restartTimer = noop;
        this.renderer.cursorLayer.element.style.opacity = '0';
        this.renderer.maxLines = 8;
        this.renderer.keepTextAreaAtCursor = false;
        this.setHighlightActiveLine(false);
        (this.session as EditSession).highlight('');
        this.session && this.session.searchHighlight && (this.session.searchHighlight.clazz = 'ace_hi');
        this.on('mousedown', (e) => {
            const pos = e.getDocumentPosition();
            this.selection.moveToPosition(pos);
            selectionMarker.start.row = selectionMarker.end.row = pos.row;
        });
        this.renderer.on('beforeRender', () => {
            if (lsatMouseEvent && hoverMarker.start.row != -1) {
                lastMouseEvent.$pos = null;
                const row = lastMouseEvent.getDocumentPosition().row;
                if (!hoverMarker.id)
                    this.setRow(row);
                setHoverMarker(row, true);
            }
        });
    }

    focus() {
    }
}
