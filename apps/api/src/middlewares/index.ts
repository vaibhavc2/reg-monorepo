import { Authentication } from './auth.middleware';
import { ErrorMiddleware } from './error.middleware';
import { ValidationMiddleware } from './validation.middleware';

class Middlewares {
  auth: Authentication;
  error: ErrorMiddleware;
  validation: ValidationMiddleware;

  constructor() {
    this.auth = new Authentication();
    this.error = new ErrorMiddleware();
    this.validation = new ValidationMiddleware();
  }
}

export default new Middlewares();
