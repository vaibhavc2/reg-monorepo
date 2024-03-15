import ct from '@/constants';
import { getErrorMessage, log } from '@/utils';

export function printErrorMessage(error: unknown, functionName?: string) {
  log.error(
    `⚠️  ${ct.chalk.error(`❌ ERROR ❌ :: ${functionName}`)} :: ${getErrorMessage(error)}`,
  );
}
