import env from '@/config';
import { db_ct } from '@reg/db';
import { initServer } from '@ts-rest/express';
import chalk from 'chalk';
import * as path from 'path';

const ct = {
  paths: {
    migrations: path.join(path.dirname(path.dirname(__dirname)), 'drizzle'),
  },
  expressLimit: '50mb',
  corsMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  mimeTypes: {
    image: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/tiff',
      'image/bmp',
      'image/svg+xml',
    ],
  },
  s: initServer(),
  chalk: {
    success: chalk.bold.green,
    error: chalk.bold.red,
    warning: chalk.bold.yellow,
    highlight: chalk.bold.blue,
  },
  base_url: `${env.isDev ? 'http' : 'https'}://${env.HOST}:${env.isDev ? env.PORT : ''}`,
  oauth: {
    google: {
      url: 'https://www.googleapis.com/oauth2/v1/userinfo',
      scopes: ['email', 'profile'],
      prompt: 'consent',
      accessType: 'offline',
    },
  },
  db: db_ct,
  cookieOptions: {
    auth: {
      maxAge: 1000 * 60 * 60 * 24 * env.COOKIE_EXPIRES_IN, // 30 days by default
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'strict' as boolean | 'strict' | 'lax' | 'none' | undefined,
      // sameSite: 'Strict' as 'Lax' | 'None' | 'Strict',
    },
    // auth2: {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: 'Strict',
    // },
  },
};

export default ct;
