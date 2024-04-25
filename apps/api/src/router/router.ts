import middlewares from '@/middlewares';
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
    // this.useV2Router();
  }

  private useV1Router() {
    // app router
    createExpressEndpoints(contracts.v1.app, routes.v1.appRouter, this.app);

    // user router
    createExpressEndpoints(contracts.v1.users, routes.v1.userRouter, this.app);

    // person router
    createExpressEndpoints(
      contracts.v1.persons,
      routes.v1.personRouter,
      this.app,
      {
        globalMiddleware: [middlewares.auth.moderator],
      },
    );
  }
}
