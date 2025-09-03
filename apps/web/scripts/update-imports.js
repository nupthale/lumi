const fs = require('fs');
const path = require('path');
const glob = require('glob');

// 定义别名映射
const aliasMap = {
  '@/': 'src/',
  '#/': 'api/',
  '@editor/': 'editor/'
};

// 获取所有需要处理的文件
const files = glob.sync('src/**/*.{ts,tsx,vue}', {
  cwd: path.resolve(__dirname, '..')
});

// 处理每个文件
files.forEach(file => {
  const filePath = path.resolve(__dirname, '..', file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // 替换导入语句
  Object.entries(aliasMap).forEach(([oldAlias, newAlias]) => {
    const regex = new RegExp(`from ['"]${oldAlias}([^'"]+)['"]`, 'g');
    content = content.replace(regex, `from '${newAlias}$1'`);
  });

  // 写回文件
  fs.writeFileSync(filePath, content);
});

console.log('Import statements updated successfully!'); 