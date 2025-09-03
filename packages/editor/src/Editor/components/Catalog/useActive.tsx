import { ref, watchEffect, Ref } from 'vue';
import { useSubscription } from '@vueuse/rxjs';
import { tap, filter } from 'rxjs/operators';

import { docScroll$ } from '../../event'; 
import { manualSetActiveId$ } from './event'; 

/**
 * .doc-title和headersRef.value按照offsetTop排序， 判断当前距离顶部最近的一个， 然后高亮
 */

export const useActive = (titleRef: Ref<{ id?: string }>, headersRef: Ref<{ id: string }[]>) => {
    const activeIdRef = ref(titleRef.value?.id);
    const nodesRef = ref<{ id: string, offsetTop: number }[]>([]);

    const ignoreScroll = ref(false); // 用于忽略scroll事件， 比如点击了目录中的某个标题

    watchEffect(() => {
        const nodes = titleRef?.value?.id ? [titleRef.value, ...headersRef.value] : [];
        const resultNodes: { id: string, offsetTop: number }[] = [];

        nodes.forEach((node) => {
            const el = document.querySelector(`[data-id="${node.id}"]`) as HTMLElement;
            if (el) {
                resultNodes.push({
                    id: node.id!,
                    offsetTop: el.offsetTop,
                });
            }
        });

        nodesRef.value = resultNodes.sort((prev, next) => prev.offsetTop - next.offsetTop);
    });

    useSubscription(
        manualSetActiveId$.pipe(
            tap((id) => {
                activeIdRef.value = id;
                ignoreScroll.value = true;

                setTimeout(() => {
                    ignoreScroll.value = false;
                }, 300);
            }),
        ).subscribe(),
    );

    useSubscription(
        docScroll$.pipe(
            filter(() => !ignoreScroll.value),
            tap(({ e }) => {
                const scrollTop = (e.target as HTMLElement).scrollTop;
                let activeId: string | null = null;
                let minDistance = Infinity;

                nodesRef.value.forEach((node) => {
                    const distance = Math.abs(node.offsetTop - scrollTop);
                    if (distance < minDistance) {
                        minDistance = distance;
                        activeId = node.id;
                    }
                });

                activeIdRef.value = activeId || titleRef.value?.id;
            }),
        ).subscribe(),
    );

    return {
        activeIdRef,
    };
}