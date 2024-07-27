import ct from '@/constants';
import { handlers } from '@/handlers';
import { contracts } from '@reg/contracts';

const personRouter = ct.s.router(contracts.v1.persons, {
  'add-person': handlers.v1.persons.addPersonHandler,
  'get-persons': handlers.v1.persons.getPersonsHandler,
  'get-vehicle-types': handlers.v1.persons.getVehicleTypesHandler,
});

export default personRouter;
