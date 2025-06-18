const PROXY_SERVER_URL = '/xm-api';
const PROXY_SERVER_URL_REG = `^${PROXY_SERVER_URL}`;

const TARGET_URL = 'https://xm.dev.xm-online.com/';

const PROXY_CONFIG = [
    {
        context: [PROXY_SERVER_URL],
        pathRewrite: {
            [PROXY_SERVER_URL_REG]: '',
        },
        target: TARGET_URL,
        secure: false,
        changeOrigin: true,
        logLevel: 'debug',
    },
    {
        context: ['/oauth2/authorization/KeycloakLocal'],
        target: TARGET_URL,
        secure: false,
        changeOrigin: true,
        logLevel: 'debug',
    },
];

module.exports = PROXY_CONFIG;
