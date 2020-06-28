import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { SettingsRoutingModule } from "./settings-routing.module";
import { SettingsComponent } from "./settings.component";
import { NativeScriptUIDataFormModule } from "nativescript-ui-dataform/angular";
import { UserService } from "../services/user.service";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
@NgModule({
    imports: [
        NativeScriptCommonModule,
        SettingsRoutingModule,
        NativeScriptUIDataFormModule,
        NativeScriptFormsModule
    ],
    declarations: [
        SettingsComponent,
        ChangePasswordComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    providers: [UserService]
})
export class SettingsModule { }
