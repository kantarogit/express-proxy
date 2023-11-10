const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

app.use('/api', (req, res, next) => {
    const target = req.query.target; // get target from query parameters
    if (!target) {
        res.status(400).send('Target not specified');
        return;
    }

    // create and use proxy middleware
    const proxy = createProxyMiddleware({
        target,
        changeOrigin: true,
        pathRewrite: {
            '^/api': '',
        },
        onProxyReq: (proxyReq, req, res) => {
            console.log(`${new Date().toISOString()} - Forwarding ${req.method} request to ${proxyReq.getHeader('Host')}${req.url}`);
            proxyReq.removeHeader('Origin');
        }
    });

    proxy(req, res, next);
});

app.listen(8086, () => {
    console.log('Proxy server running on http://localhost:8086');
});