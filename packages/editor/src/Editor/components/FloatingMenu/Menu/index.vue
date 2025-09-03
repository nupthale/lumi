<script lang="tsx">
import { defineComponent, PropType, toRef } from 'vue';
import { 
    Trash2,
    Copy,
    Diff,
} from 'lucide';
import { i18next } from '@editor/i18n';

import { BaseBlockView } from '../../../plugins/nodes/_common/baseBlockView';
import LucideIcon from '../../LucideIcon/index.vue';

import { useCopy } from '../useCopy';
import { useDelete } from '../useDelete';

import InsertAfterMenu from '../InsertAfterMenu/index.vue';
import ConvertToMenu from './ConvertToMenu.vue';

export default defineComponent({
    props: {
        nodeView: {
            type: Object as PropType<BaseBlockView | null>
        }
    },
    setup(props) {
        const nodeViewRef = toRef(props, 'nodeView');

        const { copy } = useCopy();
        const { deleteBlock } = useDelete();

        const handleCopy = () => {
            if (props.nodeView) {
                copy(props.nodeView);
            }
        }

        const handleDelete = () => {
            if (props.nodeView) {
                deleteBlock(props.nodeView);
            }
        }

        return () => (
            <div class="w-[230px] doc-floatMenusContainer">
                <div class="!border-none">
                    <ConvertToMenu nodeView={props.nodeView} />
                    
                    <div class="m-2">
                        <div class="doc-floatingMenu-menuItem !w-full !p-1 !h-auto !min-h-auto !leading-none !rounded-[4px]" onClick={handleCopy}>
                            <div class="flex items-center">
                                <span class="mr-4 inline-flex items-center justify-center w-[24px] h-[24px]">
                                    <LucideIcon icon={Copy} width={20}></LucideIcon>
                                </span>
                                {i18next.t('editor.blockAction.copy')}
                            </div>
                        </div>
                        <div class="doc-floatingMenu-menuItem !w-full !p-1 !h-auto !min-h-auto !leading-none !rounded-[4px]" onClick={handleDelete}>
                            <div class="flex items-center">
                                <span class="mr-4 inline-flex items-center justify-center w-[24px] h-[24px]">
                                    <LucideIcon icon={Trash2} width={20}></LucideIcon>
                                </span>
                                {i18next.t('editor.blockAction.delete')}
                            </div>
                        </div>
                    </div>

                    <div class="doc-floatMenu-divier"></div>
                    <div class="m-2">
                        <InsertAfterMenu nodeView={nodeViewRef.value}>
                            <div class="doc-floatingMenu-menuItem !w-full !p-1 !h-auto !min-h-auto !leading-none !rounded-[4px]">
                                <div class="flex items-center">
                                    <span class="mr-4 inline-flex items-center justify-center w-[24px] h-[24px]">
                                        <LucideIcon icon={Diff} width={20}></LucideIcon>
                                    </span>
                                    {i18next.t('editor.blockAction.insertAfter')}
                                </div>
                            </div>
                        </InsertAfterMenu>
                    </div>
                </div>
            </div>
        );
    }
});
</script>

<style scoped>
.doc-floatMenu-divier {
    width: 100%;
    height: 1px;
    background: var(--float-border-color);
    margin: 4px 0;
}

.doc-floatingMenu-menuItem {
    cursor: pointer;
    margin: 4px 0;
}

.doc-floatingMenu-menuItem:hover {
    background: var(--menu-item-hover);
}

.doc-floatMenu-title {
    margin: 12px 14px 6px;
    font-size: 12px;
}

.doc-floatMenusContainer {
    max-height: 620px;
    overflow-y: overlay;
    color: var(--title-text);
}
</style>