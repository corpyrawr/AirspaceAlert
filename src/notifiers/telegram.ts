import axios from 'axios';
import { INotifier } from './notifiers';
import { Logger } from '../utils/logger';

export interface ITelegramNotifier extends INotifier {
  chat_id: string
  message_thread_id?: string
  api_key: string
}

export class TelegramNotifier implements ITelegramNotifier {
  name: string
  type: string
  chat_id: string
  message_thread_id?: string
  api_key: string
  private logger: Logger;

  constructor(data: ITelegramNotifier, logger: Logger) {
    this.name = data.name
    this.type = data.type;
    this.api_key = data.api_key;
    this.chat_id = data.chat_id;
    this.message_thread_id = data.message_thread_id;
    this.logger = logger;
  }

  // Method to send a notification message
  async sendMessage(data: {message:string}): Promise<void> {
    const url = `https://api.telegram.org/bot${this.api_key}/sendMessage`;

    try {
      if (this.message_thread_id) {
        const response = await axios.post(url, {
          chat_id: this.chat_id,
          message_thread_id: this.message_thread_id,
          text: data.message,
        });
        console.info(`Telegram message sent: ${response.data.ok} msg: ${data.message.substring(0,25)}...`, 'telegram-notifier');
      } else {
        const response = await axios.post(url, {
          chat_id: this.chat_id,
          text: data.message,
        });
        this.logger.info(`Telegram message sent: ${response.data.ok} msg: ${data.message.substring(0,25)}...`, 'telegram-notifier');
      }
    } catch (error) {
      this.logger.error(`Error sending message to Telegram: ${error} msg: ${data.message.substring(0,25)}...`, 'telegram-notifier');
    }
  }
}