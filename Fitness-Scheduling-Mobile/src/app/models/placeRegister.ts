import { Owner } from "./appointment";

export class PlaceRegister {
    name: string;
    address: string;
    description: string;
    openingTime: Date;
    closingTime: Date;
    owner: Owner = new Owner(); // [name, lastName, email] içerir.
    password: string;
    confirmPassword: string;
    offDays: Array<number>;

}
