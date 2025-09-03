import { onMounted, onUnmounted, ref, watch } from "vue";
import type { Ref } from 'vue';
import { useSubscription } from '@vueuse/rxjs';
import { tap } from 'rxjs/operators';

import { useUserStore } from '@/store/user';
import type { DatabaseKey } from './database';
import { databaseChange$ } from './events';
import { storeToRefs } from "pinia";

export function useLiveQuery<T>(
  keys: DatabaseKey[],
  querier: () => T | Promise<T>,
  deps: Ref<any>[],
): Readonly<Ref<T>> {
  const value = ref<T | undefined>();
  const changsRef = ref<PouchDB.Core.Changes<any>[]>([]);

  const userStore = useUserStore();
  const { user } = storeToRefs(userStore);

  const handleChange = async () => {
    value.value = await querier();
  }

  useSubscription(
    databaseChange$.pipe(
      tap(({ dbName }) => {

        const localKeys = keys.map(key => `${key}_${user.value?.id}`);

        if (localKeys.includes(dbName as DatabaseKey)) {
          handleChange();
        }
      })
    ).subscribe()
  );

  onMounted(() => {
    handleChange();
  });

  watch(deps, handleChange);

  onUnmounted(() => {
    changsRef.value?.forEach(changeHandle => changeHandle.cancel());
  });

  return value as Readonly<Ref<T>>;
}