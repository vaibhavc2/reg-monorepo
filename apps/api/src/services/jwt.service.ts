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

  public generateAccessToken = (userId: number) => {
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

  public generateRefreshToken = (userId: number, email: string) => {
    const refreshToken = jt.sign(
      {
        id: userId,
        email,
      },
      this.refreshToken.secret,
      {
        expiresIn: this.refreshToken.expiresIn,
      },
    );
    return refreshToken;
  };

  public generateAuthTokens = (userId: number, email: string) => {
    const accessToken = this.generateAccessToken(userId);
    const refreshToken = this.generateRefreshToken(userId, email);

    return { accessToken, refreshToken };
  };

  public generateEmailToken = (userId: number) => {
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

  public verifyAccessToken: (token: string) => { id: number } = (
    token: string,
  ) => {
    return jt.verify(
      token,
      this.accessToken.secret,
      jwtCallback,
    ) as unknown as { id: number };
  };

  public verifyRefreshToken: (token: string) => { id: number; email: string } =
    (token: string) => {
      return jt.verify(
        token,
        this.refreshToken.secret,
        jwtCallback,
      ) as unknown as { id: number; email: string };
    };

  public verifyEmailToken: (token: string) => { id: number } = (
    token: string,
  ) => {
    return jt.verify(token, this.emailToken.secret, jwtCallback) as unknown as {
      id: number;
    };
  };
}

export const jwt = new JWTService();
