import axios from 'axios';
import { Notifier } from './notifier';

export class TelegramNotifier implements Notifier {
  type: string
  chat_id: string
  message_thread_id: string
  api_key: string

  constructor(api_key: string, chat_id: string, message_thread_id: string) {
    this.type = "telegram";
    this.api_key = api_key;
    this.chat_id = chat_id;
    this.message_thread_id = message_thread_id;
  }

  // Method to send a notification message
  async sendMessage(data: {message:string}): Promise<void> {
    const url = `https://api.telegram.org/bot${this.api_key}/sendMessage`;

    try {
      const response = await axios.post(url, {
        chat_id: this.chat_id,
        message_thread_id: this.message_thread_id,
        text: data.message,
      });
      console.log(`Telegram message sent: ${response.data.ok}`);
    } catch (error) {
      console.error('Error sending message to Telegram:', error);
    }
  }
}