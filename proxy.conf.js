const PROXY_SERVER_URL = '/xm-api';
const PROXY_SERVER_URL_REG = `^${PROXY_SERVER_URL}`;

const PROXY_CONFIG = [
    {
        context: [PROXY_SERVER_URL],
        pathRewrite: {
            [PROXY_SERVER_URL_REG]: '',
        },
        //target: "http://xm.test.xm-online.com.ua",
        //target: 'http://pef-dev.itsf.dc',
        //target: 'http://mw-dev-dua.itsf.dc',
        //target: 'http://vm-mw-int-master1.dc:30000',
        //target: 'https://neqsolsmart.com/',
        //target: 'https://dspmwtst.vodafone.ua/',
        //target: 'http://mw-dev-m2m.itsf.dc/',
        //target: 'https://dspmw.vodafone.ua/',
        target: 'https://dspmwtst.vodafone.ua/',
        //target: 'https://dspmw.vodafone.ua/',
        //target: 'http://mw-int.itsf.dc/',
        //target: 'http://ang14-mw-dev-dua.itsf.dc/',
        secure: false,
        changeOrigin: true,
        logLevel: "debug"
    }
];

module.exports = PROXY_CONFIG;
