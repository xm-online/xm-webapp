const PROXY_SERVER_URL = '/xm-api';
const PROXY_SERVER_URL_REG = `^${PROXY_SERVER_URL}`;

const PROXY_CONFIG = [
    {
        context: [PROXY_SERVER_URL],
        pathRewrite: {
            [PROXY_SERVER_URL_REG]: '',
        },
        // target: "http://xm.test.xm-online.com.ua",
        target: 'http://172.20.75.176/',
        secure: false,
        changeOrigin: true,
        logLevel: "debug"
    }
];

module.exports = PROXY_CONFIG;
