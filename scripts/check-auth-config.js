#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 检查NextAuth配置...\n');

// 检查环境变量文件
const envFiles = ['.env.local', '.env'];
let envFile = null;

for (const file of envFiles) {
  if (fs.existsSync(file)) {
    envFile = file;
    break;
  }
}

if (!envFile) {
  console.log('❌ 未找到环境变量文件 (.env.local 或 .env)');
  console.log('请创建 .env.local 文件并填入以下配置：\n');
  console.log('GOOGLE_CLIENT_ID=your_google_client_id');
  console.log('GOOGLE_CLIENT_SECRET=your_google_client_secret');
  console.log('NEXTAUTH_SECRET=your_nextauth_secret');
  console.log('NEXTAUTH_URL=http://localhost:3000');
  process.exit(1);
}

console.log(`✅ 找到环境变量文件: ${envFile}`);

// 读取环境变量
const envContent = fs.readFileSync(envFile, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

// 检查必要的配置
const requiredVars = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET', 
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL'
];

let missingVars = [];

requiredVars.forEach(varName => {
  if (!envVars[varName] || envVars[varName].includes('your_')) {
    missingVars.push(varName);
  }
});

if (missingVars.length > 0) {
  console.log('❌ 以下配置项缺失或未设置：');
  missingVars.forEach(varName => {
    console.log(`   - ${varName}`);
  });
  console.log('\n请检查并更新这些配置项');
} else {
  console.log('✅ 所有必要的环境变量已配置');
}

// 检查NextAuth配置文件
const nextAuthFile = 'src/pages/api/auth/[...nextauth].ts';
if (fs.existsSync(nextAuthFile)) {
  console.log('✅ NextAuth配置文件存在');
} else {
  console.log('❌ NextAuth配置文件不存在');
}

// 检查依赖
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const hasNextAuth = packageJson.dependencies && packageJson.dependencies['next-auth'];

if (hasNextAuth) {
  console.log('✅ next-auth 依赖已安装');
} else {
  console.log('❌ next-auth 依赖未安装');
}

console.log('\n📋 配置检查完成！');
console.log('\n🔧 下一步操作：');
console.log('1. 在Google Cloud Console创建OAuth 2.0客户端');
console.log('2. 设置重定向URI: http://localhost:3000/api/auth/callback/google');
console.log('3. 将客户端ID和密钥填入 .env.local 文件');
console.log('4. 生成强随机字符串作为 NEXTAUTH_SECRET');
console.log('5. 运行 npm run dev 测试登录功能');
