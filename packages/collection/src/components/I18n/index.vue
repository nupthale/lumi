<script lang="tsx">
import { defineComponent, computed, PropType } from 'vue';

import { i18next } from '@collection/i18next';

export default defineComponent({
    props: {
        tKey: String,
    },
    setup(props, { slots }) {
        const partsRef = computed(() => {
            const text = i18next.t(props.tKey || '');

            return text?.split(/(\{\{.*?\}\})/).filter(Boolean) || [];
        });

        return () => partsRef.value?.map((part) => {
            if (part.startsWith('{{') && part.endsWith('}}')) {
                const slotName = part.slice(2, -2).trim();

                if (slots[slotName]) {
                    return slots[slotName]();
                }

                return part;
            }

            return part;
        });
    }
})
</script>