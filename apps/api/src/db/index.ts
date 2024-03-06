import env from '@/config';
import ct from '@/constants';
import * as schema from '@/db/schema';
import { lg } from '@/utils/logger.util';
import { printErrorMessage } from '@/utils/print-error-message.util';
import { MySql2Database, drizzle } from 'drizzle-orm/mysql2';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import mysql from 'mysql2/promise';

class Database {
  public connection: mysql.Connection | undefined;
  public db: MySql2Database<Record<string, never>> | undefined;

  constructor() {
    this.connection = undefined;
    this.db = undefined;
  }

  public async init() {
    // connecting to database
    await this.connect();

    // migrating database
    if ((env.isDev || env.isTest) && env.MIGRATE_DB) await this.migrate();
  }

  private async connect() {
    this.connection = await mysql.createConnection(env.DB_URL);
    this.db = drizzle(this.connection, { schema, mode: 'default' } as any);
    if (this.connection && this.db) lg.info('Database connected');
  }

  private async migrate() {
    try {
      // migrating database
      lg.info('migration started');
      if (this.db)
        await migrate(this.db, { migrationsFolder: ct.paths.migrationsFolder });
      lg.info('migration completed');
    } catch (error) {
      printErrorMessage(error, 'Migration failed');
    }
  }
}

export const database = new Database();
