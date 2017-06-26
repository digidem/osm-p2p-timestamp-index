# osm-p2p-timestamp-index

> Maintain an index of OSM documents' creation time.

background details relevant to understanding what this module does

## Usage

```js
var osmP2pTimestampIndex = require('osm-p2p-timestamp-index')
var OsmP2p = require('osm-p2p')

var osmdb = OsmP2p('/tmp/my-db')
var index = osmP2pTimestampIndex(osmdb)

var stream = index.getDocumentStream({
  lt: new Date().getTime(),
  gt: new Date().getTime() - 1000 * 60 * 60 * 10  // 10 hours ago
})
```

outputs

```
hello warld
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

