import * as pull from 'pull-stream'
import through from '@jacobbubu/pull-through'
import * as fs from 'fs'
import * as path from 'path'
import osenv = require('osenv')
import writeFile from '../src'

jest.resetModules()

describe('basic', () => {
  it('write to file', (done) => {
    const file = path.join(osenv.tmpdir(), 'pull-write-file_test.' + Date.now())
    pull(
      pull.values([1, 2, 3, 4]),
      writeFile(file, {}, (err) => {
        expect(err).toBeFalsy()
        const readBack = fs.readFileSync(file)
        expect(readBack.toString()).toBe('1234')
        fs.unlinkSync(file)
        done()
      })
    )
  })

  it('omit option', (done) => {
    const file = path.join(osenv.tmpdir(), 'pull-write-file_test.' + Date.now())
    pull(
      pull.values([1, 2, 3, 4]),
      writeFile(file, (err) => {
        expect(err).toBeFalsy()
        const readBack = fs.readFileSync(file)
        expect(readBack.toString()).toBe('1234')
        fs.unlinkSync(file)
        done()
      })
    )
  })

  it('with exception', (done) => {
    const file = path.join(osenv.tmpdir(), 'pull-write-file_test.' + Date.now())
    pull(
      pull.values([1, 2, 3, 4]),
      through(function (data: number) {
        if (data <= 2) {
          this.queue(data)
        } else {
          this.emit('error', new Error('ERROR'))
        }
      }),
      writeFile(file, (err) => {
        expect(err).toBeTruthy()
        expect((err as Error).message).toBe('ERROR')
        const readBack = fs.readFileSync(file)
        expect(readBack.toString()).toBe('12')
        fs.unlinkSync(file)
        done()
      })
    )
  })
})
