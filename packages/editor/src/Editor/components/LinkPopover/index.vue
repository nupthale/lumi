<script lang="tsx">
import { defineComponent, ref, computed } from 'vue';
import { Input, Button, InputGroup } from 'ant-design-vue';
import { useEventListener } from '@vueuse/core';
import { useSubscription } from '@vueuse/rxjs';
import { filter, tap, debounceTime } from 'rxjs/operators';
import { TextSelection } from 'prosemirror-state';

import Popover from '../Popover/index.vue';

import { isUrl } from '../../shared/url';

import { schema } from '../../plugins/schema/index';
import { contextStore } from '../../store/context';
import { PopoverTypeEnum } from '../../interface';
import { showPopover$, hidePopover$ } from '../../event';
import { useContextStore } from '../../store/context';

export default defineComponent({
    setup(_props) {
        const { state } = useContextStore();

        const inputRef = ref();
        const textRef = ref('');

        const handleSubmit = (e) => {
            e.stopPropagation();
            e.preventDefault();

            const editorView = contextStore.getState().editorView;
            if (!editorView) return;

            const { state, dispatch } = editorView;
            const { from, to } = state.selection;
            const tr = state.tr;

            // 创建带有 href 属性的 link mark
            const linkMark = schema.marks.link.create({ href: textRef.value });
            // 先删除mockSelection
            tr.removeMark(from, to, schema.marks.mockSelection);
            // 添加 link mark 到选区
            tr.addMark(from, to, linkMark);

            // 设置link后， 光标放到link的结束位置，确保后续输入不在link范围内
            // 在链接后插入一个零宽空格，确保后续输入不在link范围内
            tr.insert(to, schema.text('\u200B'));
            tr.setSelection(TextSelection.create(tr.doc, to + 1));

            dispatch(tr);

            editorView.focus();

            hidePopover$.next({ type: PopoverTypeEnum.BUBBLE_MENU });
            hidePopover$.next({ type: PopoverTypeEnum.LINK });
        };

        const isValidLink = computed(() => {
            return isUrl(textRef.value);
        });

        useEventListener(document.body, 'click', (e) => {
            if (state.value?.popovers[PopoverTypeEnum.LINK]) {
                hidePopover$.next({ type: PopoverTypeEnum.LINK });
            }
        });

        useSubscription(
            showPopover$.pipe(
                filter(({ type }) => type === PopoverTypeEnum.LINK),
                tap(() => {
                    textRef.value = '';

                    setTimeout(() => {
                        if (inputRef.value) {
                            inputRef.value.focus();
                        }
                    }, 0);
                }),
            ).subscribe()
        );

        useSubscription(
            hidePopover$.pipe(
                filter(({ type }) => {
                    return type === PopoverTypeEnum.LINK;
                }),
                debounceTime(100),
                tap(() => {
                    setTimeout(() => {
                        // 当关闭的时候， 全局prosemirror遍历， 查找doc-mockSelection mark， 删除它
                        const editorView = contextStore.getState().editorView;
                        if (!editorView) return;

                        const { state } = editorView;
                        const { selection } = state;
                        const { to } = selection;
                        const tr = state.tr;
                        tr.setMeta('addToHistory', false);
                        state.doc.descendants((node, pos) => {
                            if (node.marks?.some(mark => mark.type === schema.marks.mockSelection)) {
                                tr.removeMark(pos, pos + node.nodeSize, schema.marks.mockSelection);
                            }
                        });

                        tr.setSelection(TextSelection.near(tr.doc.resolve(to)));

                        editorView.dispatch(tr);
                    }, 10)
                }),
            ).subscribe()
        );

        return () => (
            <Popover type={PopoverTypeEnum.LINK}>
                {{
                    default: () => {
                        return (
                            <div class="popover container">
                                <InputGroup compact>
                                    <Input
                                        ref={inputRef} 
                                        value={textRef.value}
                                        onChange={(e) => textRef.value = e.target.value || ''}
                                        prefix="链接" 
                                        placeholder="请输入链接"  
                                        style="width: calc(100% - 65px)"
                                        onPressEnter={(e) => handleSubmit(e)}
                                    />
                                    <Button disabled={!isValidLink.value} type="primary" onClick={(e) => handleSubmit(e)}>确定</Button>
                                </InputGroup>
                            </div>
                        )
                    }
                }}
            </Popover>
        );
    }
});
</script>

<style scoped>
.container {
    padding: 12px;
    width: 400px;
}
</style>