# Multer Google Cloud Storage
Multer storage for Google Cloud Storage platform. Heavily inspired by https://github.com/badunk/multer-s3

## Usage
```javascript
const express = require('express')
const multer = require('multer')
const MulterGCS = require('multer-storage')

var app = express()

const upload = multer({
  storage: MulterGCS({
    projectId: 'google-project-id',
    bucket: 'some-bucket',
    metadata: (req, file, cb) => {
      return cb(null, { contentType: file.mimetype })
    },
    filepath: (req, file, cb) => {
      cb(null, 'myfile.png')
    }
  })
})

app.post('/upload', upload.array('photos', 3), (req, res, next) => {
  return res.send(`Successfully uploaded ${req.files.length} files!`)
})
```
