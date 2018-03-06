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
const mkdirp = require('mkdirp')
const path = require('path')

module.exports = function (grunt) {
  grunt.registerMultiTask('tidy-html5', 'Checks and fixes HTML files using tidy-html5.', function () {
    const done = this.async()
    const options = this.options({
      force: false,
      quiet: false,
      report: '',
      ignoreMissing: false,
      tidyOptions: {}
    })
    const force = options.force
    const quiet = options.quiet
    const report = options.report
    const ignoreMissing = options.ignoreMissing
    const tidyOptions = options.tidyOptions
    const files = this.files
    const warn = force ? grunt.log.warn : grunt.fail.warn
    const reports = []
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
        return file.src.reduce(processFile, Promise.resolve())
      })
    }, Promise.resolve())
    .then(function () {
      const ok = failed ? force ? grunt.log.warn : grunt.fail.warn
                        : grunt.log.ok
      ok(processed + ' ' + grunt.util.pluralize(processed,
          'file/files') + ' processed, ' + failed + ' failed.')
      return writeReport()
    }, function (error) {
      grunt.verbose.error(error.stack)
      grunt.log.error(error)
      warn('Processing HTML files failed.')
    })
    .then(done)

    function processFile (previous, source) {
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
          const messages = result.errlog
          if (messages.length) {
            if (!quiet) {
              grunt.log.write(messages)
            }
            ++failed
          }
          return addReport(source, messages)
        })
      })
    }

    function writeReport () {
      function writeReport () {
        return writeFile(report, JSON.stringify(reports))
      }

      if (report) {
        const directory = path.dirname(report)
        grunt.verbose.writeln('Writing report to "' + chalk.cyan(report) + '".')
        if (directory) {
          return ensureDirectory(directory).then(writeReport)
        }
        return writeReport()
      }
    }

    function addReport (source, messages) {
      if (messages) {
        return readFile(source).then(function (content) {
          reportFile(source, content, messages)
        })
      }
    }

    function reportFile (name, content, messages) {
      const contentLines = content.split(/\r?\n/)
      messages.split(/\r?\n/).forEach(function (line) {
        const message = parseMessage(line)
        const place = contentLines[message.lastLine - 1] || ''
        message.extract = place.substr(message.firstColumn - 1)
        message.hiliteLength = message.hiliteStart = 0
        message.file = name
        reports.push(message)
      })
    }

    function parseMessage (message) {
      const parsed = /^line (\d+) column (\d+) - (\w+):/.exec(message)
      var column
      if (parsed) {
        column = parseInt(parsed[2])
        return parsed && {
          type: parsed[3].toLowerCase(),
          firstColumn: column,
          lastColumn: column,
          lastLine: parseInt(parsed[1]),
          message: message.substr(parsed[0].length + 1)
        }
      }
      return {}
    }

    function ensureDirectory (name) {
      return new Promise(function (resolve, reject) {
        mkdirp(name, function (error) {
          if (error) {
            reject(error)
          } else {
            resolve()
          }
        })
      })
    }

    function writeFile (name, content) {
      return new Promise(function (resolve, reject) {
        fs.writeFile(name, content, function (error) {
          if (error) {
            reject(error)
          } else {
            resolve()
          }
        })
      })
    }

    function readFile (name) {
      return new Promise(function (resolve, reject) {
        fs.readFile(name, 'utf-8', function (error, content) {
          if (error) {
            reject(error)
          } else {
            resolve(content)
          }
        })
      })
    }
  })
}
