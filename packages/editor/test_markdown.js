import { unified } from 'unified';
import remarkParse from 'remark-parse';

// 只使用 remark-parse 来查看原始 AST
const processor = unified().use(remarkParse);

const markdown = '![This is an alt text.](/image/sample.webp "This is a sample image.")';
const result = processor.processSync(markdown);

console.log('Original markdown:', markdown);
console.log('Parsed AST:', JSON.stringify(result.result, null, 2)); 