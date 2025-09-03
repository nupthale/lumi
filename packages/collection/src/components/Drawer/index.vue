<script lang="tsx">
import { defineComponent } from 'vue';
import { TextButton } from '@zsfe/zsui';
import { X } from 'lucide-vue-next';
import { AnimatePresence, motion } from 'motion-v';

export default defineComponent({
    props: {
        title: String,
        open: Boolean,
        width: Number,
    },
    emits: ['close'],
    setup(props, { emit, slots }) {
        return () => (
            <AnimatePresence initial={true}>
                {
                    props.open ? (
                        <motion.div 
                            class="customDrawer"
                            style={{
                                width: `${props.width}px`,
                            }}
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 100 }}
                            transition={{ duration: 0.6, type: 'spring' }}
                        >
                            <div>
                                <div class="drawerCloseButton">
                                    <TextButton onClick={() => emit('close')}>
                                        <X width="16px" height="16px"></X>
                                    </TextButton>
                                </div> 

                                <div class="h-full flex items-center">
                                    <div class="h-full flex-1 flex flex-col overflow-hidden">
                                        <div class="customDrawer__body flex flex-col flex-1">
                                            <div class="customDrawer__title" style="margin: -4px 0 36px 24px;">
                                                <div class="text">{props.title}</div>
                                            </div>

                                            {slots.body?.()}
                                        </div>

                                        {slots.footer?.()} 
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : ''
                }
            </AnimatePresence>
        )
    }
})
</script>

<style>
.customDrawer {
    position: fixed;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 100;

    box-shadow: rgba(31, 34, 37, 0.09) 0px 0px 0px 1px, rgba(0, 0, 0, 0.16) 0px 16px 40px -6px, rgba(0, 0, 0, 0.04) 0px 12px 24px -6px;
    backdrop-filter: var(--drawer-filter);
    transform: translateZ(0);
    will-change: backdrop-filter;
    background: var(--drawer-bg);
}
</style>

<style scoped>
.drawerCloseButton {
    position: absolute;
    top: 16px;
    right: 16px;
}

.customDrawer__title {
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: normal;
}

.customDrawer__title .text {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
}

.customDrawer__body {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 24px 0 50px 0;
    overflow-y: auto;
    overflow-x: hidden;
}
</style>