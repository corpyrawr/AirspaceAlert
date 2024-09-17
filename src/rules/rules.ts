export interface IRule {
    type: string;
}

export interface IRuleResult {
    rule: IRule,
    result: boolean,
}

export class Rule implements IRule {
    type: string;

    constructor(ruledata: IRule) {
        this.type = ruledata.type;
    }

    evaluate(data:{} = {}): IRuleResult {
        return {rule: this, result: false} as IRuleResult;
    }
}