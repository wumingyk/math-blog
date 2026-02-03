#!/bin/bash
# 批量生成博客文章音频

echo "🎙️ 博客文章音频生成器"
echo "======================"

cd ~/Documents/my-blog

# 检查是否有文章文件
if [ ! -d "src/posts" ]; then
    echo "❌ 未找到文章目录 src/posts"
    exit 1
fi

# 生成音频
echo ""
echo "正在为文章生成音频..."
python3 scripts/generate-audio.py --batch --posts-dir src/posts --voice xiaoxiao

echo ""
echo "✅ 音频生成完成！"
echo ""
echo "音频文件位置: public/audio/"
echo ""
echo "💡 提示:"
echo "   - 在文章 frontmatter 中添加: audio: \"/audio/文件名.mp3\""
echo "   - 支持的语音: xiaoxiao, xiaoyi, yunjian, yunxi, xiaochen"
echo "   - 单个文章生成: ./scripts/generate-audio.sh 文章名.md"
