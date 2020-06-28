export class Appointment{
    id: string;
    startDate: Date;
    endDate: Date;
    applicationDate: Date;
    isApproved: boolean;
    isActive: boolean;
    place: Place;
    user: User;
    noteToOwner: string;
    ownersNote: string;
    fullName: string;
}
export class Place{
    id: string;
    name: string;
    address: string;
    openingTime:Date;
    closingTime:Date;
    isFullOpen:boolean;
    offDays:string;
    users:User[];
    appointments: Appointment[];
    announcements: Announcement[];
    owner: Owner;
    registrationDate:Date;
    maxAppointmentTime:Date;
    weeklyAppointmentLimit: number;
    description: string;
    verificationCode: string;
}
export class User{
    id:string;
    name:string;
    lastName:string;
    currentAppointmentCount:number;
    anonymousName:string;
    place:Place;
    appointments:Appointment[];
    registrationDate:Date;
    eMail: string;
    gender:number;//0 Woman/1 Man/2 Other
    isUserVerificated: boolean;
}
export class Announcement{
    id:string;
    text:string;
    date:Date;
    place:Place;
    isRead:boolean;
}
export class Owner{
    id:string;
    name:string;
    lastName:string;
    eMail: string;
    place:Place;
}
