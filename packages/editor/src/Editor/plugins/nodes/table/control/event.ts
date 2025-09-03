import { Subject } from 'rxjs';

export const tableSizeChange$ = new Subject<{
  id: string;
}>();