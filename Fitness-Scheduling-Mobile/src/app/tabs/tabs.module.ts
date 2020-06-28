import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsComponent } from './tabs.component';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { TabsRoutingModule } from './tabs.routing.module';
import { SchedulingComponent } from '../scheduling/scheduling.component';

@NgModule({
  imports: [
    NativeScriptCommonModule,
    NativeScriptRouterModule,
    TabsRoutingModule
  ],
  declarations: [TabsComponent],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [ ]
})
export class TabsModule { }
