const { composePlugins, withNx } = require('@nx/webpack');
const { IgnorePlugin, SourceMapDevToolPlugin } = require('webpack');

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
    new IgnorePlugin({
      checkResource(resource) {
        const lazyImports = [
        ];

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

  config.optimization = {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  };
  return config;
});
