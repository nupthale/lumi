const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

require('dotenv').config();

module.exports = {
  packagerConfig: {
    asar: true,
    icon: 'public/icon',
    // 确保生成的文件名符合 update.electronjs.org 规范
    name: 'Lumi',
    executableName: 'Lumi'
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        format: 'ULFO'
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          name: 'lumi',
          productName: 'Lumi',
          description: 'Lumi - Local-first personal knowledge management system with real-time collaboration',
          version: '1.0.0-alpha.2',
          maintainer: 'Lumi Team',
          homepage: 'https://github.com/nupthale/lumi',
          icon: 'public/icon.png',
          categories: ['Office', 'Productivity']
        }
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        options: {
          name: 'lumi',
          productName: 'Lumi',
          description: 'Lumi - Local-first personal knowledge management system with real-time collaboration',
          version: '1.0.0-alpha.2',
          vendor: 'Lumi Team',
          homepage: 'https://github.com/nupthale/lumi',
          icon: 'public/icon.png',
          categories: ['Office', 'Productivity']
        }
      },
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        authToken: process.env.GITHUB_TOKEN,
        draft: false,
        force: true,
        generateReleaseNotes: true,
        prerelease: false,
        repository: {
          name: 'lumi',
          owner: 'nupthale',
        },
      }
    }
  ]
};
