
import { MongoClient } from 'mongodb';

// 辅助函数：获取文档内容
export function getDocumentContent(ydoc) {
    if (!ydoc) return null;

    try {
        // 直接获取 prosemirror 内容
        const prosemirror = ydoc.getXmlFragment('prosemirror');
        const content = prosemirror ? prosemirror.toString() : '';

        console.log(`[Server] Document content:`, content);

        return {
            prosemirror
        };

    } catch (error) {
        console.error(`[Server] Error getting document content:`, error);
        return null;
    }
}

export const debug = (app, ldb, location) => {
    // 创建MongoDB客户端来直接查询
    const mongoClient = new MongoClient(location);

    // 辅助函数：从MongoDB获取更新记录
    async function getUpdatesFromMongoDB(roomId) {
        try {
            await mongoClient.connect();
            const db = mongoClient.db();
            
            // 在 multipleCollections 模式下，每个文档都有自己的集合
            const collection = db.collection(roomId);

            const updates = await collection
                .find({})
                .sort({ clock: 1 })
                .toArray();

            return updates;
        } catch (error) {
            console.error('获取更新记录失败:', error);
            return [];
        }
    }

    // 辅助函数：从MongoDB获取所有房间
    async function getRoomsFromMongoDB() {
        try {
            await mongoClient.connect();
            const db = mongoClient.db();
            
            // 在 multipleCollections 模式下，获取所有以 'y-' 开头的集合
            const collections = await db.listCollections().toArray();
            const roomCollections = collections
                .map(col => col.name); // 去掉 'y-' 前缀
            
            return roomCollections;
        } catch (error) {
            console.error('获取房间列表失败:', error);
            return [];
        }
    }

    // 添加调试路由来查看YJS文档状态
    app.get('/debug/doc/:roomId', async (req, res) => {
        try {
            const { roomId } = req.params;
            const ydoc = await ldb.getYDoc(roomId);

            res.json({
                roomId,
                documentExists: !!ydoc,
                // 尝试解析文档内容
                content: getDocumentContent(ydoc),
                // 添加更多调试信息
                documentInfo: ydoc ? {
                    guid: ydoc.guid,
                    clientID: ydoc.clientID,
                    shouldLoad: ydoc.shouldLoad,
                    isDestroyed: ydoc.isDestroyed
                } : null
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // 添加路由来查看特定文档的所有更新
    app.get('/debug/updates/:roomId', async (req, res) => {
        try {
            const { roomId } = req.params;
            const updates = await getUpdatesFromMongoDB(roomId);

            const decodedUpdates = updates.map((update, index) => ({
                index,
                update: update.value.toString('base64'),
                size: update.value.length,
                clock: update.clock,
                action: update.action,
            }));

            res.json({
                roomId,
                totalUpdates: updates.length,
                updates: decodedUpdates
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // 添加路由来列出所有房间
    app.get('/debug/rooms', async (req, res) => {
        try {
            const rooms = await getRoomsFromMongoDB();
            res.json({
                totalRooms: rooms.length,
                rooms: rooms
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
}