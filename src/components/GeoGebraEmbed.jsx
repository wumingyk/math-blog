// src/components/GeoGebraEmbed.jsx
import React from 'react';

export default function GeoGebraEmbed() {
  return (
    <iframe
      src="https://www.geogebra.org/classic"
      style={{ width: '100%', height: '500px', border: '1px solid #ccc' }}
      frameBorder="0"
      title="GeoGebra Classic"
    ></iframe>
  );
}
