import * as path from 'path';

const ct = {
  paths: {
    migrationsFolder: path.join(
      path.dirname(path.dirname(__dirname)),
      'drizzle',
    ),
  },
};

export default ct;
