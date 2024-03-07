import { getErrorMessage, lg } from '@/utils';

export function printErrorMessage(error: unknown, functionName?: string) {
  lg.error(`⚠️  ❌ ERROR ❌ :: ${functionName} :: ${getErrorMessage(error)}`);
}
