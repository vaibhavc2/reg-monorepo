import * as path from 'path';

const ct = {
  paths: {
    migrations: path.join(path.dirname(path.dirname(__dirname)), 'drizzle'),
  },
  expressLimit: '50mb',
  prefixApiVersion: '/api/v1',
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
};

export default ct;
