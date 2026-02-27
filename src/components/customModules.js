// src/components/customModules.js
import { lazy } from 'react';

// 自动扫描所有 Demo 组件
const modules = import.meta.glob('./*Demo.jsx');

// 生成映射表
export const customModules = {};

for (const path in modules) {
  const loadModule = modules[path];
  // 提取文件名，例如 ./SineCurveDemo.jsx → SineCurveDemo
  const name = path.split('/').pop().replace('.jsx', '');
  customModules[`:::${name}:::`] = lazy(async () => {
    const mod = await loadModule();
    return { default: mod.default };
  });
}
