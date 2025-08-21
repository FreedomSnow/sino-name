import fs from 'fs';
import path from 'path';

const publicDir = path.join(process.cwd(), 'public');

interface SEOFile {
  name: string;
  required: boolean;
  description: string;
}

interface ManifestData {
  name?: string;
  icons?: Array<{ src: string; sizes: string; type: string }>;
  screenshots?: Array<{ src: string; sizes: string; type: string }>;
}

function checkSEOFiles(): void {
  const requiredFiles: SEOFile[] = [
    { name: 'favicon.svg', required: true, description: '网站图标' },
    { name: 'apple-touch-icon.svg', required: true, description: 'Apple设备图标' },
    { name: 'og-image.svg', required: true, description: '社交分享图片' },
    { name: 'safari-pinned-tab.svg', required: true, description: 'Safari标签图标' },
    { name: 'manifest.json', required: true, description: 'PWA清单文件' },
    { name: 'screenshot-wide.svg', required: false, description: '桌面端截图' },
    { name: 'screenshot-narrow.svg', required: false, description: '移动端截图' },
    { name: 'sw.js', required: false, description: 'Service Worker' },
    { name: 'offline.html', required: false, description: '离线页面' }
  ];

  console.log('🔍 SEO文件检查：\n');
  
  const missingFiles: string[] = [];
  const existingFiles: string[] = [];

  requiredFiles.forEach(file => {
    const filePath = path.join(publicDir, file.name);
    const exists = fs.existsSync(filePath);
    
    if (exists) {
      console.log(`✓ ${file.name} - ${file.description}`);
      existingFiles.push(file.name);
    } else {
      const status = file.required ? '❌ 必需' : '⚠️  可选';
      console.log(`${status} ${file.name} - ${file.description}`);
      if (file.required) {
        missingFiles.push(file.name);
      }
    }
  });

  // 检查动态生成的文件
  console.log('\n📄 动态生成文件检查：');
  const appDir = path.join(process.cwd(), 'src', 'app');
  
  const dynamicFiles = [
    { file: 'robots.ts', description: 'robots.txt动态生成' },
    { file: 'sitemap.ts', description: 'sitemap.xml动态生成' }
  ];

  dynamicFiles.forEach(({ file, description }) => {
    const filePath = path.join(appDir, file);
    if (fs.existsSync(filePath)) {
      console.log(`✓ ${file} - ${description}`);
    } else {
      console.log(`❌ ${file} - ${description}`);
      missingFiles.push(file);
    }
  });

  // 检查重复文件
  console.log('\n🔍 重复文件检查：');
  const potentialDuplicates = [
    { static: 'robots.txt', dynamic: 'robots.ts' },
    { static: 'sitemap.xml', dynamic: 'sitemap.ts' }
  ];

  let duplicatesFound = false;
  potentialDuplicates.forEach(({ static: staticFile, dynamic: dynamicFile }) => {
    const staticPath = path.join(publicDir, staticFile);
    const dynamicPath = path.join(appDir, dynamicFile);
    
    if (fs.existsSync(staticPath) && fs.existsSync(dynamicPath)) {
      console.log(`⚠️  发现重复: ${staticFile} 和 ${dynamicFile}`);
      console.log(`   建议删除静态文件 ${staticFile}，保留动态生成的 ${dynamicFile}`);
      duplicatesFound = true;
    }
  });

  if (!duplicatesFound) {
    console.log('✓ 没有发现重复文件');
  }

  // 结果总结
  console.log('\n📊 检查结果总结：');
  
  if (missingFiles.length === 0) {
    console.log('🎉 所有必需的SEO文件都存在！');
  } else {
    console.log(`⚠️  缺少 ${missingFiles.length} 个重要文件`);
    console.log('请运行以下命令修复：');
    console.log('  npm run build:icons  # 生成图标文件');
  }

  // 检查manifest.json格式
  checkManifestFile();

  // 检查Next.js配置
  checkNextConfig();
}

function checkManifestFile(): void {
  const manifestPath = path.join(publicDir, 'manifest.json');
  
  if (!fs.existsSync(manifestPath)) {
    console.log('\n❌ manifest.json 文件不存在');
    return;
  }

  try {
    const manifestContent = fs.readFileSync(manifestPath, 'utf8');
    const manifest: ManifestData = JSON.parse(manifestContent);
    
    console.log('\n📱 PWA Manifest检查：');
    console.log(`✓ 应用名称: ${manifest.name || '未设置'}`);
    console.log(`✓ 图标数量: ${manifest.icons?.length || 0}`);
    console.log(`✓ 截图数量: ${manifest.screenshots?.length || 0}`);
    
    // 检查图标文件是否存在
    if (manifest.icons) {
      manifest.icons.forEach(icon => {
        const iconPath = path.join(publicDir, icon.src.replace('/', ''));
        if (fs.existsSync(iconPath)) {
          console.log(`  ✓ ${icon.src} (${icon.sizes})`);
        } else {
          console.log(`  ❌ ${icon.src} - 文件不存在`);
        }
      });
    }
    
  } catch (error) {
    console.log('\n❌ manifest.json 格式错误:', (error as Error).message);
  }
}

function checkNextConfig(): void {
  const configPath = path.join(process.cwd(), 'next.config.ts');
  
  if (!fs.existsSync(configPath)) {
    console.log('\n⚠️  next.config.ts 文件不存在');
    return;
  }

  try {
    const configContent = fs.readFileSync(configPath, 'utf8');
    
    console.log('\n⚙️  Next.js配置检查：');
    
    // 检查重要的SEO配置
    const seoConfigs = [
      { key: 'compress', desc: 'Gzip压缩' },
      { key: 'poweredByHeader', desc: 'X-Powered-By头部' },
      { key: 'generateEtags', desc: 'ETag生成' },
      { key: 'images', desc: '图片优化配置' }
    ];

    seoConfigs.forEach(config => {
      if (configContent.includes(config.key)) {
        console.log(`✓ ${config.desc} 已配置`);
      } else {
        console.log(`⚠️  ${config.desc} 未配置`);
      }
    });

  } catch (error) {
    console.log('\n❌ next.config.ts 读取错误:', (error as Error).message);
  }
}

if (require.main === module) {
  checkSEOFiles();
}

export default checkSEOFiles;