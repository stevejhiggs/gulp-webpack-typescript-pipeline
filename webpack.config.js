'use strict';

const path = require('path');

module.exports = (options) => {
  const babelConfig =  {
    presets: [
      [require.resolve('babel-preset-es2015'), { loose: true, modules: false }],
      require.resolve('babel-preset-react'),
      require.resolve('babel-preset-stage-3')
    ]
  };

  const config = {
    cache: true,
    resolve: {
      modules: [
        'node_modules',
        path.join(__dirname, 'node_modules')
      ],
      extensions: ['.js', '.ts', '.jsx', '.tsx']
    },
    entry: options.entryPoints,
    output: {
      path: path.join(options.outputDir),
      filename: '[name].js'
    },
    module: {
      loaders: [
        {
          test: /\.ts(x?)$/,
          exclude: /node_modules/,
          enforce: 'pre',
          loader: require.resolve('tslint-loader'),
          query: {
            configFile: path.join(__dirname, 'tslint.json'),
            formatter: 'stylish'
          }
        },
        {
          test: /\.ts(x?)$/,
          exclude: /node_modules/,
          loaders:[
            require.resolve('babel-loader') + '?' + JSON.stringify(babelConfig),
            require.resolve('ts-loader'),
          ] 
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

  return config;
};
