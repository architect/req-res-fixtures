/* eslint-disable global-require */
module.exports = {
  http: {
    req: require('./fixtures/http/req'),
    res: require('./fixtures/http/res'),
    legacy: {
      req: require('./fixtures/http/legacy/req'),
      res: require('./fixtures/http/legacy/res'),
    }
  },
  ws: {
    req: require('./fixtures/ws/req'),
  }
}
