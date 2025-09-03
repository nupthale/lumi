electron总提示安装失败，不要用pnpm安装， 删除node_modules 用npm i --registry=https://registry.npmmirror.com安装即可。

打包的时候， 报错：proxyconnect tcp: dial tcp :0: connect: can't assign requested address
https://blog.csdn.net/wm9028/article/details/114583011

从https://github.com/electron/electron/releases下载后， 按照文档放到目录。


1. Download Electron v36.0.0 manually from: https://github.com/electron/electron/releases/tag/v36.0.0
Download the file: electron-v36.0.0-darwin-x64.zip (since you're on macOS)
2. Place the downloaded zip file in one of these locations:
    2.1 ~/.electron/ (user's home directory)
    2.2 node_modules/electron/dist/ (in your project directory)
3. ~/Libary/Caches/electron/目录下
3. After placing the file, try running the build command again.

打包window是的问题， 需要下载一堆包， 放到~/Library/Caches/electron-builder/， 有的还需要解压缩
1. winCodeSign-2.6.0 - 需要解压到~/Library/Caches/electron-builder/
2. wine， 解压后放到~/Library/Caches/electron-builder/
3. nsis
4. nsis-resources-3.4.1 还需要在nsis目录下，自己新建这个目录， 解压进去
build过程中， mac还会不停的跳出要授权， 到系统偏好设置 -> 安全性与隐私里， 不停的点击允许。
windows打包问题： 
https://juejin.cn/post/7289361899874713637
https://blog.csdn.net/weixin_42987525/article/details/137994881

#python必须是2.7版本， 3版本不行。

# 生成icon的网站： https://yc-w-cn.github.io/macos-compliant-icon-generator/

# icon配置： https://cloud.tencent.com/developer/article/1650700

# 用npm， 不要用pnpm， 一堆问题。