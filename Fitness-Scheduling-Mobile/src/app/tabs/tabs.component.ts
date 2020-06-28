import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";

@Component({
    moduleId: module.id,
    selector: "ns-tabs",
    templateUrl: "./tabs.component.html",
    styleUrls: ["./tabs.component.css"],
})
export class TabsComponent implements OnInit {
    constructor(
        private routerExtension: RouterExtensions,
        private activeRoute: ActivatedRoute
    ) {
    }

    ngOnInit() {

        // tslint:disable-next-line: max-line-length
        this.routerExtension.navigate(
            [
                {
                    outlets: {
                        settingsTab: ["settings"],
                        schedulingTab: ["scheduling"],
                        appointmentsTab: ["appointments"]
                    }
                }
            ],
            { relativeTo: this.activeRoute }
        );
    }
}
