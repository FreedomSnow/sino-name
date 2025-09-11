const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// 确保目标目录存在
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// 源 SVG 文件
const iconSvgPath = path.join(__dirname, '../public/icon.svg');
const appleTouchIconPath = path.join(__dirname, '../public/apple-touch-icon.svg');

// 生成不同尺寸的图标
async function generateIcons() {
  try {
    console.log('开始生成 PWA 图标...');
    
    // 从 SVG 生成标准图标
    await sharp(iconSvgPath)
      .resize(192, 192)
      .png()
      .toFile(path.join(iconsDir, 'icon-192.png'));
    console.log('✓ 生成 icon-192.png');
    
    await sharp(iconSvgPath)
      .resize(512, 512)
      .png()
      .toFile(path.join(iconsDir, 'icon-512.png'));
    console.log('✓ 生成 icon-512.png');
    
    // 从 SVG 生成 maskable 图标（带有额外的内边距）
    await sharp(iconSvgPath)
      .resize(192, 192, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .png()
      .toFile(path.join(iconsDir, 'icon-192-maskable.png'));
    console.log('✓ 生成 icon-192-maskable.png');
    
    await sharp(iconSvgPath)
      .resize(512, 512, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .png()
      .toFile(path.join(iconsDir, 'icon-512-maskable.png'));
    console.log('✓ 生成 icon-512-maskable.png');
    
    // 生成 Apple Touch 图标
    await sharp(appleTouchIconPath)
      .resize(180, 180)
      .png()
      .toFile(path.join(__dirname, '../public/apple-touch-icon.png'));
    console.log('✓ 生成 apple-touch-icon.png');
    
    // 复制到根目录
    fs.copyFileSync(
      path.join(iconsDir, 'icon-192.png'),
      path.join(__dirname, '../public/icon-192.png')
    );
    
    fs.copyFileSync(
      path.join(iconsDir, 'icon-512.png'),
      path.join(__dirname, '../public/icon-512.png')
    );
    
    console.log('🎉 所有 PWA 图标生成完成！');
  } catch (error) {
    console.error('生成图标时出错:', error);
  }
}

generateIcons();
