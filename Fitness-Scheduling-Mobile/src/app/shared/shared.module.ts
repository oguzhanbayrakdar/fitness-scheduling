import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedComponent } from "./shared.component";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { LoadingIndicatorComponent } from "./loading-indicator/loading-indicator.component";
import { NativeScriptRouterModule } from "nativescript-angular/router";

@NgModule({
  imports: [
    NativeScriptCommonModule,
    NativeScriptRouterModule
  ],
  declarations: [SharedComponent, LoadingIndicatorComponent],
  exports: [ LoadingIndicatorComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class SharedModule { }
