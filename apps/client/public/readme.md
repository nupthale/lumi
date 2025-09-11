# MAC

## 1. 创建一个.iconset文件夹
mkdir icon.iconset

## 2. 生成不同尺寸的图片
sips -z 16 16     icon.png --out icon.iconset/icon_16x16.png
sips -z 32 32     icon.png --out icon.iconset/icon_16x16@2x.png
sips -z 32 32     icon.png --out icon.iconset/icon_32x32.png
sips -z 64 64     icon.png --out icon.iconset/icon_32x32@2x.png
sips -z 128 128   icon.png --out icon.iconset/icon_128x128.png
sips -z 256 256   icon.png --out icon.iconset/icon_128x128@2x.png
sips -z 256 256   icon.png --out icon.iconset/icon_256x256.png
sips -z 512 512   icon.png --out icon.iconset/icon_256x256@2x.png
sips -z 512 512   icon.png --out icon.iconset/icon_512x512.png
sips -z 1024 1024 icon.png --out icon.iconset/icon_512x512@2x.png

## 3. 转换为.icns文件
iconutil -c icns icon.iconset

# Windows

## 安装依赖
mac: brew install imagemagick
ubuntu: sudo apt-get instlall imagemagick

# 转换icon

## 生成ico (解决尺寸限制问题)
# 方法1: 使用ImageMagick
magick icon.png -resize 256x256 -define icon:auto-resize=256,128,64,48,32,16 icon.ico

## 生成icns
magick icon.png -define icon:auto-resize=256,128,64,48,32,16 icon.icns