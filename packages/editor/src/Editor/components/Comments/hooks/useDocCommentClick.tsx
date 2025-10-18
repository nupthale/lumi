import { onMounted, onUnmounted } from 'vue';

import { activeComment$, addCommentTransition$ } from '../event';

export const useDocCommentClick = () => {
    const handleClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        const commentEl = target.closest('.doc-comment');
        if (commentEl) {
            const refId = commentEl.getAttribute('data-comment-id')!;

            addCommentTransition$.next();

            activeComment$.next({
                refId,
            });
        }
    }

    onMounted(() => {
        document.addEventListener('click', handleClick, true);
    });

    onUnmounted(() => {
        document.removeEventListener('click', handleClick, true);
    });
}