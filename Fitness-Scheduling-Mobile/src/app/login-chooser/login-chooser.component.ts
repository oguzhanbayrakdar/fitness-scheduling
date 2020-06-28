import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { getString } from "tns-core-modules/application-settings/application-settings";

@Component({
  selector: "ns-login-chooser",
  templateUrl: "./login-chooser.component.html",
  styleUrls: ["./login-chooser.component.css"]
})
export class LoginChooserComponent implements OnInit {
  constructor(private router: Router) { }

  ngOnInit() {
      // this.router.navigate(['/tabs/default'])
  }

}
