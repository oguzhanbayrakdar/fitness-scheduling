import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AppointmentComponent } from "./appointment.component";
import { AppointmentService } from "../services/appointment.service";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";
import { AppointmentRoutingModule } from "./appointment.routing.module";
import { NgRippleModule } from "nativescript-ng-ripple/angular/ng-ripple.module";
import { AppointmentDetailComponent } from "./appointment-detail/appointment-detail.component";
import { BusinessAppointmentDetailComponent } from "./business-appointment-detail/business-appointment-detail.component";
import { SharedModule } from "../shared/shared.module";
@NgModule({
  imports: [
    NativeScriptCommonModule,
    NativeScriptRouterModule,
    NativeScriptFormsModule,
    NativeScriptUIListViewModule,
    AppointmentRoutingModule,
    NgRippleModule,
    SharedModule
  ],
  declarations: [AppointmentComponent, AppointmentDetailComponent, BusinessAppointmentDetailComponent],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [AppointmentService],
  entryComponents:[AppointmentDetailComponent]
})
export class AppointmentModule { }
