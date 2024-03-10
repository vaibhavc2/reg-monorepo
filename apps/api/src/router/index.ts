import { Router } from 'express';
import { appHealthRouter } from './routes';

class AppRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes() {
    // admin routes
    // this.router.use('/admin', adminRouter);

    // app health route
    this.router.use(appHealthRouter);
  }
}

export default new AppRouter().router;
