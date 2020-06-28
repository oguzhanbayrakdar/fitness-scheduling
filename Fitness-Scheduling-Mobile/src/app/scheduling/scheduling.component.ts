import {
    Component,
    OnInit,
    Injectable,
    ViewChild,
    ViewContainerRef,
    OnDestroy,
} from "@angular/core";
import {
    CalendarEvent,
    RadCalendar,
    CalendarSelectionEventData,
    CalendarCellTapEventData,
} from "nativescript-ui-calendar";
import { Color } from "tns-core-modules/color/color";
import { CalendarEventsService } from "../services/calendarevent.service";
import {
    ModalDialogOptions,
    ModalDialogService,
} from "nativescript-angular/modal-dialog";
import { AddDateComponent } from "./add-date/add-date.component";
import { SchedulingService } from "../services/scheduling.service";
import { Appointment, Place } from "../models/appointment";
import { SchedulingAppointment } from "../models/SchedulingAppointment";
import { getString } from "tns-core-modules/application-settings";
import { AccountTypes } from "../services/user.service";
import { Subscription } from "rxjs";
@Component({
    selector: "ns-scheduling",
    templateUrl: "./scheduling.component.html",
    styleUrls: ["./scheduling.component.css"]
})
export class SchedulingComponent implements OnInit, OnDestroy {
    private _events: Array<CalendarEvent>;
    private _listItems: Array<CalendarEvent>;
    private change: boolean = false;
    subscriptions: Array<Subscription> = new Array<Subscription>();

    viewMode: string = "Day";
    eventColors: any;
    monthViewStyle: any;
    monthNamesViewStyle: any;
    weekViewStyle: any;
    yearViewStyle: any;
    dayViewStyle: any;

    appointments: Appointment[];
    schedulingAppointments : SchedulingAppointment[];

    isAccountTypeUser: boolean;

    constructor(
        private _calendarService: CalendarEventsService,
        private _modalDialogService: ModalDialogService,
        private _vcRef: ViewContainerRef,
        private schedulingService: SchedulingService
    ) {
    }
    ngOnDestroy(): void {
        this.subscriptions.forEach(element => {
            element.unsubscribe();
        });
    }

    get eventSource() {
        return this._events;
    }

    get myItems(): Array<CalendarEvent> {
        return this._listItems;
    }

    set myItems(value) {
        this._listItems = value;
    }
    ngOnInit() {
        this.isAccountTypeUser = getString("accountType", null) === AccountTypes.user ? true : false;

        this.monthViewStyle = this._calendarService.getMonthViewStyle();
        this.monthNamesViewStyle = this._calendarService.getMonthNamesViewStyle();
        this.weekViewStyle = this._calendarService.getWeekViewStyle();
        this.yearViewStyle = this._calendarService.getYearViewStyle();
        this.dayViewStyle = this._calendarService.getDayViewStyle();

        // this._events = this._calendarService.getCalendarEvents();
        // this._events = this._calendarService.getCalEvent();

        this.subscriptions.push(this.schedulingService
            .getSchedulingAppointmentData()
            .subscribe((c) => {
                this.schedulingAppointments = c;

                this._events = c.map((x) => {
                    let event = new CalendarEvent(
                        x.count + " People",
                        new Date(x.startDate),
                        new Date(x.endDate),
                        false
                    );
                    return event;
                },(err) => {
                    alert("An Error Occurred While Fetching Data. Please check your internet connection.");
                });
            }));
    }

    openAddDateModal() {
        const options: ModalDialogOptions = {
            viewContainerRef: this._vcRef,
            animated: true,
            stretched: true,
            cancelable: false,
            fullscreen: true,
        };

        this._modalDialogService
            .showModal(AddDateComponent, options)
            .then
            //
            ();
    }

    onDateSelected(args: CalendarSelectionEventData) {
        console.log(args.date);
        const calendar: RadCalendar = args.object;
        const date: Date = args.date;
        const events: Array<CalendarEvent> = calendar.getEventsForDate(date);
        this.myItems = events;
    }
    onChange() {
        this.change ? (this.change = false) : (this.change = true);
        this.change ? (this.viewMode = "Day") : (this.viewMode = "Month");
    }
}
