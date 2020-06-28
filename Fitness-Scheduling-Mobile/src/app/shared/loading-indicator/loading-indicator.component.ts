import { Component, OnInit, Input } from "@angular/core";
import { EventData } from "tns-core-modules/data/observable";
import { ActivityIndicator } from "tns-core-modules/ui/activity-indicator";
@Component({
    selector: "ns-loading-indicator",
    templateUrl: "./loading-indicator.component.html",
    styleUrls: ["./loading-indicator.component.css"],
})
export class LoadingIndicatorComponent implements OnInit {
    @Input("isBusy") isBusy: boolean;

    constructor() {}

    ngOnInit() {
        console.log("Loading Indicator Works.");
    }
    onBusyChanged(args: EventData) {
        let indicator: ActivityIndicator = <ActivityIndicator>args.object;
        console.log("indicator.busy changed to: " + indicator.busy);
    }
}
