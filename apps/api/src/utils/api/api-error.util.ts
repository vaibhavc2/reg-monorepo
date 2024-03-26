// Custom class for error-handling in APIs

// ApiError inherits everything from Error class, but with additional properties
class ApiError extends Error {
  statusCode: number;
  data: null;
  message: string;
  success: boolean;
  errors: unknown[] | unknown | undefined;

  constructor(
    statusCode: number,
    message = 'Something went wrong!',
    errors?: unknown[] | unknown,
    stackTrace = '',
  ) {
    super(message); // calls parent class constructor

    this.statusCode = statusCode || 500;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stackTrace) {
      this.stack = stackTrace;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

class RequiredBodyError extends ApiError {
  constructor(notIncludedFields: string[]) {
    super(400);
    this.message = `Missing fields: ${notIncludedFields.join(
      ', ',
    )}. Please fill in all the required fields.`;
  }
}

class UnauthorizedError extends ApiError {
  constructor() {
    super(401, 'Unauthorized request!');
  }
}

export { ApiError, RequiredBodyError, UnauthorizedError };
