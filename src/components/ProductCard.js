import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StarRating from './StarRating';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const discountedPrice = product.price;
  const originalPrice = product.discountPercentage
    ? (product.price / (1 - product.discountPercentage / 100)).toFixed(2)
    : null;

  return (
    <article
      className={styles.card}
      onClick={() => navigate(`/product/${product.id}`)}
      role="button"
      tabIndex={0}
      aria-label={`View ${product.title}`}
      onKeyDown={e => e.key === 'Enter' && navigate(`/product/${product.id}`)}
    >
      <div className={styles.imageWrap}>
        {!imgError ? (
          <img
            src={product.thumbnail}
            alt={product.title}
            className={styles.image}
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className={styles.imageFallback}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="M21 15l-5-5L5 21"/>
            </svg>
          </div>
        )}
        {product.discountPercentage >= 1 && (
          <span className={styles.badge}>-{Math.round(product.discountPercentage)}%</span>
        )}
        {product.stock === 0 && (
          <div className={styles.outOfStock}>Out of Stock</div>
        )}
      </div>

      <div className={styles.body}>
        {product.brand && (
          <span className={styles.brand}>{product.brand}</span>
        )}
        <h3 className={styles.title}>{product.title}</h3>
        <div className={styles.rating}>
          <StarRating rating={product.rating} />
        </div>
        <div className={styles.pricing}>
          <span className={styles.price}>${discountedPrice.toFixed(2)}</span>
          {originalPrice && (
            <span className={styles.originalPrice}>${originalPrice}</span>
          )}
        </div>
      </div>
    </article>
  );
}
