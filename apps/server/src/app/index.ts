import env from '@/config';
import ct from '@/constants';
import middlewares from '@/middlewares';
import { Router } from '@/router';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';
import morgan from 'morgan';

export class App {
  public app: Application;

  constructor() {
    // creating express app
    this.app = express();
  }

  public init() {
    // initializing express app
    this.initExpressApp();

    // returning express app
    return this.app;
  }

  private initExpressApp() {
    // setting express app variables
    this.setExpressAppVariables();

    // using pre-built middlewares
    this.useMiddlewares();

    // using routing
    this.useRouting();

    // error handler middlewares
    this.useErrorHandlers();
  }

  private setExpressAppVariables() {
    // setting express app variables
    // this.app.set('trust proxy', true);
  }

  private useMiddlewares() {
    // using pre-built middlewares
    this.app.use(
      cors({
        origin: [env.CLIENT_URL],
        credentials: true,
        methods: ct.corsMethods,
      }),
      cookieParser(),
      express.json({
        limit: ct.expressLimit,
      }),
      express.urlencoded({ extended: true, limit: ct.expressLimit }),
      express.static('public'),
    );

    // setting app version
    this.app.use(middlewares.versioning.supplyAppVersion);

    // logs requests in development mode
    if (env.isDev) this.app.use(morgan('combined'));
  }

  private useRouting() {
    new Router(this.app).init();
  }

  private useErrorHandlers() {
    // error handler middlewares
    this.app.use(
      middlewares.error.routeNotFound,
      middlewares.error.logger,
      middlewares.error.handler,
    );
  }
}
