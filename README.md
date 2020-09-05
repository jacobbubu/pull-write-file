# @jacobbubu/pull-write-file

[![Build Status](https://github.com/jacobbubu/pull-write-file/workflows/Build%20and%20Release/badge.svg)](https://github.com/jacobbubu/pull-write-file/actions?query=workflow%3A%22Build+and+Release%22)
[![Coverage Status](https://coveralls.io/repos/github/jacobbubu/pull-write-file/badge.svg)](https://coveralls.io/github/jacobbubu/pull-write-file)
[![npm](https://img.shields.io/npm/v/@jacobbubu/pull-write-file.svg)](https://www.npmjs.com/package/@jacobbubu/pull-write-file/)

> A typescript version of [pull-write-file](https://github.com/dominictarr/pull-write-file)

# pull-write-file

pull-stream version of fs.createWriteStream

currently really simple and does not yet support all fs.createWriteStream options yet.

## why rewriting?

* Familiarity with the original author's intent
* Strong type declarations for colleagues to understand and migrate to other programming languages

## Example

``` ts
import * as pull from 'pull-stream'
import * as fs from 'fs'
import * as path from 'path'
import osenv = require('osenv')
import writeFile from '@jacobbubu/pull-write-file'

const file = path.join(osenv.tmpdir(), 'pull-write-file_test.' + Date.now())
pull(
  pull.values([1, 2, 3, 4]),
  writeFile(file, {}, (err) => {
    const readBack = fs.readFileSync(file)
    console.log(readBack.toString()) // '1234'
    fs.unlinkSync(file)
    done()
  })
)
```

## Performance

For large buffers this is currently as fast as node's streams,
but for lots of small buffers it's a little less.
Node uses the fs binding's `writev` to pass many buffers to the kernel simutaniously.

TODO: benchmarks with graphs comparing node streams and pull streams.

## License

MIT
