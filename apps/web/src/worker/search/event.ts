import { Subject } from 'rxjs';

// 需要索引的是： 文档内容、collection的value、collection的标题
export const updateFileSearchIndex$ = new Subject<{
    fileId: string;
    docText: string;
    collectionsText: string[];
}>();