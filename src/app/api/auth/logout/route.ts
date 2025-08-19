import { NextResponse } from 'next/server';

export async function POST() {
  // 清除用户session cookie
  const response = NextResponse.json({ success: true, message: '已成功登出' });
  response.cookies.delete('user_session');
  
  return response;
}
