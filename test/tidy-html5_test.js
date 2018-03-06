'use strict'

const fs = require('fs')

function readFile (path) {
  const content = fs.readFileSync('test/' + path, 'utf-8')
  return content.replace(/\r|\n/g, '')
}

function readFiles (name) {
  return {
    expected: readFile('expected/' + name),
    work: readFile('work/' + name)
  }
}

exports['tidy-html5'] = {
  incomplete: function (test) {
    const pages = readFiles('incomplete.html')
    const reports = readFiles('incomplete.json')
    test.expect(2)
    test.equal(pages.expected, pages.work, 'incomplete.html')
    test.equal(reports.expected, reports.work, 'incomplete.json')
    test.done()
  },

  minimal: function (test) {
    const pages = readFiles('minimal.html')
    test.expect(1)
    test.equal(pages.expected, pages.work, 'minimal.html')
    test.done()
  }
}
