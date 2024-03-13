import ct from '@/constants';
import { appHealthHandler } from '@/handlers/app-health.handler';
import { AppHealthContract } from '@reg/contracts';

const appHealthRouter = ct.s.router(AppHealthContract, {
  health: {
    handler: appHealthHandler,
  },
});

export default appHealthRouter;
