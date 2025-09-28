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
declare class SpeechToTaskParser {
    private genAI;
    private model;
    constructor(apiKey: string);
    /**
     * Convert speech to text and parse tasks or suggestions
     */
    parseSpeechtToTask(audioData: string | ArrayBuffer): Promise<TaskResult | SuggestionResult>;
    /**
     * Parse text directly for tasks and suggestions
     */
    parseTextForTasks(text: string): Promise<TaskResult | SuggestionResult>;
    /**
     * Mock speech-to-text function (replace with actual speech recognition API)
     */
    private speechToText;
    /**
     * Process continuous audio stream for real-time task detection
     */
    startContinuousListening(onTaskDetected: (result: TaskResult | SuggestionResult) => void, onError: (error: Error) => void): Promise<void>;
    /**
     * Enhanced parsing for smart glasses context
     */
    parseSmartGlassesContext(text: string, isFromOtherPerson?: boolean): Promise<TaskResult | SuggestionResult>;
}
export declare function createTaskParser(geminiApiKey: string): Promise<SpeechToTaskParser>;
export declare function exampleUsage(): Promise<void>;
export default SpeechToTaskParser;
//# sourceMappingURL=speech-to-task-parser.d.ts.map