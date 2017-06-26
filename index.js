var indexer = require('hyperlog-index')
var sub = require('subleveldown')

module.exports = Indexer

function Indexer (osmdb) {
  if (!(this instanceof Indexer)) return new Indexer(osmdb)

  var dex = indexer({
    log: osmdb.log,
    db: sub(osmdb.db, 't'),
    map: function (row, next) {
      db.get(row.value.k, function (err, doc) {
        if (!doc) doc = {}
        row.links.forEach(function (link) {
          delete doc[link]
        })
        doc[row.key] = row.value.v
        db.put(row.value.k, doc, next)
      })
    }
  })

  this.dex = dex
}

Indexer.prototype.ready = function (done) {
  this.dex.ready(done)
}

Indexer.prototype.getDocumentStream = function (opts) {
  return this.dex.db.createValueStream(opts)
}
