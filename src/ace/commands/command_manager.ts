import { Editor } from '../editor';
import { Command } from './default_commands';

export class CommandManager {
    constructor(platform: string, commands: any[]) {
    }

    exec(command: Command, editor: Editor, args: any[]) {
        // command manager exe command.exec
        // command.exec(editor);
    }
}
