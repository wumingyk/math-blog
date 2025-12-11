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





