/**
 * @license
 * Copyright 2025 Google LLC
 * Modifications Copyright 2026 Snap Inc.
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modifications:
 * Rewrote https://github.com/googleapis/js-genai/blob/v0.12.0/src/types.ts with the help of GenAI in order to best support the Gemini API in Lens Studio.
 *
 * Abide by Gemini API Terms of Service while using this code - https://ai.google.dev/gemini-api/terms
 */

export namespace GeminiTypes {
  export namespace Common {
    /**
     *  @link https://ai.google.dev/api/generate-content#HarmBlockThreshold
     */
    export type HarmBlockThreshold =
      | "HARM_BLOCK_THRESHOLD_UNSPECIFIED"
      | "BLOCK_LOW_AND_ABOVE"
      | "BLOCK_MEDIUM_AND_ABOVE"
      | "BLOCK_ONLY_HIGH"
      | "BLOCK_NONE"
      | string;

    /**
     *  @link https://ai.google.dev/api/caching#Type
     */
    export type SchemaType =
      | "TYPE_UNSPECIFIED"
      | "STRING"
      | "NUMBER"
      | "INTEGER"
      | "BOOLEAN"
      | "ARRAY"
      | "OBJECT"
      | string;

    /**
     * @link https://ai.google.dev/api/caching#Mode_1
     */
    export type FunctionCallingMode =
      | "MODE_UNSPECIFIED"
      | "AUTO"
      | "ANY"
      | "NONE"
      | string;

    /**
     * @link https://ai.google.dev/api/caching#Part
     */
    export interface Part {
      text?: string;
      inlineData?: Blob;
      fileData?: FileData;
      functionCall?: FunctionCall;
      functionResponse?: FunctionResponse;
      [key: string]: any;
    }

    /**
     * @link https://ai.google.dev/api/caching#Blob
     */
    export interface Blob {
      mimeType: string;
      data: string;
      [key: string]: any;
    }

    /**
     * @link https://ai.google.dev/api/caching#FileData
     */
    export interface FileData {
      mimeType: string;
      fileUri: string;
      [key: string]: any;
    }

    /**
     * @link https://ai.google.dev/api/caching#FunctionCall
     */
    export interface FunctionCall {
      name: string;
      id: string;
      args?: Record<string, any>;
      [key: string]: any;
    }

    /**
     * @link https://ai.google.dev/api/caching#FunctionResponse
     */
    export interface FunctionResponse {
      name?: string;
      id?: string;
      response?: Record<string, any>;
      [key: string]: any;
    }

    /**
     * @link https://ai.google.dev/api/caching#Content
     */
    export interface Content {
      parts: Part[];
      role?: "user" | "model" | "function" | "tool" | string;
      [key: string]: any;
    }

    /**
     * @link https://ai.google.dev/api/generate-content#v1beta.SafetySetting
     */
    export interface SafetySetting {
      category: string;
      threshold: HarmBlockThreshold;
      [key: string]: any;
    }

    /**
     * @link https://ai.google.dev/api/generate-content#v1beta.Candidate
     */
    export interface Candidate {
      content?: Content;
      finishReason?: string;
      index?: number;
      safetyRatings?: SafetyRating[];
      [key: string]: any;
    }

    /**
     * @link https://ai.google.dev/api/generate-content#v1beta.SafetyRating
     */
    export interface SafetyRating {
      category: string;
      probability?: string;
      blocked?: boolean;
      [key: string]: any;
    }

    /**
     * @link https://ai.google.dev/api/generate-content#PromptFeedback
     */
    export interface PromptFeedback {
      blockReason?: string;
      safetyRatings?: SafetyRating[];
      [key: string]: any;
    }

    /**
     * @link https://ai.google.dev/api/generate-content#UsageMetadata
     */
    export interface UsageMetadata {
      promptTokenCount?: number;
      candidatesTokenCount?: number;
      totalTokenCount?: number;
      [key: string]: any;
    }

    /**
     * @link https://ai.google.dev/api/caching#Schema
     */
    export interface Schema {
      type: SchemaType;
      format?: string;
      description?: string;
      nullable?: boolean;
      enum?: string[];
      properties?: Record<string, Schema>;
      items?: Schema;
      required?: string[];
      [key: string]: any;
    }

    /**
     * @link https://ai.google.dev/api/caching#FunctionDeclaration
     */
    export interface FunctionDeclaration {
      name: string;
      description: string;
      parameters?: Schema;
      [key: string]: any;
    }

    /**
     * @link https://ai.google.dev/api/caching#Tool
     */
    export interface Tool {
      functionDeclarations?: FunctionDeclaration[];
      [key: string]: any;
    }

    /**
     * @link https://ai.google.dev/api/caching#FunctionCallingConfig
     */
    export interface FunctionCallingConfig {
      mode?: FunctionCallingMode;
      allowedFunctionNames?: string[];
      [key: string]: any;
    }

    /**
     * @link https://ai.google.dev/api/caching#ToolConfig
     */
    export interface ToolConfig {
      functionCallingConfig?: FunctionCallingConfig;
      [key: string]: any;
    }

    /**
     * @link https://ai.google.dev/api/generate-content#SpeechConfig
     */
    export interface SpeechConfig {
      voiceConfig?: VoiceConfig;
      languageCode?: string;
      [key: string]: any;
    }

    /**
     * @link https://ai.google.dev/api/generate-content#PrebuiltVoiceConfig
     */
    export interface PrebuiltVoiceConfig {
      voiceName?: string;
    }

    /**
     * @link https://ai.google.dev/api/generate-content#VoiceConfig
     */
    export interface VoiceConfig {
      prebuiltVoiceConfig?: PrebuiltVoiceConfig;
    }

    /**
     * @link https://ai.google.dev/api/generate-content#v1beta.GenerationConfig
     */
    export interface GenerationConfig {
      candidateCount?: number;
      stopSequences?: string[];
      maxOutputTokens?: number;
      temperature?: number;
      topP?: number;
      topK?: number;
      responseMimeType?: "text/plain" | "application/json" | string;
      responseSchema?: Common.Schema;
      responseModalities?: string[];
      seed?: number;
      presencePenalty?: number;
      frequencyPenalty?: number;
      responseLogprobs?: boolean;
      logprobs?: number;
      enableEnhancedCivicAnswers?: boolean;
      speechConfig?: Common.SpeechConfig;
      thinkingConfig?: ThinkingConfig;
      mediaResolution?: string;
      [key: string]: any;
    }

    /**
     * @link https://ai.google.dev/api/generate-content#ThinkingConfig
     */
    export interface ThinkingConfig {
      [key: string]: any;
    }
  }

  export namespace Models {
    /**
     * @link https://ai.google.dev/api/generate-content
     */
    export interface GeminiGenerateContentRequestBody {
      contents: Common.Content[];
      safetySettings?: Common.SafetySetting[];
      generationConfig?: Common.GenerationConfig;
      tools?: Common.Tool[];
      toolConfig?: Common.ToolConfig;
      systemInstruction?: Common.Content;
      cachedContent?: string;
      [key: string]: any;
    }

    /**
     * Request to generate content using the Gemini API.
     * required fields:
     * - model: The model to use for content generation.
     * - type: The type of request, typically "generateContent".
     * - body: The body of the request containing the content and generation parameters.
     */
    export type GenerateContentRequest = {
      model: string;
      type: string;
      body: GeminiGenerateContentRequestBody;
      [key: string]: any;
    };

    /**
     * @link https://ai.google.dev/api/generate-content#v1beta.GenerateContentResponse
     */
    export interface GenerateContentResponse {
      candidates?: Common.Candidate[];
      promptFeedback?: Common.PromptFeedback;
      usageMetadata?: Common.UsageMetadata;
      [key: string]: any;
    }
  }

  export namespace Live {
    export interface ClientMessageBase {
      [key: string]: any;
    }

    export interface ServerMessageBase {
      [key: string]: any;
    }

    /**
     * @link https://ai.google.dev/api/live#ContextWindowCompressionConfig.SlidingWindow
     */
    export interface SlidingWindow {
      targetTokens?: number;
    }

    /**
     * @link https://ai.google.dev/api/live#contextwindowcompressionconfig
     */
    export interface ContextWindowCompression {
      triggerTokens?: number;
      slidingWindow?: SlidingWindow;
    }

    /**
     * @link https://ai.google.dev/api/live#bidigeneratecontentsetup
     */
    export interface Setup extends ClientMessageBase {
      setup: {
        model: string;
        generation_config?: Common.GenerationConfig;
        system_instruction?: Common.Content;
        tools?: Common.Tool[];
        contextWindowCompression?: ContextWindowCompression;
        input_audio_transcription?: Record<string, any>;
        output_audio_transcription?: Record<string, any>;
      };
    }

    // Realtime input interfaces
    export interface MediaChunk {
      mime_type: string;
      data: string;
    }

    /**
     * @link https://ai.google.dev/api/live#bidigeneratecontentrealtimeinput
     */
    export interface RealtimeInput extends ClientMessageBase {
      realtime_input: {
        media_chunks?: MediaChunk[];
        text?: string;
        activity_start?: boolean;
        activity_end?: boolean;
        audio_stream_end?: boolean;
        audio?: Common.Blob;
        video?: Common.Blob;
      };
    }

    /**
     * @link https://ai.google.dev/api/live#bidigeneratecontentclientcontent
     */
    export interface ClientContent extends ClientMessageBase {
      client_content: {
        turns?: Common.Content[];
        turn_complete?: boolean;
      };
    }

    /**
     * @link https://ai.google.dev/api/live#bidigeneratecontenttoolresponse
     */
    export interface ToolResponse extends ClientMessageBase {
      tool_response: {
        function_responses: Common.FunctionResponse[];
      };
    }

    /**
     * @link https://ai.google.dev/api/live#bidigeneratecontentsetupcomplete
     */
    export interface SetupCompleteEvent extends ServerMessageBase {
      setupComplete: Record<string, any>;
    }

    /**
     * @link https://ai.google.dev/api/live#BidiGenerateContentTranscription
     */
    export interface Transcription {
      text?: string;
    }

    /**
     * @link https://ai.google.dev/api/live#bidigeneratecontentservercontent
     */
    export interface ServerContentEvent extends ServerMessageBase {
      serverContent: {
        modelTurn?: Common.Content;
        turnComplete?: boolean;
        interrupted?: boolean;
        groundingMetadata?: Record<string, any>;
        generationComplete?: boolean;
        inputTranscription?: Transcription;
        outputTranscription?: Transcription;
      };
    }

    export interface ContentServerMessageEvent extends ServerMessageBase {
      content: Common.Content;
    }

    /**
     * @link https://ai.google.dev/api/live#bidigeneratecontenttoolcall
     */
    export interface ToolCallEvent extends ServerMessageBase {
      toolCall: {
        functionCalls?: Common.FunctionCall[];
      };
    }

    /**
     * @link https://ai.google.dev/api/live#bidigeneratecontenttoolcallcancellation
     */
    export interface ToolCallCancellationEvent extends ServerMessageBase {
      toolCallCancellation: {
        ids: string[];
      };
    }

    /**
     * @link https://ai.google.dev/api/live#bidigeneratecontenttranscription
     */
    export interface TranscriptionEvent extends ServerMessageBase {
      transcription: {
        text?: string;
      };
    }

    export interface UsageMetadataEvent extends ServerMessageBase {
      usageMetadata: {
        promptTokenCount?: number;
        cachedContentTokenCount?: number;
        responseTokenCount?: number;
        toolUsePromptTokenCount?: number;
        thoughtsTokenCount?: number;
        totalTokenCount?: number;
      };
    }

    /**
     * @link https://ai.google.dev/api/live#goaway
     */
    export interface GoAwayEvent extends ServerMessageBase {
      goAway: {
        timeLeft?: string;
      };
    }

    export type ClientMessage =
      | Setup
      | RealtimeInput
      | ClientContent
      | ToolResponse;

    export type ServerMessage =
      | ServerContentEvent
      | ContentServerMessageEvent
      | SetupCompleteEvent
      | ToolCallEvent
      | ToolCallCancellationEvent
      | TranscriptionEvent
      | UsageMetadataEvent
      | GoAwayEvent;
  }
}
