
const PouchDB = require('pouchdb');
const { files } = require('../pouchdb/index.js');

module.exports = (router) => {
    // 测试写入pouchdb-server, 用于验证分享， 直接修改server的数据库， 触发同步
    router.get('/pouchdb-write-test', async function(req, res, next) {
        const now = new Date().toISOString();

        const spaces = new PouchDB('http://localhost:3001/spaces_hale')
        const spaceAssets = new PouchDB('http://localhost:3001/spaceassets_hale');

        const id = `server_1`;

        // 构造要插入的数据
        const file = {
            _id: id,
            type: 'Doc',
            contentId: '3',
            title: 'server插入数据',
            creator: 'server',
            createdAt: now,
            updatedAt: now,
            deleted: 0,
        };

        try {
            await spaces.put({
                _id: id,
                name: 'shared',
                description: 'server shared',
                isDefault: false,
                isSystem: true,
                creator: 'server',
                createdAt: now,
                updatedAt: now,
                deleted: 0,
            });

            await spaceAssets.put({
                _id: id,
                space: id,
                asset: id,
                type: 'file',
                creator: 'server',
                createdAt: now,
                updatedAt: now,
                deleted: 0,
            });

            const result = await files.put(file);
            res.json({ code: 200, message: '写入成功', data: result });

            spaces.close();
            spaceAssets.close();
        } catch (err) {
            res.status(500).json({ code: 500, message: '写入失败', error: err.message });
        }
    });
};