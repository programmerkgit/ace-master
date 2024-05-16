import { VirtualRenderer } from './virtual-renderer';

export class RenderLoop {
    pending = false;
    changes = 0;
    $recursionLimit = 2;

    constructor(
        public onRender: (this: VirtualRenderer) => any,
        public win: (WindowProxy & typeof globalThis) = window
    ) {
    }

    _flush(ts: any) {
        this.pending = true;
    }

    schedule(change: number) {
        this.changes = this.changes | change;
        if (this.changes && !this.pending) {
            event.nextFrame(this._flush);
            this.pending = true;
        }
    }


    clear(change: number): number {
        const changes = this.changes;
        this.changes = 0;
        return changes;
    }

}
