import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StarRating from '../components/StarRating';
import { fetchProduct } from '../hooks/useProducts';
import styles from './DetailPage.module.css';

export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchProduct(id)
      .then(data => { setProduct(data); setSelectedImage(0); })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <DetailSkeleton />;
  if (error) return (
    <div className={styles.page}>
      <div className={styles.errorBox}>
        <p className={styles.errorTitle}>Product not found</p>
        <p className={styles.errorMsg}>{error}</p>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>← Back to listings</button>
      </div>
    </div>
  );
  if (!product) return null;

  const images = product.images?.length ? product.images : [product.thumbnail];
  const displayImage = imgError ? null : images[selectedImage];

  const originalPrice = product.discountPercentage >= 1
    ? (product.price / (1 - product.discountPercentage / 100)).toFixed(2)
    : null;

  const stockStatus = product.stock === 0
    ? { label: 'Out of Stock', color: '#EF4444' }
    : product.stock < 10
    ? { label: `Only ${product.stock} left`, color: '#F59E0B' }
    : { label: 'In Stock', color: '#10B981' };

  return (
    <div className={styles.page}>
      {/* Breadcrumb nav */}
      <nav className={styles.nav}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Back to results
        </button>
        <span className={styles.navSep}>/</span>
        {product.category && (
          <>
            <span className={styles.navCat}>
              {product.category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </span>
            <span className={styles.navSep}>/</span>
          </>
        )}
        <span className={styles.navTitle}>{product.title}</span>
      </nav>

      <div className={styles.container}>
        {/* Image Gallery */}
        <div className={styles.gallery}>
          <div className={styles.mainImageWrap}>
            {displayImage ? (
              <img
                src={displayImage}
                alt={product.title}
                className={styles.mainImage}
                onError={() => setImgError(true)}
              />
            ) : (
              <div className={styles.imgFallback}>
                <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <path d="M21 15l-5-5L5 21"/>
                </svg>
              </div>
            )}
            {product.discountPercentage >= 1 && (
              <span className={styles.badge}>-{Math.round(product.discountPercentage)}% OFF</span>
            )}
          </div>

          {images.length > 1 && (
            <div className={styles.thumbs}>
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`${styles.thumb} ${i === selectedImage ? styles.thumbActive : ''}`}
                  onClick={() => { setSelectedImage(i); setImgError(false); }}
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={img} alt="" onError={e => e.target.style.display='none'} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className={styles.info}>
          {product.brand && (
            <span className={styles.brand}>{product.brand}</span>
          )}
          <h1 className={styles.title}>{product.title}</h1>

          <div className={styles.ratingRow}>
            <StarRating rating={product.rating} count={product.reviews?.length} size={16} />
          </div>

          <div className={styles.priceRow}>
            <span className={styles.price}>${product.price.toFixed(2)}</span>
            {originalPrice && (
              <span className={styles.originalPrice}>${originalPrice}</span>
            )}
            {product.discountPercentage >= 1 && (
              <span className={styles.savings}>
                Save ${(originalPrice - product.price).toFixed(2)}
              </span>
            )}
          </div>

          <p className={styles.description}>{product.description}</p>

          <div className={styles.metaGrid}>
            <MetaItem label="Category" value={product.category?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} />
            {product.brand && <MetaItem label="Brand" value={product.brand} />}
            {product.sku && <MetaItem label="SKU" value={product.sku} />}
            {product.weight && <MetaItem label="Weight" value={`${product.weight}g`} />}
            {product.warrantyInformation && <MetaItem label="Warranty" value={product.warrantyInformation} />}
            {product.shippingInformation && <MetaItem label="Shipping" value={product.shippingInformation} />}
            {product.returnPolicy && <MetaItem label="Returns" value={product.returnPolicy} />}
          </div>

          <div className={styles.stockRow}>
            <span className={styles.stockDot} style={{ background: stockStatus.color }} />
            <span className={styles.stockLabel} style={{ color: stockStatus.color }}>
              {stockStatus.label}
            </span>
          </div>

          {product.tags?.length > 0 && (
            <div className={styles.tags}>
              {product.tags.map(tag => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      {product.reviews?.length > 0 && (
        <section className={styles.reviews}>
          <h2 className={styles.reviewsTitle}>Customer Reviews</h2>
          <div className={styles.reviewGrid}>
            {product.reviews.map((review, i) => (
              <div key={i} className={styles.review}>
                <div className={styles.reviewHeader}>
                  <span className={styles.reviewer}>{review.reviewerName}</span>
                  <StarRating rating={review.rating} size={13} />
                </div>
                <p className={styles.reviewBody}>{review.comment}</p>
                <span className={styles.reviewDate}>
                  {new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function MetaItem({ label, value }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</span>
      <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{value}</span>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 28px' }}>
      <div className="skeleton" style={{ height: 16, width: 240, marginBottom: 28 }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
        <div>
          <div className="skeleton" style={{ width: '100%', paddingTop: '100%', borderRadius: 'var(--radius)' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="skeleton" style={{ height: 14, width: '30%' }} />
          <div className="skeleton" style={{ height: 32, width: '85%' }} />
          <div className="skeleton" style={{ height: 32, width: '65%' }} />
          <div className="skeleton" style={{ height: 16, width: '50%' }} />
          <div className="skeleton" style={{ height: 28, width: '40%', marginTop: 8 }} />
          <div className="skeleton" style={{ height: 80, width: '100%', marginTop: 8 }} />
        </div>
      </div>
    </div>
  );
}
