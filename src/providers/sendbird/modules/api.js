import axios from "axios";

class SendbirdAPIHandler {
  constructor(appId, apiToken) {
    this.appId = appId;
    this.apiToken = apiToken;
    this.baseUrl = `https://api-${appId}.sendbird.com/v3`;
    this.request = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
        "Api-Token": apiToken,
      },
    });
  }
}

export default SendbirdAPIHandler;
