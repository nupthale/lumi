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

## macOS 应用无法打开问题（重要）

如果下载的 macOS 应用提示 "Lumi 已损坏，无法打开" 或只显示 "删除" 按钮，这是 macOS Gatekeeper 安全机制导致的，**不是应用本身有问题**。

### 🔧 解决方法（按推荐顺序）：

#### 方法1：命令行移除隔离属性（最有效）
```bash
# 拖拽 Lumi.app 到终端获取路径，或手动输入路径
sudo xattr -rd com.apple.quarantine /Applications/Lumi.app
```

#### 方法2：系统设置临时允许
1. 尝试打开 Lumi.app（会被阻止）
2. 立即打开 "系统偏好设置" → "安全性与隐私" → "通用"
3. 你会看到 "Lumi 已阻止使用" 的提示
4. 点击 "仍要打开" 按钮

#### 方法3：右键强制打开
1. 右键点击 Lumi.app
2. 选择 "打开"
3. 在弹出的对话框中点击 "打开"（不是取消）

#### 方法4：临时允许任何来源（不推荐）
```bash
# 允许任何来源
sudo spctl --master-disable

# 使用完毕后记得重新启用保护
sudo spctl --master-enable
```

### ⚠️ 为什么会出现这个问题？

- Lumi 是开源软件，未购买 Apple 开发者证书（$99/年）进行代码签名
- macOS Gatekeeper 默认阻止未签名的应用以保护系统安全
- 这是正常现象，不代表应用有恶意代码
- 代码完全开源透明，可在 GitHub 查看所有源码

### ✅ 使用 方法1 后，应用将永久可用，无需重复操作