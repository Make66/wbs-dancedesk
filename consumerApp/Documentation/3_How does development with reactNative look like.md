<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# How does development with reactNative look like? Are there mobile emulators? Which VSCode plugins might be helpful?

React Native development usually feels like web development plus a native toolchain: you edit TypeScript/JS in VS Code, run a Metro dev server, and test on an Android emulator, iOS simulator, or physical device. The official React Native docs say the environment setup with Android Studio and Xcode lets you run Android emulators and iOS simulators and build locally.[^1]

## Daily workflow

A typical loop is:

- Start the app with Metro, for example `npx expo start` or the project’s dev script. Expo’s docs describe `npx expo start` as starting the development server/Metro bundler.[^2]
- Launch the app in an emulator, simulator, or on a connected phone. React Native’s setup docs explicitly call out Android emulators and iOS simulators as part of local development.[^1]
- Edit code and see fast refresh update the app quickly, then use logs and a debugger when something breaks. The React Native Tools VS Code extension is built around this kind of workflow and supports debugging and running projects from the editor.[^3]


## Emulators

Yes — mobile emulators are a normal part of React Native development. The official React Native environment guide says Android Studio and Xcode are used so you can run Android emulators and iOS simulators locally.[^1]

The common options are:

- Android Emulator via Android Studio, available on macOS, Windows, and Linux as part of Android development setup.[^1]
- iOS Simulator via Xcode, available only on macOS. React Native’s docs mention Xcode specifically for local iOS development.[^1]
- Physical device testing, which is still important for camera, notifications, auth, biometrics, and performance validation even if emulators handle most day-to-day work. Expo development builds can also be installed on simulators/emulators from local or EAS output.[^4]


## VS Code plugins

The most useful VS Code extension to start with is **React Native Tools**. Its Marketplace page says it helps debug React Native code, run apps, and check development-environment configuration from VS Code.[^3]

A practical plugin set:

- React Native Tools, for debugging, launch commands, and environment checks.[^3]
- ESLint, for code quality in TypeScript/JavaScript projects.
- Prettier, for formatting consistency.
- Error Lens, to surface lint/type errors inline.
- Tailwind CSS IntelliSense, only if you use NativeWind/Tailwind-style utilities; Expo has also published UI guidance around NativeWind workflows.[^5]
- GitLens, for day-to-day source control visibility.


## Practical advice

For your stack, the smoothest setup is usually:

- VS Code as the editor.
- Android Studio installed for the Android emulator.
- Xcode installed as well if you are on macOS and need iOS development. React Native’s docs treat Android Studio and Xcode as the standard local toolchain.[^1]
- Expo dev builds when you need native modules like Firebase, notifications, camera, and Apple/Google/Facebook auth, since Expo documents development builds for that workflow.[^4]

If you are on Windows, expect Android-first development locally, because iOS Simulator requires macOS and Xcode. That platform split is implied directly by React Native’s use of Android Studio for Android and Xcode for iOS.[^1]

Would you like a concrete “best dev setup” checklist for macOS or for Windows?
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://reactnative.dev/docs/set-up-your-environment

[^2]: https://github.com/expo/expo/blob/main/docs/pages/tutorial/eas/configure-development-build.mdx

[^3]: https://marketplace.visualstudio.com/items?itemName=msjsdiag.vscode-react-native

[^4]: https://docs.expo.dev/develop/development-builds/create-a-build/

[^5]: https://expo.dev/blog/building-high-quality-uis-with-expo-and-nativewind

[^6]: https://oneuptime.com/blog/post/2026-02-13-react-native-development-environment/view

[^7]: https://www.youtube.com/watch?v=cIruhXDwvoo

[^8]: https://www.youtube.com/watch?v=cNk4YOWKBe8

[^9]: https://www.youtube.com/watch?v=OBQ__6IVe64

[^10]: https://www.youtube.com/watch?v=oHIrtPqdpbk

[^11]: https://www.youtube.com/watch?v=Kulog2LnN5A

[^12]: https://gist.github.com/biomazi/4a0cd21a31db78f6d45bfabc52838772

[^13]: https://github.com/microsoft/react-native-windows/discussions/15141

[^14]: https://csteach422.github.io/assets/docs/extras/react-native-install-osx.pdf

[^15]: https://dev.to/sonarsystems/how-to-setup-react-native-for-android-using-vscode-mac-apple-chip-intel-chip-1j5f

[^16]: https://www.facebook.com/groups/943086679527236/posts/1637655256737038/

