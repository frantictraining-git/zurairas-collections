import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const apiAdminPath = path.join(__dirname, '../app/api/admin');

const authLogic = `import { checkAdminAuth } from '@/lib/adminAuth';`;

function walkAndReplace(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkAndReplace(fullPath);
    } else if (file === 'route.js' && !fullPath.includes('login') && !fullPath.includes('settings')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Remove old checkAuth definition
      content = content.replace(/\/\/ Simple admin auth check[\s\S]*?};\n/, '');
      
      // Replace calls to checkAuth() with checkAdminAuth()
      content = content.replace(/checkAuth\(\)/g, 'checkAdminAuth()');
      
      // Add import if not present
      if (!content.includes('checkAdminAuth')) {
        content = authLogic + '\n' + content;
      }
      // Remove cookies import if unused
      if (content.includes("import { cookies } from 'next/headers';") && !content.match(/cookies\(/)) {
        content = content.replace(/import { cookies } from 'next\/headers';\n/, '');
      }
      
      fs.writeFileSync(fullPath, content);
      console.log('Updated:', fullPath);
    }
  }
}

walkAndReplace(apiAdminPath);
