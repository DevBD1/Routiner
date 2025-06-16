import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import SettingsService from '../services/settingsService';
import { AIModel } from '../services/settingsService';
 
interface AIModelSelectorProps {
  selectedModel: string;
  setSelectedModel: (modelKey: string) => void;
}

const AIModelSelector: React.FC<AIModelSelectorProps> = ({ selectedModel, setSelectedModel }) => {
  const [models, setModels] = useState<{ [key: string]: AIModel } | null>(null);
  const settingsService = SettingsService.getInstance();

  useEffect(() => {
    const initializeSettings = async () => {
      await settingsService.initialize();
      const loadedModels = settingsService.getAIModels();
      setModels(loadedModels);
      // If the current selectedModel is not available, set the first available
      if (loadedModels && (!selectedModel || !loadedModels[selectedModel] || !loadedModels[selectedModel].available)) {
        const firstAvailable = Object.entries(loadedModels).find(([, model]) => model.available);
        if (firstAvailable) setSelectedModel(firstAvailable[0]);
      }
    };
    initializeSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleModelChange = (modelKey: string) => {
    setSelectedModel(modelKey);
  };

  if (!models) {
    return (
      <View style={styles.container}>
        <Text>Loading AI models...</Text>
      </View>
    );
  }

  // Only show available models in the Picker
  const availableModels = Object.entries(models).filter(([, model]) => model.available);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Model Options</Text>
      <Picker
        selectedValue={selectedModel}
        onValueChange={handleModelChange}
        style={{ backgroundColor: '#222', color: '#fff', borderRadius: 8 }}
        dropdownIconColor="#fff"
      >
        {availableModels.map(([key, model]) => (
          <Picker.Item
            key={key}
            label={`${model.name} (${model.type})`}
            value={key}
          />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default AIModelSelector; 