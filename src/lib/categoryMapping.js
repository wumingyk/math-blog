// src/lib/categoryMapping.js
// L.E.A.P. 分类映射工具

// 英文分类到中文的映射
export const categoryMap = {
  'Language': '语言',
  'Engineering': '技术',
  'Algorithm': '数学',
  'Physics': '物理'
};

// 固定的分类列表（英文）
export const fixedCategories = ['Language', 'Engineering', 'Algorithm', 'Physics'];

/**
 * 原始文章分类归一化到 L.E.A.P. 导航分类
 * @param {string} category - 原始分类
 * @returns {'Language'|'Engineering'|'Algorithm'|'Physics'}
 */
export const normalizeToNavCategory = (category) => {
  const value = String(category || '').trim().toLowerCase();

  if (!value) return 'Language';

  if (['language', 'reading', 'essay', '文学', '阅读', '随笔'].includes(value)) {
    return 'Language';
  }

  if (['engineering', 'tech', 'technology', '技术', '工程'].includes(value)) {
    return 'Engineering';
  }

  if (['algorithm', 'math', 'mathematics', '数学', '算法'].includes(value)) {
    return 'Algorithm';
  }

  if (['physics', '物理'].includes(value)) {
    return 'Physics';
  }

  // 未知分类做宽松归类，优先放到 Language
  return 'Language';
};

/**
 * 将英文分类转换为中文
 * @param {string} category - 英文分类
 * @returns {string} 中文分类
 */
export const getCategoryLabel = (category) => {
  if (!category) return '';
  return categoryMap[category] || category;
};

/**
 * 检查分类是否为有效的L.E.A.P.分类
 * @param {string} category - 分类名称
 * @returns {boolean}
 */
export const isValidCategory = (category) => {
  return fixedCategories.includes(category);
};




