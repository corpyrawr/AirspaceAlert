import YAML from 'yamljs';
import { join } from 'path';

export interface IConfig {
    log_level: string;
    forget_after_intervals: number;
    refresh_interval: number;
    data_source: IConfig_DataSource;
    notifiers: IConfig_Notifier[];
    templates: IConfig_Template[];
    triggers: IConfig_Trigger[];
}

export interface IConfig_DataSource {
    type: string,
    base: string,
}

export interface IConfig_Notifier {
    name: string,
    type: string
}

export interface IConfig_Template {
    name: string,
    format: string
}

 export interface IConfig_Trigger {
    name: string,
    rules: IConfig_TriggerRule[],
    notifiers: IConfig_TriggerNotifier[],
 }

 export interface IConfig_TriggerRule {
    type: string;
 }
 export interface IConfig_TriggerRule_Eval extends IConfig_TriggerRule {
    expression: string;
 }

 export interface IConfig_TriggerNotifier {
    name: string,
    template: string,
 }

 export function loadConfig(): IConfig {
   const configPath = join(__dirname, '../../config/', 'config.yaml');
   return YAML.load(configPath);
 }