import SpeechToTaskParser from './speech-to-task-parser';

// Import types by re-declaring them locally
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

async function main() {
  // Initialize the parser with your Gemini API key
  const apiKey = process.env.GEMINI_API_KEY || 'your-gemini-api-key-here';
  const parser = new SpeechToTaskParser(apiKey);

  // Example scenarios
  const testCases = [
    // Direct commands to Yuri
    "hey yuri, I need to get this document signed",
    "yuri, remind me to call mom later",
    "I should probably schedule a meeting with the client",
    
    // Contextual requests from others (smart glasses scenario)
    "can you help me out with the presentation",
    "could you review these slides for me",
    "hey, can you help me find my keys",
    "would you mind helping me with this math problem",
    
    // Mixed scenarios
    "I need to pick up groceries after work",
    "can you assist me with setting up this equipment"
  ];

  console.log('Speech-to-Task Parser Examples\n');
  console.log('=' .repeat(50));

  for (const testCase of testCases) {
    try {
      console.log(`\nInput: "${testCase}"`);
      
      const result = await parser.parseTextForTasks(testCase);
      
      if (result.type === 'direct_command') {
        console.log(`Task: "${result.parsedTask}"`);
        console.log(`Type: Direct Command`);
      } else if (result.type === 'contextual_suggestion') {
        console.log(`Suggestion: "${(result as any).suggestion}"`);
        console.log(`Type: Contextual Suggestion`);
      }
      
      console.log(`Confidence: ${(result.confidence * 100).toFixed(1)}%`);
      console.log('-'.repeat(30));
      
    } catch (error) {
      console.error(`Error processing: "${testCase}"`, error);
    }
  }

  // Example of continuous listening setup
  console.log('\nSetting up continuous listening example...');
  
  try {
    await parser.startContinuousListening(
      (result) => {
        console.log('Task detected:', result);
        
        if (result.type === 'direct_command') {
          console.log(`New task: ${result.parsedTask}`);
          // Here you could add the task to a todo list, calendar, etc.
        } else {
          console.log(`Suggestion: ${(result as SuggestionResult).suggestion ?? 'No suggestion available'}`);
          // Here you could show a notification or prompt to the user
        }
      },
      (error) => {
        console.error('Listening error:', error);
      }
    );
  } catch (error) {
    console.log('Continuous listening not available in this environment');
    console.log('   (requires browser with Web Speech API support)');
  }
}

// Run the examples
if (typeof require !== 'undefined' && require.main === module) {
  main().catch(console.error);
}

export default main;