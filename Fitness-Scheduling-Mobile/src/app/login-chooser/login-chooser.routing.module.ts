import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { LoginChooserComponent } from "./login-chooser.component";
import { BusinessComponent } from "./business/business.component";
const routes: Routes = [
    {
        path: "",
        component: LoginChooserComponent
    },
    {
        path: "login",
        component: LoginComponent
    },
    { path: "business", component: BusinessComponent }
];
@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class LoginRoutingModule {}
