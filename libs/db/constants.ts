type IEnum = readonly [string, ...string[]] | [string, ...string[]];

export const db_ct = {
  authType: ['email', 'google', 'phone'] as IEnum,
  userRole: ['user', 'moderator', 'admin'] as IEnum,
  otpType: ['email', 'phone'] as IEnum,
  objective: ['reset', 'change', 'verify', 'security'] as IEnum,
  userStatus: ['active', 'pending', 'disabled'] as IEnum,
  // deviceType: ['android', 'iphone', 'desktop', 'other'] as IEnum,
};
