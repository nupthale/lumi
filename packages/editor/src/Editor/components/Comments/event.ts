
import { Subject, BehaviorSubject } from 'rxjs';

export const layoutComments$ = new Subject<void>();

export const updateCommentHeight$ = new Subject<{ id: string, height: number }>();

export const activeComment$ = new Subject<{ refId: string, id?: string }>();

export const focusCommentInput$ = new Subject<{ id: string }>();

export const addCommentTransition$ = new BehaviorSubject<void>(undefined);

export const removeCommentTransition$ = new BehaviorSubject<void>(undefined);
