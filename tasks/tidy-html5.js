// grunt-tidy-html5
// https://github.com/prantlf/grunt-tidy-html5
//
// Copyright (c) 2018 Ferdinand Prantl
// Licensed under the MIT license.
//
// Grunt task for checking and fixing HTML files using tidy-html5

'use strict'

const fs = require('fs')
const chalk = require('chalk')
const libtidy = require('libtidy')

module.exports = function (grunt) {
  grunt.registerMultiTask('tidy-html5', 'Checks and fixes HTML files using tidy-html5.', function () {
    const done = this.async()
    const options = this.options({
      force: false,
      quiet: false,
      ignoreMissing: false,
      tidyOptions: {}
    })
    const force = options.force
    const quiet = options.quiet
    const ignoreMissing = options.ignoreMissing
    const tidyOptions = options.tidyOptions
    const files = this.files
    const warn = force ? grunt.log.warn : grunt.fail.warn
    let processed = 0
    let failed = 0

    if (files.length) {
      if (!ignoreMissing && files.some(function (file) {
        return !file.src.length
      })) {
        warn('No input files found.')
        return done()
      }
    } else {
      if (!ignoreMissing) {
        warn('No input files found.')
      } else {
        grunt.log.ok('0 files processed.')
      }
      return done()
    }

    files.reduce(function (previous, file) {
      return previous.then(function () {
        return file.src.reduce(process, Promise.resolve())
      })
    }, Promise.resolve())
    .then(function () {
      const ok = failed ? force ? grunt.log.warn : grunt.fail.warn
                        : grunt.log.ok
      ok(processed + ' ' + grunt.util.pluralize(processed,
          'file/files') + ' processed, ' + failed + ' failed.')
    }, function (error) {
      grunt.verbose.error(error.stack)
      grunt.log.error(error)
      warn('Processing HTML files failed.')
    })
    .then(done)

    function process (previous, source) {
      return previous.then(function () {
        const document = libtidy.TidyDoc()
        document.options = tidyOptions
        grunt.verbose.writeln('Processing "' + chalk.cyan(source) + '".')
        ++processed
        return new Promise(function (resolve, reject) {
          fs.readFile(source, function (error, buffer) {
            if (error) {
              reject(error)
            } else {
              resolve(buffer)
            }
          })
        })
        .then(function (buffer) {
          return document.parseBuffer(buffer)
        })
        .then(function (result) {
          const errors = result.errlog
          if (errors.length) {
            if (!quiet) {
              grunt.log.write(errors)
            }
            ++failed
          }
        })
      })
    }
  })
}
