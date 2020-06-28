import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { VerificateUserGymComponent } from "./verificate-user-gym.component";
const routes: Routes = [
    {
        path: "",
        redirectTo: "vug",
        pathMatch: "full"
    },
    {
        path: "vug",
        component: VerificateUserGymComponent
    }
];
@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class VerificateUserGymRoutingModule {}
