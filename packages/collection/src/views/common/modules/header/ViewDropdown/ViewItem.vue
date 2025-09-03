<script lang="tsx">
import { defineComponent, PropType, inject, ref, watchEffect, watch } from 'vue';
import { TextButton } from '@zsfe/zsui';
import { Dropdown, Menu, Input } from 'ant-design-vue';
import { nanoid } from 'nanoid';

import { i18next } from '@collection/i18next';
import ViewIcon from '@collection/components/ViewIcon.vue';
import { CollectionSchemaType, ViewType } from '@collection/interface';

import { updateViewName$ } from '@collection/events';
import ViewAction from './ViewAction.vue';
import { getViewTypeText } from '@collection/shared/view';

export default defineComponent({
  props: {
    view: Object as PropType<ViewType>,
    schema: Object as PropType<CollectionSchemaType>,
  },
  setup(props) {
    const id = inject<string>('id')!;

    const editForm = ref<ViewType | null>(null);

    const inputRef = ref();

    watchEffect(() => {
        if (editForm.value) {
            setTimeout(() => {
                inputRef.value?.focus();
            }, 0);
        }
    });

    const handleRename = () => {
        editForm.value = {
            ...props.view,
        } as ViewType;
    }

    const handleSubmitRename = () => {
        if (!props.view) return;

        updateViewName$.next({
            id,
            viewId: props.view?.id,
            name: editForm.value?.name || getViewTypeText(props.view?.type),
        });

        editForm.value = null;
    }

    return () => {
        if (editForm.value) {
            return (
                <div class="flex justify-between  items-center" onClick={e => e.stopPropagation()}>
                    <div class="flex items-center gap-2">
                        <ViewIcon type={props.view?.type} size={16} />
                        <Input
                            ref={inputRef}
                            placeholder={i18next.t('collection.viewAction.placeholder')}
                            autofocus
                            value={editForm.value?.name}
                            onChange={(e) => editForm.value!.name = e.target.value || ''}
                         />
                    </div>

                    <TextButton type="primary" size="small" class="renameSubmitBtn ml-1 text-xs" onClick={handleSubmitRename}>
                        {i18next.t('common.okText')}
                    </TextButton>
                </div>
            );
        }

        return (
            <div class="flex justify-between">
                <div class="flex items-center gap-2">
                    <ViewIcon type={props.view?.type} size={16} />
                    {props.view?.name}
                </div>

                <ViewAction 
                    schema={props.schema} 
                    view={props.view}
                    onRename={handleRename}
                />
            </div>
        );
    };
  }
});
</script>

<style scoped>
.renameSubmitBtn {
    height: 24px;
    padding: 0 4px!important;
}
</style>