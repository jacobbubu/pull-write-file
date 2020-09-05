const fs: any = jest.createMockFromModule('fs')

const actualFs = jest.requireActual('fs')
fs.write = write
fs.open = actualFs.open
fs.close = actualFs.close
fs.unlinkSync = actualFs.unlinkSync
fs.readFileSync = actualFs.readFileSync

function write<TBuffer extends NodeJS.ArrayBufferView>(
  fd: number,
  buffer: TBuffer,
  offset: number | undefined | null,
  length: number | undefined | null,
  position: number | undefined | null,
  callback: (err: NodeJS.ErrnoException | null, written: number, buffer: TBuffer) => void
): void {
  fs._currentWriteCount++
  if (fs._currentWriteCount < fs._failedOnTheNthWrite) {
    actualFs.write(fd, buffer, offset, length, position, callback)
  } else {
    callback(new Error('ERROR'), 0, buffer)
    fs._currentWriteCount = 0
  }
  return
}

fs._failedOnTheNthWrite = Number.POSITIVE_INFINITY
fs._currentWriteCount = 0

module.exports = fs
