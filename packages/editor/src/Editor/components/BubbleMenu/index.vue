<script lang="tsx">
import { defineComponent, ref } from 'vue';
import { tap, filter } from 'rxjs/operators';
import { useSubscription } from '@vueuse/rxjs';

import Popover from '../Popover/index.vue';

import { showPopover$ } from '../../event';
import { PopoverTypeEnum, CommandEnum } from '../../interface';

import { useMarks } from '../Commands/hooks/useMarks';

import { renderCommand } from '../Commands/index';

export default defineComponent({
    setup() {
        const commandsRef = ref<CommandEnum[]>([]);
        const paramsRef = ref<Record<string, any>>({});
        const { updateMarks, marksRef } = useMarks();

        useSubscription(
            showPopover$.pipe(
                filter(({ type }) => type === PopoverTypeEnum.BUBBLE_MENU),
                tap(({ params }) => {
                    commandsRef.value = params.commands || [];
                    paramsRef.value = params;

                    updateMarks();
                }),
            ).subscribe()
        );

        const renderMenus = () => {
            return (
                <ul class="menuItems flex items-center p-[8px]">
                    {
                        commandsRef.value?.map(command => (
                            renderCommand({
                                command,
                                paramsRef,
                                marksRef,
                            })
                        ))
                    }
                </ul>
            );
        }

        return () => (
            <Popover type={PopoverTypeEnum.BUBBLE_MENU}>
                {{
                    default: () => (
                        renderMenus()
                    )
                }}
            </Popover>
        );
    }
});
</script>

<style>

.ant-popover .ant-popover-arrow {
    display: none;
}
</style>

<style scoped>

.menuItems {
    user-select: none;
}

.menuItem {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 4px;
    color: var(--n800);

    margin-left: 8px;
}

.menuItem:first-of-type {
    margin-left: 0;
}

.menuItem.active {
    background: #e0e9ff;
    color: #336df4;
}

.menuItem:hover {
    background: var(--bubble-menu-hover-color);
}
</style>