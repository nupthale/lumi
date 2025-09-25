#!/bin/bash

# 删除所有 artifacts 的脚本 , 先安装gh： brew install gh， 然后gh login， 再执行
# 使用前请确保已安装并登录 GitHub CLI

echo "开始删除 GitHub Actions artifacts..."

# 获取仓库信息（假设在仓库根目录执行）
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)

echo "仓库: $REPO"

# 列出所有 artifacts 并删除
gh api repos/$REPO/actions/artifacts --paginate --jq '.artifacts[].id' | while read artifact_id; do
    echo "删除 artifact ID: $artifact_id"
    gh api repos/$REPO/actions/artifacts/$artifact_id -X DELETE
    sleep 0.1  # 避免请求过快
done

echo "删除完成！"