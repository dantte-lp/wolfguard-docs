// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const {themes} = require('prism-react-renderer');
const lightTheme = themes.github;
const darkTheme = themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'WolfGuard Documentation',
  tagline: 'Modern OpenConnect VPN Server - Cisco Secure Client 5.x+ Compatible',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://docs.wolfguard.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: '/',

  // GitHub pages deployment config.
  organizationName: 'dantte-lp',
  projectName: 'wolfguard-docs',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  markdown: {
    mermaid: true,
    format: 'mdx',
    mdx1Compat: {
      comments: true,
      admonitions: true,
      headingIds: true,
    },
  },

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/dantte-lp/wolfguard-docs/edit/main/',
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
          remarkPlugins: [
            // Temporarily disabled Kroki plugin due to MDX compilation issues
            // Will re-enable after debugging build issues
            // [
            //   require('remark-kroki').remarkKroki,
            //   {
            //     server: process.env.KROKI_SERVER_URL || 'http://kroki:8000',
            //     output: 'img-base64',
            //     types: ['plantuml', 'mermaid', 'graphviz', 'dot', 'ditaa', 'blockdiag', 'seqdiag', 'actdiag', 'nwdiag', 'packetdiag', 'rackdiag', 'c4plantuml', 'bpmn', 'excalidraw', 'pikchr', 'structurizr', 'vega', 'vegalite', 'wavedrom', 'erd'],
            //   },
            // ],
          ],
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml',
        },
      }),
    ],
  ],

  plugins: [
    // ═══════════════════════════════════════════════════════════════════
    // Enhanced Local Search - @easyops-cn (Better UI than @cmfcmf)
    // ═══════════════════════════════════════════════════════════════════
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        indexDocs: true,
        indexBlog: false,
        indexPages: true,
        language: ['en'],
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
        searchResultLimits: 8,
        searchBarShortcutHint: true,
        searchBarPosition: 'right',
      },
    ],

    // ═══════════════════════════════════════════════════════════════════
    // Image Optimization & Zoom
    // ═══════════════════════════════════════════════════════════════════
    // Ideal Image - Lazy loading, responsive images
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
    // Image Zoom - Click to zoom images
    'plugin-image-zoom',

    // ═══════════════════════════════════════════════════════════════════
    // PWA Support - Offline capability, installable
    // ═══════════════════════════════════════════════════════════════════
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
            href: '/img/logo.svg',
          },
          {
            tagName: 'link',
            rel: 'manifest',
            href: '/manifest.json',
          },
          {
            tagName: 'meta',
            name: 'theme-color',
            content: '#2e8555',
          },
          {
            tagName: 'meta',
            name: 'apple-mobile-web-app-capable',
            content: 'yes',
          },
          {
            tagName: 'meta',
            name: 'apple-mobile-web-app-status-bar-style',
            content: 'black',
          },
          {
            tagName: 'link',
            rel: 'apple-touch-icon',
            href: '/img/logo.svg',
          },
        ],
      },
    ],

    // ═══════════════════════════════════════════════════════════════════
    // SASS/SCSS Support
    // ═══════════════════════════════════════════════════════════════════
    'docusaurus-plugin-sass',

    // ═══════════════════════════════════════════════════════════════════
    // Privacy-Focused Analytics - Matomo (Self-hosted option)
    // ═══════════════════════════════════════════════════════════════════
    // Uncomment and configure when Matomo is set up
    // [
    //   'docusaurus-plugin-matomo',
    //   {
    //     siteId: '1',
    //     matomoUrl: 'https://analytics.wolfguard.io/',
    //     siteUrl: 'https://docs.wolfguard.io',
    //     matomoPhpScript: 'matomo.php',
    //     matomoJsScript: 'matomo.js',
    //     dev: false, // Enable in development for testing
    //   },
    // ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'WolfGuard Docs',
        logo: {
          alt: 'WolfGuard Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docsSidebar',
            position: 'left',
            label: 'Documentation',
          },
          {
            type: 'dropdown',
            label: 'User Guides',
            position: 'left',
            items: [
              {
                to: '/docs/getting-started/',
                label: '📘 Getting Started',
              },
              {
                to: '/docs/administration/',
                label: '🔧 Administration',
              },
              {
                to: '/docs/devops/',
                label: '🚀 DevOps',
              },
              {
                to: '/docs/developers/',
                label: '💻 Developers',
              },
              {
                to: '/docs/networking/',
                label: '🌐 Network Engineering',
              },
            ],
          },
          {
            type: 'dropdown',
            label: 'Quick Links',
            position: 'left',
            items: [
              {
                to: '/docs/getting-started/quick-start',
                label: 'Quick Start Guide',
              },
              {
                to: '/docs/administration/deployment/server-setup',
                label: 'Server Setup',
              },
              {
                to: '/docs/devops/containers/docker',
                label: 'Docker Deployment',
              },
              {
                to: '/docs/developers/api/rest-api',
                label: 'API Reference',
              },
              {
                to: '/docs/networking/troubleshooting/common-problems',
                label: 'Troubleshooting',
              },
            ],
          },
          {
            type: 'dropdown',
            label: 'Reference',
            position: 'left',
            items: [
              {
                to: '/docs/cisco-secure-client/',
                label: 'Cisco Client Analysis',
              },
              {
                to: '/docs/openconnect-protocol/intro',
                label: 'OpenConnect Protocol',
              },
              {
                to: '/docs/reference/glossary',
                label: 'Glossary',
              },
              {
                to: '/docs/reference/configuration-reference',
                label: 'Configuration Reference',
              },
            ],
          },
          {
            to: '/docs/releases/',
            label: 'Releases',
            position: 'left',
          },
          {
            type: 'search',
            position: 'right',
          },
          {
            href: 'https://github.com/dantte-lp/wolfguard-docs',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'OpenConnect Protocol',
            items: [
              {
                label: 'Protocol Overview',
                to: '/docs/openconnect-protocol/intro',
              },
              {
                label: 'Cryptography',
                to: '/docs/openconnect-protocol/protocol/crypto',
              },
              {
                label: 'Reverse Engineering',
                to: '/docs/openconnect-protocol/analysis/decompilation',
              },
              {
                label: 'RFC Draft',
                to: '/docs/openconnect-protocol/reference/rfc-draft',
              },
            ],
          },
          {
            title: 'Implementations',
            items: [
              {
                label: 'ocserv (Vanilla)',
                to: '/docs/ocserv-vanilla/intro',
              },
              {
                label: 'wolfguard',
                to: '/docs/wolfguard/intro',
              },
              {
                label: 'Quick Start',
                to: '/docs/wolfguard/getting-started/quick-start',
              },
              {
                label: 'Deployment',
                to: '/docs/wolfguard/implementation/deployment',
              },
            ],
          },
          {
            title: 'Resources',
            items: [
              {
                label: 'GitHub - Documentation',
                href: 'https://github.com/dantte-lp/wolfguard-docs',
              },
              {
                label: 'GitHub - WolfGuard Server',
                href: 'https://github.com/dantte-lp/wolfguard',
              },
              {
                label: 'Release Notes',
                to: '/docs/releases/',
              },
              {
                label: 'Contributing',
                href: 'https://github.com/dantte-lp/wolfguard-docs/blob/main/CONTRIBUTING.md',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'OpenConnect Project',
                href: 'https://www.infradead.org/openconnect/',
              },
              {
                label: 'ocserv GitLab',
                href: 'https://gitlab.com/openconnect/ocserv',
              },
              {
                label: 'Security Policy',
                href: 'https://github.com/dantte-lp/wolfguard-docs/blob/main/SECURITY.md',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} WolfGuard Project. Licensed under CC-BY-SA-4.0. Built with Docusaurus.`,
      },
      prism: {
        theme: lightTheme,
        darkTheme: darkTheme,
        additionalLanguages: ['c', 'bash', 'python', 'json', 'yaml', 'makefile', 'diff', 'markup'],
      },
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      docs: {
        sidebar: {
          hideable: true,
          autoCollapseCategories: true,
        },
      },
      // Image zoom configuration
      imageZoom: {
        selector: '.markdown img',
        options: {
          background: 'rgba(0, 0, 0, 0.9)',
          margin: 48,
          scrollOffset: 0,
        },
      },
      // Algolia search can be added later
      // algolia: {
      //   appId: 'YOUR_APP_ID',
      //   apiKey: 'YOUR_API_KEY',
      //   indexName: 'ocproto',
      // },
    }),
};

module.exports = config;
