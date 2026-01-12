/**
 * 运行脚本（加载环境变量）
 */
import 'dotenv/config';
import { logger } from '../digest/utils/logger.mjs';

// 导入并运行主脚本
(async () => {
  try {
    await import('./index.mjs');
  } catch (error) {
    logger.error('运行失败', error);
    process.exit(1);
  }
})();
