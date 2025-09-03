import { Subject } from 'rxjs';

export const columnsSizeChange$ = new Subject<{
  id: string;
}>();