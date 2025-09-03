<script lang="tsx">
import { defineComponent } from 'vue';
import { Dropdown, Menu } from 'ant-design-vue';
import { TextButton } from '@zsfe/zsui';
import { ChevronDown, Code } from 'lucide';

import LucideIcon from '@editor/Editor/components/LucideIcon/index.vue';

import { langs } from '../../lang';
import { capitalize } from '../../shared';

const MenuItem = Menu.Item;

export default defineComponent({
    props: {
        language: String,
    },
    emits: ['changeLanguage'],
    setup(props, { emit }) {
        return () => (
            <div class="doc-codeToolbarComponent flex items-center justify-betweewn">
                <div class="flex items-center">
                    <LucideIcon icon={Code} width={18} color="#646a73" class="mr-2" />
                    <Dropdown trigger="click">
                        {{
                            overlay: () => (
                                <Menu>
                                    {
                                        langs.map((lang) => (
                                            <MenuItem key={lang} onClick={() => emit('changeLanguage', lang)}>
                                                <div class="doc-codeToolbarLang">{capitalize(lang)}</div>
                                            </MenuItem>
                                        ))
                                    }
                                </Menu>
                            ),
                            default: () => (
                                <TextButton class="text-[#646a73] !text-sm" size="small">
                                    {capitalize(props.language!)}
                                    <LucideIcon class="ml-1" icon={ChevronDown} width={18} color="#646a73" />
                                </TextButton>
                            ),
                        }}
                    </Dropdown>
                </div>
            </div>
        );
    }
});
</script>

<style scoped lang="less">
.doc-codeToolbarComponent {
    padding: 6px 22px 6px 10px;
    color: #646a73;
    font-size: 14px;

    font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI Variable Display", "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol";
}

.doc-codeToolbarLang {
    width: 232px;
}
</style>