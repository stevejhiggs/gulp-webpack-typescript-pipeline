# Easy transpiling of typescript back to browser friendly es5

Wraps together:

* webpack
* typescript
* babel
* gulp
* tslint

in one simple to use build pipeline. Your seperate typescript files are downcompiled and bundled together, 
leaving you a nice simple bundle to use in your browser

## setting up

* install node > v4 + npm (note: node v6 is preferred)
* npm init your project in a folder `npm init`
* install global gulp `npm install -g gulp`
* add gulp package `npm install gulp --save-dev`
* add this package `npm install gulp-webpack-typescript-pipeline --save-dev`
* create a file called `gulpfile.js` in your projects root folder
* create a `tsconfig.json` in your projects root folder and fill in your typescript options
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

given a `tsconfig.json` in the project root folder that contains:

```
{
  "compilerOptions": {
    "target": "es5",
    "module": "es6",
    "sourceMap": true
  }
}
```
and a gulp file that contains:

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

## options
```
{
  entryPoints, // required,  an array of bundlename to entrypoint location mappings,
  outputDir, // required,  where the resulting bundles get written,
  tsConfigFile, // optional, full path the tsconfig file for the project, otherwise we will just look in the root
  tsLintFile, // optional, full path to your tslint.json file
  isNodeLibrary // if set to true will output code suitable to be consumed by node rather than the browser
  externals, the packages to not include in the compiled output
}
```

## questions

### but I dont want to use typescript, I want to use normal es6

That's cool, feel free to use [gulp-webpack-es6-pipeline](https://github.com/stevejhiggs/gulp-webpack-es6-pipeline)
to do the same thing for normal es6.

### using custom linting rules

If you don't like the built in linting rules you can override them in one of two ways:

* put a tslint.json file in the root of your project
* set the tsLintFile setting in the options (see options above)

### I don't like the defaults and want to set X

Also fine, feel free to use this as a reference for setting up your own build pipeline.
This project is really for people who want a fast opinionated setup.
