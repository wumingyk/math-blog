// src/components/JupyterEmbed.jsx
import React from 'react';

export default function JupyterEmbed() {
  return (
    <iframe
      src="https://mybinder.org/v2/gh/jupyter/notebook/master?filepath=docs/source/examples/Notebook/Running%20Code.ipynb"
      style={{ width: '100%', height: '600px', border: '1px solid #ccc' }}
      frameBorder="0"
      title="Jupyter Notebook"
    ></iframe>
  );
}
