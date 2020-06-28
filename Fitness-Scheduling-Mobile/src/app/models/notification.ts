export interface INotification{
    id: number;
    message: string;
    image: string
    type: NotificationType;
    isRead: boolean;

}
export enum NotificationType{
    Advice,
    Achievements,
    Warnings
}
