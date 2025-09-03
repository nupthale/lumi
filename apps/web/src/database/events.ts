import { Subject } from 'rxjs';

export const databaseSyncError$ = new Subject<Error>();

export const databaseChange$ = new Subject<{
    dbName: string;
}>();

// 第一次同步成功
export const databaseInitPullSuccess$ = new Subject<void>();
// 第一次同步失败
export const databaseInitPullFailed$ = new Subject<void>();