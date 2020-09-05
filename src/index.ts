import * as fs from 'fs'
import * as pull from 'pull-stream'

function isTypedArray(data: any) {
  return !!data && data.byteLength !== undefined
}

export interface FileWriteOptions {
  flags?: string
  encoding?: string
  fd?: number
  mode?: number
}

export type CallbackType = (err?: pull.EndOrError) => void
export default function <T>(
  path: string,
  opts?: FileWriteOptions | CallbackType,
  cb?: CallbackType
): pull.Sink<T> {
  let _opts: FileWriteOptions | null

  // tslint:disable-next-line strict-type-predicates
  if ('function' === typeof opts) {
    cb = opts
    _opts = null
  } else {
    _opts = opts ?? null
  }

  const flags = (_opts && _opts.flags) || 'w'
  const mode = (_opts && _opts.mode) || 0o666
  let pos = 0
  return function (read) {
    fs.open(path, flags, mode, function (err, fd) {
      if (err) return read(err, () => cb && cb())

      read(null, function next(end, data) {
        if (end === true) {
          fs.close(fd, () => cb && cb())
        } else if (end) {
          fs.close(fd, () => cb && cb(end))
        }
        // error!
        else {
          let _data
          if (!isTypedArray(data)) {
            _data = Buffer.from((data as any).toString()) // convert strings to buffers
          } else {
            _data = (data as any) as NodeJS.TypedArray
          }
          fs.write(fd, _data, 0, _data.length, pos, function (err, bytes) {
            if (err) {
              read(err, function () {
                fs.close(fd, () => cb && cb())
              })
            } else {
              pos += bytes
              read(null, next)
            }
          })
        }
      })
    })
  }
}
