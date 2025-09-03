import { Schema } from 'prosemirror-model';
import { Plugin, PluginKey } from 'prosemirror-state';

import { contextStore } from '../../../store/context';
import { showPopover$, hidePopover$ } from '../../../event';
import { PopoverTypeEnum } from '../../../interface';

export function emoji(_schema: Schema): Plugin[] {
  return [
    new Plugin({
      key: new PluginKey('emoji'),
      props: {
        handleKeyDown: (view, event) => {
          const popoverVisible = contextStore.getState().popovers[PopoverTypeEnum.EMOJI];
          
          // 如果popover visible， 那么禁用方向按键的处理
          if (
            popoverVisible
          ) {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
              return true;
            }
          }

          if (event.key === ':') {
              const { state } = view;
              const { selection } = state;
              const { from, to } = selection;
  
              // 触发显示选择菜单
              showPopover$.next({
                  range: [from, to],
                  type: PopoverTypeEnum.EMOJI,
              });
          } else {
              hidePopover$.next({
                type: PopoverTypeEnum.EMOJI,
              });
          }
          
          return false;
        },
      }
    })
  ];
}