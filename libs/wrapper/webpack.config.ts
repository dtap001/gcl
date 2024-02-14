import { composePlugins, withNx } from '@nx/webpack';
import { IgnorePlugin, SourceMapDevToolPlugin } from 'webpack';
import * as CopyPlugin from 'copy-webpack-plugin';
// Nx plugins for webpack.
module.exports = composePlugins(withNx(), (config) => {
  // Update the webpack config as needed here.
  // e.g. `config.plugins.push(new MyPlugin())`
  config.plugins ||= [];
  config.plugins.push(
    new SourceMapDevToolPlugin({
      //in projects.json the sourcemap is purposely set to false since it cannot find the sourcemaps by default this is why this plugin is needed
      filename: '[name].js.map',
      exclude: ['vendors.js'],
      moduleFilenameTemplate: '../[namespace]/[resource-path]',
    }),
    new CopyPlugin({
      patterns: [
        { from: 'package.json', to: 'package.json' },
      ],
    }),
    new IgnorePlugin({
      checkResource(resource) {
        const lazyImports = [];

        if (!lazyImports.includes(resource)) {
          return false;
        }
        try {
          require.resolve(resource);
        } catch (err) {
          return true;
        }
        return false;
      },
    })
  );

  // config.optimization = {
  //   splitChunks: {
  //     cacheGroups: {
  //       commons: {
  //         test: /[\\/]node_modules[\\/]/,
  //         name: 'vendors',
  //         chunks: 'all',
  //       },
  //     },
  //   },
  // };
  return config;
});
