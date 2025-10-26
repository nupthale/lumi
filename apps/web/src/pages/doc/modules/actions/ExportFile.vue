<script lang="tsx">
import { defineComponent } from 'vue';
import { Dropdown, Menu } from 'ant-design-vue';
import { TextButton } from '@zsfe/zsui';
import { Download, FileCode2, FileJson2 } from 'lucide-vue-next';
import i18next from 'i18next';
import { exportToJSON$, exportToMarkdown$ } from '@editor/Editor/event';

const MenuItem = Menu.Item;

export default defineComponent({
    props: {
        fileId: String,
    },
    setup(props) {

        const renderActionOverlay = () => {
            return (
                <div class="dropdownContainer min-w-[180px] max-w-[360px]">
                <Menu activeKey='-1'>
                    <MenuItem key="1" onClick={() => exportToMarkdown$.next({ fileId: props.fileId })}>
                        <div class="flex items-center gap-2">
                            <FileCode2 size={16}  strokeWidth={1.8} />{i18next.t('export.markdown')}
                        </div>
                    </MenuItem>
                    <MenuItem key="2" onClick={() => exportToJSON$.next({ fileId: props.fileId })}>
                        <div class="flex items-center gap-2">
                            <FileJson2 size={16} strokeWidth={1.8} />{i18next.t('export.json')}
                        </div>
                    </MenuItem>
                    </Menu>
                </div>
            );
            }

        return () => (
           <Dropdown placement='bottomRight' trigger="hover">
                {{
                default: () => (
                    <TextButton>
                    <Download size={18} />
                    </TextButton>
                ),
                overlay: () => (
                    <div>
                    {renderActionOverlay()}
                    </div>
                ),
                }}
            </Dropdown>
        );
    }
});
</script>

<style scoped>
</style>