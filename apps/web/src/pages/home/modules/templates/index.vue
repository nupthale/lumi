<script lang="tsx">
import { defineComponent } from 'vue';
import { storeToRefs } from 'pinia';

import { useHomeStore } from '@/store/ui-states/home/index';

import templates from '@/shared/templates/index';

import DocTemplate from './template.vue';

export default defineComponent({
    setup() {
        const homeStore = useHomeStore();
        const { createDocDrawerVisible } = storeToRefs(homeStore);

        const handleMaskClick = () => {
            homeStore.setCreateDocDrawerVisible(false);
        };

        return () => createDocDrawerVisible.value ? (
            <div>
                <div class={['templates', createDocDrawerVisible.value ? 'visible' : '']} onClick={handleMaskClick}>
                    <div class="templates_content">
                        {
                            createDocDrawerVisible.value ? templates.map((template, index) => (
                                <DocTemplate
                                    key={index}
                                    template={template}
                                    style={{
                                        animationDelay: homeStore.createDocDrawerVisible
                                            ? `${index * 0.1}s`
                                            : `${(templates.length - index - 1) * 0.1}s`
                                    }}
                                    class={[
                                        'template-item',
                                        { 'slide-out': !homeStore.createDocDrawerVisible }
                                    ]}
                                />
                            )) : ''
                        }
                    </div>
                </div>
            </div>

        ) : ''
    }
});
</script>

<style scoped lang="less">
.templates {
    position: fixed;
    
    top: 0;
    left: 0;
    right: 0;
    height: 100vh;
    overflow-y: auto;
    
    z-index: 998;

    pointer-events: none;
}

.templates_content {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: 1008px;
    min-height: 100vh;
    padding: 24px;

    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 16px;

    transform: translateX(100%);
    transition: transform 0.3s ease;
}

.templates.visible {
    // background: linear-gradient(270deg, rgba(0, 0, 0, 0.1) 30%, rgba(0, 0, 0, 0.06) 60%, rgba(255, 255, 255, 0));
    background: rgba(0, 0, 0, 0.3);
    transition: background 0.8s linear;
    pointer-events: auto;
}

.templates.visible .templates_content {
    transform: translateX(0);
}

.template-item {
    opacity: 0;
    transform: translateX(200px);
}

.template-item.slide-out {
    animation: slideOut 0.3s ease-in-out forwards;
    opacity: 1;
    transform: translateX(0);
}

.templates.visible .template-item {
    animation: slideIn 0.3s ease-in-out forwards;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(200px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes slideOut {
    from {
        opacity: 1;
        transform: translateX(0);
    }
    to {
        opacity: 0;
        transform: translateX(200px);
    }
}
</style>