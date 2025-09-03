import { watchEffect, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import { useWikiTree } from '@/store/queries/docs/useWikiTree';

export const useNavToFirst = () => {
    const route = useRoute();
    const router = useRouter();

    const wikiIdRef = ref(route.params.wikiId as string);

    const { wikiTree } = useWikiTree(wikiIdRef);

    watchEffect(() => {
        if (!route.params.fileId) {
            const firstFileId = wikiTree.value?.[0]?.file;

            if (firstFileId) {
                router.replace(`/wikis/wiki/${wikiIdRef.value}/doc/${firstFileId}`);
            }
        }
    });
}