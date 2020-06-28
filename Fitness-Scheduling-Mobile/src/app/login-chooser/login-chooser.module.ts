import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptUICalendarModule } from "nativescript-ui-calendar/angular";
import { NgRippleModule } from "nativescript-ng-ripple/angular/ng-ripple.module";
import { SchedulingService } from "../services/scheduling.service";
import { LoginRoutingModule } from "./login-chooser.routing.module";
import { LoginComponent } from "./login/login.component";
import { LoginChooserComponent } from "./login-chooser.component";
import { UserService } from "../services/user.service";
import { BusinessComponent } from "./business/business.component";
import { LoadingIndicatorComponent } from "../shared/loading-indicator/loading-indicator.component";
import { SharedModule } from "../shared/shared.module";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptHttpClientModule,
        NativeScriptUICalendarModule,
        NativeScriptRouterModule,
        NativeScriptFormsModule,
        LoginRoutingModule,
        NgRippleModule,
        SharedModule
    ],
    declarations: [
        LoginComponent,
        LoginChooserComponent,
        BusinessComponent,
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    providers: [
        UserService
    ]
})
export class LoginChooserModule {}
