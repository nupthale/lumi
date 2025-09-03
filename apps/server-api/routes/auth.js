const jwt = require('jsonwebtoken');
const { UserModel } = require('../models/user');

module.exports = (router) => {
    // 用户登录
    router.post('/login', async function(req, res, next) {
        // #swagger.tags = ['Auth']
        try {
            const { account } = req.body;

            const user = await UserModel.findOne({ account });
            if (!user) {
              return res.status(400).json({ 
                code: 400,
                message: '用户不存在' 
              });
            }

            // 生成 JWT
            const token = jwt.sign(
              { platform: user.platform, account: user.account },
              process.env.JWT_SECRET,
              { expiresIn: '7d' }
            );
            
            // 设置 cookie，包含 JWT
            res.cookie('x-auth-token', token, {
              httpOnly: true,        // 防止 XSS 攻击
              secure: process.env.NODE_ENV === 'production', // 生产环境强制 HTTPS
              sameSite: 'strict',    // 防止 CSRF 攻击
              maxAge: 7 * 24 * 60 * 60 * 1000, // 7天过期
              path: '/'
            });
            
            res.json({
              code: 200,
              message: '登录成功',
              user,
            });
            
          } catch (error) {
            console.error(error);
            res.status(500).json({ message: '服务器错误' });
          }
    });

    router.get('/logout', (req, res) => {
         // #swagger.tags = ['Auth']
        res.clearCookie('authToken', { path: '/' });
        res.json({ code: 200, message: '登出成功' });
    });
};