# 🚀 Production Deployment Guide

## 🛡️ Security Headers for Production

For maximum Lighthouse scores and enterprise-grade security, implement these headers at the **server level** (not via meta tags):

### Required Security Headers

```nginx
# Nginx Configuration
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header Cross-Origin-Opener-Policy "same-origin" always;
add_header Cross-Origin-Embedder-Policy "require-corp" always;

# Enhanced CSP (remove 'unsafe-inline' by moving inline styles to CSS)
add_header Content-Security-Policy "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; style-src 'self' https://cdn.jsdelivr.net https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' https://cdn.jsdelivr.net; object-src 'none'; base-uri 'self'; form-action 'self';" always;
```

### Apache Configuration

```apache
# Apache .htaccess
Header always set X-Frame-Options "DENY"
Header always set X-Content-Type-Options "nosniff"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
Header always set Cross-Origin-Opener-Policy "same-origin"
Header always set Cross-Origin-Embedder-Policy "require-corp"
Header always set Content-Security-Policy "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; style-src 'self' https://cdn.jsdelivr.net https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' https://cdn.jsdelivr.net; object-src 'none'; base-uri 'self'; form-action 'self';"
```

### Node.js/Express Configuration

```javascript
const express = require('express');
const helmet = require('helmet');
const app = express();

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "https://cdn.jsdelivr.net", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'", "https://cdn.jsdelivr.net"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true
  },
  frameguard: { action: 'deny' },
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  permissionsPolicy: {
    camera: [],
    microphone: [],
    geolocation: []
  }
}));
```

## 📈 Performance Optimizations for Production

### 1. Remove Inline Styles
Move all inline styles to CSS classes for stricter CSP:

```css
/* Add to style-bootstrap.css */
.typeracer-heading {
  font-family: 'Alegreya', serif;
  font-size: 1.75rem;
}

.test-text-style {
  font-family: 'Nunito', sans-serif;
  font-size: 1.1rem;
  line-height: 1.8;
}

.card-header-orange {
  background-color: #e65100;
  color: white;
}

.hidden {
  display: none;
}
```

### 2. CSS and JS Minification
- Minify CSS: Remove unused Bootstrap styles
- Minify JavaScript: Compress the `javascript.js` file
- Implement gzip compression

### 3. CDN and Caching
- Implement proper cache headers for static assets
- Consider using a CDN for better global performance
- Enable browser caching for fonts and CSS

## 🎯 Expected Production Lighthouse Scores

With these optimizations:
- **Performance**: 100/100 ✅
- **Accessibility**: 100/100 ✅
- **Best Practices**: 100/100 ✅
- **SEO**: 100/100 ✅

## 🔧 Deployment Steps

1. **Server Configuration**: Implement security headers
2. **CSS Optimization**: Move inline styles to classes
3. **Asset Optimization**: Minify and compress assets
4. **Testing**: Verify all Lighthouse scores are 100/100
5. **Monitoring**: Set up continuous monitoring

---
*This guide ensures your TypeRacer application meets enterprise-grade security and performance standards.*