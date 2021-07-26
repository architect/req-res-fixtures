// Generate a recurring set of headers, with the ability to expand them to include additional headers if needed by the fixture
function makeHeaders (additional) {
  let headers = {
    'accept-encoding': 'gzip',
    cookie: '_idx=abc123DEF456'
  }
  if (additional) headers = Object.assign(headers, additional)
  return { headers }
}

let {
  headers, // Just a regular set of baseline headers
} = makeHeaders()

let arc5 = {
  // get /
  getIndex: {
    body: {},
    path: '/',
    headers,
    method: 'GET',
    httpMethod: 'GET',
    params: {},
    query: {},
    queryStringParameters: {}
  },

  // get /?whats=up
  getWithQueryString: {
    body: {},
    path: '/',
    headers,
    method: 'GET',
    httpMethod: 'GET',
    params: {},
    query: { whats: 'up' },
    queryStringParameters: { whats: 'up' }
  },

  // get /nature/hiking
  getWithParam: {
    body: {},
    path: '/nature/hiking',
    headers,
    method: 'GET',
    httpMethod: 'GET',
    params: { activities: 'hiking' },
    query: {},
    queryStringParameters: {}
  },

  // post /form
  //   accounts for both JSON and form URL-encoded bodies
  post: {
    body: { hi: 'there' },
    path: '/form',
    headers,
    method: 'POST',
    httpMethod: 'POST',
    params: {},
    query: {},
    queryStringParameters: {}
  },

  // post /form
  //   accounts for multipart form data-encoded bodies
  postBinary: {
    body: { base64: 'aGVsbG89dGhlcmU=' },
    path: '/form',
    headers,
    method: 'POST',
    httpMethod: 'POST',
    params: {},
    query: {},
    queryStringParameters: {}
  },

  // put /form
  put: {
    body: { hi: 'there' },
    path: '/form',
    headers,
    method: 'PUT',
    httpMethod: 'PUT',
    params: {},
    query: {},
    queryStringParameters: {}
  },

  // patch /form
  patch: {
    body: { hi: 'there' },
    path: '/form',
    headers,
    method: 'PATCH',
    httpMethod: 'PATCH',
    params: {},
    query: {},
    queryStringParameters: {}
  },

  // delete /form
  delete: {
    body: { hi: 'there' },
    path: '/form',
    headers,
    method: 'DELETE',
    httpMethod: 'DELETE',
    params: {},
    query: {},
    queryStringParameters: {}
  },
}

module.exports = {
  arc5,
}
