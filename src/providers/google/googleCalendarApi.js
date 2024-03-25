import { google, Auth } from "googleapis";
import config from "../../config/config.js";

export const GoogleCalendarScope = "https://www.googleapis.com/auth/calendar";

class GoogleCalendarAPIHandler {
  /**
   * @param {User} user
   */
  constructor(user) {
    // initialize variables
    this.oAuth2Client = new google.auth.OAuth2(
      config.providers.google.clientId,
      config.providers.google.clientSecret,
      "postmessage"
    );
    this.oAuth2Client.forceRefreshOnFailure = true;
    this.user = user;
    this.setTokens({
      access_token: user.integrations.google.accessToken,
      refresh_token: user.integrations.google.refreshToken,
      expiry_date: user.integrations.google.expiryDate,
    });

    // save access tokens to DB when tokens are generated or refreshed
    this.oAuth2Client.on("tokens", async (tokens) => {
      this.setTokens(tokens);
      const valid = await this.hasGrantedCalendarScopes();
      if (valid) {
        const { access_token, refresh_token, expiry_date } = tokens;
        if (access_token) {
          this.user.integrations.google.accessToken = access_token;
        }
        if (refresh_token) {
          this.user.integrations.google.refreshToken = refresh_token;
        }
        if (expiry_date) {
          this.user.integrations.google.expiryDate = expiry_date;
        }
        await this.user.save();
      } else {
        await this.revokeCredentials();
      }
    });
  }

  /**
   * @param {GoogleAuthCredentials} tokens credentials
   */
  setTokens(tokens) {
    this.tokens = tokens;
    this.oAuth2Client.setCredentials(tokens);
  }

  /**
   * @param {Auth.TokenInfo} tokenInfo
   */
  _tokenInfoIncludesCalendarScope(tokenInfo) {
    return (
      tokenInfo.scopes.includes(GoogleCalendarScope) &&
      tokenInfo.access_type === "offline"
    );
  }

  async getTokenInfo() {
    const tokenInfo = await this.oAuth2Client.getTokenInfo(
      this.tokens.access_token
    );
    return tokenInfo;
  }

  async hasGrantedCalendarScopes() {
    if (!this.tokens || !this.tokens.access_token) return false;
    try {
      const tokenInfo = await this.getTokenInfo();
      return this._tokenInfoIncludesCalendarScope(tokenInfo);
    } catch (error) {
      if (error.status === 400) {
        await this.refreshToken();
        const tokenInfo = await this.getTokenInfo();
        return this._tokenInfoIncludesCalendarScope(tokenInfo);
      }
      throw error;
    }
  }

  async generateTokens(code) {
    const { tokens } = await this.oAuth2Client.getToken(code);
    this.setTokens(tokens);
    const valid = await this.hasGrantedCalendarScopes();
    if (!valid) throw new Error("Calendar permissions are not granted");
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
    this.user.integrations.google.accessToken = null;
    this.user.integrations.google.refreshToken = null;
    await this.user.save();
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
 * @typedef {import("../../models/user.model.js").User} User
 */
