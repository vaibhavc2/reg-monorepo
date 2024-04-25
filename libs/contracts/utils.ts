import { contract } from './contract';

export const addPrefixToRoutes = (routes: any, prefix: string) => {
  return Object.keys(routes).reduce((prefixedRoutes: any, key: string) => {
    const route = routes[key];
    route.path = `${prefix}${route.path}`;
    prefixedRoutes[key] = route;
    return prefixedRoutes;
  }, {});
};

// for using url-path based versioning in the api
export const apiVersionPrefix = (version: number) => `/api/v${version}`;

// common response type
export const ResponseType = contract.type<{
  status: number;
  message: string;
}>();
