const {shareAll, withModuleFederationPlugin} = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({

    name: 'exampleWebappExt',

    exposes: {
        './Module': 'src/app/ext/example-webapp-ext/index.ts',
    },

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
