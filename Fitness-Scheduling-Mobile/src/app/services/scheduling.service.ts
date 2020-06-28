import { Injectable } from "@angular/core";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Appointment, Place } from "../models/appointment";
import { getString } from "tns-core-modules/application-settings";
import { SchedulingAppointment } from "../models/SchedulingAppointment";
import { AccountTypes } from "./user.service";

@Injectable({
    providedIn: "root",
})
export class SchedulingService {
    // place ve user global bir service'te duracak.

    url : string = "https://e3641f61ec20.ngrok.io/api/default/";

    token = getString("token");
    id = getString("id"); // place veya user id
    accountType = getString("accountType");

    // clearHistory'e bak. Login yaptıktan sonra geri dönme olmasın.
    reqHeaders = new HttpHeaders({
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${this.token}`
    });

    constructor(private http: HttpClient) {}

    getAppointmentsData(count: number){
        let userId = getString("id", null);

        let httpParams = new HttpParams()
        .set("userId", userId)
        .set("count", count.toString());

        return this.http.get<Appointment[]>(this.url + 'appointments', {headers: this.reqHeaders, params: httpParams});
    }
    getSchedulingAppointmentData(){
        let id = getString("id", null);
        let isAccountTypeUser = getString("accountType", null) === AccountTypes.user ? true : false;

        let httpParams = new HttpParams()
        .set("id", id)
        .set("isAccountTypeUser", isAccountTypeUser.toString());

        return this.http.get<SchedulingAppointment[]>(this.url + 'schedulingAppointments', {headers: this.reqHeaders, params: httpParams});

    }
    getPlaceData(){
        let id = getString("id");

        let httpParams  = new HttpParams()
        .set("placeId", id);

        return this.http.get<Place>(this.url + 'place', {headers: this.reqHeaders, params: httpParams});
    }
    getPlaceDataByUserId(){
        let userId = getString("id", null);

        let httpParams  = new HttpParams()
        .set("userId", userId);

        return this.http.get<Place>(this.url + "PlaceByUser", {headers: this.reqHeaders, params: httpParams});
    }
}
