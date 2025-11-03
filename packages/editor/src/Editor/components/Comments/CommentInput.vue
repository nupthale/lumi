<script lang="tsx">
import { defineComponent, ref } from 'vue';
import { Input, Button } from 'ant-design-vue';
import { useSubscription } from '@vueuse/rxjs';
import { filter, tap } from 'rxjs/operators';

import { i18next } from '@editor/i18n';

import { 
    focusCommentInput$,
} from './event';

export default defineComponent({
    props: {
        id: String,
        defaultVal: String,
        active: Boolean,
    },
    emits: ['send', 'cancel'],
    setup(props, { emit }) {
        const inputVal = ref<string | undefined>(props.defaultVal);
        const inputRef = ref<HTMLElement>();

        useSubscription(
            focusCommentInput$.pipe(
                filter(({ id }) => id === props.id && !!inputRef.value),
                tap(() => {
                    inputRef.value?.focus();
                }),
            ).subscribe(),
        );

        const handleCancel = () => {
            inputVal.value = '';
            emit('cancel');
        }

        const handleSend = () => {
            if (!props.id || !inputVal.value?.length) {
                return;
            }

            emit('send', inputVal.value);

            inputVal.value = '';
            inputRef.value?.focus();
        }

        return () => props.active || inputVal.value?.length ? (
            <div>
                <Input.TextArea
                    ref={inputRef}
                    autoSize={{ minRows: 1 }}
                    placeholder={i18next.t('editor.comment.placeholder')}
                    value={inputVal.value}
                    onChange={(e) => {
                        inputVal.value = e.target.value;
                    }}
                    onPressEnter={(e) => {
                        // Check if Shift key is pressed
                        if (e.shiftKey) {
                            // Allow default behavior (line break) and do not send
                            return;
                        }
                        
                        // If no Shift key, prevent default and send
                        e.preventDefault();
                        handleSend();
                    }}
                />

                {
                    inputVal.value?.length? (
                        <div class="flex items-center justify-end mt-3" onClick={e => e.stopPropagation()}>
                            <Button class="sider-commentBtn" size="small" onClick={handleCancel}>{i18next.t('editor.comment.cancel')}</Button>
                            <Button type="primary" size="small" class="sider-commentBtn ml-2" onClick={handleSend}>{i18next.t('editor.comment.send')}</Button>
                        </div>
                    ) : ''
                }
            </div>
        ) : '';
    }
});
</script>