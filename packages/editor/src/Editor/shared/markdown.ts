import { isNil } from 'lodash-es';

import { 
  CollectionSchemaType,
  ColumnType,
} from '@collection/interface';

import { ListTypeEnum } from '@editor/Editor/plugins/nodes/list/interface';

import { listStore } from '@editor/Editor/store/list';
import { getOrderedIndex } from '@editor/Editor/plugins/nodes/list/util';

export const hasMarkdownSyntax = (text: string) => {
    // 更全面的 Markdown 语法检测
    const markdownPatterns = [
        // 标题语法 (# ## ### 等)
        /^#{1,6}\s+/m,
        
        // 列表语法 (- * + 1. 2. 等)
        /^[\-\*\+]\s+/m,
        /^\d+\.\s+/m,
        
        // 引用语法 (>)
        /^>\s+/m,
        
        // 代码块语法 (```)
        /```[\s\S]*?```/,
        
        // 行内代码语法 (`)
        /`[^`]+`/,
        
        // 粗体语法 (**text** 或 __text__)
        /\*\*[^*]+\*\*/,
        /__[^_]+__/,
        
        // 斜体语法 (*text* 或 _text_)
        /\*[^*]+\*/,
        /_[^_]+_/,
        
        // 删除线语法 (~~text~~)
        /~~[^~]+~~/,
        
        // 图片语法 (![alt](url))
        /!\[[^\]]*\]\([^)]+\)/,
        
        // 链接语法 ([text](url))
        /\[[^\]]*\]\([^)]+\)/,
        
        // 自动链接 (<url>)
        /<https?:\/\/[^\s>]+>/,
        
        // 水平分割线 (--- 或 *** 或 ___)
        /^[\-\*_]{3,}$/m,
        
        // 表格语法 (| 分隔)
        /^\|.*\|.*\|/m,
        
        // 任务列表语法 (- [ ] 或 - [x])
        /^[\-\*\+]\s+\[[\sxX]\]\s+/m,
        
        // 脚注语法 ([^1]:)
        /^\[\^[^\]]+\]:/m,
        
        // 定义列表语法 (:)
        /^[^:]+:\s+/m,
        
        // 高亮语法 (==text==)
        /==[^=]+==/,
        
        // 下标语法 (~text~)
        /~[^~]+~/,
        
        // 上标语法 (^text^)
        /\^[^^]+\^/,
        
        // 转义字符 (\)
        /\\[#\-\*\+\.\[\]\(\)\{\}\!\`]/,

        // 数学公式 ($...$ 或 $$...$$)， 暂时去掉， 因为还不支持， 要不然没转换会被识别为markdown文本
        // /\$[^$]+\$/,
        // /\$\$[^$]+\$\$/,
    ];
    
    return markdownPatterns.some(pattern => pattern.test(text));
}

export const toMarkdown = (title: string, doc: Record<string, any>, collections: Record<string, {
    schema: CollectionSchemaType,
    values: Record<string, any>,
  }>) => {
  let text = '';
 
  function collectionToMarkdown(id: string) {
    const collection = collections[id];

    if (!collection) {
        return;
    }

    const columns = collection.schema.columns;
    const titles = columns.map(col => col.title);

    const rows = collection.values || [];

    const getColText = (row: Record<string, any>, col: ColumnType) => {
        const value = row[col.id];

        if (isNil(value) || !`${value}`?.length) {
            return '';
        }

        return value;
    }

    return `| ${titles.join(' | ')} |\n| ${titles.map(() => '---').join(' | ')} |\n${rows.map(row => `| ${columns.map(col => getColText(row, col)).join(' | ')}`).join('\n')}`;
  }

  const listToMarkdown = (node: Record<string, any>) => {
    let listText = '';

    const listId = node.attrs.id;
    const map = listStore.getState().orderedListMap || {};
    const indexStr = getOrderedIndex(map[listId]);

    const markdown = (child, level = 0) => {
        child.content?.forEach(child => {
            if (child.type === 'list_head') {
                const listType = child.attrs.type;

                const inlineText = child.content?.map(item => getInlineText(item)).join('') || '';

                if (listType === ListTypeEnum.TODO) {
                    listText += '\t'.repeat(level) + `[] ${inlineText}\n`
                } else if (listType === ListTypeEnum.ORDERED) {
                    listText += '\t'.repeat(level) + `${indexStr}. ${inlineText}\n`
                } else {
                    listText += '\t'.repeat(level) + `* ${child.content?.map(item => getInlineText(item)).join('') || ''}`
                }
            } else if (child.type === 'list_body') {
                child.content.forEach(item => {
                    markdown(item, level + 1);
                });
            }
        });
    }

    markdown(node);

    return listText;
  }

  function getInlineText(node: Record<string, any>) {
    switch(node.type) {
        case 'text':
            return node.text;  
        case 'emoji':
            return node.content?.[0]?.text;
    }
  }

  function nodeToMarkdown(node: Record<string, any>) {
    switch(node.type) {
        case 'doc':
            node.content.forEach((child) => {
                nodeToMarkdown(child);
            }); 
            break;
        case 'title':
            text += `# ${title}\n`;
            break;
        case 'body':
            node.content.forEach((child) => {
                nodeToMarkdown(child);
            });
            break;
        case 'coder':
            text += "```" + node.attrs.language + "\n" + node.content?.[0]?.text + "\n```\n";
            break;      
        case 'collection':        
            const id = node.attrs.id;
            text += collectionToMarkdown(id);
            text += "\n";
            break;  
        // markdown不支持columns
        case 'columns':
        case 'column':
            node.content.forEach(child => {
                nodeToMarkdown(child);
            });
            break;
        case 'divider':
            text += '---\n';
            break; 
        case 'textBlock':
            const head = node.content[0];
            const body = node.content[1];

            head.content?.forEach(child => {
                nodeToMarkdown(child);
            });

            text += '\n';

            if (body?.content?.length) {
                body?.content?.forEach(child => {
                    nodeToMarkdown(child);
                });

                text += '\n';
            }

            break;   
        case 'text':
        case 'emoji':
            text += getInlineText(node);
            break;
        case 'header':
            text += '#'.repeat(node.attrs.level || 1) + ' ' + node.content.map(child => getInlineText(child)).join('');
            text += '\n';
            break;
        // md不支持highlight    
        case 'highlight':
            node.content?.forEach(child => {
                nodeToMarkdown(child);
            });
            break;
        case 'iframe':
            text += `[${node.attrs.src}](${node.attrs.src})\n`;
            break;   
        case 'image':
        case 'video':
            text += `![](${node.attrs.src})\n`;
            break;  
        case 'quote':
            node.content.forEach(child => {
                text += '> ';
                nodeToMarkdown(child);
                text += '> \n';
            });
            break;    
        case 'list':
            text += listToMarkdown(node);
            text += '\n';
            break;
        // table不支持， markdown只支持最简单的inline，无法转换。
        case 'table':
            break;        
    }
  }

  nodeToMarkdown(doc);

  return text;
};