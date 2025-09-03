<script lang="tsx">
import { defineComponent, ref } from 'vue';
import { TextSelection } from 'prosemirror-state';
import { Fragment } from 'prosemirror-model';
import { UserAvatar } from '@zsfe/zsui';

import Popover from '../Popover/index.vue';

import { schema } from '../../plugins/schema/index';
import { contextStore } from '../../store/context';
import { MentionTypeEnum, PopoverTypeEnum } from '../../interface';
import { hidePopover$ } from '../../event';
import { useNavigate } from './useNavigate';

export default defineComponent({
    setup(_props) {
        const containerRef = ref();

        const users = ref([
            { username: '胡雪', userId: '1', department: '统计分析部' },
            { username: 'Diana Duan', userId: '2', department: '安克创新科技股份有限公司' },
            { username: '颗颗', userId: '2', department: '北京米可世界科技有限公司' },
        ]);

        const { crtItem } = useNavigate(users, (item) => handleSelect(item));

        const handleSelect = (user) => {
            const editorView = contextStore.getState().editorView;

            if (!editorView) return;

            const { state, dispatch } = editorView;
            const { selection, tr } = state;
        
            // 将当前selection位置替换为MentionNode
            const { from, to } = selection;
            const mentionNode = schema.nodes.mention.create({
                type: MentionTypeEnum.USER,
                name: user.username,
                id: user.userId,
            });

            // 创建包含 mention 节点和空格的 Fragment
            const fragment = Fragment.from([mentionNode, schema.text('\u200B')]);

            hidePopover$.next({ type: PopoverTypeEnum.MENTION });
            
            const pos = Math.max(from - 1, 0);
            tr.replaceWith(pos, to, fragment);
            tr.setSelection(TextSelection.create(tr.doc, pos + 2));
            dispatch(tr);

            // 重新聚焦编辑器
            editorView.focus();
        }

        return () => (
            <Popover type={PopoverTypeEnum.MENTION}>
                {{
                    default: () => (
                        <div class="popover container" ref={containerRef} onMouseup={(e) => e.stopPropagation()}>
                            {
                                users.value.map(user => (
                                    <div class={['user', crtItem.value === user ? 'active' : '']} onClick={() => handleSelect(user)}>
                                        <UserAvatar size="large" username={user.username} showText={false} />
                                        <div class="pl-2">
                                            <div>{user.username}</div>
                                            <div class="lightText text-xs">{user.department}</div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    )
                }}
            </Popover>
        );
    }
});
</script>

<style scoped>
.container {
    padding: 8px 0;
    width: 320px;
}

.user {
    display: flex;
    align-items: center;
    height: 48px;
    font-size: 14px;

    padding: 0 8px;
    margin: 0 8px 2px;
    border-radius: 4px;
    background-color: transparent;
    transition: background-color .4s cubic-bezier(.27,1.27,.48,.56);
}

.user:hover {
    background-color: var(--bubble-menu-hover-color);
}

.user.active {
    background-color: var(--bubble-menu-hover-color);
}
</style>