import type { Ref } from 'vue';
import { ref } from 'vue';
import { isNil } from 'lodash-es';

import { Modal } from 'ant-design-vue';
import { dragContext } from '@he-tree/vue';

import { events } from '@/database/index';
import { uniqueId } from '@/shared/id';
import { WikiTreeItem } from '@/store/queries/docs/useWikiTree';
import { useUserStore } from '@/store/user';
import { storeToRefs } from 'pinia';

const getChildFileIds = (fileNode: WikiTreeItem, ids: string[]) => {
    ids.push(fileNode.file);

    fileNode.children?.forEach((item: WikiTreeItem) => {
        getChildFileIds(item, ids);
    });
}

const getFile = (fileId: string, wikiTree: WikiTreeItem[]) => {
    let file: WikiTreeItem | undefined;

    wikiTree.forEach((item, index) => {
        if (item.file === fileId) {
            file = item;
            return;
        }

        getFile(fileId, item.children || []);
    })

    return file;
}

export const useActions = (wikiRef: Ref<Record<string, any>>, wikiTree: Ref<WikiTreeItem[]>) => {
    const dragFileId = ref();

    const userStore = useUserStore();
    const { user } = storeToRefs(userStore);

    // 在最下方插入一个文档
    const handleAddDoc = async (parent?: WikiTreeItem, wikiTree?: Ref<WikiTreeItem[]>) => {
        const fileId = uniqueId();

        if (!user.value?.id) {
            throw Error('用户id不存在');
        }

        events.fileCreated({
            id: fileId,
            type: 'Doc',
            wiki: wikiRef.value?._id,
            title: '',
            creator: user.value.id,
        });

        let orderIndex = ((parent?.children?.length || 0) + 1) * 10;

        if (!parent) {
            orderIndex = ((wikiTree?.value?.length || 0) + 1) * 10;
        }

        events.wikiTreeCreated({
            wiki: wikiRef.value?._id,
            file: fileId,
            parentFile: parent?.file,
            // * 10扩大范围， 这样排序， 取中可以减少精度问题的概率
            orderIndex,
            creator: user.value.id,
        });
    };

    const handleDragStart = (e) => {
        const itemNode = e.target;

        const div = itemNode.cloneNode(true);
        
        div.style.position = 'absolute';
        div.style.top = '-9999px';
        div.style.left = '-9999px';
        div.style.width = '180px';
        div.style.height = '35px';
        div.style.background = 'rgba(0, 0, 0, 0.08)';
        div.style.borderRadius = '6px';
        div.style.overflow = 'hidden';
        div.style.pointerEvents = 'none';
        div.style.background = 'transparents';
        div.style.zIndex = '9999';

        document.body.appendChild(div);

        e.dataTransfer.setDragImage(div, 10, 10)
        
        // 拖拽结束后移除
        setTimeout(() => {
            div.remove();
        }, 100)
    }

    const handleBeforeDragStart = async (stat) => {
        dragFileId.value = stat?.data?.file;
    }

    const handleAfterDrap = () => {
        if (!dragContext) {
            return;
        }

        const { indexBeforeDrop, parent } = dragContext.targetInfo || {};
        let target = null;
        let prev = null;

        const parentFileId = parent?.data?.file;
        if (parentFileId) {
            const parentFile = getFile(parentFileId, wikiTree.value);
            if (!parentFile) return;

            target = parentFile.children[indexBeforeDrop];
            prev = parentFile.children[indexBeforeDrop - 1];
        } else {
            target = wikiTree.value[indexBeforeDrop];
            prev = wikiTree.value[indexBeforeDrop - 1];
        }

        const targetOrderIndex = isNil(target?.orderIndex) ? 10 : (target?.orderIndex  + (prev?.orderIndex || 0)) / 2;
       
        events.wikiTreeUpdated({
            wiki: wikiRef.value?._id,
            file: dragFileId.value,
            parentFile: parentFileId,
            orderIndex: targetOrderIndex,
        });
    }

    const handleDeleteFile = async (fileNode: WikiTreeItem) => {
        Modal.confirm({
            title: "删除文档",
            content: fileNode?.children?.length ? "删除文档后，当前文档以及所有的子文档都将被删除，是否继续？" : "删除文档后，将无法恢复，是否继续？",
            okType: 'danger',
            okText: '删除',
            cancelText: '取消',
            centered: true,
            onOk: async () => {
                // 只删了入口， file不删
                const fileIds: string[] = [];
                getChildFileIds(fileNode, fileIds);

                events.wikiTreeNodeDeleted({
                    wiki: wikiRef.value?.id,
                    fileIds,
                });
            }
        });
    }

    return {
        handleAddDoc,
        handleDeleteFile,
        handleDragStart,
        handleBeforeDragStart,
        handleAfterDrap,
    };
}