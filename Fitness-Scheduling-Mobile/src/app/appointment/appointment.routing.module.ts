import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { AppointmentComponent } from "./appointment.component";
import { AppointmentDetailComponent } from "./appointment-detail/appointment-detail.component";
import { BusinessAppointmentDetailComponent } from "./business-appointment-detail/business-appointment-detail.component";
const routes = [
    {path: "", redirectTo: "appointments"},
    {path: "appointments", component: AppointmentComponent},
    {path: "detail", component: AppointmentDetailComponent},
    {path: "businessdetail", component: BusinessAppointmentDetailComponent},
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppointmentRoutingModule {

}
