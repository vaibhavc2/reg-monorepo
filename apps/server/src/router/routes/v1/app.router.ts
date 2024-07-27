import ct from '@/constants';
import { handlers } from '@/handlers';
import { contracts } from '@reg/contracts';

const appRouter = ct.s.router(contracts.v1.app, {
  health: handlers.v1.app.checkHealthHandler,
});

export default appRouter;
