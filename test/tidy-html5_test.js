'use strict'

const fs = require('fs')

function readPage (path) {
  const content = fs.readFileSync('test/' + path + '.html', 'utf-8')
  return content.replace(/\r|\n/g, '')
}

function readPages (name) {
  return {
    expected: readPage('expected/' + name),
    work: readPage('work/' + name)
  }
}

exports['tidy-html5'] = {
  incomplete: function (test) {
    const pages = readPages('incomplete')
    test.expect(1)
    test.equal(pages.expected, pages.work, 'incomplete.html')
    test.done()
  },

  minimal: function (test) {
    const pages = readPages('minimal')
    test.expect(1)
    test.equal(pages.expected, pages.work, 'minimal.html')
    test.done()
  }
}
