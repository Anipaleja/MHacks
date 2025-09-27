import {
  AvaliableApiTypes,
  RemoteServiceGatewayCredentials,
} from "../RemoteServiceGatewayCredentials";

import { OpenAITypes } from "./OpenAITypes";

import Event from "../Utils/Event";

const RSM_CHATCOMPLETIONS = requireAsset(
  "./RemoteServiceModules/OpenAi_Completions.remoteServiceModule"
) as RemoteServiceModule

const RSM_IMAGEGENERATIONS = requireAsset(
  "./RemoteServiceModules/OpenAi_Generations.remoteServiceModule"
) as RemoteServiceModule

const RSM_SPEECH = requireAsset(
  "./RemoteServiceModules/OpenAi_Speech.remoteServiceModule"
) as RemoteServiceModule

const RSM_REALTIME = requireAsset(
  "./RemoteServiceModules/OpenAi_Realtime.remoteServiceModule"
) as RemoteServiceModule

const RMM = require("LensStudio:RemoteMediaModule") as RemoteMediaModule;

export class OpenAI {
    /**
     * Performs a chat completion request to the OpenAI API.
     * @param gptRequest The request object containing the chat completion parameters.
     * @returns A promise that resolves with the chat completion response.
     * @link https://platform.openai.com/docs/api-reference/chat/create
     */
    static chatCompletions(
        gptRequest: OpenAITypes.ChatCompletions.Request
      ): Promise<OpenAITypes.ChatCompletions.Response> {
        return new Promise<OpenAITypes.ChatCompletions.Response>((resolve, reject) => {
          var submitApiRequest = RemoteApiRequest.create();
          let apiToken = RemoteServiceGatewayCredentials.getApiToken(
                AvaliableApiTypes.OpenAI
          );
          submitApiRequest.endpoint = "chat_completions";
          submitApiRequest.parameters = {
            "api-token": apiToken
          }
          let textBody = JSON.stringify(gptRequest)
          submitApiRequest.body = textBody
        
          RSM_CHATCOMPLETIONS.performApiRequest(submitApiRequest, function (resp) {
            if (resp.statusCode == 1) {
              var bodyJson = JSON.parse(resp.body) as OpenAITypes.ChatCompletions.Response;
              resolve(bodyJson);
            } 
            else {
              reject(resp.body);
            }
          });
        });
    };

    /**
     * 
     * @param imagesGenerateRequest The request object containing the image generation parameters.
     * @returns a promise that resolves with the image generation response.
     * @link https://platform.openai.com/docs/api-reference/images/create
     */
    static imagesGenerate(
      imagesGenerateRequest: OpenAITypes.ImageGenerate.Request
    ): Promise<OpenAITypes.ImageGenerate.Response> {
      return new Promise<OpenAITypes.ImageGenerate.Response>((resolve, reject) => {
      var submitApiRequest = RemoteApiRequest.create();
        let apiToken = RemoteServiceGatewayCredentials.getApiToken(
              AvaliableApiTypes.OpenAI
        );
        submitApiRequest.endpoint = "images_generations";
        submitApiRequest.parameters = {
          "api-token": apiToken
        }
        let textBody = JSON.stringify(imagesGenerateRequest)
        submitApiRequest.body = textBody

        RSM_IMAGEGENERATIONS.performApiRequest(submitApiRequest, function (resp) {
          if(resp.statusCode == 1) {
            var bodyJson = JSON.parse(resp.body) as OpenAITypes.ImageGenerate.Response
            resolve(bodyJson);
          }
          else{
            reject(resp.body);
          }
        })
      });
    }

    /**
     * Performs a speech synthesis request to the OpenAI API.
     * @param speechRequest The request object containing the speech synthesis parameters.
     * @returns A promise that resolves with an AudioTrackAsset containing the synthesized speech.
     * @link https://platform.openai.com/docs/api-reference/audio/createSpeech
     */
    static speech(
      speechRequest: OpenAITypes.Speech.Request
    ){
      return new Promise<AudioTrackAsset>((resolve, reject) => {
        var submitApiRequest = RemoteApiRequest.create();
        let apiToken = RemoteServiceGatewayCredentials.getApiToken(
              AvaliableApiTypes.OpenAI
        );
        submitApiRequest.endpoint = "audio_speech";
        submitApiRequest.parameters = {
          "api-token": apiToken
        }
        let textBody = JSON.stringify(speechRequest)
        submitApiRequest.body = textBody

        RSM_SPEECH.performApiRequest(submitApiRequest, function (resp) {
          if(resp.statusCode == 1) {
            let resource = resp.asResource();
            RMM.loadResourceAsAudioTrackAsset(resource, 
              (aud)=>{
                resolve(aud);
              }, 
              (error) => {
                reject(error);
              }
            )
          }
          else{
            reject(resp.body);
          }
        })
      }
    )}

    /**
     * Creates a new OpenAI Realtime WebSocket session.
     * @param sessionRequest The request object containing the session parameters.
     * @returns An instance of OpenAIRealtimeWebsocket.
     * @link https://platform.openai.com/docs/api-reference/realtime-sessions/create
     */
    static createRealtimeSession(
      sessionRequest: OpenAITypes.Realtime.RequestSession
    ): OpenAIRealtimeWebsocket{
      let openAIWebsocket = new OpenAIRealtimeWebsocket(sessionRequest);
      return openAIWebsocket;
    }
}

export class OpenAIRealtimeWebsocket {
  private _websocket: WebSocket;

  /**
   * Event triggered when a message is received from the OpenAI Realtime API.
   * @type {Event<OpenAITypes.Realtime.ServerMessage>}
   */
  public onMessage = new Event<OpenAITypes.Realtime.ServerMessage>();
  public onError = new Event<WebSocketEvent>();
  public onOpen = new Event<WebSocketEvent>();
  public onClose = new Event<WebSocketCloseEvent>();

  constructor(sessionRequest: OpenAITypes.Realtime.RequestSession) {
    this.connect(sessionRequest);
  }

  private connect(
    sessionRequest: OpenAITypes.Realtime.RequestSession
  ){
    let apiToken = RemoteServiceGatewayCredentials.getApiToken(
      AvaliableApiTypes.OpenAI
    );

    this._websocket = RSM_REALTIME.createAPIWebSocket("real_time", { 
      "api-token": apiToken,
      "OpenAI-Beta": "realtime=v1",
      "model": sessionRequest.model
    });
    
    this._websocket.addEventListener("error", (event) => {
      this.onError.invoke(event);
    });

    this._websocket.addEventListener("message", (event: WebSocketMessageEvent) => {
      let msg = JSON.parse(event.data.toString()) as OpenAITypes.Realtime.ServerMessage;
      this.onMessage.invoke(msg);
    });

    this._websocket.addEventListener("open", (event) => {
      this.onOpen.invoke(event);
    });

    this._websocket.addEventListener("close", (event: WebSocketCloseEvent) => {
      this.onClose.invoke(event);
    });
    
  }

  /**
   *  Sends a message to the OpenAI Realtime WebSocket.
   * @param message The message to send to the OpenAI Realtime WebSocket.
   */
  send(message: OpenAITypes.Realtime.ClientMessage){
    if(this._websocket.readyState == WebSocketReadyState.OPEN){
      this._websocket.send(JSON.stringify(message));
    }
  }

  /**
   * Overrides the default send method to allow sending raw messages.
   * @param message The raw message to send.
   */
  overrideSend(message: any){
    if(this._websocket.readyState == WebSocketReadyState.OPEN){
      this._websocket.send(message);
    }
  }

  /**
   * Checks if the WebSocket connection is currently connected.
   * @returns {boolean} True if the WebSocket is connected, false otherwise.
   */
  isConnected(){
    return this._websocket.readyState == WebSocketReadyState.OPEN;
  }

  /**
   * Closes the WebSocket connection.
   */
  close(){
    this._websocket.close();
  }
}

enum WebSocketReadyState {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
}
