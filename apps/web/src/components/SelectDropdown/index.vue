<script lang="tsx">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import { Menu, Dropdown } from 'ant-design-vue';
import { ChevronDown } from 'lucide-vue-next';
import { TextButton } from '@zsfe/zsui';
import i18next from 'i18next';

export default defineComponent({
  props: {
    options: {
      type: Array as PropType<{ lable: string, value: string }[]>,
      default: () => []
    },
  },  
  emits: ['select'],
  setup(props, { slots, emit }) {
    return () => (
        <Dropdown placement="bottomRight" trigger="click">
            {{
                overlay: () => (
                    <div class="container">
                        <Menu>
                            {
                                props.options?.map(option => (
                                    <Menu.Item key={option?.value!}  onClick={() => emit('select', option)}>
                                        {slots.item ? slots.item?.({ option }) : '-'}
                                    </Menu.Item>
                                ))
                            }
                        </Menu>
                    </div>
                ),
                default: slots.default,
            }}
        </Dropdown>
    );
  }
});
</script>

<style scoped lang="less">
.container {
    border: 1px solid var(--float-border-color);
    border-radius: 8px;
    box-shadow: var(--overlay-shadow);
}
</style>