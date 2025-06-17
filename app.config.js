import 'dotenv/config';

export default {
  expo: {
    owner: "devbd1",
    name: "Routiner",
    slug: "routiner",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/routiner_icon.png",
    scheme: 'routiner',
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.devbd1.routiner",
      googleServicesFile: "./GoogleService-Info.plist",
      ITSAppUsesNonExemptEncryption: false,
      infoPlist: {
        CFBundleURLTypes: [
          {
            CFBundleURLSchemes: [
              "routiner"
            ]
          }
        ]
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.devbd1.routiner",
      googleServicesFile: "./google-services.json"
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      'expo-localization',
    ],
    extra: {
      eas: {
        projectId: "351b6748-97e9-4918-a5ce-867db8edeb15"
      },
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
      FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
      FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
      FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL,
      GOOGLE_WEB_CLIENT_ID: process.env.GOOGLE_WEB_CLIENT_ID,
      GOOGLE_ANDROID_CLIENT_ID: process.env.GOOGLE_ANDROID_CLIENT_ID,
      GOOGLE_IOS_CLIENT_ID: process.env.GOOGLE_IOS_CLIENT_ID,
    },
  },
}; 