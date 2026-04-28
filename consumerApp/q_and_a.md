# Q&A

## How do I switch from local development to physical device testing with the production environment?

Create a `.env.local` file at the project root (gitignored by Expo) with production URLs:

```
EXPO_PUBLIC_API_BASE_URL=https://your-production-server.com
EXPO_PUBLIC_CHAT_PROXY_URL=https://your-production-server.com/api/chats
EXPO_PUBLIC_FEED_URL=https://your-production-server.com/api/public/posts
```

Restart Metro with `npx expo start --clear`. The device only needs internet access, not LAN access. `EXPO_PUBLIC_*` variables are baked in at build time, so a fresh bundle is required when switching environments.

## Is EAS Build part of my development environment?

No — there is no `eas.json` in the project. EAS Build is not set up.

## Can I test without a development server against production environment?

Yes, using a local build. Set `.env.local` with production URLs first, then:

**iOS:**
```bash
npx expo run:ios --configuration Release --device
```

**Android:**
```bash
npx expo run:android --variant release
```

The app runs standalone on the device with no Metro server needed. Requires Xcode (iOS) or Android Studio + SDK (Android). Run `npx expo doctor` to verify your environment.
