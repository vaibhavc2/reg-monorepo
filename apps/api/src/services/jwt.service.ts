import env from '@/config';
import { ApiError } from '@/utils';
import jt from 'jsonwebtoken';

interface Token {
  secret: string;
  expiresIn: string;
}

class JWTService {
  private readonly accessToken: Token;
  private readonly refreshToken: Token;
  private readonly verificationToken: Token;
  private readonly securityToken: Token;

  constructor() {
    this.accessToken = {
      secret: env.ACCESS_TOKEN_SECRET,
      expiresIn: env.ACCESS_TOKEN_EXPIRY,
    };
    this.refreshToken = {
      secret: env.REFRESH_TOKEN_SECRET,
      expiresIn: env.REFRESH_TOKEN_EXPIRY,
    };
    this.verificationToken = {
      secret: env.VERIFICATION_TOKEN_SECRET,
      expiresIn: env.VERIFICATION_TOKEN_EXPIRY,
    };
    this.securityToken = {
      secret: env.SECURITY_TOKEN_SECRET,
      expiresIn: env.SECURITY_TOKEN_EXPIRY,
    };
  }

  errorCallback = (err: unknown, payload: any) => {
    if (err) {
      throw new ApiError(401, 'Invalid Token or Token Expired!');
    }
    return payload;
  };

  generateAccessToken = (userId: number) => {
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

  generateRefreshToken = (userId: number, email: string) => {
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

  generateAuthTokens = (userId: number, email: string) => {
    const accessToken = this.generateAccessToken(userId);
    const refreshToken = this.generateRefreshToken(userId, email);

    return { accessToken, refreshToken };
  };

  generateVerificationToken = (userId: number) => {
    const verificationToken = jt.sign(
      {
        id: userId,
      },
      this.verificationToken.secret,
      {
        expiresIn: this.verificationToken.expiresIn,
      },
    );
    return verificationToken;
  };

  generateSecurityToken = (userId: number) => {
    const securityToken = jt.sign(
      {
        id: userId,
      },
      this.securityToken.secret,
      {
        expiresIn: this.securityToken.expiresIn,
      },
    );
    return securityToken;
  };

  verifyAccessToken: (token: string) => { id: number } = (token: string) => {
    return jt.verify(
      token,
      this.accessToken.secret,
      this.errorCallback,
    ) as unknown as { id: number };
  };

  verifyRefreshToken: (token: string) => { id: number; email: string } = (
    token: string,
  ) => {
    return jt.verify(
      token,
      this.refreshToken.secret,
      this.errorCallback,
    ) as unknown as { id: number; email: string };
  };

  verifyVerificationToken: (token: string) => { id: number } = (
    token: string,
  ) => {
    return jt.verify(
      token,
      this.verificationToken.secret,
      this.errorCallback,
    ) as unknown as {
      id: number;
    };
  };

  verifySecurityToken: (token: string) => { id: number } = (token: string) => {
    return jt.verify(
      token,
      this.securityToken.secret,
      this.errorCallback,
    ) as unknown as {
      id: number;
    };
  };
}

export const jwt = new JWTService();
