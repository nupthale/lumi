import autocomplete, { ActionKind } from 'prosemirror-autocomplete';
import type { AutocompleteAction, KEEP_OPEN, Options } from 'prosemirror-autocomplete';

import { PopoverTypeEnum } from '@editor/Editor/interface';

import { autoCompleteOpen$, hidePopover$, autoCompleteFilter$, autoCompleteEnter$, autoCompleteUp$, autoCompleteDown$ } from '@editor/Editor/event';

export const picker = {
  action: null as (AutocompleteAction | null),
}

const addPlaceholder = () => {
  setTimeout(() => {
    const typingEl = document.querySelector('.doc-autocomplete-typing');
    if (typingEl) {
      typingEl.classList.add('empty');
    }
  }, 0)
}

const removePlaceholder = () => {
  setTimeout(() => {
    const typingEl = document.querySelector('.doc-autocomplete-typing');
    if (typingEl) {
      typingEl.classList.remove('empty');
    }
  }, 0)
}


export function reducer(action: AutocompleteAction): boolean | typeof KEEP_OPEN {
    picker.action = action;

    switch (action.kind) {
      case ActionKind.open:
        autoCompleteOpen$.next({
          range: action.range,
        });

        addPlaceholder();

        return true;
      case ActionKind.up:
        autoCompleteUp$.next({});
        return true;
      case ActionKind.down:
        autoCompleteDown$.next({});
        return true;
      case ActionKind.filter:
        autoCompleteFilter$.next({
            filter: action.filter || '',
        });

        if (action.filter?.length) {
          removePlaceholder();
        } else {
          addPlaceholder();
        }

        return true;
      case ActionKind.enter:
        // This is on Enter or Tab
        const { from, to } = action.range;
        const tr = action.view.state.tr;

        tr.setMeta('addToHistory', false);
        tr.deleteRange(from, to);
        action.view.dispatch(tr);

        autoCompleteEnter$.next();
        return true;
      case ActionKind.close:
        hidePopover$.next({
            type: PopoverTypeEnum.AUTO_COMPLETE,
        });

        removePlaceholder();

        return true;
      default:
        return false;
    }
}

export const autocompletePlugins = () => {
  const options: Options = {
    triggers: [
        { name: 'slash', trigger: '/', decorationAttrs: { class: 'doc-autocomplete-typing' }, },
        // { name: 'mention', trigger: '@' },
    ],
    reducer,
  };

  return [
    ...autocomplete(options),
  ];
};