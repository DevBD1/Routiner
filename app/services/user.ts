import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_ID_KEY = 'user_id';

export const getUserId = async () => {
  let userId = await AsyncStorage.getItem(USER_ID_KEY);
  if (!userId) {
    userId = Device.osInternalBuildId || 'unknown';
    await AsyncStorage.setItem(USER_ID_KEY, userId);
  }
  return userId;
};
