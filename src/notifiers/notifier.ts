export interface INotifier {
    type: string,
    chat_id: string,
    message_thread_id: string,
    api_key: string
}

export interface Notifier extends INotifier {
    // Info
    sendMessage(data: {message:string}): Promise<void>;
}