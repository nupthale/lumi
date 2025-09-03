module.exports = (router) => {
    // 获取所有用户
    router.get('/storageInfo', async function(req, res, next) {
        // #swagger.tags = ['Storage']
        res.json({
            code: 200,
            message: '成功',
            data: {
                size: 100,
            }
        });
    });
};