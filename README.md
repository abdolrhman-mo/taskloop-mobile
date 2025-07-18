# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Todo
1- Animated Arrow
👀 What:
Add a pulsing down arrow or chevron icon at the bottom → visual nudge.

### 📌 When to SHOW the arrow
👉 The arrow should appear only when there’s more content to scroll.
Example:
- If the list is scrollable (not fully visible), show the arrow.
- If the list is fully visible (fits on screen), hide the arrow — no need for a hint.

### 📌 When to HIDE the arrow
👉 When the user reaches the end → they don’t need a hint anymore.
Example:
- If you scroll to the bottom → hide the arrow.
- Or if your data is short → hide it immediately.


2- when a new session is created it doesn't get added to the main (Global state management)
   also the session name doesn't get updated

3- when its only one person in the study room his tasks should be centerd horizontaly

4- in [id].tsx file in task input accessory i want if user typed a new task but forgot to save it, i want it to be saved in async storage

5- entering study room in create page

6- edit room name is messed up as fuck