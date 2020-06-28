import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from "@angular/core";
import { PlaceRegister } from "~/app/models/placeRegister";
import { alert, prompt } from "tns-core-modules/ui/dialogs";
import { TimePicker } from "tns-core-modules/ui/time-picker";
import { UserService, setAccountInfos, AccountTypes } from "~/app/services/user.service";
import { PlaceLogin } from "~/app/models/placeLogin";
import {
    getString,
    setString,
} from "tns-core-modules/application-settings";
import { ActivityIndicator } from "tns-core-modules/ui/activity-indicator";
import { Place } from "~/app/models/appointment";
import { RouterExtensions } from "nativescript-angular/router";
import { Subscription } from "rxjs";
@Component({
    selector: "ns-business",
    templateUrl: "./business.component.html",
    styleUrls: ["./business.component.css"]
})
export class BusinessComponent implements OnInit, OnDestroy {
    business = new PlaceRegister();
    isLoggingIn = false;
    today = new Date();
    isBusy: boolean = false;
    subscriptions: Array<Subscription> = new Array<Subscription>();

    constructor(private userService: UserService, private routerExtension: RouterExtensions) {}
    ngOnDestroy(): void {
        this.subscriptions.forEach(element => {
            element.unsubscribe();
        });
    }

    ngOnInit() {}
    toggleForm() {
        this.isLoggingIn = !this.isLoggingIn;
    }
    submit() {
        if (!this.business.owner.eMail || !this.business.password) {
            alert("Email veya şifre boş kalamaz.");

            return;
        }
        if (!isValidEmail(this.business.owner.eMail)) {
            alert("Geçersiz Email.");

            return;
        }

        this.isBusy = true; // ActivityIndicator Açılır.

        if (this.isLoggingIn) {
            // Perform the login
            const businessLogin = new PlaceLogin();

            businessLogin.eMail = this.business.owner.eMail;
            businessLogin.password = this.business.password;

            let postData;

            this.subscriptions.push(this.userService.placeLogin(businessLogin).subscribe((c: Place) => {
                this.isBusy = false;
                postData = c;
                setAccountInfos(AccountTypes.business, businessLogin.eMail,
                    businessLogin.password, postData.token, postData.id, true);
                this.routerExtension.navigate(['/tabs/default'], {
                    transition: {
                        name: "fade"
                    },
                    clearHistory: true
                });

            }, (err) => {
                alert("Wrong email or password.")
                this.isBusy = false;

            }, () => {
                this.isBusy = false;
                console.log("Tamamlandı.");

            }));
        } else {
            // Perform the registration
            if (this.business.confirmPassword !== this.business.password) {
                alert("Passwords do not match.");
                this.isBusy = false;

                return;
            }
            if(this.business.password.length <= 9) {
                alert("The password is too short, minimum 9 characters is required.");
                this.isBusy = false;

                return;
            }

            this.subscriptions.push(this.userService.placeRegister(this.business).subscribe((c: Place) => {
                this.isBusy = false;
                alert({
                    title: "Alert",
                    message:
                        "Account was created successfully.",
                    okButtonText: "Ok"
                }).then(() => {
                    this.toggleForm();
                });
            }, (err) => {
                alert("This EMail address has already been taken.");
                this.isBusy = false;
            }, () => {
                this.isBusy = false;
            }));

        }
    }

    forgotPassword() {
        prompt({
            title: "Forgot Password",
            message:
                "Enter the email address you used to register for APP NAME to reset your password.",
            defaultText: "",
            okButtonText: "Ok",
            cancelButtonText: "Cancel"
        }).then((data) => {
            if (data.result) {
                // Call the backend to reset the password
                alert({
                    title: "APP NAME",
                    message:
                        "Your password was successfully reset. Please check your email for instructions on choosing a new password.",
                    okButtonText: "Ok"
                });
            }
        });
    }
}

export function isValidEmail(email: string) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return re.test(email);
}
