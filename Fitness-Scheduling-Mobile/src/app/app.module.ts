import { NgModule, NO_ERRORS_SCHEMA, LOCALE_ID } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptUISideDrawerModule } from "nativescript-ui-sidedrawer/angular";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { UserService } from "./services/user.service";
import { TabsComponent } from './tabs/tabs.component';
import { LoginChooserComponent } from "./login-chooser/login-chooser.component";
import { SharedModule } from "./shared/shared.module";
// import localeTr from '@angular/common/locales/tr';
// import { registerLocaleData } from "@angular/common";
// registerLocaleData(localeTr, 'tr');

@NgModule({
   bootstrap: [
      AppComponent
   ],
   imports: [
      AppRoutingModule,
      NativeScriptModule,
      NativeScriptUISideDrawerModule,
      NativeScriptHttpClientModule,
      SharedModule
   ],
   declarations: [
      AppComponent
   ],
   schemas: [
      NO_ERRORS_SCHEMA
   ],
   // { provide: LOCALE_ID, useValue: "tr-TR" },
   providers: [
      UserService,
   ]
})
export class AppModule { }
