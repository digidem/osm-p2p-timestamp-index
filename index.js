var indexer = require('hyperlog-index')
var sub = require('subleveldown')

module.exports = Indexer

function Indexer (osmdb) {
  if (!(this instanceof Indexer)) return new Indexer(osmdb)

  var db = sub(osmdb.db, 'ts')
  var dex = indexer({
    log: osmdb.log,
    db: sub(osmdb.db, 'tsi'),
    map: function (row, next) {
      // Skip entries with no timestamp
      if (!row.value || !row.value.v || !row.value.v.timestamp) {
        return next()
      }

      var timestamp = row.value.v.timestamp
      var version = row.key
      db.put(timestamp, version, next)
    }
  })

  this.dex = dex
  this.db = db
}

Indexer.prototype.ready = function (done) {
  this.dex.ready(done)
}

Indexer.prototype.getDocumentStream = function (opts) {
  return this.db.createValueStream(opts)
}
