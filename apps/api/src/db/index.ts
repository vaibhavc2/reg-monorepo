import env from '@/config';
import ct from '@/constants';
import * as schema from '@/db/schema';
import { dbError, lg, printErrorMessage } from '@/utils';
import { MySql2Database, drizzle } from 'drizzle-orm/mysql2';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import mysql, { Connection } from 'mysql2/promise';
import promptSync from 'prompt-sync';

const prompt = promptSync({ sigint: true });

class Database {
  public connection: mysql.Connection | undefined;
  public db: MySql2Database<Record<string, never>> | undefined;

  constructor() {
    this.connection = undefined;
    this.db = undefined;
  }

  public async init() {
    // if MIGRATE_DB is true and environment is development or test
    if ((env.isDev || env.isTest) && env.MIGRATE_DB) {
      this.connect()
        .then(() => {
          this.promptToMigrate();
        })
        .catch((error) => {
          dbError(error);
        })
        .finally(() => {
          // stopping the process
          process.exit(0);
        });
    } else {
      // return promise to connect to database
      return await this.connect();
    }
  }

  private connect() {
    return new Promise<Connection | void>((resolve, reject) => {
      if (!this.connection) {
        mysql
          .createConnection(env.DB_URL)
          .then((conn) => {
            this.connection = conn;
            this.db = drizzle(this.connection, {
              schema,
              mode: 'default',
            } as any);
            if (this.connection && this.db) {
              lg.info(
                `✅  Database connected successfully! Host: ${this.connection.config.host}`,
              );
              resolve(this.connection);
            }
          })
          .catch((error) => {
            dbError(error, reject);
          });
      } else {
        lg.warn('⚠️✅  Database already connected!');
        resolve();
      }
    });
  }

  private promptToMigrate() {
    const input = prompt('Migrate database? (y/N)');
    if (input?.toLowerCase() === 'y') this.migrate();
    else {
      lg.warn('⚠️  You have selected to not migrate database!');
    }
  }

  private migrate() {
    // migrating database
    lg.info('migration started');
    if (this.db) {
      migrate(this.db, { migrationsFolder: ct.paths.migrationsFolder })
        .then(() => {
          lg.info('✅  Migration completed successfully!');
          lg.warn('⚠️  Database migrated! Turn off MIGRATE_DB in .env file!');
        })
        .catch((error) => {
          printErrorMessage(
            error,
            'Migration failed due to an Error. Try running again!',
          );
        })
        .finally(() => {
          // stopping the process
          process.exit(0);
        });
    } else {
      lg.error('❌  Database not connected! Unable to migrate database!');
      process.exit(0);
    }
  }
}

export const database = new Database();
