# Remote Service Gateway

The Remote Service Gateway provides a secure and convenient package of trusted remote APIs for integration into your Spectacles Lenses.

For additional details, visit: https://developers.snap.com/spectacles/about-spectacles-features/apis/remoteservice-gateway

## Documentation and API Reference

### Getting Started

1.  **Import the Prefab**: Drag the RemoteServiceGatewayExamples.prefab from the RemoteServiceGateway/Prefabs/ directory into your scene.
2.  **Configure API Token**: Select the RemoteServiceGatewayCredentials object in your scene. In the Inspector panel, input your unique api-token. This will grant you access to the supported trusted remote APIs within your Lens.

### Currently Supported APIs

The following APIs are currently available through the Remote Service Gateway:

#### Externally Hosted APIs
These APIs are integrated externally hosted APIs from trusted partners

* **[OpenAI](https://platform.openai.com/docs/api-reference/introduction)**  
    * **Chat Completions** - Generate conversational AI responses using GPT models
    * **Image Generation** - Create images from text descriptions
    * **Create Speech** - Convert text to natural-sounding speech audio
    * **Realtime** - Real-time conversational AI with voice capabilities

* **[Gemini](https://ai.google.dev/gemini-api/docs)**  
    * **Model** - Access Google's Gemini large language models for multimodal generations
    * **Live** - Real-time conversation AI interactions with voice and video capabilities

#### Hosted by Snap
These APIs are provided and hosted directly by Snap

* **[Deepseek](https://api-docs.deepseek.com/api/create-chat-completion)**
    * **Chat Completions with Deepseek-R1 Reasoning** - Advanced AI chat with step-by-step reasoning capabilities

* **Snap3D**
    * **Text to 3D** - Generate 3D models and assets from text descriptions

### Working with Examples
Example usages of every API are in the scene as SceneObjects with the prefix "Example". Configure each of them in the inspector to enable them to Run On Tap to try them out! For Websocket APIs you can enable ExampleOpenAIRealtime OR ExampleGeminiLive to test running realtime models with microphone input.

### Helper Scripts

The package includes utility scripts to simplify media handling for AI integrations:

* **VideoController** - Captures and encodes camera frames for visual AI processing
* **MicrophoneRecorder** - Manages microphone input and audio frame recording
* **AudioProcessor** - Buffers and formats audio data for external services
* **DynamicAudioOutput** - Handles playback of PCM16 audio from generative AI models

These helpers streamline integration with APIs requiring audio/visual input or supporting audio output.