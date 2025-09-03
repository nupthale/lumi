export enum MemberPermission {
    Read = 'read',
    Write = 'write',
}

export interface MemberSchema {
    userId: string;
    permission: MemberPermission;
}

export interface Base {
    creator: string;
    createdAt: string;
    updatedAt: string;
    deleted: number; // 0没删除， 1删除
}

export interface SharableBase extends Base {
    ownerId: string;
    ownerGroupId: string;
    // 是否公开， 到公开空间， 所以人都可看， 可评论
    public: boolean;
    // 成员， 可同时查看的成员
    members: MemberSchema[];
}