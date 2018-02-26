# grunt-tidy-html5 [![NPM version](https://badge.fury.io/js/grunt-tidy-html5.png)](http://badge.fury.io/js/grunt-tidy-html5) [![Build Status](https://travis-ci.org/prantlf/grunt-tidy-html5.png)](https://travis-ci.org/prantlf/grunt-tidy-html5) [![Coverage Status](https://coveralls.io/repos/prantlf/grunt-tidy-html5/badge.svg)](https://coveralls.io/r/prantlf/grunt-tidy-html5) [![Dependency Status](https://david-dm.org/prantlf/grunt-tidy-html5.svg)](https://david-dm.org/prantlf/grunt-tidy-html5) [![devDependency Status](https://david-dm.org/prantlf/grunt-tidy-html5/dev-status.svg)](https://david-dm.org/prantlf/grunt-tidy-html5#info=devDependencies) [![devDependency Status](https://david-dm.org/prantlf/grunt-tidy-html5/peer-status.svg)](https://david-dm.org/prantlf/grunt-tidy-html5#info=peerDependencies) [![Greenkeeper badge](https://badges.greenkeeper.io/prantlf/grunt-tidy-html5.svg)](https://greenkeeper.io/) [![Code Climate](https://codeclimate.com/github/prantlf/grunt-tidy-html5/badges/gpa.svg)](https://codeclimate.com/github/prantlf/grunt-tidy-html5) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/989cdb4f326e4340afca43311aa26f49)](https://www.codacy.com/app/prantlf/grunt-tidy-html5?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=prantlf/grunt-tidy-html5&amp;utm_campaign=Badge_Grade) [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

[![NPM Downloads](https://nodei.co/npm/grunt-tidy-html5.png?downloads=true&stars=true)](https://www.npmjs.com/package/grunt-tidy-html5)

This module provides a grunt multi-task for checking and fixing HTML files using [tidy-html5], wrapped for Node.js by [node-libtidy]. See the official [HTML Tidy]
pages for more information.

## Installation

You need [node >= 4][node], [npm] and [grunt >= 1][Grunt] installed
and your project build managed by a [Gruntfile] with the necessary modules
listed in [package.json]. If you haven't used Grunt before, be sure to
check out the [Getting Started] guide, as it explains how to create a
Gruntfile as well as install and use Grunt plugins.

Install the Grunt task:

```shell
$ npm install grunt-tidy-html5 --save-dev
```

## Configuration

Add the `tidy-html5` entry with the HTML Tidy task configuration to the
options of the `grunt.initConfig` method:

```js
grunt.initConfig({
  'tidy-html5': {
    test: {
      src: ['*.html']
    }
  }
});
```

Then, load the plugin:

```javascript
grunt.loadNpmTasks('grunt-tidy-html5');
```

## Build

Call the HTML Tidy task:

```shell
$ grunt tidy-html5
```

or integrate it to your build sequence in `Gruntfile.js`:

```js
grunt.registerTask('default', ['tidy-html5', ...]);
```

## Customizing

Default behaviour of the task can be tweaked by the task options; these
are the defaults:

```js
grunt.initConfig({
  tidy-html5: {
    task: {
      options: {
        force: false,
        ignoreMissing: false,
        tidyOptions: {}
      },
      src: ...
    }
  }
});
```

### Options

#### force
Type: `Boolean`
Default: `false`

Suppresses reporting the failure to Grunt and thus stopping execution
of further tasks, if set to `true`.

#### ignoreMissing
Type: `Boolean`
Default: `false`

If the `src` property does not point to any files, or if it is missing,
the task will make the Grunt run fail. If you set the `ignoreMissing`
option to `true`, Grunt will continue executing other tasks.

#### tidyOptions
Type: `Object`
Default: `{}`

Object passed to the [TidyDoc].[options] property to set [libtidy options].
Any of [all HTML Tidy options] can be used as a property key and its value
as a property value in the object.

### More Usage Examples

```js
'tidy-html5': {
  accessibility: {
    options: {
      tidyOptions: {
        'accessibility-check': 2
      }
    },
    src: ['*.html']
  }
}
```

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding
style. Add unit tests for any new or changed functionality. Lint and test
your code using Grunt.

## Release History

 * 2018-02-26   v0.0.1   Initial release

## License

Copyright (c) 2018 Ferdinand Prantl

Licensed under the MIT license.

[HTML Tidy]: http://www.html-tidy.org/
[tidy-html5]: https://github.com/htacg/tidy-html5
[node-libtidy]: https://github.com/gagern/node-libtidy
[node]: http://nodejs.org
[npm]: http://npmjs.org
[package.json]: https://docs.npmjs.com/files/package.json
[Grunt]: https://gruntjs.com
[Gruntfile]: http://gruntjs.com/sample-gruntfile
[Getting Gtarted]: https://github.com/gruntjs/grunt/wiki/Getting-started
[TidyDoc]: https://github.com/gagern/node-libtidy/blob/master/API.md#TidyDoc
[options]: https://github.com/gagern/node-libtidy/blob/master/API.md#TidyDoc.options
[libtidy options]: https://github.com/gagern/node-libtidy/blob/master/README.md#options
[all HTML Tidy options]: http://api.html-tidy.org/tidy/quickref_5.4.0.html
