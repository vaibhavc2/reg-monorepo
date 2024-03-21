import env from '@/config';
import { jwtCallback } from '@/utils';
import jt from 'jsonwebtoken';

interface Token {
  secret: string;
  expiresIn: string;
}

class JWTService {
  private readonly accessToken: Token;
  private readonly refreshToken: Token;
  private readonly emailToken: Token;

  constructor() {
    this.accessToken = {
      secret: env.ACCESS_TOKEN_SECRET,
      expiresIn: env.ACCESS_TOKEN_EXPIRY,
    };
    this.refreshToken = {
      secret: env.REFRESH_TOKEN_SECRET,
      expiresIn: env.REFRESH_TOKEN_EXPIRY,
    };
    this.emailToken = {
      secret: env.EMAIL_TOKEN_SECRET,
      expiresIn: env.EMAIL_TOKEN_EXPIRY,
    };
  }

  public generateAccessToken = async (userId: string) => {
    const accessToken = jt.sign(
      {
        id: userId,
      },
      this.accessToken.secret,
      {
        expiresIn: this.accessToken.expiresIn,
      },
    );
    return accessToken;
  };

  public generateRefreshToken = async (
    userId: string,
    email: string,
    username: string,
  ) => {
    const refreshToken = jt.sign(
      {
        id: userId,
        email,
        username,
      },
      this.refreshToken.secret,
      {
        expiresIn: this.refreshToken.expiresIn,
      },
    );
    return refreshToken;
  };

  public generateEmailToken = async (userId: string) => {
    const emailToken = jt.sign(
      {
        id: userId,
      },
      this.emailToken.secret,
      {
        expiresIn: this.emailToken.expiresIn,
      },
    );
    return emailToken;
  };

  public verifyAccessToken = async (token: string) => {
    return jt.verify(token, this.accessToken.secret, jwtCallback);
  };

  public verifyRefreshToken = async (token: string) => {
    return jt.verify(token, this.refreshToken.secret, jwtCallback);
  };

  public verifyEmailToken = async (token: string) => {
    return jt.verify(token, this.emailToken.secret, jwtCallback);
  };
}

export const jwt = new JWTService();
