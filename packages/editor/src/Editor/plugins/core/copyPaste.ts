import { NodeSelection, Plugin, TextSelection } from 'prosemirror-state';
import { Fragment, Node, Slice } from 'prosemirror-model';
import { nanoid } from 'nanoid';
import { EditorView } from 'prosemirror-view';

import { schema } from '@editor/Editor/plugins/schema';

import { getTopNode, isSameNode, getRangeByNode } from '@editor/Editor/shared/index';
import { CellSelection } from '../nodes/table';
import { markdownToBlock } from '../markdown/markdownToBlock';
import { hasMarkdownSyntax } from '@editor/Editor/shared/markdown';
import { MultiBlockSelection } from '../selection/multiBlock';

export const acceptedMIMETypes = ['text/html', 'text/plain', 'Files'] as const;

const removeComment = (node: Node) => {
    if (!node.isText) {
        return node;
    }

    const schema = node.type.schema;
    const commentType = schema.marks.comment;

    return node.mark(
        node.marks.filter(m => m.type !== commentType)
    );
}

/**
 * 粘贴时:
 * 1. 深度遍历，所有id都要重新生成
 * 2. 评论的comment docorator要去除
 * @param node
 * @returns 
 */
const clone = (node: Fragment | Node, parentNode?: Node | Fragment) => {
    if (node instanceof Fragment) {
        const content = node.content.map(item => clone(item, node))

        return Fragment.from(content);
    }

    if (!(node instanceof Node)) {
        return node;
    }

    if (node.isText) {
        return removeComment(node);
    }

    if (!node.isBlock) {
        return node;
    }

    if (node.type.name === 'textBlock_head' && (parentNode as Node)?.type?.name !== 'textBlock') {
        // 如果是从外部copy进来的出现了head， 则需要补全textBlock， 如果是文档内部copy的， parentNode肯定有textBlock， 不需要处理；
        return schema.nodes.textBlock.create({
            id: nanoid(8),
        }, [node])
    }

    if (node.type.name === 'list_head' && (parentNode as Node)?.type?.name !== 'list') {
        return schema.nodes.list.create({
            id: nanoid(8),
        }, [node]);
    }

    const attrs = node.attrs?.id ? {
        ...node.attrs,
        id: nanoid(8),
    } : node.attrs;

    const content: Node[] = [];
    node.content.forEach(item => {
        content.push(clone(item, node));
    });

    return node.type.create(attrs, content, node.marks);
}

const handleMarkdown = (text: string, view: EditorView) => {
    const { state, dispatch } = view;
    const { selection } = state;

    try {
        const root = markdownToBlock(text);

        if (root.lastChild?.content) {
            const nodes = root.lastChild.content.content;
            if (nodes.length > 0) {
                const tr = state.tr;
                tr.replaceRange(selection.$from.pos, selection.$to.pos, new Slice(Fragment.from(nodes), 0, 0));
                dispatch(tr);
                return true;
            }
        }
        
        return false;
    } catch(e) {
        // 解析失败时按普通文本处理
        return false;
    }
}

export const copyPastePlugin = () => {
    return [new Plugin({
        props: {
            clipboardTextSerializer: (slice) => {
                let text = '';

                 // 递归处理节点及其内容
                 const processNode = (node) => {
                    if (node.type.name === 'mention') {
                        text += `@${node.attrs?.name || ''}`;
                    } else if (node.isText) {
                        text += node.text;
                    } else if (node.content && node.content.size > 0) {
                        // 处理有子内容的节点
                        node.content.forEach(childNode => {
                            processNode(childNode);
                        });
                        
                        // 如果是块级节点，添加换行符
                        if (node.isBlock && !node.type.name.includes('title')) {
                            text += '\n';
                        }
                    }
                };

                // 处理顶层节点
                slice.content.forEach(topNode => {
                    processNode(topNode);
                });

                return text;
            },
            // 修改复制行为，只复制选中的内容
            handleDOMEvents: {
                copy: (view, event) => {
                    const { state } = view;
                    const { selection } = state;
                    const { $from, $to } = selection;
                    
                    // 如果在table内部， 不处理；
                    if (state.selection instanceof CellSelection) {
                        return false;
                    }

                    let filteredContent: Node[] = [];

                    // Handle NodeSelection - when a complete node is selected
                    if (state.selection instanceof NodeSelection) {
                        const selectedNode = state.selection.node;
                        filteredContent = [selectedNode];
                    }
                    else if (state.selection instanceof MultiBlockSelection) {
                        const { $anchor, $head } = selection;

                        const slice = view.state.doc.slice($anchor.pos, $head.pos);
                        filteredContent = slice.content.content as Node[];
                    }
                    else if (state.selection instanceof TextSelection) {
                        // Check if this is a full header selection (macOS workaround)
                        const isFullHeaderSelection = $from.parent.type.name === 'header' && 
                                                     $from.parentOffset === 0 && 
                                                     $to.parentOffset === $to.parent.content.size;

                        if (isFullHeaderSelection) {
                            // Find the header node and treat as node selection
                            const resolvedPos = view.state.doc.resolve($from.before());
                            const headerNode = resolvedPos.nodeAfter;
                            if (headerNode) {
                                filteredContent = [headerNode];
                            } else {
                                // Fallback to normal text selection handling
                                // 获取选区范围内的所有子节点
                                const slice = view.state.doc.slice($from.pos, $to.pos);

                                // 修复slice
                                const content = slice.content.content;

                                for (let i = 0; i < content.length;) {
                                    const node = content[i];

                                    // 如果是多级list， 则一定复制的还是list结构
                                    if (node.type.name === 'list_head') {
                                        // 当前节点是list_head， 向后找list_body， 如果有， 则合并， 并创建新的list
                                        // 向后找list_body
                                        let nextNode = content[i + 1];
                                        const listHead = node.cut(
                                            $from.parentOffset,
                                            isSameNode($from, $to) ? $to.parentOffset : undefined,
                                        );

                                        if (nextNode.type.name === 'list_body') {
                                            filteredContent.push(
                                                schema.nodes.list.create({
                                                    id: nanoid(8),
                                                }, [
                                                    listHead,
                                                    nextNode,
                                                ])
                                            );

                                            i = i + 2;
                                            continue;
                                        } else {
                                            filteredContent.push(
                                                schema.nodes.list.create({
                                                    id: nanoid(8),
                                                }, [
                                                    listHead,
                                                ])
                                            );
                                        }

                                        i++;
                                        continue;
                                    }

                                    // 如果是textBlock， 则按照如下规则
                                    // 第一个只复制文本， 其他的都按照node复制
                                    if (i === 0) {
                                        if ($from.parentOffset === 0) {
                                            filteredContent.push(node);
                                        } else {
                                            filteredContent.push(
                                                $from.parent?.cut(
                                                    $from.parentOffset,
                                                    isSameNode($from, $to) ? $to.parentOffset : undefined,
                                                )
                                            );
                                        }
                                    } else {
                                        filteredContent.push(node);
                                    }
                                    i++;
                                }
                            }
                        } else {
                            // 获取选区范围内的所有子节点
                            const slice = view.state.doc.slice($from.pos, $to.pos);

                            // 修复slice
                            const content = slice.content.content;

                            for (let i = 0; i < content.length;) {
                                const node = content[i];

                                // 如果是多级list， 则一定复制的还是list结构
                                if (node.type.name === 'list_head') {
                                    // 当前节点是list_head， 向后找list_body， 如果有， 则合并， 并创建新的list
                                    // 向后找list_body
                                    let nextNode = content[i + 1];
                                    const listHead = node.cut(
                                        $from.parentOffset,
                                        isSameNode($from, $to) ? $to.parentOffset : undefined,
                                    );

                                    if (nextNode.type.name === 'list_body') {
                                        filteredContent.push(
                                            schema.nodes.list.create({
                                                id: nanoid(8),
                                            }, [
                                                listHead,
                                                nextNode,
                                            ])
                                        );

                                        i = i + 2;
                                        continue;
                                    } else {
                                        filteredContent.push(
                                            schema.nodes.list.create({
                                                id: nanoid(8),
                                            }, [
                                                listHead,
                                            ])
                                        );
                                    }

                                    i++;
                                    continue;
                                }

                                // 如果是textBlock， 则按照如下规则
                                // 第一个只复制文本， 其他的都按照node复制
                                if (i === 0) {
                                    if ($from.parentOffset === 0) {
                                        filteredContent.push(node);
                                    } else {
                                        filteredContent.push(
                                            $from.parent?.cut(
                                                $from.parentOffset,
                                                isSameNode($from, $to) ? $to.parentOffset : undefined,
                                            )
                                        );
                                    }
                                } else {
                                    filteredContent.push(node);
                                }
                                i++;
                            }
                        }
                    }

                    const serializer = view.state.schema.cached.domSerializer;
                    const dom = document.createElement('div');
                    
                    // 序列化过滤后的内容
                    filteredContent.forEach(node => {
                        if (['textBlock_head', 'list_head'].includes(node.type.name)) {
                            // serializeFragment只会复制node的content内容， serializeNode会复制完整的node
                            dom.appendChild(serializer.serializeFragment(node));
                            return;
                        }

                        dom.appendChild(serializer.serializeNode(node));
                    });

                    // 设置剪贴板内容
                    event.clipboardData?.setData('text/html', dom.innerHTML);
                    event.clipboardData?.setData('text/plain', dom.textContent || '');
                    event.preventDefault();

                    return true;
                }
            },
            // paste的时候 ， 需要判断， 如果是在空textBlock里paste的， 就把textBlock节点替换为当前节点
            // 如果不是空的， 需要判断， 如果是文本， 就把文本插入， 如果不是文本，就插入一个块。
            handlePaste: (view, event, _slice) => {
                const { state, dispatch } = view;
                const { selection } = state;

                event.preventDefault()

                if (!view.editable || !event.clipboardData) {
                    return
                }

                let format: (typeof acceptedMIMETypes)[number] | undefined
                for (const mimeType of acceptedMIMETypes) {
                    if (event.clipboardData.types.includes(mimeType)) {
                        format = mimeType
                        break
                    }
                }

                if (!format) {
                    return true
                }

                if (format === 'text/plain') {
                    const text = event.clipboardData.getData('text/plain');
                    if (!text) return true;
                    
                    if (hasMarkdownSyntax(text)) {
                        return handleMarkdown(text, view);
                    }

                    return false;
                } if (format === 'text/html') {
                    // html格式， 先获取plain， 看是否有markdown，如果有就用plain处理， 用html还要转换问题多。
                    const text = event.clipboardData.getData('text/plain');
                    if (hasMarkdownSyntax(text)) {
                        if (handleMarkdown(text, view)) {
                            return true;
                        }
                    }
                    
                    let data = event.clipboardData!.getData(format);
                    if (!data) return true;

                    // 如果不是 markdown 或解析失败，按原来的 HTML 处理逻辑
                    // 创建一个 DOMParser 实例
                    const parser = new DOMParser();
                    // 解析 HTML 字符串为完整的文档
                    const doc = parser.parseFromString(data, 'text/html');
                    // 现在可以访问完整的文档结构，包括 html 和 body
                    const bodyElement = doc.body; // 获取 body 元素
                    
                    const { $from, $to, empty } = selection;

                    const tr = state.tr;

                    // 使用 ProseMirror 的 DOMParser 解析整个结构
                    const domParser = view.state.schema.cached.domParser;
                    const slice = domParser.parseSlice(bodyElement);
                    let content = slice.content;

                    if (content.content?.[0].type.name === 'body') {
                        content = content.content[0].content;
                    }

                    const cloneContent = clone(content);

                   
                    // 空文本节点插入
                    const topNode = getTopNode($from);
                    if ($from.parentOffset === 0 && !topNode.textContent) {
                        tr.replaceRangeWith($from.pos, $to.pos, cloneContent);
                        const newPos = Math.min($from.pos + cloneContent.size, tr.doc.content.size);
                        const resolvedPos = tr.doc.resolve(newPos);
                        tr.setSelection(TextSelection.near(resolvedPos));
                    } else {
                        // cloneContent的第一个node要判断是否可否转为text， 比如header，如果可转， 则转为text， 否则直接插入。
                        if (content.firstChild?.type.name === 'header') {
                            const header = content.firstChild;
                            const leftContentSize = cloneContent.size - header.nodeSize;

                            tr.delete($from.pos, $to.pos);
                            tr.insert($from.pos, header.content);
                            tr.insert($from.pos + header.content.size, cloneContent.content.slice(1));

                            const newPos = Math.min($from.pos + header.content.size + leftContentSize, tr.doc.content.size);
                            const resolvedPos = tr.doc.resolve(newPos);
                            tr.setSelection(TextSelection.near(resolvedPos));
                        } else if (content.firstChild?.type.name === 'textBlock') {
                            // textBlockHead的content
                            const textBlockHeadContent = content.firstChild?.content?.content;
                            const leftContentSize = cloneContent.size - content.firstChild.nodeSize;

                            tr.delete($from.pos, $to.pos);
                            tr.insert($from.pos, textBlockHeadContent);
                            tr.insert($from.pos + textBlockHeadContent.size, cloneContent.content.slice(1));

                            const newPos = Math.min($from.pos + textBlockHeadContent.size + leftContentSize, tr.doc.content.size);
                            const resolvedPos = tr.doc.resolve(newPos);
                            tr.setSelection(TextSelection.near(resolvedPos));
                        } else {
                            tr.replaceRangeWith($from.pos, $to.pos, cloneContent);
                            const newPos = Math.min($from.pos + cloneContent.size, tr.doc.content.size);
                            const resolvedPos = tr.doc.resolve(newPos);
                            tr.setSelection(TextSelection.near(resolvedPos));
                        }
                    }

                    dispatch(tr);

                    return true
                } else if (format === 'Files') {
                    const files = event.clipboardData.files;
                    if (!files || files.length === 0) return true;
                    for (let i = 0; i < files.length; i++) {
                        const file = files[i];
                        if (file.type && file.type.startsWith('image/')) {
                            const reader = new FileReader();
                            reader.onload = function(e) {
                                const src = e.target?.result;
                                if (!src) return;
                                const img = new window.Image();
                                img.onload = function() {
                                    const width = img.width;   // 图片实际宽度（像素）

                                    // 你可以根据需要设置 imageNode 的 width/height 属性
                                    const imageNode = schema.nodes.image.create({
                                        id: nanoid(8),
                                        src,
                                        width: Math.min(width, 820), // 或 '100%'，或其它
                                        align: 'left',
                                    });
                                    dispatch(view.state.tr.replaceSelectionWith(imageNode));
                                };
                                img.src = src as string;
                            };
                            reader.readAsDataURL(file);
                        }
                    }
                    return true;
                }
            }
        }
    })];
};