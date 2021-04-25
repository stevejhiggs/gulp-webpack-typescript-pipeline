const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const nodeExternals = require('webpack-node-externals');

const findEslintFile = (options) => {
  if (options.eslintFile) {
    if (fs.existsSync(options.eslintFile)) {
      console.log(`using custom eslint file at ${options.eslintFile}`);
      return options.eslintFile;
    }

    console.warn(`custom tslint file not found at ${options.eslintFile}`);
  }

  const rootEslint = path.resolve('./.eslintrc.js');
  if (fs.existsSync(rootEslint)) {
    console.log(`using custom eslint file at ${rootEslint}`);
    return rootEslint;
  }

  // default internal file
  return path.join(__dirname, '.eslintrc.js');
};

module.exports = (options) => {
  const config = {
    cache: true,
    mode: 'development',
    resolve: {
      modules: ['node_modules', path.join(__dirname, 'node_modules')],
      extensions: ['.js', '.ts', '.jsx', '.tsx']
    },
    entry: options.entryPoints,
    externals: [],
    output: {
      path: path.join(options.outputDir),
      filename: '[name].js'
    },
    module: {
      rules: [
        {
          test: /\.ts(x?)$/,
          exclude: /node_modules/,
          enforce: 'pre',
          loader: require.resolve('eslint-loader'),
          options: {
            configFile: findEslintFile(options)
          }
        },
        {
          test: /\.ts(x?)$/,
          exclude: /node_modules/,
          loader: require.resolve('ts-loader')
        }
      ]
    },
    plugins: [],
    devtool: 'cheap-source-map',
    performance: {
      maxAssetSize: 1500000,
      maxEntrypointSize: 1500000
    }
  };

  if (options.isNodeLibrary) {
    config.output.libraryTarget = 'commonjs2';
    config.target = 'node';
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env': 'process.env'
      })
    );
  }

  if (options.isNodeLibrary) {
    config.externals.push(nodeExternals());
  }

  if (options.externals) {
    config.externals = config.externals.concat(options.externals);
  }

  return config;
};
