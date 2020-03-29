/**
 * This object maintains the undo stack for an EditSession.
 * */
export class UndoManager {
    private maxRev = 0;
    private fromUndo = false;
    private session: any;
    private redoStack: any[] = [];
    private undoStack: any[] = [];

    reset() {
    };

    redo() {
    }

    undo() {
    }

    hasRedo() {
    }

    hasUndo() {
    }

    constructor() {
        this.reset();
    }

    addSession(session: any) {
    }

}
