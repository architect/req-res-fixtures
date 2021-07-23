/* eslint-disable global-require */
module.exports = {
  http: {
    req: require('./fixtures/http-req'),
    res: require('./fixtures/http-res'),
  },
  ws: {
    req: require('./fixtures/ws-req'),
  }
}
