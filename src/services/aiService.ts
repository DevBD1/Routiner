import OpenAI from 'openai';
import SettingsService, { AIModel } from './settingsService';
import { GoogleGenAI } from "@google/genai";
import { OPENAI_API_KEY, GEMINI_API_KEY, OLLAMA_HOST } from '@env';

const keysConfig = {
  OPENAI_API_KEY,
  GEMINI_API_KEY,
  OLLAMA_HOST
};

class AIService {
  private static instance: AIService;
  private openai: OpenAI;
  private settingsService: SettingsService;
  private gemini: GoogleGenAI;

  private constructor() {
    if (!keysConfig.OPENAI_API_KEY || !keysConfig.GEMINI_API_KEY || !keysConfig.OLLAMA_HOST) {
      throw new Error('Missing required environment variables');
    }

    this.openai = new OpenAI({
      apiKey: keysConfig.OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });
    this.settingsService = SettingsService.getInstance();
    this.gemini = new GoogleGenAI({ apiKey: keysConfig.GEMINI_API_KEY });
  }

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  async generateResponse(modelKey: string, prompt: string): Promise<string> {
    const models = this.settingsService.getAIModels();
    if (!models || !models[modelKey]) {
      console.error('[AIService] Invalid model key:', modelKey, models);
      throw new Error('Invalid model key');
    }

    const model = models[modelKey];
    console.log('[AIService] Selected modelKey:', modelKey);
    console.log('[AIService] Model object:', model);
    if (!model.available) {
      throw new Error('Selected model is not available');
    }

    if (model.type === 'openai') {
      return this.generateOpenAIResponse(model.model || '', prompt);
    } else if (model.type === 'ollama') {
      return this.generateOllamaResponse(prompt);
    } else if (model.type === 'gemini') {
      return this.generateGeminiResponse(model.model || '', prompt);
    }

    throw new Error('Unsupported model type');
  }

  private async generateOpenAIResponse(model: string, prompt: string): Promise<string> {
    try {
      console.log('[AIService] Sending to OpenAI model:', model);
      const completion = await this.openai.chat.completions.create({
        model: model,
        messages: [
          { role: "user", content: prompt },
        ],
      });

      return completion.choices[0].message.content || '';
    } catch (error) {
      console.error('Error generating OpenAI response:', error, 'Model:', model, 'Prompt:', prompt);
      if (error instanceof Error) {
        throw new Error(`OpenAI API Error: ${error.message}`);
      }
      throw new Error('Failed to generate OpenAI response');
    }
  }

  private async generateOllamaResponse(prompt: string): Promise<string> {
    try {
      const response = await fetch(`${keysConfig.OLLAMA_HOST}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama2',
          prompt: prompt,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (data && data.response) {
        return data.response;
      }
      throw new Error('Invalid response from Ollama API');
    } catch (error) {
      console.error('Error generating Ollama response:', error);
      if (error instanceof Error) {
        throw new Error(`Ollama API Error: ${error.message}`);
      }
      throw new Error('Failed to generate Ollama response');
    }
  }

  private async generateGeminiResponse(model: string, prompt: string): Promise<string> {
    try {
      console.log('[AIService] Sending to Gemini model:', model);
      const response = await this.gemini.models.generateContent({
        model: model,
        contents: prompt,
      });
      const text = response.text;
      if (!text) {
        throw new Error('Empty response from Gemini API');
      }
      return text;
    } catch (error) {
      console.error('Error generating Gemini response:', error, 'Model:', model, 'Prompt:', prompt);
      if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
      }
      throw new Error('Failed to generate Gemini response');
    }
  }
}

export default AIService; 