//import { loggers, Logger, transports, format } from "winston";

import { Config } from './utils/config';
import { Tar1090 } from './data-sources/tar1090';
import { Radar } from './radar';
import { ITelegramNotifier, TelegramNotifier } from './notifiers/telegram';
import { Logger } from './utils/logger'
import { Rule, IRule, Rules } from './utils/rules';
import { ITemplate, Templater } from './utils/templater';
import { INotifier, Notifier } from './notifiers/notifier';
import { ITriggerNotifier } from './utils/triggers';

export class EventMonitor {
  private config: Config;
  private refreshInterval: number;
  private tar1090: Tar1090;
  private radar: Radar;
  private isFirstIteration: Boolean;
  private logger: Logger;

  constructor(config: Config, logger: Logger) {
    this.config = config;
    this.logger = logger;

    this.tar1090 = new Tar1090(this.config.data_source.base, this.logger);
    this.radar = new Radar(this.config.forget_after_intervals, this.logger);

    this.refreshInterval = this.config.refresh_interval;
    this.isFirstIteration = true;
  }

  // Function to evaluate the expression safely
  evaluateExpression(data: any, expression: string): boolean {
    const func = new Function('aircraft', `return ${expression}`);
    return func(data);
  }

  async monitorEvents() {
    // update radar
    const aircraftData = await this.tar1090.fetchAircraftData();
    this.radar.updateRadar(aircraftData.aircraft)

    // skip checking triggers if this is the first run
    if (this.isFirstIteration) {
      this.isFirstIteration = false;
      return;
    }

    // for each aircraft from radar
    this.radar.getActiveAircraft().forEach(aircraft => {
      // for each trigger
      this.config.triggers.forEach((trigger) => {
        let result = true;

        // Rules
        const rules = new Rules();
        trigger.rules.forEach((rule: IRule, index: number) => {
          rules.addRule({type: rule.type, expression: rule.expression});
        })

        result = rules.evaluateAllExpressions(aircraft)
        // return if expressions evaluate to false
        if (result === false) return;
        
        // for each notifier
        trigger.notifiers.forEach((triggerNotifier: ITriggerNotifier ) => {
          const template:ITemplate = this.config.templates.find((tp) => tp.name == triggerNotifier.template) as ITemplate
          let templater = new Templater(template.name, template.format);

          const message = templater.process({aircraft});

          this.logger.info(`template: ${templater.name} data: ${message}`, "event");
          let notifier: Notifier = {} as Notifier
          
          const inotifier:INotifier = this.config.notifiers.find((n) => n.name == triggerNotifier.name) as INotifier;
          switch(inotifier.type) {
            case "telegram":
              notifier = new TelegramNotifier(inotifier as ITelegramNotifier, this.logger)
          }
          //const notifier = new TelegramNotifier(inotifier);
          notifier?.sendMessage({message: message})
        })
      });

    });
  }

  getRefreshInterval(): number {
    return this.refreshInterval * 1000; // Convert seconds to milliseconds
  }
}
