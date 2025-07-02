// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
module.exports = function (config) {
    config.set({
        execArgv: ['--max_old_space_size=8096'],
        basePath: '',
        frameworks: ['jasmine', '@angular-devkit/build-angular'],
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-jasmine-html-reporter'),
            require('karma-coverage'),
            require('@angular-devkit/build-angular/plugins/karma'),
        ],
        client: {
            clearContext: false, // leave Jasmine Spec Runner output visible in browser
        },
        jasmineHtmlReporter: {
            suppressAll: true, // removes the duplicated traces
        },
        coverageReporter: {
            dir: require('path').join(__dirname, '/coverage/'),
            subdir: '.',
            reporters: [
                {type: 'lcov'},
            ],
        },
        reporters: ['progress', 'kjhtml'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['Chrome'],
        browserDisconnectTimeout: 10000,
        browserDisconnectTolerance: 1,
        browserNoActivityTimeout: 60000,
        customLaunchers: {
            ChromeHeadlessNoSandbox: {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox', '--headless', '--disable-gpu', '--disable-dev-shm-usage', '--hide-scrollbars', '--mute-audio'],
            },
            ChromeWithoutSecurity: {
                base: 'Chrome',
                flags: ['--disable-web-security', '--disable-site-isolation-trials'],
            },
        },
        singleRun: false,
        restartOnFileChange: true,
    });
    config.on('run_complete', async function (browsers, results) {
        console.log('\n-----------------------------------------------------------------');
        console.log('--- run_complete EVENT FIRED! Analyzing why process is still running... ---');
        console.log('-----------------------------------------------------------------');

        try {
            const {default: logWhyIsNodeRunning} = await import('why-is-node-running');
            logWhyIsNodeRunning();
        } catch (err) {
            console.error('Error during diagnostic analysis:', err);
        }
        if (!config.autoWatch) {
            const exitCode = results.failed > 0 ? 1 : 0;
            console.log(`\nForcing exit with code ${exitCode} in 2 seconds.`);
            setTimeout(() => process.exit(exitCode), 2000);
        }
    });
};
