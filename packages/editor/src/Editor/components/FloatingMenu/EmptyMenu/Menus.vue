<script lang="tsx">
import { defineComponent } from 'vue';
import { 
    Type, 
    Heading1, 
    Heading2, 
    Heading3, 
    Heading4,
    Heading5,
    Heading6,
    List,
    ListOrdered,
    ListTodo,
    ListCollapse,
    Image, 
    Video,
    Code,
    Highlighter,
    Globe,
    Columns2,
    Columns3,
    Columns4,
    Table,
    Sheet,
    SquareSplitVertical,
} from 'lucide';
import { i18next } from '@editor/i18n';
import {
    Quote,
} from 'lucide-vue-next';
import { Tooltip } from 'ant-design-vue';
import { TextButton } from '@zsfe/zsui';

import { themeTokens } from '@editor/Editor/shared/theme';
import LucideIcon from '../../LucideIcon/index.vue';
import { ListTypeEnum } from '@editor/Editor/plugins/nodes/list/interface';

export default defineComponent({
    props: {
        isDeepBlock: Boolean,
    },
    emits: ['select'],
    setup(props, { emit }) {
        const handleSelectType = (type: string, attrs?: any) => {
            emit('select', type, attrs);
        };

        return () => (
            <div class="w-[230px] doc-floatMenusContainer">
                <div class="!border-none">
                    <div class="grid grid-cols-6 gap-y-3 p-3">
                        <Tooltip title={i18next.t('editor.blockType.text')} mouseEnterDelay={0.6}>
                            <TextButton 
                                size="small" 
                                class="flex items-center justify-center !w-[26px] !h-[26px]" 
                                onClick={() => handleSelectType('textBlock')}
                            >
                                <LucideIcon icon={Type} width={20} color={themeTokens.titleText()}></LucideIcon>
                                </TextButton>
                        </Tooltip>

                        <Tooltip title={i18next.t('editor.blockType.bulletList')} mouseEnterDelay={0.6}>
                            <TextButton 
                                size="small" 
                                class="flex items-center justify-center !w-[26px] !h-[26px]" 
                                onClick={() => handleSelectType('list', { type: ListTypeEnum.BULLET })}>
                                <LucideIcon icon={List} width={24} color={themeTokens.titleText()}></LucideIcon>
                            </TextButton>
                        </Tooltip>

                        <Tooltip title={i18next.t('editor.blockType.orderedList')} mouseEnterDelay={0.6}>
                            <TextButton 
                                size="small" 
                                class="flex items-center justify-center !w-[26px] !h-[26px]" 
                                onClick={() => handleSelectType('list', { type: ListTypeEnum.ORDERED })}>
                                <LucideIcon icon={ListOrdered} width={24} color={themeTokens.titleText()}></LucideIcon>
                            </TextButton>
                        </Tooltip>

                        <Tooltip title={i18next.t('editor.blockType.todoList')} mouseEnterDelay={0.6}>
                            <TextButton 
                                size="small" 
                                class="flex items-center justify-center !w-[26px] !h-[26px]" 
                                onClick={() => handleSelectType('list', { type: ListTypeEnum.TODO })}>
                                <LucideIcon icon={ListTodo} width={22} color={themeTokens.titleText()}></LucideIcon>
                            </TextButton>
                        </Tooltip>

                        <Tooltip title={i18next.t('editor.blockType.toggleList')} mouseEnterDelay={0.6}>
                            <TextButton 
                                size="small" 
                                class="flex items-center justify-center !w-[26px] !h-[26px]" 
                                onClick={() => handleSelectType('list', { type: ListTypeEnum.TOGGLE })}>
                                <LucideIcon icon={ListCollapse} width={22} color={themeTokens.titleText()}></LucideIcon>
                            </TextButton>
                        </Tooltip>

                        <Tooltip title={i18next.t('editor.blockType.code')} mouseEnterDelay={0.6}>
                            <TextButton 
                                size="small" 
                                class="flex items-center justify-center !w-[26px] !h-[26px]" 
                                onClick={() => handleSelectType('coder')}>
                                <LucideIcon icon={Code} width={20} color={themeTokens.titleText()}></LucideIcon>
                            </TextButton>
                        </Tooltip>

                        <Tooltip title={i18next.t('editor.blockType.h1')} mouseEnterDelay={0.6}>
                            <TextButton 
                                size="small" 
                                class="flex items-center justify-center !w-[26px] !h-[26px]" 
                                onClick={() => handleSelectType('header', { level: 1 })}
                            >
                                <LucideIcon icon={Heading1} width={24} color={themeTokens.titleText()}></LucideIcon>
                            </TextButton>
                        </Tooltip>

                        <Tooltip title={i18next.t('editor.blockType.h2')} mouseEnterDelay={0.6}>
                            <TextButton 
                                size="small" 
                                class="flex items-center justify-center !w-[26px] !h-[26px]" 
                                onClick={() => handleSelectType('header', { level: 2 })}
                            >
                                <LucideIcon icon={Heading2} width={24} color={themeTokens.titleText()}></LucideIcon>
                            </TextButton>
                        </Tooltip>

                        <Tooltip title={i18next.t('editor.blockType.h3')} mouseEnterDelay={0.6}>
                            <TextButton 
                                size="small" 
                                class="flex items-center justify-center !w-[26px] !h-[26px]" 
                                onClick={() => handleSelectType('header', { level: 3 })}
                            >
                                <LucideIcon icon={Heading3} width={24} color={themeTokens.titleText()}></LucideIcon>
                            </TextButton>
                        </Tooltip>

                        <Tooltip title={i18next.t('editor.blockType.h4')} mouseEnterDelay={0.6}>
                            <TextButton 
                                size="small" 
                                class="flex items-center justify-center !w-[26px] !h-[26px]" 
                                onClick={() => handleSelectType('header', { level: 4 })}>
                                <LucideIcon icon={Heading4} width={24} color={themeTokens.titleText()}></LucideIcon>
                            </TextButton>
                        </Tooltip>

                        <Tooltip title={i18next.t('editor.blockType.h5')} mouseEnterDelay={0.6}>
                            <TextButton 
                                size="small" 
                                class="flex items-center justify-center !w-[26px] !h-[26px]" 
                                onClick={() => handleSelectType('header', { level: 5 })}>
                                <LucideIcon icon={Heading5} width={24} color={themeTokens.titleText()}></LucideIcon>
                            </TextButton>
                        </Tooltip>

                        <Tooltip title={i18next.t('editor.blockType.h6')} mouseEnterDelay={0.6}>
                            <TextButton 
                                size="small" 
                                class="flex items-center justify-center !w-[26px] !h-[26px]" 
                                onClick={() => handleSelectType('header', { level: 6 })}>
                                <LucideIcon icon={Heading6} width={24} color={themeTokens.titleText()}></LucideIcon>
                            </TextButton>
                        </Tooltip>

                        <Tooltip title={i18next.t('editor.blockType.quote')} mouseEnterDelay={0.6}>
                            <TextButton 
                                size="small" 
                                class="flex items-center justify-center !w-[26px] !h-[26px]" 
                                onClick={() => handleSelectType('quote', {})}>
                                <Quote size={22} color={themeTokens.titleText()}></Quote>
                            </TextButton>
                        </Tooltip>

                        <Tooltip title={i18next.t('editor.blockType.highlight')} mouseEnterDelay={0.6}>
                            <TextButton 
                                size="small" 
                                class="flex items-center justify-center !w-[26px] !h-[26px]" 
                                onClick={() => handleSelectType('highlight', {})}>
                                <LucideIcon icon={Highlighter} width={20} color={themeTokens.titleText()}></LucideIcon>
                            </TextButton>
                        </Tooltip>

                        <Tooltip title="分割线" mouseEnterDelay={0.6}>
                            <TextButton 
                                size="small" 
                                class="flex items-center justify-center !w-[26px] !h-[26px]" 
                                onClick={() => handleSelectType('divider', {})}>
                                <LucideIcon icon={SquareSplitVertical} width={20} color={themeTokens.titleText()}></LucideIcon>
                            </TextButton>
                        </Tooltip>
                    </div>
                    <div class="doc-floatMenu-divier"></div>
                    <div class="doc-floatMenu-title">{i18next.t('editor.commonUseTitle')}</div>
                    <div class="m-2">
                        {
                            !props.isDeepBlock ? (
                                <div 
                                    class="doc-floatingMenu-menuItem !w-full !p-1 !h-auto !min-h-auto !leading-none !rounded-[4px]"
                                    onClick={() => handleSelectType('table', {})}
                                >
                                    <div class="flex items-center">
                                        <span class="mr-4 inline-flex items-center justify-center w-[24px] h-[24px]">
                                            <LucideIcon icon={Table} width={20} color="#00B6FF"></LucideIcon>
                                        </span>
                                        {i18next.t('editor.blockType.table')}
                                    </div>
                                </div>
                            ) : ''
                        }
                        
                        <div 
                            class="doc-floatingMenu-menuItem !w-full !p-1 !h-auto !min-h-auto !leading-none !rounded-[4px]"
                            onClick={() => handleSelectType('image', {})}
                        >
                            <div class="flex items-center">
                                <span class="mr-4 inline-flex items-center justify-center w-[24px] h-[24px]">
                                    <LucideIcon icon={Image} width={20} color="#FF7237"></LucideIcon>
                                </span>
                                {i18next.t('editor.blockType.image')}
                            </div>
                        </div>
                        <div 
                            class="doc-floatingMenu-menuItem !w-full !p-1 !h-auto !min-h-auto !leading-none !rounded-[4px]"
                            onClick={() => handleSelectType('video', {})}
                        >
                            <div class="flex items-center">
                                <span class="mr-4 inline-flex items-center justify-center w-[24px] h-[24px]">
                                    <LucideIcon icon={Video} width={20} color="#25CB71"></LucideIcon>
                                </span>
                                {i18next.t('editor.blockType.video')}
                            </div>
                        </div>
                        <div 
                            class="doc-floatingMenu-menuItem !w-full !p-1 !h-auto !min-h-auto !leading-none !rounded-[4px]"
                            onClick={() => handleSelectType('collection')}
                        >
                            <div class="flex items-center">
                                <span class="mr-4 inline-flex items-center justify-center w-[24px] h-[24px]">
                                    <LucideIcon icon={Sheet} width={20} color="#FF012A"></LucideIcon>
                                </span>
                                {i18next.t('editor.blockType.collection')}
                            </div>
                        </div>
                        <div 
                            class="doc-floatingMenu-menuItem !w-full !p-1 !h-auto !min-h-auto !leading-none !rounded-[4px]"
                            onClick={() => handleSelectType('iframe')}
                        >
                            <div class="flex items-center">
                                <span class="mr-4 inline-flex items-center justify-center w-[24px] h-[24px]">
                                    <LucideIcon icon={Globe} width={20} color="#874FFF"></LucideIcon>
                                </span>
                                {i18next.t('editor.blockType.iframe')}
                            </div>
                        </div>
                    </div>

                    {
                        !props.isDeepBlock? (
                            <div>
                                <div class="doc-floatMenu-divier"></div>
                                <div class="doc-floatMenu-title">{i18next.t('editor.columnTitle')}</div>
                                <div class="m-2">
                                    <div 
                                        class="doc-floatingMenu-menuItem !w-full !p-1 !h-auto !min-h-auto !leading-none !rounded-[4px]"
                                        onClick={() => handleSelectType('columns', { count: 2 })}
                                    >
                                        <div class="flex items-center">
                                            <span class="mr-4 inline-flex items-center justify-center w-[24px] h-[24px]">
                                                <LucideIcon icon={Columns2} width={20}></LucideIcon>
                                            </span>
                                            {i18next.t('editor.blockType.column2')}
                                        </div>
                                    </div>
                                    <div 
                                        class="doc-floatingMenu-menuItem !w-full !p-1 !h-auto !min-h-auto !leading-none !rounded-[4px]"
                                        onClick={() => handleSelectType('columns', { count: 3 })}
                                    >
                                        <div class="flex items-center">
                                            <span class="mr-4 inline-flex items-center justify-center w-[24px] h-[24px]">
                                                <LucideIcon icon={Columns3} width={20}></LucideIcon>
                                            </span>
                                            {i18next.t('editor.blockType.column3')}
                                        </div>
                                    </div>
                                    <div 
                                        class="doc-floatingMenu-menuItem !w-full !p-1 !h-auto !min-h-auto !leading-none !rounded-[4px]"
                                        onClick={() => handleSelectType('columns', { count: 4 })}
                                    >
                                        <div class="flex items-center">
                                            <span class="mr-4 inline-flex items-center justify-center w-[24px] h-[24px]">
                                                <LucideIcon icon={Columns4} width={20}></LucideIcon>
                                            </span>
                                            {i18next.t('editor.blockType.column4')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : ''
                    }
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