var test = require('tape')
var osmP2pTimestampIndex = require('../')
var OsmP2p = require('osm-p2p')
var concat = require('concat-stream')
var tmpdir = require('os').tmpdir
var rimraf = require('rimraf')
var path = require('path')

test('3 docs', function (t) {
  t.plan(4)

  var dbPath = path.join(tmpdir(), 'osm-temp-' + Date.now())
  var osmdb = OsmP2p(dbPath)
  var index = osmP2pTimestampIndex(osmdb)

  var pending = 3
  osmdb.put('foo', { type: 'node', lon: 0, lat: 0, timestamp: 100 }, onWritten)
  osmdb.put('bar', { type: 'node', lon: 1, lat: 1, timestamp: 200 }, onWritten)
  osmdb.put('baz', { type: 'node', lon: 2, lat: 2, timestamp: 150 }, onWritten)

  function onWritten (err, doc) {
    t.error(err)
    if (--pending !== 0) return

    index.ready(function () {
      index.getDocumentStream().pipe(concat({encoding: 'object'}, onVersions))

      function onVersions (versions) {
        var expected = [
          'ff1b4ece4a654cb325ee5c08454d6265f6e438c2c40ab469c23d20b8518dcc01',
          'bc7379dbd6165b7e83f2e22533123c275c4da59bf64b480454019604bd84c6d7',
          '76a149938bd6ffed649353e16e188b1d352261ab964d244098387e43bb7778d8'
        ]
        t.deepEquals(versions, expected)

        // clean up
        rimraf.sync(dbPath)
      }
    })
  }
})
