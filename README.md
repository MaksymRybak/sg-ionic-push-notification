# Ionic Push Notification app

## Useful commands for Ionic projectß
`ionic start pushApp blank --type=angular --capacitor`

`ionic build`

`ionic cap add ios`
`ionic cap add android`

`ionic cap copy ios`
`ionic cap open ios`

## App's components
Create service `ionic g service services/fcm` that will incapsulate fcm (Firebase Cloud Messaging) logic  
Create page `ionic g page pages/details` to host some custom code  
Install the push notification plugin `npm install @capacitor/push-notifications` -> sync `npx cap sync`

## Docs how use Push Notifications in Ionic Capacitor project
- Capacitor plugin https://capacitorjs.com/docs/apis/push-notifications
- How integrate with firebase https://capacitorjs.com/docs/guides/push-notifications-firebase

## Check list we can follow to verify ios and android configuration for push notifications 
1. check the app id in capacitor.config.ts is aligned with budle id in native apps
2. add PushNotifications.presentationOptions (doc https://capacitorjs.com/docs/apis/push-notifications#:~:text=Since-,presentationOptions,-PresentationOption%5B%5D) to capacitor.config.ts, plugins section.
the 'alert' is useful to see the notification alert when the app is opened and the push notification is received
```
PushNotifications: {
    presentationOptions: ['badge', 'sound', 'alert']
}
```
3. config firebase project, in Firebase project -> Project Overview -> Project settings, add ios and 
android apps in Your Apps section.
Add android app, when done, generated google-services.json should be placed in android/app folder.
Add ios app, when done, go to the Cloud Messaging in Firebase -> your ios app -> upload the key that
will be generated following step (4) of this checklist.
Download GoogleService-Info.plist from firebase ios app -> open XCode and ios project 
-> grab and copy GoogleService-Info.plist into App folder of xcode project (file have to be present in 
the same folder as capacitor.config.json). Do not forger to check "Copy items if needed" in the 
confirmation PopUp opened when you drag and drop plist into xcode.
4. config APN for the Apple platform. Open Apple Developer -> go to Certificates, Identifiers & Profiles 
-> Identifiers -> Register new identifier -> use app's bundle id, enable Push Notification and finish the 
registration. There are two ways to integrate push notifications: 
    - use certificates (more complex way, cer file is generated, but firebase needs .p12 file, 
    we have to install this key in the mac certchain, export it in .p12 and only after that we can
    upload it in firebase)
    - use key (easier one, suggested by firebase, we are going to use this one) -> in the Keys 
    create a new one for Push Notification -> download .p8 file -> save it locally, is used in tep (3)
5. for ios project -> in xcode/vscode -> open Podfile (used to install additional libraries for
ios app) -> add Firebase/Messaging below the comment # Add your Pods here
```
target 'App' do
  capacitor_pods
  # Add your Pods here
  pod 'Firebase/Messaging'
end
```

6. for ios project only, run `npx cap update ios` to reinstall all pods and update native dependencies.  
Open AppDelegate.swift and perform these changes:
    - add `import Firebase` in the imports
    - add `FirebaseApp.configure()`in the application() func
    - to get the token correctly, add the two funcs reported here https://capacitorjs.com/docs/guides/push-notifications-firebase#:~:text=add%20the%20following%20two%20methods
