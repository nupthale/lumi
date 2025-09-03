<script lang="tsx">
import { defineComponent, Teleport } from 'vue';
import { AnimatePresence, motion } from 'motion-v';

import './index.less';

export default defineComponent({
    props: {
        visible: Boolean,
        title: String,
        maskClosable: Boolean,
    },
    emits: ['close'],
    setup(props, { slots, emit }) {
        const handleMaskClick = () => {
            if (props.maskClosable) {
                emit('close');
            }
        }

        return () => (
            <Teleport to={document.body}>
                <AnimatePresence initial={true}>
                    {
                        props.visible ? (
                            <motion.div 
                                class="customModal"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.6, type: 'spring' }}
                                onClick={handleMaskClick}
                            >
                                <motion.div 
                                    layoutId="modalContent"
                                    layout
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0 }}
                                    transition={{ ease: ['linear'] }}
                                    class="wrap">
                                    <div class="body" >
                                        {slots.default && slots.default()}
                                    </div>
                                </motion.div>
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
.customModal {
    will-change: transform, opacity;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 120;
    background: var(--modal-backbg);
}

.wrap {
    display: flex;
    border-radius: 12px;
    background: var(--body-bg);
    box-shadow: var(--modal-box-shadow);
    overflow: hidden;
}

.body {
    flex: 1;
    overflow-y: auto;
}

</style>