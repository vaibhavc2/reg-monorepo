import env from '@/config';
import ct from '@/constants';
import { OAuth2Client } from 'google-auth-library';

export class GoogleOAuthService {
  private client: OAuth2Client;

  constructor() {
    this.client = new OAuth2Client(
      env.GOOGLE_OAUTH_CLIENT_ID,
      env.GOOGLE_OAUTH_CLIENT_SECRET,
      `${env.SERVER_BASE_URL}${ct.routes.oauth.google}`,
    );
  }

  public getAuthorizationUrl() {
    return this.client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: ['email', 'profile'],
    });
  }

  public async getAccessToken(code: string) {
    const { tokens } = await this.client.getToken(code);
    return tokens;
  }

  public async verifyIdToken(idToken: string) {
    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: env.GOOGLE_OAUTH_CLIENT_ID,
    });
    return ticket.getPayload();
  }

  public async revokeToken(token: string) {
    await this.client.revokeToken(token);
  }

  public async getUserInfo(accessToken: string) {
    const response = await this.client.request({
      url: 'https://www.googleapis.com/oauth2/v1/userinfo',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  }

  public async refreshAccessToken(refreshToken: string) {
    const { tokens } = await this.client.getToken(refreshToken);
    return tokens;
  }
}
