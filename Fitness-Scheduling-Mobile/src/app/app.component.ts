import { Component, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import {
    DrawerTransitionBase,
    RadSideDrawer,
    SlideInOnTopTransition
} from "nativescript-ui-sidedrawer";
import { filter } from "rxjs/operators";
import * as app from "tns-core-modules/application";
import {
    getBoolean,
    setBoolean,
    getNumber,
    setNumber,
    getString,
    setString,
    hasKey,
    remove,
    clear
} from "tns-core-modules/application-settings";
import { User } from "./models/appointment";
import { UserLogin } from "./models/userLogin";
import { UserService, AccountTypes } from "./services/user.service";

@Component({
    selector: "ns-app",
    templateUrl: "app.component.html"
})
export class AppComponent implements OnInit {
    get sideDrawerTransition(): DrawerTransitionBase {
        return this._sideDrawerTransition;
    }
    isUserLoggedIn = false;
    user: UserLogin = new UserLogin();
    token: string;
    accountType: string; // normal user or business
    id: string; // place or user id
    isUserVerificated: boolean = false;

    private _activatedUrl: string;
    private _sideDrawerTransition: DrawerTransitionBase;
    constructor(
        private router: Router,
        private routerExtensions: RouterExtensions,
        private userService: UserService
    ) {
        // Use the component constructor to inject services.
    }

    ngOnInit(): void {
        this.checkUserLoggedIn();
    }

    checkUserLoggedIn() {
        // clear();

        this.token = getString("token", null);
        console.log("Token: " + this.token);

        this.accountType = getString("accountType", null);
        console.log("Account Type: " + this.accountType);

        this.isUserVerificated = getBoolean("isUserVerificated", false);
        console.log("Is User Verificated: " + this.isUserVerificated);

        if (this.token && this.accountType) {

            this.routerExtensions.navigate([this.isUserVerificated ? "/tabs/default" : "/verificate-user-gym"], {
                transition: {
                    name: "fade"
                }
            });
        } else {
            this.routerExtensions.navigate(["/login-chooser"], {
                transition: {
                    name: "fade"
                }
            });
        }
    }
}
