import { INotifier } from "../notifiers/notifier";
import { IRule } from "./rules";

export interface ITriggerNotifier {
    name: string,
    template: string
}

export interface ITrigger {
    name: string,
    rules: IRule[],
    notifiers: ITriggerNotifier[]
}