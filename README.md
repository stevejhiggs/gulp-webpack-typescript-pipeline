# Easy transpiling of typescript back to browser friendly es5

Wraps together:

* webpack
* typescript
* babel
* gulp
* tslint

in one simple to use build pipeline. Any js files will also go through the babel -> webpack process, allowing you 
to easily compile down and bundle typescript

## setting up

* install node > v4 + npm (note: node v6 is preferred)
* npm init your project in a folder `npm init`
* install global gulp `npm install -g gulp`
* add gulp package `npm install gulp --save-dev`
* add this package `npm install gulp-webpack-typescript-pipeline --save-dev`
* create a file called `gulpfile.js in your project root`
* create a `tsconfig.json` in your root folder and put in your project settings
* in your gulpfile add the following:

```
const gulp = require('gulp');
const tsPipeline = require('gulp-webpack-typescript-pipeline');

tsPipeline.registerBuildGulpTasks(
  gulp,
  {
    entryPoints: {
      'BUNDLE_NAME': 'PATH_TO_ENTRY_POINT'
    },
    outputDir: 'PATH_TO_BUNDLE_OUTPUT_DIRECTORY'
  }
);

```

Your entrypoints are the first javascript files you want to enter. Webpack will
follow all the imports and requires to build you a final bundle.
Your bundles will be made in the output directory and called [BUNDLE_NAME].

e.g:

given a `tsconfig.json` that looks like:

```
{
  "compilerOptions": {
    "target": "es5",
    "module": "es6",
    "sourceMap": true
  }
}
```
and a gulp file that looks like

```
const gulp = require('gulp');
const tsPipeline = require('gulp-webpack-typescript-pipeline');

tsPipeline.registerBuildGulpTasks(
  gulp,
  {
    entryPoints: {
      'myNiceBundle': __dirname + '/scripts/myentrypoint.js'
    },
    outputDir: __dirname + '/bundles'
  }
);
```

Then running `gulp tsPipeline:build:dev` Will result in a bundle called `myNiceBundle.js` in `/bundles` under the root of your project

## gulp commands

You now have the following commands:

* `gulp tsPipeline:build:dev` - build all the files in dev mode
* `gulp tsPipeline:build:release` - build all the files in minified release mode
* `gulp tsPipeline:watch` - rebuilds whenever a file is changed

## features

* linting (tslint)
* typescript (ts -> es6)
* babel (es6 -> es5)
* webpack (bundling)

and then dump out the bundles.

## questions

### but I dont want to use typescript, I want to use normal es6

That's cool, feel free to use [gulp-webpack-es6-pipeline](https://github.com/stevejhiggs/gulp-webpack-es6-pipeline)
to do the same thing for normal es6.
