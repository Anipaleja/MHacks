import SpeechToTaskParser from './speech-to-task-parser';

async function testWithRealAPI() {
  // Use your Gemini API key
  const apiKey = 'AIzaSyAi7Xg09nuAdiI3C-JAAHsmzyeOsgONOHc';
  const parser = new SpeechToTaskParser(apiKey);

  console.log('🚀 Testing Speech-to-Task Parser with Real Gemini AI\n');
  console.log('=' .repeat(50));

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
      console.log(`\n📝 Input: "${testCase}"`);
      console.log('🤖 Processing with Gemini AI...');
      
      const result = await parser.parseTextForTasks(testCase);
      
      if (result.type === 'direct_command') {
        console.log(`✅ Task: "${result.parsedTask}"`);
        console.log(`🎯 Type: Direct Command`);
      } else if (result.type === 'contextual_suggestion') {
        console.log(`💡 Suggestion: "${(result as any).suggestion}"`);
        console.log(`🎯 Type: Contextual Suggestion`);
      }
      
      console.log(`📊 Confidence: ${(result.confidence * 100).toFixed(1)}%`);
      console.log('-'.repeat(40));
      
    } catch (error) {
      console.error(`❌ Error processing: "${testCase}"`, error);
      console.log('-'.repeat(40));
    }
  }

  // Test smart glasses context
  console.log('\n👓 Testing Smart Glasses Context...');
  try {
    const smartGlassesResult = await parser.parseSmartGlassesContext(
      "hey, could you help me find my keys?", 
      true // isFromOtherPerson
    );
    
    console.log(`\n📝 Smart Glasses Input: "hey, could you help me find my keys?" (from another person)`);
    if (smartGlassesResult.type === 'contextual_suggestion') {
      console.log(`💡 AI Suggestion: "${(smartGlassesResult as any).suggestion}"`);
    }
    console.log(`📊 Confidence: ${(smartGlassesResult.confidence * 100).toFixed(1)}%`);
    
  } catch (error) {
    console.error('❌ Error in smart glasses test:', error);
  }
}

testWithRealAPI().catch(console.error);