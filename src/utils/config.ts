import YAML from 'yamljs';
import { join } from 'path';
import { ITemplate } from './templater';
import { IDataSource } from '../data-sources/datasource';
import { ITrigger } from './triggers';
import { INotifier } from '../notifiers/notifier';

export interface Config {
  log_level: string;
  forget_after_intervals: number;
  refresh_interval: number;
  data_source: IDataSource;
  notifiers: INotifier[];
  templates: ITemplate[];
  triggers: ITrigger[];
}

export function loadConfig(): Config {
  const configPath = join(__dirname, '../../config/', 'config.yaml');
  return YAML.load(configPath);
}