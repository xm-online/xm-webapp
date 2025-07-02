// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
    const ForceExitReporter = function (baseReporterDecorator) {
        baseReporterDecorator(this);

        this.onRunComplete = function (browsers, results) {
            const exitCode = results.failed ? 1 : 0;
            if (exitCode !== 0) {
                console.log(`\nTests failed. Forcing exit with code ${exitCode}.`);
                process.exit(exitCode);
            } else if (config.singleRun) {
                // Завершаем процесс только если singleRun=true
                console.log(`\nAll tests passed. Forcing exit with code ${exitCode}.`);
                process.exit(exitCode);
            }
        };
        this.onBrowserError = function () {
        };
        this.onBrowserStart = function () {
        };
        this.onBrowserComplete = function () {
        };
        this.specSuccess = function () {
        };
        this.specFailure = function () {
        };
        this.specSkipped = function () {
        };
    };

    ForceExitReporter.$inject = ['baseReporterDecorator'];


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
            {'reporter:force-exit': ['factory', ForceExitReporter]}
        ],
        client: {
            clearContext: false,
        },
        jasmineHtmlReporter: {
            suppressAll: true,
        },
        coverageReporter: {
            dir: require('path').join(__dirname, '/coverage/'),
            subdir: '.',
            reporters: [
                {type: 'lcov'},
            ],
        },
        reporters: ['progress', 'kjhtml', 'force-exit'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['Chrome'],
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
};
