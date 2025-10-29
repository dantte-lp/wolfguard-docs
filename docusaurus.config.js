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
            [
              require('remark-kroki').remarkKroki,
              {
                // Kroki server URL (internal docker network)
                server: process.env.KROKI_SERVER_URL || 'http://kroki:8000',
                // Output format (supported: img-base64, object-base64, img-html-base64, inline-svg)
                output: 'inline-svg',
                // Supported diagram types
                types: [
                  'plantuml',
                  'mermaid',
                  'graphviz',
                  'dot',
                  'ditaa',
                  'blockdiag',
                  'seqdiag',
                  'actdiag',
                  'nwdiag',
                  'packetdiag',
                  'rackdiag',
                  'c4plantuml',
                  'bpmn',
                  'excalidraw',
                  'pikchr',
                  'structurizr',
                  'vega',
                  'vegalite',
                  'wavedrom',
                  'erd',
                ],
              },
            ],
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
    // Local search plugin
    [
      require.resolve('@cmfcmf/docusaurus-search-local'),
      {
        indexDocs: true,
        indexBlog: false,
        indexPages: true,
        language: 'en',
        maxSearchResults: 10,
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'OC Protocol Docs',
        logo: {
          alt: 'OpenConnect Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docsSidebar',
            position: 'left',
            label: 'Docs',
          },
          {
            type: 'dropdown',
            label: 'Protocol',
            position: 'left',
            items: [
              {
                to: '/docs/openconnect-protocol/intro',
                label: '📡 OpenConnect Protocol',
              },
              {
                to: '/docs/openconnect-protocol/protocol/crypto',
                label: 'Cryptography',
              },
              {
                to: '/docs/openconnect-protocol/analysis/decompilation',
                label: 'Reverse Engineering',
              },
              {
                to: '/docs/openconnect-protocol/reference/rfc-draft',
                label: 'RFC Draft',
              },
            ],
          },
          {
            type: 'dropdown',
            label: 'Implementations',
            position: 'left',
            items: [
              {
                to: '/docs/ocserv-vanilla/intro',
                label: '🔧 ocserv (Vanilla)',
              },
              {
                to: '/docs/wolfguard/intro',
                label: '🚀 wolfguard',
              },
              {
                to: '/docs/wolfguard/getting-started/quick-start',
                label: 'Quick Start',
              },
            ],
          },
          {
            to: '/docs/guides/diagrams',
            label: 'Guides',
            position: 'left',
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
      // Algolia search can be added later
      // algolia: {
      //   appId: 'YOUR_APP_ID',
      //   apiKey: 'YOUR_API_KEY',
      //   indexName: 'ocproto',
      // },
    }),
};

module.exports = config;
