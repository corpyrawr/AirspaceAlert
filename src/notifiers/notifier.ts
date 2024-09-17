export interface INotifier {
    name: string,
    type: string
}

export interface Notifier extends INotifier {
    // Info
    sendMessage(data: {message:string}): Promise<void>;
}