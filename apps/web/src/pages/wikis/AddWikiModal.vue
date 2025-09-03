<script lang="tsx">
import { defineComponent, ref, watch } from 'vue';
import { Modal, Form, Input, Button, message } from 'ant-design-vue';
import { storeToRefs } from 'pinia';
import { TextButton } from '@zsfe/zsui';

import { events } from '@/database/index';
import { useCover } from '@/hooks/useCover';
import { useHomeStore } from '@/store/ui-states/home';
import { SpaceAssetType } from '@/database/schema/spaceAsset';

import { uniqueId } from '@/shared/id';
import { useContextStore } from '@/store/ui-states/context';
import { useUserStore } from '@/store/user';

const FormItem = Form.Item;

export default defineComponent({
    setup() {
        const formRef = ref();

        const validateRules = ref({
            title: [
                { required: true, message: '请输入文档集名称' },
            ],
        });

        const contextStore = useContextStore();
        const { crtSpace } = storeToRefs(contextStore);

        const homeStore = useHomeStore();
        const { createWikiModalVisible, editWikiItem } = storeToRefs(homeStore);

        const wikiRef = ref<HTMLDivElement>();

        const userStore = useUserStore();
        const { user } = storeToRefs(userStore);

        const { getNewCover, imageLoaded } = useCover({
            width: 160,
            height: 220,
        });

        const updateWikiCover = () => {
            if (!wikiRef.value) {
                return;
            }

            wikiRef.value.style.setProperty('--wiki-cover', `url(${editWikiItem.value.cover})`);
        }

        watch(() => createWikiModalVisible.value, async (visible) => {
            if (!visible) {
                return;
            }

            setTimeout(async () => {
                if (editWikiItem.value?.cover) {
                    updateWikiCover();
                } else {
                    editWikiItem.value.cover = await getNewCover();
                    updateWikiCover();
                }
            }, 0);
        });

        const handleSwitchCover = async () => {
            editWikiItem.value.cover = await getNewCover();
            updateWikiCover();
        }

        const handleSubmit = async () => {
            try {
                await formRef.value?.validate();

                const isEdit = Boolean(editWikiItem.value.id);

                if (!user.value?.id) {
                    throw Error('用户id不存在');
                }

                if (isEdit) {
                    events.wikiUpdated({
                        id: editWikiItem.value.id,
                        ...editWikiItem.value,
                    });
                } else {
                    const fileId = uniqueId();
                    const wikiId = uniqueId();

                    events.fileCreated({
                        id: fileId,
                        type: 'Doc',
                        wiki: wikiId,
                        creator: user.value.id,
                    });

                    events.spaceAssetsCreated({
                        id: uniqueId(),
                        space: crtSpace.value,
                        asset: wikiId,
                        type: SpaceAssetType.WIKI,
                    });

                    events.wikiTreeCreated({
                        wiki: wikiId,
                        file: fileId,
                        // 第一个从10开始， 不能从0开始， 因为0的话，拖到第一个的话， 2个0会出现重复的0
                        orderIndex: 10,
                        parentFile: '',
                        creator: user.value.id,
                    });

                    events.wikiCreated({
                        id: wikiId,
                        creator: user.value.id,
                        ...editWikiItem.value,
                    });
                }

                homeStore.setCreateWikiModalVisible(false);
            } catch(e) {
                console.error(e);
            }
        }

        return () => (
            <Modal 
                class="noPaddingModal" 
                open={createWikiModalVisible.value} 
                width="600px" 
                footer={null} 
                centered
                onCancel={() => homeStore.setCreateWikiModalVisible(false)}
            >
                <div class="flex items-stretch h-full">
                    <div class="left" ref={wikiRef}>
                        <div class="wikiBg w-full h-full relative">
                            <div class="wiki">
                                <div class="wiki-main">
                                    <div class="wiki_title">
                                        {editWikiItem.value.title || '文档集'}
                                    </div>
                                    <div class="wiki_desc">
                                        {editWikiItem.value.desc || '快速上手文档集 / Getting started with Wiki'}
                                    </div>
                                </div>
                            </div>

                            <TextButton class="mt-4" type="primary" ghost onClick={handleSwitchCover}>切换封面</TextButton>
                        </div>
                    </div>
                    <div class="flex-1 right p-6 pt-10">
                        <Form layout='vertical' ref={formRef} class="h-full flex flex-col" model={editWikiItem.value} rules={validateRules.value}>
                            <FormItem label="文档集名称" name="title">
                                <Input 
                                    value={editWikiItem.value.title}
                                    onUpdate:value={val => editWikiItem.value.title = val}
                                    placeholder="请输入文档集名称" 
                                />
                            </FormItem>
                            <FormItem label="文档集描述" class="flex-1">
                                <Input.TextArea 
                                    autoSize={{ minRows: 5, maxRows: 5 }} 
                                    placeholder="请简单的描述一下文档集" 
                                    value={editWikiItem.value.desc}
                                    onUpdate:value={val => editWikiItem.value.desc = val}
                                />
                            </FormItem>
                        </Form>

                        <div class="flex items-center justify-end" onClick={handleSubmit}>
                            <Button type="primary">
                                {editWikiItem.value.id ? '更新文档集' : '创建文档集'}
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
})

</script>

<style scoped>
.wiki {
    position: relative;
    width: 160px;
    height: 220px;
    color: #fff;
}

.wiki_title {
    font-weight: 600;
    font-size: 18px;
    line-height: 24px;
    margin-top: 12px;
    letter-spacing: normal;
}

.wiki_desc {
    font-size: 12px;
    line-height: 18px;
    margin: 12px 0;
    overflow: hidden;
    -o-text-overflow: ellipsis;
    text-overflow: ellipsis;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    word-break: break-word;
}

.left {
    display: flex;
    flex-direction: column;

    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
    background-image: linear-gradient(180deg, #00000099 0, #000000 100%);
    
    border-right: 1px solid var(--default-border-color);
}

.wikiBg {
    padding: 24px;

    background-blend-mode: multiply;
    background-image: linear-gradient(180deg, #00000099 0, #000000 100%), var(--wiki-cover);
    background-position: center;
    background-size: cover;

    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
}

.right {
    width: 100%;
    display: flex;
    flex-direction: column;
}
</style>