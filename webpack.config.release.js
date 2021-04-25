const commonConfig = require('./webpack.config');

module.exports = (options) => {
  const releaseConfig = Object.assign({}, commonConfig(options));
  releaseConfig.devtool = 'source-map';
  releaseConfig.mode = 'production';

  if (options.isNodeLibrary) {
    // dont want to minimise library code
    releaseConfig.optimization = {
      minimize: false
    };
  }

  return releaseConfig;
};
