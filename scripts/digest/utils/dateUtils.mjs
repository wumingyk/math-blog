/**
 * 日期工具函数
 */

/**
 * 格式化日期
 * @param {Date} date - 日期对象
 * @param {string} format - 格式字符串 (YYYY-MM-DD, YYYY年MM月DD日)
 * @returns {string} 格式化后的日期字符串
 */
export function formatDate(date, format = 'YYYY-MM-DD') {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  switch (format) {
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    case 'YYYY年MM月DD日':
      return `${year}年${month}月${day}日`;
    case 'YYYY/MM/DD':
      return `${year}/${month}/${day}`;
    default:
      return `${year}-${month}-${day}`;
  }
}

/**
 * 获取今天的日期字符串
 * @returns {string} YYYY-MM-DD 格式
 */
export function getTodayString() {
  return formatDate(new Date(), 'YYYY-MM-DD');
}

/**
 * 获取当前时间戳
 * @returns {string} ISO 格式时间戳
 */
export function getTimestamp() {
  return new Date().toISOString();
}

/**
 * 计算两个日期之间的天数差
 * @param {Date} date1 - 日期1
 * @param {Date} date2 - 日期2
 * @returns {number} 天数差
 */
export function daysBetween(date1, date2) {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round((date1 - date2) / oneDay);
}

/**
 * 判断是否为今天
 * @param {Date} date - 日期对象
 * @returns {boolean}
 */
export function isToday(date) {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}
