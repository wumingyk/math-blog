#!/usr/bin/env python3
"""
文章转音频生成器
使用 Edge TTS (免费) 将 Markdown 文章转换为音频
"""

import asyncio
import edge_tts
import os
import re
from pathlib import Path
from datetime import datetime


class ArticleToAudio:
    """文章转音频生成器"""
    
    # 中文语音选项
    VOICES = {
        "xiaoxiao": "zh-CN-XiaoxiaoNeural",      # 晓晓 - 女声，标准
        "xiaoyi": "zh-CN-XiaoyiNeural",          # 小艺 - 女声，温柔
        "yunjian": "zh-CN-YunjianNeural",        # 云健 - 男声，新闻
        "yunxi": "zh-CN-YunxiNeural",            # 云希 - 男声，年轻
        "xiaochen": "zh-CN-XiaochenNeural",      # 晓晨 - 女声，活泼
    }
    
    def __init__(self, output_dir="public/audio"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
    
    def extract_text_from_markdown(self, md_content: str) -> str:
        """从 Markdown 提取纯文本"""
        # 移除 YAML frontmatter
        content = re.sub(r'^---.*?---', '', md_content, flags=re.DOTALL)
        
        # 移除 Markdown 标记
        content = re.sub(r'#+ ', '', content)  # 标题
        content = re.sub(r'\*\*|__', '', content)  # 粗体
        content = re.sub(r'\*|_', '', content)  # 斜体
        content = re.sub(r'`{3}.*?`{3}', '', content, flags=re.DOTALL)  # 代码块
        content = re.sub(r'`([^`]+)`', r'\1', content)  # 行内代码
        content = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', content)  # 链接
        content = re.sub(r'!\[([^\]]*)\]\([^)]+\)', '', content)  # 图片
        content = re.sub(r'\s+', ' ', content)  # 多余空格
        
        # 限制长度（Edge TTS 有字符限制）
        max_chars = 5000  # 约 10-15 分钟音频
        if len(content) > max_chars:
            content = content[:max_chars] + "...（文章较长，以上为节选）"
        
        return content.strip()
    
    async def generate_audio(self, text: str, output_file: str, voice: str = "xiaoxiao") -> str:
        """
        生成音频文件
        
        Args:
            text: 要转换的文本
            output_file: 输出文件名（不含路径）
            voice: 声音选项
        
        Returns:
            生成的音频文件路径
        """
        voice_id = self.VOICES.get(voice, self.VOICES["xiaoxiao"])
        output_path = self.output_dir / output_file
        
        print(f"🎙️ 正在生成音频: {output_file}")
        print(f"   使用声音: {voice_id}")
        print(f"   文本长度: {len(text)} 字符")
        
        communicate = edge_tts.Communicate(text, voice_id)
        await communicate.save(str(output_path))
        
        print(f"✅ 音频已生成: {output_path}")
        return str(output_path)
    
    async def generate_for_article(self, md_file_path: str, voice: str = "xiaoxiao") -> str:
        """
        为 Markdown 文章生成音频
        
        Args:
            md_file_path: Markdown 文件路径
            voice: 声音选项
        
        Returns:
            音频文件的相对路径（用于博客引用）
        """
        md_file = Path(md_file_path)
        if not md_file.exists():
            raise FileNotFoundError(f"文件不存在: {md_file_path}")
        
        # 读取 Markdown
        with open(md_file, 'r', encoding='utf-8') as f:
            md_content = f.read()
        
        # 提取文本
        text = self.extract_text_from_markdown(md_content)
        
        # 生成输出文件名
        article_name = md_file.stem
        output_file = f"{article_name}.mp3"
        
        # 生成音频
        await self.generate_audio(text, output_file, voice)
        
        # 返回相对路径（用于博客引用）
        return f"/audio/{output_file}"
    
    def batch_generate(self, posts_dir: str, voice: str = "xiaoxiao"):
        """批量为所有文章生成音频"""
        posts_path = Path(posts_dir)
        md_files = list(posts_path.glob("*.md"))
        
        print(f"📚 找到 {len(md_files)} 篇文章")
        
        async def process_all():
            results = []
            for md_file in md_files:
                try:
                    audio_path = await self.generate_for_article(md_file, voice)
                    results.append({
                        "article": md_file.name,
                        "audio": audio_path
                    })
                except Exception as e:
                    print(f"❌ 生成失败 {md_file.name}: {e}")
            return results
        
        return asyncio.run(process_all())


def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='文章转音频生成器')
    parser.add_argument('file', nargs='?', help='Markdown 文件路径')
    parser.add_argument('--voice', '-v', default='xiaoxiao', 
                       choices=['xiaoxiao', 'xiaoyi', 'yunjian', 'yunxi', 'xiaochen'],
                       help='选择声音')
    parser.add_argument('--batch', '-b', action='store_true', help='批量生成')
    parser.add_argument('--posts-dir', '-d', default='src/posts', help='文章目录')
    
    args = parser.parse_args()
    
    converter = ArticleToAudio()
    
    if args.batch:
        # 批量生成
        results = converter.batch_generate(args.posts_dir, args.voice)
        print(f"\n📊 生成完成: {len(results)} 个音频文件")
    elif args.file:
        # 单文件生成
        audio_path = asyncio.run(converter.generate_for_article(args.file, args.voice))
        print(f"\n🎵 音频路径: {audio_path}")
    else:
        print("请提供文件路径或使用 --batch 批量生成")


if __name__ == '__main__':
    main()
