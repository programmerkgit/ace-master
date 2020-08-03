export class TextHighlightRules {

    $rules: { [ key: string ]: any } = {
        start: [
            {
                token: 'empty_line',
                regex: '^$'
            },
            {
                defaultToken: 'text'
            }
        ]
    };

    constructor() {
    }

    addRules(rules: any, prefix: string) {
        if (!prefix) {
            for (let key in rules) {
                this.$rules[ key ] = rules[ key ];
            }
            return;
        }
        for (let key in rules) {
            const state = rules[ key ];
            state.forEach((rule: any) => {
                if (rules.next || rule.onMatch) {
                    /* nextにprefix追加 */
                    if (typeof rule.next == 'string') {
                        if (rule.next.indexOf(prefix) !== 0)
                            rule.next = prefix + rules.next;
                    }
                    /* nextStateにprefix追加 */
                    if (rule.nextState) {
                        if (rule.nextState.indexOf(prefix) !== 0)
                            rule.nextState = prefix + rule.nextState;
                    }
                }
            });

            this.$rules[ prefix + key ] = state;
        }
    }

    embedRules(highlightRules, prefix, escapeRules, states, append) {
    }

    getRules() {

    }

    getEmbeds() {
    }

    pushState() {
    }

    popState() {
    }

    normalizeRules() {
    }

    createKeywordMapper() {
    }

    getKeywords() {
    }
}
