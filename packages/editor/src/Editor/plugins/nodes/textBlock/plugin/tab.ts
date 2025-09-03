export const insertTab = (state, dispatch, _view) => {
    const { $from } = state.selection;
    const tr = state.tr;
    
    if (
      $from.parent.type.name !== 'textBlock_head'
    ) {
      return false;
    }
  
    tr.insertText('\t');
  
    dispatch?.(tr);
  
    return true;
  }