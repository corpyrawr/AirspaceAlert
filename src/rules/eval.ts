import { IRule, Rule, IRuleResult } from "./rules";

export interface IRuleEval extends IRule {
    expression: string;
}

export class RuleEval extends Rule implements IRuleEval {
    type: string;
    expression: string;

    constructor(ruledata: IRuleEval) {
        super(ruledata);
        this.type = ruledata.type;
        this.expression = ruledata.expression;
    }

    evaluate(data:{} = {}): IRuleResult {
        const func = new Function(...Object.keys(data), `return ${this.expression};`);
        const result = func(...Object.values(data));
        return {rule: this, result: result} as IRuleResult;
    }
}