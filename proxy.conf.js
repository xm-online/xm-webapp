const PROXY_SERVER_URL = '/xm-api';
const PROXY_SERVER_URL_REG = `^${PROXY_SERVER_URL}`;

const PROXY_CONFIG = [
    {
        context: [PROXY_SERVER_URL],
        pathRewrite: {
            [PROXY_SERVER_URL_REG]: '',
        },
        target: 'https://xm.dev.xm-online.com/',
        secure: false,
        changeOrigin: true,
        logLevel: 'debug',
    },
];

module.exports = PROXY_CONFIG;
