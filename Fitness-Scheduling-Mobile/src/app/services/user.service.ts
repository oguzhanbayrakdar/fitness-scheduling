import { Injectable } from "@angular/core";
import { User, Place, Owner } from "../models/appointment";
import { UserLogin } from "../models/userLogin";
import { PlaceLogin } from "../models/placeLogin";
import { PlaceRegister } from "../models/placeRegister";
import { UserRegister } from "../models/userRegister";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import {
    getBoolean,
    setBoolean,
    getNumber,
    setNumber,
    getString,
    setString,
    hasKey,
    remove,
    clear
} from "tns-core-modules/application-settings";
import { FormUser, FormPlace } from "../settings/settings.component";

@Injectable()
export class UserService {
    url = "https://e3641f61ec20.ngrok.io/api/user/";
    // TODO: ErrorHandler yaz.
    genders = ["Male", "Female", "Other"];

    token = getString("token");
    id = getString("id"); // place veya user id
    accountType = getString("accountType");

    // clearHistory'e bak. Login yaptıktan sonra geri dönme olmasın.
    reqHeaders = new HttpHeaders({
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${this.token}`
    });

    constructor(private http: HttpClient) {}

    logOut(){
        setString("id", null);
        setString("token", null);
        setString("accountType", null);
        setBoolean("isUserVerificated", false);
    }
    // User Beginning
    userRegister(userRegister: UserRegister) {
        console.log(userRegister);

        return this.http.post(this.url + "RegisterUser", userRegister);
    }

    userLogin(userLogin: UserLogin) {
        const user = new UserLogin();
        user.eMail = userLogin.eMail;
        user.password = userLogin.password;

        return this.http.post(this.url + "LoginUser", user)
    }

    userUpdate(formUser: FormUser) {
        let user = new User();

        user.id = getString("id");

        user.eMail    = formUser.email;
        user.gender   = this.genders.findIndex((c) => c === formUser.gender.trim());
        user.name     = formUser.name.trim();
        user.lastName = formUser.lastName.trim();
        console.log(user);

        return this.http.post<User>(this.url + "UpdateUser", user,{headers: this.reqHeaders});
    }

    changeUserPassword(password: string, oldPassword: string){
        let id = getString("id", null);
        let data = {
            "userId": id,
            "password": password,
            "oldPassword": oldPassword
        }
        return this.http.post(this.url + "changeuserpassword", data, {headers: this.reqHeaders});
    }

    getUser(userId: string) {
        let params = new HttpParams().set("userId", userId);

        return this.http.get<User>(this.url + "getuserbyid", {params, headers: this.reqHeaders});
    }

    verificateUser(code: string){
        let userId = getString("id", null);
        let data = {
            userId,
            code
        }
        return this.http.post<User>(this.url + "verificateUser", data);
    }

    checkUsersPasswordIsCorrect(p: string) {
        // id ile bulunan kullanıcının olup olmadığına bakar. Varsa true, yoksa false döndürür.
        let id  = getString("id", null);

        let data = {
            p,
            id
        }
        console.log(data);
        return this.http.post(this.url + 'checkUsersPasswordIsCorrect', data,{headers: this.reqHeaders});
    }
    // User End

    forgotPassword(email: string) {
        console.log(email);
        this.http.post(this.url + "ForgotPass", email).subscribe();
    }

    // Place Beginning
    placeLogin(placeLogin: PlaceLogin) {
        const pl = new PlaceLogin();
        pl.password = placeLogin.password;
        pl.eMail = placeLogin.eMail;

        return this.http.post(this.url + "LoginBusiness", pl);
    }

    placeRegister(placeRegister: PlaceRegister) {
        console.log(placeRegister);

        return this.http.post(this.url + "RegisterBusiness", placeRegister);
    }

    placeUpdate(formPlace: FormPlace) {
        // tslint:disable-next-line: prefer-const
        let place = new Place();

        place.address = formPlace.address.trim();
        place.name = formPlace.name.trim();

        place.openingTime = formPlace.openingTime;

        place.closingTime = formPlace.closingTime;

        // place.isFullOpen = formPlace.isFullOpen;
        place.description = formPlace.description.trim();
        place.owner = new Owner();
        place.owner.id = getString("id");
        place.owner.name = formPlace.ownerName.trim();
        place.owner.lastName = formPlace.ownerLastName.trim();
        // place.offDays = formPlace.offDays.join(",");

        place.owner.eMail = formPlace.email;


        return this.http.post<Place>(this.url + "UpdatePlace", place, {headers: this.reqHeaders})
    }

    changePlacePassword(password: string, oldPassword: string){
        let id = getString("id", null);

        let data = {
            "ownerId": id,
            "password": password,
            "oldPassword": oldPassword
        }
        console.log(data);
        return this.http.post(this.url + "changebusinesspassword", data, {headers: this.reqHeaders});
    }

    getPlace(placeId: string){
        let params = new HttpParams().set("ownerId", placeId);

        return this.http.get<Place>(this.url + "getplacebyid", {headers: this.reqHeaders, params});
    }
    checkPlacesPasswordIsCorrect(p: string) {
        // id ile bulunan kullanıcının olup olmadığına bakar. Varsa true, yoksa false döndürür.
        let id  = getString("id", null);

        let data = {
            p,
            id
        }
        console.log(data);
        return this.http.post(this.url + 'checkPlacesPasswordIsCorrect', data, {headers: this.reqHeaders});
    }

    // Place End


}
export enum AccountTypes {
    user = "User",
    business = "Business"
}
export function setAccountInfos(accountType: AccountTypes, eMail: string, password: string, token: string, id?: string, isUserVerificated?:boolean) {

    if (!token) {
        return ;
    }
    setString("token", token);
    console.log("token: " + getString("token"));

    setString("accountType", accountType);
    console.log("accountType: " + getString("accountType"));

    setString("id", id);
    console.log("id: " + getString("id"));
    console.log("service : " + isUserVerificated)
    setBoolean("isUserVerificated", isUserVerificated);
    console.log("isUserVerificated: " + getBoolean("isUserVerificated"));
    // setString("email", eMail);
    // console.log("email: " + getString("email"));

    // setString("password", password);
    // console.log("password: " + getString("password"));
}
