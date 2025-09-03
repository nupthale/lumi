import { Subject } from 'rxjs';

export const focusColumns$ = new Subject<{
    id: string;
}>();