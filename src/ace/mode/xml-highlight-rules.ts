import { Rules } from './rule';

export class XmlHighlightRules {
    $rules: Rules = {
        start: [
            {token: 'string.cdata.xml', regex: '', next: 'cdata'},
            {
                token: [ '' ],
                regex: ''
            }
        ]
    };

    constructor() {
    }
}
