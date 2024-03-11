import axios from "axios";

class SendbirdCallsAPIHandler {
  constructor(appId, apiToken) {
    this.appId = appId;
    this.apiToken = apiToken;
    this.baseUrl = `https://api-${appId}.calls.sendbird.com/v1`;
    this.request = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
        "Api-Token": apiToken,
      },
    });
  }
}

export default SendbirdCallsAPIHandler;
