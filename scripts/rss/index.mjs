/**
 * RSS 资讯聚合主入口
 * 抓取 RSS → AI 翻译 → 生成 JSON → 保存文件
 */
import { writeFile, mkdir } from 'fs/promises';
import { resolve, join } from 'path';
import { logger } from '../digest/utils/logger.mjs';
import { RSSFetcher } from './fetchers/rssFetcher.mjs';
import Translator from './ai/translator.mjs';
import { RSS_CONFIG, AI_CONFIG } from './config/rss.config.mjs';

async function main() {
  logger.separator('=', 60);
  logger.info('🚀 开始生成 RSS 资讯...');
  logger.separator('=', 60);

  // 启用 debug 日志，显示过滤详情
  logger.setLevel(0); // LogLevel.DEBUG

  try {
    // 1. 抓取 RSS
    logger.info('\n📡 第 1 步: 抓取 RSS 源');
    const fetcher = new RSSFetcher(RSS_CONFIG);
    const rawData = await fetcher.fetchAll();

    if (rawData.length === 0) {
      logger.warning('未抓取到任何数据，退出');
      return;
    }

    logger.success(`✅ 抓取完成，共 ${rawData.length} 篇文章\n`);

    // 2. AI 翻译
    logger.info('🤖 第 2 步: AI 翻译中...');
    const translator = new Translator(AI_CONFIG);

    let translatedData;
    if (translator.isAvailable()) {
      logger.info(`使用 ${AI_CONFIG.provider} 进行批量翻译 (批次大小: ${AI_CONFIG.batchSize})`);
      translatedData = await translator.translateBatch(rawData, AI_CONFIG.batchSize);
      logger.success('✅ AI 翻译完成\n');
    } else {
      logger.warning('AI 不可用，使用原始数据（未翻译）');
      translatedData = rawData;
    }

    // 3. 筛选和生成 JSON
    logger.info('📝 第 3 步: 筛选和生成 JSON 数据...');

    // 过滤掉不符合条件的文章
    const filteredData = translatedData.filter(item => {
      // 如果 AI 翻译了，使用 should_include 判断
      if (item.should_include !== undefined) {
        if (!item.should_include) {
          logger.debug(`过滤: ${item.title_zh || item.title} - ${item.reason || '原因未知'}`);
        }
        return item.should_include;
      }
      // 如果没有 AI 筛选，默认保留
      return true;
    });

    logger.info(`筛选后保留 ${filteredData.length} 篇文章（过滤掉 ${translatedData.length - filteredData.length} 篇）`);

    const jsonData = {
      updated_at: new Date().toISOString(),
      total_items: filteredData.length,
      items: filteredData,
    };

    // 4. 保存文件
    logger.info('💾 第 4 步: 保存文件...');
    const outputPath = await saveJSON(jsonData);

    logger.separator('=', 60);
    logger.success(`✨ RSS 资讯生成成功!`);
    logger.info(`📄 文件路径: ${outputPath}`);
    logger.info(`📊 统计: ${translatedData.length} 篇文章`);
    logger.separator('=', 60);
  } catch (error) {
    logger.error('❌ 生成失败', error);
    process.exit(1);
  }
}

/**
 * 保存 JSON 文件
 */
async function saveJSON(data) {
  const outputDir = resolve(process.cwd(), 'src/data');
  await mkdir(outputDir, { recursive: true });

  const filePath = join(outputDir, 'rss-feed.json');
  await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');

  logger.success(`JSON 文件已保存: ${filePath}`);
  return filePath;
}

// 命令行处理
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
RSS 资讯聚合工具

用法:
  node scripts/rss/index.mjs           # 生成 RSS 资讯
  node scripts/rss/index.mjs --help    # 显示帮助

环境变量:
  QWEN_API_KEY    通义千问 API Key (可选，不提供则跳过翻译)
  `);
} else {
  main().catch(console.error);
}
