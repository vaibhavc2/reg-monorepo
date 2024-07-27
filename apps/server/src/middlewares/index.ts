import { Authentication } from './auth.middleware';
import { ErrorMiddleware } from './error.middleware';
import { FilesMiddleware } from './files.middleware';
import { ValidationMiddleware } from './validation.middleware';
import { Versioning } from './version.middleware';

class Middlewares {
  auth: Authentication;
  error: ErrorMiddleware;
  validation: ValidationMiddleware;
  versioning: Versioning;
  files: FilesMiddleware;

  constructor() {
    this.auth = new Authentication();
    this.error = new ErrorMiddleware();
    this.validation = new ValidationMiddleware();
    this.versioning = new Versioning();
    this.files = new FilesMiddleware();
  }
}

export default new Middlewares();
