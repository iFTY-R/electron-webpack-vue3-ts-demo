const { defineConfig } = require('@vue/cli-service');
const { resolve } = require('path');

const appConfig = {
  appId: 'com.ifty.electron.webpack-vue3',
  appName: 'webpack-vue3',
  appCode: 'webpackvue3',
};

/*
appId
icon
guid
include
 */
module.exports = defineConfig({
  transpileDependencies: true,

  chainWebpack: config => {
    config.module
      .rule('ts')
      .use('ts-loader')
      .loader('ts-loader')
      .tap(options => {
        options.transpileOnly = true;
        options.compilerOptions = {
          ...options.compilerOptions,
          // 设置别名，使得导入模块时可以使用 @ 符号代替 src 目录
          paths: {
            '@/*': ['src/*'],
          },
        };
        return options;
      });
  },

  configureWebpack: {
    resolve: {
      // 设置别名，使得导入模块时可以使用 @ 符号代替 src 目录
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    externals: {
      electron: 'require("electron")',
    },
  },

  pluginOptions: {
    electronBuilder: {
      asar: false,
      nodeIntegration: true,
      // 设置应用主进程的入口
      mainProcessFile: 'src/background.ts',
      // 设置应用渲染进程的入口
      rendererProcessFile: 'src/main.ts',
      customFileProtocol: '../',
      // 打包选项
      builderOptions: {
        // 解决的问题：在安装到电脑后，系统通知无法工作
        appId: appConfig.appId, // 软件id
        productName: appConfig.appName, // 打包后的名称
        // windows系统相关配置
        win: {
          // 应用图标路径（Windows 系统中 icon 需要 256 * 256 的 ico 格式图片）
          icon: './src/assets/login-icon.png',
          target: {
            target: 'nsis',
            // 支持 64 位的 Windows 系统
            arch: ['x64'],
          },
          // eslint-disable-next-line no-template-curly-in-string
          artifactName: '${productName} v${version} ${env.ARCH} ${env.TARGET}.${ext}',
        },
        mac: {
          icon: './src/assets/login-icon.png',
          category: 'public.app-category.productivity',
        },
        linux: {
          maintainer: 'lyswhut <lyswhut@qq.com>',
          // eslint-disable-next-line no-template-curly-in-string
          artifactName: '${productName} v${version} ${env.ARCH}.${ext}',
          icon: './resources/icons',
          category: 'Utility;AudioVideo;Audio;Player;Music;',
          desktop: {
            Name: 'webpack vue3',
            'Name[zh_CN]': 'webpack vue3',
            'Name[zh_TW]': 'webpack vue3',
            Encoding: 'UTF-8',
            MimeType: 'x-scheme-handler/webpackvue3',
            StartupNotify: 'false',
          },
        },
        nsis: {
          // 如果为 false，想要给电脑所有用户安装必须使用管理员权限
          allowElevation: true,
          // 是否一键安装
          oneClick: false,
          // 允许修改安装目录
          allowToChangeInstallationDirectory: true,
          guid: appConfig.appId, // 软件id
          include: './installer.nsh',
        },
      },
    },
  },
});
