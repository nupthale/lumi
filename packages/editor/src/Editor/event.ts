import { BehaviorSubject, Subject } from 'rxjs';
import { Placement } from '@floating-ui/dom';
import type { AutocompleteAction } from 'prosemirror-autocomplete';

import { PopoverTypeEnum, CommandEnum, UserType } from './interface';
import { BaseBlockView } from './plugins/nodes/_common/baseBlockView';

import { 
  CollectionSchemaType,
} from '@collection/interface';

// doc scroll
export const docScroll$ = new Subject<{ e: Event }>();

export const docScrollTo$ = new Subject<{
  el: HTMLElement | null,
}>();

// floating menu
export const blockMouseEnter$ = new Subject<{
  nodeView: BaseBlockView,
  offsetY?: number,
}>();

export const blockMouseLeave$ = new Subject<{
  delay?: number,
}>();

// top floating menu
export const blockMouseEnterTop$ = new Subject<{
  nodeView: BaseBlockView,
  offsetY?: number,
  commands?: CommandEnum[],
}>();

export const blockMouseLeaveTop$ = new Subject<{
  delay?: number,
}>();

export const showPopover$ = new Subject<{
  // 根据range 计算位置
  range?: [number, number],
  // 根据target 计算位置
  target?: HTMLElement,
  type: PopoverTypeEnum,
  offset?: [number | string, number | string],
  placement?: Placement,
  useMaxHeight?: boolean,
  params?: any,
}>();

export const hidePopover$ = new Subject<{
  type: PopoverTypeEnum,
  delay?: number,
}>();

// 打开自动补全， baseBlockView里统一监听，触发showPopover
export const autoCompleteOpen$ = new Subject<{
  range: {
    from?: number;
    to?: number;
  }
}>();

export const autoCompleteUp$ = new Subject();
export const autoCompleteDown$ = new Subject();
export const autoCompleteFilter$ = new Subject<{ filter: string }>();
export const autoCompleteEnter$ = new Subject<void>();

export const selectionChange$ = new Subject<{
  from: number,
  to: number,
}>();

export const docInit$ = new Subject<{
  doc: Record<string, any>,
  text: string,
}>();

// 文档内容变化
export const docChanged$ = new Subject<{
  doc: Record<string, any>,
  text: string,
}>();

export const focusAtEnd$ = new Subject<{ id: string }>();

// 选中某个块
export const selectBlock$ = new Subject<{
  id: string,
}>();

export const commentChanged$ = new Subject<{
  fileId: string,
  comment: Record<string, any>,
}>();

export const commentDeleted$ = new Subject<{
  fileId: string,
  refId: string,
}>();

export const updateBlockDrag$ = new Subject<{
  nodeView: BaseBlockView,
  drag: HTMLElement,
}>();

export const commentsVisibleChange$ = new Subject<boolean>();

export const onlineUsersChange$ = new Subject<UserType[]>();

export const docLikesChange$ = new Subject<{ fileId: string }>();

export const editorBlur$ = new Subject();

export const ydocProviderSync$ = new BehaviorSubject<{
  fileId: string,
}>({
  fileId: '',
});

export const ydocPersistenceSync$ = new BehaviorSubject<{
  fileId: string,
}>({
  fileId: '',
});

export const updateCollectionsMap$ = new Subject<{
  fileId: string,
  collections: Record<string, {
    schema: CollectionSchemaType,
    values: Record<string, any>,
  }>,
}>();

export const exportToJSON$ = new Subject<{ fileId: string }>();

export const exportToMarkdown$ = new Subject<{ fileId: string }>();