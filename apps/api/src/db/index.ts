import env from '@/config';
import ct from '@/constants';
import { dbError, log, printErrorMessage } from '@/utils';
import { schema } from '@reg/db';
import { Logger } from 'drizzle-orm';
import { MySql2Database, drizzle } from 'drizzle-orm/mysql2';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import mysql, { Connection } from 'mysql2/promise';
import promptSync from 'prompt-sync';

const prompt = promptSync({ sigint: true });
const migrationsFolder = ct.paths.migrations;

class MyLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    log.debug(`SQL execution: \n ${{ query, params }}`);
  }
}

class Database {
  private connection: mysql.Connection | undefined;
  public db: MySql2Database<typeof schema> | undefined;

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
          .createConnection(
            env.isProduction
              ? env.PROD_DB_URL + `?ssl={"rejectUnauthorized":true}`
              : env.DEV_DB_URL,
          )
          .then((conn) => {
            this.connection = conn;
            this.db = drizzle(this.connection, {
              schema,
              mode: 'default',
              logger: env.isDev ? new MyLogger() : false,
            } as any);
            if (this.connection && this.db) {
              log.info(
                ct.chalk.success(
                  `✅  Database connected successfully! Host: ${this.connection.config.host}`,
                ),
              );
              resolve(this.connection);
            }
          })
          .catch((error) => {
            dbError(error, reject);
          });
      } else {
        log.warn(ct.chalk.warning('⚠️✅  Database already connected!'));
        resolve();
      }
    });
  }

  private promptToMigrate() {
    const input = prompt('\nprompt: Migrate database? (Y/n) ');
    if (!input || input?.toLowerCase() === 'y') {
      this.migrate().finally(() => process.exit(0));
    } else {
      log.warn(
        ct.chalk.warning('⚠️  You have selected to not migrate database!'),
      );
    }
  }

  private async migrate() {
    // migrating database
    if (this.db) {
      log.info('🚀  Migrating database....');
      await migrate(this.db, { migrationsFolder })
        .then(() => {
          log.info('✅  Migration completed successfully!');
          log.warn(
            ct.chalk.warning(
              '⚠️  Database migrated! Turn off MIGRATE_DB in .env file!',
            ),
          );
        })
        .catch((error) => {
          log.error(
            ct.chalk.error(
              '❌  Migration failed due to an Error. Try running again!\n',
            ),
          );
          printErrorMessage(error, 'db: migrate()');
        });
    } else {
      log.error(
        ct.chalk.error(
          '❌  Database not connected! Unable to migrate database!',
        ),
      );
      process.exit(0);
    }
  }
}

export const database = new Database();
export const db = database.db;
