'use strict'

const fs = require('fs')

module.exports = function (grunt) {
  const coverage = process.env.GRUNT_TIDY_HTML5_COVERAGE
  const succeedingTasks = [
    'tidy-html5:empty', 'tidy-html5:missing', 'tidy-html5:minimal'
  ]
  const failingTasks = [
    'tidy-html5:incomplete'
  ]
  const failingWarnings = [
    '1 file processed, 1 failed.'
  ]
  var tasks

  grunt.initConfig({
    standard: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ]
    },

    copy: {
      tests: {
        expand: true,
        cwd: 'test/data',
        src: '**',
        dest: 'test/work/'
      }
    },

    'tidy-html5': {
      options: {
        test: true
      },
      empty: {
        options: {
          ignoreMissing: true
        }
      },
      missing: {
        options: {
          ignoreMissing: true
        },
        src: 'test/work/missing.html'
      },
      incomplete: {
        options: {
          quiet: true
        },
        src: 'test/work/incomplete.html'
      },
      minimal: {
        src: 'test/work/minimal.html'
      }
    },

    'continue:check-warnings': {
      test: {
        warnings: failingWarnings
      }
    },

    nodeunit: {
      tests: ['test/*_test.js'],
      options: {
        reporter: coverage ? 'lcov' : 'verbose',
        reporterOutput: coverage ? 'coverage/tests.lcov' : undefined
      }
    },

    clean: {
      tests: ['test/work'],
      coverage: ['coverage']
    },

    instrument: {
      files: 'tasks/*.js',
      options: {
        lazy: true,
        basePath: 'coverage/'
      }
    },

    storeCoverage: {
      options: {
        dir: 'coverage'
      }
    },

    makeReport: {
      src: 'coverage/coverage.json',
      options: {
        type: 'lcov',
        dir: 'coverage',
        print: 'detail'
      }
    },

    coveralls: {
      tests: {
        src: 'coverage/lcov.info'
      }
    }
  })

  grunt.loadTasks(coverage && fs.existsSync('coverage/tasks')
                  ? 'coverage/tasks' : 'tasks')

  grunt.loadNpmTasks('grunt-continue-ext')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-contrib-nodeunit')
  grunt.loadNpmTasks('grunt-coveralls')
  grunt.loadNpmTasks('grunt-istanbul')
  grunt.loadNpmTasks('grunt-standard')

  tasks = ['copy'].concat(succeedingTasks)
                  .concat(['continue:on'])
                  .concat(failingTasks)
                  .concat(['continue:off', 'continue:check-warnings',
                    'nodeunit'])
  if (coverage) {
    tasks = ['clean', 'instrument'].concat(tasks)
                                   .concat(['storeCoverage', 'makeReport'])
  } else {
    tasks = ['clean:tests'].concat(tasks)
  }
  tasks = ['standard'].concat(tasks)

  grunt.registerTask('default', tasks)
}
