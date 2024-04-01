import env from '@/config';

class ApiResponseService {
  constructor() {}

  public res<
    T extends number,
    TT extends string,
    TTT extends Record<string, any>,
  >(status: T, message: TT, headers?: TTT, data?: any) {
    return {
      status,
      headers,
      body: {
        status,
        data,
        message,
      },
    };
  }

  public error<T extends number, TT extends string>(
    status: T,
    message: TT,
    error?: any,
  ) {
    return {
      status,
      body: {
        status,
        message,
        ...(env.isDev ? { error } : null),
      },
    };
  }

  public serverError() {
    return this.error(500, 'Something went wrong!');
  }
}

export const apiResponse = new ApiResponseService();
