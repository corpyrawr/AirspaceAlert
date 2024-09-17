import { Tar1090 } from './data-sources/tar1090';
import { ITelegramNotifier, TelegramNotifier } from './notifiers/telegram';
import { IWebhookNotifier, WebhookNotifier } from './notifiers/webhook';
import { Radar } from './radar';
import { IRuleEval, RuleEval } from './rules/eval';
import { Rule } from './rules/rules';
import { ITriggerNotifier, ITriggerResults, Trigger } from './triggers';
import { IConfig, IConfig_Notifier, IConfig_Template } from './utils/config';
import { Logger } from './utils/logger'
import { Template } from './utils/templates';

export class EventMonitor {
  private config: IConfig;
  private logger: Logger;
  private radar: Radar;
  private tar1090: Tar1090;
  private iterationCount: number;
  private triggers: Trigger[];

  constructor(config: IConfig, logger: Logger) {
    this.config = config;
    this.logger = logger;

    this.tar1090 = new Tar1090(config.data_source.base, logger);
    this.radar = new Radar(config.forget_after_intervals, logger);

    this.triggers = [];

    this.iterationCount = 0;

    this.setupTriggers();
  }

  private setupTriggers() {
    this.config.triggers.forEach(conftrig => {
      const trigRules: Rule[] = [];
      const trigNoti: ITriggerNotifier[] = [];

      conftrig.rules.forEach(rule => {
        switch (rule.type) {
          case 'eval':
            trigRules.push(new RuleEval(rule as IRuleEval))
            break;
          default:
            break;
        }
      })

      conftrig.notifiers.forEach(noti => {
        const notiName = noti.name
        const notiNotifier = this.config.notifiers.find(n => n.name == noti.name) as IConfig_Notifier

        const notiTemplate = this.config.templates.find(t => t.name == noti.template) as IConfig_Template
        let newTemplate = new Template(notiTemplate.name, notiTemplate.format)
        
        switch (notiNotifier.type) {
          case 'telegram':
            let newTeliNotifier = new TelegramNotifier(notiNotifier as ITelegramNotifier, this.logger)
            trigNoti.push({
              notifier: newTeliNotifier,
              template: newTemplate
            } as ITriggerNotifier)
            break;
          case 'webhook':
            let newWebhookNotifier = new WebhookNotifier(notiNotifier as IWebhookNotifier, this.logger)
            trigNoti.push({
              notifier: newWebhookNotifier,
              template: newTemplate
            } as ITriggerNotifier)
            break;
          default:
            break;
        }
      })

      const newtrigger = new Trigger({
        name: conftrig.name,
        rules: trigRules,
        notifiers: trigNoti,
      })
      this.logger.debug(`Created Trigger: ${conftrig.name}, Rules: ${trigRules.length}, Notifiers: ${trigNoti.length}`,"event-monitor")
      this.triggers.push(newtrigger)
    })
  }

  async monitorEvents() {
    // update radar
    const aircraftData = await this.tar1090.fetchAircraftData();
    this.radar.updateRadar(aircraftData.aircraft);

    // skip checking triggers if this is the first run
    if (this.iterationCount == 0) { this.iterationCount++; return; };

    // loop through each aircraft
    this.radar.getActiveAircraft().forEach(aircraft => {
      // run each trigger against aircraft
      this.triggers.forEach( trigger => {
        // evaluate rules
        const triggerResults: ITriggerResults = trigger.evaluate({aircraft});
        if( triggerResults.results == true ) {
          trigger.notifiers.forEach(notifier => {
            // process message template
            let msg = notifier.template.process({aircraft})

            // Notify
            this.logger.info(`New EVENT - ${trigger.name} - ${aircraft.hex} ${aircraft.r} ${aircraft.t}`, "event-monitor")
            notifier.notifier.sendMessage({message: msg, data: {aircraft}})
          })
        }
      })
    })

    this.iterationCount++;
  }
}
