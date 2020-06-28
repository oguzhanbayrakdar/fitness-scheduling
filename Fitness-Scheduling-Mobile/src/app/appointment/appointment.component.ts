import { Component, OnInit, ViewContainerRef, OnDestroy } from "@angular/core";
import { AppointmentService } from "../services/appointment.service";
import { Appointment } from "../models/appointment";
import {
    ModalDialogOptions,
    ModalDialogService,
} from "nativescript-angular/common";
import { AppointmentDetailComponent } from "./appointment-detail/appointment-detail.component";
import { getString } from "tns-core-modules/application-settings";
import { AccountTypes } from "../services/user.service";
import { BusinessAppointmentDetailComponent } from "./business-appointment-detail/business-appointment-detail.component";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import {
    ListViewLinearLayout,
    RadListView,
    LoadOnDemandListViewEventData,
    ListViewEventData,
} from "nativescript-ui-listview";
import { Subscription } from "rxjs";

@Component({
    selector: "ns-appointment",
    templateUrl: "./appointment.component.html",
    styleUrls: ["./appointment.component.css"],
})
export class AppointmentComponent implements OnInit, OnDestroy {
    appointments: Appointment[];
    userId: string;
    placeId: string;
    accountType: string;
    isAccountTypeUser: boolean;
    subscriptions: Array<Subscription> = new Array<Subscription>();
    today = new Date();

    loadingText = "Loading...";
    isLoadingError = false;
    constructor(
        private appointmentService: AppointmentService,
        private _vcRef: ViewContainerRef,
        private _dialog: ModalDialogService
    ) {}
    ngOnDestroy(): void {
        this.subscriptions.forEach((element) => {
            element.unsubscribe();
            console.log("unsubcribe");
        });
    }

    ngOnInit() {
        this.accountType = getString("accountType", null);
        this.isAccountTypeUser =
            this.accountType === AccountTypes.user ? true : false;
        if (this.accountType === AccountTypes.user) {
            this.subscriptions.push(this.getUserAppointmentData());
        } else {
            this.subscriptions.push(this.getPlaceAppointmentData());
        }
    }

    onPullToRefreshInitiated(event: ListViewEventData) {
        console.log("refresh");
        if (this.accountType === AccountTypes.user) {
            this.userId = getString("id", null);
            const listView = event.object;
            this.subscriptions.push(this.appointmentService
                .getAppointmentsByUser(this.userId)
                .subscribe(
                    (c: Array<Appointment>) => {
                        console.log("lel");
                        this.appointments = c;
                        if(this.appointments.length === 0){
                            console.log("lel 2");
                            this.loadingText = "0 Appointments.";
                        }

                    },
                    (err) => {
                        this.loadingText =
                        "0 Appointments.";
                        this.isLoadingError = true;
                        console.log("başarısız");

                    },
                    () => {
                        console.log("tamamlandı.");
                        listView.notifyPullToRefreshFinished();
                    }
                ));
        } else {
            this.placeId = getString("id", null);
            const listView = event.object;

            this.subscriptions.push(this.appointmentService
                .getAppointmentsByPlace(this.placeId)
                .subscribe(
                    (x) => {
                        this.appointments = x;
                        if (this.appointments.length === 0) {
                            this.loadingText = "0 Appointments.";
                        }
                    },
                    (err) => {
                        this.loadingText =
                            "0 Appointments.";
                        this.isLoadingError = true;
                    },
                    () => {
                        listView.notifyPullToRefreshFinished();
                    }
                ));
        }
    }

    detailOfAppointment(appointment: Appointment) {
        const options: ModalDialogOptions = {
            viewContainerRef: this._vcRef,
            context: {
                data: appointment,
            },
            animated: true,
            stretched: true,
            cancelable: true,
        };
        this._dialog
            .showModal(AppointmentDetailComponent, options)
            .then((result) => {});
    }

    detailOfAppointmentForPlace(appointment: Appointment) {
        const options: ModalDialogOptions = {
            viewContainerRef: this._vcRef,
            context: {
                data: appointment,
            },
            animated: true,
            stretched: true,
            cancelable: true,
        };
        this._dialog
            .showModal(BusinessAppointmentDetailComponent, options)
            .then((result) => {
                if (result) {
                    this.appointments.find(
                        (c) => c.id === result.id
                    ).isApproved = result.isApproved;
                }
            });
    }

    getUserAppointmentData() {
        this.userId = getString("id", null);
        return this.appointmentService.getAppointmentsByUser(this.userId).subscribe(
            (c: Array<Appointment>) => {
                this.appointments = c;
                if(this.appointments.length === 0){
                    this.loadingText = "0 Appointments."
                }
            },
            (err) => {
                this.loadingText =
                    "0 Appointments.";
                this.isLoadingError = true;
            }
        );
    }
    getPlaceAppointmentData() {
        this.placeId = getString("id", null);
        return this.appointmentService.getAppointmentsByPlace(this.placeId).subscribe(
            (x) => {
                this.appointments = x;
                if(this.appointments.length === 0){
                    this.loadingText = "0 Appointments."
                }
            },
            (err) => {
                this.loadingText =
                    "0 Appointments.";
                this.isLoadingError = true;
            }
        );
    }
    getTimeAsNumber(date: Date) {
        return new Date(date).getTime();
    }
    iconColorChanger(date){
        let d = this.getTimeAsNumber(date);

        let result = d >= this.today.getTime();

        return result ? '#228B22' : 'red';
    }
}
