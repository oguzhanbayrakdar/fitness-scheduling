import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { confirm, alert } from "tns-core-modules/ui/dialogs";
import { SchedulingService } from "~/app/services/scheduling.service";
import { ModalDialogParams } from "nativescript-angular/common";
import { RadDataFormComponent } from "nativescript-ui-dataform/angular";
import { Place, Appointment } from "~/app/models/appointment";
import { AppointmentService } from "~/app/services/appointment.service";
import { Subscription } from "rxjs";
@Component({
    selector: "ns-add-date",
    templateUrl: "./add-date.component.html",
    styleUrls: ["./add-date.component.css"],
})
export class AddDateComponent implements OnInit, OnDestroy {
    place: Place;
    appointment: Appointment = new Appointment();
    subscriptions: Array<Subscription> = new Array<Subscription>();

    model: AddAppointmentViewModel = {
        date: new Date(),
        startTime : new Date(),
        endTime : new Date(),
        noteToOwner : ""
    };

    today = new Date();

    isFormValid = false;

    @ViewChild("appointmentForm", {static: false}) appointmentForm: RadDataFormComponent;

    constructor(private schedulingService: SchedulingService, private _modalParams: ModalDialogParams, private appointmentService: AppointmentService) {}

    ngOnDestroy(): void {
        this.subscriptions.forEach(element => {
            element.unsubscribe();
        });
    }

    ngOnInit() {
        this.subscriptions.push(this.schedulingService.getPlaceDataByUserId().subscribe((x) => {
            this.place = x;
            console.log(this.place);
        }));
    }

    closeForm(){
        this._modalParams.closeCallback();
    }

    submit() {
        this.isFormValid = this.validateForm();

        if (this.isFormValid) {
            this.appointmentForm.dataForm.validateAndCommitAll().then((result) => {
                if (result) {
                    console.log("form is ok.");
                    this.fillAppointmentModel();
                } else {
                    alert("An error occurred while making an appointment. Please try again later.");
                }
            });
        }
    }
    validateForm(){
        const date = this.appointmentForm.dataForm.getPropertyByName("date");
        const endTime = this.appointmentForm.dataForm.getPropertyByName("endTime");
        const startTime = this.appointmentForm.dataForm.getPropertyByName("startTime");

        let isAppointmentToday = this.compareDates(date.valueCandidate, this.today);
        let compareEndStartTime = this.compareDates(endTime.valueCandidate, startTime.valueCandidate);
        let compareOpeningStartTime = this.compareTimes(startTime.valueCandidate, this.place.openingTime);
        let compareClosingEndTime = this.compareTimes(this.place.closingTime, endTime.valueCandidate);

        if (!isAppointmentToday){
            date.errorMessage = "Appointment day cannot before today.";
            this.appointmentForm.dataForm.notifyValidated("date", false);

            return false;
        }
        if (!compareEndStartTime){
            endTime.errorMessage = "Appointment End Time cannot be before Start Time";
            this.appointmentForm.dataForm.notifyValidated("endTime", false);

            return false;
        }
        if (!compareClosingEndTime){

            endTime.errorMessage = `Appointment End Time  cannot be later Closing Time`;

            this.appointmentForm.dataForm.notifyValidated("endTime", false);

            return false;
        }
        if (!compareOpeningStartTime){

            startTime.errorMessage = `Appointment End Time cannot be before Opening Time`;

            this.appointmentForm.dataForm.notifyValidated("startTime", false);

            return false;
        }

        this.appointmentForm.dataForm.notifyValidated("date", true);
        this.appointmentForm.dataForm.notifyValidated("endTime", true);

        return true;
    }

    /**
     * If `date1` is greater than or equal to `date2` returns true, otherwise false.
     */
    compareDates(_date1: Date, _date2: Date) {
        let date1 = new Date(_date1);
        let date2 = new Date(_date2);
        console.log(date1);
        console.log(date2);

        return date1.getTime() >= date2.getTime();
    }

    /**
     * If `date1` is greater than or equal to `date2` returns true, otherwise false.
     */
    compareTimes(_date1: Date, _date2: Date){
        let date1 = new Date(_date1);
        let date2 = new Date(_date2);

        let newDate1 = new Date();
        let newDate2 = new Date();

        newDate1.setHours(date1.getHours());
        newDate1.setMinutes(date1.getMinutes());

        newDate2.setHours(date2.getHours());
        newDate2.setMinutes(date2.getMinutes());

        return newDate1.getTime() >= newDate2.getTime();
    }

    /**
     * Takes a `time` and a `date` (as date format) and changes the date's hours and minutes with time's.
     * @returns `Date`
     */
    getRealDate(_date: Date, _time: Date){
        let date = new Date(_date);
        let time = new Date(_time);

        date.setHours(time.getHours());
        date.setMinutes(time.getMinutes());

        return date;
    }

    /**
     * @return checks given date is in `offDays` or not.
     */
    checkIsOffDay(date: Date, offDays: string[]){
        // This will be active in the next update. lel
    }

    fillAppointmentModel() {
        const date = this.appointmentForm.dataForm.getPropertyByName("date");
        const endTime = this.appointmentForm.dataForm.getPropertyByName("endTime");
        const startTime = this.appointmentForm.dataForm.getPropertyByName("startTime");
        const noteToOwner = this.appointmentForm.dataForm.getPropertyByName("noteToOwner");

        this.appointment.applicationDate = new Date();

        this.appointment.endDate = this.getRealDate(date.valueCandidate, endTime.valueCandidate);
        this.appointment.startDate = this.getRealDate(date.valueCandidate, startTime.valueCandidate);

        this.appointment.noteToOwner = noteToOwner.valueCandidate;
        console.log(this.appointment);
        // console.log(this.appointment.applicationDate.toLocaleString());
        this.subscriptions.push(this.appointmentService.addAppointment(this.appointment).subscribe((c)=>{
            alert("Appointment request was successful.");
        },(err) => {
            alert("An error occurred while making an appointment request.");
        }));

    }
}
/*
Not ve tarih
*/
class AddAppointmentViewModel{
    date:Date;
    startTime:Date;
    endTime:Date;
    noteToOwner: string;

}
