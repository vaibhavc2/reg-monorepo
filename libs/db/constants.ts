type IEnum = readonly [string, ...string[]] | [string, ...string[]];

const ct = {
  authType: ['email', 'google', 'phone'] as IEnum,
  deviceType: ['android', 'iphone', 'desktop', 'other'] as IEnum,
  userRole: ['user', 'moderator', 'admin'] as IEnum,
};

export default ct;
