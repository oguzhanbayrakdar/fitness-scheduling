import { Component, OnInit, ViewChild, ViewContainerRef, OnDestroy } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { RadDataFormComponent } from "nativescript-ui-dataform/angular";
import { UserService, AccountTypes } from "../services/user.service";
import {
    ModalDialogService,
    ModalDialogOptions,
} from "nativescript-angular/common";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { getString, clear } from "tns-core-modules/application-settings";
import { confirm, prompt, inputType, capitalizationType, PromptOptions } from "tns-core-modules/ui/dialogs";
import { RouterExtensions } from "nativescript-angular/router";
import { Place } from "../models/appointment";
import { Subscription } from "rxjs";
@Component({
    selector: "Settings",
    templateUrl: "./settings.component.html",
    entryComponents: [ChangePasswordComponent],
})
export class SettingsComponent implements OnInit, OnDestroy {
    isUser = false;
    isFormsReadOnly = true;
    weekOfDays = weekOfDays();
    accountType: string;
    oldEmailAddress: string;
    @ViewChild("userDataForm", { static: false })
    userDataFormComp: RadDataFormComponent;
    @ViewChild("placeDataForm", { static: false })
    placeDataFormComp: RadDataFormComponent;
    today = new Date();
    _place: Place = new Place(); // Verification Code
    subscriptions: Array<Subscription> = new Array<Subscription>();
    place: FormPlace = {
        name: "",
        address: "",
        openingTime: new Date(),
        closingTime: new Date(),
        // isFullOpen: false,
        // offDays: new Array<string>(),
        ownerName: "",
        ownerLastName: "",
        email: "",
        description: "",
    };

    user: FormUser = {
        name: "",
        lastName: "",
        email: "",
        gender: "",
    };

    constructor(
        private userService: UserService,
        private _vcRef: ViewContainerRef,
        private _modalDialog: ModalDialogService,
        private routerExtensions: RouterExtensions
    ) {
        // Use the component constructor to inject providers.
    }
    ngOnDestroy(): void {
        this.subscriptions.forEach(element => {
            element.unsubscribe();
        });
    }

    ngOnInit(): void {
        this.accountType = getString("accountType");

        if (this.accountType === AccountTypes.business) {
            console.log("Kopyala: " + getString("id", null));
            this.isUser = false;
            this.subscriptions.push(this.userService.getPlace(getString("id", null)).subscribe((c) => {
                this._place = c;
                console.log(this._place);

                this.place.address = c.address;
                this.place.closingTime = this.getRealDate(this.today, c.closingTime);
                this.place.openingTime = this.getRealDate(this.today, c.openingTime);
                this.place.description = c.description;
                this.place.email = c.owner.eMail;
                // this.place.isFullOpen = c.isFullOpen;
                this.place.name = c.name;
                // this.place.offDays = c.offDays.split(",");
                this.place.ownerLastName = c.owner.lastName;
                this.place.ownerName = c.owner.name;

                // Email Değişikliği yapılabilmesi için eski email ile yeni email karşılaştırılır.
                this.oldEmailAddress = c.owner.eMail;
            }));
        } else {
            this.isUser = true;

            this.subscriptions.push(this.userService.getUser(getString("id", null)).subscribe((c) => {
                this.user.email = c.eMail;
                this.user.gender = this.userService.genders[c.gender];
                this.user.lastName = c.lastName;
                this.user.name = c.name;

                // Email Değişikliği yapılabilmesi için eski email ile yeni email karşılaştırılır.
                this.oldEmailAddress = c.eMail;
            }));
        }
    }
    logOut() {
        confirm("Are you sure you want to log out?").then((result: boolean) => {
            if (result) {
                this.userService.logOut();
                clear();

                this.routerExtensions.navigate(["/login-chooser"], {
                    transition: {
                        name: "fade",
                    },
                    clearHistory: true,
                });
            }
        });
    }
    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

    commitUserForm() {
        console.log(this.user);
        this.userDataFormComp.dataForm.validateAndCommitAll().then((c) => {
            if (c) {
                if (this.oldEmailAddress !== this.user.email) {
                    this.userCheckPasswordWhenChangingEmail();
                } else {
                    this.updateUser();
                }
            }
        });
    }

    commitPlaceForm() {
        // console.log(this.place);
        this.placeDataFormComp.dataForm.validateAndCommitAll().then((c) => {
            // console.log(c);
            if (c) {
                if (this.oldEmailAddress !== this.place.email) {
                    this.placeCheckPasswordWhenChangingEmail();
                }else{
                    this.updatePlace();
                }
            } else {
                // Form tam doldurulmamışsa
                console.log(this.place);
            }
        });
    }

    activateForm() {
        this.isFormsReadOnly = !this.isFormsReadOnly;
    }
    modalChangePassword() {
        const options: ModalDialogOptions = {
            viewContainerRef: this._vcRef,
            animated: true,
            stretched: true,
            cancelable: true,
            fullscreen: false,
            context: {
                data: this.isUser
            }
        };

        this._modalDialog
            .showModal(ChangePasswordComponent, options)
            .then();
    }

    userCheckPasswordWhenChangingEmail() {
        let promptOptions: PromptOptions = {
            title: "Password",
            defaultText: "",
            message: "You must enter your `Password` to change your E-Mail.",
            okButtonText: "OK",
            cancelButtonText: "Cancel",
            cancelable: true,
            inputType: inputType.password, // email, number, text, password, or email
            capitalizationType: capitalizationType.none // all. none, sentences or words
        };
        // Email Adresi değişmiş ise şifre girmesini ister.
        prompt(promptOptions).then((p) => {
            this.subscriptions.push(this.userService.checkUsersPasswordIsCorrect(p.text).subscribe((check) => {
                this.oldEmailAddress = this.user.email;
                this.updateUser();
            }, (err) => {
                this.user.email = this.oldEmailAddress;
                alert("Password is incorrect.");
            }));
        });
    }

    updateUser() {
        this.subscriptions.push(this.userService.userUpdate(this.user).subscribe((result) => {
            alert("Updating the user is successful.");
        }, (err) => {
            alert("An error occurred while updating the user! Please check your internet connection.");
        }));
        this.isFormsReadOnly = true;
    }

    placeCheckPasswordWhenChangingEmail() {
        let promptOptions: PromptOptions = {
            title: "Password",
            defaultText: "",
            message: "You must enter your `Password` to change your E-Mail.",
            okButtonText: "OK",
            cancelButtonText: "Cancel",
            cancelable: true,
            inputType: inputType.password, // email, number, text, password, or email
            capitalizationType: capitalizationType.none // all. none, sentences or words
        };
        // Email Adresi değişmiş ise şifre girmesini ister.
        prompt(promptOptions).then((p) => {
            this.subscriptions.push(this.userService.checkPlacesPasswordIsCorrect(p.text).subscribe((check) => {
                this.oldEmailAddress = this.user.email;
                console.log("ddd")
                console.log(this.place);
                this.updatePlace();
            }, (err) => {
                this.place.email = this.oldEmailAddress;
                alert("Password is incorrect.");
            }));
        });
    }
    updatePlace() {
        this.subscriptions.push(this.userService.placeUpdate(this.place).subscribe((result) => {
            alert("Updating the user is successful.");
        }, (err) => {
            alert("An error occurred while updating the user! Please check your internet connection.");
        }));
        this.isFormsReadOnly = true;
    }
    getRealDate(_date: Date, _time: Date){
        let date = new Date(_date);
        let time = new Date(_time);

        date.setHours(time.getHours());
        date.setMinutes(time.getMinutes());

        return date;
    }


}

// tslint:disable-next-line: max-classes-per-file
export class FormPlace {
    name: string;
    address: string;
    openingTime: Date;
    closingTime: Date;
    // isFullOpen: boolean;
    // offDays: Array<string>;
    ownerName: string;
    ownerLastName: string;
    email: string;
    description: string;
}
// tslint:disable-next-line: max-classes-per-file
export class FormUser {
    name: string;
    lastName: string;
    email: string;
    gender: string;
}

export function weekOfDays() {
    return [
        "Pazartesi",
        "Salı",
        "Çarşamba",
        "Perşembe",
        "Cuma",
        "Cumartesi",
        "Pazar",
    ];
}
