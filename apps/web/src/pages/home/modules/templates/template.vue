<script lang="tsx">
import { defineComponent } from 'vue';
import { storeToRefs } from 'pinia'; 
import { Plus } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import i18next from 'i18next';

import { uniqueId } from '@/shared/id';
import { events } from '@/database/index';
import { useContextStore } from '@/store/ui-states/context';
import { useUserStore } from '@/store/user';
import { useHomeStore } from '@/store/ui-states/home/index';
import { SpaceAssetType } from '@/database/schema/spaceAsset';

import { insertColllection } from '@editor/Editor/plugins/collab/collection';

import { createDoc } from '@/shared/yjs';

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
                    const fileId = uniqueId();

                    await createDoc(fileId, props.template?.content);
                    
                    events.fileCreated({
                        id: fileId,
                        type: 'Doc',
                        title: props.template?.title,
                        cover: '',
                        creator: user.value.id,
                    });

                    events.spaceAssetsCreated({
                        id: uniqueId(),
                        space: crtSpace.value,
                        asset: fileId,
                        type: SpaceAssetType.FILE,
                    });

                    // 如果有数据库表， 需要初始化yjs
                    const collectionMap = props.template?.collectionMap;
                    if (collectionMap) {
                        Object.keys(collectionMap).forEach(key => {
                            const { schema, values } = collectionMap[key];
                            
                            insertColllection(fileId, key, schema, values);
                        });
                    }

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