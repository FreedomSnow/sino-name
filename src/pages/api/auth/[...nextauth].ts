import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
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
  },
  pages: {
    signIn: '/login',
    error: '/oauth-failed',
  },
  debug: process.env.NODE_ENV === 'development',
});

