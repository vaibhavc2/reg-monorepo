import { App } from '@/app';
import env from '@/config';
import ct from '@/constants';
import { database } from '@/db';
import { dbError, log, printErrorMessage } from '@/utils';
import { Application } from 'express';

class Server {
  private app: Application;

  constructor() {
    // initializing express app for http server
    this.app = new App().init();
  }

  public async init() {
    // global error handling
    this.globalErrorHandling();

    // app error handling
    this.appErrorHandling();

    // initializing server
    await this.initServer();
  }

  private async initServer() {
    // connecting to database
    database
      .init()
      .then((connection) => {
        if (!connection) {
          // stopping the process
          process.exit(0);
        }

        // adding connection to express app
        this.app.set('connection', connection);

        // starting server
        this.startServer();
      })
      .catch((error) => dbError(error));
  }

  private startServer() {
    // starting http server
    this.httpServer();
  }

  private httpServer() {
    // starting http server
    const server = this.app.listen(env.PORT, () => {
      log.info(
        `⚙️   Server is running at ${ct.chalk.highlight(`${ct.base_url}`)} in ${env.NODE_ENV} mode.`,
      );
    });

    return server;
  }

  private appErrorHandling() {
    this.app.on('error', (error) => {
      printErrorMessage(
        error,
        'EXPRESS Server FAILED :: at app.on() :: appErrorHandling() :: Server',
      );

      process.exit(1);
    });
  }

  private globalErrorHandling() {
    process.on('uncaughtException', (error) => {
      printErrorMessage(
        error,
        'EXPRESS Server FAILED :: at process.on() :: globalErrorHandling() :: Server',
      );

      process.exit(1);
    });
  }
}

export const server = new Server();
