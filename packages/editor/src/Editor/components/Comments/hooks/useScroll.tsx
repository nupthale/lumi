import { onMounted, onUnmounted, ref } from 'vue';
import { useSubscription } from '@vueuse/rxjs';
import { tap } from 'rxjs/operators';

import { removeCommentTransition$ } from '../event';
import { docScroll$ } from '../../../event';

export const useScroll = (offsetY, updateOffsetY) => {
    const scrollTop = ref(0);
    const isAtEnd = ref(false);

    useSubscription(
        docScroll$.pipe(
            tap(({ e }) => {
                scrollTop.value = (e.target as HTMLElement)?.scrollTop || 0;
                isAtEnd.value = scrollTop.value === (e.target as HTMLElement)?.scrollHeight - (e.target as HTMLElement)?.clientHeight;
            }),
        ).subscribe(),
    );

    const handleWheel = (e: WheelEvent) => {
        // 判断页面已经滚动到顶部或者底部了， 则移动。
        if (scrollTop.value > 0) {
            return;
        }

        removeCommentTransition$.next();

        updateOffsetY(
            offsetY.value + e.deltaY,
        );
    }

    onMounted(() => {
        document.addEventListener('wheel', handleWheel);
    });

    onUnmounted(() => {
        document.removeEventListener('wheel', handleWheel);
    });
}
