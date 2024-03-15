import { getErrorMessage, log } from '@/utils';

export function printErrorMessage(error: unknown, functionName?: string) {
  log.error(`⚠️  ❌ ERROR ❌ :: ${functionName} :: ${getErrorMessage(error)}`);
}
