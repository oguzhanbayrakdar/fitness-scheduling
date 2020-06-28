import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { UserService } from "../services/user.service";
import { RouterExtensions } from "nativescript-angular/router";
import { clear, setBoolean } from "tns-core-modules/application-settings";

@Component({
  selector: "ns-verificate-user-gym",
  templateUrl: "./verificate-user-gym.component.html",
  styleUrls: ["./verificate-user-gym.component.css"]
})
export class VerificateUserGymComponent implements OnInit {

  code: string = "";
  isBusy: boolean = false;
  // @ViewChild("codeInput", {static: false}) codeInput: ElementRef;

  constructor(private _userService: UserService, private routerExtensions: RouterExtensions) {}

  ngOnInit() {}

  submit(){
    this.isBusy = true;

    this._userService.verificateUser(this.code).subscribe((s)=>{
        this.isBusy = false;
        setBoolean("isUserVerificated", true);
        this.routerExtensions.navigate(["/tabs/default"],{
            transition:{
                name: "fade"
            },
            clearHistory: true
        })
    }, (err) => {
        this.isBusy = false;
        alert("Wrong Invitation Code.");
    }, () => {
        this.isBusy = false;
    });
  }

  goBack(){
    clear();

    this.routerExtensions.navigate([ "/login-chooser"], {
        transition: {
            name: "fade"
        },
        clearHistory: true
    });

  }
}
