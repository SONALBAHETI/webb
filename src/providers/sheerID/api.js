import axios from "axios";

class SheerIDAPIHandler {
  constructor(accessToken) {
    this.token = accessToken;
    this.baseUrl = `https://services.sheerid.com/rest/v2`;
    this.request = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
    });
  }
}

export default SheerIDAPIHandler;
