// src/components/DesmosEmbed.jsx
import React from 'react';

export default function DesmosEmbed() {
  return (
    <iframe
      src="https://www.desmos.com/calculator"
      style={{ width: '100%', height: '500px', border: '1px solid #ccc' }}
      frameBorder="0"
      title="Desmos Calculator"
    ></iframe>
  );
}
