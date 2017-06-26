# osm-p2p-timestamp-index

> Maintain a queryable index of OSM documents' creation time.

## Usage

```js
var osmP2pTimestampIndex = require('osm-p2p-timestamp-index')
var OsmP2p = require('osm-p2p')

var osmdb = OsmP2p('/tmp/my-db')
var index = osmP2pTimestampIndex(osmdb)

var pending = 3
osmdb.put('foo', { type: 'node', lon: 0, lat: 0, timestamp: new Date().getTime() }, onWritten)
osmdb.put('bar', { type: 'node', lon: 1, lat: 1, timestamp: new Date().getTime() }, onWritten)
osmdb.put('baz', { type: 'node', lon: 2, lat: 2, timestamp: new Date().getTime() }, onWritten)

function onWritten (err, doc) {
  if (--pending !== 0) return

  index.ready(function () {
    var stream = index.getDocumentStream()
    stream.on('data', console.log)
  })
}
```

outputs the version IDs of the documents:

```
ae4faa3c17ff4e6ee50471bbc629188c45098fa77124382d08e0e4fbd77e5c94
324e841fbe4daf470a148cd1b65a9a91dab7f9255ffbe4000fa298fe63023ff1
664058630b0da6ea9b119e3af1ff9cd98d52d3318a6d79216e7192063a73b610
```

## API

```js
var osmP2pTimestampIndex = require('osm-p2p-timestamp-index')
```

### var index = osmP2pTimestampIndex(osmdb)

Accepts an `osm-p2p-db` instance. You can use
[`osm-p2p-db`](https://github.com/digidem/osm-p2p-db) directly, or a helper
module like [`osm-p2p`](https://github.com/digidem/osm-p2p).

### index.ready(done)

Calls the callback function `done` exactly once, when the indexer has finished
indexing all documents in `osmdb`.

### var stream = index.getDocumentStream([opts])

Retrieves OSM documents by timestamp as a `Readable` stream. Valid options for
`opts` are

- `opts.gt, opts.gte`: No documents older than this time. Defaults to `-Infinity`.
- `opts.lt, opts.lte`: No documents newer than this time. Defaults to `Infinity`.
- `opts.limit`: The upper bound on number of documents to be returned.
- `opts.reverse`: If `true`, the oldest documents will be returned first.
  Default is `false` (newest docs first).

The format to use for time depends on what format was used for the documents in
the database. Good formats include e.g. `2017-05-21T16:18:54.436Z` or
milliseconds since [Epoch](https://en.wikipedia.org/wiki/Unix_time).

Errors are emitted to the stream, so remember to listen to `stream.on('error',
function (err) { ... })`.

## Install

With [npm](https://npmjs.org/) installed, run

```
$ npm install osm-p2p-timestamp-index
```

## See Also

- [osm-p2p-db](https://github.com/digidem/osm-p2p-db)

## License

ISC

