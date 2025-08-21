import fs from 'fs';
import path from 'path';

const publicDir = path.join(process.cwd(), 'public');

interface IconFile {
  name: string;
  content: string;
}

function generateSimpleIcons(): void {
  // 生成简单的SVG图标
  const iconSvg = `
<svg width="192" height="192" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#036aff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#3498db;stop-opacity:1" />
    </linearGradient>
  </defs>
  <circle cx="96" cy="96" r="88" fill="url(#grad1)" stroke="#ffffff" stroke-width="8"/>
  <text x="96" y="110" font-family="Arial, sans-serif" font-size="48" font-weight="bold" 
        text-anchor="middle" fill="white">名</text>
  <circle cx="96" cy="96" r="88" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
</svg>`;

  // 生成favicon SVG
  const faviconSvg = `
<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <circle cx="16" cy="16" r="14" fill="#036aff"/>
  <text x="16" y="22" font-family="Arial" font-size="16" font-weight="bold" 
        text-anchor="middle" fill="white">名</text>
</svg>`;

  // 生成Apple Touch Icon SVG
  const appleTouchIconSvg = `
<svg width="180" height="180" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180">
  <defs>
    <linearGradient id="appleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#036aff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#3498db;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="180" height="180" rx="40" fill="url(#appleGrad)"/>
  <text x="90" y="105" font-family="Arial, sans-serif" font-size="60" font-weight="bold" 
        text-anchor="middle" fill="white">名</text>
</svg>`;

  // 生成 OG Image SVG
  const ogImageSvg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(190,215,240);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(234,214,234);stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bgGrad)"/>
  
  <!-- Logo circle -->
  <circle cx="300" cy="315" r="100" fill="#036aff"/>
  <text x="300" y="340" font-family="Arial, sans-serif" font-size="80" font-weight="bold" 
        text-anchor="middle" fill="white">名</text>
  
  <!-- Text content -->
  <text x="480" y="280" font-family="Arial, sans-serif" font-size="64" font-weight="bold" 
        fill="#141414">SinoName</text>
  <text x="480" y="340" font-family="Arial, sans-serif" font-size="36" 
        fill="#666">中文名字生成器</text>
  <text x="480" y="390" font-family="Arial, sans-serif" font-size="28" 
        fill="#666">Professional Chinese Name Generator</text>
</svg>`;

  // 生成 Safari Pinned Tab SVG
  const safariPinnedTabSvg = `
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 16 16">
  <path fill="#036aff" d="M8,0C3.6,0,0,3.6,0,8s3.6,8,8,8s8-3.6,8-8S12.4,0,8,0z M8,12c-2.2,0-4-1.8-4-4s1.8-4,4-4s4,1.8,4,4S10.2,12,8,12z"/>
  <text x="8" y="11" font-family="Arial" font-size="6" font-weight="bold" text-anchor="middle" fill="white">名</text>
</svg>`;

  // 生成截图SVG
  const screenshotWideSvg = `
<svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="screenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(190,215,240);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(234,214,234);stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1280" height="720" fill="url(#screenGrad)"/>
  
  <!-- 模拟界面元素 -->
  <rect x="40" y="40" width="1200" height="80" rx="20" fill="rgba(255,255,255,0.9)"/>
  <text x="640" y="90" font-family="Arial, sans-serif" font-size="32" font-weight="bold" 
        text-anchor="middle" fill="#141414">SinoName - 中文名字生成器</text>
  
  <!-- 主要内容区 -->
  <rect x="40" y="140" width="1200" height="540" rx="20" fill="rgba(255,255,255,0.8)"/>
  
  <!-- Logo和标题 -->
  <circle cx="320" cy="360" r="60" fill="#036aff"/>
  <text x="320" y="375" font-family="Arial, sans-serif" font-size="48" font-weight="bold" 
        text-anchor="middle" fill="white">名</text>
  
  <text x="640" y="300" font-family="Arial, sans-serif" font-size="48" font-weight="bold" 
        text-anchor="middle" fill="#141414">专业的中文名字生成器</text>
  <text x="640" y="350" font-family="Arial, sans-serif" font-size="28" 
        text-anchor="middle" fill="#666">为外国人提供个性化中文起名服务</text>
  <text x="640" y="390" font-family="Arial, sans-serif" font-size="24" 
        text-anchor="middle" fill="#666">Professional Chinese Name Generator for Foreigners</text>
  
  <!-- 功能按钮模拟 -->
  <rect x="460" y="450" width="120" height="40" rx="20" fill="#036aff"/>
  <text x="520" y="475" font-family="Arial, sans-serif" font-size="16" font-weight="bold" 
        text-anchor="middle" fill="white">开始起名</text>
  
  <rect x="600" y="450" width="120" height="40" rx="20" fill="#3498db"/>
  <text x="660" y="475" font-family="Arial, sans-serif" font-size="16" font-weight="bold" 
        text-anchor="middle" fill="white">定制服务</text>
</svg>`;

  const screenshotNarrowSvg = `
<svg width="375" height="812" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="mobileGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(190,215,240);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(234,214,234);stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="375" height="812" fill="url(#mobileGrad)"/>
  
  <!-- 头部 -->
  <rect x="20" y="60" width="335" height="60" rx="15" fill="rgba(255,255,255,0.9)"/>
  <text x="187.5" y="95" font-family="Arial, sans-serif" font-size="18" font-weight="bold" 
        text-anchor="middle" fill="#141414">SinoName</text>
  
  <!-- 主要内容区 -->
  <rect x="20" y="140" width="335" height="600" rx="15" fill="rgba(255,255,255,0.8)"/>
  
  <!-- Logo -->
  <circle cx="187.5" cy="280" r="40" fill="#036aff"/>
  <text x="187.5" y="290" font-family="Arial, sans-serif" font-size="32" font-weight="bold" 
        text-anchor="middle" fill="white">名</text>
  
  <text x="187.5" y="350" font-family="Arial, sans-serif" font-size="24" font-weight="bold" 
        text-anchor="middle" fill="#141414">中文名字生成器</text>
  <text x="187.5" y="380" font-family="Arial, sans-serif" font-size="16" 
        text-anchor="middle" fill="#666">为外国人起中文名</text>
  
  <!-- 移动端功能按钮 -->
  <rect x="60" y="420" width="100" height="35" rx="17.5" fill="#036aff"/>
  <text x="110" y="442" font-family="Arial, sans-serif" font-size="14" font-weight="bold" 
        text-anchor="middle" fill="white">开始起名</text>
  
  <rect x="215" y="420" width="100" height="35" rx="17.5" fill="#3498db"/>
  <text x="265" y="442" font-family="Arial, sans-serif" font-size="14" font-weight="bold" 
        text-anchor="middle" fill="white">定制服务</text>
</svg>`;

  // 写入文件
  const files: IconFile[] = [
    { name: 'icon.svg', content: iconSvg },
    { name: 'favicon.svg', content: faviconSvg },
    { name: 'apple-touch-icon.svg', content: appleTouchIconSvg },
    { name: 'og-image.svg', content: ogImageSvg },
    { name: 'safari-pinned-tab.svg', content: safariPinnedTabSvg },
    { name: 'screenshot-wide.svg', content: screenshotWideSvg },
    { name: 'screenshot-narrow.svg', content: screenshotNarrowSvg }
  ];

  files.forEach(file => {
    const filePath = path.join(publicDir, file.name);
    fs.writeFileSync(filePath, file.content.trim());
    console.log(`✓ ${file.name} 生成成功`);
  });

  console.log('\n🎉 所有SEO图标文件生成完成！');
  console.log('注意：生成的是SVG格式文件，现代浏览器完全支持。');
  console.log('如果需要PNG格式，请安装sharp或在线转换。');
}

if (require.main === module) {
  generateSimpleIcons();
}

export default generateSimpleIcons;