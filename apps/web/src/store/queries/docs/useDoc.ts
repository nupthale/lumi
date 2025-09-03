import type { Ref } from 'vue';
import { computed, ref } from 'vue';

import { database } from '@/database/database';
import { useLiveQuery } from '@/database/useLiveQuery';

// 注意：fileIdRef是fileId， 不是docId
export const useDoc = (fileIdRef: Ref<string>) => {
    const pending = ref(false);
    const error = ref(false);

    // 用 useObservable 包装为 vue 响应式
    const docs = useLiveQuery(
        [], // 这里不能监听files表， 否则会死循环， docChange$改变files的title，又会这里的query， 结果doc变化， 又触发docChange$。
        async () => {
          if (!fileIdRef.value) return [];
          
          pending.value = true;

          try {
            // 1. 查 file
            const fileResult = await database.files?.find({
              selector: { _id: fileIdRef.value, deleted: 0 }
            });
            const file = fileResult?.docs?.[0];

            error.value = false;

            if (!file) return [];

            // 4. 拼接
            return [{
              id: file?._id || '',
              fileId: file._id,
              title: file.title,
              type: file.type,
              cover: file.cover,
              emoji: file.emoji,
              tags: file.tags || [],
            }];
          } catch(e) {
            error.value = true;
            console.error(e);

            return [];
          } finally {
            pending.value = false;
          }
        },
        [fileIdRef],
      );

    return {
        doc: computed(() => {
            const docsArray = docs.value as any[];
            return docsArray?.[0];
        }),
        pending,
        error,
    };
}