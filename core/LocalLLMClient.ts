import dotenv from 'dotenv';
dotenv.config();

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'deepseek-coder-v2';
const BRIXS_AI_API_KEY = process.env.BRIXS_AI_API_KEY || 'brixs-dev-key-123';

export interface LLMResponse {
  response: string;
  done: boolean;
}

export class LocalLLMClient {
  /**
   * Generates a completion from the local or tunneled Ollama instance.
   */
  public static async generate(prompt: string, options: any = {}): Promise<string> {
    try {
      console.log(`[BrixsAI] Requesting completion from ${OLLAMA_MODEL}...`);
      
      const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Brixs-API-Key': BRIXS_AI_API_KEY // Security layer for public tunnels
        },
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          prompt: prompt,
          stream: false,
          ...options
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`AI Service error: ${response.statusText} - ${errorText}`);
      }

      const data: any = await response.json();
      return data.response;
    } catch (error) {
      console.error("[BrixsAI] Error calling AI Service:", error);
      throw error;
    }
  }

  /**
   * Checks if the service is reachable.
   */
  public static async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
        headers: { 'X-Brixs-API-Key': BRIXS_AI_API_KEY }
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}
