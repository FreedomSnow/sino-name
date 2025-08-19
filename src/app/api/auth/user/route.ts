import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // 从cookie中获取用户session
  const sessionCookie = request.cookies.get('user_session');
  
  if (!sessionCookie) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }

  try {
    // 解码session数据
    const sessionData = JSON.parse(Buffer.from(sessionCookie.value, 'base64').toString());
    
    // 检查session是否过期
    if (sessionData.expiresAt < Date.now()) {
      // 清除过期session
      const response = NextResponse.json({ error: '登录已过期' }, { status: 401 });
      response.cookies.delete('user_session');
      return response;
    }

    // 返回用户信息（不包含敏感信息如accessToken）
    return NextResponse.json({
      user: sessionData.user,
      expiresAt: sessionData.expiresAt,
    });
    
  } catch (error) {
    console.error('解析session数据错误:', error);
    return NextResponse.json({ error: '无效的session数据' }, { status: 401 });
  }
}
