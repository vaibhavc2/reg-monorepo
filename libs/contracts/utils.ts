export const addPrefixToRoutes = (routes: any, prefix: string) => {
  return Object.keys(routes).reduce((prefixedRoutes: any, key: string) => {
    const route = routes[key];
    route.path = `${prefix}${route.path}`;
    prefixedRoutes[key] = route;
    return prefixedRoutes;
  }, {});
};
