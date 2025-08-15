import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 重定向到NextAuth的标准Google登录路径
  const nextAuthGoogleSignIn = '/api/auth/signin/google';
  
  // 如果有回调URL参数，保留它
  const callbackUrl = req.query.callbackUrl || '/oauth-success';
  const redirectUrl = `${nextAuthGoogleSignIn}?callbackUrl=${encodeURIComponent(callbackUrl as string)}`;
  
  console.log('自定义Google登录重定向:', {
    from: req.url,
    to: redirectUrl,
    timestamp: new Date().toISOString()
  });
  
  res.redirect(redirectUrl);
}
