import { INotifier } from "../notifiers/notifier";
import { IRule } from "./rules";

export interface ITriggerNotifier {
    type: string,
    template: string
}

export interface ITrigger {
    name: string,
    rules: IRule[],
    notifiers: ITriggerNotifier[]
}