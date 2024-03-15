import env from '@/config';
import { initServer } from '@ts-rest/express';
import chalk from 'chalk';
import * as path from 'path';

const ct = {
  paths: {
    migrations: path.join(path.dirname(path.dirname(__dirname)), 'drizzle'),
  },
  expressLimit: '50mb',
  corsMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
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
  routes: {
    oauth: {
      google: '/oauth/google',
    },
  },
  chalk: {
    success: chalk.bold.green,
    error: chalk.bold.red,
    warning: chalk.bold.yellow,
    highlight: chalk.bold.blue,
  },
  base_url: `${env.isDev ? 'http' : 'https'}://${env.HOST}:${env.isDev ? env.PORT : ''}`,
};

export default ct;
