let { brotliCompressSync } = require('zlib')
let b64enc = i => Buffer.from(i).toString('base64')

/**
 * Standard mock response set used in:
 * - [Architect Functions](test/unit/src/http/http-res-fixtures.js)
 * - [Architect Sandbox](test/unit/src/http/http-res-fixtures.js)
 * If you make changes to either, reflect it in the other(s)!
 */

// Content examples
let html = '<span>hi there</span>'
let text = 'hi there'

let arc7 = {
  // Not returning is valid, and returns a 'null' string as JSON (lol)
  noReturn: undefined,

  // ... while this sends back 0 content-length JSON
  emptyReturn: '',

  // Sending back JSON-serializable JS primitives actually coerces strings
  string: 'hi',
  object: { ok: true },
  array: [ 'howdy' ],
  buffer: Buffer.from('hi'),
  number: 42,

  // Implicit JSON returns one no longer work without statuscode + headers
  bodyOnly: {
    body: text
  },
  bodyWithStatus: {
    statusCode: 200,
    body: text
  },

  // Explicit return is the now hotness
  bodyWithStatusAndContentType: {
    statusCode: 200,
    headers: { 'content-type': 'application/json' },
    body: text
  },

  // Any properly base64 encoded response
  encodedWithBinaryType: {
    statusCode: 200,
    body: b64enc('hi there\n'),
    headers: { 'content-type': 'application/pdf' },
    isBase64Encoded: true
  },

  // Any properly compressed response
  encodedWithCompression: {
    statusCode: 200,
    body: brotliCompressSync('hi there\n'),
    headers: {
      'content-type': 'application/pdf',
      'content-encoding': 'br',
    }
  },

  // Set cookies param
  cookies: {
    statusCode: 200,
    cookies: [ 'foo', 'bar' ],
    body: text
  },

  // ... now SSL
  secureCookies: {
    statusCode: 200,
    cookies: [ 'hi=there; Secure', 'hi=there; Secure' ],
    body: text
  },

  // ... now via header
  secureCookieHeader: {
    statusCode: 200,
    headers: { 'set-cookie': 'hi=there; Secure' },
    body: text
  },

  // Invalid (HTTP APIs are comparably very forgiving, so we have to explicitly create an invalid payload)
  invalid: {
    statusCode: 'idk'
  },

  // Compression things
  preferBrCompression: {
    statusCode: 200,
    body: text,
    compression: 'br',
  },
  preferGzipCompression: {
    statusCode: 200,
    body: text,
    compression: 'gzip',
  },
  disableCompression: {
    statusCode: 200,
    body: text,
    compression: false,
  },
}

let arc6 = {
  /**
   * New params introduced with Arc 6+ APG-proxy-Lambda
   */
  // Set body (implicit JSON return)
  body: {
    body: text
  },

  // Set isBase64Encoded (not technically new, but implemented differently)
  isBase64Encoded: {
    body: b64enc('hi there\n'),
    isBase64Encoded: true
  },

  // Should fail in Sandbox, or convert buffer to base64 encoded body with isBase64encoded param in Functions
  buffer: {
    body: Buffer.from('hi there\n'),
  },

  // Improperly formed response: base64 encoded with valid binary content type
  encodedWithBinaryTypeBad: {
    body: b64enc('hi there\n'),
    headers: { 'Content-Type': 'application/pdf' }
  },

  // Properly formed response: base64 encoded with valid binary content type
  encodedWithBinaryTypeGood: {
    body: b64enc('hi there\n'),
    headers: { 'Content-Type': 'application/pdf' },
    isBase64Encoded: true
  },

  // Set cookie via header
  secureCookieHeader: {
    body: html,
    headers: { 'set-cookie': 'hi=there; Secure' }
  },

  // ... now with a multi-value header
  secureCookieMultiValueHeader: {
    body: html,
    multiValueHeaders: {
      'set-cookie': [ 'hi=there; Secure', 'hi=there; Secure' ]
    }
  },

  // Set multiValueHeaders
  multiValueHeaders: {
    headers: { 'Content-Type': 'text/plain', 'Set-Cookie': 'Baz' },
    multiValueHeaders: {
      'Content-Type': [ 'text/plain' ],
      'Set-Cookie': [ 'Foo', 'Bar' ]
    }
  },

  invalidMultiValueHeaders: {
    multiValueHeaders: {
      'Content-Type': 'text/plain',
      'Set-Cookie': {
        'Foo': 'Bar'
      }
    }
  }
}

module.exports = {
  arc7,
  arc6,
}
