import { Rule, IRuleResult } from "./rules/rules";
import { Notifier } from "./notifiers/notifiers";
import { Template } from "./utils/templates";

export interface ITrigger {
    name: string,
    rules: Rule[],
    notifiers: ITriggerNotifier[],
}

export interface ITriggerNotifier {
    notifier: Notifier,
    template: Template,
};


export interface ITriggerResults {
    rules_results: IRuleResult[],
    results: boolean,
}

export class Trigger implements ITrigger {
    name: string;
    rules: Rule[];
    notifiers: ITriggerNotifier[];

    constructor(triggerconfig: ITrigger) {
        this.name = triggerconfig.name;
        this.rules = triggerconfig.rules;
        this.notifiers = triggerconfig.notifiers;
    }

    evaluate(data: {} = {}): ITriggerResults {
        let ruleResults: IRuleResult[] = [];
        this.rules.forEach(rule => {
            ruleResults.push(rule.evaluate(data));
        })

        let results: boolean = ruleResults.some(re => {
            return re.result == true;
        });
        return {rules_results: ruleResults, results: results};
    }

}