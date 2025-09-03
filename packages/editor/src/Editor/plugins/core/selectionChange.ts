import { Plugin, PluginKey } from 'prosemirror-state';

import { selectionChange$ } from '../../event';

const selectionChangeKey = new PluginKey('selectionChange');

export const selectionChangePlugin = () => {
    return [
        new Plugin({
            key: selectionChangeKey,
            
            view: () => {
                return {
                    update(view, prevState) {
                        // 检查选择是否发生变化
                        if (view.state.selection === prevState.selection) {
                            return;
                        }

                        // 获取当前光标位置
                        const { from, to } = view.state.selection;
                        
                        selectionChange$.next({ from, to });
                    },
                };
            },
        })
    ];
}; 