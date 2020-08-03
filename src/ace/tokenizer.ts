import { Rules } from './mode/rule';

function $applyToken(this: Omit<TokenizerRule, 'splitRegex' | 'token'> & { splitRegex: RegExp, token: Function }, str: string) {
    var values = (this.splitRegex.exec(str) as RegExpMatchArray).slice(1);
    const types = this.token(...values);

    var tokens = [];
    for (var i = 0; i < types.length; i++) {
        if (values[ i ])
            tokens[ tokens.length ] = {
                type: types[ i ],
                value: values[ i ]
            };
    }
    return tokens;
};

interface TokenizerRule {
    defaultToken?: any;
    caseIncentive?: any;
    regex?: RegExp | string;
    token: string | string[] | Function;
    tokenArray: string[];
    onMatch?: Function | null;
    splitRegex?: RegExp;
}

type States = {
    [ State: string ]: TokenizerRule[]
}

export class Tokenizer {
    states: States = {};
    splitRegex: RegExp = /./g;
    tokenArray: any;
    regExps: any = {};
    matchMappings: {
        [ K: string ]: { defaultToken: string, [ K: number ]: any }
    } = {};

    constructor(
        rules: Rules
    ) {
        /* loop for state */
        for (let key in rules) {
            /* deep copy rules */
            this.states[ key ] = rules[ key ].map(rule => Object.create(rule));
            const state = this.states[ key ];
            const ruleRegExps = [];
            let matchTotal = 0;
            const mapping = this.matchMappings[ key ] = {defaultToken: 'text'};
            let flag = 'g';
            const splitterRules: TokenizerRule[] = [];
            /* loop for rule */
            for (let i = 0; i < state.length; i++) {
                let rule: TokenizerRule = state[ i ];
                /* override defaultToken by rule's token */
                if (rule.defaultToken)
                    mapping.defaultToken = rule.defaultToken;
                if (rule.caseIncentive)
                    flag = 'gi';
                if (rule.regex == null)
                    continue;
                if (rule.regex instanceof RegExp)
                    /* stringify regex /abc/ => "abc" */
                    rule.regex = rule.regex.toString().slice(1, -1);
                let adjustedregex = rule.regex;
                let matchcount = (new RegExp(`(?:(${ adjustedregex })|(.)`).exec('a') as RegExpMatchArray).length - 2;
                if (Array.isArray(rule.token)) {
                    if (rule.token.length == 1 || matchcount == 1) {
                        /* flatten token array to string */
                        rule.token = rule.token[ 0 ];
                    } else if (matchcount - 1 != rule.token.length) {
                        /* matchcount -1 should equal rule.token.length */
                        /* matchcount should be token.length + 1 for some reasons.*/
                        rule.token = rule.token[ 0 ];
                    } else {
                        rule.tokenArray = rule.token;
                        delete rule.token;
                        rule.onMatch = this.$arrayTokens;
                    }
                } else if (typeof rule.token == 'function' && !rule.onMatch) {
                    if (matchcount > 1)
                        rule.onMatch = $applyToken;
                    else
                        /* when match count < 1 */
                        rule.onMatch = rule.token;
                }
                if (matchcount > 1) {
                    if (/\\\d/.test(rule.regex)) {

                    } else {
                        matchcount = 1;
                        adjustedregex = this.removeCapturingGroups(rule.regex);
                    }
                    if (!rule.splitRegex && typeof rule.token != 'string') {
                        splitterRules.push(rule);
                    }
                }

                mapping[ matchTotal ] = i;
                matchTotal += matchcount;

                ruleRegExps.push(adjustedregex);

                if (!rule.onMatch)
                    rule.onMatch = null;
            }

            if (!ruleRegExps.length) {
                mapping[ 0 ] = 0;
                ruleRegExps.push('$');
            }

            splitterRules.forEach(rule => {
                rule.splitRegex = this.createSplitterRegexp(rule.regex, flag);
            }, this);

            this.regExps[ key ] = new RegExp(`(${ ruleRegExps.join(')|(') })|($)`, flag);
        }
    }

    /**
     * @param src pattern string
     * @param flag parameter of regex
     * */
    createSplitterRegexp(src: string, flag: string) {
        /* When escaped parenthesis is used */
        if (src.indexOf('(?=') != -1) {
            let stack = 0;
            let inChClass = false;
            const lastCapture: { stack?: number, end?: number, start?: number } = {};
            src.replace(
                /(\\.)|(\((?:\?[=!])?)|(\))|([\[\]])/g,
                /* matched string, captured match, captured match, captured match, captured, index, input string, groups: [(?=)] */
                (m, esc, parenOpen, parenClose, square, index) => {
                    if (inChClass) {
                        inChClass = square != ']';
                    } else if (square) {
                        inChClass = true;
                    } else if (parenClose) {
                        if (stack == lastCapture.stack) {
                            lastCapture.end = index + 1;
                            lastCapture.stack = -1;
                        }
                        stack--;
                    } else if (parenOpen) {
                        stack++;
                        if (parenOpen.length != 1) {
                            lastCapture.stack = stack;
                            lastCapture.start = index;
                        }
                    }
                    return m;
                });
            if (lastCapture.end != null && /^\)*$/.test(src.substr(lastCapture.end)))
                src = src.substring(0, lastCapture.start) + src.substr(lastCapture.end);
        }
        // this is needed for regexps that can match in multiple ways
        if (src.charAt(0) != '^') src = '^' + src;
        if (src.charAt(src.length - 1) != '$') src += '$';

        return new RegExp(src, (flag || '').replace('g', ''));
    }

    $applyToken() {

    }

    $arrayTokens(str: string): any {
        if (!str)
            return [];
        const values = this.splitRegex.exec(str);
        if (!values)
            return 'text';
        const tokens = [] as any;
        const types = this.tokenArray;
        types.forEach((type, i) => {
            if (values[ i + 1 ])
                tokens[ tokens.length ] = {
                    type: type,
                    value: values[ i + 1 ]
                };
        });
        return tokens;
    }

    removeCapturingGroups(src: string) {
        return src.replace(
            /(?:  \\.  )|(?:  \[ (?: \\ . | [ ^ \\ \] ] )*  )|(?: \(\?[:=!]  )| (\()/g,
            (x, y) => y ? '(?:' : x
        );
    }

    getLineTokens(line: number, startState: string | string[]) {
        let stack: string[] = [];
        if (typeof startState !== 'string') {
            stack = startState.slice(0);
            startState = stack[ 0 ];
            if (startState === '#tmp') {
                stack.shift();
                startState = stack.shift() as string;
            }
        } else {
            stack = [];
        }

        /* Current state is default to start */
        let currentState = startState || 'start';
        const state = this.states[ currentState ];

        const mapping = this.matchMappings[ currentState ];
        const re = this.regExps[ currentState ];
        re.lastIndex = 0;
    }
}
