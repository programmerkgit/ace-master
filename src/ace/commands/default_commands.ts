import { Editor } from '../editor';

export interface Command {
    name: string,
    bindKey: any,
    exec: (editor: Editor) => void,
    readOnly: boolean
}

export const commands: Command[] = [];
