默认提交会构建并发布到一个临时存储空间（30天）
构建完成后，你可以在 GitHub Actions 的运行页面找到 artifacts：
进入你的 GitHub 仓库
点击 Actions 标签
找到最近的 Build and Release 工作流运行
点击进入该运行
在页面底部的 Artifacts 部分，你会看到：
lumi-macos-x64 - macOS Intel 版本
lumi-macos-arm64 - macOS Apple Silicon 版本
lumi-windows-x64 - Windows 版本
lumi-linux-x64 - Linux 版本
这些 artifacts 会保存 30 天（根据你的配置 retention-days: 30）。



如果要发到release， 步骤：
# 创建并推送 tag
git tag v1.0.0-alpha.3
git push origin v1.0.0-alpha.3
这会触发工作流的 release job，自动创建 GitHub Release 并上传所有构建的包文件。