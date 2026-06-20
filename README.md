# ShopFront — Product Listing & Detail Page

A clean, performant e-commerce product browser built with React, React Router, and CSS Modules — powered by the [DummyJSON Products API](https://dummyjson.com/docs/products).

---


## Setup Instructions

### Prerequisites
- Node.js ≥ 16
- npm ≥ 8

### Install & Run

```bash
git clone <your-repo-url>
cd shopfront
npm install
npm start
```

App runs at **http://localhost:3000**

### Build for Production

```bash
npm run build
```

Outputs to `/build` — deploy any static host (Vercel, Netlify, S3+CloudFront).

---

## Architectural Decisions

### State Management — React Context
- `FilterContext` holds all filter state (category, price range, brands, current page) in a single context provider that wraps the entire app.
- This means filters **persist across route changes** — navigating from Listing → Detail → back preserves your category, price range, and brand selections.
- No external state library (Redux, Zustand) was used because the state shape is simple and co-location in a context is sufficient.

### Data Fetching — Custom Hook (`useProducts`)
- `useProducts` is a custom hook that owns all API interaction logic.
- **Category filter** → uses the `/products/category/{slug}` API endpoint (server-side filtering).
- **Price range + brand filter** → applied client-side after fetching, allowing combined multi-filter logic without requiring a backend that supports all filter combinations.
- The hook fetches up to 200 products per request to enable client-side filtering across the full result set.
- Pagination is computed from the filtered array — `totalPages = Math.ceil(filtered.length / PAGE_SIZE)`.

### Routing — React Router v6
- `/` → Product Listing Page
- `/product/:id` → Product Detail Page
- The `FilterContext` provider wraps the router, so context outlives route transitions.

### Styling — CSS Modules
- Each component has a co-located `.module.css` file.
- Global design tokens (colors, fonts, spacing, shadows) are defined as CSS custom properties in `index.css`.
- No utility-class framework was used to keep the bundle lean and make the styles easy to audit.

### Component Structure

```
src/
  context/
    FilterContext.js       ← Global filter + pagination state
  hooks/
    useProducts.js         ← Data fetching, filtering, pagination logic
  components/
    FilterPanel.js/.css    ← Dark sidebar with category, price, brand filters
    ProductCard.js/.css    ← Clickable card with image, title, price, rating
    SkeletonCard.js        ← Loading placeholder with shimmer animation
    StarRating.js          ← SVG star rating with partial fill support
    Pagination.js/.css     ← Page number navigation with ellipsis
  pages/
    ListingPage.js/.css    ← Layout shell: sidebar + grid + pagination
    DetailPage.js/.css     ← Full product detail with image gallery + reviews
  App.js                   ← Router + provider setup
  index.js                 ← React root
  index.css                ← Global tokens + resets
```

---

## Assumptions Made

1. **DummyJSON brand field** — Not all products have a `brand`. Brands without a value are excluded from the brand filter list silently.
2. **Price filter** — Applies as a range on the current page's fetched products (server fetch is category-based; price filtering is client-side). This means price filtering works across all products in the selected category.
3. **Discount badge** — Only shown when `discountPercentage ≥ 1` to avoid showing "0% OFF" labels.
4. **Category API response** — DummyJSON v2 returns an array of objects with `slug` and `name`; v1 returns strings. The code handles both formats.
5. **Images** — Some product images from DummyJSON return 404. An `onError` fallback is implemented for both card and detail views.
6. **Pagination reset** — Changing any filter resets to page 1, which is the expected UX behavior.

---

## Improvements Given More Time

### UX & Features
- **Search bar** — Full-text search across product titles/descriptions using `/products/search?q=`
- **Sort controls** — Price (low→high, high→low), rating, newest
- **Wishlist / Compare** — Client-side with localStorage persistence
- **Recently viewed** — Stored in localStorage, shown on detail page
- **Image zoom** — Click-to-zoom or lens hover on detail page
- **Skeleton for detail page** — Already implemented, but could be more granular
- **Toast notifications** — "Added to cart", error toasts etc.

### Performance
- **React Query / SWR** — Replace manual `useEffect` fetching with proper caching, deduplication, stale-while-revalidate
- **Virtualized list** — For very large product sets, react-window would avoid DOM overhead
- **Image lazy loading with IntersectionObserver** — Already uses `loading="lazy"` but custom observer gives finer control
- **Route-based code splitting** — `React.lazy()` for ListingPage and DetailPage

### Code Quality
- **TypeScript** — Type safety for product shapes, API responses, filter state
- **Unit tests** — Jest + React Testing Library for hooks and components
- **E2E tests** — Playwright or Cypress for filter → navigate → back flows
- **Storybook** — Isolated component development for ProductCard, StarRating, FilterPanel

### Accessibility
- Skip-to-content link
- ARIA live regions for filter result count updates
- Full keyboard navigation for filter panel and image gallery

### Backend / Production Concerns
- Replace DummyJSON with a real backend that supports server-side combined filtering, sorting, and efficient pagination
- CDN for product images
- SEO: server-side rendering (Next.js) or static generation for product pages
