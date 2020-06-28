import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { LoginChooserComponent } from "./login-chooser/login-chooser.component";


const routes2: Routes = [
    { path: "", redirectTo: "/login-chooser", pathMatch: "full" },
    {
        path: "login-chooser",
        loadChildren: () =>
            import("~/app/login-chooser/login-chooser.module").then(
                (m) => m.LoginChooserModule
            ),
    },
    {
        path: "tabs",
        loadChildren: () =>
            import("~/app/tabs/tabs.module").then((m) => m.TabsModule),
    },
    {
        path: "verificate-user-gym",
        loadChildren: () =>
            import("~/app/verificate-user-gym/verificate-user-gym.module").then(
                (m) => m.VerificateUserGymModule
            )
    }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes2)],
    exports: [NativeScriptRouterModule],
})
export class AppRoutingModule {}
