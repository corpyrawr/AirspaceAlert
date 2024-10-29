import axios from 'axios';
import { INotifier } from './notifiers';
import { Logger } from '../utils/logger';

export interface IWebhookNotifier extends INotifier {
  url: string
  post?: string
}

export class WebhookNotifier implements IWebhookNotifier {
  name: string
  type: string
  url: string
  post?: string
  private logger: Logger;

  constructor(data: IWebhookNotifier, logger: Logger) {
    this.name = data.name;
    this.type = data.type;
    this.url = data.url;
    this.logger = logger;
  }

  // Method to send a notification message
  async sendMessage(data: {message:string, data:any}): Promise<void> {
    const processedurl = this.url.replace(/\$\{([^}]+)\}/g, (match, expression) => {
        try {
            const func = new Function(...Object.keys(data.data), `return ${expression};`);
            return func(...Object.values(data.data));
        } catch (error) {
            this.logger.error(`Error processing expression: ${expression} - ${error}`, 'webhook-notifier');
            return match; // Return the original expression if it fails to evaluate
        }
    });

    try {
        const response = await axios.post(processedurl)
        this.logger.info(`Webhook message msg: ${data.message.substring(0,25)}...`, 'webhook-notifier');
    } catch (error) {
        this.logger.error(`Error sending message to Webhook: ${error} msg: ${data.message.substring(0,25)}...`, 'webhook-notifier');
    }
  }
}