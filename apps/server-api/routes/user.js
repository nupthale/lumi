const jwt = require('jsonwebtoken');

const { UserModel } = require('../models/user');

module.exports = (router) => {
    router.get('/user', async function(req, res, next) {
        // #swagger.tags = ['User']
        try {
           const token = req.cookies['x-auth-token'];
 
           if (!token) {
               return res.status(401).json({ message: '请先登录' });
           }
           
           try {
               const decoded = jwt.verify(token, process.env.JWT_SECRET);
               
               const user = await UserModel.findOne({ 
                   platform: decoded.platform,
                   account: decoded.account,
               });

               res.json({
                   code: 200,
                   result: user,
               })
           } catch (error) {
               res.status(401).json({ message: '登录已过期，请重新登录' });
           }
        } catch(e) {
           console.error(e);
        }
    });
};