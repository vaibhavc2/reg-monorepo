import { contracts } from '@reg/contracts';
import { createExpressEndpoints } from '@ts-rest/express';
import { Application } from 'express';
import { routes } from './routes';

export class Router {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  public init() {
    // using v1 router
    this.useV1Router();

    // using v2 router
  }

  private useV1Router() {
    // app router
    createExpressEndpoints(
      contracts.v1.AppContract,
      routes.v1.appRouter,
      this.app,
    );

    // user router
    createExpressEndpoints(
      contracts.v1.UsersContract,
      routes.v1.userRouter,
      this.app,
    );
  }
}
