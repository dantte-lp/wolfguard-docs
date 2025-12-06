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
    // Getting Started - For Simple Users
    // =========================================================================
    {
      type: 'category',
      label: '📘 Getting Started',
      collapsed: false,
      link: {
        type: 'doc',
        id: 'getting-started/index',
      },
      items: [
        'getting-started/what-is-wolfguard',
        'getting-started/quick-start',
        'getting-started/installation',
        'getting-started/first-connection',
        'getting-started/faq',
      ],
    },

    // =========================================================================
    // Administration - For Organization Administrators
    // =========================================================================
    {
      type: 'category',
      label: '🔧 Administration',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'administration/index',
      },
      items: [
        // Placeholder - content to be added
      ],
    },

    // =========================================================================
    // DevOps - For DevOps Engineers
    // =========================================================================
    {
      type: 'category',
      label: '🚀 DevOps',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'devops/index',
      },
      items: [
        // Placeholder - content to be added
      ],
    },

    // =========================================================================
    // Developers - For Developers
    // =========================================================================
    {
      type: 'category',
      label: '💻 Developers',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'developers/index',
      },
      items: [
        {
          type: 'category',
          label: 'Reverse Engineering',
          collapsed: true,
          items: [
            'developers/reverse-engineering-manifest',
            'developers/methodology-comparison',
            'developers/re-implementation-roadmap',
            {
              type: 'category',
              label: 'Tools',
              collapsed: true,
              items: [
                'developers/tools/ida-pro-setup',
                'developers/tools/binary-ninja-assessment',
              ],
            },
            {
              type: 'category',
              label: 'Workflows',
              collapsed: true,
              items: [
                'developers/workflows/batch-analysis',
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'Architecture',
          collapsed: true,
          items: [
            'wolfguard/architecture/modern-vpn-design',
            'wolfguard/architecture/wolfsentry-integration',
          ],
        },
        {
          type: 'category',
          label: 'Implementation',
          collapsed: true,
          items: [
            'wolfguard/implementation/wolfssl',
            'wolfguard/implementation/compatibility',
            'wolfguard/implementation/quick-start',
            'wolfguard/implementation/deployment',
          ],
        },
        {
          type: 'category',
          label: 'Protocol',
          collapsed: true,
          items: [
            'wolfguard/protocol/openconnect-v1.2',
            'wolfguard/protocol/cisco-compatibility',
          ],
        },
      ],
    },

    // =========================================================================
    // Networking - For Network Engineers
    // =========================================================================
    {
      type: 'category',
      label: '🌐 Networking',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'networking/index',
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
    // Reference Documentation
    // =========================================================================
    {
      type: 'category',
      label: '📚 Reference',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'reference/index',
      },
      items: [
        'reference/glossary',
        'reference/command-reference',
        'reference/configuration-reference',
        {
          type: 'category',
          label: 'Cisco Secure Client Analysis',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'cisco-secure-client/index',
          },
          items: [
            'cisco-secure-client/version-comparison',
            {
              type: 'category',
              label: 'Version 5.1 (Latest)',
              collapsed: true,
              link: {
                type: 'doc',
                id: 'cisco-secure-client/5.1/cisco-secure-client-5-1',
              },
              items: [
                'cisco-secure-client/5.1/common-functionality',
                'cisco-secure-client/5.1/platform-linux',
                'cisco-secure-client/5.1/platform-windows',
              ],
            },
            {
              type: 'doc',
              id: 'cisco-secure-client/5.0/cisco-secure-client-5-0',
              label: 'Version 5.0',
            },
            {
              type: 'doc',
              id: 'cisco-secure-client/4.10/cisco-secure-client-4-10',
              label: 'Version 4.10',
            },
            {
              type: 'doc',
              id: 'cisco-secure-client/4.9/cisco-secure-client-4-9',
              label: 'Version 4.9',
            },
          ],
        },
        {
          type: 'category',
          label: 'OpenConnect Protocol',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'openconnect-protocol/intro',
          },
          items: [
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
                'openconnect-protocol/reference/rfc-draft-5.1.12.146-changes',
                'openconnect-protocol/reference/summary',
              ],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // Resources
    // =========================================================================
    {
      type: 'category',
      label: '📖 Resources',
      collapsed: true,
      items: [
        'guides/diagrams',
        {
          type: 'category',
          label: 'Release Notes',
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
    },

    // =========================================================================
    // Migration Guide
    // =========================================================================
    'MIGRATION-GUIDE',
  ],
};

module.exports = sidebars;
