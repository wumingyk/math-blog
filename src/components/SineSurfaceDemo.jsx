// src/components/SineSurfaceDemo.jsx
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function SineSurfaceDemo() {
  const mountRef = useRef(null);

  useEffect(() => {
    const width = 600;
    const height = 400;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Append canvas
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Scene and camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf7f7f7);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 25, 55);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(20, 30, 20);
    scene.add(dir);

    // Grid helper (optional)
    const grid = new THREE.GridHelper(60, 30, 0xcccccc, 0xe5e5e5);
    scene.add(grid);

    // Plane geometry with BufferGeometry API
    // Width/height segments define resolution of the surface
    const plane = new THREE.PlaneGeometry(40, 40, 100, 100);
    plane.rotateX(-Math.PI / 2); // Make it horizontal (x-z plane)

    // Access positions and apply sine surface: y = sin(kx) * cos(kz) * amp
    const positions = plane.attributes.position;
    const k = 0.3;    // frequency factor
    const amp = 3.0;  // amplitude
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);
      const y = Math.sin(k * x) * Math.cos(k * z) * amp;
      positions.setY(i, y);
    }
    positions.needsUpdate = true;
    plane.computeVertexNormals();

    const material = new THREE.MeshPhongMaterial({
      color: 0x10b981,     // emerald
      wireframe: true,     // wireframe for math feel
      side: THREE.DoubleSide,
    });

    const surface = new THREE.Mesh(plane, material);
    scene.add(surface);

    // Animation
    let rafId = null;
    function animate() {
      rafId = requestAnimationFrame(animate);
      surface.rotation.y += 0.008;
      renderer.render(scene, camera);
    }
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(rafId);
      renderer.dispose();
      material.dispose();
      plane.dispose();
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="my-8 p-6 border rounded-lg bg-white dark:bg-slate-800 shadow-sm">
      <h3 className="text-xl font-bold mb-2">Three.js 三维正弦曲面演示</h3>
      <p className="mb-4 text-slate-600 dark:text-slate-300">
        这是一个三维正弦曲面，当前使用 y = sin(kx) · cos(kz) 的波形，支持旋转观察。
      </p>
      <div ref={mountRef} style={{ width: 600, height: 400 }} />
    </div>
  );
}
