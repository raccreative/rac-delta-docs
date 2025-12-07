import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'rac-delta docs',
  tagline: 'open delta patching protocol',
  favicon: 'img/rac-delta-logo.svg',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  url: 'https://raccreative.github.io',
  baseUrl: '/rac-delta-docs/',

  organizationName: 'raccreative',
  projectName: 'rac-delta-docs',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    localeConfigs: {
      en: {
        label: 'English',
      },
      es: {
        label: 'Español',
      },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/rac-delta-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    algolia: {
      appId: 'TODO',
      apiKey: 'TODO',
      indexName: 'TODO',
      contextualSearch: true,
      searchParameters: {},
      searchPagePath: 'search',
    },
    navbar: {
      title: 'RAC-DELTA',
      logo: {
        alt: 'Rac-delta logo',
        src: 'img/rac-delta-logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/raccreative/rac-delta-js',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Intro',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'Partner',
          items: [
            {
              label: 'Raccreative Games',
              href: 'https://raccreativegames.com/en/home',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub NodeJS',
              href: 'https://github.com/raccreative/rac-delta-js',
            },
            {
              label: 'GitHub Rust',
              href: 'https://github.com/raccreative/rac-delta-rs',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} rac-delta protocol. Released under the MIT license. Built with Docusaurus`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.oceanicNext,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
