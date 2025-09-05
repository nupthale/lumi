<script lang="tsx">
import { defineComponent, ref, provide, PropType, watch, inject } from 'vue';
import { Dropdown, Form, Input, Menu, Space, Button } from 'ant-design-vue';
import { ChevronRight, PencilRuler, ArrowLeftFromLine, ArrowRightFromLine, Trash2 } from 'lucide-vue-next';
import { nanoid } from 'nanoid';
import { useSubscription } from '@vueuse/rxjs';
import { tap } from 'rxjs/operators';
import { onClickOutside } from '@vueuse/core';

import { themeTokens } from '@collection/shared/theme';

import { i18next } from '@collection/i18next';
import ColumnIcon from '../ColumnIcon.vue';

import { getColumnTypeText } from '@collection/shared/column';

import { ColumnTypeEnum, ColumnType, ColumnTypeValue } from '@collection/interface';

import CurrencyFields from './Currency.vue';
import NumberFields from './Number.vue';
import DateFields from './Date.vue';
import SelectFields from './Select/index.vue';

import { hideDropdown$, addCol$, deleteCol$ } from '@collection/events';

const FormItem = Form.Item;
const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;

export default defineComponent({
    props: {
        column: Object as PropType<ColumnType>,
        values: Object as PropType<Record<string, any>>,
    },
    emits: ['confirm'],
    setup(props, { slots, emit }) {
        const visibleRef = ref(false);

        const showEditOverlayRef = ref(false);

        const id = inject<string>('id')!;

        useSubscription(
            hideDropdown$.pipe(
                tap(() => {
                    visibleRef.value = false;
                })
            ).subscribe()
        )

        const getDefaultTextColumn = () => {
            return {
                id: nanoid(8),
                title: '',
                width: 180,
                type: ColumnTypeEnum.TEXT,
                config: {},
            } as ColumnType;
        }

        const getDefaultFormModel = () => {
            if (props.column) {
                return {
                    ...props.column,
                    config: {
                        ...(props.column.config || {}),
                    },
                } as ColumnType;
            }

            return getDefaultTextColumn();
        }

        const formModel = ref<ColumnType>(getDefaultFormModel());

        watch(visibleRef, (visible) => {
            if (visible && !props.column) {
                formModel.value.id = nanoid(8);
            }
        });

        const containerRef = ref();

        provide('formModel', formModel);

        const handleStopPropagation = (e) => e.stopPropagation();

        const handleShowDropdown = () => {
            hideDropdown$.next();

            visibleRef.value = true;
        }

        // 切换type， 清空config
        const handleSelectType = (type: ColumnTypeEnum) => {
            formModel.value.config = {};

            formModel.value.type = type;
        }

        const handleCancel = () => {
            formModel.value = getDefaultFormModel();

            // 隐藏dropdown
            visibleRef.value = false;
            showEditOverlayRef.value = false;
        };

        const handleInsertCol = (columnId: string | undefined, direction: 'left' | 'right') => {
            addCol$.next({
                id,
                columnId, 
                direction,
                column: getDefaultTextColumn(),
            });

            handleCancel();
        }

        const handleDeleteCol = (columnId: string) => {
            deleteCol$.next({
                id,
                columnId,
            });
        }

        const handleConfirm = () => {
            emit('confirm', {
                ...formModel.value
            });

            handleCancel();
        };

        const renderOverlay = () => {
            // 如果是新增列， 直接展示编辑
            if (!props.column || showEditOverlayRef.value) {
                return renderEditOverlay();
            }

            return (
                <div class="dropdownContainer w-[180px]">
                    <Menu>
                        <MenuItem key="1" onClick={() => showEditOverlayRef.value = true}>
                            <div class="flex items-center gap-2">
                                <PencilRuler size={14} strokeWidth={2.3} color={themeTokens.lightTextColor()} />{i18next.t('collection.editColumn')}
                            </div>
                        </MenuItem>
                        <MenuItem key="2" onClick={() => handleInsertCol(props.column?.id, 'left')}>
                            <div class="flex items-center gap-2">
                                <ArrowLeftFromLine size={14} strokeWidth={2.3} color={themeTokens.lightTextColor()} />{i18next.t('collection.insertColumnLeft')}
                            </div>
                        </MenuItem>
                        <MenuItem key="3" onClick={() => handleInsertCol(props.column?.id, 'right')}>
                            <div class="flex items-center gap-2">
                                <ArrowRightFromLine size={14} strokeWidth={2.3} color={themeTokens.lightTextColor()} />{i18next.t('collection.insertColumnRight')}
                            </div>
                        </MenuItem>
                        <MenuItem key="4" onClick={() => handleDeleteCol(props.column?.id!)}>
                            <div class="flex items-center gap-2">
                                <Trash2 size={14} strokeWidth={2.3} color={themeTokens.lightTextColor()} />{i18next.t('collection.deleteColumn')}
                            </div>
                        </MenuItem>
                    </Menu>
                </div>
            );
        }

        const renderEditOverlay = () => {
            return (
                <div class="dropdownContainer w-[280px]" onMousedown={handleStopPropagation}>
                    <Form layout='vertical' model={formModel.value}>
                        <div class="mx-3 mt-1">
                            <div class="mb-1">{i18next.t('collection.config.base.fieldTitle')}</div>
                            <div class="fieldControl">
                                <FormItem label={i18next.t('collection.config.base.fieldNameTitle')} name="title" class="mb-3" noStyle>
                                    <Input 
                                        placeholder={i18next.t('collection.config.base.fieldNamePlaceholder')} 
                                        autofocus
                                        value={formModel.value?.title} 
                                        onChange={(e) => formModel.value.title = e.target.value || ''}
                                    />
                                </FormItem>

                                <Menu class="fieldTypeMenu">
                                    <SubMenu>
                                        {{
                                            title: () => (
                                                <div class="fieldTypeField px-3 flex items-center justify-between">
                                                    <div class="flex items-center gap-2">
                                                        <ColumnIcon type={formModel.value.type} />
                                                        {getColumnTypeText(formModel.value.type)}
                                                    </div>
                                                    <div>
                                                        <ChevronRight width="16px" height="16px" color={themeTokens.lightTextColor()} />
                                                    </div>
                                                </div>
                                            ),
                                            default: () => (
                                                <div class="fieldTypeMenuContainer">
                                                    <MenuItem key={ColumnTypeEnum.TEXT} onClick={() => handleSelectType(ColumnTypeEnum.TEXT)}>
                                                        <div class="flex items-center gap-2">
                                                            <ColumnIcon type={ColumnTypeEnum.TEXT} />
                                                            {i18next.t('collection.columnType.text')}
                                                        </div>
                                                    </MenuItem>
                                                    <MenuItem key={ColumnTypeEnum.NUMBER} onClick={() => handleSelectType(ColumnTypeEnum.NUMBER)}>
                                                        <div class="flex items-center gap-2">
                                                            <ColumnIcon type={ColumnTypeEnum.NUMBER} />
                                                            {i18next.t('collection.columnType.number')}
                                                        </div>
                                                    </MenuItem>
                                                    <MenuItem key={ColumnTypeEnum.CURRENCY} onClick={() => handleSelectType(ColumnTypeEnum.CURRENCY)}>
                                                        <div class="flex items-center gap-2">
                                                            <ColumnIcon type={ColumnTypeEnum.CURRENCY} />
                                                            {i18next.t('collection.columnType.currency')}
                                                        </div>
                                                    </MenuItem>
                                                    <MenuItem key={ColumnTypeEnum.DATE} onClick={() => handleSelectType(ColumnTypeEnum.DATE)}>
                                                        <div class="flex items-center gap-2">
                                                            <ColumnIcon type={ColumnTypeEnum.DATE} />
                                                            {i18next.t('collection.columnType.date')}    
                                                        </div>
                                                    </MenuItem>
                                                    <MenuItem key={ColumnTypeEnum.SELECT} onClick={() => handleSelectType(ColumnTypeEnum.SELECT)}>
                                                        <div class="flex items-center gap-2">
                                                            <ColumnIcon type={ColumnTypeEnum.SELECT} />
                                                            {i18next.t('collection.columnType.select')}
                                                        </div>
                                                    </MenuItem>
                                                    <MenuItem key={ColumnTypeEnum.IMAGE} onClick={() => handleSelectType(ColumnTypeEnum.IMAGE)}>
                                                        <div class="flex items-center gap-2">
                                                            <ColumnIcon type={ColumnTypeEnum.IMAGE} />
                                                            {i18next.t('collection.columnType.image')}
                                                        </div>
                                                    </MenuItem>
                                                </div>
                                            )
                                        }}
                                    </SubMenu>
                                </Menu>                                
                            </div>
                        </div>

                        <div class="mx-3">
                            {
                                formModel.value?.type === ColumnTypeEnum.CURRENCY ? (
                                    <CurrencyFields />
                                ) : ''
                            }

                            {
                                [ColumnTypeEnum.NUMBER, ColumnTypeEnum.CURRENCY].includes(formModel.value?.type) ? (
                                    <NumberFields />
                                ) : ''
                            }

                            {
                                formModel.value?.type === ColumnTypeEnum.DATE ? (
                                    <DateFields />
                                ) : ''
                            }

                            {
                                formModel.value?.type === ColumnTypeEnum.SELECT ? (
                                    <SelectFields />
                                ) : ''
                            }
                        </div>
                    </Form>

                    <div class="flex items-center justify-end pr-3 pb-4 mt-4">
                        <Space>
                            <Button onClick={handleCancel}>{i18next.t('common.cancelText')}</Button>
                            <Button type="primary" onClick={handleConfirm}>{i18next.t('common.okText')}</Button>
                        </Space>
                    </div>
                </div>
            );
        }

        onClickOutside(containerRef, (e) => {
            const el = e.target as HTMLElement;
            if (
                el?.closest('.fieldTypeMenuContainer') ||
                el?.closest('.ant-select-dropdown') || 
                el?.closest('.overlayContainer')
            ) {
                return;
            }
            handleCancel();
        });

        return () => (
            <Dropdown open={visibleRef.value} placement='bottomRight' destroyPopupOnHide>
                {{
                    default: () => (
                        <div onClick={handleShowDropdown}>
                            {slots.default?.()}
                        </div>
                    ),
                    overlay: () => (
                        <div ref={containerRef}>
                            {renderOverlay()}
                        </div>
                    ),
                }}
            </Dropdown>
        );
    }
})
</script>

<style scoped>

.fieldTypeMenuContainer {
    width: 280px;
    padding: 4px;
    background: var(--float-bg);
    color: rgb(100, 106, 115);

    border: 1px solid var(--float-border-color);
    border-radius: 6px;
    box-shadow: rgba(31, 35, 41, 0.1) 0px 4px 8px 0px;
}

.divider {
    height: 1px;
    background: rgba(31, 35, 41, 0.15);
}

.fieldControl {
    border: 1px solid var(--float-border-color);
    border-radius: 6px;
    overflow: hidden;
}

.fieldControl :deep(.ant-input) {
    border: none!important;
    box-shadow: none!important;
    outline: none!important;
}

.fieldTypeField {
    height: 32px;
    background: var(--home-sider-bg);
}

.fieldTypeMenu {
    padding: 0;
}

.fieldTypeMenu :deep(.ant-dropdown-menu-submenu-title) {
    padding: 0;
}
</style>