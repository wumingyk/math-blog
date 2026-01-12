/**
 * 每日资讯聚合主入口
 * 抓取 → AI 处理 → 生成 Markdown → 保存文件
 */
import { resolve, join } from 'path';
import { writeFile, mkdir } from 'fs/promises';
import { logger } from './utils/logger.mjs';
import { getTodayString, getTimestamp } from './utils/dateUtils.mjs';
import { BilibiliFetcher } from './fetchers/bilibiliFetcher.mjs';
import { TwitterFetcher } from './fetchers/twitterFetcher.mjs';
import { WeiboFetcher } from './fetchers/weiboFetcher.mjs';
import AIProcessor from './ai/aiProcessor.mjs';
import MarkdownGenerator from './generators/markdownGenerator.mjs';
import { SOURCES_CONFIG, AI_CONFIG, GENERATOR_CONFIG } from './config/sources.config.mjs';

/**
 * 主函数
 */
async function main() {
  logger.separator('=', 60);
  logger.info('🚀 开始生成每日资讯...');
  logger.separator('=', 60);

  try {
    // 1. 抓取数据
    logger.info('\n📡 第 1 步: 抓取数据源');
    const rawData = await fetchAllSources();

    if (rawData.length === 0) {
      logger.warning('未抓取到任何数据，退出');
      return;
    }

    logger.success(`✅ 抓取完成，共 ${rawData.length} 条数据\n`);

    // 2. AI 处理
    logger.info('🤖 第 2 步: AI 处理中...');
    const aiProcessor = new AIProcessor(AI_CONFIG);

    let processedData;
    if (aiProcessor.isAvailable()) {
      logger.info(`使用 ${AI_CONFIG.provider} 进行批量处理 (批次大小: ${AI_CONFIG.batchSize})`);
      processedData = await aiProcessor.processBatch(rawData, AI_CONFIG.batchSize);
      logger.success('✅ AI 处理完成\n');
    } else {
      logger.warning('AI 不可用，使用原始数据');
      processedData = rawData;
    }

    // 3. 生成 Markdown
    logger.info('📝 第 3 步: 生成 Markdown...');
    const generator = new MarkdownGenerator(GENERATOR_CONFIG);
    const markdown = generator.generate(processedData, {
      date: new Date(),
    });

    logger.success('✅ Markdown 生成完成\n');

    // 4. 保存文件
    logger.info('💾 第 4 步: 保存文件...');
    const outputPath = await saveMarkdown(markdown);

    logger.separator('=', 60);
    logger.success(`✨ 每日资讯生成成功!`);
    logger.info(`📄 文件路径: ${outputPath}`);
    logger.info(`📊 统计: ${processedData.length} 条资讯`);
    logger.separator('=', 60);
  } catch (error) {
    logger.error('❌ 生成失败', error);
    process.exit(1);
  }
}

/**
 * 抓取所有数据源
 * @returns {Promise<Array>} 所有数据
 */
async function fetchAllSources() {
  const allData = [];
  const fetchers = [];

  // 初始化抓取器
  if (SOURCES_CONFIG.bilibili.enabled) {
    fetchers.push(new BilibiliFetcher(SOURCES_CONFIG.bilibili));
  }

  if (SOURCES_CONFIG.twitter.enabled) {
    fetchers.push(new TwitterFetcher(SOURCES_CONFIG.twitter));
  }

  if (SOURCES_CONFIG.weibo.enabled) {
    fetchers.push(new WeiboFetcher(SOURCES_CONFIG.weibo));
  }

  if (fetchers.length === 0) {
    logger.warning('没有启用的数据源');
    return [];
  }

  // 并行抓取所有数据源
  const results = await Promise.allSettled(
    fetchers.map(fetcher => fetcher.execute())
  );

  // 收集成功的结果
  results.forEach((result, index) => {
    if (result.status === 'fulfilled' && result.value.length > 0) {
      logger.info(`${fetchers[index].name}: ${result.value.length} 条`);
      allData.push(...result.value);
    }
  });

  return allData;
}

/**
 * 保存 Markdown 文件
 * @param {string} markdown - Markdown 内容
 * @returns {Promise<string>} 文件路径
 */
async function saveMarkdown(markdown) {
  const outputDir = resolve(process.cwd(), GENERATOR_CONFIG.outputDir);

  // 确保目录存在
  await mkdir(outputDir, { recursive: true });

  // 生成文件名
  const filename = `${getTodayString()}.md`;
  const filePath = join(outputDir, filename);

  // 写入文件
  await writeFile(filePath, markdown, 'utf-8');

  return filePath;
}

/**
 * 测试函数（不保存文件，只打印结果）
 */
async function test() {
  logger.info('🧪 测试模式：只抓取和处理，不保存文件\n');

  // 抓取
  const rawData = await fetchAllSources();
  logger.info(`抓取到 ${rawData.length} 条数据\n`);

  // 打印前 3 条
  logger.info('前 3 条数据预览:');
  rawData.slice(0, 3).forEach((item, index) => {
    console.log(`\n[${index + 1}] ${item.title}`);
    console.log(`    来源: ${item.source}`);
    console.log(`    作者: ${item.author}`);
    console.log(`    内容: ${item.content.substring(0, 100)}...`);
  });

  // AI 处理（如果可用）
  const aiProcessor = new AIProcessor(AI_CONFIG);
  if (aiProcessor.isAvailable()) {
    logger.info('\n测试 AI 处理第一条数据...');
    const processed = await aiProcessor.processItem(rawData[0]);
    console.log('\n处理结果:');
    console.log(JSON.stringify(processed, null, 2));
  }
}

// 命令行参数处理
const args = process.argv.slice(2);

if (args.includes('--test') || args.includes('-t')) {
  // 测试模式
  test().catch(console.error);
} else if (args.includes('--help') || args.includes('-h')) {
  // 帮助信息
  console.log(`
每日资讯聚合工具

用法:
  node scripts/digest/index.mjs           # 生成今日资讯
  node scripts/digest/index.mjs --test    # 测试模式（不保存文件）
  node scripts/digest/index.mjs --help    # 显示帮助

环境变量:
  QWEN_API_KEY           通义千问 API Key (必需)
  TWITTER_BEARER_TOKEN   Twitter Bearer Token (可选)

配置文件:
  scripts/digest/config/sources.config.mjs
  `);
} else {
  // 正常运行
  main().catch(console.error);
}
