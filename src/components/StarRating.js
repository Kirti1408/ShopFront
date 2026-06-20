import React from 'react';

export default function StarRating({ rating, count, size = 14 }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const fill = i <= Math.floor(rating) ? 1 : i - rating < 1 ? rating - Math.floor(rating) : 0;
    stars.push(
      <span key={i} style={{ position: 'relative', display: 'inline-block', width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 20 20" style={{ position: 'absolute' }}>
          <polygon points="10,1 12.9,7 19.5,7.6 14.8,12 16.3,18.5 10,15 3.7,18.5 5.2,12 0.5,7.6 7.1,7"
            fill="#E5E7EB" />
        </svg>
        <svg width={size} height={size} viewBox="0 0 20 20" style={{ position: 'absolute' }}>
          <defs>
            <clipPath id={`clip-${i}-${rating}`}>
              <rect x="0" y="0" width={20 * fill} height="20" />
            </clipPath>
          </defs>
          <polygon points="10,1 12.9,7 19.5,7.6 14.8,12 16.3,18.5 10,15 3.7,18.5 5.2,12 0.5,7.6 7.1,7"
            fill="#F59E0B" clipPath={`url(#clip-${i}-${rating})`} />
        </svg>
      </span>
    );
  }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <span style={{ display: 'inline-flex', gap: 2 }}>{stars}</span>
      <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>
        {rating.toFixed(1)}
        {count != null && <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}> ({count})</span>}
      </span>
    </span>
  );
}