import { Component, OnInit, OnDestroy } from '@angular/core';
import { Appointment } from '~/app/models/appointment';
import { ModalDialogParams } from "nativescript-angular/common";
import { AppointmentService } from '~/app/services/appointment.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ns-business-appointment-detail',
  templateUrl: './business-appointment-detail.component.html',
  styleUrls: ['./business-appointment-detail.component.css']
})
export class BusinessAppointmentDetailComponent implements OnInit, OnDestroy {

    appointment: Appointment;
    isBusy = false;
    today = new Date();
        subscriptions: Array<Subscription> = new Array<Subscription>();

    constructor(private modalDialogParams: ModalDialogParams, private appointmentService: AppointmentService) {}
    ngOnDestroy(): void {
        this.subscriptions.forEach(element => {
            element.unsubscribe();
        });
    }

    ngOnInit() {
        this.appointment = this.modalDialogParams.context.data;
    }
    closeModal(){
        this.modalDialogParams.closeCallback();
    }
    confirmOrRejectAppointment(status: boolean){
        this.isBusy = true;
        this.subscriptions.push(this.appointmentService.confirmOrRejectAppointment(this.appointment.id, status).subscribe((a: Appointment)=>{
            let id = a.id;
            let isApproved = a.isApproved;
            this.isBusy = false;
            let data = {
                id,
                isApproved
            }
            this.modalDialogParams.closeCallback(data);

        }, (err) => {
            this.isBusy = false;
        }));
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
