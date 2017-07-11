// TODO: implement
function GoogleCloudStorage (opts) {
  switch (typeof opts.bucket) {
    case 'function': this.bucket = opts.bucket; break
    case 'string': this.bucket = staticValue(opts.bucket); break
    case 'undefined': throw new Error('Bucket is required')
    default: throw new TypeError('Expected opts.bucket to be undefined, string or function')
  }
}

function staticValue (value) {
  return function (req, file, cb) {
    cb(null, value)
  }
}

// TODO: implement
GoogleCloudStorage.prototype._handleFile = function (req, file, cb) {

}

// TODO: implement
GoogleCloudStorage.prototype._removeFile = function (req, file, cb) {

}

module.exports = function (opts) {
  return new GoogleCloudStorage(opts)
}
