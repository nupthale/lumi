<script lang="tsx">
import { defineComponent, ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import i18next from 'i18next';

import { useContextStore } from '@/store/ui-states/context';

enum SaveStatusEnum {
    INIT = 'init',
    SAVING = 'saving',
    SUCCESS = 'success',
    ERROR = 'error',
}

export default defineComponent({
  props: {
    title: String,
  },  
  setup(props) {
    const statusRef = ref(SaveStatusEnum.INIT);

    const contextStore = useContextStore();
    const { crtSpace } = storeToRefs(contextStore);

    const renderStatusText = computed(() => {
        if (statusRef.value === SaveStatusEnum.SAVING) {
            return i18next.t('doc.head.saving');
        }

        if (statusRef.value === SaveStatusEnum.SUCCESS) {
            return i18next.t('doc.head.saved');
        }

        if (statusRef.value === SaveStatusEnum.ERROR) {
            return i18next.t('doc.head.saveFailed');
        }
    })

    return () => (
        <div>
            <div>{props.title || ''}</div>
            <div class="doc-autosave">
                {renderStatusText.value}
            </div>
        </div>
    );
  }
});
</script>

<style scoped>
.doc-autosave {
    font-size: 12px;
    color: var(--light-text-color);
}
</style>