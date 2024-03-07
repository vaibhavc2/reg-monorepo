import { printErrorMessage } from '..';

export const dbError = (error: unknown, reject?: (reason?: any) => void) => {
  printErrorMessage(
    error,
    'Database connection failed due to an Error. Try running again!',
  );

  // rejecting the promise
  if (reject) reject(error);

  // stopping the process
  process.exit(1);
};
