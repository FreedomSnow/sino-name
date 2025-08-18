async function testOAuthFlow() {
  console.log('🧪 开始测试OAuth流程...\n');
  
  try {
    // 步骤1: 调用登录API
    console.log('1️⃣ 调用登录API...');
    const loginResponse = await fetch('http://localhost:3000/api/auth/signin/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!loginResponse.ok) {
      throw new Error(`登录API失败: ${loginResponse.status}`);
    }
    
    const loginData = await loginResponse.json();
    console.log('✅ 登录API成功');
    console.log('📋 响应数据:', JSON.stringify(loginData, null, 2));
    
    // 步骤2: 解析授权URL
    const authUrl = new URL(loginData.redirectUrl);
    const redirectUri = authUrl.searchParams.get('redirect_uri');
    const state = authUrl.searchParams.get('state');
    
    console.log('\n2️⃣ 解析授权URL...');
    console.log('🔗 重定向URI:', redirectUri);
    console.log('🔐 State参数:', state);
    
    // 步骤3: 检查后端回调端点
    console.log('\n3️⃣ 检查后端回调端点...');
    const callbackResponse = await fetch(`http://localhost:3001/api/auth/callback/google?code=test&state=${state}`);
    console.log('📡 回调端点状态:', callbackResponse.status);
    
    if (callbackResponse.ok) {
      console.log('✅ 后端回调端点正常');
    } else {
      console.log('❌ 后端回调端点有问题');
      const errorText = await callbackResponse.text();
      console.log('📋 错误详情:', errorText.substring(0, 200));
    }
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

// 运行测试
testOAuthFlow();
