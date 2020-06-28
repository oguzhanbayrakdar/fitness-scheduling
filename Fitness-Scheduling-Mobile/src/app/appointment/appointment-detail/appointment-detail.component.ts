import { Component, OnInit } from "@angular/core";
import { ModalDialogParams } from "nativescript-angular/common";
import { Appointment } from "~/app/models/appointment";

@Component({
    selector: "ns-appointment-detail",
    templateUrl: "./appointment-detail.component.html",
    styleUrls: ["./appointment-detail.component.css"],
})
export class AppointmentDetailComponent implements OnInit {
    appointment: Appointment;
    constructor(private modalDialogParams: ModalDialogParams) {}
    today = new Date();
    ngOnInit() {
        this.appointment = this.modalDialogParams.context.data;
    }
    closeModal(){
        this.modalDialogParams.closeCallback();
    }
    iconColorChanger(date){
        let d = new Date(date).getTime();

        let result = d >= this.today.getTime();

        return result ? '#228B22' : 'red';
    }
    isEndTimeGreaterThanToday(date){
        let d = new Date(date).getTime();

        return d >= this.today.getTime();

    }

}
