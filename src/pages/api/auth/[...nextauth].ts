import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || process.env.SESSION_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // 如果URL是相对路径，添加基础URL
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // 如果URL是外部链接，重定向到首页
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async signIn({ user, account, profile, email, credentials }) {
      // 记录登录信息
      console.log('用户登录:', { 
        email: user.email, 
        provider: account?.provider,
        timestamp: new Date().toISOString()
      });
      return true;
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        token.provider = account.provider;
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.provider = token.provider;
        session.accessToken = token.accessToken;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/oauth-failed',
  },
  debug: process.env.NODE_ENV === 'development',
});

