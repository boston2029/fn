const express = require('express');
const helmet = require('helmet');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    frameAncestors: ['trusted.com', 'another-trusted.com'] // replace with the domains you want to allow
  }
}));

const nggUrl = 'https://mathsspot.com';

const proxy = createProxyMiddleware({
  target: nggUrl,
  changeOrigin: true,
  secure: true,
  logLevel: 'debug',
  router: function(req) {
    if (req.headers.host === 'mathsspot.com') {
      req.headers['X-Forwarded-For'] = ''; 
      req.headers['X-Real-IP'] = '';
      req.headers['Via'] = '';
    }
    return nggUrl;
  }
});

app.use('/', proxy);

const port = process.env.PORT || 443;
app.listen(port, () => {
  console.log(`CybriaGG is running on port ${port}`);
});
