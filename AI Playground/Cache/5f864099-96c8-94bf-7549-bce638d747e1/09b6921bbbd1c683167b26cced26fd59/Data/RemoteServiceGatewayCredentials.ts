export enum AvaliableApiTypes {
  Snap3D = "Snap3D",
  OpenAI = "OpenAI",
  Gemini = "Gemini",
  DeepSeek = "DeepSeek",
}

@component
export class RemoteServiceGatewayCredentials extends BaseScriptComponent {
  @input()
  @label("Snap API Token")
  apiToken: string = "[PUT YOUR SNAP API TOKEN HERE]";
  @ui.label(
    '<span style="color: red;">⚠️ Do not include your API token when sharing or uploading this project to version control.</span>'
  )
  @ui.label(
    'For setup instructions, please visit: <a href="https://developers.snap.com/spectacles/about-spectacles-features/apis/remoteservice-gateway#setup-instructions" target="_blank">Remote Service Gateway Setup</a>'
  )
  private static token: string = "";
  onAwake() {
    RemoteServiceGatewayCredentials.token = this.apiToken;
  }

  static getApiToken(avaliableType: AvaliableApiTypes) {
    return RemoteServiceGatewayCredentials.token;
  }
}
