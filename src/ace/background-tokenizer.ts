export class BackgroundTokenizer {
    running = false;
    lines: string[] = [];
    states = [];
    currentLine = 0;

    toeknizer;

    constructor(tokenizer) {
        this.toeknizer = tokenizer;
    }

}
