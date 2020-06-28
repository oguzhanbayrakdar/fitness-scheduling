import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { SchedulingComponent } from "./scheduling.component";
import { AddDateComponent } from "./add-date/add-date.component";
const routes: Routes = [
    {
        path: "",
        redirectTo: "scheduling"
    },
    {
        path: "",
        component: SchedulingComponent,
        children: [
            {
                path: "add-date",
                component: AddDateComponent
            }
        ]
    }
];
@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class SchedulingRoutingModule {}
