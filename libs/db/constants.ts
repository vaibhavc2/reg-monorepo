type IEnum = readonly [string, ...string[]] | [string, ...string[]];

const ct = {
  authType: ['password', 'google'] as IEnum,
};

export default ct;
