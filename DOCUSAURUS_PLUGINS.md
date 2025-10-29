# Recommended Docusaurus Plugins

This document lists recommended plugins for enhancing the OpenConnect Protocol Documentation site.

## Currently Installed

### ✅ @cmfcmf/docusaurus-search-local

**Purpose**: Offline/local search functionality

**Status**: Installed and configured

**Configuration**: See `docusaurus.config.js`

```bash
npm install --save @cmfcmf/docusaurus-search-local
```

**Features**:
- Works offline (no external API calls)
- No Algolia dependency
- Indexes docs, pages, and blog posts
- Support for multiple languages

---

## Recommended Plugins to Install

### 1. 🖼️ docusaurus-plugin-image-zoom

**Purpose**: Add zoom functionality to images (useful for diagrams)

```bash
npm install --save docusaurus-plugin-image-zoom
```

**Configuration**:
```javascript
plugins: [
  'docusaurus-plugin-image-zoom',
],
```

**Why**: With many PlantUML, Mermaid, and GraphViz diagrams, users need to zoom in for details.

---

### 2. 📦 @docusaurus/plugin-ideal-image

**Purpose**: Optimize images for web delivery

```bash
npm install --save @docusaurus/plugin-ideal-image
```

**Configuration**:
```javascript
plugins: [
  [
    '@docusaurus/plugin-ideal-image',
    {
      quality: 85,
      max: 2000,
      min: 500,
      steps: 4,
      disableInDev: false,
    },
  ],
],
```

**Why**: Improves page load times by serving optimized, responsive images.

---

### 3. 📱 @docusaurus/plugin-pwa

**Purpose**: Progressive Web App support for offline access

```bash
npm install --save @docusaurus/plugin-pwa
```

**Configuration**:
```javascript
plugins: [
  [
    '@docusaurus/plugin-pwa',
    {
      debug: false,
      offlineModeActivationStrategies: [
        'appInstalled',
        'standalone',
        'queryString',
      ],
      pwaHead: [
        {
          tagName: 'link',
          rel: 'icon',
          href: '/img/logo.png',
        },
        {
          tagName: 'link',
          rel: 'manifest',
          href: '/manifest.json',
        },
        {
          tagName: 'meta',
          name: 'theme-color',
          content: '#1890ff',
        },
      ],
    },
  ],
],
```

**Why**: Allow users to access documentation offline (useful for VPN/network engineers).

---

### 4. 📊 @docusaurus/plugin-google-gtag

**Purpose**: Google Analytics tracking (optional)

```bash
npm install --save @docusaurus/plugin-google-gtag
```

**Configuration**:
```javascript
plugins: [
  [
    '@docusaurus/plugin-google-gtag',
    {
      trackingID: 'G-XXXXXXXXXX',
      anonymizeIP: true,
    },
  ],
],
```

**Why**: Track documentation usage, popular pages, and user behavior (if desired).

---

### 5. 🔗 docusaurus-plugin-remote-content

**Purpose**: Fetch and include content from external sources

```bash
npm install --save docusaurus-plugin-remote-content
```

**Configuration**:
```javascript
plugins: [
  [
    'docusaurus-plugin-remote-content',
    {
      name: 'ocserv-changelog',
      sourceBaseUrl: 'https://gitlab.com/openconnect/ocserv/-/raw/master/',
      outDir: 'docs/ocserv-vanilla/',
      documents: ['CHANGELOG.md'],
    },
  ],
],
```

**Why**: Automatically sync upstream ocserv changelog or other external documentation.

---

### 6. 📈 docusaurus-plugin-matomo (Alternative to Google Analytics)

**Purpose**: Privacy-respecting analytics

```bash
npm install --save docusaurus-plugin-matomo
```

**Configuration**:
```javascript
plugins: [
  [
    'docusaurus-plugin-matomo',
    {
      siteId: '1',
      matomoUrl: 'https://matomo.example.com/',
      siteUrl: 'https://docs.wolfguard.io',
    },
  ],
],
```

**Why**: Privacy-focused alternative to Google Analytics (self-hosted).

---

### 7. 🔄 @docusaurus/plugin-client-redirects

**Purpose**: Handle URL redirects (useful when restructuring docs)

```bash
npm install --save @docusaurus/plugin-client-redirects
```

**Configuration**:
```javascript
plugins: [
  [
    '@docusaurus/plugin-client-redirects',
    {
      redirects: [
        {
          from: '/docs/getting-started/overview',
          to: '/docs/wolfguard/getting-started/overview',
        },
        {
          from: '/docs/protocol',
          to: '/docs/openconnect-protocol/intro',
        },
      ],
    },
  ],
],
```

**Why**: Maintain backward compatibility after documentation restructuring.

---

### 8. 🗺️ @docusaurus/plugin-sitemap

**Purpose**: Generate XML sitemap for search engines

**Status**: Already included in Docusaurus presets (configured)

**Configuration**: See `docusaurus.config.js` under presets > classic > sitemap

**Why**: Improves SEO and search engine indexing.

---

## Not Recommended (Already Have Better Solutions)

### ❌ Mermaid Plugin

**Why Not**: Already using Kroki which supports Mermaid + 19 other diagram types.

### ❌ docusaurus-lunr-search

**Why Not**: Using @cmfcmf/docusaurus-search-local which is more modern and maintained.

---

## Installation Priority

### High Priority (Install Now)

1. ✅ **@cmfcmf/docusaurus-search-local** - Already installed
2. 🖼️ **docusaurus-plugin-image-zoom** - Essential for diagrams
3. 📦 **@docusaurus/plugin-ideal-image** - Performance improvement

### Medium Priority (Consider for v1.1)

4. 📱 **@docusaurus/plugin-pwa** - Offline access
5. 🔗 **docusaurus-plugin-remote-content** - Sync external docs
6. 🔄 **@docusaurus/plugin-client-redirects** - Handle old URLs

### Low Priority (Optional)

7. 📊 **Analytics** - Only if traffic tracking needed
8. 📈 **Matomo** - Privacy-focused alternative

---

## Installation Commands

### High Priority Batch Install

```bash
npm install --save \
  docusaurus-plugin-image-zoom \
  @docusaurus/plugin-ideal-image
```

### Medium Priority Batch Install

```bash
npm install --save \
  @docusaurus/plugin-pwa \
  docusaurus-plugin-remote-content \
  @docusaurus/plugin-client-redirects
```

---

## Testing Plugins

After installing plugins:

```bash
# Test local development
npm start

# Test production build
npm run build
npm run serve

# Check bundle size
npm run build -- --bundle-analyzer
```

---

## Plugin Resources

- **Official Plugins**: https://docusaurus.io/docs/api/plugins
- **Community Directory**: https://docusaurus.community/plugindirectory/
- **Awesome Docusaurus**: https://github.com/webbertakken/awesome-docusaurus
- **Microsoft Plugins**: https://microsoft.github.io/docusaurus-plugins/

---

**Last Updated**: 2025-10-29
**Docusaurus Version**: 3.5.2
