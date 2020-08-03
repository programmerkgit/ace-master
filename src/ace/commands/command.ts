export interface Command {
    name: string;
    /**
     * example: {win: "Ctrl-M", mac: "Command-M"}
     * */
    bindKey: { win: string, mac: string, position?: number } | string
    readOnly: boolean

    exec(editor: any, args?: any): void;
}
