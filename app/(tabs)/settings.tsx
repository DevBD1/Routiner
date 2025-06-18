import React, { useState } from 'react';
import { Switch, StyleSheet, TouchableOpacity, Alert, Linking } from 'react-native';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { getLocales } from 'expo-localization';
import { getAuth, signOut } from 'firebase/auth';
import firebaseApp from '../../firebaseConfig';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import i18n from '@/i18n';
import Constants from 'expo-constants';
import GlobalStyles, { box } from '@/constants/GlobalStyles';
import * as SecureStore from 'expo-secure-store';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'tr', label: 'Türkçe' },
];

const APP_VERSION = Constants.expoConfig?.version ?? '0.0.0';
const DEVELOPER = 'DevBD1';
const TERMS_URL = 'https://github.com/devbd1/routiner/blob/main/TERMS.md';
const GITHUB_URL = 'https://github.com/devbd1/routiner';

export default function SettingsScreen() {
  const colorScheme = useColorScheme() ?? 'dark';
  const theme = Colors[colorScheme];
  const auth = getAuth(firebaseApp);
  const user = auth.currentUser;

  // Language selection
  const deviceLang = getLocales()[0]?.languageCode || 'en';
  const [selectedLang, setSelectedLang] = useState(
    LANGUAGES.find(l => l.code === deviceLang) ? deviceLang : 'en'
  );
  const [_, forceRerender] = useState(0);

  // Premium state
  const [isPremium, setIsPremium] = useState(false);

  // Log out handler
  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert(i18n.t('logout'), i18n.t('logged_out_message'));
      // Optionally, navigate to login screen
    } catch (err: any) {
      Alert.alert('Logout Error', err.message);
    }
  };

  // Handle language change
  const handleLanguageChange = (lang: string) => {
    setSelectedLang(lang);
    i18n.locale = lang;
    forceRerender(x => x + 1); // force rerender to update translations
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>  
      {/* User Panel */}
      <View style={box(colorScheme)}> 
        <View style={styles.userRow}>
          <FontAwesome5 name="user-circle" size={28} color={theme.button2} style={{ marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.userEmail, { color: theme.text }]}>{user?.email || i18n.t('not_logged_in')}</Text>
            {isPremium && (
              <View style={styles.premiumBadge}>
                <FontAwesome5 name="crown" size={16} color={theme.button2} solid />
                <Text style={[styles.premiumText, { color: theme.button2 }]}>{i18n.t('premium_tag')}</Text>
              </View>
            )}
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={[styles.logoutText, { color: theme.button2 }]}>{i18n.t('logout')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Premium Section */}
      <View style={box(colorScheme)}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>{i18n.t('premium_tag')}</Text>
        <View style={styles.row}>
          <View>
            <Text style={[styles.label, { color: theme.text }]}>{i18n.t('premium_toggle')}</Text>
          </View>
          <Switch
            value={isPremium}
            onValueChange={setIsPremium}
            trackColor={{ false: theme.button1, true: theme.button1 }}
            thumbColor={isPremium ? theme.button2 : theme.background}
          />
        </View>
      </View>

      {/* Language Section */}
      <View style={box(colorScheme)}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>{i18n.t('language')}</Text>
        <View style={styles.langRow}>
          {LANGUAGES.map(lang => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.langButton,
                selectedLang === lang.code && { borderColor: theme.button2, borderWidth: 2 },
              ]}
              onPress={() => handleLanguageChange(lang.code)}
            >
              <Text style={{ color: theme.text }}>{lang.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Data Management Section */}
      <View style={box(colorScheme)}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>{i18n.t('data_management') || 'Data Management'}</Text>
        <TouchableOpacity 
          style={[styles.clearButton, { backgroundColor: theme.button1 }]}
          onPress={async () => {
            try {
              // Get current habits count
              const habitsData = await SecureStore.getItemAsync('habits');
              const habits = habitsData ? JSON.parse(habitsData) : [];
              const habitCount = habits.length;
              
              Alert.alert(
                'Clear All Habits',
                `Are you sure you want to delete all ${habitCount} habits? This action cannot be undone.`,
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Clear All', 
                    style: 'destructive',
                    onPress: async () => {
                      try {
                        await SecureStore.deleteItemAsync('habits');
                        Alert.alert('Success', `All ${habitCount} habits have been cleared.`);
                      } catch (error) {
                        Alert.alert('Error', 'Failed to clear habits data.');
                      }
                    }
                  }
                ]
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to read habits data.');
            }
          }}
        >
          <FontAwesome5 name="trash" size={18} color={theme.text} style={{ marginRight: 8 }} />
          <Text style={[styles.clearButtonText, { color: theme.text }]}>
            {i18n.t('clear_all_habits') || 'Clear All Habits'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* App Info Panel */}
      <View style={box(colorScheme)}> 
        <Text style={[styles.infoTitle, { color: theme.text }]}>{i18n.t('app_info')}</Text>
        <Text style={[styles.infoText, { color: theme.text }]}>{i18n.t('version')}: {APP_VERSION}</Text>
        <Text style={[styles.infoText, { color: theme.text }]}>{i18n.t('developer')}: {DEVELOPER}</Text>
        <TouchableOpacity onPress={() => Linking.openURL(TERMS_URL)}>
          <Text style={[styles.link, { color: theme.button2 }]}>{i18n.t('terms_of_usage')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL(GITHUB_URL)}>
          <Text style={[styles.link, { color: theme.button2 }]}>{i18n.t('github_repository')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userEmail: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  premiumText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  logoutButton: {
    marginLeft: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 8,
  },
  label: {
    fontSize: 15,
  },
  langButton: {
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginHorizontal: 3,
    borderColor: Colors.light.button1,
    borderWidth: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 4,
  },
  link: {
    fontSize: 14,
    textDecorationLine: 'underline',
    marginBottom: 4,
  },
  clearButton: {
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 