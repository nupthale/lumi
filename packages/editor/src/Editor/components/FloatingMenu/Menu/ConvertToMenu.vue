<script lang="tsx">
import { defineComponent, ref, watchEffect } from 'vue';
import type { PropType } from 'vue';
import { Tooltip } from 'ant-design-vue';
import i18next from 'i18next';
import { TextButton } from '@zsfe/zsui';
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
} from 'lucide';
import {
    Quote,
} from 'lucide-vue-next';

import { blockMouseLeave$ } from '@editor/Editor/event';
import { Convertible } from '../../../plugins/nodes/_common/baseBlockView';
import { themeTokens } from '@editor/Editor/shared/theme';
import LucideIcon from '../../LucideIcon/index.vue';
import { ListTypeEnum } from '@editor/Editor/plugins/nodes/list/interface';
import { ConvertNodeTypeEnum } from '@editor/Editor/interface';
import { schema } from '@editor/Editor/plugins/schema/index';

export default defineComponent({
    props: {
        nodeView: {
            type: Object as PropType<Convertible | null>
        }
    },
    setup(props) {
        const convertibleTypes = ref<ConvertNodeTypeEnum[]>([]);

        watchEffect(() => {
            if (!props.nodeView) {
                convertibleTypes.value = [];
                return;
            }
            
            convertibleTypes.value = props.nodeView.convertibleTypes || [];
        });

        const handleSelectType = (targetType: string, attrs?: Record<string, any>) => {
            const nodeSchema = schema.nodes[targetType];

            if (!nodeSchema || !nodeSchema?.spec?.convert || !props.nodeView) return;

            nodeSchema.spec.convert(props.nodeView, attrs);

            blockMouseLeave$.next({
                delay: 0,
            });
        };

        if (!convertibleTypes.value?.length) {
            return '';
        }

        return () => (
            <div>
                <div class="grid grid-cols-6 gap-y-3 p-3">
                    {
                        convertibleTypes.value?.includes(ConvertNodeTypeEnum.TEXT_BLOCK) ? (
                            <Tooltip title={i18next.t('editor.blockType.text')} mouseEnterDelay={0.6}>
                                <TextButton 
                                    size="small" 
                                    class="flex items-center justify-center !w-[26px] !h-[26px]" 
                                    onClick={() => handleSelectType('textBlock')}
                                >
                                    <LucideIcon icon={Type} width={20} color={themeTokens.titleText()}></LucideIcon>
                                    </TextButton>
                            </Tooltip>
                        ) : ''
                    }

                    {
                        convertibleTypes.value?.includes(ConvertNodeTypeEnum.BULLET_LIST)? (
                            <Tooltip title={i18next.t('editor.blockType.bulletList')} mouseEnterDelay={0.6}>
                                <TextButton 
                                    size="small" 
                                    class="flex items-center justify-center !w-[26px] !h-[26px]" 
                                    onClick={() => handleSelectType('list', { type: ListTypeEnum.BULLET })}>
                                    <LucideIcon icon={List} width={24} color={themeTokens.titleText()}></LucideIcon>
                                </TextButton>
                            </Tooltip>
                        ) : ''
                    }

                    {
                        convertibleTypes.value?.includes(ConvertNodeTypeEnum.ORDERED_LIST)? (
                            <Tooltip title={i18next.t('editor.blockType.orderedList')} mouseEnterDelay={0.6}>
                                <TextButton 
                                    size="small" 
                                    class="flex items-center justify-center !w-[26px] !h-[26px]" 
                                    onClick={() => handleSelectType('list', { type: ListTypeEnum.ORDERED })}>
                                    <LucideIcon icon={ListOrdered} width={24} color={themeTokens.titleText()}></LucideIcon>
                                </TextButton>
                            </Tooltip>
                        ) : ''
                    }

                    {
                        convertibleTypes.value?.includes(ConvertNodeTypeEnum.TODO_LIST)? (
                            <Tooltip title={i18next.t('editor.blockType.todoList')} mouseEnterDelay={0.6}>
                                <TextButton 
                                    size="small" 
                                    class="flex items-center justify-center !w-[26px] !h-[26px]" 
                                    onClick={() => handleSelectType('list', { type: ListTypeEnum.TODO })}>
                                    <LucideIcon icon={ListTodo} width={22} color={themeTokens.titleText()}></LucideIcon>
                                </TextButton>
                            </Tooltip>
                        ) : ''
                    }

                    {
                        convertibleTypes.value?.includes(ConvertNodeTypeEnum.TOGGLE_LIST)? (
                            <Tooltip title={i18next.t('editor.blockType.toggleList')} mouseEnterDelay={0.6}>
                                <TextButton 
                                    size="small" 
                                    class="flex items-center justify-center !w-[26px] !h-[26px]" 
                                    onClick={() => handleSelectType('list', { type: ListTypeEnum.TOGGLE })}>
                                    <LucideIcon icon={ListCollapse} width={22} color={themeTokens.titleText()}></LucideIcon>
                                </TextButton>
                            </Tooltip>
                        ) : ''
                    }
                    
                    {
                        convertibleTypes.value?.includes(ConvertNodeTypeEnum.CODER)? (
                            <Tooltip title={i18next.t('editor.blockType.code')} mouseEnterDelay={0.6}>
                                <TextButton 
                                    size="small" 
                                    class="flex items-center justify-center !w-[26px] !h-[26px]" 
                                    onClick={() => handleSelectType('coder')}>
                                    <LucideIcon icon={Code} width={20} color={themeTokens.titleText()}></LucideIcon>
                                </TextButton>
                            </Tooltip>
                        ) : ''
                    }

                    {
                        convertibleTypes.value?.includes(ConvertNodeTypeEnum.H1)? (
                            <Tooltip title={i18next.t('editor.blockType.h1')} mouseEnterDelay={0.6}>
                                <TextButton 
                                    size="small" 
                                    class="flex items-center justify-center !w-[26px] !h-[26px]" 
                                    onClick={() => handleSelectType('header', { level: 1 })}
                                >
                                    <LucideIcon icon={Heading1} width={24} color={themeTokens.titleText()}></LucideIcon>
                                </TextButton>
                            </Tooltip>
                        ) : ''
                    }

                    {
                        convertibleTypes.value?.includes(ConvertNodeTypeEnum.H2)? (
                            <Tooltip title={i18next.t('editor.blockType.h2')} mouseEnterDelay={0.6}>
                                <TextButton 
                                    size="small" 
                                    class="flex items-center justify-center !w-[26px] !h-[26px]" 
                                    onClick={() => handleSelectType('header', { level: 2 })}
                                >
                                    <LucideIcon icon={Heading2} width={24} color={themeTokens.titleText()}></LucideIcon>
                                </TextButton>
                            </Tooltip>
                        ) : ''
                    }
                    {
                        convertibleTypes.value?.includes(ConvertNodeTypeEnum.H3)? (
                            <Tooltip title={i18next.t('editor.blockType.h3')} mouseEnterDelay={0.6}>
                                <TextButton 
                                    size="small" 
                                    class="flex items-center justify-center !w-[26px] !h-[26px]" 
                                    onClick={() => handleSelectType('header', { level: 3 })}
                                >
                                    <LucideIcon icon={Heading3} width={24} color={themeTokens.titleText()}></LucideIcon>
                                </TextButton>
                            </Tooltip>
                        ) : ''
                    }
                    {
                        convertibleTypes.value?.includes(ConvertNodeTypeEnum.H4)? (
                            <Tooltip title={i18next.t('editor.blockType.h4')} mouseEnterDelay={0.6}>
                                <TextButton 
                                    size="small" 
                                    class="flex items-center justify-center !w-[26px] !h-[26px]" 
                                    onClick={() => handleSelectType('header', { level: 4 })}>
                                    <LucideIcon icon={Heading4} width={24} color={themeTokens.titleText()}></LucideIcon>
                                </TextButton>
                            </Tooltip>
                        ) : ''
                    }
                    {
                        convertibleTypes.value?.includes(ConvertNodeTypeEnum.H5)? (
                            <Tooltip title={i18next.t('editor.blockType.h5')} mouseEnterDelay={0.6}>
                                <TextButton 
                                    size="small" 
                                    class="flex items-center justify-center !w-[26px] !h-[26px]" 
                                    onClick={() => handleSelectType('header', { level: 5 })}>
                                    <LucideIcon icon={Heading5} width={24} color={themeTokens.titleText()}></LucideIcon>
                                </TextButton>
                            </Tooltip>
                        ) : ''
                    }
                    {
                        convertibleTypes.value?.includes(ConvertNodeTypeEnum.H6)? (
                            <Tooltip title={i18next.t('editor.blockType.h6')} mouseEnterDelay={0.6}>
                                <TextButton 
                                    size="small" 
                                    class="flex items-center justify-center !w-[26px] !h-[26px]" 
                                    onClick={() => handleSelectType('header', { level: 6 })}>
                                    <LucideIcon icon={Heading6} width={24} color={themeTokens.titleText()}></LucideIcon>
                                </TextButton>
                            </Tooltip>
                        ) : ''
                    }
                    
                    {
                        convertibleTypes.value?.includes(ConvertNodeTypeEnum.QUOTE)? (
                            <Tooltip title={i18next.t('editor.blockType.quote')} mouseEnterDelay={0.6}>
                                <TextButton 
                                    size="small" 
                                    class="flex items-center justify-center !w-[26px] !h-[26px]" 
                                    onClick={() => handleSelectType('quote', {})}>
                                    <Quote size={22} color={themeTokens.titleText()}></Quote>
                                </TextButton>
                            </Tooltip>
                        ) : ''
                    }
                    
                    {
                        convertibleTypes.value?.includes(ConvertNodeTypeEnum.HIGHLIGHT)? (
                            <Tooltip title={i18next.t('editor.blockType.highlight')} mouseEnterDelay={0.6}>
                                <TextButton 
                                    size="small" 
                                    class="flex items-center justify-center !w-[26px] !h-[26px]" 
                                    onClick={() => handleSelectType('highlight', {})}>
                                    <LucideIcon icon={Highlighter} width={20} color={themeTokens.titleText()}></LucideIcon>
                                </TextButton>
                            </Tooltip>
                        ) : ''
                    }
                </div>
                <div class="doc-floatMenu-divier"></div>
            </div>
        )
    }
})
</script>