// src/components/customModules.js

// 自动扫描所有 Demo 组件
const modules = import.meta.glob('./*Demo.jsx', { eager: true });

// 生成映射表
export const customModules = {};

for (const path in modules) {
  const component = modules[path].default;
  if (component) {
    // 提取文件名，例如 ./SineCurveDemo.jsx → SineCurveDemo
    const name = path.split('/').pop().replace('.jsx', '');
    customModules[`:::${name}:::`] = component;
  }
}