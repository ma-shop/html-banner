/* eslint-disable no-invalid-this */


const babel = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve')
const cjs = require('rollup-plugin-commonjs')
const alias = require('rollup-plugin-alias')
const uglify = require('rollup-plugin-uglify')
const root = process.cwd()

const toDist = (file) => {
  file.dirname = file.dirname.replace('app', 'dist')
}

module.exports = {
  *default(fly) {
    yield fly
      .clear('dist/**/*')
      .parallel([
        'js',
        'jsVendors',
        'styles',
        'templates',
        'images',
      ])
  },

  *watch(fly) {
    yield fly
      .clear('dist/**/*')
      .parallel([
        'images',
        'jsWatch',
        'stylesWatch',
        'templatesWatch',
      ])
  },

  *clear(fly) {
    yield fly.clear('dist/**/*')
  },

  *js(fly, opts) {
    const globals = {
      jquery: 'jQuery',
      document: 'document',
      $document: '$(document)',
      window: 'window',
      $window: '$(window)',
      $html: '$(document.documentElement)'
    }

    const glob = opts.src && !opts.src.includes('lazyshow') ? opts.src : `${root}/app/*/**/*.js`;

    yield fly.source(glob)
      .rollup({
        rollup: {
          plugins: [
            alias({
              peppermint: 'node_modules/Peppermint/dist/peppermint.js',
            }),
            resolve({
              jsnext: true,
              main: true,
              browser: true,
              preferBuiltins: false,
            }),
            cjs({
              include: 'node_modules/+(iframify|jquery|srcdoc-polyfill)/**/*.js',
            }),
            babel({
              presets: [
                [ 'latest', { es2015: { modules: false } } ],
                'stage-0'
              ],
              plugins: [ 'array-includes' ],
              babelrc: false,
              exclude: 'node_modules/**', // only transpile our source code
            }),
            // uglify(),
          ],
          external: Object.keys(globals)
        },
        bundle: {
          format: 'iife',
          exports: 'none',
          indent: '  ',
          globals,
        },
      })
      .rename(toDist)
      .target('')
  },

  *jsVendors(fly) {
    yield fly.source([
      `${root}/node_modules/jquery/dist/jquery.min.js`,
      `${root}/node_modules/Peppermint/dist/peppermint.min.js`,
    ])
      .target(`${root}/dist/js/vendors`)
  },

  *jsWatch(fly) {
    yield fly
      .parallel([ 'js', 'jsVendors' ])
      .watch(`${root}/app/**/*.js`, 'js')
  },

  *styles(fly, opts) {
    yield fly.source(opts.src || `${root}/app/**/*.scss`)
      .sass({
        outputStyle: 'expanded',
        includePaths: [
          `${root}/app`,
          `${root}/node_modules`,
        ],
        sourceMapEmbed: true,
      })
      .rename(toDist)
      .target('')
  },

  *stylesWatch(fly) {
    yield fly
      .start('styles')
      .watch(`${root}/app/**/*.scss`, 'styles')
  },

  *templates(fly) {
    // this is done in a very weird way but there seems to be a problem with pug because
    // if you try to run this like normal it will fail, but if it's runs seperatly like
    // this it works just fine.
    const files = yield fly.$.expand(`${root}/app/**/!(_)*.pug`)
    for (const file of files) {
      yield fly.source(file)
        .pug({ pretty: true })
        .rename(toDist)
        .target('')
    }
  },

  *templatesWatch(fly) {
    yield fly
      .start('templates')
      .watch(`${root}/app/**/*.pug`, 'templates')
  },

  *images(fly) {
    yield fly.source(`${root}/app/images/**/*`)
      .target(`${root}/dist/images`);
  }
}

