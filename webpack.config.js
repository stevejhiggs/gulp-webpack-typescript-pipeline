'use strict';

const path = require('path');
var fs = require('fs');

const findTslintFile = (options) => {
  if (options.tslintFile) {
    if (fs.existsSync(options.tslintFile)) {
      console.log(`using custom tslint file at ${options.tslintFile}`);
      return options.tslintFile;
    } 
      
    console.warn(`custom tslint file not found at ${options.tslintFile}`);
  }

  const rootTslint = path.resolve('./tslint.json');
  if (fs.existsSync(rootTslint)) {
    console.log(`using custom tslint file at ${rootTslint}`);
    return rootTslint;
  }
  
  // default internal file
  return path.join(__dirname, 'tslint.json');
};

const findTsconfigFile = (options) => {
  if (options.tsConfigFile) {
    if (fs.existsSync(options.tsConfigFile)) {
      console.log(`using tsconfig file at ${options.tsConfigFile}`);
      return options.tsConfigFile;
    }

    console.warn(`tsconfig file not found at ${options.tsConfigFile}`);
  }

  // check for config at the same level as root
  const rootEntryPoint = path.resolve('./tsconfig.json');
  if (fs.existsSync(rootEntryPoint)) {
    console.log(`using tsconfig file at ${rootEntryPoint}`);
    return rootEntryPoint;
  }
};

module.exports = (options) => {
  const lintingOptions = {
    formatter: 'stylish',
    configFile: findTslintFile(options)
  };
  
  const tsConfigFile = findTsconfigFile(options);
  if (tsConfigFile) {
    lintingOptions.tsConfigFile = tsConfigFile;
  }

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
          query: lintingOptions
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
    config.output.libraryTarget = "commonjs2"
  }

  if (options.externals) {
    config.externals = options.externals;
  }

  return config;
};
