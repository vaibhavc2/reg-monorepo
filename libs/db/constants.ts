type IEnum = readonly [string, ...string[]] | [string, ...string[]];

const ct = {
  authType: ['password', 'google'] as IEnum,
  deviceType: ['android', 'iphone', 'desktop', 'other'] as IEnum,
};

export default ct;
