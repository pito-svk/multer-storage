var storage = require('@google-cloud/storage')
var parallel = require('run-parallel')

function staticValue (value) {
  return function (req, file, cb) {
    cb(null, value)
  }
}

var defaultAcl = staticValue('private')
var defaultContentType = staticValue('application/octet-stream')

function collect (storage, req, file, cb) {
  parallel([
    storage.bucket.bind(storage, req, file),
    storage.acl.bind(storage, req, file)
  ], function (err, values) {
    if (err) return cb(err)

    storage.contentType(req, file, function (err, contentType, replacementStream) {
      if (err) return cb(err)

      cb.call(storage, null, {
        bucket: values[0],
        acl: values[1]
      })
    })
  })
}

// TODO: implement
function GoogleCloudStorage (opts) {
  switch (typeof opts.projectId) {
    case 'function': this.projectId = opts.projectId; break
    case 'string': this.projectId = staticValue(opts.projectId); break
    default: throw new TypeError('Expected opts.projectId to be string or function')
  }

  switch (typeof opts.bucket) {
    case 'function': this.bucket = opts.bucket; break
    case 'string': this.bucket = staticValue(opts.bucket); break
    case 'undefined': throw new Error('Bucket is required')
    default: throw new TypeError('Expected opts.bucket to be undefined, string or function')
  }

  switch (typeof opts.acl) {
    case 'function': this.acl = opts.acl; break
    case 'string': this.acl = staticValue(opts.acl); break
    case 'undefined': this.acl = defaultAcl; break
    default: throw new TypeError('Expected opts.acl to be undefined, string or function')
  }

  switch (typeof opts.contentType) {
    case 'function': this.contentType = opts.contentType; break
    case 'string': this.contentType = staticValue(opts.contentType); break
    case 'undefined': this.contentType = defaultContentType; break
    default: throw new TypeError('Expected opts.contentType to be undefined, string or function')
  }
}

// TODO: implement
GoogleCloudStorage.prototype._handleFile = function (req, file, cb) {
  collect(this, req, file, function (err, opts) {
    if (err) return cb(err)

    var params = {
      projectId: opts.projectId,
      keyFilename: opts.keyFilename
    }

    var gcs = storage(params)

    var bucket = gcs.bucket(opts.bucket)

    // bucket.upload()
  })
}

// TODO: implement
GoogleCloudStorage.prototype._removeFile = function (req, file, cb) {
}

module.exports = function (opts) {
  return new GoogleCloudStorage(opts)
}
