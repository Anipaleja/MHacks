"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Simple demo without requiring API key for basic testing
async function demo() {
    console.log('Speech-to-Task Parser Demo\n');
    console.log('This demo shows the structure without needing an API key');
    console.log('='.repeat(50));
    // Mock parser for demo purposes
    const mockParser = {
        async parseTextForTasks(text) {
            // Simple rule-based parsing for demo
            const lowerText = text.toLowerCase();
            if (lowerText.includes('hey yuri') || lowerText.includes('i need to') || lowerText.includes('i should')) {
                return {
                    originalText: text,
                    parsedTask: extractTask(text),
                    type: 'direct_command',
                    confidence: 0.85
                };
            }
            else if (lowerText.includes('can you help') || lowerText.includes('could you') || lowerText.includes('would you mind')) {
                return {
                    originalText: text,
                    suggestion: extractSuggestion(text),
                    type: 'contextual_suggestion',
                    confidence: 0.80
                };
            }
            else {
                return {
                    originalText: text,
                    parsedTask: text.replace(/^(i need to|i should|let me|i'll)\s*/i, '').trim(),
                    type: 'direct_command',
                    confidence: 0.70
                };
            }
        }
    };
    function extractTask(text) {
        return text
            .replace(/^(hey yuri,?\s*|i need to\s*|i should\s*)/i, '')
            .replace(/\s*(later|now|today|tomorrow)$/i, '')
            .trim()
            .replace(/^(\w)/, (match) => match.toUpperCase());
    }
    function extractSuggestion(text) {
        return text
            .replace(/^(can you help me\s*|could you\s*|would you mind\s*)/i, '')
            .replace(/^\w*ing\s*/, '')
            .replace(/^with\s*/, '')
            .trim()
            .replace(/^(\w)/, (match) => `Help with ${match.toLowerCase()}`);
    }
    const testCases = [
        "hey yuri, I need to get this document signed",
        "can you help me out with the presentation",
        "I should probably call mom later",
        "could you review these slides for me",
        "hey, can you help me find my keys",
        "yuri, remind me to schedule a meeting with the client",
        "would you mind helping me with this math problem"
    ];
    for (const testCase of testCases) {
        try {
            console.log(`\nInput: "${testCase}"`);
            const result = await mockParser.parseTextForTasks(testCase);
            if (result.type === 'direct_command') {
                console.log(`Task: "${result.parsedTask}"`);
                console.log(`Type: Direct Command`);
            }
            else {
                console.log(`Suggestion: "${result.suggestion}"`);
                console.log(`Type: Contextual Suggestion`);
            }
            console.log(`Confidence: ${(result.confidence * 100).toFixed(1)}%`);
            console.log('-'.repeat(30));
        }
        catch (error) {
            console.error(`Error processing: "${testCase}"`, error);
        }
    }
    console.log('\nTo use with real Gemini AI:');
    console.log('1. Get a Gemini API key from Google AI Studio');
    console.log('2. Set GEMINI_API_KEY environment variable');
    console.log('3. Run: npm run dev');
}
demo().catch(console.error);
//# sourceMappingURL=demo.js.map