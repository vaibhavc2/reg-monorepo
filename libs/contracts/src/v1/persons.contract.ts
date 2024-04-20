import { contract } from '../../contract';
import { apiVersionPrefix } from '../../utils';

const PersonsContract = contract.router(
  {},
  {
    strictStatusCodes: true,
    pathPrefix: apiVersionPrefix(1) + '/persons',
    baseHeaders: contract.type<{
      Authorization?: string;
      'User-Agent'?: string;
    }>(),
  },
);

export default PersonsContract;
