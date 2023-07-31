# XM^online 2 - General Single Page Application (xm-webapp)

Status of latest github CI `build-ui` from Main branch<br>
<img src="https://github.com/xm-online/xm-webapp/workflows/build-ui/badge.svg?branch=main"><br>

Status of latest github CI `deploy-ui` from Main branch<br>
<img src="https://github.com/xm-online/xm-webapp/workflows/deploy-ui/badge.svg?branch=main"><br>

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

## Packages

Packages are built with post-install scripts by default.
Packages are not part of the application build. The application uses the built files in the `lib` directory.
When you need to develop packages, add the path resolution to `tsconfig.json`
 in the `paths` block and start the app.

```text
      "@xm-ngx/*": [
        "packages/*",
      ],
```

## Changelog

[Learn about the latest improvements][changelog].

## Contribution

### Contributing Guidelines

Read through our [contributing guidelines][contributing] to learn about our submission process, coding rules and more.

* [Playbook for Front end developers](https://github.com/xm-online/xm-online/wiki/Playbook-for-Front-end-developers)

[changelog]: CHANGELOG.md
[contributing]: CONTRIBUTING.md

## Github Action CI/CD
[Guide to using **Github action** pipelines: test, build and deploy](https://github.com/xm-online/xm-webapp/wiki/Github-Action-CI-CD)
