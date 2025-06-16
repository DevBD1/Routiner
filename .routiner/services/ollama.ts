import { Platform } from 'react-native';

// Configuration
const OLLAMA_BACKEND_URL = 'http://localhost:3001/api/generate'; // Update with your backend URL

// Debug logging utility
const debugLog = (section: string, data: any) => {
  console.log(`[Ollama Debug] ${section}:`, JSON.stringify(data, null, 2));
};

export class OllamaError extends Error {
  constructor(message: string, public details?: any) {
    super(message);
    this.name = 'OllamaError';
  }
}

// Check if running in web environment
const isWebEnvironment = Platform.OS === 'web';

// API Functions
export const generateResponse = async (prompt: string): Promise<string> => {
  debugLog('API Request', {
    host: OLLAMA_BACKEND_URL,
    prompt,
    environment: isWebEnvironment ? 'web' : 'native',
    timestamp: new Date().toISOString()
  });

  try {
    const response = await fetch(OLLAMA_BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    if (!response.ok) {
      throw new OllamaError('Failed to fetch from backend', { status: response.status });
    }
    const data = await response.json();
    if (data && data.response) {
      debugLog('AI Response', {
        response: data.response,
        timestamp: new Date().toISOString()
      });
      return data.response;
    }
    throw new OllamaError('Invalid response from backend');
  } catch (error: unknown) {
    debugLog('Error Details', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      environment: isWebEnvironment ? 'web' : 'native'
    });

    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new OllamaError('Cannot connect to Ollama server. Please check if the server is running and accessible.', {
        type: 'CONNECTION_ERROR',
        originalError: error
      });
    }

    throw new OllamaError('Failed to generate response', { originalError: error });
  }
};

// Helper function to extract numeric values from text
export const extractNumericValue = (text: string): number => {
  debugLog('Value Extraction', {
    input: text,
    timestamp: new Date().toISOString()
  });

  const numberMatch = text.match(/\d+/);
  const result = numberMatch ? parseInt(numberMatch[0], 10) : 0;

  debugLog('Extraction Result', {
    matchedText: numberMatch ? numberMatch[0] : null,
    extractedValue: result,
    timestamp: new Date().toISOString()
  });

  return result;
}; 