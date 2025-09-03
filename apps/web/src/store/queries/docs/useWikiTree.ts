import type { Ref } from 'vue';
import { computed } from 'vue';

import { database } from '@/database/database';
import { useLiveQuery } from '@/database/useLiveQuery';

export type WikiTreeItem = {
    wiki: string;
    file: string;
    parentFile?: string;
    orderIndex?: number;
    title: string;
    type: string;
    emoji: string;
    children?: WikiTreeItem[];
};

const toTree = (wikiTreeList: WikiTreeItem[]): WikiTreeItem[] => {
    // 先复制一份，避免污染原数据
    const items = wikiTreeList.map(item => ({ ...item }));

    // 递归构建树
    const build = (parentFile: string | undefined | null): WikiTreeItem[] => {
        // 找到所有当前 parentFile 的直接子节点
        const children: WikiTreeItem[] = items
            .filter(item => (item.parentFile ?? '') === (parentFile ?? ''))
            .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
            .map(item => ({
                ...item,
                children: build(item.file),
            }));
        return children;
    };

    // 根节点 parentFile 为空字符串或 undefined
    return build('');
};

export const useWikiTree = (wikiId: Ref<string>) => {
    // 使用 pouchdb-find 查询 wikiTree 和 files
    const wikiTree = useLiveQuery(
        ['wikitrees', 'files'],
        async () => {
            if (!wikiId.value) return [];
            // 1. 查所有该wiki下的wikiTree节点
            const wikiTreeResult = await database.wikiTrees?.find({
                selector: { wiki: wikiId.value, deleted: 0 }
            });
            const wikiTrees = wikiTreeResult?.docs || [];
            if (!wikiTrees.length) return [];

            // 2. 查所有涉及到的file
            const fileIds = wikiTrees.map((wt: any) => wt.file);
            const filesResult = await database.files?.find({
                selector: { _id: { $in: fileIds }, deleted: 0 }
            });
            const files = filesResult?.docs || [];
            
            // 3. 拼接
            const wikiTreeList = wikiTrees.map((wt: any) => {
                const file = files.find((f: any) => f && f._id === wt.file);
                return {
                    wiki: wt.wiki,
                    file: wt.file,
                    parentFile: wt.parentFile,
                    orderIndex: wt.orderIndex,
                    title: file?.title || '',
                    type: file?.type || '',
                    emoji: file?.emoji || '',
                };
            });

            return toTree(wikiTreeList ?? []);
        },
        [wikiId]
    );

    return {
        wikiTree,
    };
}