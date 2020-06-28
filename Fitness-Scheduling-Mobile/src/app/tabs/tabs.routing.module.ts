import { NgModule } from "@angular/core";
import {
    NativeScriptRouterModule,
    NSEmptyOutletComponent
} from "nativescript-angular/router";
import { TabsComponent } from "./tabs.component";
const routes = [
    {
        path: "default",
        component: TabsComponent,
        children: [
            {
                path: "settings",
                outlet: "settingsTab",
                component: NSEmptyOutletComponent,
                loadChildren: () =>
                    import("~/app/settings/settings.module").then(
                        (m) => m.SettingsModule
                    )
            },
            {
                path: "scheduling",
                outlet: "schedulingTab",
                component: NSEmptyOutletComponent,
                loadChildren: () =>
                    import("~/app/scheduling/scheduling.module").then(
                        (m) => m.SchedulingModule
                    )
            },
            {
                path: "appointments",
                outlet: "appointmentsTab",
                component: NSEmptyOutletComponent,
                loadChildren: () =>
                    import("~/app/appointment/appointment.module").then(
                        (m) => m.AppointmentModule
                    )
            }
        ]
    }
    // {
    //     path: "dsd",
    //     redirectTo:
    //         "/(searchTab:search//schedulingTab:scheduling//appointmentsTab:appointments//notificationsTab:notifications)",
    //     pathMatch: "full",
    // },
];
@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class TabsRoutingModule {}

/*
    {
        path: "",
        redirectTo:
            "/(searchTab:search//schedulingTab:scheduling//appointmentsTab:appointments//notificationsTab:notifications)",
        pathMatch: "full"
    },
    {
        path: "search",
        outlet: "searchTab",
        component: NSEmptyOutletComponent,
        loadChildren: () =>
            import("~/app/search/search.module").then(
                (m) => m.SearchModule
            ),
    },
    {
        path: "scheduling",
        outlet: "schedulingTab",
        component: NSEmptyOutletComponent,
        loadChildren: () =>
            import("~/app/scheduling/scheduling.module").then(
                (m) => m.SchedulingModule
            ),
    },
    {
        path: "appointments",
        outlet: "appointmentsTab",
        component: NSEmptyOutletComponent,
        loadChildren: () =>
            import("~/app/appointment/appointment.module").then(
                (m) => m.AppointmentModule
            ),
    },
    {
        path: "notifications",
        outlet: "notificationsTab",
        component: NSEmptyOutletComponent,
        loadChildren: () =>
            import("~/app/tavsiyeler/tavsiyeler.module").then(
                (m) => m.TavsiyeModule
            ),
    }

*/
