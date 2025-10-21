<script lang="tsx">
import { defineComponent } from 'vue';
import { storeToRefs } from 'pinia'; 
import { Plus } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import i18next from 'i18next';

import { useContextStore } from '@/store/ui-states/context';
import { useUserStore } from '@/store/user';
import { useHomeStore } from '@/store/ui-states/home/index';

import { createDocFile } from '@/shared/file';

export default defineComponent({
    props: {
        template: Object,
    },
    setup(props) {
        const router = useRouter();

        const contextStore = useContextStore();
        const { crtSpace } = storeToRefs(contextStore);
        const homeStore = useHomeStore();

        const userStore = useUserStore();
        const { user } = storeToRefs(userStore);

        const handleClick = async () => {
            homeStore.setCreateDocDrawerVisible(false);

            if (!user.value?.id) {
                throw Error('用户id不存在');
            }

            setTimeout(async () => {
                try {
                    const { fileId } = await createDocFile({
                        title: props.template?.title, 
                        content: props.template?.content, 
                        collectionMap: props.template?.collectionMap,
                        userId: user.value.id,
                        spaceId: crtSpace.value,
                    })

                    setTimeout(() => {
                        // 跳转到新建的doc
                        router.push(`/files/doc/${fileId}`);
                    }, 0);
                } catch (error) {
                    console.error('创建文档失败:', error);
                }
            }, 500);
        };

        const renderBody = () => {
            if (props.template?.isEmpty) {
                return (
                    <div class="doc-empty flex-1 flex items-center justify-center">
                        <div class="flex flex-col items-center">
                            <Plus size={48} class="mb-2" color="rgb(51, 109, 244)" />
                            {i18next.t('template.emptyDocDesc')}
                        </div>
                    </div>
                );
            }
            return <div class="template_bg" style={{ backgroundImage: `url(${props.template?.image})`}} />;
        };

        return () => (
            <div class="template" onClick={handleClick}>
                <div class="template_head flex items-center mb-4">
                    {props.template?.title}
                </div>
                {
                    props.template?.cover && (
                        <div class="template_cover mb-2" style={{ backgroundImage: `url(${props.template.cover})`}} />
                    )
                }
                
                {renderBody()}
            </div>
        );
    }
});
</script>

<style scoped lang="less">
.template {
    position: relative;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    width: 240px;
    height: 306px;
    border-radius: 8px;
    overflow: hidden;
    padding: 10px 10px 0;
    
    background: var(--bg-float);
    border: 2px solid var(--default-border-color);
    box-shadow: rgba(0, 0, 0, 0.16) 0px 16px 40px -6px, rgba(0, 0, 0, 0.04) 0px 12px 24px -6px, rgba(31, 34, 37, 0.09) 0px 0px 0px 1px;
    backdrop-filter: saturate(1.5) blur(32px);

    cursor: pointer;

    &:hover {
        border-color: #3370ff;
    }

    &:after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 100px;
        background: var(--template-card-bg-after);
        transition: border-color .2s ease-in-out;
    }
}

.docIcon {
    width: 24px;
    height: 24px;
    background: url('@/assets/doc.svg') no-repeat center;
    background-size: contain;
}

.doc-empty {
    color: var(--text-color);
}

.template_head {
    font-weight: 500;
    color: var(--text-color);
}

.template_bg {
    flex: 1;
    border-radius: 6px;
    background: url('@/assets/template.jpeg');
    background-size: cover;
    
}

.template_cover {
    width: 100%;
    height: 128px;
    border-radius: 6px;
    background: var(--wiki-cover);
    background-size: cover;
}
</style>