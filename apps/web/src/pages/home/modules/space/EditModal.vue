<script lang="tsx">
import { defineComponent, ref, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import { Modal, Form, Input, Switch, message } from 'ant-design-vue';
import i18next from 'i18next';

import { uniqueId } from '@/shared/id';
import { events } from '@/database/index';

import { useContextStore } from '@/store/ui-states/context';
import { useSpaces } from '@/store/queries/docs/useSpaces';

const FormItem = Form.Item;

export default defineComponent({
   setup() {
      const contextStore = useContextStore();
      const { crtEditSpace, editSpaceModalVisible } = storeToRefs(contextStore);

      const { spaces } = useSpaces();

      const formModel = ref({
        name: '',
        description: '',
        isDefault: false,
      });

      watchEffect(() => {
        if (crtEditSpace.value) {
            const space = spaces.value?.find((space: any) => space._id === crtEditSpace.value);

            formModel.value = {
                ...space,
            };
        } else {
            formModel.value = {
                name: '',
                description: '',
                isDefault: false,
            }
        }
      });

      const handleOk = async () => {
        if (!formModel.value?.name?.trim()) {
            message.error(i18next.t('home.space.spaceNamePlaceholder'));
            return;
        }

        let id = formModel.value?._id;

        if (id) {
            try {
                await events.spaceUpdated({
                    ...formModel.value,
                    id,
                });

                handleCancel();
            } catch(e) {
                console.error(e);
            }
        } else {
            try {
                const id = uniqueId();

                // 先把所有其他空间的 isDefault 设为 false
                if (formModel.value?.isDefault) {
                    events.spaceDefaultReseted({});
                }

                events.spaceCreated({
                    ...formModel.value,
                    id,
                    isSystem: false,
                    creator: '',
                })
                
                //创建后，切换到新space
                contextStore.setCrtSpace(id);

                handleCancel();
            } catch(e) {
                console.error(e);
            }
        }

        // 如果设置为了默认， 则还需要切换下space
        if (formModel.value?.isDefault) {
            contextStore.setCrtSpace(id);
        }
      };

      const handleCancel = () => {
        contextStore.setEditSpaceModalVisible(false);
      }

      return () => (
        <Modal
            centered
            open={editSpaceModalVisible.value}
            title={i18next.t('home.space.createSpace')} 
            width="400px"
            okText={i18next.t('common.okText')}
            cancelText={i18next.t('common.cancelText')}
            maskClosable={false}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <Form layout="vertical" model={formModel.value}>
                <FormItem label={i18next.t('home.space.spaceName')} required>
                    <Input
                        placeholder={i18next.t('home.space.spaceNamePlaceholder')}
                        value={formModel.value?.name}
                        onChange={(e) => {
                            formModel.value.name = e.target.value || '';
                        }}
                    />
                </FormItem>
                <FormItem label={i18next.t('home.space.spaceDesc')}>
                    <Input
                        placeholder={i18next.t('home.space.spaceDescPlaceholder')}
                        value={formModel.value?.description}
                        onChange={(e) => {
                            formModel.value.description = e.target.value || '';
                        }}
                    />
                </FormItem>

                <div class="flex items-center">
                    <FormItem noStyle>
                        <Switch
                            checked={formModel.value?.isDefault}
                            onChange={(checked) => {
                                formModel.value.isDefault = (checked as boolean) || false;
                            }}
                        />
                    </FormItem>
                    <span class="ml-2">{i18next.t('home.space.setSpaceDefault')}</span>
                </div>
            </Form>
        </Modal>
      );
   }
})
</script>