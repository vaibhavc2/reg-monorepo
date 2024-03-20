type IEnum = readonly [string, ...string[]] | [string, ...string[]];

const ct = {
  authType: ['email-password', 'google', 'both'] as IEnum,
  deviceType: ['android', 'iphone', 'desktop', 'other'] as IEnum,
};

export default ct;
