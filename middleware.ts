export { default } from 'next-auth/middleware';

export const config = {
  matcher: '/', // Matches all routes
  redirectTo: '/auth/sign-in',
};
