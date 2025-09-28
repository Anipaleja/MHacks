import { GoogleGenerativeAI } from '@google/generative-ai';

interface TaskResult {
  originalText: string;
  parsedTask: string;
  type: 'direct_command';
  confidence: number;
}

interface SuggestionResult {
  originalText: string;
  suggestion: string;
  type: 'contextual_suggestion';
  confidence: number;
}

class SpeechToTaskParser {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  /**
   * Convert speech to text and parse tasks or suggestions
   */
  async parseSpeechtToTask(audioData: string | ArrayBuffer): Promise<TaskResult | SuggestionResult> {
    try {
      // First, convert speech to text (this would need actual speech-to-text API)
      const speechText = await this.speechToText(audioData);
      
      // Then parse the text for tasks or suggestions
      return await this.parseTextForTasks(speechText);
    } catch (error) {
      console.error('Error parsing speech to task:', error);
      throw error;
    }
  }

  /**
   * Parse text directly for tasks and suggestions
   */
  async parseTextForTasks(text: string): Promise<TaskResult | SuggestionResult> {
    const prompt = `
You are an AI assistant that helps parse conversational speech into actionable tasks or suggestions. 

Analyze the following text and determine if it contains:
1. A direct command/task (like "hey yuri, I need to get this document signed")
2. A contextual request from someone else (like "can you help me out with x and y")

For direct commands, extract the core task in a concise format.
For contextual requests, provide a suggestion for what the user should do.

Text to analyze: "${text}"

Respond in JSON format with:
{
  "type": "direct_command" | "contextual_suggestion",
  "originalText": "the original text",
  "parsedTask": "concise task for direct commands" | null,
  "suggestion": "suggested action for contextual requests" | null,
  "confidence": 0.0-1.0,
  "reasoning": "brief explanation"
}

Examples:
- "hey yuri, I need to get this document signed" → {"type": "direct_command", "parsedTask": "Get document signed", "confidence": 0.95}
- "can you help me out with the presentation" → {"type": "contextual_suggestion", "suggestion": "Help with presentation", "confidence": 0.90}
- "I should probably call mom later" → {"type": "direct_command", "parsedTask": "Call mom", "confidence": 0.85}
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text();
      
      // Parse the JSON response
      const parsedResponse = JSON.parse(responseText);
      
      if (parsedResponse.type === 'direct_command') {
        return {
          originalText: text,
          parsedTask: parsedResponse.parsedTask,
          type: 'direct_command',
          confidence: parsedResponse.confidence
        };
      } else {
        return {
          originalText: text,
          suggestion: parsedResponse.suggestion,
          type: 'contextual_suggestion',
          confidence: parsedResponse.confidence
        };
      }
    } catch (error) {
      console.error('Error parsing text with Gemini:', error);
      throw error;
    }
  }

  /**
   * Mock speech-to-text function (replace with actual speech recognition API)
   */
  private async speechToText(audioData: string | ArrayBuffer): Promise<string> {
    // This is a placeholder - you would integrate with a real speech-to-text service
    // like Google Cloud Speech-to-Text, Azure Speech Services, or Web Speech API
    
    if (typeof audioData === 'string') {
      // If it's already text (for testing), return it
      return audioData;
    }
    
    // For actual implementation, you might use:
    // - Web Speech API (browser): new webkitSpeechRecognition()
    // - Google Cloud Speech-to-Text API
    // - Azure Cognitive Services Speech API
    // - OpenAI Whisper API
    
    throw new Error('Speech-to-text not implemented. Please integrate with your preferred STT service.');
  }

  /**
   * Process continuous audio stream for real-time task detection
   */
  async startContinuousListening(
    onTaskDetected: (result: TaskResult | SuggestionResult) => void,
    onError: (error: Error) => void
  ): Promise<void> {
    // This would set up continuous speech recognition
    // For demo purposes, here's the structure:
    
    try {
      // Set up speech recognition (Web Speech API example)
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onresult = async (event: any) => {
          const transcript = event.results[event.results.length - 1][0].transcript;
          
          try {
            const result = await this.parseTextForTasks(transcript);
            onTaskDetected(result);
          } catch (error) {
            onError(error as Error);
          }
        };
        
        recognition.onerror = (event: any) => {
          onError(new Error(`Speech recognition error: ${event.error}`));
        };
        
        recognition.start();
      } else {
        throw new Error('Speech recognition not supported in this browser');
      }
    } catch (error) {
      onError(error as Error);
    }
  }

  /**
   * Enhanced parsing for smart glasses context
   */
  async parseSmartGlassesContext(text: string, isFromOtherPerson: boolean = false): Promise<TaskResult | SuggestionResult> {
    const contextPrompt = `
You are an AI assistant for smart glasses that helps parse conversational speech. 
${isFromOtherPerson ? 'The speaker is someone else talking TO the user.' : 'The speaker is the user themselves.'}

Context: Smart glasses scenario where the user might receive requests from others or give themselves tasks.

Text: "${text}"

If someone else is asking for help, provide a suggestion for what the user should do.
If the user is giving themselves a task, extract the core action.

Respond in JSON format with the same structure as before, but consider the smart glasses context.
`;

    try {
      const result = await this.model.generateContent(contextPrompt);
      const response = await result.response;
      const responseText = response.text();
      const parsedResponse = JSON.parse(responseText);
      
      if (parsedResponse.type === 'direct_command') {
        return {
          originalText: text,
          parsedTask: parsedResponse.parsedTask,
          type: 'direct_command',
          confidence: parsedResponse.confidence
        };
      } else {
        return {
          originalText: text,
          suggestion: parsedResponse.suggestion,
          type: 'contextual_suggestion',
          confidence: parsedResponse.confidence
        };
      }
    } catch (error) {
      console.error('Error parsing smart glasses context:', error);
      throw error;
    }
  }
}

// Usage example
export async function createTaskParser(geminiApiKey: string): Promise<SpeechToTaskParser> {
  return new SpeechToTaskParser(geminiApiKey);
}

// Example usage
export async function exampleUsage() {
  const apiKey = process.env.GEMINI_API_KEY || 'your-gemini-api-key-here';
  const parser = new SpeechToTaskParser(apiKey);
  
  // Example 1: Direct task
  const directTask = await parser.parseTextForTasks("hey yuri, I need to get this document signed");
  console.log('Direct task:', directTask);
  // Output: { originalText: "hey yuri, I need to get this document signed", parsedTask: "Get document signed", type: "direct_command", confidence: 0.95 }
  
  // Example 2: Contextual suggestion
  const contextualRequest = await parser.parseTextForTasks("can you help me out with the presentation and review the slides");
  console.log('Contextual suggestion:', contextualRequest);
  // Output: { originalText: "can you help me out with the presentation and review the slides", suggestion: "Help with presentation and review slides", type: "contextual_suggestion", confidence: 0.90 }
  
  // Example 3: Smart glasses context
  const smartGlassesContext = await parser.parseSmartGlassesContext("hey, could you help me find my keys?", true);
  console.log('Smart glasses suggestion:', smartGlassesContext);
  // Output: { originalText: "hey, could you help me find my keys?", suggestion: "Help find keys", type: "contextual_suggestion", confidence: 0.88 }
}

export default SpeechToTaskParser;