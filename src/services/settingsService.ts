import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_STORAGE_KEY = '@routiner_settings';
const SETTINGS_URL = 'https://raw.githubusercontent.com/DevBD1/Routiner/main/settings.json';
 
// Default settings to use as fallback
const DEFAULT_SETTINGS: Settings = {
  aiModels: {
    "ollama-3_2": {
      "name": "Ollama 3.2",
      "available": true,
      "type": "ollama" as const
    },
    "gpt-4_1-Nano": {
      "name": "ChatGPT 4.1 Nano",
      "available": true,
      "type": "openai" as const,
      "model": "gpt-4.1-nano-2025-04-14"
    },
    "gemini-flash": {
      "name": "Gemini 2.0 Flash",
      "available": true,
      "type": "gemini" as const,
      "model": "gemini-2.0-flash"
    }
  }
};

export interface AIModel {
  name: string;
  available: boolean;
  type: 'ollama' | 'openai' | 'gemini';
  model?: string;
}

export interface Settings {
  aiModels: {
    [key: string]: AIModel;
  };
}

class SettingsService {
  private static instance: SettingsService;
  private settings: Settings | null = null;

  private constructor() {}

  static getInstance(): SettingsService {
    if (!SettingsService.instance) {
      SettingsService.instance = new SettingsService();
    }
    return SettingsService.instance;
  }

  async initialize(): Promise<void> {
    try {
      // Try to get settings from AsyncStorage first
      const storedSettings = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
      
      if (storedSettings) {
        this.settings = JSON.parse(storedSettings);
      } else {
        // If no stored settings, try to fetch from remote
        try {
          await this.fetchSettings();
        } catch (error) {
          console.warn('Failed to fetch remote settings, using default settings:', error);
          this.settings = DEFAULT_SETTINGS;
          await this.saveSettings();
        }
      }
    } catch (error) {
      console.error('Error initializing settings:', error);
      // Use default settings as fallback
      this.settings = DEFAULT_SETTINGS;
      await this.saveSettings();
    }
  }

  private async fetchSettings(): Promise<void> {
    try {
      const response = await fetch(SETTINGS_URL);
      if (!response.ok) {
        throw new Error(`Failed to fetch settings: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      this.settings = data;
      await this.saveSettings();
    } catch (error) {
      console.error('Error fetching settings:', error);
      throw error;
    }
  }

  private async saveSettings(): Promise<void> {
    if (this.settings) {
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(this.settings));
    }
  }

  getSettings(): Settings | null {
    return this.settings;
  }

  getAIModels(): { [key: string]: AIModel } | null {
    return this.settings?.aiModels || null;
  }

  async updateAIModelAvailability(modelKey: string, available: boolean): Promise<void> {
    if (this.settings && this.settings.aiModels[modelKey]) {
      this.settings.aiModels[modelKey].available = available;
      await this.saveSettings();
    }
  }
}

export default SettingsService; 