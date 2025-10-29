/**
 * Creating a sidebar enables you to:
 * - create an ordered group of docs
 * - render a sidebar for each doc of that group
 * - provide next/previous navigation
 *
 * The sidebars can be generated from the filesystem, or explicitly defined here.
 *
 * Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    'intro',

    // =========================================================================
    // OpenConnect Protocol Documentation
    // =========================================================================
    {
      type: 'category',
      label: '📡 OpenConnect Protocol',
      collapsed: false,
      link: {
        type: 'doc',
        id: 'openconnect-protocol/intro',
      },
      items: [
        {
          type: 'category',
          label: 'Protocol Specifications',
          collapsed: true,
          items: [
            'openconnect-protocol/protocol/crypto',
            'openconnect-protocol/protocol/authentication',
            'openconnect-protocol/protocol/certificates',
            'openconnect-protocol/protocol/nvm-telemetry',
          ],
        },
        {
          type: 'category',
          label: 'Reverse Engineering',
          collapsed: true,
          items: [
            'openconnect-protocol/analysis/decompilation',
            'openconnect-protocol/analysis/workflow',
            'openconnect-protocol/analysis/findings',
          ],
        },
        {
          type: 'category',
          label: 'Protocol Reference',
          collapsed: true,
          items: [
            'openconnect-protocol/reference/rfc-draft',
            'openconnect-protocol/reference/version-diff',
            'openconnect-protocol/reference/version-comparison-5.1.2-vs-5.1.12',
            'openconnect-protocol/reference/version-5.1.12-summary',
            'openconnect-protocol/reference/summary',
          ],
        },
      ],
    },

    // =========================================================================
    // ocserv-vanilla (Original OpenConnect Server)
    // =========================================================================
    {
      type: 'category',
      label: '🔧 ocserv (Vanilla)',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'ocserv-vanilla/intro',
      },
      items: [
        {
          type: 'category',
          label: 'Features',
          collapsed: true,
          items: [
            'ocserv-vanilla/features/dpd-timers',
            'ocserv-vanilla/features/dns',
            'ocserv-vanilla/features/ogs',
            'ocserv-vanilla/features/windows',
            'ocserv-vanilla/features/twofactor-auth',
            'ocserv-vanilla/features/dart-module',
          ],
        },
        {
          type: 'category',
          label: 'Integration',
          collapsed: true,
          items: [
            'ocserv-vanilla/integration/radius',
            'ocserv-vanilla/integration/scripts',
          ],
        },
      ],
    },

    // =========================================================================
    // ocserv-modern (Next-Generation Implementation)
    // =========================================================================
    {
      type: 'category',
      label: '🚀 ocserv-modern',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'ocserv-modern/intro',
      },
      items: [
        {
          type: 'category',
          label: 'Getting Started',
          collapsed: false,
          items: [
            'ocserv-modern/getting-started/overview',
            'ocserv-modern/getting-started/quick-start',
          ],
        },
        {
          type: 'category',
          label: 'Architecture',
          collapsed: true,
          items: [
            'ocserv-modern/architecture/modern-vpn-design',
            'ocserv-modern/architecture/wolfsentry-integration',
          ],
        },
        {
          type: 'category',
          label: 'Protocol Implementation',
          collapsed: true,
          items: [
            'ocserv-modern/protocol/openconnect-v1.2',
            'ocserv-modern/protocol/cisco-compatibility',
          ],
        },
        {
          type: 'category',
          label: 'Implementation Guide',
          collapsed: true,
          items: [
            'ocserv-modern/implementation/wolfssl',
            'ocserv-modern/implementation/compatibility',
            'ocserv-modern/implementation/quick-start',
            'ocserv-modern/implementation/deployment',
          ],
        },
      ],
    },

    // =========================================================================
    // Guides & Resources
    // =========================================================================
    {
      type: 'category',
      label: '📖 Guides',
      collapsed: true,
      items: [
        'guides/diagrams',
      ],
    },

    // =========================================================================
    // Release Notes
    // =========================================================================
    {
      type: 'category',
      label: '📋 Release Notes',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'releases/index',
      },
      items: [
        'releases/v1.0.0',
      ],
    },
  ],
};

module.exports = sidebars;
