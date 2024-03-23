import { google, Auth } from "googleapis";
import config from "../../config/config.js";

export const GoogleCalendarScope = "https://www.googleapis.com/auth/calendar";

class GoogleCalendarAPIHandler {
  // static method to initialize a class instance
  static init() {
    return new GoogleCalendarAPIHandler(
      config.providers.google.clientId,
      config.providers.google.clientSecret
    );
  }

  constructor(clientId, clientSecret) {
    this.oAuth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      "postmessage"
    );
    this.tokens = null;
  }

  /**
   * @param {GoogleAuthCredentials} tokens credentials
   */
  setTokens(tokens) {
    this.tokens = tokens;
    this.oAuth2Client.setCredentials(tokens);
  }

  async hasGrantedCalendarScopes() {
    if (!this.tokens || !this.tokens.access_token) return false;
    const tokenInfo = await this.oAuth2Client.getTokenInfo(this.tokens.access_token);
    return tokenInfo.scopes.includes(GoogleCalendarScope) && tokenInfo.access_type === "offline";
  }

  getAuthUrl() {
    const scopes = [GoogleCalendarScope];
    return this.oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
    });
  }

  async getTokens(code) {
    const { tokens } = await this.oAuth2Client.getToken(code);
    this.setTokens(tokens);
    return tokens;
  }

  async refreshToken() {
    if (this.tokens && this.tokens.refresh_token) {
      const { credentials } = await this.oAuth2Client.refreshToken(
        this.tokens.refresh_token
      );
      this.setTokens(credentials);
      return credentials;
    }
    throw new Error("Refresh token is not available");
  }

  async revokeCredentials() {
    await this.oAuth2Client.revokeCredentials();
  }

  async createEvent(eventData) {
    const calendar = google.calendar({
      version: "v3",
      auth: this.oAuth2Client,
    });
    const event = await calendar.events.insert({
      calendarId: "primary",
      resource: eventData,
    });
    return event.data;
  }

  async getEvents() {
    const calendar = google.calendar({
      version: "v3",
      auth: this.oAuth2Client,
    });
    const { data } = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });
    return data.items;
  }
}

export default GoogleCalendarAPIHandler;

/**
 * @typedef {Auth.Credentials} GoogleAuthCredentials
 */
