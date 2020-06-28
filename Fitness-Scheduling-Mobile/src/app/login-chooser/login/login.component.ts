import { Component, OnInit } from "@angular/core";
import { alert, prompt } from "tns-core-modules/ui/dialogs";
import { ActivatedRoute } from "@angular/router";
import { User } from "~/app/models/appointment";
import { UserLogin } from "~/app/models/userLogin";
import { UserRegister } from "~/app/models/userRegister";
import { UserService, setAccountInfos, AccountTypes } from "~/app/services/user.service";
import { isValidEmail } from "../business/business.component";
import { ActivityIndicator } from "tns-core-modules/ui/activity-indicator";
import { EventData } from "tns-core-modules/data/observable";
import { RouterExtensions } from "nativescript-angular/router";
import { Subscription } from "rxjs";
@Component({
    selector: "ns-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
    isLoggingIn = true;
    user = new UserRegister();
    isBusy = false;
    subscriptions: Array<Subscription> = new Array<Subscription>();
    constructor(private activatedRoute: ActivatedRoute,
                private userService: UserService,
                private routerExtensions: RouterExtensions) {}

    ngOnInit() {
        console.log(this.activatedRoute.snapshot.params.id);
    }
    onBusyChanged(args: EventData) {
        let indicator: ActivityIndicator = <ActivityIndicator>args.object;
        console.log("indicator.busy changed to: " + indicator.busy);
    }

    toggleForm() {
        this.isLoggingIn = !this.isLoggingIn;
    }

    submit() {
        if (!this.user.eMail || !this.user.password) {
            alert("Email and password can not be empty.");

            return;
        }

        if (!isValidEmail(this.user.eMail)) {
            alert("Invalid Email");
            return;
        }

        this.isBusy = true;
        if (this.isLoggingIn) {
            // Perform the login
            const userLogin = new UserLogin();
            userLogin.eMail = this.user.eMail;
            userLogin.password = this.user.password;
            let postData;
            this.subscriptions.push(this.userService.userLogin(userLogin).subscribe((c) => {
                this.isBusy = false;
                postData = c;
                setAccountInfos(AccountTypes.user, userLogin.eMail, userLogin.password, postData.token, postData.id, postData.isUserVerificated);

                this.routerExtensions.navigate([postData.isUserVerificated ? "/tabs/default" : "/verificate-user-gym"], {
                    transition: {
                        name: "fade"
                    }
                });

            }, (err) => {
                this.isBusy = false;
                alert("Login informations are wrong.");
            }, () => {
                this.isBusy = false;
            }));
        } else {
            // Perform the registration
            if (this.user.password !== this.user.confirmPassword) {
                alert("Passwords do not match.");
                this.isBusy = false;

                return ;
            }
            if (this.user.password.length <= 9) {
                alert("The password is too short, minimum 9 characters is must.");
                this.isBusy = false;

                return;
            }
            this.subscriptions.push(this.userService.userRegister(this.user).subscribe((c) => {
                this.isBusy = false;
                alert({
                    title: "Alert",
                    message:
                        "Account has successfully created.",
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
