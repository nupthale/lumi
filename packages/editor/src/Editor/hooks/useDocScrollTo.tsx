import { useSubscription } from '@vueuse/rxjs';
import { tap } from 'rxjs/operators';

import { useContextStore } from '../store/context';
import { docScrollTo$ } from '../event';

export const useDocScrollTo = () => {
    const { state } = useContextStore();

    useSubscription(
        docScrollTo$.pipe(
            tap(({ el }) => {
                const scrollEl = state.value?.scrollEl;
                if (el && scrollEl) {
                    // 320是banner的高度
                    scrollEl.scrollTo(0, el.offsetTop + 320 - 78);
                }
            }),
        ).subscribe(),
    );
}