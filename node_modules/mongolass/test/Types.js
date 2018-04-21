const MONGODB = process.env.MONGODB || 'mongodb://localhost:27017/test'

const assert = require('assert')
const Mongolass = require('..')
const Schema = Mongolass.Schema
const Types = Mongolass.Types
const mongolass = new Mongolass(MONGODB)

const UserSchema = new Schema('User', {
  uid: { type: Types.ObjectId }
})
const User = mongolass.model('User', UserSchema)

describe('Types.js', function () {
  beforeEach(function * () {
    yield User.insertOne({ uid: '111111111111111111111111' })
  })

  afterEach(function * () {
    yield User.deleteMany()
  })

  after(function * () {
    yield mongolass.disconnect()
  })

  it('ObjectId is invalid', function * () {
    let error
    try {
      yield User.insertOne({ uid: '123' })
    } catch (e) {
      error = e
    }
    assert.deepEqual(error.message, '($.uid: "123") ✖ (type: ObjectId)')
  })

  it('ObjectId wrong', function * () {
    let error
    try {
      yield User.insertOne({ uid: 'haha' })
    } catch (e) {
      error = e
    }
    assert.deepEqual(error.message, '($.uid: "haha") ✖ (type: ObjectId)')
  })

  it('ObjectId', function * () {
    let user = yield User.findOne({ uid: '111111111111111111111111' })
    assert.ok(typeof user._id === 'object')
    assert.deepEqual(user.uid.toString(), '111111111111111111111111')
  })
})
