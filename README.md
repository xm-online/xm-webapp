# XM^online 2 - General Single Page Application (xm-webapp)

[![Build Status](https://app.travis-ci.com/xm-online/xm-webapp.svg?branch=main)](https://app.travis-ci.com/xm-online/xm-webapp)

## Prerequisites:
* Git - [https://git-scm.com/downloads](https://git-scm.com/downloads)
* NPM - [https://www.npmjs.com/get-npm](https://www.npmjs.com/get-npm)
* Idea (optional)
  * please check Settings | Editor | Code Style | TypeScript | Spaces | Within | ES6 import/export braces

## How to start
* Checkout code from the repository:
```
git clone https://github.com/xm-online/xm-webapp
cd xm-webapp/
```
* Add extensions (optional):
```
cd src/app/ext/
git clone <repo with extension>
```
* Change API endpoint in the file `proxy.conf.js` (optional):
value for the parameter `target`
* Install all dependencies:
```
npm install
```
* Build i18n resources and register extensions (optional):
```
npm run prebuild
```
* Start web application:
```
npm start
```

## Add ui examples (link - dashboard/ui-docs)
* Command for console:
```
xm-ngx doc --examples
```

## Changelog

[Learn about the latest improvements][changelog].

## Contribution

### Contributing Guidelines

Read through our [contributing guidelines][contributing] to learn about our submission process, coding rules and more.

* [Playbook for Front end developers](https://github.com/xm-online/xm-online/wiki/Playbook-for-Front-end-developers)

[changelog]: CHANGELOG.md
[contributing]: CONTRIBUTING.md