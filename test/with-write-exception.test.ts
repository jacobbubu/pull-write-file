import * as pull from 'pull-stream'
import * as fs from 'fs'
import * as path from 'path'
import osenv = require('osenv')
import writeFile from '../src'

jest.mock('fs')

describe('with-write-exception', () => {
  it('write to file', (done) => {
    ;(fs as any)._failedOnTheNthWrite = 2
    const file = path.join(osenv.tmpdir(), 'pull-write-file_test.' + Date.now())
    pull(
      pull.values([1, 2, 3, 4]),
      writeFile(file, {}, (err) => {
        expect(err).toBeFalsy()
        const readBack = fs.readFileSync(file)
        expect(readBack.toString()).toBe('1')
        fs.unlinkSync(file)
        done()
      })
    )
  })
})
