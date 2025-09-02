import fs from 'fs'
import path from 'path'

const publicDir = path.join(process.cwd(), 'public')

// 生成PNG格式的图标（使用Canvas API模拟）
function generatePNGIcons(): void {
  // 由于我们在服务器端，这里提供SVG转PNG的脚本提示
  const iconSizes = [16, 32, 48, 64, 96, 128, 192, 256, 512]

  console.log('🎨 需要生成PNG图标文件：')

  iconSizes.forEach(size => {
    console.log(`📁 需要: icon-${size}.png (${size}x${size})`)
  })

  console.log('\n📝 生成PNG图标的方法:')
  console.log('1. 在线转换: 访问 https://convertio.co/svg-png/')
  console.log('2. 上传 public/icon.svg')
  console.log('3. 分别生成不同尺寸的PNG文件')
  console.log('4. 保存到 public/ 目录')

  // 生成PNG图标的HTML工具
  const htmlTool = `
<!DOCTYPE html>
<html>
<head>
    <title>SVG转PNG工具</title>
    <meta charset="utf-8">
</head>
<body>
    <h1>SinoName图标生成工具</h1>
    <canvas id="canvas" style="border: 1px solid #ccc;"></canvas>
    <br><br>
    <button onclick="generateIcons()">生成所有尺寸PNG图标</button>

    <script>
    function generateIcons() {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const sizes = [16, 32, 48, 64, 96, 128, 192, 256, 512];

        sizes.forEach(size => {
            canvas.width = size;
            canvas.height = size;

            // 绘制图标
            ctx.fillStyle = '#036aff';
            ctx.beginPath();
            ctx.arc(size/2, size/2, size/2 - 4, 0, 2 * Math.PI);
            ctx.fill();

            // 绘制文字
            ctx.fillStyle = 'white';
            ctx.font = \`bold \${size * 0.4}px Arial\`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('名', size/2, size/2);

            // 下载
            const link = document.createElement('a');
            link.download = \`icon-\${size}.png\`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    }
    </script>
</body>
</html>`

  fs.writeFileSync(path.join(publicDir, 'icon-generator.html'), htmlTool)
  console.log('\n✅ 已生成图标生成工具: public/icon-generator.html')
  console.log('📖 在浏览器中打开此文件来生成PNG图标')
}

if (require.main === module) {
  generatePNGIcons()
}

export default generatePNGIcons