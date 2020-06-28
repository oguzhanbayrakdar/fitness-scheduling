import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { RadDataFormComponent } from "nativescript-ui-dataform/angular";
import { ModalDialogParams } from "nativescript-angular/modal-dialog";
import { UserService } from "~/app/services/user.service";
import { Subscribable, Subscription } from "rxjs";

@Component({
    selector: "ns-change-password",
    templateUrl: "./change-password.component.html",
    styleUrls: ["./change-password.component.css"],
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
    passwordChange: PasswordChange = {
        oldPass: "",
        newPass: "",
        newPassConfirm: "",
    };
    isPassOk = true;
    isUser = true;
    @ViewChild("changePassForm", { static: false })
    changePassFormComp: RadDataFormComponent;

    subscription: Subscription;

    constructor(
        private _modalDialogParams: ModalDialogParams,
        private userService: UserService
    ) {}
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    ngOnInit() {
        this.isUser = this._modalDialogParams.context.data;
    }

    commitPass() {
        this.changePassFormComp.dataForm.validateAndCommitAll().then((res) => {
            if (res) {
                // Form doldurulmuşsa
                if (
                    this.passwordChange.newPass ===
                    this.passwordChange.newPassConfirm
                ) {
                    // 2 şifrede aynıysa (db'ye isteği burada yap.)
                    this.isPassOk = true;

                    this.isUser // User Password Change
                        ? (this.subscription = this.userService
                              .changeUserPassword(
                                  this.passwordChange.newPass,
                                  this.passwordChange.oldPass
                              )
                              .subscribe(
                                  () => {
                                      this._modalDialogParams.closeCallback();
                                      alert(
                                          "Password has changed successfully."
                                      );
                                  },
                                  (err) => {
                                      this._modalDialogParams.closeCallback();
                                      alert(
                                          "An error occurred while changing password."
                                      );
                                  }
                              ))
                        : // Place Password Change
                          (this.subscription = this.userService
                              .changePlacePassword(
                                  this.passwordChange.newPass,
                                  this.passwordChange.oldPass
                              )
                              .subscribe(
                                  () => {
                                      this._modalDialogParams.closeCallback();
                                      alert(
                                          "Password has changed successfully."
                                      );
                                  },
                                  (err) => {
                                      this._modalDialogParams.closeCallback();
                                      alert(
                                          "An error occurred while changing password."
                                      );
                                  }
                              ));
                } else {
                    this.isPassOk = false;
                }
                console.log(this.passwordChange);
            } else {
                // Form tam doldurulmamışsa
                console.log("formu tam doldur aq");
            }
        });
    }

    onClose(): void {
        this._modalDialogParams.closeCallback(); // modal'ı kapatır.
    }
}

// tslint:disable-next-line: max-classes-per-file
export class PasswordChange {
    oldPass: string;
    newPass: string;
    newPassConfirm: string;
}
