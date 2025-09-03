<script lang="tsx">
import { defineComponent, Teleport } from 'vue';
import { Space } from 'ant-design-vue';
import { TextButton } from '@zsfe/zsui';
import { ArrowLeft } from 'lucide-vue-next';
import { AnimatePresence, motion } from 'motion-v';

import { appBarHeight } from '@/shared/electron';

import './index.less';

export default defineComponent({
    props: {
        visible: Boolean,
        title: String,
        headerHeight: Number,
        hideHeader: Boolean,
    },
    emits: ['close'],
    setup(props, { slots, emit }) {
        return () => (
            <Teleport to={document.body}>
                <AnimatePresence initial={true}>
                    {
                        props.visible ? (
                            <motion.div 
                                class="fullscreenModal"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                                transition={{ ease: ['linear'] }}
                            >
                                <div class="wrap">
                                    <div class="header" style={{ paddingTop: `${appBarHeight}px`, height: `calc(${props.headerHeight || 72}px)`, display: props.hideHeader ? 'none' : '' }}>
                                        {slots.header ? slots.header() : (
                                            <>
                                                <Space align="center">
                                                    {{
                                                        split: () => (
                                                            <div class="divider"></div>
                                                        ),
                                                        default: () => (
                                                            <>
                                                                <TextButton class="mt-0.5" onClick={() => emit('close')}>
                                                                    <ArrowLeft size={22} ></ArrowLeft>
                                                                </TextButton>
                                                                {
                                                                    slots.title ? slots.title() : (
                                                                        <div class="title">
                                                                            {props.title || '-'}
                                                                        </div>
                                                                    )
                                                                }
                                                            </>
                                                        )
                                                    }}
                                                </Space>
                                                {slots.actions?.()}
                                            </>
                                        )}
                                    </div>
                                    <div class="body" style={{ '--doc-header-height': `calc(${props.headerHeight || 64}px + ${appBarHeight}px + 14px)` }}>
                                        {slots.default && slots.default({ paddingTop: `${appBarHeight}px)` })}
                                    </div>
                                </div>
                            </motion.div>
                        ) : ''
                    }
                </AnimatePresence>
            </Teleport>
            
        );
    }
});
</script>

<style scoped>
.fullscreenModal {
    will-change: transform, opacity;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
}

.wrap {
    height: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: auto;
    background: var(--body-bg);
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    position: fixed;
    z-index: 50;

    top: 0;
    left: 0;
    right: 0;
    background: var(--blur-bg-filter);
    padding: 0 12px;
    /* border-radius: 12px; */
    padding: .4rem .9rem .4rem .9rem;
    backdrop-filter: saturate(1.5) blur(16px);
    box-shadow: var(--fullscreen-modal-header-shadow);
    border: 1px solid var(--default-border-color);
}

.body {
    flex: 1;
    overflow: hidden;
}

.title {
    font-weight: 500;
    font-size: 16px;
}

.divider {
    width: 1px;
    height: 18px;
    background: #e8e8e8;
    margin: 0 8px;
}

</style>