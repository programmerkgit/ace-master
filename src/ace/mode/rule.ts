type TokenFactory = (str: string) => string;

export interface TokenArray {
    token: null;
    regex: string | RegExp;
    tokenArray: string[];
    onMatch: any
}

export interface RegexRule {
    token: string | string[] | TokenFactory;
    regex: string | RegExp;
    tokenArray?: string[]
}

interface NextRule extends RegexRule {
    next: string | Rule[];
}

interface PushRule extends RegexRule {
    push: string | Rule[];
}

interface IncludeRule {
    include: string
}

export interface DefaultTokenRule {
    defaultToken: string
}

interface CaseIncentiveRule {
    caseIncentive: boolean
}

export type Rule =
    RegexRule |
    NextRule |
    PushRule |
    DefaultTokenRule |
    IncludeRule |
    CaseIncentiveRule

export type Rules = {
    [ StateName: string ]: Rule[]
}


export function isPushRule(rule: Rule): rule is PushRule {
    return hasKey(rule, 'push');
}

export function isNextRule(rule: Rule): rule is NextRule {
    return hasKey(rule, 'next');
}

export function isIncludeRule(rule: Rule): rule is IncludeRule {
    return hasKey(rule, 'include');
}

export function isRegexRule(rule: Rule): rule is RegexRule {
    return (rule as any).regex != null;
}

export function isDefaultTokenRule(rule: Rule): rule is DefaultTokenRule {
    return hasKey(rule, 'defaultToken');
}

export function isCaseIncentiveRule(rule: Rule): rule is CaseIncentiveRule {
    return hasKey(rule, 'caseIncentive');
}

export function hasKeyThenT<T>(arg: any, key: string): arg is T {
    return hasKey(arg, key);
}

function hasKey(arg: any, key: string): boolean {
    return arg[ key ] !== undefined;
}
