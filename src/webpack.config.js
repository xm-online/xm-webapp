const {shareAll, withModuleFederationPlugin} = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({

    name: 'xmWebapp',
    sharedMappings: [
        '@xm-ngx/jhipster',
        '@xm-ngx/google-places-autocomplete',
        '@xm-ngx/styles',
        '@xm-ngx/interfaces',
        '@xm-ngx/exceptions',
        '@xm-ngx/pipes',
        '@xm-ngx/validators',
        '@xm-ngx/operators',
        '@xm-ngx/repositories',
        '@xm-ngx/core',
        '@xm-ngx/dynamic',
        '@xm-ngx/logger',
        '@xm-ngx/translation',
        '@xm-ngx/toaster',
        '@xm-ngx/alert',
        '@xm-ngx/error-messages',
        '@xm-ngx/controllers',
        '@xm-ngx/components',
        '@xm-ngx/json-schema-form',
        '@xm-ngx/shared',
        '@xm-ngx/entity',
        '@xm-ngx/balance',
        '@xm-ngx/timeline',
        '@xm-ngx/account',
        '@xm-ngx/dashboard',
        '@xm-ngx/administration',
        '@xm-ngx/common-webapp-ext',
        '@xm-ngx/common-entity-webapp-ext',
    ],
    shared: {
        ...[
            '@xm-ngx/jhipster',
            '@xm-ngx/google-places-autocomplete',
            '@xm-ngx/interfaces',
            '@xm-ngx/exceptions',
            '@xm-ngx/pipes',
            '@xm-ngx/validators',
            '@xm-ngx/operators',
            '@xm-ngx/repositories',
            '@xm-ngx/core',
            '@xm-ngx/dynamic',
        ].map(i => ({[i]: {singleton: true, strictVersion: true, requiredVersion: '1.0.0'}}))
            .reduce((acc, obj) => ({...acc, ...obj}), {})
        ,
        ...shareAll({singleton: true, strictVersion: true, requiredVersion: 'auto'}),
    },

});
