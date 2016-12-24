'use strict';

const gutil = require('gulp-util');
const webpack = require('webpack');
const config = require('./webpack.config');
const releaseConfig = require('./webpack.config.release');

const handleWebpackOutput = (err, stats) => {
  if (err) throw new gutil.PluginError('tsPipeline', err);
  gutil.log('[tsPipeline]', stats.toString({
    colors: true,
    chunks: false
  }));
};

const getDevCompiler = (options) => {
  return webpack(config(options));
};

const getReleaseCompiler = (options) => {
  return webpack(releaseConfig(options));
};

const registerBuildGulpTasks = (gulp, options) => {
  gulp.task('tsPipeline:build:dev', (done) => {
    const compiler = getDevCompiler(options);
    compiler.run((err, stats) => {
      handleWebpackOutput(err, stats);
      done();
    });
  });

  gulp.task('tsPipeline:build:release', (done) => {
    const compiler = getReleaseCompiler(options);
    compiler.run((err, stats) => {
      handleWebpackOutput(err, stats);
      done();
    });
  });

  gulp.task('tsPipeline:watch', [], () => {
    const compiler = getDevCompiler(options);
    compiler.watch({
      aggregateTimeout: 300, // wait so long for more changes
      poll: 2000 // windows needs polling to pick up changes :(
    }, (err, stats) => {
      handleWebpackOutput(err, stats);
    });
  });
};

module.exports = {
  registerBuildGulpTasks: registerBuildGulpTasks,
  getDevCompiler: getDevCompiler,
  getReleaseCompiler: getReleaseCompiler
};
