
import { database } from '@/database/database';
import { useLiveQuery } from '@/database/useLiveQuery';

const defaultSpace = {
    _id: 'app.default.space',
    name: 'home.myspace',
    description: 'home.myspaceDescription',
    isDefault: true,
    isSystem: true,
};

export const useSpaces = () => {
    // 使用 pouchdb-find 查询 spaces
    const spaces = useLiveQuery(
        ['spaces'],
        async () => {
            const result = await database.spaces?.find({
                selector: { deleted: 0 },
                // pouchdb-find 不支持 sort boolean，后处理
            });

            if (!result?.docs?.length) {
                return [defaultSpace];
            }

            // 默认空间排前面
            const sortedSpaces = (result?.docs || []).sort((a: any, b: any) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));

            if (!sortedSpaces[0].isDefault) {
                sortedSpaces.unshift(defaultSpace);
            } else {
                sortedSpaces.splice(1, 0, defaultSpace);
            }

            return sortedSpaces;
        },
        []
    );

    return {
        spaces,
    };
}