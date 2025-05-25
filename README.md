# Routiner

**Routiner** is a minimalist, intuitive habit tracker app developed specifically for iPhone using **Expo based React Native** and **Firebase**. It helps users build, maintain, and track their daily routines efficiently.

## Features (MVP)

- User authentication via Google and Apple Sign-in.
- Anonymous login for test.
- Create and manage target-based routines (e.g., drink 2.5 liters of water daily).
- Daily, weekly, and monthly progress tracking.
- Custom reminders and notifications.
- Comprehensive statistics and reports.

---

## Post-MVP Roadmap

### Phase 1 Stylish Update

- Tweak the gradient to something more neon-styled or duotone.

### Phase 2: UI Elements Update

- **Animations**: Animate the progress ring on the homepage (e.g. have it draw itself on mount).
- **Animations**: Introduce micro-animations on the “+” button (pulse, hover lift on web).
- **Dark Mode Support**: Provide full dark mode UI support.

### Phase 3: Advanced Analytics

- **Trend Analysis**: Provide deeper insights into users' habit patterns.
- **Predictive Suggestions**: Suggest habits or adjustments based on user behavior.
- **Personalized Recommendations**: Implement AI-driven recommendations to optimize routine effectiveness.

### Phase 4: User Engagement Enhancements

- **Gamification Elements**: Add achievements, badges, and streak rewards to increase motivation.
- **Social Sharing**: Allow users to share their progress or achievements on social media platforms.
- **Friends and Challenges**: Enable users to invite friends, create groups, and participate in habit-building challenges.

### Phase 4: Customization and Accessibility

- **Localization**: Add multilingual support.
- **Customizable Themes**: Allow users to personalize app aesthetics.

### Phase 5: Monetization

- **Premium Subscription**: Advanced analytics, additional customization, and exclusive features.
- **In-app Purchases**: Option to buy custom icon packs and themes.

### Phase 6: Expanded Integration

- **Health App Integration**: Sync routines and progress with Apple Health.
- **Wearable Integration**: Compatibility with popular wearables (e.g., Apple Watch).
- **Third-party Integration**: Integration with calendar apps (Google Calendar, iCal).

---

## Getting Started

### Prerequisites

- Node.js (Latest LTS)
- Expo CLI (`npm install -g expo-cli`)
- Firebase Account

### Installation

```bash
git clone https://github.com/DevBD1/Routiner.git
cd Routiner
npm install
```

- Create and configure your .env file with Firebase and other necessary environment variables. You can copy .env(ph) and rename it to .env

```bash
npx expo start
```

---

## Contribution Guidelines

- Fork the repository and create your branch from `main`.
- Ensure your code passes ESLint and TypeScript checks.
- Submit pull requests with clear and concise descriptions.

---

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

For issues, suggestions, or feature requests, please open a new issue on GitHub.

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install --legacy-peer-deps
   ```

   ```bash
   yarn add expo
   ```

   Extra for MacOS:

   ```bash
   npx expo prebuild
   npx pod-install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [Development Build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android Emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS Simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
