<script lang="tsx">
import { defineComponent, PropType } from 'vue';
import { TextButton } from '@zsfe/zsui';
import { Dropdown, Space, Tooltip } from 'ant-design-vue';
import { Settings, FunnelPlus, ArrowDownAZ, Dices, ChevronDown } from 'lucide-vue-next';

import { i18next } from '@collection/i18next';
import { CollectionSchemaType } from '@collection/interface';

import ViewDropdown from './ViewDropdown/index.vue';
import SettingDropdown from './SettingDropdown/index.vue';
import SortDropdown from './SortDropdown/index.vue';
import GroupDropdown from './GroupDropdown/index.vue';
import FilterDropdown from './FilterDropdown/index.vue';

export default defineComponent({
  props: {
    schema: Object as PropType<CollectionSchemaType>,
  },
  setup(props) {
    return () => {
      const view = props.schema?.views.find(view => view.id === props.schema?.viewId);

      return (
        <div class="container flex items-center justify-between">
          <ViewDropdown schema={props.schema} />
          
          <div class="lightText">
              <Space>
                  <SettingDropdown schema={props.schema}>
                    <Tooltip title={i18next.t('collection.header.setting')}>
                      <TextButton>
                          <Settings width={16} height={16} />
                      </TextButton>
                    </Tooltip>
                  </SettingDropdown>

                  <FilterDropdown schema={props.schema}>
                    <Tooltip title={i18next.t('collection.header.filter')}>
                      <TextButton class={['actionBtn', view?.filter?.conditions?.length ? 'active' : '']}>
                          <div class="flex items-center gap-1">
                            <FunnelPlus width={16} height={16} />
                            {
                              view?.filter?.conditions?.length ? (
                                <span class="text-xs">{view?.filter?.conditions?.length}</span>
                              ) : ''
                            }
                          </div>
                      </TextButton>
                    </Tooltip>
                  </FilterDropdown>

                  <SortDropdown schema={props.schema}>
                    <Tooltip title={i18next.t('collection.header.sort')}>
                      <TextButton class={['actionBtn', view?.orders?.length ? 'active' : '']}>
                          <div class="flex items-center gap-1">
                            <ArrowDownAZ width={16} height={16} />
                            {
                              view?.orders?.length ? (
                                <span class="text-xs">{view?.orders?.length}</span>
                              ) : ''
                            }
                          </div>
                      </TextButton>
                  </Tooltip>
                </SortDropdown>

                <GroupDropdown schema={props.schema}>
                  <Tooltip title={i18next.t('collection.header.group')}>
                    <TextButton class={['actionBtn', view?.groupBy ? 'active' : '']}>
                        <div class="flex items-center gap-1">
                          <Dices width={16} height={16} />
                        </div>
                    </TextButton>
                  </Tooltip>
                </GroupDropdown>
            </Space>
        </div>
      </div>
    );
    };
  }
});
</script>

<style scoped>
.container {
  height: 52px;
}

.actionBtn.active {
  color: var(--primary-text-color);
  background: var(--float-bg-hover);
}
</style>