import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { VerificateUserGymComponent } from "./verificate-user-gym.component";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NgRippleModule } from "nativescript-ng-ripple/angular/ng-ripple.module";
import { VerificateUserGymRoutingModule } from "./verificate-user-gym.routing.module";
import { UserService } from "../services/user.service";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  imports: [
    NativeScriptCommonModule,
    NativeScriptHttpClientModule,
    NativeScriptRouterModule,
    NativeScriptCommonModule,
    NativeScriptFormsModule,
    NgRippleModule,
    VerificateUserGymRoutingModule,
    SharedModule
  ],
  declarations: [VerificateUserGymComponent],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [UserService]
})
export class VerificateUserGymModule { }
