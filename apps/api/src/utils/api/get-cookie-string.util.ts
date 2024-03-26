export const getCookieString = (
  cookieName: string,
  cookieValue: string,
  cookieOptions: {
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'Strict' | 'Lax' | 'None';
  },
) => {
  return `${cookieName}=${cookieValue}; Path=/; HttpOnly=${cookieOptions.httpOnly}; Secure=${cookieOptions.secure}; SameSite=${cookieOptions.sameSite}`;
};
