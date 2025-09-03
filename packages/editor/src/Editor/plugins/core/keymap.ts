import { NodeSelection, Plugin, TextSelection } from 'prosemirror-state';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';

import { modA } from './modA';

export function coreKeymapPlugin(): Plugin[] {
  return [
    keymap({
      Backspace: (state, dispatch, view) => {
        const { $from, $to } = state.selection;
        const tr = state.tr;

        if (state.selection instanceof NodeSelection) {
          const nextSelection = TextSelection.near(
            $from,
            -1,
          );

          tr.setSelection(
            nextSelection,
          );
          
          tr.delete(
            $from.pos,
            $to.pos,
          );

          view?.focus();

          dispatch?.(tr);
          return true;
        }

        return false;
      },
      'Mod-a': modA,
    })
  ];
}

export function baseKeymapPlugin(): Plugin[] {
  return [
    keymap(baseKeymap),
  ];
} 