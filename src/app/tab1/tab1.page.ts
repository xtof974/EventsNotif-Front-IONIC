import { Component, OnInit, NgZone } from "@angular/core";

import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
} from "@capacitor/core";

const { PushNotifications } = Plugins;

// with type support
import { FCM } from "@capacitor-community/fcm";
import { Platform } from "@ionic/angular";
const fcm = new FCM();

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"],
})
export class Tab1Page implements OnInit {
  topicName: string = "event";
  remoteToken: string = "";

  constructor(private platform: Platform, private zone: NgZone) {}

  ngOnInit() {
    console.log("Initializing HomePage");
    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    PushNotifications.requestPermission().then((result) => {
      if (result.granted) {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

    PushNotifications.addListener(
      "registration",
      (token: PushNotificationToken) => {
        alert("Push registration success, token: " + token.value);
      }
    );

    PushNotifications.addListener("registrationError", (error: any) => {
      alert("Error on registration: " + JSON.stringify(error));
    });

    PushNotifications.addListener(
      "pushNotificationReceived",
      (notification: PushNotification) => {
        alert("Push received: " + JSON.stringify(notification));
      }
    );

    PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (notification: PushNotificationActionPerformed) => {
        alert("Push action performed: " + JSON.stringify(notification));
      }
    );
  }

  subscribeTo() {
    PushNotifications.register()
      .then((_) => {
        fcm
          .subscribeTo({ topic: this.topicName })
          .then((r) => alert(`subscribed to topic ${this.topicName}`))
          .catch((err) => console.log(err));
      })
      .catch((err) => alert(JSON.stringify(err)));
  }

  unsubscribeFrom() {
    fcm
      .unsubscribeFrom({ topic: this.topicName })
      .then((r) => alert(`unsubscribed from topic ${this.topicName}`))
      .catch((err) => console.log(err));
    if (this.platform.is("android")) fcm.deleteInstance();
  }

  getToken() {
    fcm
      .getToken()
      .then((result) => {
        this.remoteToken = result.token;
      })
      .catch((err) => console.log(err));
  }
}
