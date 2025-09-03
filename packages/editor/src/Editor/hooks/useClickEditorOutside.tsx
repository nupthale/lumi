import { onMounted, onUnmounted, ref } from 'vue';

import { TextSelection } from 'prosemirror-state';

import { contextStore  } from '../store/context';

import { hidePopover$, editorBlur$ } from '../event';
import { isInIgnoreEventList } from '../shared/event';
import { PopoverTypeEnum } from '../interface';

// 如果mousedown和mouseup的坐标一致， 且都不是prosemirror， menuItems, ant-popover内部， 则认为是点击
export const useClickEditorOutside = () => {

    const startEvent = ref<MouseEvent | null>(null);

    const handleMousedown = (e: MouseEvent) => {
        startEvent.value = e;
    }

    const handleMouseup = (event: MouseEvent) => {
        // 如果event.target是.menuItems的子孙元素，那么不执行任何操作
        if (
            isInIgnoreEventList(event) || isInIgnoreEventList(startEvent.value)
        ) {
            return;
        }

        try {
            editorBlur$.next({});

            hidePopover$.next({
                type: PopoverTypeEnum.BUBBLE_MENU,
            });
        } catch(e) {
            console.error(e);
        }
    }

    onMounted(() => {
        window.addEventListener('mousedown', handleMousedown);
        window.addEventListener('mouseup', handleMouseup);
    });

    onUnmounted(() => {
        window.removeEventListener('mousedown', handleMousedown);
        window.removeEventListener('mouseup', handleMouseup);
    })
}