import React, { useState } from 'react';
import { Switch, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { getLocales } from 'expo-localization';
import { getAuth, signOut } from 'firebase/auth';
import firebaseApp from '../../firebaseConfig';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import i18n from '../../i18n';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'tr', label: 'Türkçe' },
];

export default function SettingsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const auth = getAuth(firebaseApp);

  // Language selection
  const deviceLang = getLocales()[0]?.languageCode || 'en';
  const [selectedLang, setSelectedLang] = useState(
    LANGUAGES.find(l => l.code === deviceLang) ? deviceLang : 'en'
  );
  const [_, forceRerender] = useState(0); // for rerender on language change

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
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: theme.text }]}>{i18n.t('settings')}</Text>
        {isPremium && (
          <FontAwesome5 name="crown" size={28} color={theme.button2} style={styles.crownIcon} solid />
        )}
      </View>

      {/* Premium Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>{i18n.t('premium')}</Text>
        <View style={styles.row}>
          <View>
            <Text style={[styles.label, { color: theme.text }]}>{i18n.t('premium')}</Text>
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
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>{i18n.t('language')}</Text>
        <View style={styles.row}>
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

      {/* Log out Button */}
      <TouchableOpacity style={[styles.logoutButton, { backgroundColor: theme.button1 }]} onPress={handleLogout}>
        <Text style={[styles.logoutText, { color: theme.button2 }]}>{i18n.t('logout')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 40,
    marginHorizontal: 16,
  },
  crownIcon: {
    marginLeft: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 16,
    alignSelf: 'center',
  },
  section: {
    marginBottom: 32,
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
  label: {
    fontSize: 15,
  },
  langButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    borderColor: 'transparent',
    borderWidth: 2,
  },
  logoutButton: {
    marginTop: 'auto',
    marginBottom: 32,
    marginHorizontal: 32,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 