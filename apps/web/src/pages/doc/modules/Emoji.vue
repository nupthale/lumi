<script lang="tsx">
import { defineComponent, ref, useTemplateRef } from 'vue';
import { onClickOutside } from '@vueuse/core';

import EmojiPanel from '@editor/Editor/components/EmojiPanel/index.vue';

export default defineComponent({
    props: {
        emoji: String,
    },
    emits: ['change'],
    setup(props, { emit }) {
        const target = useTemplateRef<HTMLElement>('target')

        onClickOutside(target, event => {
            panelVisible.value = false;
        })

        const panelVisible = ref(false);

        const handleSelect = (e) => {
            emit('change', e.native);
        }

        return () => props.emoji ? (
            <div ref="target" class="relative inline-flex">
                <div class="headEmojiBtn" onClick={() => panelVisible.value = true}>
                    <div class="headEmoji">
                        {props.emoji}
                    </div>
                </div>
                {
                    panelVisible.value ? (
                        <div class="absolute bottom-0 top-[90px]">
                            <EmojiPanel onSelect={handleSelect} />
                        </div>
                    ) : ''
                }
            </div>
        ) : '';
    }
});
</script>

<style scoped>
.headEmoji {
  font-size: 52px;
  line-height: 52px;
}

.headEmojiBtn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 84px;
  height: 84px;
  cursor: pointer;
  user-select: none;
  background: var(--blur-bg-filter);
  border-radius: 100%;
  backdrop-filter: saturate(1.5) blur(16px);
  margin: 38px 0 0 -12px;
  box-shadow: 0 1px #00000014;
  border: 1px solid var(--default-border-color);

  &:hover {
    background: rgba(31,35,41,.6);
  }

  &:active {
    background: rgba(31,35,41,.8);
  }
}
</style>