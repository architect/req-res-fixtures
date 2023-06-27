let b64enc = i => new Buffer.from(i).toString('base64')

// Generate a recurring set of headers, with the ability to expand them to include additional headers if needed by the fixture
function makeHeaders (additional, isRESTAPI = false) {
  let agent = isRESTAPI ? 'User-Agent' : 'user-agent'
  let fwdFor = isRESTAPI ? 'X-Forwarded-For' : 'x-forwarded-for'
  let fwdPort = isRESTAPI ? 'X-Forwarded-Port' : 'x-forwarded-port'
  let fwdProto = isRESTAPI ? 'X-Forwarded-Proto' : 'x-forwarded-proto'
  let headers = {
    'accept-encoding': 'deflate',
    cookie: '_idx=abc123DEF456',
    [agent]: 'Some Client 1.0',
    [fwdFor]: '127.0.0.1',
    [fwdPort]: '3333',
    [fwdProto]: 'http',
  }
  if (additional) headers = Object.assign(headers, additional)
  let result = { headers }

  // Arc 6 REST-specific header format
  if (isRESTAPI) {
    let multiValueHeaders = {}
    Object.entries(headers).forEach(([ header, value ]) => {
      multiValueHeaders[header] = [ value ]
    })
    result.multiValueHeaders = multiValueHeaders
  }

  return result
}

// Recurring header cases
// Arc 7+
let { headers } = makeHeaders()
let { headers: headersJsonArc7 } = makeHeaders({ 'content-type': 'application/json' })
let { headers: headersFormUrlArc7 } = makeHeaders({ 'content-type': 'application/x-www-form-urlencoded' })
let { headers: headersFormDataArc7 } = makeHeaders({ 'content-type': 'multipart/form-data' })
let { headers: headersOctetArc7 } = makeHeaders({ 'content-type': 'application/octet-stream' })
// Arc 6
let {
  headers: headersArc6,
  multiValueHeaders: multiValueHeadersArc6,
} = makeHeaders(null, true)
let {
  headers: headersJsonArc6,
  multiValueHeaders: multiValueHeadersJsonArc6,
} = makeHeaders({ 'content-type': 'application/json' }, true)
let {
  headers: headersFormUrlArc6,
  multiValueHeaders: multiValueHeadersFormUrlArc6,
} = makeHeaders({ 'content-type': 'application/x-www-form-urlencoded' }, true)
let {
  headers: headersFormDataArc6,
  multiValueHeaders: multiValueHeadersFormDataArc6,
} = makeHeaders({ 'content-type': 'multipart/form-data' }, true)
let {
  headers: headersOctetArc6,
  multiValueHeaders: multiValueHeadersOctetArc6,
} = makeHeaders({ 'content-type': 'application/octet-stream' }, true)

// Basic obj
let data = { hi: 'there' }

// Arc 7 HTTP
let cookies = [ headers.cookie ]

// Other metadata
let protocol = 'HTTP/1.1'
let sourceIp = '127.0.0.1'
let userAgent = 'Some Client 1.0'
let arc7RequestContextMeta = { protocol, sourceIp, userAgent }
let arc6RequestContextMeta = { protocol, identity: { sourceIp, userAgent } }

/**
 * Standard mock request set used in:
 * - [Architect Functions](test/unit/src/http/http-req-fixtures.js)
 * - [Architect Sandbox](test/unit/src/http/http-req-fixtures.js)
 * If you make changes to either, reflect it in the other(s)!
 */
let arc7 = {
  // get /
  getIndex: {
    version: '2.0',
    routeKey: 'GET /',
    rawPath: '/',
    rawQueryString: '',
    cookies,
    headers,
    requestContext: {
      http: {
        method: 'GET',
        path: '/',
        ...arc7RequestContextMeta,
      },
      routeKey: 'GET /',
    },
    isBase64Encoded: false
  },

  // get /?whats=up
  getWithQueryString: {
    version: '2.0',
    routeKey: 'GET /',
    rawPath: '/',
    rawQueryString: 'whats=up',
    cookies,
    headers,
    queryStringParameters: { whats: 'up' },
    requestContext: {
      http: {
        method: 'GET',
        path: '/',
        ...arc7RequestContextMeta,
      },
      routeKey: 'GET /',
    },
    isBase64Encoded: false
  },

  // get /?whats=up&whats=there
  getWithQueryStringDuplicateKey: {
    version: '2.0',
    routeKey: 'GET /',
    rawPath: '/',
    rawQueryString: 'whats=up&whats=there',
    cookies,
    headers,
    queryStringParameters: { whats: 'up,there' },
    requestContext: {
      http: {
        method: 'GET',
        path: '/',
        ...arc7RequestContextMeta,
      },
      routeKey: 'GET /',
    },
    isBase64Encoded: false
  },

  // get /nature/:activities (/nature/hiking)
  getWithParam: {
    version: '2.0',
    routeKey: 'GET /nature/{activities}',
    rawPath: '/nature/hiking',
    rawQueryString: '',
    cookies,
    headers,
    requestContext: {
      http: {
        method: 'GET',
        path: '/nature/hiking',
        ...arc7RequestContextMeta,
      },
      routeKey: 'GET /nature/{activities}',
    },
    pathParameters: { nature: 'hiking' },
    isBase64Encoded: false
  },

  // get /{proxy+} (/nature/hiking)
  getProxyPlus: {
    version: '2.0',
    routeKey: 'GET /{proxy+}',
    rawPath: '/nature/hiking',
    rawQueryString: '',
    cookies,
    headers,
    requestContext: {
      http: {
        method: 'GET',
        path: '/nature/hiking',
        ...arc7RequestContextMeta,
      },
      routeKey: 'GET /{proxy+}',
    },
    pathParameters: { proxy: 'nature/hiking' },
    isBase64Encoded: false
  },

  // get /$default (/nature/hiking)
  // Deprecated in Arc 8, but possibly added via Macro
  get$default: {
    version: '2.0',
    routeKey: '$default',
    rawPath: '/nature/hiking',
    rawQueryString: '',
    cookies,
    headers,
    requestContext: {
      http: {
        method: 'GET',
        path: '/nature/hiking',
        ...arc7RequestContextMeta,
      },
      routeKey: '$default',
    },
    isBase64Encoded: false
  },

  // get /path/* (/path/hi/there)
  getCatchall: {
    version: '2.0',
    routeKey: 'GET /path/{proxy+}',
    rawPath: '/path/hi/there',
    rawQueryString: '',
    cookies,
    headers,
    requestContext: {
      http: {
        method: 'GET',
        path: '/path/hi/there',
        ...arc7RequestContextMeta,
      },
      routeKey: 'GET /path/{proxy+}'
    },
    pathParameters: { proxy: 'hi/there' },
    isBase64Encoded: false
  },

  // get /:activities/{proxy+} (/nature/hiking/wilderness)
  getWithParamAndCatchall: {
    version: '2.0',
    routeKey: 'GET /{activities}/{proxy+}',
    rawPath: '/nature/hiking/wilderness',
    rawQueryString: '',
    cookies,
    headers,
    requestContext: {
      http: {
        method: 'GET',
        path: '/nature/hiking/wilderness',
        ...arc7RequestContextMeta,
      },
      routeKey: 'GET /{activities}/{proxy+}',
    },
    pathParameters: {
      activities: 'nature',
      proxy: 'hiking/wilderness'
    },
    isBase64Encoded: false
  },

  // get / with brotli
  getWithBrotli: {
    version: '2.0',
    routeKey: 'GET /',
    rawPath: '/',
    rawQueryString: '',
    cookies,
    headers: makeHeaders({ 'accept-encoding': 'gzip, br, deflate' }).headers,
    requestContext: {
      http: {
        method: 'GET',
        path: '/',
        ...arc7RequestContextMeta,
      },
      routeKey: 'GET /',
    },
    isBase64Encoded: false
  },

  // get / with gzip
  getWithGzip: {
    version: '2.0',
    routeKey: 'GET /',
    rawPath: '/',
    rawQueryString: '',
    cookies,
    headers: makeHeaders({ 'accept-encoding': 'gzip, deflate' }).headers,
    requestContext: {
      http: {
        method: 'GET',
        path: '/',
        ...arc7RequestContextMeta,
      },
      routeKey: 'GET /',
    },
    isBase64Encoded: false
  },

  // post /form (JSON)
  postJson: {
    version: '2.0',
    routeKey: 'POST /form',
    rawPath: '/form',
    rawQueryString: '',
    cookies,
    headers: headersJsonArc7,
    requestContext: {
      http: {
        method: 'POST',
        path: '/form',
        ...arc7RequestContextMeta,
      },
      routeKey: 'POST /form',
    },
    body: '{"hi":"there"}',
    isBase64Encoded: false
  },

  // post /form (form URL encoded)
  postFormURL: {
    version: '2.0',
    routeKey: 'POST /form',
    rawPath: '/form',
    rawQueryString: '',
    cookies,
    headers: headersFormUrlArc7,
    requestContext: {
      http: {
        method: 'POST',
        path: '/form',
        ...arc7RequestContextMeta,
      },
      routeKey: 'POST /form',
    },
    body: b64enc('hi=there'),
    isBase64Encoded: true
  },

  // post /form (multipart form data)
  postMultiPartFormData: {
    version: '2.0',
    routeKey: 'POST /form',
    rawPath: '/form',
    rawQueryString: '',
    cookies,
    headers: headersFormDataArc7,
    requestContext: {
      http: {
        method: 'POST',
        path: '/form',
        ...arc7RequestContextMeta,
      },
      routeKey: 'POST /form',
    },
    body: b64enc('hi there'),
    isBase64Encoded: true
  },

  // post /form (octet stream)
  postOctetStream: {
    version: '2.0',
    routeKey: 'POST /form',
    rawPath: '/form',
    rawQueryString: '',
    cookies,
    headers: headersOctetArc7,
    requestContext: {
      http: {
        method: 'POST',
        path: '/form',
        ...arc7RequestContextMeta,
      },
      routeKey: 'POST /form',
    },
    body: b64enc('hi there\n'),
    isBase64Encoded: true
  },

  // put /form (JSON)
  putJson: {
    version: '2.0',
    routeKey: 'PUT /form',
    rawPath: '/form',
    rawQueryString: '',
    cookies,
    headers: headersJsonArc7,
    requestContext: {
      http: {
        method: 'PUT',
        path: '/form',
        ...arc7RequestContextMeta,
      },
      routeKey: 'PUT /form',
    },
    body: '{"hi":"there"}',
    isBase64Encoded: false
  },

  // patch /form (JSON)
  patchJson: {
    version: '2.0',
    routeKey: 'PATCH /form',
    rawPath: '/form',
    rawQueryString: '',
    cookies,
    headers: headersJsonArc7,
    requestContext: {
      http: {
        method: 'PATCH',
        path: '/form',
        ...arc7RequestContextMeta,
      },
      routeKey: 'PATCH /form',
    },
    body: '{"hi":"there"}',
    isBase64Encoded: false
  },

  // delete /form (JSON)
  deleteJson: {
    version: '2.0',
    routeKey: 'DELETE /form',
    rawPath: '/form',
    rawQueryString: '',
    cookies,
    headers: headersJsonArc7,
    requestContext: {
      http: {
        method: 'DELETE',
        path: '/form',
        ...arc7RequestContextMeta,
      },
      routeKey: 'DELETE /form',
    },
    body: '{"hi":"there"}',
    isBase64Encoded: false
  }
}

let arc6 = {
  // get /
  getIndex: {
    resource: '/',
    path: '/',
    httpMethod: 'GET',
    headers: headersArc6,
    multiValueHeaders: multiValueHeadersArc6,
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    body: null,
    isBase64Encoded: false,
    requestContext: {
      httpMethod: 'GET',
      path: '/',
      resourcePath: '/',
      ...arc6RequestContextMeta,
    },
  },

  // get /?whats=up
  getWithQueryString: {
    resource: '/',
    path: '/',
    httpMethod: 'GET',
    headers: headersArc6,
    multiValueHeaders: multiValueHeadersArc6,
    queryStringParameters: { whats: 'up' },
    multiValueQueryStringParameters: { whats: [ 'up' ] },
    pathParameters: null,
    body: null,
    isBase64Encoded: false,
    requestContext: {
      httpMethod: 'GET',
      path: '/',
      resourcePath: '/',
      ...arc6RequestContextMeta,
    },
  },

  // get /?whats=up&whats=there
  getWithQueryStringDuplicateKey: {
    resource: '/',
    path: '/',
    httpMethod: 'GET',
    headers: headersArc6,
    multiValueHeaders: multiValueHeadersArc6,
    queryStringParameters: { whats: 'there' },
    multiValueQueryStringParameters: { whats: [ 'up', 'there' ] },
    pathParameters: null,
    body: null,
    isBase64Encoded: false,
    requestContext: {
      httpMethod: 'GET',
      path: '/',
      resourcePath: '/',
      ...arc6RequestContextMeta,
    },
  },

  // get /nature/hiking
  getWithParam: {
    resource: '/nature/{activities}',
    path: '/nature/hiking',
    httpMethod: 'GET',
    headers: headersArc6,
    multiValueHeaders: multiValueHeadersArc6,
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: { activities: 'hiking' },
    body: null,
    isBase64Encoded: false,
    requestContext: {
      httpMethod: 'GET',
      path: '/nature/hiking',
      resourcePath: '/nature/{activities}',
      ...arc6RequestContextMeta,
    },
  },

  // get /{proxy+}
  getProxyPlus: {
    resource: '/{proxy+}',
    path: '/nature/hiking',
    httpMethod: 'GET',
    headers: headersArc6,
    multiValueHeaders: multiValueHeadersArc6,
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: { proxy: 'nature/hiking' },
    body: null,
    isBase64Encoded: false,
    requestContext: {
      httpMethod: 'GET',
      path: '/nature/hiking',
      resourcePath: '/{proxy+}',
      ...arc6RequestContextMeta,
    },
  },

  // get /path/* (/path/hi/there)
  getCatchall: {
    resource: '/path/{proxy+}',
    path: '/path/hi/there',
    httpMethod: 'GET',
    headers: headersArc6,
    multiValueHeaders: multiValueHeadersArc6,
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: { proxy: 'hi/there' },
    body: null,
    isBase64Encoded: false,
    requestContext: {
      httpMethod: 'GET',
      path: '/path/hi/there',
      resourcePath: '/path/{proxy+}',
      ...arc6RequestContextMeta,
    },
  },

  // get /:activities/{proxy+} (/nature/hiking/wilderness)
  getWithParamAndCatchall: {
    resource: '/{activities}/{proxy+}',
    path: '/nature/hiking/wilderness',
    httpMethod: 'GET',
    headers: headersArc6,
    multiValueHeaders: multiValueHeadersArc6,
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: {
      activities: 'nature',
      proxy: 'hiking/wilderness'
    },
    body: null,
    isBase64Encoded: false,
    requestContext: {
      httpMethod: 'GET',
      path: '/nature/hiking/wilderness',
      resourcePath: '/{activities}/{proxy+}',
      ...arc6RequestContextMeta,
    },
  },

  // post /form (JSON)
  postJson: {
    resource: '/form',
    path: '/form',
    httpMethod: 'POST',
    headers: headersJsonArc6,
    multiValueHeaders: multiValueHeadersJsonArc6,
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    body: b64enc(JSON.stringify(data)),
    isBase64Encoded: true,
    requestContext: {
      httpMethod: 'POST',
      path: '/form',
      resourcePath: '/form',
      ...arc6RequestContextMeta,
    },
  },

  // post /form (form URL encoded)
  postFormURL: {
    resource: '/form',
    path: '/form',
    httpMethod: 'POST',
    headers: headersFormUrlArc6,
    multiValueHeaders: multiValueHeadersFormUrlArc6,
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    body: b64enc('hi=there'),
    isBase64Encoded: true,
    requestContext: {
      httpMethod: 'POST',
      path: '/form',
      resourcePath: '/form',
      ...arc6RequestContextMeta,
    },
  },

  // post /form (multipart form data)
  postMultiPartFormData: {
    resource: '/form',
    path: '/form',
    httpMethod: 'POST',
    headers: headersFormDataArc6,
    multiValueHeaders: multiValueHeadersFormDataArc6,
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    body: b64enc('hi there'), // not a valid multipart form data payload but that's for userland validation
    isBase64Encoded: true,
    requestContext: {
      httpMethod: 'POST',
      path: '/form',
      resourcePath: '/form',
      ...arc6RequestContextMeta,
    },
  },

  // post /form (octet stream)
  postOctetStream: {
    resource: '/form',
    path: '/form',
    httpMethod: 'POST',
    headers: headersOctetArc6,
    multiValueHeaders: multiValueHeadersOctetArc6,
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    body: b64enc('hi there\n'),
    isBase64Encoded: true,
    requestContext: {
      httpMethod: 'POST',
      path: '/form',
      resourcePath: '/form',
      ...arc6RequestContextMeta,
    },
  },

  // put /form (JSON)
  putJson: {
    resource: '/form',
    path: '/form',
    httpMethod: 'PUT',
    headers: headersJsonArc6,
    multiValueHeaders: multiValueHeadersJsonArc6,
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    body: b64enc(JSON.stringify(data)),
    isBase64Encoded: true,
    requestContext: {
      httpMethod: 'PUT',
      path: '/form',
      resourcePath: '/form',
      ...arc6RequestContextMeta,
    },
  },

  // patch /form (JSON)
  patchJson: {
    resource: '/form',
    path: '/form',
    httpMethod: 'PATCH',
    headers: headersJsonArc6,
    multiValueHeaders: multiValueHeadersJsonArc6,
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    body: b64enc(JSON.stringify(data)),
    isBase64Encoded: true,
    requestContext: {
      httpMethod: 'PATCH',
      path: '/form',
      resourcePath: '/form',
      ...arc6RequestContextMeta,
    },
  },

  // delete /form (JSON)
  deleteJson: {
    resource: '/form',
    path: '/form',
    httpMethod: 'DELETE',
    headers: headersJsonArc6,
    multiValueHeaders: multiValueHeadersJsonArc6,
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    body: b64enc(JSON.stringify(data)),
    isBase64Encoded: true,
    requestContext: {
      httpMethod: 'DELETE',
      path: '/form',
      resourcePath: '/form',
      ...arc6RequestContextMeta,
    },
  }
}

module.exports = {
  arc7,
  arc6,
  headers
}
