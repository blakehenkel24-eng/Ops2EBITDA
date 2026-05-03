import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? 
      walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('app', file => {
  if (!file.endsWith('.tsx')) return;
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('<ContentCard')) {
    if (content.includes('item={item}')) {
      if (!content.includes('hrefFor')) {
        content = `import { hrefFor } from "@/lib/routes";\n` + content;
      }
      if (!content.includes('labelForType')) {
        content = `import { labelForType } from "@/lib/format";\n` + content;
      }
      
      content = content.replace(/<ContentCard key=\{item\.slug\} item=\{item\} \/>/g, 
        `<ContentCard key={item.slug} title={item.title} description={item.summary} href={hrefFor(item)} tag={labelForType(item.type)} />`);
      
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Refactored ${file}`);
    }
  }
});
