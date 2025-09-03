<script lang="tsx">
import { defineComponent, ref } from 'vue';
import { useSubscription } from '@vueuse/rxjs';
import { filter, tap } from 'rxjs/operators';

import Popover from '../Popover/index.vue';

import { PopoverTypeEnum } from '../../interface';
import { showPopover$ } from '../../event';
import { BaseBlockView } from '../../plugins/nodes/_common/baseBlockView';

import { useMenus } from './useMenus';

export default defineComponent({
    setup(_props) {
        const nodeViewRef = ref<BaseBlockView | undefined>();

        const { filteredMenusLen, scrollElRef, renderMenus } = useMenus();

        useSubscription(
            showPopover$.pipe(
                filter(item => item.type === PopoverTypeEnum.AUTO_COMPLETE),
                tap((item) => {
                    nodeViewRef.value = item.params.nodeView;
                }),
            ).subscribe()
        );

        return () => (
            <Popover type={PopoverTypeEnum.AUTO_COMPLETE} contentBorder={false}>
                {{
                    default: () => filteredMenusLen.value > 0 ?(
                        <div class="wrap flex-1 overflow-y-auto" ref={scrollElRef}>
                            {renderMenus()}
                        </div>
                    ) : ''
                }}
            </Popover>
        );
    }
});
</script>


<style scoped>
.wrap {
    border: 1px solid var(--float-border-color);
    border-radius: 4px;
}

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

.doc-floatingMenu-menuItem.active {
    background: var(--menu-item-hover);
}


.doc-floatMenu-title {
    margin: 12px 12px 6px;

}

.doc-floatMenusContainer {
    font-size: 14px;
    color: var(--title-text);
}
</style>