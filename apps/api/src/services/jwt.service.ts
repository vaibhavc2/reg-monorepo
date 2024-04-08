import env from '@/config';
import { ApiError } from '@/utils';
import jt from 'jsonwebtoken';

interface Token {
  secret: string;
  expiresIn: string;
}

type VerificationParams =
  | { userId: number; email?: never }
  | { userId?: never; email: string }
  | { userId: number; email: string };

type PhoneEmailParams =
  | { email: string; phone?: never }
  | { email?: never; phone: string }
  | { email: string; phone: string };

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

  generateRefreshToken = (
    userId: number,
    { email, phone }: { email?: string; phone?: string } = {},
  ) => {
    const refreshToken = jt.sign(
      {
        id: userId,
        email,
        phone,
      },
      this.refreshToken.secret,
      {
        expiresIn: this.refreshToken.expiresIn,
      },
    );
    return refreshToken;
  };

  generateAuthTokens = (userId: number, { email, phone }: PhoneEmailParams) => {
    const accessToken = this.generateAccessToken(userId);
    const refreshToken = this.generateRefreshToken(userId, { email, phone });

    return { accessToken, refreshToken };
  };

  generateVerificationToken = ({ userId, email }: VerificationParams) => {
    const verificationToken = jt.sign(
      {
        id: userId,
        email,
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

  verifyAccessToken: (token: string) => { id: number } | null = (
    token: string,
  ) => {
    return jt.verify(
      token,
      this.accessToken.secret,
      this.errorCallback,
    ) as unknown as { id: number } | null;
  };

  verifyRefreshToken: (token: string) => { id: number; email: string } | null =
    (token: string) => {
      return jt.verify(
        token,
        this.refreshToken.secret,
        this.errorCallback,
      ) as unknown as { id: number; email: string } | null;
    };

  verifyVerificationToken = (token: string) => {
    return jt.verify(
      token,
      this.verificationToken.secret,
      this.errorCallback,
    ) as unknown as { id?: number; email?: string } | null;
  };

  verifySecurityToken: (token: string) => { id: number } | null = (
    token: string,
  ) => {
    return jt.verify(
      token,
      this.securityToken.secret,
      this.errorCallback,
    ) as unknown as {
      id: number;
    } | null;
  };
}

export const jwt = new JWTService();
