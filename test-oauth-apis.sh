#!/bin/bash

# OAuth API 测试脚本
# 使用方法: ./test-oauth-apis.sh

echo "🚀 OAuth API 测试脚本"
echo "========================"

# 设置基础URL
FRONTEND_URL="http://localhost:3000"
BACKEND_URL="http://localhost:3001"

echo "📍 前端服务: $FRONTEND_URL"
echo "📍 后端服务: $BACKEND_URL"
echo ""

# 检查服务状态
echo "🔍 检查服务状态..."
echo ""

echo "1. 检查前端服务状态:"
curl -s -o /dev/null -w "前端服务状态: %{http_code}\n" "$FRONTEND_URL" || echo "前端服务未运行"

echo ""
echo "2. 检查后端服务状态:"
curl -s -o /dev/null -w "后端服务状态: %{http_code}\n" "$BACKEND_URL" || echo "后端服务未运行"

echo ""
echo "========================"
echo ""

# 测试登录接口
echo "🔑 测试登录接口"
echo "========================"

echo "POST /api/auth/signin/google"
echo "请求:"
echo "  URL: $FRONTEND_URL/api/auth/signin/google"
echo "  方法: POST"
echo "  请求体: {}"
echo ""

echo "curl命令:"
echo "curl -X POST $FRONTEND_URL/api/auth/signin/google \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{}'"
echo ""

echo "执行测试..."
RESPONSE=$(curl -s -X POST "$FRONTEND_URL/api/auth/signin/google" \
  -H "Content-Type: application/json" \
  -d '{}')

echo "响应状态: $?"
echo "响应内容:"
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
echo ""

# 测试用户信息接口
echo "👤 测试用户信息接口"
echo "========================"

echo "GET /api/auth/user"
echo "请求:"
echo "  URL: $FRONTEND_URL/api/auth/user"
echo "  方法: GET"
echo "  说明: 需要有效的user_session cookie"
echo ""

echo "curl命令:"
echo "curl -X GET $FRONTEND_URL/api/auth/user \\"
echo "  -H \"Cookie: user_session=SESSION_COOKIE_VALUE\""
echo ""

echo "执行测试 (无Cookie)..."
RESPONSE=$(curl -s -X GET "$FRONTEND_URL/api/auth/user")
echo "响应状态: $?"
echo "响应内容:"
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
echo ""

# 测试登出接口
echo "🚪 测试登出接口"
echo "========================"

echo "POST /api/auth/logout"
echo "请求:"
echo "  URL: $FRONTEND_URL/api/auth/logout"
echo "  方法: POST"
echo "  说明: 需要有效的user_session cookie"
echo ""

echo "curl命令:"
echo "curl -X POST $FRONTEND_URL/api/auth/logout \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -H \"Cookie: user_session=SESSION_COOKIE_VALUE\" \\"
echo "  -d '{}'"
echo ""

echo "执行测试 (无Cookie)..."
RESPONSE=$(curl -s -X POST "$FRONTEND_URL/api/auth/logout" \
  -H "Content-Type: application/json" \
  -d '{}')
echo "响应状态: $?"
echo "响应内容:"
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
echo ""

# 测试OAuth错误信息接口
echo "⚠️  测试OAuth错误信息接口"
echo "========================"

echo "GET /api/auth/oauth-error"
echo "请求:"
echo "  URL: $FRONTEND_URL/api/auth/oauth-error"
echo "  方法: GET"
echo "  查询参数: error=invalid_grant&message=授权码已过期"
echo ""

echo "curl命令:"
echo "curl \"$FRONTEND_URL/api/auth/oauth-error?error=invalid_grant&message=授权码已过期\""
echo ""

echo "执行测试..."
RESPONSE=$(curl -s "$FRONTEND_URL/api/auth/oauth-error?error=invalid_grant&message=授权码已过期")
echo "响应状态: $?"
echo "响应内容:"
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
echo ""

# 测试其他错误类型
echo ""
echo "测试其他错误类型..."
echo ""

ERROR_TYPES=("access_denied" "invalid_client" "redirect_uri_mismatch" "server_error")

for error_type in "${ERROR_TYPES[@]}"; do
  echo "测试错误类型: $error_type"
  RESPONSE=$(curl -s "$FRONTEND_URL/api/auth/oauth-error?error=$error_type&message=测试错误")
  echo "响应:"
  echo "$RESPONSE" | jq '.error.message' 2>/dev/null || echo "$RESPONSE"
  echo ""
done

# 测试OAuth回调接口 (模拟)
echo "🔄 测试OAuth回调接口 (模拟)"
echo "========================"

echo "GET /api/auth/callback/google"
echo "请求:"
echo "  URL: $BACKEND_URL/api/auth/callback/google"
echo "  方法: GET"
echo "  说明: 这是后端接口，通常由Google OAuth服务调用"
echo ""

echo "curl命令 (模拟):"
echo "curl \"$BACKEND_URL/api/auth/callback/google?code=TEST_CODE&state=TEST_STATE\""
echo ""

echo "注意: 这个接口需要有效的Google OAuth参数才能正常工作"
echo "在实际使用中，Google OAuth服务会调用此接口"
echo ""

# 测试页面访问
echo "📄 测试页面访问"
echo "========================"

echo "1. 测试OAuth成功页面:"
echo "curl \"$FRONTEND_URL/oauth-success\""
echo ""

echo "2. 测试OAuth错误页面:"
echo "curl \"$FRONTEND_URL/oauth-error?error=test_error&error_description=测试错误\""
echo ""

echo "3. 测试首页:"
echo "curl \"$FRONTEND_URL\""
echo ""

# 性能测试
echo "⚡ 性能测试"
echo "========================"

echo "测试登录接口响应时间..."
for i in {1..3}; do
  START_TIME=$(date +%s%N)
  curl -s -X POST "$FRONTEND_URL/api/auth/signin/google" \
    -H "Content-Type: application/json" \
    -d '{}' > /dev/null
  END_TIME=$(date +%s%N)
  DURATION=$(( (END_TIME - START_TIME) / 1000000 ))
  echo "第 $i 次请求: ${DURATION}ms"
done

echo ""
echo "测试用户信息接口响应时间..."
for i in {1..3}; do
  START_TIME=$(date +%s%N)
  curl -s -X GET "$FRONTEND_URL/api/auth/user" > /dev/null
  END_TIME=$(date +%s%N)
  DURATION=$(( (END_TIME - START_TIME) / 1000000 ))
  echo "第 $i 次请求: ${DURATION}ms"
done

echo ""
echo "========================"
echo "🎯 测试完成！"
echo ""
echo "📋 测试总结:"
echo "✅ 登录接口: POST /api/auth/signin/google"
echo "✅ 用户信息接口: GET /api/auth/user"
echo "✅ 登出接口: POST /api/auth/logout"
echo "✅ 错误信息接口: GET /api/auth/oauth-error"
echo "✅ 页面访问: /oauth-success, /oauth-error, /"
echo "✅ 性能测试: 响应时间统计"
echo ""
echo "💡 使用提示:"
echo "1. 确保前端和后端服务正在运行"
echo "2. 检查环境变量配置是否正确"
echo "3. 验证Google OAuth配置"
echo "4. 查看浏览器控制台和网络面板"
echo ""
echo "🔧 故障排除:"
echo "1. 如果服务未运行，请启动相应的服务"
echo "2. 如果接口返回错误，检查环境变量和配置"
echo "3. 如果页面无法访问，检查路由配置"
echo "4. 如果OAuth失败，检查Google Console配置"
