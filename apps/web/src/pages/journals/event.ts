import { Subject } from 'rxjs';

export const switchFile$ = new Subject<{
    fileId: string,
}>();