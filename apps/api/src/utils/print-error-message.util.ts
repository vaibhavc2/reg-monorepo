import { getErrorMessage } from '@/utils/error-message.util.js';
import { lg } from '@/utils/logger.util.js';

export function printErrorMessage(error: unknown, functionName?: string) {
  lg.error(`⚠️   ERROR :: ${functionName} :: ${getErrorMessage(error)}`);
}
