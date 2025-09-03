import { Schema } from 'prosemirror-model';
import { Plugin, PluginKey } from 'prosemirror-state';
import { MentionView } from './view';

import { showPopover$, hidePopover$ } from '../../../event';
import { contextStore } from '../../../store/context';
import { PopoverTypeEnum } from '../../../interface';

export function mention(_schema: Schema): Plugin[] {
  return [
    new Plugin({
      key: new PluginKey('mention'),
      props: {
        nodeViews: {
          mention: (node, view) => {
            return new MentionView(node, view);
          }
        },
        handleKeyDown: (view, event) => {
          const popoverVisible = contextStore.getState().popovers[PopoverTypeEnum.MENTION];

          // 如果popover visible， 那么禁用方向按键的处理
          if (
            popoverVisible
          ) {
            if (['ArrowUp', 'ArrowDown'].includes(event.key)) {
              return true;
            }
           
            if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {
              // 隐藏popover
              hidePopover$.next({ type: PopoverTypeEnum.MENTION });
              return false;
            }
          }

          if (event.key === '@') {
              const { state } = view;
              const { selection } = state;
              const { from, to } = selection;
  
              // 触发显示选择菜单
              showPopover$.next({
                  range: [from, to],
                  type: PopoverTypeEnum.MENTION,
              });
          }
          
          return false;
        },
      }
    })
  ];
}