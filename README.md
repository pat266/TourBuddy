# TourBuddy

This Project is being done for Mobile Apps and Services. Gatech. Members: Pat Tran, Connor O'Hara, Harry Zhu, Jerome Perera. 
This uses React Native and Expo.


https://reactnative.dev/docs/environment-setup

https://docs.expo.dev/get-started/installation/

WARNING: On Windows NPM gets locked by some IDE's. Closing IDE or WSL session will potentially remove npm permissions conflict.

Download the Expo Go app on the IPhone and Android 

I recommend to create an expo account and login in your terminal.
https://expo.dev/signup

```
expo login
```

Clone to a folder.

```
git clone https://github.com/pat266/TourBuddy.git
```
cd into folder
```
cd TourBuddy
```
Check out the branch you prefer
```
git checkout <branch>
```
Install dependencies
```
npm install
```
if  the above doesn't work
```
yarn install
```

Rename the `.env.env` file to `.env`.
*Note that you need to enable Maps SDK for Android/Maps SDK for iOS, Places API (New) in the APIs & Services (https://console.cloud.google.com/google/maps-apis/api-list)*


Start the expo development server:
```
npx expo start
```
