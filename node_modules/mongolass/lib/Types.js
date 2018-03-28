const validator = require('validator')
const toObjectId = require('mongodb').ObjectId

exports.ObjectID = exports.ObjectId = function ObjectId (actual, key, parent) {
  if (!validator.isMongoId(String(actual))) {
    return false
  }
  /* istanbul ignore else */
  if (key != null) {
    parent[key] = toObjectId(actual)
  }
  return true
}
