import { Component } from "@angular/core";
import { Validators } from "@angular/forms";
import { FormBuilder } from "@angular/forms";
import * as moment from "moment";

@Component({
  selector: "app-tab2",
  templateUrl: "tab2.page.html",
  styleUrls: ["tab2.page.scss"],
})
export class Tab2Page {
  eventForm = this.fb.group({
    name: ["", Validators.required],
    type: ["OTHER"],
    period: ["ANNUAL"],
    date: [, Validators.required],
  });
  days: string[] = ["Lundi", "Mardi", "Mercredi", "Jeudi"];

  constructor(private fb: FormBuilder) {}

  changeType(ev) {
    console.log(ev.detail.value);
    if (ev.detail.value === "BIRTHDAY") {
      this.eventForm.get("period").setValue("ANNUAL");
      this.eventForm.get("period").disable();
    } else {
      this.eventForm.get("period").enable();
    }
  }

  valid() {
    console.log(this.eventForm.value);
    let date = moment(this.eventForm.value.date);
    console.log(date.format("YYYY"));
    console.log(date.format("MM"));
    console.log(date.format("DD"));
  }
}
