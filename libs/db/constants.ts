type IEnum = readonly [string, ...string[]] | [string, ...string[]];

export const db_ct = {
  authType: ['email', 'google', 'phone'] as IEnum,
  // deviceType: ['android', 'iphone', 'desktop', 'other'] as IEnum,
  userRole: ['user', 'moderator', 'admin'] as IEnum,
};
