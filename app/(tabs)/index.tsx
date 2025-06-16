import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import GlobalStyles from '@/constants/GlobalStyles';

export default function HabitTrackerScreen() {
  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>Habit Tracker</Text>
      {/* Main Habit Tracker UI will be implemented here */}
    </View>
  );
}
