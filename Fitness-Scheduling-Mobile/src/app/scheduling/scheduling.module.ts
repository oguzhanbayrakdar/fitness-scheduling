import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { SchedulingComponent } from "./scheduling.component";
import { SchedulingRoutingModule } from "./scheduling.routing.module";
import { NativeScriptUICalendarModule } from "nativescript-ui-calendar/angular";
import { NgRippleModule } from "nativescript-ng-ripple/angular/ng-ripple.module";
import { AddDateComponent } from "./add-date/add-date.component";
import { SchedulingService } from "../services/scheduling.service";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { NativeScriptUIDataFormModule } from "nativescript-ui-dataform/angular";
import { CalendarEventsService } from "../services/calendarevent.service";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptHttpClientModule,
        NativeScriptUICalendarModule,
        NativeScriptRouterModule,
        NativeScriptFormsModule,
        SchedulingRoutingModule,
        NativeScriptUIDataFormModule,
        NgRippleModule
    ],
    declarations: [
        SchedulingComponent,
        AddDateComponent
    ],
    exports: [AddDateComponent],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    providers: [
        SchedulingService,
        CalendarEventsService
    ]
})
export class SchedulingModule {}
