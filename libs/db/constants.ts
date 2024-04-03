type IEnum = readonly [string, ...string[]] | [string, ...string[]];

export const db_ct = {
  authTypes: ['email', 'google', 'phone'] as IEnum,
  userRoles: ['user', 'moderator', 'admin'] as IEnum,
  otpTypes: ['email', 'phone'] as IEnum,
  objectives: ['reset', 'change', 'verify', 'security'] as IEnum,
  // deviceType: ['android', 'iphone', 'desktop', 'other'] as IEnum,
};
