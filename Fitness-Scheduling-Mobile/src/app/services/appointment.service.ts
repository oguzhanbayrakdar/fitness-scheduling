import { Injectable } from "@angular/core";
import { Appointment } from "../models/appointment";
import { HttpClient, HttpHeaders, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpParams } from "@angular/common/http";
import { getString } from "tns-core-modules/application-settings/application-settings";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class AppointmentService {

    url = "https://e3641f61ec20.ngrok.io/api/appointment/";

    token = getString("token");
    id = getString("id"); // place veya user id
    accountType = getString("accountType");

    // clearHistory'e bak. Login yaptıktan sonra geri dönme olmasın.
    reqHeaders = new HttpHeaders({
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${this.token}`
    });

    constructor(private http: HttpClient) { }

    addAppointment(appointment: Appointment) {
        let id = getString("id", null);

        let httpParams = new HttpParams().set("userId", id);

        return this.http.post<Appointment>(this.url + "addappointment", appointment, {headers: this.reqHeaders, params: httpParams});
    }

    getAppointmentsByPlace(placeId: string): Observable<Array<Appointment>> {
        const params = new HttpParams().set("placeId", placeId);

        return this.http.get<Array<Appointment>>(this.url  + "byplace", {headers: this.reqHeaders, params});
    }

    getAppointmentsByUser(userId: string): Observable<Array<Appointment>> {
        const params = new HttpParams().set("userId", this.id)
        console.log("qeweqweqwe")
        return this.http.get<Array<Appointment>>(this.url + "byuser", {headers: this.reqHeaders, params});
    }

    confirmOrRejectAppointment(appointmentId: string, status: boolean){

        let data = {
            appointmentId,
            status
        }

        return this.http.post<Appointment>(this.url + 'RejectOrConfirmAppointment', data, {headers: this.reqHeaders});
    }

}
