import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { ActionPerformed, PushNotifications, PushNotificationSchema, Token } from '@capacitor/push-notifications';

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  constructor(private router: Router) { }

  public initPush() {
    if (Capacitor.getPlatform() !== 'web') {
      this.registerPush();
    }
  }

  private registerPush() {
    // Request user for permission, in real app we have to call this method in an appropriate moment for user
    // eg. when user login / details page when user subscribe for something related to push notifications
    // note: iOS will prompt user and return if they granted permission or not
    //       Android will just grant without prompting
    PushNotifications.requestPermissions().then((permission) => {
      if (permission.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // No permission for push granted
      }
    });

    // add listeners 

    // On success, we should be able to receive notifications
    PushNotifications.addListener(
      'registration',
      (token: Token) => {
        console.log('My token: ' + JSON.stringify(token));
      }
    );

    // Some issue with our setup and push will not work
    PushNotifications.addListener(
      'registrationError',
      (error: any) => {
        console.log('Error: ' + JSON.stringify(error));
      }
    );

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener(
      'pushNotificationReceived',
      async (notification: PushNotificationSchema) => {
        console.log('Push received: ' + JSON.stringify(notification));
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      async (notification: ActionPerformed) => {
        const data = notification.notification.data;
        console.log('Action performed: ' + JSON.stringify(notification.notification));
        if (data.detailsId) {
          this.router.navigateByUrl(`/home/${data.detailsId}`);
        }
      }
    );
  }

}
