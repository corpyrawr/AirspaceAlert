export interface IRule {
    type: string;
    expression: string;
}

export class Rule {
    rule: IRule;

    constructor(rule: IRule) {
        this.rule = rule;
    }

    // Function to evaluate the expression safely
    evaluateExpression(data:{} = {}): boolean {
        const func = new Function('aircraft', `return ${this.rule.expression}`);
        return func(data);
    }
}

export class Rules {
    private rules: Rule[];

    constructor() {
        this.rules = [];
    }

    addRule(iRule: IRule) {
        this.rules.push(new Rule(iRule));
    }

    evaluateAllExpressions(data:{} = {}): boolean {
        let result = true;

        this.rules.forEach((rule: Rule) => {
            if (rule.rule.type == 'eval' && result == true) {
                result = rule.evaluateExpression(data)
            } else {
                return false
            }
        })

        return result
    }
}