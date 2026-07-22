import React from 'react';

export default function Logo({ size = 'medium' }: { size?: 'small' | 'medium' | 'large' }) {
  const scale = size === 'small' ? 0.7 : size === 'large' ? 1.4 : 1;
  const width = 145 * scale;
  const height = 65 * scale;

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 220 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        {/* Text Logo using high-quality clean geometric font */}
        <g id="text-logo">
          <text
            x="10"
            y="60"
            fill="var(--color-text)"
            fontFamily="'Outfit', 'Montserrat', 'Inter', system-ui, -apple-system, sans-serif"
            fontWeight="800"
            fontSize="45"
            letterSpacing="-1.5px"
          >
            <tspan fill="#74b816">i</tspan>Master
          </text>
          
          <text
            x="10"
            y="82"
            fill="var(--color-text-muted)"
            fontFamily="'Outfit', 'Montserrat', 'Inter', system-ui, -apple-system, sans-serif"
            fontWeight="800"
            fontSize="9.8"
            letterSpacing="5.8px"
          >
            ASSISTÊNCIA TÉCNICA
          </text>
        </g>
      </svg>
    </div>
  );
}
