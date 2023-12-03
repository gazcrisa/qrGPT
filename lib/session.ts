/* eslint-disable no-unused-vars */
import { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

type CredentialsType = Record<never, string> & {
  username?: string;
  password?: string;
};

type User = {
  id: string;
  username: string;
};

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/sign-in',
  },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {},
      async authorize(
        credentials: CredentialsType | undefined,
        req: any,
      ): Promise<User | null> {
        try {
          if (!credentials?.username || !credentials?.password) {
            throw new Error('Empty username or password');
          }

          const apiUrl = process.env.API_URL + '/auth/login';

          // Make a POST request to the external API
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            throw new Error('Invalid username or password');
          }

          const existingUser = await response.json();

          return {
            id: existingUser.uuid,
            username: existingUser.username,
          };
        } catch (error: any) {
          console.error('Error in authorize function:', error.message);
          throw new Error(
            'An unexpected error occurred while signing in. Please try again later.',
          );
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        return {
          ...token,
          username: user.username,
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          userId: token.sub,
          username: token.username,
          points: token.points,
        },
      };
    },
  },
};
