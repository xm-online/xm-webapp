## [3.12.7](https://github.com/xm-online/xm-webapp/compare/v3.12.6...v3.12.7) (2023-02-15)


### Features

* **autocomplete-control:** add autocomplete control ([#1569](https://github.com/xm-online/xm-webapp/issues/1569)) ([1345702](https://github.com/xm-online/xm-webapp/commit/13457020dcada5bfc9fb0b699b6d3a860ad95f2f))



## [3.12.6](https://github.com/xm-online/xm-webapp/compare/v3.12.5...v3.12.6) (2023-02-10)


### Features

* **change-detection:** use setInput for cd works ([#1565](https://github.com/xm-online/xm-webapp/issues/1565)) ([d2b6e95](https://github.com/xm-online/xm-webapp/commit/d2b6e95ee3b1c57da14e2f0ea92fcec73098e3aa))



## [3.12.5](https://github.com/xm-online/xm-webapp/compare/v3.12.4...v3.12.5) (2023-02-10)


### Bug Fixes

* **core:** fix rename options to config ([#1566](https://github.com/xm-online/xm-webapp/issues/1566)) ([bb6161d](https://github.com/xm-online/xm-webapp/commit/bb6161df07221aa31c00e5683b37201b398e1f00))



## [3.12.4](https://github.com/xm-online/xm-webapp/compare/v3.12.3...v3.12.4) (2023-02-10)


### Bug Fixes

* add checking months and days ([777a169](https://github.com/xm-online/xm-webapp/commit/777a169e66f6e9263bdfd77157d1aef2991c0d5a))
* **core:** fix imports ([01a9260](https://github.com/xm-online/xm-webapp/commit/01a926094f20f3a550b9e0a0669176d4903dfe75))
* **theme:** add support null theme ([ff50c5c](https://github.com/xm-online/xm-webapp/commit/ff50c5c33fcaab60426578c761b83812875df950))


### Features

* **change-options-config:** change options config ([#1465](https://github.com/xm-online/xm-webapp/issues/1465)) ([9c5252c](https://github.com/xm-online/xm-webapp/commit/9c5252cdb426b18cc0ac01960dc5c2c8d0f741a5))
* **dynamic-loader:** clean dynamic-modules.service.ts cache part when entry is not found ([00d4368](https://github.com/xm-online/xm-webapp/commit/00d43688c1ccefb39e836b7a8e2c0c6df52b691c))
* **dynamic-loader:** create component right sidebar ([2d2e3cf](https://github.com/xm-online/xm-webapp/commit/2d2e3cfa8665c37d394edb2ca0c82ccfa5b15681))
* **dynamic-loader:** dynamic components cache mechanism revision ([cedc87d](https://github.com/xm-online/xm-webapp/commit/cedc87dfcadc20ed545df719503c70f44a2c02b5))
* **dynamic-loader:** injector pass ([57a5cfb](https://github.com/xm-online/xm-webapp/commit/57a5cfbc470f06bfd72dfc82573099a00985a741))
* **dynamic-loader:** move code duplication to the separate function ([0d2673e](https://github.com/xm-online/xm-webapp/commit/0d2673eb0e1d444dc02925e53bdedf0b11aca7b2))
* **dynamic-loader:** move isEntryModule logic to separate method ([1d2e506](https://github.com/xm-online/xm-webapp/commit/1d2e506dd571f044ff84b4286fe7ac29bced577a))
* **dynamic-loader:** move updateCache function to the class level ([3de3c27](https://github.com/xm-online/xm-webapp/commit/3de3c27470f32f2618889e935ddee3f6de50d846))
* **dynamic-loader:** remove excess logic ([27228ef](https://github.com/xm-online/xm-webapp/commit/27228ef1664d028686d4f72bb8597c75eb64979f))
* **dynamic-loader:** remove excess parts of dynamic-modules.service ([a988fe7](https://github.com/xm-online/xm-webapp/commit/a988fe7c68408c54358be9b4f1d92a0c553e5282))
* **dynamic-loader:** remove redundant generic type out of the function ([1eb4f7c](https://github.com/xm-online/xm-webapp/commit/1eb4f7c78aa1da050d83a8255666badb58dd1210))
* **dynamic-loader:** remove unclear isSticky method ([68a5358](https://github.com/xm-online/xm-webapp/commit/68a5358dcd6207732420ece814c98f76214f0540))
* **dynamic-loader:** rename cfr to entry in dynamic-dialog.ts ([5f4c6c7](https://github.com/xm-online/xm-webapp/commit/5f4c6c75c180f53a54995f825af30b62d637c3cb))
* **dynamic-loader:** rename cfr to entry in dynamic-presentation-base ([c25796c](https://github.com/xm-online/xm-webapp/commit/c25796c9bc34f89a8945939891bffd1ecb56c57e))
* **dynamic-loader:** rename dynamic-modules.service method loadAndResolve to find ([d3802c1](https://github.com/xm-online/xm-webapp/commit/d3802c10248fdeaaf608e019b91390de185db617))
* **dynamic-loader:** rename dynamic-modules.service usage prop ([cf718d5](https://github.com/xm-online/xm-webapp/commit/cf718d5cade31082943392ed3aa417f64be6bb82))
* **dynamic-loader:** rename dynamicComponents usage ([7554473](https://github.com/xm-online/xm-webapp/commit/755447327db9c8a8928aabe1b69daf5b9f81aeb4))
* **dynamic-loader:** rename method 'get' to 'find' of dynamic-component-loader.service.ts ([1ecdc2d](https://github.com/xm-online/xm-webapp/commit/1ecdc2d9cf0057e083772225b04a76ceda809a2d))
* **dynamic-loader:** rename method dynamic modules service ([0cc6e3e](https://github.com/xm-online/xm-webapp/commit/0cc6e3e8616c65ecec9b2272364f9901837c79f0))
* **dynamic-loader:** resolve activatedRoute param ([c3e693e](https://github.com/xm-online/xm-webapp/commit/c3e693e030a5c955290bb80c90f7247a42efa615))
* **dynamic-loader:** search xm-ngx component in xm module ([7eaa1e7](https://github.com/xm-online/xm-webapp/commit/7eaa1e7548b80e6fe735c6fe2ee481f297e86b1f))
* **dynamic-loader:** widget-list adaptation ([e2d86a6](https://github.com/xm-online/xm-webapp/commit/e2d86a6720ff29759655d8d14aa70f12bca33c89))
* **dynamic-loader:** wrap component search logic into separate method ([ffe853e](https://github.com/xm-online/xm-webapp/commit/ffe853e03602f09766dd22cb4e6144ebe611e606))
* **dynamic-loader:** wrap deprecated provider solution by separate method ([8e26035](https://github.com/xm-online/xm-webapp/commit/8e26035b0c72431962a621db645c5430e5b79971))
* **fullcalendar:** update v6 ([ceaa06c](https://github.com/xm-online/xm-webapp/commit/ceaa06c1c55166208c00eea5e8de275471f4d449))
* **theme:** enable storage save ([be8e55e](https://github.com/xm-online/xm-webapp/commit/be8e55e2254d335c6abef3f22aea2c4a13dd7705))
* **themes:** add theme switcher ([decf014](https://github.com/xm-online/xm-webapp/commit/decf014e9091d555f982bbd381fe05c8f00897d2))



## [3.11.3](https://github.com/xm-online/xm-webapp/compare/v3.11.2...v3.11.3) (2023-02-06)


### Bug Fixes

* **examples:** fix tests ([83be147](https://github.com/xm-online/xm-webapp/commit/83be147704337ab8c5aa3363c56305337ed7c275))
* **inline-control:** fix autoclose popup ([#1546](https://github.com/xm-online/xm-webapp/issues/1546)) ([0397dca](https://github.com/xm-online/xm-webapp/commit/0397dca13d77ba6ce15b3567a8e1b9caeec1c287))
* **main:** export userService ([b96803c](https://github.com/xm-online/xm-webapp/commit/b96803c4dd17cc669bf167bd57c6d17f8ae619d4))
* **shared:** update imports ([b9b65d6](https://github.com/xm-online/xm-webapp/commit/b9b65d61b9d1f277fd77b922a5b22f6a449b82ba))
* trigger pipeline ([724ba46](https://github.com/xm-online/xm-webapp/commit/724ba46933e2ed5cf9e094485d72c64439c7d3c7))
* **xm-alert-component-to-export:** adding xm-alert-component to export array in xm-alert-module ([201c698](https://github.com/xm-online/xm-webapp/commit/201c698a04d61e02ebac25c875456fbf4ee60a62))


### Features

* add default 413 error interceptor message ([b1741dd](https://github.com/xm-online/xm-webapp/commit/b1741dd75a0ea82645b1c42e913cbc237fe2d80b))



## [3.10.1](https://github.com/xm-online/xm-webapp/compare/v3.10.0...v3.10.1) (2023-01-30)


### Bug Fixes

* labels and placeholders for some jsf custom elements ([dc4dad7](https://github.com/xm-online/xm-webapp/commit/dc4dad75c57fdcbebde68b1a75f0e2cd281da93c))


### Features

* **core:** open brackets, fix circular deps ([4979578](https://github.com/xm-online/xm-webapp/commit/49795787026f18974c849e3ae49023b782864002))
* **inline-control:** add inline edit control ([#1544](https://github.com/xm-online/xm-webapp/issues/1544)) ([6f0e02a](https://github.com/xm-online/xm-webapp/commit/6f0e02a523424bf4ea5d794607d2f0acb7daf394))
* **text-control:** add clear button ([e284b8c](https://github.com/xm-online/xm-webapp/commit/e284b8cd0c2d6944f4f822a584be99320486c241))
* **xm.module:** update path ([51eb4aa](https://github.com/xm-online/xm-webapp/commit/51eb4aafebc482584121b22635b3f1ca803e9083))



## [3.8.4](https://github.com/xm-online/xm-webapp/compare/v3.8.3...v3.8.4) (2023-01-19)


### Bug Fixes

* **phone-component:** add module entry ([#1530](https://github.com/xm-online/xm-webapp/issues/1530)) ([510ae02](https://github.com/xm-online/xm-webapp/commit/510ae02b29a83c0176e8735cb0197da5720ac91b))



## [3.8.2](https://github.com/xm-online/xm-webapp/compare/v3.8.1...v3.8.2) (2023-01-19)


### Features

* **phone-control:** add phone control ([#1529](https://github.com/xm-online/xm-webapp/issues/1529)) ([3f6f5c8](https://github.com/xm-online/xm-webapp/commit/3f6f5c8d081829d433755bab069082a9279c1dfb))



## [3.8.1](https://github.com/xm-online/xm-webapp/compare/v3.8.0...v3.8.1) (2023-01-18)


### Features

* **dashboards:** add sort by order index ([b4541e2](https://github.com/xm-online/xm-webapp/commit/b4541e21c1b868886f543b440f920c01d185a970))
* **http-patch-method:** support patch method ([#1528](https://github.com/xm-online/xm-webapp/issues/1528)) ([93e7ff8](https://github.com/xm-online/xm-webapp/commit/93e7ff8b3ee0c7f69e6ba3f167971f98ec898f7d))



## [3.7.50](https://github.com/xm-online/xm-webapp/compare/v3.7.49...v3.7.50) (2023-01-16)


### Bug Fixes

* **array-select-fix:** update array select ui ([#1524](https://github.com/xm-online/xm-webapp/issues/1524)) ([cac1ab3](https://github.com/xm-online/xm-webapp/commit/cac1ab3a1a8e407ec19d9a337e165fb97b37708e))
* **core:** fix angular editor ([004ed91](https://github.com/xm-online/xm-webapp/commit/004ed91c0ec42080c02521ccdff1c5133c418c32))
* **core:** fix styles ([977a33d](https://github.com/xm-online/xm-webapp/commit/977a33dc510f1dc0c83e87cbed703146bd2bac21))
* **shared:** add empty object to defaults ([7b69e8d](https://github.com/xm-online/xm-webapp/commit/7b69e8dba1ada412987703d45aa8fd4fab6346b4))
* undefined and missing label ([c87a251](https://github.com/xm-online/xm-webapp/commit/c87a251f234ffd97bfadeb11ac7328104d5ebf41))
* value detection conflict ([eb45c32](https://github.com/xm-online/xm-webapp/commit/eb45c32d63e4154a78b6cb87926edba3b6878a12))


### Features

* **async-validators:** support async validators ([bf266b4](https://github.com/xm-online/xm-webapp/commit/bf266b4f7498e32e26f2dc17984113ca762e33fa))
* **class-style-literals:** add log ([c455111](https://github.com/xm-online/xm-webapp/commit/c4551111ee69b7faa2f93359fa9f1f6a2998a762))
* **class-style-literals:** class & style template ([097d618](https://github.com/xm-online/xm-webapp/commit/097d61859d512dec6450a81d4c6ee494236a6dc2))
* **components/number:** add number directive ([374a2fd](https://github.com/xm-online/xm-webapp/commit/374a2fd866e8a447de2dfce4defd7d3c93294bed))
* **components/number:** add number directive ([6251aff](https://github.com/xm-online/xm-webapp/commit/6251aff6c3dbfd843d2516f68997de19541267c6))
* **dashboards:** change to bulk api ([b39ef87](https://github.com/xm-online/xm-webapp/commit/b39ef8739e6e3921d0824cde56758842ff0d9b30))
* **dynamic:** fix path resolving ([5f21099](https://github.com/xm-online/xm-webapp/commit/5f21099dedf7b184326fde807240eabb02644006))
* **packages:** add components log ([2b6b636](https://github.com/xm-online/xm-webapp/commit/2b6b63693b8bfe45afc499399ffc0d6efe932811))
* **xm-date-comtrol:** add date now option ([4c80547](https://github.com/xm-online/xm-webapp/commit/4c80547f1142e5bff3b961cffdbec5bdf0004da9))



## [3.7.31](https://github.com/xm-online/xm-webapp/compare/v3.7.30...v3.7.31) (2022-12-30)


### Bug Fixes

* **xm-date-range-filter-control:** change input placeholder to mat-label ([ac6a2e4](https://github.com/xm-online/xm-webapp/commit/ac6a2e4086f13728456b9c7ba0442f1595d2fd6c))
* **xm-text-control:** on clear all filter fields ([a037441](https://github.com/xm-online/xm-webapp/commit/a0374410062d2ed0b998100ff79e42111b2b8890))


### Features

* **balance:** move xm-balance to packages ([56ce442](https://github.com/xm-online/xm-webapp/commit/56ce442719ec87cc04e9a937c77a923db05cb84a))
* **card:** add scroll, restyle ([0398fa2](https://github.com/xm-online/xm-webapp/commit/0398fa2aae46fee52f3ea576e2674b0f779857a4))
* **entity:** fix imports ([8169b95](https://github.com/xm-online/xm-webapp/commit/8169b95aa4d8e2ad563ecc5c5bda97dd74873b15))
* **entity:** move xm-entity to packages ([ff66482](https://github.com/xm-online/xm-webapp/commit/ff664824cae7e332d7050c98962e370e4164dcc9))
* **text-template:** add text template ([#1501](https://github.com/xm-online/xm-webapp/issues/1501)) ([43aa814](https://github.com/xm-online/xm-webapp/commit/43aa81406f7407f656586b629bddc0a49c63b2ed))
* **timeline:** add show all ([43baf89](https://github.com/xm-online/xm-webapp/commit/43baf89e45cd9c6896f1b1db7aa2262aa3656c00))
* **widget:** add schema view ([7e37c7d](https://github.com/xm-online/xm-webapp/commit/7e37c7d9baeb0ce239b1cf816907a5d44b1f55eb))
* **xm-multi-language:** fix disable state on change ([5baf7f2](https://github.com/xm-online/xm-webapp/commit/5baf7f290ba78cb09060546d8e461735c9815882))



## [3.7.22](https://github.com/xm-online/xm-webapp/compare/v3.7.21...v3.7.22) (2022-12-14)


### Bug Fixes

* **core:** ngx-mask update ([e395540](https://github.com/xm-online/xm-webapp/commit/e3955405d29e8f274eb838df19df5f60c910e9bb))
* **permission:** fix empty value ([aa1ff2a](https://github.com/xm-online/xm-webapp/commit/aa1ff2a9b5c3235fe38618d1ab494131406759f8))
* **permission:** fix lazy pass error ([b2d8fa8](https://github.com/xm-online/xm-webapp/commit/b2d8fa8ccb3048e9c3a185e68dc20e50bcd4d212))
* **permission:** fix lazy pass error ([bef76dc](https://github.com/xm-online/xm-webapp/commit/bef76dc7bbd8bc601e58ac5f41f7835774cfccda))


### Features

* **components:** style numbers-range-control ([21fbf08](https://github.com/xm-online/xm-webapp/commit/21fbf08c604ffbf99c3b899cc245e72fbc576a48))
* **numbers-range-control:** create numbers-range-control ([1e435ce](https://github.com/xm-online/xm-webapp/commit/1e435ceb902630bb6f4702f59a1babad05870a7d))
* **numbers-range-control:** fix lint ([b5a79e6](https://github.com/xm-online/xm-webapp/commit/b5a79e6a86fa8781e3752dc343ba351478df5112))
* save filter query in query params ([d280c8a](https://github.com/xm-online/xm-webapp/commit/d280c8a364b57fb0261f4ec9bec028433dc652ac))
* **tests:** add single run ([8efdd02](https://github.com/xm-online/xm-webapp/commit/8efdd028ddaaf049bc91856638c079ad8fc61bb2))
* **web-app:** add link to doc ([9cfb9e7](https://github.com/xm-online/xm-webapp/commit/9cfb9e7988e9802ed2b1023cb6d8acbd3d353d96))
* **web-app:** add link to doc ([51ec3ac](https://github.com/xm-online/xm-webapp/commit/51ec3ace8b37253f1868a366abac13458f81e052))



## [3.7.15](https://github.com/xm-online/xm-webapp/compare/v3.7.14...v3.7.15) (2022-11-29)


### Bug Fixes

* **upload-file:** add ability to upload 7z format files on windows ([3b3335c](https://github.com/xm-online/xm-webapp/commit/3b3335c11ce76fb340cd52f2766bcc4b8de84a21))


### Features

* add maxLength to input attributes ([ae28bb8](https://github.com/xm-online/xm-webapp/commit/ae28bb8e04f8c005e2f67eb210606af30b5b183f))
* **confirm-dialog:** added translate options to buttons ([e38ec4b](https://github.com/xm-online/xm-webapp/commit/e38ec4bde085794dee933b2c2147f8f822f03e42))
* **idp-callback-possibility-of-simple-redefinition:** adding the possibility of easier redefinition redirect method ([ea9ca11](https://github.com/xm-online/xm-webapp/commit/ea9ca11f9065e7cf944d28e3e3a90c846f0cb8d4))



## [3.7.10](https://github.com/xm-online/xm-webapp/compare/v3.7.9...v3.7.10) (2022-11-02)


### Features

* **link-button-use-config:** link button use config ([#1464](https://github.com/xm-online/xm-webapp/issues/1464)) ([fe9b0e0](https://github.com/xm-online/xm-webapp/commit/fe9b0e05f5f1fcd8e627b2330a2e66ca1256be9c))



## [3.7.9](https://github.com/xm-online/xm-webapp/compare/v3.7.8...v3.7.9) (2022-10-27)


### Bug Fixes

* **core:** fix broken ngx-mask mask revert to 14.0.1 ([0e0e856](https://github.com/xm-online/xm-webapp/commit/0e0e85609635da54c4d0a7d3ef1bbeeb6eadcf52))
* **core:** fix lib mask ([9af512c](https://github.com/xm-online/xm-webapp/commit/9af512c44a0381bdd6eca633a82c8155f98d4944))
* hideAdminConsole from private configs ([5dfdbc2](https://github.com/xm-online/xm-webapp/commit/5dfdbc298c8088a6bd3001d499455817d08fff3c))
* loader freezing ([ee2367b](https://github.com/xm-online/xm-webapp/commit/ee2367b163e1bfabae1d4a7e6ff9382990742856))
* **multi-language-errors:** fix multi language show errors ([#1463](https://github.com/xm-online/xm-webapp/issues/1463)) ([47a34ac](https://github.com/xm-online/xm-webapp/commit/47a34acc7f474dd53431f50d2a66ad236d45085c))



## [3.7.5](https://github.com/xm-online/xm-webapp/compare/v3.7.4...v3.7.5) (2022-10-24)


### Bug Fixes

* **fix-selected-states:** fix selected states ([#1460](https://github.com/xm-online/xm-webapp/issues/1460)) ([097ce82](https://github.com/xm-online/xm-webapp/commit/097ce82f1dad6bb25e3a780314e36eda4737b074))



## [3.7.4](https://github.com/xm-online/xm-webapp/compare/v3.7.3...v3.7.4) (2022-10-21)


### Bug Fixes

* **core:** fix datatime-picker ang14 ([93a84d4](https://github.com/xm-online/xm-webapp/commit/93a84d40813b2f6d353d4f9fe1d4ede6f85595f5))
* **core:** fix datatime-picker ang14 ([06213ef](https://github.com/xm-online/xm-webapp/commit/06213ef808e3517bcdbd4ea2bc1f83b5a0ee084c))
* **prevent-widget-config-override:** prevent widget config override ([#1459](https://github.com/xm-online/xm-webapp/issues/1459)) ([c5134f2](https://github.com/xm-online/xm-webapp/commit/c5134f21788f4fe94d1af233153fb395e9438102))
* title for jsf date-time-picker ([5907990](https://github.com/xm-online/xm-webapp/commit/5907990c72e12cd5c1cfd59fbbe3d0978234a00d))
* working env to proxy conf ([c69e443](https://github.com/xm-online/xm-webapp/commit/c69e4438fced0c58991e6c313be50438545e2953))


### Features

* **dependency:** update version ([cec6f96](https://github.com/xm-online/xm-webapp/commit/cec6f96a522acd186ad07ae18583f56091d59245))
* **dynamic-cell-config:** add dynamic cell config ([e0abb6c](https://github.com/xm-online/xm-webapp/commit/e0abb6c2d35c046f0697c6a04d0910b7f1afb3eb))
* **multiselect:** compare objects by value ([96d6ec9](https://github.com/xm-online/xm-webapp/commit/96d6ec9dd44ac339e14a2686b45916c032757063))
* **number-control:** add step option ([03f4846](https://github.com/xm-online/xm-webapp/commit/03f48464f36a061fefc6cb305a242f3d88d2893b))
* **presentation-options-and-config:** render dynamic widget with name input `config` ([189b358](https://github.com/xm-online/xm-webapp/commit/189b3586d9b34b83fe9b116ed66a3392562b2b22))
* **update-angular-14:** after deps version update fix ([e1bf8d1](https://github.com/xm-online/xm-webapp/commit/e1bf8d1a8263252f4cd378059575bdacef12498e))
* **update-angular-14:** angular-fontawesome dep ([2f7ae14](https://github.com/xm-online/xm-webapp/commit/2f7ae14b248f60c91ffa57cc114f885745c3f117))
* **update-angular-14:** bootstrap ([8339314](https://github.com/xm-online/xm-webapp/commit/8339314c99b707b6a3d438e13365c530892b853a))
* **update-angular-14:** bootstrap ([6a01127](https://github.com/xm-online/xm-webapp/commit/6a0112700a6052f9f6e81e7d74edb51ab6fbd70e))
* **update-angular-14:** bootstrap ml and fw ([37831d5](https://github.com/xm-online/xm-webapp/commit/37831d58b47b89d9c404b86e18125577a45477a0))
* **update-angular-14:** bootstrap-5 classes ([6f117c3](https://github.com/xm-online/xm-webapp/commit/6f117c37a518f51d07c3b2733f963283d2874b09))
* **update-angular-14:** changelog note ([9eae05a](https://github.com/xm-online/xm-webapp/commit/9eae05a2ee7162634a836934fb27f7180090ee90))
* **update-angular-14:** chartist ([6cef82b](https://github.com/xm-online/xm-webapp/commit/6cef82bd0206c55de6d66a8ab91ad355e310b745))
* **update-angular-14:** correct dashboard router behavior on page reload ([f7c2539](https://github.com/xm-online/xm-webapp/commit/f7c253935f551e331fcbef399bf985720b384173))
* **update-angular-14:** covalent/text-editor dep ([75d8d02](https://github.com/xm-online/xm-webapp/commit/75d8d029545540222abb48c3ce5047e074f68194))
* **update-angular-14:** dependency version ([4ffeb45](https://github.com/xm-online/xm-webapp/commit/4ffeb45d998f94df716f230890a847dd223531c5))
* **update-angular-14:** dependency version ([5cae36e](https://github.com/xm-online/xm-webapp/commit/5cae36ebe224c5ebfb41e95de683ffce175b32e5))
* **update-angular-14:** dependency version ([9b61694](https://github.com/xm-online/xm-webapp/commit/9b6169473d63b79799da2cb8f0c0a010e02b4435))
* **update-angular-14:** fix eslint errors ([02c52c0](https://github.com/xm-online/xm-webapp/commit/02c52c0b4cbb5fc90c1e8f5c94d692bbe8b80d0b))
* **update-angular-14:** fix unit-tests ([8903a14](https://github.com/xm-online/xm-webapp/commit/8903a14ffab1e1ffcc499674bbb3be2c3e8156c4))
* **update-angular-14:** google maps dependency ([83c5ad8](https://github.com/xm-online/xm-webapp/commit/83c5ad8c5483a22a0fad6eeb4d98d1c0ab1a8e6f))
* **update-angular-14:** mass version update ([f5bbad9](https://github.com/xm-online/xm-webapp/commit/f5bbad9dfdfc6cf50b4ea9cc190a8d9652024f74))
* **update-angular-14:** ng update core and cli ([a870e4f](https://github.com/xm-online/xm-webapp/commit/a870e4fdd97d1c5d25ece355761c70dbdc65f41d))
* **update-angular-14:** node version ([3d5d23a](https://github.com/xm-online/xm-webapp/commit/3d5d23a6c83571be7a51e6a3f6e6d6fc614e4409))
* **update-angular-14:** pr mr ([f62863c](https://github.com/xm-online/xm-webapp/commit/f62863cc26170e0deba9a403d9c1a79237da954a))
* **update-angular-14:** project errors ([0478775](https://github.com/xm-online/xm-webapp/commit/0478775f41ca28eddab80038a70f6cf3b259bfcc))
* **update-angular-14:** remove useless css import comment ([e7868fe](https://github.com/xm-online/xm-webapp/commit/e7868fe057d44f6fdef3d6e010e43e8446001ce2))
* **update-angular-14:** remove useless css import comment ([cbae993](https://github.com/xm-online/xm-webapp/commit/cbae9931205ed613097d836c3f69720a11408093))
* **update-angular-14:** remove useless import comment ([0cd8fe8](https://github.com/xm-online/xm-webapp/commit/0cd8fe8b169da97d77f5c7f768fa4aa17eed74b0))
* **update-angular-14:** remove useless log ([db0ba3d](https://github.com/xm-online/xm-webapp/commit/db0ba3d2a751cb78e971036ff7a66d12ac50a1dc))
* **update-angular-14:** revert _theme.scss ([da39d7c](https://github.com/xm-online/xm-webapp/commit/da39d7cfe5766ce8a2587a27019c3e77b697e113))
* **update-angular-14:** revert account service ([06afd8a](https://github.com/xm-online/xm-webapp/commit/06afd8a25c997842c2594674f513e7c54b8c54bc))
* **update-angular-14:** revert index.html ([59f0e23](https://github.com/xm-online/xm-webapp/commit/59f0e23928c98cbe56c2390f45075c6ba7bb906b))
* **update-angular-14:** revert manifest ([c4fe5eb](https://github.com/xm-online/xm-webapp/commit/c4fe5ebf1a26a56e92ece0ab54cbfc7e7c738206))
* **update-angular-14:** revert proxy ([3f2de0a](https://github.com/xm-online/xm-webapp/commit/3f2de0a45bd7a26269147bd385a0086649f6560e))
* **update-angular-14:** revert styles ([8dded7a](https://github.com/xm-online/xm-webapp/commit/8dded7aaa8b0defba30a0132ef6669e46681ace4))
* **update-angular-14:** text float border ([22508cc](https://github.com/xm-online/xm-webapp/commit/22508cc20c9444da603e85539fc53c85b8a16a6e))
* **update-angular-14:** types ([a47ebc3](https://github.com/xm-online/xm-webapp/commit/a47ebc39a87402124564fe6a88477f7240cfc26d))
* **update-angular-14:** update bootstrap ([40b5e63](https://github.com/xm-online/xm-webapp/commit/40b5e632e1e7d11ee90aae628838fca9d6e8d86b))
* **update-angular-14:** update dependencies version ([f0732f6](https://github.com/xm-online/xm-webapp/commit/f0732f60f1207c3762c325ec165e726a1e2043fa))
* **update-angular-14:** update material ([883bc26](https://github.com/xm-online/xm-webapp/commit/883bc269ea2dc074bf0069e92d4eb096fe53014d))
* **update-angular-14:** update material deps ([b046391](https://github.com/xm-online/xm-webapp/commit/b046391269b298c07daaf837f809c8a1c6cd430c))
* **update-angular-14:** update version ([3191d76](https://github.com/xm-online/xm-webapp/commit/3191d76819e90f9a9c488341b87fddd6760cef3c))
* **update-angular-14:** version ([027d26d](https://github.com/xm-online/xm-webapp/commit/027d26d226a2ed846ddf56ee71ffc79b91b6ac7a))
* **update-angular:** remove ajv from preload ([62529a5](https://github.com/xm-online/xm-webapp/commit/62529a57e8abcbddcaadec0fdd89e9089104d5e0))
* **xm-mat-card:** mat-card styles ([4415139](https://github.com/xm-online/xm-webapp/commit/44151396cac608026669c000aa28d546c058cfdb))



## [3.6.116](https://github.com/xm-online/xm-webapp/compare/v3.6.115...v3.6.116) (2022-10-03)



## [3.6.115](https://github.com/xm-online/xm-webapp/compare/v3.6.114...v3.6.115) (2022-09-29)



## [3.6.113](https://github.com/xm-online/xm-webapp/compare/v3.6.112...v3.6.113) (2022-09-27)


### Bug Fixes

* **broken-config:** remove comment ([5f9a04a](https://github.com/xm-online/xm-webapp/commit/5f9a04a8b224d0579a9b83fa41f5267718bfc3d4))
* **broken-config:** remove editor usage on UI ([e1d8384](https://github.com/xm-online/xm-webapp/commit/e1d83843a1962cb8a88fbaf6f40d817018498219))
* change condition for transformation to 'Yesterday' ([5705490](https://github.com/xm-online/xm-webapp/commit/57054908a41eb4717149fecc4ec330cac0a44ef7))
* **cli:** change to false after property check ([b4fc5b1](https://github.com/xm-online/xm-webapp/commit/b4fc5b159acffbdbb926356bb5e1980c95de0e23))
* **core:** fix translation ([6b7d562](https://github.com/xm-online/xm-webapp/commit/6b7d562302d7dad4125d9265c783640d14626ac1))


### Features

* **dynamic:** add specification generator ([c5b091a](https://github.com/xm-online/xm-webapp/commit/c5b091a8c702d367c7dba022995737d293df42eb))
* **multi-select:** multi select control ([#1444](https://github.com/xm-online/xm-webapp/issues/1444)) ([e022a2f](https://github.com/xm-online/xm-webapp/commit/e022a2f710c0cbe38ef81bcaa00a8a3e385864ba))
* **presentation-options-and-config:** render dynamic widget with name input `config` ([d947020](https://github.com/xm-online/xm-webapp/commit/d94702087ef0de0dea9565f9b7c4d43ada06e6f8))
* remove back xm-stat-widget calss as it still in use ([83212ce](https://github.com/xm-online/xm-webapp/commit/83212ceecf7a0ce0b760cfa5c1a2299e9d61168f))
* **stats-widget:** redesign based on the material desgin best practics ([dd3a469](https://github.com/xm-online/xm-webapp/commit/dd3a46963f27a562d4bbb849b35f72446ac7d43f))



## [3.6.105](https://github.com/xm-online/xm-webapp/compare/v3.6.104...v3.6.105) (2022-09-14)


### Bug Fixes

* **xm-array-control:** failed test build fixed ([fb85770](https://github.com/xm-online/xm-webapp/commit/fb857707eae98c32dfacff0e920e1dd3c28ef6e6))
* **xm-array-control:** fix assignment ([27a4404](https://github.com/xm-online/xm-webapp/commit/27a4404a8ac63d84c8ba05f1ce067ca181078941))


### Features

* **array-control-refactor:** refactor array control ([#1438](https://github.com/xm-online/xm-webapp/issues/1438)) ([54e635a](https://github.com/xm-online/xm-webapp/commit/54e635a47eaf494def69fc44a83c70f7643a9e87))



## [3.6.101](https://github.com/xm-online/xm-webapp/compare/v3.6.100...v3.6.101) (2022-08-22)


### Bug Fixes

* **get-by-id-header:** fix header in getById method ([0920660](https://github.com/xm-online/xm-webapp/commit/0920660e7cab91aa97acf7383b9cb6f74e2f6a93))
* serach in multiselect ([e7079e5](https://github.com/xm-online/xm-webapp/commit/e7079e5cc4574a0287b27f46cabd00845bd78cee))
* **xm-text-range-control:** fixed mat-hint styles ([29a4cc9](https://github.com/xm-online/xm-webapp/commit/29a4cc9fcc9cb564218c77e674e145789290f270))


### Features

* adding possibility to import *.md ([659c6fa](https://github.com/xm-online/xm-webapp/commit/659c6fab87073fd3b948cd0a814421264054f98a))
* **improve-array-control:** fetch autocomplete items from backend ([#1434](https://github.com/xm-online/xm-webapp/issues/1434)) ([95ed5ba](https://github.com/xm-online/xm-webapp/commit/95ed5baa483668e6d873af2fe3b28f1bedef836f))
* **menu-mode:** support menu mode: click, toggle ([a4f34c5](https://github.com/xm-online/xm-webapp/commit/a4f34c5f995222d28e45cb87a28661d1b6f0627c))



## [3.6.93](https://github.com/xm-online/xm-webapp/compare/v3.6.92...v3.6.93) (2022-07-22)


### Bug Fixes

* add interface ([b154324](https://github.com/xm-online/xm-webapp/commit/b1543244b4e9f987aea094c3de00862f2736d30b))
* **ajsf-build-layout:** fix build layout ([b55f087](https://github.com/xm-online/xm-webapp/commit/b55f087ac98c6cf87d260bc5afdcadec5d673609))
* **ajsf-layout:** fix ajsf layout ([e2e414b](https://github.com/xm-online/xm-webapp/commit/e2e414b733d5dde531a61be456b696ab655b3e36))
* **child-dashboard-permission:** add child dashboard default permission ([9ba6a98](https://github.com/xm-online/xm-webapp/commit/9ba6a98babaa036e531a6bf5b2f16bdccbd0ef60))
* fix condition context on func modal call ([68340a8](https://github.com/xm-online/xm-webapp/commit/68340a8c1ecdf9ef771fcb19e6a91637a9ccb958))
* state data in $ ([87ee0cf](https://github.com/xm-online/xm-webapp/commit/87ee0cfca5032d6a3bc5ee10982f20409e86b8b3))
* **translation:** add endings ([6ddc34c](https://github.com/xm-online/xm-webapp/commit/6ddc34c56b571abb8965870380b59947155ed67d))


### Features

* adding card nav-back with input ([9f51b50](https://github.com/xm-online/xm-webapp/commit/9f51b506506c2cfdb7ba86bc524848dffa919457))
* adding save btn for jsf edit widget ([83f7dfc](https://github.com/xm-online/xm-webapp/commit/83f7dfc1b4a5fc2540681a55366666169d2efdbb))
* adding setter ([5e25ced](https://github.com/xm-online/xm-webapp/commit/5e25ced47f75b9640469833a5cd0bc74c129c339))
* **ajsf-handle-drag:** add custom handle for drag elements ([a6372d3](https://github.com/xm-online/xm-webapp/commit/a6372d356804a6414ea44d87b0ef0665a34832bd))
* **componnets:** added current month as date init value in date range ([b3be001](https://github.com/xm-online/xm-webapp/commit/b3be001263ec6dd51097a5f42f9109a894c88320))
* **confirm-dialog:** add subtitle ([181fdb7](https://github.com/xm-online/xm-webapp/commit/181fdb74e36bc1d03e841972f1ff5d91e0c2e0cf))
* **empty-dashboard-children:** show children dashboards ([4415cfb](https://github.com/xm-online/xm-webapp/commit/4415cfbd2398513911b76c941ef64d7e32568c3e))
* **menu-separate-click-event:** separate link click: link and icon ([#1421](https://github.com/xm-online/xm-webapp/issues/1421)) ([28565a5](https://github.com/xm-online/xm-webapp/commit/28565a5fc95a3e5ce93d31ed3ce917580f12b777))
* **roles-managment:** disable save button while loading ([d51b409](https://github.com/xm-online/xm-webapp/commit/d51b409065a4e73473a449a6c87783965fdf86f6))
* **xm-date-range-filter-control:** added languge translates by date picker ([a6d1cca](https://github.com/xm-online/xm-webapp/commit/a6d1cca82f0878d248281507938c80ff6334fdba))
* **xm-multilanguage-component:** extension of functionality ([48149c2](https://github.com/xm-online/xm-webapp/commit/48149c2c010d2d6069bb03e4ba384147981e7a25))



## [3.6.67](https://github.com/xm-online/xm-webapp/compare/v3.6.66...v3.6.67) (2022-06-10)


### Bug Fixes

* dependencies update ([7f1e26e](https://github.com/xm-online/xm-webapp/commit/7f1e26e1c947c3e4ac0ac907d440b3458c7412fd))
* ribbon prop check ([4a66d16](https://github.com/xm-online/xm-webapp/commit/4a66d16d1882a26c7e85c55b6e18356c2a988c39))
* ribon admin ([a4ba484](https://github.com/xm-online/xm-webapp/commit/a4ba48429cbf0c8ec4b2f93fb47a9d338e28b302))
* **xm-text-control:** mat-hint styles fixed ([35a927a](https://github.com/xm-online/xm-webapp/commit/35a927aee27113bb3e2a730492d681b2b02902e7))
* **xm-text-control:** mat-hint styles fixed ([f8b0be2](https://github.com/xm-online/xm-webapp/commit/f8b0be25ca48de97f819c6a2ff164d18bfe1b69f))


### Features

* **dependency:** update version ([0ef52ae](https://github.com/xm-online/xm-webapp/commit/0ef52ae3c17f0aa82b269b2c534618c6bbafabe5))
* **dialog-radio-permission:** permission to dialog control and radio ([#1388](https://github.com/xm-online/xm-webapp/issues/1388)) ([8228830](https://github.com/xm-online/xm-webapp/commit/822883051b076c3a034c65a2f6694204831d2eef))
* **page-changes:** handle changes ([a11ee91](https://github.com/xm-online/xm-webapp/commit/a11ee914818e052de0e0b8295587089be4d2c193))
* **page-refresh:** remove unused dependency ([756b92b](https://github.com/xm-online/xm-webapp/commit/756b92bec9489ec8b500cb88e75747ce6fa1a589))
* **page-refresh:** remove unused imports ([c9f8a04](https://github.com/xm-online/xm-webapp/commit/c9f8a045fc98e8734d0bf5c096351438f11fd3a5))
* **page:** return observable ([cbd06c2](https://github.com/xm-online/xm-webapp/commit/cbd06c2496a7baff87df0f0a05857c4b046327ff))



## [3.6.59](https://github.com/xm-online/xm-webapp/compare/v3.6.58...v3.6.59) (2022-06-02)


### Features

* **table-array:** find value from table data ([#1377](https://github.com/xm-online/xm-webapp/issues/1377)) ([b4e93ca](https://github.com/xm-online/xm-webapp/commit/b4e93cab72450e06157b229016037b8d6095dc1e))
* **xm-date-range-filter-control:** set option first day of week ([a1c0961](https://github.com/xm-online/xm-webapp/commit/a1c0961af32e32957c7fb961d3adef4eeab18df5))



## [3.6.57](https://github.com/xm-online/xm-webapp/compare/v3.6.56...v3.6.57) (2022-05-30)


### Features

* **form-invalid-disable-button:** disable button for invalid form ([#1373](https://github.com/xm-online/xm-webapp/issues/1373)) ([9609be4](https://github.com/xm-online/xm-webapp/commit/9609be410ae0197aed19221244be9e069160b88a))



## [3.6.56](https://github.com/xm-online/xm-webapp/compare/v3.6.55...v3.6.56) (2022-05-30)


### Features

* **datepicker-null-check:** check for null before moment parse ([#1366](https://github.com/xm-online/xm-webapp/issues/1366)) ([3d039bc](https://github.com/xm-online/xm-webapp/commit/3d039bc197913e4ede06fc90219f5aaee1a00d2a))



## [3.6.55](https://github.com/xm-online/xm-webapp/compare/v3.6.54...v3.6.55) (2022-05-27)


### Features

* **radio-group:** add radio group control ([#1370](https://github.com/xm-online/xm-webapp/issues/1370)) ([5661ef0](https://github.com/xm-online/xm-webapp/commit/5661ef085cbf2d7c3458b965066157e02fc16ef1))



## [3.6.54](https://github.com/xm-online/xm-webapp/compare/v3.6.53...v3.6.54) (2022-05-26)


### Features

* **confirm-dialog:** add confirm dialog ([#1369](https://github.com/xm-online/xm-webapp/issues/1369)) ([29943ad](https://github.com/xm-online/xm-webapp/commit/29943ade3d493c68d0279f2e5d5f55a6b8a32113))
* **dependency:** remove jszip ([53702e5](https://github.com/xm-online/xm-webapp/commit/53702e56f3772fdb3788bf0400e1bcfce9a24751))
* **translation-for-pipe:** add translations for pipe timeFrom ([c3c80ed](https://github.com/xm-online/xm-webapp/commit/c3c80ed7922f90ffdbab79a88332b757e1f887fb))



## [3.6.50](https://github.com/xm-online/xm-webapp/compare/v3.6.49...v3.6.50) (2022-05-20)


### Features

* **breadcrumbs-last-segment-layout:** render dynamic widget for last… ([#1363](https://github.com/xm-online/xm-webapp/issues/1363)) ([0c0e853](https://github.com/xm-online/xm-webapp/commit/0c0e8533dc1b6e7a00132aa1cff39262f3c3684c))
* **timeFrom-pipe:** create custom pipe for formatting date ([bbe24dc](https://github.com/xm-online/xm-webapp/commit/bbe24dc889d5f8004337714a7d257a66debf120b))



## [3.6.48](https://github.com/xm-online/xm-webapp/compare/v3.6.47...v3.6.48) (2022-05-17)


### Bug Fixes

* fixing location find ([6da6d35](https://github.com/xm-online/xm-webapp/commit/6da6d35e017683efd1d1c5ec53db093017e25c74))


### Features

* adding de lang ([2b8e06d](https://github.com/xm-online/xm-webapp/commit/2b8e06dac6eada389a127d81e964af64013d1bb5))
* adding it support ([71e7e8f](https://github.com/xm-online/xm-webapp/commit/71e7e8ff7f7a0ba58025ad5626785cf77fd3786c))
* adding location in onSuccsess calback ([821b3a1](https://github.com/xm-online/xm-webapp/commit/821b3a14a35b8302563b5920df55a68656ff42dd))
* **bool:** add acceptable value to options ([f19c475](https://github.com/xm-online/xm-webapp/commit/f19c475da1b64240b6d430c1e908ee9d6da2b42b))
* compact card dispaly mode ([378f754](https://github.com/xm-online/xm-webapp/commit/378f75454dd2196d7b4611f7721212ca97b00ed1))
* **menu-permission-directive:** fix cdk tree node outlet ngIf ([#1359](https://github.com/xm-online/xm-webapp/issues/1359)) ([ad86287](https://github.com/xm-online/xm-webapp/commit/ad86287ae6dbed8ec2f2d294a964a2aaf050d730))
* **nested-menu:** default dashboard group if slug missing ([f6d5df3](https://github.com/xm-online/xm-webapp/commit/f6d5df3cbf8721333c6c0095ecb718c35d2e6741))
* **nested-menu:** exclude parent group key from slugs ([adc041c](https://github.com/xm-online/xm-webapp/commit/adc041c4c8a4e250385d23b764b29a15bb72b35f))
* **nested-menu:** fix after review ([fcc5864](https://github.com/xm-online/xm-webapp/commit/fcc58648854a4a6804f004750fb977e8ca092ae0))
* **nested-menu:** pass lint ([ac7ca1a](https://github.com/xm-online/xm-webapp/commit/ac7ca1ad540b3fd1ebcb92d86e993cdc1ca07aa2))
* **nested-menu:** support nested menu ([ef6e3e0](https://github.com/xm-online/xm-webapp/commit/ef6e3e06af7735cfc6c8f972e7c65d1723afb615))



## [3.6.37](https://github.com/xm-online/xm-webapp/compare/v3.6.36...v3.6.37) (2022-04-26)


### Features

* **date-range:** make date range work as dynamic widget ([#1340](https://github.com/xm-online/xm-webapp/issues/1340)) ([35eb512](https://github.com/xm-online/xm-webapp/commit/35eb5124ea8ce67d1bf61fdfd3edfc7df1628982))



## [3.6.36](https://github.com/xm-online/xm-webapp/compare/v3.6.35...v3.6.36) (2022-04-26)


### Bug Fixes

* column layout fix for list filters ([f6937c6](https://github.com/xm-online/xm-webapp/commit/f6937c6602add5f206904987cba3b901aa6a1782))


### Features

* adding api param to procces ui config ([969eaf3](https://github.com/xm-online/xm-webapp/commit/969eaf39334ff5e6a60bf8f18caa46c97be17db8))
* adding input for supporting entity list selection ([43778e9](https://github.com/xm-online/xm-webapp/commit/43778e9a7ebaddee6da49db24cff81da2f7f0310))
* **button-spinner:** remove loading indicator after spinner componen… ([#1343](https://github.com/xm-online/xm-webapp/issues/1343)) ([99b689c](https://github.com/xm-online/xm-webapp/commit/99b689c3a9ce244bbc2d0eed25a06b562ad032e7))
* **show-hide-columns-settings:** add checked by default ([05b126a](https://github.com/xm-online/xm-webapp/commit/05b126a31f1b3c2bb4ca7a9a06c5911bad6d8d04))
* **show-hide-columns-settings:** add select all checkbox ([cd14727](https://github.com/xm-online/xm-webapp/commit/cd1472795ae58098c66ecffe4dffae010672e81e))



## [3.6.31](https://github.com/xm-online/xm-webapp/compare/v3.6.30...v3.6.31) (2022-03-31)


### Bug Fixes

* md view ([c09aae9](https://github.com/xm-online/xm-webapp/commit/c09aae9134e27ac9be19ddb729d7575abc7cdce3))


### Features

* **multi-language-widget:** add multi lang widget to dynamic registry ([#1334](https://github.com/xm-online/xm-webapp/issues/1334)) ([764696d](https://github.com/xm-online/xm-webapp/commit/764696dfd578cdb285db5924fdb9301592c01f90))
* **text-view-translate:** add value translate for text-view component ([01742b8](https://github.com/xm-online/xm-webapp/commit/01742b8c5e0414908e1d625af3bfa642010a40f6))



## [3.6.28](https://github.com/xm-online/xm-webapp/compare/v3.6.27...v3.6.28) (2022-03-16)


### Bug Fixes

* **hint-control-style:** fix hint control style ([#1329](https://github.com/xm-online/xm-webapp/issues/1329)) ([c33d8fb](https://github.com/xm-online/xm-webapp/commit/c33d8fb0e17ba832e60005fb5d78859f04f6b931))



## [3.6.27](https://github.com/xm-online/xm-webapp/compare/v3.6.26...v3.6.27) (2022-03-14)


### Bug Fixes

* change dependency source path ([08c4b59](https://github.com/xm-online/xm-webapp/commit/08c4b599c1ebabe0d21f4b0d9eee280c24b1d937))
* **dashboard-routes:** variable out of cycle ([56edbdc](https://github.com/xm-online/xm-webapp/commit/56edbdc2472c9924fa8b75f467b6069cc20f107e))
* fix jsf-ext-importer,empty ModuleImports ([f06aae5](https://github.com/xm-online/xm-webapp/commit/f06aae52087a83172032194d17812ba96d7b5d9a))
* lint exec ([7b90006](https://github.com/xm-online/xm-webapp/commit/7b900069edc7123296c22773f421f54ea2078e43))
* lint fix in ignored ([62c6845](https://github.com/xm-online/xm-webapp/commit/62c6845e8a35bdab3d796450155639d16624b151))
* no external widgets default provided ([1c862ee](https://github.com/xm-online/xm-webapp/commit/1c862eef7ff5e3c199957968064be07a1378c9dc))
* otional param ([16027b0](https://github.com/xm-online/xm-webapp/commit/16027b0f4c08710da128a37db641283daf7cfb47))
* prevent context location redirects ([8adb41b](https://github.com/xm-online/xm-webapp/commit/8adb41b5c54c0c97ee6f8eebaa2b0a76e0220d44))
* providing jsf service ([5f7bd1f](https://github.com/xm-online/xm-webapp/commit/5f7bd1ffee3284b504ae6abc1dda8950fc2e427f))
* providing jsf service ([2fcbe4b](https://github.com/xm-online/xm-webapp/commit/2fcbe4ba5bd30cc9258e518236541423b3a0d8bb))
* providing timeZoneOffset for dates cols in list ([4c02af6](https://github.com/xm-online/xm-webapp/commit/4c02af61ad52cc945086fd1308f999cbb99572f1))
* remove unexist scss dependency ([8da362c](https://github.com/xm-online/xm-webapp/commit/8da362c73994cdb8367c7a41f6456cf7ef6287ba))
* removing ext module imports ([44af95e](https://github.com/xm-online/xm-webapp/commit/44af95e1744c7a5dadd1b750ab666cabc3412669))
* sort in list from matSort ([5a37f98](https://github.com/xm-online/xm-webapp/commit/5a37f980028a2f7ee1ea36432de0cddd14e90524))
* **translation:** fix translation ([c981cfe](https://github.com/xm-online/xm-webapp/commit/c981cfe768399e4a8909722ba44114ba0e870383))
* update index git assume-unchanged ([83c9a33](https://github.com/xm-online/xm-webapp/commit/83c9a333ed330c9d83f9ae8f9230a52a393d09b3))
* **validators-processing.service:** fix valueLessThanIn, valueMoreThanIn, refactor ([271eeaf](https://github.com/xm-online/xm-webapp/commit/271eeaf80ee63924f9e32356b81d2e8c0b0db0c1))


### Features

* **ace-editor:** add to registry ([3f33c82](https://github.com/xm-online/xm-webapp/commit/3f33c82c6be0e656e42715b77201a282b4194913))
* **angular-editor-control:** add angular-editor as dynamic control ([e99b095](https://github.com/xm-online/xm-webapp/commit/e99b0957362139ddc8bbe6e02797f54d7d7b510d))
* **docs-component:** modify url in swagger request, add name from config to request ([93de094](https://github.com/xm-online/xm-webapp/commit/93de094f6f80b131b026ce9b763beb13382f10a1))
* **hint-control:** add hint to control ([#1322](https://github.com/xm-online/xm-webapp/issues/1322)) ([7038cd3](https://github.com/xm-online/xm-webapp/commit/7038cd35b35270af8b5048ecddf94fdb67dc1d57))
* increasing modal width for entity details ([83f6e6f](https://github.com/xm-online/xm-webapp/commit/83f6e6ff4c768c2d615f2056e8fb380f862bac14))
* **logo:** add component to display logo as image ([43f72e2](https://github.com/xm-online/xm-webapp/commit/43f72e2787944a1484a3b098be23681d0e050e5a))
* **main:** add global input mask for input lazy components ([b5b4e18](https://github.com/xm-online/xm-webapp/commit/b5b4e18611a3ddb11552f710276ef1b096bda3e1))
* **page-location:** support route params ([ba55035](https://github.com/xm-online/xm-webapp/commit/ba550358b3120a5e94bb397250e76a813910a280))
* **table-column-dynamic-cell:** add style, class attr for table head ([a4bb5b2](https://github.com/xm-online/xm-webapp/commit/a4bb5b22a5f124feab2e337de9abcd28abca675d))
* **table-with-column-dynamic-cell:** move components to xm-webapp ([d01d24e](https://github.com/xm-online/xm-webapp/commit/d01d24e64bc944211edeed302de8b6a76e6f4f65))
* **table-with-column-dynamic-cell:** remove empty file ([2c5c504](https://github.com/xm-online/xm-webapp/commit/2c5c50431c255ad037444c92b33a69616b2ae8a7))
* **toaster-service:** add configurable duration ([127ea2f](https://github.com/xm-online/xm-webapp/commit/127ea2f728b1bb1be62ccd43d30cd35a59c290a4))
* **xm-link:** add style attr ([f3ff459](https://github.com/xm-online/xm-webapp/commit/f3ff459ec01190f371e9972ac4f433346a532562))



# [3.6.0](https://github.com/xm-online/xm-webapp/compare/4.1.0...v3.6.0) (2021-11-17)


### Bug Fixes

* **_theme:** remove $dark-primary-text and $light-primary-text ([#686](https://github.com/xm-online/xm-webapp/issues/686)) ([1781402](https://github.com/xm-online/xm-webapp/commit/1781402acc9174ecad4f29f881895513f4e333e0))
* **#296:** fix not existing elements ([3ec6927](https://github.com/xm-online/xm-webapp/commit/3ec6927826bc09034b7c99866aab20407528f6b2))
* **account-help:** addding help account from master ([#609](https://github.com/xm-online/xm-webapp/issues/609)) ([b9139e2](https://github.com/xm-online/xm-webapp/commit/b9139e2e839546395355d0d3aa7b84943a62a2fc))
* **account:** fix circle deps ([3e3102d](https://github.com/xm-online/xm-webapp/commit/3e3102d21a993b3b13e8bf94265ee4c4cde73eb3))
* add ModuleWithProviders typing ([e4f5410](https://github.com/xm-online/xm-webapp/commit/e4f5410387fac4daebb1ee4c697e085e84116e08))
* **admin-service:** rollback lastModifiedDate to id ([6d959e4](https://github.com/xm-online/xm-webapp/commit/6d959e46e55bddbc8e7293352769d345b228090a))
* **admin:** remove xmSharedModule ([68f58b3](https://github.com/xm-online/xm-webapp/commit/68f58b30791a852c3c3d8eaf0834cfeb9bf4ab76))
* **ajsf:** add fixFlexLayout ([e06d9b4](https://github.com/xm-online/xm-webapp/commit/e06d9b46a5575f4ec243cb10fcb9f509c1f2a655))
* **ajsf:** parent-child flex layout ([f74c902](https://github.com/xm-online/xm-webapp/commit/f74c90204adfe267bcd7680759cbc32d57ec205a))
* **ajsf:** return mat-form-styles ([c88984f](https://github.com/xm-online/xm-webapp/commit/c88984fc0ca9d7e0c37deaebfa7ad3ef626921bd))
* **alert-error:** add default notification on 403 error ([7f162bb](https://github.com/xm-online/xm-webapp/commit/7f162bba9304f91ed8eccca28e3ccf4a8f5553e6))
* **alert:** fix error code mapping ([a646b07](https://github.com/xm-online/xm-webapp/commit/a646b0728502d8c102203f1afb3bed7521313691))
* **array-control:** add array-control ([35be484](https://github.com/xm-online/xm-webapp/commit/35be484dde56690c7bc53f7947063360beed49fb))
* **array-control:** fix disabled state ([42fcd07](https://github.com/xm-online/xm-webapp/commit/42fcd07078c2721ca97b18b51886a82d564a36a7))
* **attachment:** no spec in template check fix ([587d1ba](https://github.com/xm-online/xm-webapp/commit/587d1ba4c68ff03a8daa86eec0ca42a1a45774f5))
* **audits:** fix pagination ([e0f2eaa](https://github.com/xm-online/xm-webapp/commit/e0f2eaa05f6efbcc4218ea0a3c7f71995dcfff0f))
* **audits:** fix switch with error ([fc059c2](https://github.com/xm-online/xm-webapp/commit/fc059c2c430f2c78212e4ba5abc030726bc19734))
* **auth-jwt:** fix refresh token on reload ([c4bd220](https://github.com/xm-online/xm-webapp/commit/c4bd220a2685bc4ddf3192537f25ecf8f21ac2fe))
* **auth:** apply user locale after identity ([#697](https://github.com/xm-online/xm-webapp/issues/697)) ([e0e5bc9](https://github.com/xm-online/xm-webapp/commit/e0e5bc94d7d6ac28d2bf56a75b4fdbb7804bd396))
* **avatar-dialog:** fix file button and preview styles ([3003963](https://github.com/xm-online/xm-webapp/commit/3003963ed7d299b3817e8f83275a402c3cbbc4bf))
* **b2bcrm787:** fix if component dont have registerOnChange ([56cfa69](https://github.com/xm-online/xm-webapp/commit/56cfa6945a04daed41c2617f1fa26b4de0726e56))
* **back-links:** fixing broken back-links ([#635](https://github.com/xm-online/xm-webapp/issues/635)) ([634550a](https://github.com/xm-online/xm-webapp/commit/634550aaf256fd5d233ba17cac87d4a5a0f086a4))
* **bool-control:** fix formControl -> formGroup.pristine fro xm-bool-control ([29b9324](https://github.com/xm-online/xm-webapp/commit/29b9324ad3c669bc1df12950929889447a75e13f))
* **bool:** make cancelled false by default ([aad46e1](https://github.com/xm-online/xm-webapp/commit/aad46e1e7ad025746fb2b0009a4d76d91b9dde2b))
* **breadcrumb:** fix first empty load ([bb74126](https://github.com/xm-online/xm-webapp/commit/bb74126be33a8717a845097de977676beafcbccd))
* **button-groups:** fixing inline spacing, refactoring font sizing ([2cec912](https://github.com/xm-online/xm-webapp/commit/2cec9120161309046f72c838d0e94a725881762f))
* **by-entity-id:** update should be called with dynamic components ([cf77b51](https://github.com/xm-online/xm-webapp/commit/cf77b51a42c1322d7408e6e372fe5d8904ee624a))
* **card:** replace .card with mat-card ([#644](https://github.com/xm-online/xm-webapp/issues/644)) ([c8191ef](https://github.com/xm-online/xm-webapp/commit/c8191efe52c3846d46330f03e8d05c8f9583a559))
* check subscription ([#1161](https://github.com/xm-online/xm-webapp/issues/1161)) ([a9176ff](https://github.com/xm-online/xm-webapp/commit/a9176ff56432d938aaff37c50c6193a044ce244f))
* **ci:** remove npm caches ([688b496](https://github.com/xm-online/xm-webapp/commit/688b496ac3d9840d496d7c7fb9186e09c7a1cb63))
* **client-management:** add XmPermissionModule ([893da70](https://github.com/xm-online/xm-webapp/commit/893da70540ca14092370ff16a2dc0dac5555e1ce))
* **client-management:** change icons ([fa1596b](https://github.com/xm-online/xm-webapp/commit/fa1596b54fac6daaf869142bdcbd471d8f154cc0))
* **client-mng:** fix pagination length ([ace540f](https://github.com/xm-online/xm-webapp/commit/ace540f531f30ece591966b9187bdfc41381d2b9))
* **clients:** fixing empty config columns ([c482645](https://github.com/xm-online/xm-webapp/commit/c4826453109cae74d256f45f57b6cc9445055045))
* **cli:** fix assets copy ([aee7973](https://github.com/xm-online/xm-webapp/commit/aee7973c1737c3b6202840a4556865ab9444baf2))
* **cli:** fix assets override ([3d5e340](https://github.com/xm-online/xm-webapp/commit/3d5e340bde075a73cbfdf7f4f3c9e5ad5f625127))
* **cli:** fix assets override ([4c9a433](https://github.com/xm-online/xm-webapp/commit/4c9a4331df4bcd649099ce0ca5552a97459a0521))
* **cli:** fix deps sequence ([1c7bfb6](https://github.com/xm-online/xm-webapp/commit/1c7bfb65b6c8bcc412acbe45fd247fe4285348f0))
* **cli:** fix lazy selector ([bc193f0](https://github.com/xm-online/xm-webapp/commit/bc193f0ef480c1aca56b8d06f0f5305afc20ad94))
* **condition-dashboard:** fix dashboard selection ([12bf77a](https://github.com/xm-online/xm-webapp/commit/12bf77a2218d2e7654a76e5dda567a0cb29cb9d4))
* **condition-dashboard:** fix tests ([2609091](https://github.com/xm-online/xm-webapp/commit/26090917a0db72aa659047f7cfda1166eaf369a8))
* **condition-dashboard:** fix typeKey comparison ([a41fbaf](https://github.com/xm-online/xm-webapp/commit/a41fbaf77312532bdeadca6a1987187add857b8f))
* **condition-dashboard:** remove regex ([56c6f36](https://github.com/xm-online/xm-webapp/commit/56c6f36a5332ad13fcea9c4abea26435e5360780))
* **config:** fix scss generation ([4ead65e](https://github.com/xm-online/xm-webapp/commit/4ead65e28794f5a192ec8653ac16c1d704da1681))
* **core-auth:** priority to session token ([936da46](https://github.com/xm-online/xm-webapp/commit/936da46b57b50ad4fb83fe8fb59054ab5167b4cf))
* **core:** remove redundant code ([2258aed](https://github.com/xm-online/xm-webapp/commit/2258aedebe457c61846bc32a369a5fce30a16195))
* corrections after review ([6c0190d](https://github.com/xm-online/xm-webapp/commit/6c0190ded7f9d448bf0aa781941b506d439ad423))
* corrections after review widgets and entity-card-compact ([a51d1d5](https://github.com/xm-online/xm-webapp/commit/a51d1d5354a0fd4731bfb5374b90a6e675c2fbe4))
* custom link display options ([e1a894f](https://github.com/xm-online/xm-webapp/commit/e1a894f02719f5c52705c66cdf8bc74a5de02d51))
* **dashboard-list:** checking orderIndex in template ([82693ae](https://github.com/xm-online/xm-webapp/commit/82693aecc7c90e74ce2382f4e9884d700ac5154f))
* **dashboard-list:** fix toggle ([521b677](https://github.com/xm-online/xm-webapp/commit/521b677e39418ae0ae3e1bbe76640e2f0fe2fb3b))
* **dashboard-wrapper.service:** check idOrSlug for null ([4e94e9d](https://github.com/xm-online/xm-webapp/commit/4e94e9d33961fb2ecd362eea17292200f76a5c0c))
* **dashboard-wrapper:** fix deleting dashboard stream instead dashboards cache ([1df7344](https://github.com/xm-online/xm-webapp/commit/1df7344aab94717987659f6083e913588aaebb19))
* **dashboard:** filter dashboards without slug ([6a57054](https://github.com/xm-online/xm-webapp/commit/6a57054e75cbb2fcacb334c75b661f2d6bc38f8a))
* **dashboard:** fix empty dashboard after login ([84abe54](https://github.com/xm-online/xm-webapp/commit/84abe5488ec7816432a8a8f311ab31cb0b2aa2e5))
* **dashboard:** fix empty error ([238fc5d](https://github.com/xm-online/xm-webapp/commit/238fc5d9eba882fc2ecdabd82bc0c7fb58775f58))
* **dashboard:** fix typing ([047ab4d](https://github.com/xm-online/xm-webapp/commit/047ab4d3c7b10af69d84cb3c45f8922a84bd713a))
* **dashboard:** fix xm-bool resolve ([4a2e962](https://github.com/xm-online/xm-webapp/commit/4a2e9621e67c2b57cefcfc359d3dd1aadc7d24a5))
* **dashboard:** reset ui before page changes ([d43faad](https://github.com/xm-online/xm-webapp/commit/d43faad1ca756428d32e64099fa9c20add740c48))
* dashboards remove static entry ([ab9ac01](https://github.com/xm-online/xm-webapp/commit/ab9ac01971925f78b598b9bf5d9aae04f1ee7ae8))
* **dashboards:** add catchError ([#643](https://github.com/xm-online/xm-webapp/issues/643)) ([10df0dd](https://github.com/xm-online/xm-webapp/commit/10df0ddaa47473ffceedae59525c8ac9b6e4cc88))
* **dashboards:** add navbar pageSubSubTitle ([88af697](https://github.com/xm-online/xm-webapp/commit/88af697f7ddfe53b39271e2511bac69e685d49b4))
* **dashboards:** fix caches ([887c9eb](https://github.com/xm-online/xm-webapp/commit/887c9eb25a04bf78d6d85ef5245bfe255cb397fd))
* **dashboards:** fix link redirect ([a5e635a](https://github.com/xm-online/xm-webapp/commit/a5e635a255b21f3d627fa7d0e5dbe33b7bfd8e3c))
* **dashboards:** fix redirect error ([ee329af](https://github.com/xm-online/xm-webapp/commit/ee329af94f7e95f36e2c84c10ef98aa0a01e89db))
* **date-control:** date control add useUtc in options ([fb23e23](https://github.com/xm-online/xm-webapp/commit/fb23e23fae6062ea44246dd3800ea1182240ce53))
* **date-control:** remove value on clear, request-btn - fix for interpolatedUrl ([be37636](https://github.com/xm-online/xm-webapp/commit/be376366bd95e453e9d1647e37aeb2da908011d5))
* **date-value:** fix empty options ([7e8f473](https://github.com/xm-online/xm-webapp/commit/7e8f4732050166fd697e73e6fbca8f1e9105e12a))
* **date:** fix imports ([28b8d74](https://github.com/xm-online/xm-webapp/commit/28b8d74c701aa5810c63324460942b3902435a8f))
* datepicker opacity ([a3a0dd0](https://github.com/xm-online/xm-webapp/commit/a3a0dd0ece173db3d079f33d415d35e6fce6b3a0))
* **datetime-control:** add option ignoreSeconds ([e41a2b3](https://github.com/xm-online/xm-webapp/commit/e41a2b3a24f31f6bf64c91f11ce2eb38caed6c03))
* **datetime-control:** add option ignoreSeconds ([51d5503](https://github.com/xm-online/xm-webapp/commit/51d5503a60e1ba6655c541b4ec5634f7c4b3f6ce))
* **datetime-control:** fix datetime format ([9ac6f03](https://github.com/xm-online/xm-webapp/commit/9ac6f0394ff16cb11bf42625d8f5a2fd70e42536))
* **datetime-control:** replace type value from XmDateValue to Moment ([d7519ac](https://github.com/xm-online/xm-webapp/commit/d7519ac09f8b13e4cbf4e6ed171387387f1a64a7))
* **default-dashboard:** fix empty dashboard after session change ([5fa4a38](https://github.com/xm-online/xm-webapp/commit/5fa4a3830dbec074a0abe11cdfb968493601a7af))
* **develop:** added mediaMarshaller calls to fix ajsf flex ([4671d16](https://github.com/xm-online/xm-webapp/commit/4671d16e53735a6bf98330257aaaea503a162da2))
* **docs:** api path ([ef3fa27](https://github.com/xm-online/xm-webapp/commit/ef3fa27227f456d2fc6b3edbfbd421e641f5f6f8))
* **docs:** fix import path ([82eb619](https://github.com/xm-online/xm-webapp/commit/82eb61943cdd2c0783fe23e06da7a582c2f44444))
* **documentation:** skip quotes ([5d48ed9](https://github.com/xm-online/xm-webapp/commit/5d48ed9b7643254930ace01ae5e9e6374ea2ee8a))
* **dynamic-loader:** fix undefined error ([13611c9](https://github.com/xm-online/xm-webapp/commit/13611c99da2534f2b37ec1d3bf74870dac590d52))
* **dynamic-route:** clear route on canActive ([329ec29](https://github.com/xm-online/xm-webapp/commit/329ec29b7233045d414bcdd976e9386356af09a3))
* **dynamic-tenant-loader:** remove selector validator ([9060839](https://github.com/xm-online/xm-webapp/commit/90608395b8e094928a9efc548029f2a93ee9e262))
* **dynamic-tenant:** module resolve component ([508ee4d](https://github.com/xm-online/xm-webapp/commit/508ee4d3fc34eef6d920318d3328141b93a3b89c))
* **dynamic-view:** fix extends ([6c355b4](https://github.com/xm-online/xm-webapp/commit/6c355b430a70b58aa2b5a7fe9c3c086748ecf795))
* **dynamic-view:** fix layout type ([#602](https://github.com/xm-online/xm-webapp/issues/602)) ([d7cb360](https://github.com/xm-online/xm-webapp/commit/d7cb3605a966c289bbfd180e41067e28ff391207))
* **dynamic-view:** fix resolve module ([cb72af7](https://github.com/xm-online/xm-webapp/commit/cb72af703bd54e4a317e2d88fb66d06f57612be7))
* **dynamic-view:** remove appearUp ([598f876](https://github.com/xm-online/xm-webapp/commit/598f87648c793542c723f17677c5269863b93d54))
* **dynamic:** remove from compiler cache ([9b5a60a](https://github.com/xm-online/xm-webapp/commit/9b5a60a3c606c023836f7781ce7cc7c5f11bb2db))
* entity widget ([3ff36e3](https://github.com/xm-online/xm-webapp/commit/3ff36e30813afcb7a27465ccdaedc4764eba0088))
* **entity-create:** filter type entity create ([#889](https://github.com/xm-online/xm-webapp/issues/889)) ([30a8741](https://github.com/xm-online/xm-webapp/commit/30a8741d70b25ff4fb348c7ec95d8bfde5d181ba))
* **entity-details:** fix filtering spec backport ([#895](https://github.com/xm-online/xm-webapp/issues/895)) ([1e3db1c](https://github.com/xm-online/xm-webapp/commit/1e3db1cf9d42f81175c5966f6096cadb958ab8a6))
* **entity-details:** fix mat deps ([df3083a](https://github.com/xm-online/xm-webapp/commit/df3083ade924344189c3b3cd7c341ab0e2835495))
* **entity-details:** fix update details ([#670](https://github.com/xm-online/xm-webapp/issues/670)) ([1b73c46](https://github.com/xm-online/xm-webapp/commit/1b73c46f816bb20e139b86b41d43591b4c66172b))
* **entity-list-card:** attempt move on mat-tabs ([f409997](https://github.com/xm-online/xm-webapp/commit/f409997145e25e2ae9915a0e0e86dd7f7b53b9c8))
* **entity-list-card:** fix aot build ([8214d30](https://github.com/xm-online/xm-webapp/commit/8214d30eaac8eb0a7ea95bdefe400d5ca09710b6))
* **entity-list-card:** fix aot build ([f25fb89](https://github.com/xm-online/xm-webapp/commit/f25fb8933818111db88455d4be6e17a57c7b39a2))
* **entity-list-card:** fix aot build ([ec95bad](https://github.com/xm-online/xm-webapp/commit/ec95badd16f53007a64ecf1d29e63062e13f398e))
* **entity-list:** fixing update list on modufucations ([#637](https://github.com/xm-online/xm-webapp/issues/637)) ([10fb009](https://github.com/xm-online/xm-webapp/commit/10fb009d74504aeac0d63b51f462fdd7fd38c150))
* **entity-list:** minor edits ([0606be3](https://github.com/xm-online/xm-webapp/commit/0606be3b0b3e522bf323ca4a4cf2feef91a7c092))
* **entity-list:** refactor ([67de12c](https://github.com/xm-online/xm-webapp/commit/67de12c37afd768ef7b1bcddea368845369a1f36))
* **entity-list:** refactor due to linter to fix ci build ([79945ee](https://github.com/xm-online/xm-webapp/commit/79945ee1e1f8b5b47dd2a91d92d7516a34738f60))
* **entity-list:** sort considering sortable prop ([#672](https://github.com/xm-online/xm-webapp/issues/672)) ([8f9d8fb](https://github.com/xm-online/xm-webapp/commit/8f9d8fb5cfe33af6678e269b24abb263af237b27))
* **entity-list:** using mat-paginator, providing translations ([#661](https://github.com/xm-online/xm-webapp/issues/661)) ([ed54cc1](https://github.com/xm-online/xm-webapp/commit/ed54cc1a15324672f3a9d4c481a9cd074711d37a))
* **entity-tags:** fix type key ([600f91c](https://github.com/xm-online/xm-webapp/commit/600f91c12b191586511562317fc3d7c30c547762))
* **entyti-list:** resolving spec to be used as dynamically loaded widget ([551fc29](https://github.com/xm-online/xm-webapp/commit/551fc29a952382a418fae126c7a9c8d15f6a7022))
* **enum-control:** add translate ([721deec](https://github.com/xm-online/xm-webapp/commit/721deec786625ace880b69945762fbd06cf92402))
* **enum-control:** use false value in enum ([da5d6f2](https://github.com/xm-online/xm-webapp/commit/da5d6f2ead7cba81447951885b730d1175f970a7))
* **enum:** add bool and number to enum control ([0e3782a](https://github.com/xm-online/xm-webapp/commit/0e3782a7175aa51738dff39cd85c57e6788e545f))
* **enum:** fix bool as object key ([dcca63c](https://github.com/xm-online/xm-webapp/commit/dcca63ca6b37c523643613fb6e126799266b90b6))
* **enum:** fix import path ([b4983b1](https://github.com/xm-online/xm-webapp/commit/b4983b105d15f063ddd935f37a404886f4e649bd))
* **environment:** fix package import ([f3121aa](https://github.com/xm-online/xm-webapp/commit/f3121aabfc32603b6a6c9d833b241ebcef555303))
* **ext-select:** adding ext select deep link support from master ([#632](https://github.com/xm-online/xm-webapp/issues/632)) ([af8535f](https://github.com/xm-online/xm-webapp/commit/af8535fb277f0f2e3abe212400b3a9ce3d1eec9e))
* **ext:** fix module path ([f34bea6](https://github.com/xm-online/xm-webapp/commit/f34bea6e201aa98018c9e51d50d3a051f3f07724))
* **file-control:** add required option to file-control ([a44ddc6](https://github.com/xm-online/xm-webapp/commit/a44ddc6e2907a15e8a823d2d261a58684b67913f))
* **file-control:** refactor add required option to file-control ([857694a](https://github.com/xm-online/xm-webapp/commit/857694aed86142f7138f0357bd984e17b6abe7a5))
* **file-control:** refactor add required option to file-control ([2709c68](https://github.com/xm-online/xm-webapp/commit/2709c68a313060ca24c64da4079d4fb449a3cc46))
* fixed field sizes ([a1bed58](https://github.com/xm-online/xm-webapp/commit/a1bed58a8cc99dad30a89e4933e5f10d7f9be06c))
* fixed margin icons table-border ([b9a21f1](https://github.com/xm-online/xm-webapp/commit/b9a21f1e053b7e9e772d8846b05c3f62e90b351a))
* fixing buttons styles ([#701](https://github.com/xm-online/xm-webapp/issues/701)) ([e3aa56b](https://github.com/xm-online/xm-webapp/commit/e3aa56b349896ea121dd5aca75095b76e3b1e3d1))
* fixing comments format ([50e6bab](https://github.com/xm-online/xm-webapp/commit/50e6bab9d4b9686cdde2702bed469769c8ecdabb))
* fixing problem with principal fields ([a2f94ee](https://github.com/xm-online/xm-webapp/commit/a2f94ee537deb5495115388ca928a9bd17900785))
* fixing styles and permissions ([#487](https://github.com/xm-online/xm-webapp/issues/487)) ([e78a3c4](https://github.com/xm-online/xm-webapp/commit/e78a3c4913f56c2cf10595a087094eec3d6611ad))
* **form-factory:** fix unit test ([c214960](https://github.com/xm-online/xm-webapp/commit/c2149608ca01644015d3f56d944699457db3388f))
* **form-factory:** remove empty string by default for control ([f40e5d8](https://github.com/xm-online/xm-webapp/commit/f40e5d84cd02ed35713b2efa24a3ed0cd4631506))
* **form-layout:** add formControl to form-layout ([2b47a55](https://github.com/xm-online/xm-webapp/commit/2b47a5583e513c23ecba103f4e6b51f241294869))
* **format:** correct array use in format ([b0855a0](https://github.com/xm-online/xm-webapp/commit/b0855a042c9fdf9912d35e909643231f331a019f))
* **format:** refactor format with array ([631f834](https://github.com/xm-online/xm-webapp/commit/631f834e645d6c7b73d33c57c4bd2235aae439c9))
* **format:** refactor format with array ([cb11bcd](https://github.com/xm-online/xm-webapp/commit/cb11bcddfeedcb62c45a19d61d113d11c6d6d693))
* **format:** type fix ([aa0e38e](https://github.com/xm-online/xm-webapp/commit/aa0e38ec9752b486950e9adafd4c447462e79280))
* **function-dialog:** providing jsf service ([c404325](https://github.com/xm-online/xm-webapp/commit/c4043257bcba0c8cb44f5f837f9dc23d6b6850c4))
* **function-service:** add headers for call function ([7949a0b](https://github.com/xm-online/xm-webapp/commit/7949a0b0b3ba11d8f4c1e926ba96365f735c2ce3))
* **gateway:** fix date ([1e5e778](https://github.com/xm-online/xm-webapp/commit/1e5e778f5676061b5f89ed4b9dc3db4a19525ff2))
* **global-error-handler:** use message stack ([c5eb29c](https://github.com/xm-online/xm-webapp/commit/c5eb29c42dc71f8ce50df6e17f5ec54f033b629b))
* **heatmap:** fix undefined error ([5d921bc](https://github.com/xm-online/xm-webapp/commit/5d921bc1c13bab21a783a4726e0dc79cf1579733))
* **heatmap:** performance issue ([47eb2e1](https://github.com/xm-online/xm-webapp/commit/47eb2e112a8b909ac9f10873d464f485eecc157c))
* **heatmap:** prevent event ([4823906](https://github.com/xm-online/xm-webapp/commit/4823906cbbcbcfe7c3f481119705fea673d06466))
* **http-client.rest:** fix adding params to http ([252840a](https://github.com/xm-online/xm-webapp/commit/252840ac47cbb13f6e08b14fdd5999af4b80aa52))
* **i18n:** fix translates ([7509868](https://github.com/xm-online/xm-webapp/commit/75098685ad6093e7a85b70328258a36f6d992989))
* **idle-logout:** fix deps ([2e6add7](https://github.com/xm-online/xm-webapp/commit/2e6add7b97d22c0309e1ffd6be693af58fc17a46))
* **idp-login:** error prop from null ([7cbcfba](https://github.com/xm-online/xm-webapp/commit/7cbcfba1c7e55607855efcd2176bdf6012f31de6))
* **idp-login:** error prop from null ([deb1c39](https://github.com/xm-online/xm-webapp/commit/deb1c39fe974e9397b9977c07cc7f6cf991f2007))
* **idp:** fixing unit  tests ([8d76018](https://github.com/xm-online/xm-webapp/commit/8d7601818bc5389f9d610f9dd38177cb03793f89))
* **idp:** fixing unit tests ([03a7cc2](https://github.com/xm-online/xm-webapp/commit/03a7cc2ebc655d0b4ae667be5b84cdb226abd2a2))
* **idp:** fixing unit tests ([0ba9550](https://github.com/xm-online/xm-webapp/commit/0ba955080d77c61b008760c87aa752b9e8826361))
* **idp:** fixing unit tests ([046b940](https://github.com/xm-online/xm-webapp/commit/046b9408c20ec4c9c6bdd85f259b1b0447d378d0))
* **idp:** fixing unit tests ([7b66d09](https://github.com/xm-online/xm-webapp/commit/7b66d098066b0f727ed30f27b89503665c3bdf63))
* **idp:** fixing unit tests ([bf7db6d](https://github.com/xm-online/xm-webapp/commit/bf7db6da1fbf1c11f58294e0204b619e62eb0e77))
* **idp:** fixing unit tests ([04a695f](https://github.com/xm-online/xm-webapp/commit/04a695f7b3ef78b8cb2a391dc2507f3e39f93b27))
* **idp:** login route redirect temp test ([bba897e](https://github.com/xm-online/xm-webapp/commit/bba897eb37bb5815870c66a7929dfa3d028fdd93))
* **idp:** saving idp config when on auth-jwt init ([3ea380a](https://github.com/xm-online/xm-webapp/commit/3ea380a680f507e94f012557d97393bd61550a99))
* **idp:** try disable service worker ([c1f032c](https://github.com/xm-online/xm-webapp/commit/c1f032cf09c916d6c17d1ae4f1a194a61fcbaa91))
* import swal for entity-card-compact ([b69d5ee](https://github.com/xm-online/xm-webapp/commit/b69d5ee716dc6b188c78dd70bd1de4440c291e72))
* incorrect page assign [#133](https://github.com/xm-online/xm-webapp/issues/133) ([2a49336](https://github.com/xm-online/xm-webapp/commit/2a49336dc4477483444e08fd6f3058a3f62ee09b))
* **jsf-file-uploader:** fixing default styling ([78f897f](https://github.com/xm-online/xm-webapp/commit/78f897f098bfc21a7cbb11a0ea25a461f2aa733f))
* **jsf-widget:** add widget for webapp dynamic widgets ([591ad28](https://github.com/xm-online/xm-webapp/commit/591ad2856618126ed8a884603231e9afdfa141ce))
* **jsf-widget:** additioanl params for file upload widget ([9da5a62](https://github.com/xm-online/xm-webapp/commit/9da5a623ddecb52988ab56e26bcfdab2010a138f))
* **jsf-widgets:** fix multi-lang input widget ([#681](https://github.com/xm-online/xm-webapp/issues/681)) ([8fd63f5](https://github.com/xm-online/xm-webapp/commit/8fd63f5cc7d884375bb3d0e21bb34bdcfcd1ad3b))
* **layout-module:** fix module import ([9bea1a6](https://github.com/xm-online/xm-webapp/commit/9bea1a6da8601bb9f1e231888c1da6464ebe3ead))
* **link-list:** correcting imports ([b752ca3](https://github.com/xm-online/xm-webapp/commit/b752ca33cc7ea752663cf4dc5e6cfe79998564e1))
* **link-list:** using vars in scss ([0c2c8ec](https://github.com/xm-online/xm-webapp/commit/0c2c8ecc91841e6d62617becbcedeaa887f61c06))
* **link-view:** fix defaults assign ([#721](https://github.com/xm-online/xm-webapp/issues/721)) ([63fb713](https://github.com/xm-online/xm-webapp/commit/63fb713ef250f1c9375a0d00385cb7eab5949151))
* **linked-in:** fix translates key ([9a625be](https://github.com/xm-online/xm-webapp/commit/9a625bea10737c7d91048765e1154148b7b3f23e))
* **links-group:** remove padding ([16b218e](https://github.com/xm-online/xm-webapp/commit/16b218e3cadfdc71e56b3ef8f347a6e6f489650e))
* **links-tree:** fixing tree old behavior from master ([#688](https://github.com/xm-online/xm-webapp/issues/688)) ([51bfb21](https://github.com/xm-online/xm-webapp/commit/51bfb21ecd7bce7f6cacd9620299722e5bf8cfed))
* **loader:** remove parent class xm-disabled ([c2995b3](https://github.com/xm-online/xm-webapp/commit/c2995b3c87649f76184cea2260a1f48134df6529))
* **loading:** fix class mapping ([e3d0119](https://github.com/xm-online/xm-webapp/commit/e3d0119e6b7c34ed83c5fa3838daef42d0866512))
* **location-detail-dialog:** increased max-height ([ef58bf0](https://github.com/xm-online/xm-webapp/commit/ef58bf00b7054a5ccd3f43827062d0b6fec8d4b7))
* **location-detail-dialog:** refactor, improvement ([a997eb5](https://github.com/xm-online/xm-webapp/commit/a997eb5b2fe063712dcede3574a0f48b3b9e98da))
* **location-detail-dialog:** translations, console errors ([1671360](https://github.com/xm-online/xm-webapp/commit/1671360b245fc66959e32045a08f80330234d198))
* **location:** regexp backport from master ([a9c7e01](https://github.com/xm-online/xm-webapp/commit/a9c7e012a825e20302635ff495a602e3ccc877a1))
* **login-terms-and-conditions:** fixing terms in develop ([#621](https://github.com/xm-online/xm-webapp/issues/621)) ([5c354d9](https://github.com/xm-online/xm-webapp/commit/5c354d90b0dc0a076c774d272e5ea60e46eef217))
* **login-translation:** incorrect button key ([42a8f11](https://github.com/xm-online/xm-webapp/commit/42a8f110ace8a001a58e847c754b3d8e4313d8b6))
* **login:** fix redirect url ([8bac69a](https://github.com/xm-online/xm-webapp/commit/8bac69a255a93df5738079448cfe27878c5948fd))
* **login:** styles ([89e5316](https://github.com/xm-online/xm-webapp/commit/89e5316c629dde45a971839d0c5a94f65c70b480))
* **main-layout:** adding auth state to html class ([d7a0312](https://github.com/xm-online/xm-webapp/commit/d7a0312c86c6c9263ece422f5c270805e916b4c4))
* **main-theme:** fix mobile view with navbar ([5530217](https://github.com/xm-online/xm-webapp/commit/553021744db3911475388b997101c523b83b79b9))
* **map-location:** fixing point coordinates regexp ([f009ffd](https://github.com/xm-online/xm-webapp/commit/f009ffde5886f8d5fb3328029dfcb82cefde9c84))
* mat input, entry ([12744b4](https://github.com/xm-online/xm-webapp/commit/12744b49de4e2d707e1b01c6a189a3851bed7564))
* **mat-dialog:** adding controls ([#654](https://github.com/xm-online/xm-webapp/issues/654)) ([957b81f](https://github.com/xm-online/xm-webapp/commit/957b81f435a094d62e640a03dc1383283f80ea2c))
* **mat-icon:** fix correcting indentation mat-icons in round buttons ([bdd2039](https://github.com/xm-online/xm-webapp/commit/bdd203981cc1944d7b5ed922be7b5a617b981836))
* **mat-icon:** main style centers mat-icon ([7b1345f](https://github.com/xm-online/xm-webapp/commit/7b1345fdbfe9cd2d938c49f405ff4da440b7ba3c))
* **md-editor:** fix editor full screen mode overlay ([#648](https://github.com/xm-online/xm-webapp/issues/648)) ([5f6b2d2](https://github.com/xm-online/xm-webapp/commit/5f6b2d215b4817003ae714466dff588d68a7c5a4))
* **menu-item:** fixing long string in menu item ([#673](https://github.com/xm-online/xm-webapp/issues/673)) ([f0c85bf](https://github.com/xm-online/xm-webapp/commit/f0c85bf9665c43ae5e0c59ac76297934a9c41cce))
* **menu:** dashboard 403 ([0e74f99](https://github.com/xm-online/xm-webapp/commit/0e74f9984e9f15198a31535eee493c08a841e073))
* **menu:** fix group name priority ([e7cc519](https://github.com/xm-online/xm-webapp/commit/e7cc5196fbf42b4ec4bf22abc4c2eac9f0c32882))
* **menu:** fix link path ([febbe6a](https://github.com/xm-online/xm-webapp/commit/febbe6a1e08f94935756385a533d5ca338cea6df))
* **menu:** permission MATRIX.GET ([3304113](https://github.com/xm-online/xm-webapp/commit/33041137891762cfa97e68a26ba5df149e4ee265))
* **module-language.helper:** restore ([fba2dae](https://github.com/xm-online/xm-webapp/commit/fba2dae7b2f0ee1bd4ef30929168f53179e12408))
* **module-loader:** fixing rootName considering names with multiple dashes ([e3fd379](https://github.com/xm-online/xm-webapp/commit/e3fd37931e52523bbea10b4f52a2aaf69d41fcbf))
* **module-loader:** lint fix ([d45dcf8](https://github.com/xm-online/xm-webapp/commit/d45dcf8dd393af7c506eb6e5d3e2ad49fe8ac057))
* **momentjs:** adds momentjs to language service init ([5f6ea9a](https://github.com/xm-online/xm-webapp/commit/5f6ea9a2edcde047af33861f292a300520215064))
* move styles to angular-material and bootstrap ([89e677c](https://github.com/xm-online/xm-webapp/commit/89e677c4d5f0a75e966a4e79dbc7faab6fec7553))
* move to bootstrap-xm-override-table ([c617d02](https://github.com/xm-online/xm-webapp/commit/c617d02609aac10ee13ab6dcc798ff72c03ed547))
* **navbar-dashboard:** fix multi subscription ([03b2172](https://github.com/xm-online/xm-webapp/commit/03b2172c5d50e7e19ce8af0c377cd304073a5866))
* **navbar-title:** remove showLogo ([a531458](https://github.com/xm-online/xm-webapp/commit/a5314580ec144e04b5ec5c21e113ac777c33574a))
* **navbar:** add custom edit ([e4e023a](https://github.com/xm-online/xm-webapp/commit/e4e023a3928c97e4b58ce1bef73b72c9537ec819))
* **navbar:** fix remove mat-navbar ([82fef83](https://github.com/xm-online/xm-webapp/commit/82fef83e5deef2b6dc5d27115f2144fd7a9e6a21))
* **navbar:** fix scroll ([8d7f7f5](https://github.com/xm-online/xm-webapp/commit/8d7f7f5ee28cd7121a99e262245eeb936575db07))
* **navbar:** fix widget update params ([3132506](https://github.com/xm-online/xm-webapp/commit/3132506f34dda765b01efc747d0e45034f3fe3a7))
* **navbar:** overflow ([9fe1f7d](https://github.com/xm-online/xm-webapp/commit/9fe1f7d9e0017514f546472175a97547eafba291))
* **navbar:** remove static ([186bd3a](https://github.com/xm-online/xm-webapp/commit/186bd3afc56732b62f65d9d5888e3738db156ca7))
* **navbar:** return ng-deep ([0699fd0](https://github.com/xm-online/xm-webapp/commit/0699fd06937e598ec9f2797883a9220dfc9f2867))
* **ng-accessor:** add subscription to default value ([dc1a8c6](https://github.com/xm-online/xm-webapp/commit/dc1a8c62f883034e70495def53bdaee84112f706))
* **ng-accessor:** fix disabled loop ([62bda9d](https://github.com/xm-online/xm-webapp/commit/62bda9d4a595fc7ad374342729e62e722c94ecaa))
* **ng-accessor:** fix ngModel two-way bing ([2424222](https://github.com/xm-online/xm-webapp/commit/2424222998fce5432b1ce72958677c704a4addd6))
* **ng-accessor:** fix update from formControl ([dac47be](https://github.com/xm-online/xm-webapp/commit/dac47becd1a4158315cfb3fe15f6ac57de7f1acf))
* **ng-deep:** wrap with host ([34355ac](https://github.com/xm-online/xm-webapp/commit/34355acc226603363d49f4972677c6b080e41b95))
* **notifications:** fix-init, styling ([#668](https://github.com/xm-online/xm-webapp/issues/668)) ([97c8270](https://github.com/xm-online/xm-webapp/commit/97c8270ad2e739fe2549dca4bdff1d5e1aa74a12))
* **notifications:** refactor using native mat-menu ([aa72d6d](https://github.com/xm-online/xm-webapp/commit/aa72d6d0752871be9b9710ab7458c34804e55647))
* **old-browsers-popup:** decreased chrome version to prevent error on tests ([7dbd563](https://github.com/xm-online/xm-webapp/commit/7dbd56366e4d9e2d1317dbbf4150f6cdf8b757ce))
* **old-browsers-popup:** fixed chrome version ([97d3691](https://github.com/xm-online/xm-webapp/commit/97d3691af442b571505fac55bce727a66029dab0))
* **olnd-browsers:** downgrade to 76 ([e7bb63f](https://github.com/xm-online/xm-webapp/commit/e7bb63fed3a1f9e4a0fbe3db67f107aec163d4a8))
* **packages-styles:** adding xm-button-group component styles ([a120c97](https://github.com/xm-online/xm-webapp/commit/a120c97a7f3aaeda5a72dea4e3c196fe1bf9f1a3))
* **page-change-store:** tab onSubscribe emits Pristine state ([a93d297](https://github.com/xm-online/xm-webapp/commit/a93d29775aae9df62dc6a0d8a2e1fa0fd323e14b))
* **page-ribbon:** fix getAuthenticationState ([56acf3a](https://github.com/xm-online/xm-webapp/commit/56acf3ad53117f8e05e9385d118c5410476fc915))
* **page:** add PageChangesStore, add PendingChangesGuard ([a9ac1ff](https://github.com/xm-online/xm-webapp/commit/a9ac1ff54cca22a775e50b0a592ea8ef6fafb8fe))
* **password:** fallback to the first appropriate login ([c3fd87e](https://github.com/xm-online/xm-webapp/commit/c3fd87e033e543151d6b5a9fc89a8c780d1e1c74))
* **permission:** fix folder name ([5d68525](https://github.com/xm-online/xm-webapp/commit/5d68525c753067236ecd77ff8a8b7ac40e2ef43b))
* **permission:** fix SuperAdmin permission change ([97d3861](https://github.com/xm-online/xm-webapp/commit/97d3861932fb1404fe4e4b16367a25fb81da8c97))
* **permission:** replace takeUntil with subscription ([94723c6](https://github.com/xm-online/xm-webapp/commit/94723c674a5b043f23976338a463ff4553112726))
* **phone-number:** add default-value ([e1494de](https://github.com/xm-online/xm-webapp/commit/e1494dee8e3c4f159c420664a581cc5acde099b8))
* **powered-by:** fix config access ([d1c59b6](https://github.com/xm-online/xm-webapp/commit/d1c59b64b01bd385f961a9eadd289009463b4c20))
* **powered-by:** fix powered by in develop ([#616](https://github.com/xm-online/xm-webapp/issues/616)) ([af84abf](https://github.com/xm-online/xm-webapp/commit/af84abf31cf62ecaa8789e1b2229d4dc411b4e80))
* prevent showing terms modal if already shown ([#551](https://github.com/xm-online/xm-webapp/issues/551)) ([f6af0a0](https://github.com/xm-online/xm-webapp/commit/f6af0a020b9b76cdf101965c77c490045fcc6214))
* **principal:** add session ([d07fc6d](https://github.com/xm-online/xm-webapp/commit/d07fc6d2bfd1b558bb4149331ee3d186f209e4cc))
* **principal:** connect to AuthRefreshTokenService ([1ed72a5](https://github.com/xm-online/xm-webapp/commit/1ed72a5eb222bb3bc0e59a5329f35630739dcf8c))
* **register:** styles ([31e0944](https://github.com/xm-online/xm-webapp/commit/31e094425fb8f2c43829f5e9383e772d74dd8a14))
* remove 'npm run prebuild' from 'build' ([9cac8b8](https://github.com/xm-online/xm-webapp/commit/9cac8b870aba713c03c10e230c668a9a983a810b))
* remove multi XmEntitySpecWrapperService injections ([45cd37c](https://github.com/xm-online/xm-webapp/commit/45cd37c25ff3fe2ea0575ceba322b37fbbdc2944))
* **request-cache:** add unsubscribe ([bcf62f1](https://github.com/xm-online/xm-webapp/commit/bcf62f1a0aed54cd1cc3ea277279b21564b94c67))
* **request-cache:** fix @TakeUntilOnDestroy() ([0e4f1ef](https://github.com/xm-online/xm-webapp/commit/0e4f1ef8246b4dd7b79536800371c857e76795fa))
* **ribbon:** fix icon ([f97f84e](https://github.com/xm-online/xm-webapp/commit/f97f84ef31fd597f42ec0cbaf67c8118279f574b))
* **route-change-animation:** remove player after animation complete ([7e7b91e](https://github.com/xm-online/xm-webapp/commit/7e7b91e4a92334428f7690dbaf3bbf825a0e6a53))
* **route-change-animation:** reset styles after animation ([c764d42](https://github.com/xm-online/xm-webapp/commit/c764d42e526f962e53ddc86882064d384f22a3f5))
* **rxjs-operators:** fix import ([f4d5732](https://github.com/xm-online/xm-webapp/commit/f4d57320bdbe4a8d8680d271757ceabc86a1aebd))
* **search-glodal:** fixing broken search ([144c41c](https://github.com/xm-online/xm-webapp/commit/144c41c3770000007cb3fb839ee3c04fc757fa8c))
* **shared:** fix IId import ([209afe1](https://github.com/xm-online/xm-webapp/commit/209afe1b2cb3a7ed57638dec3865669e4561fda5))
* **sidebar:** fix arrow down animation ([9ef35c3](https://github.com/xm-online/xm-webapp/commit/9ef35c3bb2b8ea46c109507c79769aaaae833bf4))
* **sidebar:** fix multi requests ([8ef5140](https://github.com/xm-online/xm-webapp/commit/8ef51409482f4e66a74c9a374b1c27a34915c9cb))
* **sign-in-up-widget:** refactor + fixed styles ([9ccb1ca](https://github.com/xm-online/xm-webapp/commit/9ccb1caa06528143d28b350ad55de22e9f1f4f12))
* **spec-manager:** add AceEditorModule deps ([158d133](https://github.com/xm-online/xm-webapp/commit/158d133337d6a3f736ff00cddc3e8b3dba690030))
* **spec:** fix change data and form specs ([#593](https://github.com/xm-online/xm-webapp/issues/593)) ([d4e82c2](https://github.com/xm-online/xm-webapp/commit/d4e82c295664a13d322ceac14706eb419c1361f4))
* **stats-widget:** fixing layout and styles ([#683](https://github.com/xm-online/xm-webapp/issues/683)) ([319e45e](https://github.com/xm-online/xm-webapp/commit/319e45e3f4b0ffe207ea4af1057b703339e231ac))
* **styles:** add loading ([d7971e1](https://github.com/xm-online/xm-webapp/commit/d7971e158bc44f58bff5023dde5b9c59e2c0e810))
* **styles:** remove css postfix ([7c5942e](https://github.com/xm-online/xm-webapp/commit/7c5942e76e8d5ec11f26c26b28137948d672992a))
* **switch-theme:** changeTheme catch undefined argument theme ([bb1ded4](https://github.com/xm-online/xm-webapp/commit/bb1ded4d752ed7b11d1ee1c4d24c5d63016f55e7))
* **switch-theme:** fix next theme ([c5132f0](https://github.com/xm-online/xm-webapp/commit/c5132f080884e5ff952bd358c49abc5f9a005cab))
* **switch-theme:** fix theme assign ([6d4a6b4](https://github.com/xm-online/xm-webapp/commit/6d4a6b4c8af59eb15174de11c52fa1430300d1ea))
* switching to translate pipeline for function-list-section-compact ([5f395e6](https://github.com/xm-online/xm-webapp/commit/5f395e65d44ef5050f2cf51a92a4be93c006ec2f))
* **table:** split sortable header ([20415d3](https://github.com/xm-online/xm-webapp/commit/20415d3a2509677344b717f8bc9d1d695c3521f6))
* **tests:** add packages dir ([88bac9f](https://github.com/xm-online/xm-webapp/commit/88bac9fa34dc7cb54c9d0680647ded46208aebd8))
* **tests:** fix tests ([dc0c53d](https://github.com/xm-online/xm-webapp/commit/dc0c53db3e11140a24e1828483bbcf602207615c))
* **text-control:** fix options value check ([bf48c2f](https://github.com/xm-online/xm-webapp/commit/bf48c2fcd1d3a4a249202ded8c4ca84a087cb1eb))
* **text-control:** id mapping ([104eae6](https://github.com/xm-online/xm-webapp/commit/104eae6c4b586385ffcfa72ff811abce32005694))
* **text-control:** rollback ngModel ([a6fef01](https://github.com/xm-online/xm-webapp/commit/a6fef013c0ec2e6e985d5ef6f7cc0b534384a846))
* **text-view:** able print zero value for xm-text-view ([04a5fc3](https://github.com/xm-online/xm-webapp/commit/04a5fc39fdaafd7806371ca088a247e49abde2e2))
* **text:** fix number to string check ([1e0877a](https://github.com/xm-online/xm-webapp/commit/1e0877a8c37b6c8b21361b83e94b610cc10157af))
* **text:** translation module import ([dce2558](https://github.com/xm-online/xm-webapp/commit/dce2558611121fce749bed518c92f5ee53234910))
* **timeline:** fixing styles in timeline ([e78e009](https://github.com/xm-online/xm-webapp/commit/e78e0099f1a632016da42eaf7d5f1582263e6152))
* **title:** add getCurrentActiveRoute filter ([39cfed7](https://github.com/xm-online/xm-webapp/commit/39cfed76fced249a96b11e89cb03e34db7acc8ae))
* **transform:** add empty string check ([072dc7f](https://github.com/xm-online/xm-webapp/commit/072dc7fcf248d71f1b25469f2f8518d5e4308cb2))
* **translate:** fix number type ([78f134d](https://github.com/xm-online/xm-webapp/commit/78f134dc15565fb65f8c88775153ad90a7a7bc9c))
* **translate:** fix value ([12afd19](https://github.com/xm-online/xm-webapp/commit/12afd19fa07d34ea48eb7620b2f1b6b46e88bba7))
* **translates:** merging only custom translates with values ([#633](https://github.com/xm-online/xm-webapp/issues/633)) ([344da82](https://github.com/xm-online/xm-webapp/commit/344da82f172908e2bfe02a7de22d91430d4a007d))
* **translations:** fix layout ([a87ed88](https://github.com/xm-online/xm-webapp/commit/a87ed88d53b7c16ef624fbaacef88a9fb0e9fd73))
* **tsconfig:** exclude environments ([f59b0e9](https://github.com/xm-online/xm-webapp/commit/f59b0e9b17e47524fe0c95b075d9e00dd0010e0e))
* **tsconfig:** fix rebase conflicts ([21c4478](https://github.com/xm-online/xm-webapp/commit/21c4478eda5ac7ca0ed23a706af9a17009104d58))
* **tsconfig:** remove old paths ([b68a1de](https://github.com/xm-online/xm-webapp/commit/b68a1de0d706f184191395f9b66f34753b4c8708))
* **twitching-ui:** remove canvas when hidden ([84e969b](https://github.com/xm-online/xm-webapp/commit/84e969bad420967ea17dc0203a31a4a9682b694f))
* unnecessary stripe ([09a1cf1](https://github.com/xm-online/xm-webapp/commit/09a1cf1abb5d3e58ea8a46179771965f9d888f4a))
* unnecessary stripe ([89b205c](https://github.com/xm-online/xm-webapp/commit/89b205ce8177f303d76976309e3724ea6064d940))
* **upgw-346:** date control add useUtc in options ([b885171](https://github.com/xm-online/xm-webapp/commit/b885171fcb146655d528dbfb5343d592802b521d))
* **user-management:** add resetPasswordV2 ([b8a27ad](https://github.com/xm-online/xm-webapp/commit/b8a27ad0a37c65dfb986c66022ccceeb5e8de04a))
* **user:** add user public skip handler ([1610da4](https://github.com/xm-online/xm-webapp/commit/1610da4199f95f00af62222ddde94c3ea36ed1d3))
* **validator-processing-service:** return ValidationFc instead of call it ([0e8d7be](https://github.com/xm-online/xm-webapp/commit/0e8d7be783b8a1e46a00c08b9e33600c6e9b151d))
* **validator-processing.service:** fix error on empty val ([6e940b3](https://github.com/xm-online/xm-webapp/commit/6e940b304209277dab3b4dd8bb89cf0d21260f4b))
* **validator-processing.service:** fix formatToDateTime ([15ccda9](https://github.com/xm-online/xm-webapp/commit/15ccda9cada71014041d909609bd5d58ef280352))
* **validators:** add check for empty string value, add translates ([15fc176](https://github.com/xm-online/xm-webapp/commit/15fc1764ebe0c92f179ed57eeaefb995c8417e09))
* **validators:** add translation for valueMoreThanIn ([96bf5f4](https://github.com/xm-online/xm-webapp/commit/96bf5f4962d4deb29a62e93fbc199f3d11c0e272))
* **validators:** add valueMoreThanIn & valueLessThanIn validators ([b058217](https://github.com/xm-online/xm-webapp/commit/b0582176fb091a457dea9ebd8318e7de0d50961f))
* **weather-widget:** replace list-height to line-height. ([b245099](https://github.com/xm-online/xm-webapp/commit/b24509917ac3ba79a8aecfca3bdce3376ce5bf5e))
* **web-app:** remove incorrect value change ([05961ba](https://github.com/xm-online/xm-webapp/commit/05961ba83ba27dd7ed0be73e457ef9a4543e427a))
* **webapp:** remove lib with xss ([f8e74ec](https://github.com/xm-online/xm-webapp/commit/f8e74ecc395dc9abe1ce605a77c6c5b7e5da8107))
* **webapp:** remove unused data attr to prevent xss ([a165d3e](https://github.com/xm-online/xm-webapp/commit/a165d3ed747f54f2e66cbb240fb07872acce6e07))
* **widget-bc:** fix incorrect mapping ([87b1a8d](https://github.com/xm-online/xm-webapp/commit/87b1a8dbb8d849c6ee059da24b85ea48b3561628))
* **xm-alert:** remove xm alert ([37e2efe](https://github.com/xm-online/xm-webapp/commit/37e2efe0760896430eb7a0432118164d918e3432))
* **xm-alert:** rollback XmAlertComponent, JhiAlertService usage ([76edf26](https://github.com/xm-online/xm-webapp/commit/76edf268138480e2a246c9488c3cc69d736b3a20))
* **xm-balance:** resolve path ([348f3db](https://github.com/xm-online/xm-webapp/commit/348f3db02901ecbe6e6b18b3027bf884db9ae478))
* **xm-bool:** change icons to field ([5afb1d8](https://github.com/xm-online/xm-webapp/commit/5afb1d8f3bd69e760f85ac5bf2f8838c24f150bd))
* **xm-constants:** change minWidth to 120px ([#702](https://github.com/xm-online/xm-webapp/issues/702)) ([3fa3d43](https://github.com/xm-online/xm-webapp/commit/3fa3d4306f79731f01e4199744442dfc7a4223db))
* **xm-data-time:** fix default locale ([bcc01d3](https://github.com/xm-online/xm-webapp/commit/bcc01d31f6e80aa45d30d5f6be96ef8db9d4f28b))
* **xm-date-control:** add interface, make errors option parameter ([7c04e04](https://github.com/xm-online/xm-webapp/commit/7c04e04d85fa9f69c6f1ba32a5ab90f22a84e070))
* **xm-date-time:** fix account error ([28dc260](https://github.com/xm-online/xm-webapp/commit/28dc260ecad4d13711aa12d97cf9b13b1753beb9))
* **xm-entity-spec-wrapper:** fix null value ([00a97dc](https://github.com/xm-online/xm-webapp/commit/00a97dcd200f0b1620d1054011b60bc20a0dc70d))
* **xm-entity-spec-wrapper:** remove logout deps ([6baad2c](https://github.com/xm-online/xm-webapp/commit/6baad2c9e9f08b4d33aa1332ea25a7cb52963a58))
* **xm-navbar-arrow-back:** clear ViewEncapsulation ([1bac057](https://github.com/xm-online/xm-webapp/commit/1bac0573dd32d1ee7890b334266385c4c63a3181))
* **xm-navbar-arrow-back:** clear ViewEncapsulation ([ce60e16](https://github.com/xm-online/xm-webapp/commit/ce60e16d0801281bf68a21e988adf5ca7d95c338))
* **xm-navbar-arrow-back:** set arrow back to center ([25dc5be](https://github.com/xm-online/xm-webapp/commit/25dc5be06e32aee1c6662ee198777d2fee72ffe2))
* **xm-per-page:** add CommonModule ([94e5226](https://github.com/xm-online/xm-webapp/commit/94e52269f7b14cbe64f1baace3eb9cc15f7b2f8f))
* **xm-permission-service:** add isSuperAdmin function ([053e084](https://github.com/xm-online/xm-webapp/commit/053e08414a4ee485a12215433b485816c51c64f1))
* **xm-permission:** fix async permission ([e9b38ca](https://github.com/xm-online/xm-webapp/commit/e9b38caf094e162a46b0667eeeabb8bb62e68507))
* **xm-permission:** fix empty user ([77800b9](https://github.com/xm-online/xm-webapp/commit/77800b9426b6de3b833f8c0d2dc24271de4b5126))
* **xm-permission:** fix null data ([ced1df5](https://github.com/xm-online/xm-webapp/commit/ced1df53a91b83584b084da4947cade4f658fc98))
* **xm-ribbon:** change to async request ([7105b60](https://github.com/xm-online/xm-webapp/commit/7105b6064cdf9242353f8b12ecea1515c6cadd15))
* **xm-sidebar-right:** fix factory resolver ([e44b641](https://github.com/xm-online/xm-webapp/commit/e44b641be11e327206642d914492492c37baccad))
* **xm-text-control:** fix options assign ([86fd46d](https://github.com/xm-online/xm-webapp/commit/86fd46d8faaa06fe889c6aa2389c7c3de1a83ae3))
* **xm-text-control:** fix unit test ([48b3e86](https://github.com/xm-online/xm-webapp/commit/48b3e864c179843e601894ec5d6e3902b17ae50b))
* **xm-text-join:** add case for date value ([b307829](https://github.com/xm-online/xm-webapp/commit/b3078298a64cd06fc775de90af61f83dd0bc4fa9))
* **xm-user:** add permissions ([602de15](https://github.com/xm-online/xm-webapp/commit/602de155cad5963805e194d1db0efaf65959d980))
* **xm-webapp:** checkbox administration/ list of pages restriction ([64b0722](https://github.com/xm-online/xm-webapp/commit/64b072248c37647c37d09223e5f52916463cfd4c))


### Features

* **#295:** add "@xm-ngx/components/no-data", "@xm-ngx/components/language" ([c674a6b](https://github.com/xm-online/xm-webapp/commit/c674a6b6f8ba826bdab93fdde653864ae433d5c4)), closes [#295](https://github.com/xm-online/xm-webapp/issues/295)
* **#301:** add build-themes.js ([3a286ec](https://github.com/xm-online/xm-webapp/commit/3a286ecc4c4aefaa941d7015d7fc65aa4c9fa66b)), closes [#301](https://github.com/xm-online/xm-webapp/issues/301)
* **25488:** backport of pr [#799](https://github.com/xm-online/xm-webapp/issues/799) from master ([6df977e](https://github.com/xm-online/xm-webapp/commit/6df977e83c56c8cc1113a09bd0b95fe923be0143))
* **25529-read-only-flag:** making backport of pr [#802](https://github.com/xm-online/xm-webapp/issues/802) from master ([7d4fbbb](https://github.com/xm-online/xm-webapp/commit/7d4fbbbc7dcb7af3d623a8b6950ac629f083f9ad))
* **ace-editor:** add xm-* to name ([7584f8d](https://github.com/xm-online/xm-webapp/commit/7584f8dcaa14adeaa9c6c626397ce90de7277802))
* **ace-editr:** add AceEditorThemeSchemeAdapterDirective ([c3561b3](https://github.com/xm-online/xm-webapp/commit/c3561b3a0217b9eef8bd517b7ad696d6134b601a))
* **ace:** add search ([a688d4e](https://github.com/xm-online/xm-webapp/commit/a688d4e8a1d053657f43d818662e5ebf1747a047))
* add @kolkov/angular-editor ([4a5aa85](https://github.com/xm-online/xm-webapp/commit/4a5aa8557903b71b43996870ffad36bad675babe))
* add @xm-ngx/components/xm-ribbon ([8d028aa](https://github.com/xm-online/xm-webapp/commit/8d028aa8b4e96b074835056b102dfe3e64127fce))
* add @xm-ngx/ext ([6629f7d](https://github.com/xm-online/xm-webapp/commit/6629f7d0b687c81d22ba7749e2e04140048745a4))
* add @xm-ngx/xm-balance ([168aa46](https://github.com/xm-online/xm-webapp/commit/168aa46dc52fd6840016400e816bb0b001773b59))
* add BoolComponent ([2c9422a](https://github.com/xm-online/xm-webapp/commit/2c9422a45b3acbcec7ee6fa48063d842ef156b51))
* add debug ([852f6cd](https://github.com/xm-online/xm-webapp/commit/852f6cd77aa82d8189c95e9857c1a4d0fa0972d6))
* add innerHtml ([a7933ac](https://github.com/xm-online/xm-webapp/commit/a7933ac36d9db29fb0e842450a3b738265f1f1f6))
* add NavbarDashboardEditWidgetModule ([d3f7895](https://github.com/xm-online/xm-webapp/commit/d3f78950e610e14ca645fe7fdd93e1553d63c3a6))
* add permission.guard ([a47582f](https://github.com/xm-online/xm-webapp/commit/a47582f0c01a5f6b719c74fdb468dfcdc7ed9443))
* add proxy interceptor ([952f2d9](https://github.com/xm-online/xm-webapp/commit/952f2d9c3459c50dba695fdfcfdb97fa2077f014))
* add PROXY_INTERCEPTOR ([c84c3bb](https://github.com/xm-online/xm-webapp/commit/c84c3bbb81f3544fd09f7065ad5d22bb87bfbf36))
* added no data text options for empty lists ([b0b2a7d](https://github.com/xm-online/xm-webapp/commit/b0b2a7dddfcb0575678e0cbd960e8ec4c472623c))
* added options to hide links if no links present ([070b3d6](https://github.com/xm-online/xm-webapp/commit/070b3d64761968fbd725b5118aa5512e1d011132))
* adding export and import dialogs and services ([537b248](https://github.com/xm-online/xm-webapp/commit/537b2487b9af8e7885e0774184eef80c3fa97f6f))
* adding methods to save and map export data ([31539c9](https://github.com/xm-online/xm-webapp/commit/31539c9c3a6bf9994b9d109ec99de01c66e933d5))
* **admin-base:** save to query params ([16b6867](https://github.com/xm-online/xm-webapp/commit/16b686712b391f42c9d173ae382515d02738fa19))
* **admin-config:** add entity-spec-mng ([48c9537](https://github.com/xm-online/xm-webapp/commit/48c9537026c563c814d3107463ff110a55a013e7))
* **admin-registry:** add @xm-ngx/components/feedback ([e5a7e41](https://github.com/xm-online/xm-webapp/commit/e5a7e413ad5b52b35ab0c7fadf17820204b6ae60))
* **admin-registry:** add translations ([ee2420f](https://github.com/xm-online/xm-webapp/commit/ee2420fb2fbbda3a363bded8eb009883d0893e57))
* **admin:** duplicate dashboard ([417c352](https://github.com/xm-online/xm-webapp/commit/417c3522b871a62262e8d3bc52c6d0f29cca5f9e))
* **administration-client-management:** add toggle-lock ([0653d45](https://github.com/xm-online/xm-webapp/commit/0653d45e6fa3f20c06e8c82fe1a1397a5547bb09))
* **administration:** add component to manage dashboards permission ([a8a408a](https://github.com/xm-online/xm-webapp/commit/a8a408acfbe120daa290875a91cc80577e4c1774))
* **administration:** rename Widget to DashboardWidget ([bebe264](https://github.com/xm-online/xm-webapp/commit/bebe264669d3b479448fac16be794693fc56bbf4))
* **admin:** move user, role, client managment ([21f5c31](https://github.com/xm-online/xm-webapp/commit/21f5c31c7d12a5d13daf302852255b8745838f53))
* **admin:** remove old dashboard management widget ([e3cb1a9](https://github.com/xm-online/xm-webapp/commit/e3cb1a93c91ecd61717fb6e3dde11d1e80f4e3e7))
* **admin:** rename widget components ([a57a494](https://github.com/xm-online/xm-webapp/commit/a57a494d93e383fe68012632d4aa46a32540427f))
* **admin:** rename widget components ([853cab7](https://github.com/xm-online/xm-webapp/commit/853cab74a31391717645da3ded378231f77b3c38))
* **ajsf:** add ru and uk locales ([e78cb7c](https://github.com/xm-online/xm-webapp/commit/e78cb7ca3526fe8c164bb2063e9b5269aca394dc))
* **alert:** add deleting ([b1515bf](https://github.com/xm-online/xm-webapp/commit/b1515bfdc12c652ff65d468546d43d322db007e9))
* **alert:** fix type, add default options ([5325f3b](https://github.com/xm-online/xm-webapp/commit/5325f3b8c9050b9212622c141cfdcab1d838f596))
* **angular:** prod namedChunks true ([7ebf1ee](https://github.com/xm-online/xm-webapp/commit/7ebf1ee1fded13fc539b594527840729519672a1))
* **api-docs:** get api list from config option ([ce3828d](https://github.com/xm-online/xm-webapp/commit/ce3828d3f8430d105715d29fea96c1bfd19aca39))
* **app:** adding memory for dev and dev-idp tasks ([dd9a673](https://github.com/xm-online/xm-webapp/commit/dd9a673de2a6ea6edffbe51f85efc1edad1f2ce6))
* **app:** adding prop to dev server task, propper login from calback ([e027344](https://github.com/xm-online/xm-webapp/commit/e027344cce6a7eaba0aba6745c08bb9098965c94))
* **app:** enabling SW, exluding oauth data source ([e5f7a47](https://github.com/xm-online/xm-webapp/commit/e5f7a47485edef03feb85f2726f4f70b4737514c))
* **app:** idp adding logout endpoint handling ([27e9e29](https://github.com/xm-online/xm-webapp/commit/27e9e298dbee16bb09be93ff33de379be8243a42))
* **application-list:** hide avatar or delete from ui config ([50f20d9](https://github.com/xm-online/xm-webapp/commit/50f20d97ef1d5fdc38958ec871ca828adc509ffb))
* **application:** add fab space ([caf02ab](https://github.com/xm-online/xm-webapp/commit/caf02abf9375e5dfab58646d9b290d04f22be86d))
* **app:** xm-idp-config, refactoring ([33770fe](https://github.com/xm-online/xm-webapp/commit/33770fe14f6a3f91ed51e79c2c9fcac8d94ce37f))
* **audits:** replace with material styles ([9cd336f](https://github.com/xm-online/xm-webapp/commit/9cd336fd27bd89903239f91f0ce657393350f264))
* **auth-interceptor:** skip with Authorization header ([50fa618](https://github.com/xm-online/xm-webapp/commit/50fa618b6224bc1fdc8b85f7707b05a287bcaa4f))
* **auth:** add refresh token ([aa847b7](https://github.com/xm-online/xm-webapp/commit/aa847b7b81882eef38f7e1dec036b566d30c40e3))
* **auth:** add refreshGuestAccessToken ([5fa7b22](https://github.com/xm-online/xm-webapp/commit/5fa7b228ae7292d48e11ad5c3c9c3b6afe52eb09))
* **b2bcrm-479:** add message after sent feedback ([563c84b](https://github.com/xm-online/xm-webapp/commit/563c84b951e59c953f9724eb54a33bac108c2d4b))
* **bool-value:** rename bool-view to bool-value ([fa89496](https://github.com/xm-online/xm-webapp/commit/fa89496c483d070d96185f14a3ccc046b8e8d008))
* **bool:** add examples ([3d66bc9](https://github.com/xm-online/xm-webapp/commit/3d66bc9f2619348c8556e12489e7d994ccfb665d))
* **breadcrumb:** add breadcrumb ([34ce2ee](https://github.com/xm-online/xm-webapp/commit/34ce2ee5573f99a64845f0c77836e97f1ca13c09))
* **build-theme:** include /ext ([4c64f7f](https://github.com/xm-online/xm-webapp/commit/4c64f7f53ea57d3eae4772910f0c0b31167e5dd1))
* **build-themes:** extend with number ([d1335c5](https://github.com/xm-online/xm-webapp/commit/d1335c5cd7df374df015efd82d5e31f477ec223f))
* **build:** strict lib execute ([b4b9e89](https://github.com/xm-online/xm-webapp/commit/b4b9e890dfbf10679c2034f4609dea738b3858ef))
* **by-entity-id:** add @xm-ngx/components/by-entity-id-cell ([8e9c1ec](https://github.com/xm-online/xm-webapp/commit/8e9c1eca93aa0238c08190c3d9ca59dc88a5c202))
* **by-entity-id:** add by-entity-id.component ([#720](https://github.com/xm-online/xm-webapp/issues/720)) ([1a48aec](https://github.com/xm-online/xm-webapp/commit/1a48aec518daca36e5b7052f89339223bc5ee195))
* **card:** expand card when click edit ([c4c67e7](https://github.com/xm-online/xm-webapp/commit/c4c67e70e12d8fcb610abed2367bef2cd1b90fb5))
* check in template prop ([a190454](https://github.com/xm-online/xm-webapp/commit/a190454ddeecfd526acca0bc54dc08e0425cf8c5))
* **checkbox-control:** add control ([7d98515](https://github.com/xm-online/xm-webapp/commit/7d985154284a92e9ca5addefd4588f1bc5e4b05c))
* **checkbox-control:** remove unused ([49f123a](https://github.com/xm-online/xm-webapp/commit/49f123a45ee4eda1dc18d285711c1e1907924910))
* **ci:** add eslint-plugin-tsdoc ([54d1c45](https://github.com/xm-online/xm-webapp/commit/54d1c455b4eb6101e41e414f18f9fa15f87122ab))
* **ci:** add test ([ad132ce](https://github.com/xm-online/xm-webapp/commit/ad132cefeb896f680ce19ea3f22515e0b4da0d50))
* **ci:** fix coverage ([635e85f](https://github.com/xm-online/xm-webapp/commit/635e85f00ad1d62390b9a49dc39e4c36a3acd047))
* **ci:** remove sonarqube ([54032b5](https://github.com/xm-online/xm-webapp/commit/54032b55b102eed0006667e5af7c0241043d096c))
* **ci:** replace with blur ([507094c](https://github.com/xm-online/xm-webapp/commit/507094c3bebae7b65215d78eaa6db931c52f1651))
* **ci:** update angular to 10.2.7 ([01e203c](https://github.com/xm-online/xm-webapp/commit/01e203caf7e281882e8a56d2542e61cdff7aa82e))
* **ci:** update angular to 11 ([f0c331a](https://github.com/xm-online/xm-webapp/commit/f0c331a154ac71aca6996097a8db342756813659))
* **cli:** add node-sass, tsc strict ([ec5d86c](https://github.com/xm-online/xm-webapp/commit/ec5d86cccd82dd1f8924d2b6859fc00f1e4f1385))
* **cli:** add to post install ([1e5307b](https://github.com/xm-online/xm-webapp/commit/1e5307ba276f8634e2b242a245c65e05d9e374a7))
* **cli:** cli package ([34f86f9](https://github.com/xm-online/xm-webapp/commit/34f86f9e1695075eeed2382af751cc1823bf958d))
* **client-management:** add dynamic-column ([8f4890d](https://github.com/xm-online/xm-webapp/commit/8f4890d4af2f7c217e24b4f1f654cc77f97691bd))
* **cli:** ignore doc ([adf9e3c](https://github.com/xm-online/xm-webapp/commit/adf9e3c6b15e501e6f2f68242d3884f2cf27d767))
* **cli:** ignore theming and module files ([a5cde97](https://github.com/xm-online/xm-webapp/commit/a5cde97b600cc4abec593f3e19a2f455447db8df))
* **cli:** make build themes acync ([80db726](https://github.com/xm-online/xm-webapp/commit/80db7262f21c56a2f16d613ba9c820b957e7ed98))
* **cli:** move theming to /styles ([c7d6d88](https://github.com/xm-online/xm-webapp/commit/c7d6d88597021d9fed841adee35226f3188e2f98))
* **cli:** replace scripts with cli ([1c01c98](https://github.com/xm-online/xm-webapp/commit/1c01c982d82615d6d25a79474e222e6f25677688))
* **cli:** use dynamic extension module instead ([6762625](https://github.com/xm-online/xm-webapp/commit/6762625df02300a6f587bebe16e2a6a7ad0cf891))
* **code:** add code-container ([34f8495](https://github.com/xm-online/xm-webapp/commit/34f849530f77114fafc4188476c95b7976b8ccce))
* **code:** add xm-code ([78da1f4](https://github.com/xm-online/xm-webapp/commit/78da1f4ba458e6502465b44196151927fe2d9e9c))
* **components-link:** add icon ([ac9c1ba](https://github.com/xm-online/xm-webapp/commit/ac9c1ba2af5c6e9d742c6981b6725dd0db268f37))
* **components-links-group:** add links-group-button-widget ([6a1769a](https://github.com/xm-online/xm-webapp/commit/6a1769a5c247b4ce1b3ffd4206dfb1629ad4dfbd))
* **components-table:** add name ([1eadb32](https://github.com/xm-online/xm-webapp/commit/1eadb32af547e18aa2fbcf460ae8ee702fcc5b97))
* **components:** add package.json ([8dea0c3](https://github.com/xm-online/xm-webapp/commit/8dea0c33b50b45bbea964738843d4bd439040975))
* **condition:** add add arguments ([e7296c9](https://github.com/xm-online/xm-webapp/commit/e7296c9d6f89283b4dfcf0c257e9fbaf283c958e))
* **condition:** add condition output ([5b9e29c](https://github.com/xm-online/xm-webapp/commit/5b9e29ce6dccf3b941cc0de826562fcd11cca4eb))
* **condition:** add xmCondition ([02f433c](https://github.com/xm-online/xm-webapp/commit/02f433cfdf0eae230bbec42b605f9c9a5eeaa28c))
* **control-error:** add control-errors ([5a816d3](https://github.com/xm-online/xm-webapp/commit/5a816d3ec26b99d3a186935d8b6d5ad096f5dcf4))
* **control-error:** move providers to forRoot ([60c1403](https://github.com/xm-online/xm-webapp/commit/60c14032f6cad61372ce43cf022a1a465161d3aa))
* **control-error:** move translates to const ([5de5b2b](https://github.com/xm-online/xm-webapp/commit/5de5b2b6a2e6e9b0bfe3365d7ef6881777b32225))
* **control:** add translate type ([10b6c54](https://github.com/xm-online/xm-webapp/commit/10b6c54335bbf6e189fa10a02ce4ecc5aefa13c8))
* **copy:** add entry ([f5bf517](https://github.com/xm-online/xm-webapp/commit/f5bf517a81d69ea784039cdb3c507404b57f0995))
* **copy:** add example ([f64a41d](https://github.com/xm-online/xm-webapp/commit/f64a41d443d632beff340abb7842cdd602d3eadb))
* **core-auth:** move to core root ([3a8839e](https://github.com/xm-online/xm-webapp/commit/3a8839e4d8d1151988905223dc61c1fc0d277f7b))
* **core-auth:** move XmUserService ([ad6eb54](https://github.com/xm-online/xm-webapp/commit/ad6eb54127a2b687be407350328e8b70d1e5ad17))
* **core-permission:** move to permission to ./directives ([e5051a5](https://github.com/xm-online/xm-webapp/commit/e5051a5027adca65df83c8aa600e86e9e6c9acfe))
* **core:** add package.json ([e92ca4f](https://github.com/xm-online/xm-webapp/commit/e92ca4f5e08c0a41bc530ff18b51f42bd65173a9))
* **core:** add testing folders ([38bf9fc](https://github.com/xm-online/xm-webapp/commit/38bf9fc6bfe5042b98993898453de357184e6b71))
* **core:** update structure ([227ac59](https://github.com/xm-online/xm-webapp/commit/227ac59b0069c949bb129da7010e80511c2c3d45))
* **counter:** add counter ([d680676](https://github.com/xm-online/xm-webapp/commit/d68067601c1a1549969ba65afac6538a5106558e))
* **currency:** add entry ([af890a0](https://github.com/xm-online/xm-webapp/commit/af890a0b39856c245acce7a4b99dc9a0f8e92d4f))
* **dashboard-edit:** add scroll ([23aab7c](https://github.com/xm-online/xm-webapp/commit/23aab7cab29a984e96984b1948d6b93fa910107b))
* **dashboard-wrapper:** add cacheFactoryService ([50f6401](https://github.com/xm-online/xm-webapp/commit/50f64014b3f4ffd123cf7ffc3a2d7551d883c15a))
* **dashboard-wrapper:** add forceReload ([b34f002](https://github.com/xm-online/xm-webapp/commit/b34f002e77a719c7f239b2accbfd2494c72e4a03))
* **dashboard:** add a wrong dashboard warn ([099f1f7](https://github.com/xm-online/xm-webapp/commit/099f1f7354da845930f8d6968336cc161b339cad))
* **dashboard:** add bulk operations ([c8e8f93](https://github.com/xm-online/xm-webapp/commit/c8e8f93a7f42ae3151db867859290d9491f742d7))
* **dashboard:** add copy/paste dashboard ([2e45b35](https://github.com/xm-online/xm-webapp/commit/2e45b35b1454e5c74b6803bac58f1f8eec82624e))
* **dashboard:** add copy/paste widget ([1259794](https://github.com/xm-online/xm-webapp/commit/125979452e947e53c6263a510bfe128f268c4840))
* **dashboard:** add dashboard selector ([438e26a](https://github.com/xm-online/xm-webapp/commit/438e26a72d9dd491bb5dbd6ab5a208cdbecabcde))
* **dashboard:** add DashboardGuard ([32a6d0d](https://github.com/xm-online/xm-webapp/commit/32a6d0deabf9b645088b64bc02f3f7371d22eddc))
* **dashboard:** add dynamic-routes ([e6abfc3](https://github.com/xm-online/xm-webapp/commit/e6abfc383f4a7b5edf8ae1d8184988a52d8ff1e6))
* **dashboard:** add dynamic-widget-layout.component.ts ([e4634b0](https://github.com/xm-online/xm-webapp/commit/e4634b066835d5a8a188ad9a1e6b70b4beff16cd))
* **dashboard:** add interface Dashboard ([795bebc](https://github.com/xm-online/xm-webapp/commit/795bebcdcfe293c765fc22997a5bae32e096b51c))
* **dashboard:** add layout wrong widget name error ([3b6272e](https://github.com/xm-online/xm-webapp/commit/3b6272e15ff0c153197eba1d019bfd22d0bd9cc7))
* **dashboard:** add not-found page handle ([d38ce8c](https://github.com/xm-online/xm-webapp/commit/d38ce8c37857954191afb0c39b93711b2b80f4b1))
* **dashboard:** add order by name ([c4554af](https://github.com/xm-online/xm-webapp/commit/c4554af6821761b4c0de942af45154a34fdb66cb))
* **dashboard:** add orderIndex ([92d810d](https://github.com/xm-online/xm-webapp/commit/92d810d9b86f74bc37e8ac914e3f30e49d1d7bd5))
* **dashboard:** add page-location.service ([86a0627](https://github.com/xm-online/xm-webapp/commit/86a062777aca3c7a797a575c4f94ced5b13ce8e1))
* **dashboards:** add dashboard ([92d3ab4](https://github.com/xm-online/xm-webapp/commit/92d3ab435315436141b2eaddefa2f974c7bbf890))
* **dashboards:** add dashboards.json ([467999f](https://github.com/xm-online/xm-webapp/commit/467999f28a58168b2f7759532dfef99c21263668))
* **dashboards:** add import export scripts ([cd00978](https://github.com/xm-online/xm-webapp/commit/cd009788910afad5506ec52d4899e7de367195c4))
* **dashboards:** provide pageService ([7047dbe](https://github.com/xm-online/xm-webapp/commit/7047dbe4e28006f423fb66b1a4ae39be01cc19be))
* **dashboard:** update paths ([ab06021](https://github.com/xm-online/xm-webapp/commit/ab06021f9ddd820932caf817304dac32a27cc3b9))
* **data-qa:** add data-qa field ([3c6e474](https://github.com/xm-online/xm-webapp/commit/3c6e4745bf31baceac0025e3c1e93ef1f7d94dc0))
* **date-control:** add clear button ([a7d82c0](https://github.com/xm-online/xm-webapp/commit/a7d82c05fb5c5712bfb1afecc7a9fc6eeadf1be9))
* **date-control:** add configurable errors messages and mark control after selection ([33f1bd7](https://github.com/xm-online/xm-webapp/commit/33f1bd792985b7eb334855eb421aa7daa80977f1))
* **date:** add date-value ([70c293a](https://github.com/xm-online/xm-webapp/commit/70c293a02ad1735330aa294906dc757ff1ed20d0))
* **date:** add widget with only date ([3dd9eaa](https://github.com/xm-online/xm-webapp/commit/3dd9eaa8f085005b043ac4c82562849100ca3aab))
* **date:** improve example ([2f97432](https://github.com/xm-online/xm-webapp/commit/2f97432910920bdab3cc7948ad3578ea974109c8))
* **datetime-picker:** making backport of PR [#827](https://github.com/xm-online/xm-webapp/issues/827) from master to develop ([b9e5f30](https://github.com/xm-online/xm-webapp/commit/b9e5f3005254505b5533a95b6aaf237b526af623))
* **default-user-avatar:** add error handler ([112697f](https://github.com/xm-online/xm-webapp/commit/112697ffa6c2ffe290305ed345d7b14a6ae458e8))
* **develop.entity-list:** refactor ([1a0b641](https://github.com/xm-online/xm-webapp/commit/1a0b641e4ea6c22f1d95daa6a9cb2d73dceb4d4c))
* **develop:** entity-list almost done ([928fe68](https://github.com/xm-online/xm-webapp/commit/928fe6880b260b516201b565b5bc6b524beea320))
* **doc-examples:** improve filter ([f50201a](https://github.com/xm-online/xm-webapp/commit/f50201ab55fe324d6ac79b238a4e5a3a5277ceb4))
* **docs:** add CHANGELOG.md ([e055647](https://github.com/xm-online/xm-webapp/commit/e055647a46229381f67c0619a5a13d210efcb7ba))
* **docs:** add control-error ([aae12cb](https://github.com/xm-online/xm-webapp/commit/aae12cb3bffbe16554d42fecccbeaa26a99b205f))
* **docs:** add docs-examples ([268b0a9](https://github.com/xm-online/xm-webapp/commit/268b0a9d44027dc5cfcf8445acc8352c6b778b7a))
* **docs:** add queryParams ([e6afa11](https://github.com/xm-online/xm-webapp/commit/e6afa110ac3d3cf6603f15f74206f576611cd60c))
* **docs:** update styles ([0b0cb66](https://github.com/xm-online/xm-webapp/commit/0b0cb666f82be9c733d8d79ba43b8fb990745f50))
* **dynamic-cell:** extend from dynamic-view ([d908617](https://github.com/xm-online/xm-webapp/commit/d9086178df317df4c5314cea771a2a7c2030634b))
* **dynamic-control:** add xm-dynamic-control ([2da1ba3](https://github.com/xm-online/xm-webapp/commit/2da1ba3cde261bc7b8ef7679a5fcb1acb5a0a3da))
* **dynamic-injector:** add global ([5af6ec1](https://github.com/xm-online/xm-webapp/commit/5af6ec10bca4c27882e79e099253df043345f98f))
* **dynamic-list:** add component ([c9beb20](https://github.com/xm-online/xm-webapp/commit/c9beb2023865f3f94e78735bf14690af2fb45684))
* **dynamic-loader:** add multi loader ([51c9928](https://github.com/xm-online/xm-webapp/commit/51c9928b961989b8702130cffaf59e5af297a235))
* **dynamic-view-layout:** add xm-dynamic-view-layout ([249fe6c](https://github.com/xm-online/xm-webapp/commit/249fe6c03facef2ab6aa3a3827baa32a7dc6619b))
* **dynamic-view:** add dynamic view ([b42c4ed](https://github.com/xm-online/xm-webapp/commit/b42c4ed77cb4506116b46f8e794759be707aa31a))
* **dynamic-view:** add injector ([75cc989](https://github.com/xm-online/xm-webapp/commit/75cc9897f4af39624a0abe4db614cfef55628a22))
* **dynamic-view:** add styles ([f472e36](https://github.com/xm-online/xm-webapp/commit/f472e36e77ff14f6864c4ce3fb7d854ddf9ac067))
* **dynamic-view:** export ViewLayout ([1604a8f](https://github.com/xm-online/xm-webapp/commit/1604a8fe083e9b57887633263628adad5bd0353b))
* **dynamic-widget-layout:** add animation ([7c749ee](https://github.com/xm-online/xm-webapp/commit/7c749ee3045004c4e270d468c6b114f3c2d38fbd))
* **dynamic-widget:** add DYNAMIC_COMPONENTS ([270d9a5](https://github.com/xm-online/xm-webapp/commit/270d9a58d11ba8b3d9f1ef2d6ccca1125bc45893))
* **dynamic-widget:** add loadAndResolve ([8c2458c](https://github.com/xm-online/xm-webapp/commit/8c2458c9cd255df8b8529e523fa63071e081d8cf))
* **dynamic-widget:** add module parse ([604f7d2](https://github.com/xm-online/xm-webapp/commit/604f7d2f218de58810eae85e2f9613fcd8631d3f))
* **dynamic-widget:** add sanitizedLayouts ([a90ee11](https://github.com/xm-online/xm-webapp/commit/a90ee112c7801c656eeecae8eb2a03b06621e903))
* **dynamic-widget:** add xm-ngx support ([cd4608e](https://github.com/xm-online/xm-webapp/commit/cd4608e899ecbc8928041ad9fb2f1c0f64629cb9))
* **dynamic:** add class and styles ([5977f18](https://github.com/xm-online/xm-webapp/commit/5977f184f93f2175346103fd196d59828526c80a))
* **dynamic:** add dynamic extension module ([a924f2e](https://github.com/xm-online/xm-webapp/commit/a924f2e16c02b6e9b5508dcfa08b25c6bffcd1d2))
* **dynamic:** add entry ([06fd6fc](https://github.com/xm-online/xm-webapp/commit/06fd6fc7772cf89182eca96f3bd7a076fbffd0ec))
* **dynamic:** add getEntry ([9dc02f2](https://github.com/xm-online/xm-webapp/commit/9dc02f240cedd04cc0bd1952ba59e656dc936466))
* **dynamic:** add package.json ([584d156](https://github.com/xm-online/xm-webapp/commit/584d1569fe8081cf911ed71487dc5d4916f51c8a))
* **dynamic:** add styles to options ([15f3ef7](https://github.com/xm-online/xm-webapp/commit/15f3ef7afca812fe397ee79a367a982f01937abc))
* **dynamic:** move to packages ([b02e383](https://github.com/xm-online/xm-webapp/commit/b02e38305f8ce4447cadf06beec7dd7b6b1d859a))
* **dynamic:** row as value when a field null ([431df64](https://github.com/xm-online/xm-webapp/commit/431df640fab01cc45861931d95aef41c42bd1c12))
* **dynamic:** update index, module ([da7f416](https://github.com/xm-online/xm-webapp/commit/da7f4162411c9c5589fd9c59e0a633279b8e5436))
* **dynamic:** update interfaces ([2739e7f](https://github.com/xm-online/xm-webapp/commit/2739e7f3459e28711647b4168494a77ea2360e57))
* **edit-buttons:** add edit-buttons ([#591](https://github.com/xm-online/xm-webapp/issues/591)) ([4d52f4e](https://github.com/xm-online/xm-webapp/commit/4d52f4e1753753b0d9777c7eec8dfe5b5da98c1a))
* **edit-widget-buttons:** add disabled ([#595](https://github.com/xm-online/xm-webapp/issues/595)) ([3e77e3d](https://github.com/xm-online/xm-webapp/commit/3e77e3d8c3dc1a1e8d2261e31e8ba13c001e55e5))
* **entity-card-compact:** added recent updates with all dependencies ([fc0ffaf](https://github.com/xm-online/xm-webapp/commit/fc0ffaf32dcaa6c8232ca50e63c80378259d971d))
* **entity-collection:** extend Sortable ([4d39616](https://github.com/xm-online/xm-webapp/commit/4d3961617cddf025147b8242245de5fc96d3baeb))
* **entity-collection:** extend with Pageable ([c256550](https://github.com/xm-online/xm-webapp/commit/c256550736293ff79c9c9f5633fcc1f732e3c217))
* **entity-collection:** extend with Pageable ([af36d8d](https://github.com/xm-online/xm-webapp/commit/af36d8d5f06daa2fd528d9598fc5ad15f4db7d8e))
* **entity-collection:** update pageable interface ([4336b1d](https://github.com/xm-online/xm-webapp/commit/4336b1ddc4e576bfe921796fc8b4bb533a25b3dd))
* **entity-detail:** add showKey field ([66d225e](https://github.com/xm-online/xm-webapp/commit/66d225e032e68c05f30131627f834129c90048e7))
* **entity-list-card:** making backport of pr [#818](https://github.com/xm-online/xm-webapp/issues/818) from master, cleanup ([cb45aa4](https://github.com/xm-online/xm-webapp/commit/cb45aa40f9a07f673ea218cddbc8e79996efef7a))
* **entity-list-fab:** removing random entity generate option ([820ae9f](https://github.com/xm-online/xm-webapp/commit/820ae9fc6e7bcdc77d9360d42cae6483e57f8766))
* **entity-list:** linter fixes ([33f1672](https://github.com/xm-online/xm-webapp/commit/33f1672ddfbf18d3adbf1dd13b332384cfb63d1b))
* **entity-list:** refactor ([953ee0f](https://github.com/xm-online/xm-webapp/commit/953ee0f52eb73850cde34096a40de887cf93059d))
* **entity-list:** single action, inner nav with params ([c88dce8](https://github.com/xm-online/xm-webapp/commit/c88dce841c7fce6f543881b5b93fe1e66e93dcd6))
* **entity-model:** add property version ([ec66ddb](https://github.com/xm-online/xm-webapp/commit/ec66ddbbc901ef6eb33ca9eb775cd7b9d25ed931))
* **entity-spec:** add isApp by default ([71cf279](https://github.com/xm-online/xm-webapp/commit/71cf279f1180a5c15569d239d9c86ba7dabbafea))
* **entity:** add key ([eb3ec3e](https://github.com/xm-online/xm-webapp/commit/eb3ec3e2ca635c6635845274c09881fbe34f0e16))
* **entity:** add StatesManagementDialogModule, EntityStateModule ([e68d811](https://github.com/xm-online/xm-webapp/commit/e68d8110b6d904ba5a9b0d86c895bd6fcfc09bb3))
* **enum-control:** add button as optional ([3549d0f](https://github.com/xm-online/xm-webapp/commit/3549d0f106e834d460294cc0351190144c1624a3))
* **enum-control:** add button as optional ([8186a6b](https://github.com/xm-online/xm-webapp/commit/8186a6b40bd5d84e63542a0866d04731a8f85fb6))
* **enum-control:** add clear button ([0b6459d](https://github.com/xm-online/xm-webapp/commit/0b6459ddd7a9de973202a4e2e1234594ba1b71a4))
* **enum-control:** add multiSelect mode ([a2f49c0](https://github.com/xm-online/xm-webapp/commit/a2f49c0789d528e8ac9dc2c5feb76d7b54c169f1))
* **enum-control:** display option by permission ([a1b455a](https://github.com/xm-online/xm-webapp/commit/a1b455a0d4a6f8f89e0d381c62ca39231b1d1b5c))
* **enum-control:** extend abilities ([a0a4d48](https://github.com/xm-online/xm-webapp/commit/a0a4d48ad715d798d39294281fb2a015d9c28107))
* **enum-control:** moved multiple selection into separate component ([6e128e9](https://github.com/xm-online/xm-webapp/commit/6e128e97be7cc6d55eb62d1295ee8d59bd9e4b8f))
* **enum-control:** show default value in selection if property empty ([9226226](https://github.com/xm-online/xm-webapp/commit/922622655d9d7b96f207b5f6de65e0b4d14fc957))
* **enum-value:** split enum to enum value ([77db598](https://github.com/xm-online/xm-webapp/commit/77db598462aaf272abb3bd1129a843a920a40c55))
* **enum:** add example ([d104459](https://github.com/xm-online/xm-webapp/commit/d1044591f5adb925ed19243444d66fb1e5094ec1))
* **environment:** add notFoundUrl ([5bcb43a](https://github.com/xm-online/xm-webapp/commit/5bcb43a3a1d8ca1b566139bf2acde072e8bf0c5f))
* **environment:** add serverApiUrl ([2703cb7](https://github.com/xm-online/xm-webapp/commit/2703cb76d0e5daf244c70eef4c0375aa91c02dc6))
* **error-handler:** add skip header ([4fd1428](https://github.com/xm-online/xm-webapp/commit/4fd142806acd62bf78b9a714b597e2b583a7d7be))
* **error-handler:** check for Loading chunk error ([ac850a1](https://github.com/xm-online/xm-webapp/commit/ac850a1c8a785ec765ff6afb91b6ea343da4e409))
* **example-ext:** add example-widget ([3b20f20](https://github.com/xm-online/xm-webapp/commit/3b20f200a22330166eec89e91e8536f02a2b6e3c))
* **example-ext:** add i18n ([f8d8edb](https://github.com/xm-online/xm-webapp/commit/f8d8edb0441b9b85d1e32f01d6b4f3d7e7f00b8e))
* **example-ext:** add styles ([f0dee72](https://github.com/xm-online/xm-webapp/commit/f0dee720a1a39cbade270b088f85dacbe97d9433))
* **example-ext:** add to git ignore ([9d7d093](https://github.com/xm-online/xm-webapp/commit/9d7d093e05bd5c353d863b471487d29df6ba0065))
* **example-widget:** add config field ([4486f5e](https://github.com/xm-online/xm-webapp/commit/4486f5e29cbf4346705659e3c384c43cc39bae00))
* **exceptions:** add exceptions namespace ([c6cb9ff](https://github.com/xm-online/xm-webapp/commit/c6cb9ffe05f2e7d281eb7ba1d08ea6185237d15e))
* **ext-select, ext-multi-select:** backport of mr [#962](https://github.com/xm-online/xm-webapp/issues/962) from master ([e66622e](https://github.com/xm-online/xm-webapp/commit/e66622e0123108de9b9ab405015ba9af4f2aafaf))
* **ext-select:** add attribute notitle for rest-select for develop ([86bb6a8](https://github.com/xm-online/xm-webapp/commit/86bb6a8f5f7d26cb7b357376bd5aca5fa9674832))
* **fab-button:** route with query params ([e99267f](https://github.com/xm-online/xm-webapp/commit/e99267f50e549a256e9d90e44c21dc791dacd4df))
* **fade-in-out:** change position to absolute ([#653](https://github.com/xm-online/xm-webapp/issues/653)) ([7d77540](https://github.com/xm-online/xm-webapp/commit/7d77540a4bc525e0d58da5e33decc2a06c663264))
* **feedback:** add image ([fb7d9f5](https://github.com/xm-online/xm-webapp/commit/fb7d9f573b8f30330da294d372e6166b276dd613))
* **feedback:** add permission ([dd5408a](https://github.com/xm-online/xm-webapp/commit/dd5408a55f7fb38d7d2afa6eb25099a52cea8aa7))
* **file-download-helper:** add method for download correct encoded csv ([071ce9b](https://github.com/xm-online/xm-webapp/commit/071ce9be9f8db29e5b5ca8ff202d6ec4968e56ba))
* **file:** add file-control ([0c54c89](https://github.com/xm-online/xm-webapp/commit/0c54c895bba806f6c4fda82ab3ec3058b8d712d2))
* **flatten-object:** moved the function into shared ([639a74f](https://github.com/xm-online/xm-webapp/commit/639a74f9dfe97948520c1cc2245cb086bda56978))
* **form-layout:** add form-layout ([25fd119](https://github.com/xm-online/xm-webapp/commit/25fd119f7c7b36c2dc0dbc4f70840789bb945f05))
* **function-list-section:** set auto width for curr state column ([4d484a4](https://github.com/xm-online/xm-webapp/commit/4d484a4128dc42196a2d83eb283da90b4f7e135c))
* **gateway:** replace with material table ([88f6bf8](https://github.com/xm-online/xm-webapp/commit/88f6bf849b041515a7b9d3a212cc1dc7eb73efdb))
* **general:** add compodoc/compodoc ([a876a75](https://github.com/xm-online/xm-webapp/commit/a876a75f4d8be2ab5c00a973ba01e5e60f76901b))
* **general:** update angular to 11.2.9 ([3e1bde3](https://github.com/xm-online/xm-webapp/commit/3e1bde365664aeeb192572b8b2d8478752ecc0ed))
* **git:** add commitlint with git hook ([7b9f051](https://github.com/xm-online/xm-webapp/commit/7b9f051fb78419914e577a2f89c03f39a734b344))
* **git:** added .gitattributes ([2b6e547](https://github.com/xm-online/xm-webapp/commit/2b6e547526a66367309046338c64700da3c975c7))
* **global-error-handler:** emit event to loggerBroker ([1b1b030](https://github.com/xm-online/xm-webapp/commit/1b1b030240a90ecca4d2493529cd37b6ba3620c2))
* **health:** add material styles ([9cfe876](https://github.com/xm-online/xm-webapp/commit/9cfe876274db7c7df918d530ef2983aebd39fd21))
* **heatmap:** add active styles ([3759095](https://github.com/xm-online/xm-webapp/commit/37590954152b4b8ddddd0b2cc98953d3f63aa668))
* **heatmap:** available only for super admin role ([cc5a0d7](https://github.com/xm-online/xm-webapp/commit/cc5a0d73d0ac9037adfab2967caaec37756a0a20))
* **high-level-architecture-widget:** move to /packages ([45f9c5d](https://github.com/xm-online/xm-webapp/commit/45f9c5d1b2adb5a3ce10d3c2835ced092dee304d))
* **home:** add null check ([3a9062d](https://github.com/xm-online/xm-webapp/commit/3a9062da7fc3dbc9bdfb92c0071a26c5de50ccc2))
* **home:** add regex to domains ([#601](https://github.com/xm-online/xm-webapp/issues/601)) ([57a0b62](https://github.com/xm-online/xm-webapp/commit/57a0b6207f8b5eb07929426df456f74061d670cd))
* **html:** add i18n ([d0d2779](https://github.com/xm-online/xm-webapp/commit/d0d27792d621ad38c1075b98cfff41559e917dc0))
* **html:** add xm-html ([12f8a7b](https://github.com/xm-online/xm-webapp/commit/12f8a7bf4261171ea2d8df2a1e5856f1d61eeb97))
* **http-client.rest:** add HttpHeaders in request ([e8a11e4](https://github.com/xm-online/xm-webapp/commit/e8a11e4fc4f3a616e48cc17118d78c9594bf1597))
* **http-client.rest:** add HttpHeaders in request ([34756e6](https://github.com/xm-online/xm-webapp/commit/34756e677a567272914c910eaae7c29664ae9dc5))
* **http-client:** add pageable support ([62dc408](https://github.com/xm-online/xm-webapp/commit/62dc408a12de2ebbcc0bb4b4f746e9e997d315af))
* **i18n:** add 500 case ([d26adb8](https://github.com/xm-online/xm-webapp/commit/d26adb826dd642e52ef687ed1ef6286c92ac611a))
* **i18n:** add concurrencyFailure ([53c6a25](https://github.com/xm-online/xm-webapp/commit/53c6a25366ab19705e39a4ac9dcdf1f38fcfc100))
* **i18n:** name translate ([df020f3](https://github.com/xm-online/xm-webapp/commit/df020f3e4d1fdd6257a96e5157fe8c19b6fc72a3))
* **i18n:** name translate add quote ([26034b5](https://github.com/xm-online/xm-webapp/commit/26034b51fdd469ed067a197bb12b136ebdc00b24))
* **icon-enum:** add new component, show material icons instead enum ([a8af174](https://github.com/xm-online/xm-webapp/commit/a8af17472a5fbe24ccbb55d6ab81a6432c59882f))
* **idp:** adding components and basic logic ([5429f28](https://github.com/xm-online/xm-webapp/commit/5429f28af98f0aa938f902a435dd6f1002275959))
* **idp:** adding login auth redirect page ([4e46b67](https://github.com/xm-online/xm-webapp/commit/4e46b67860ed9cfe1e194aa8ce21da3e7b6d8295))
* **idp:** adding new env, methods refactoring ([c3e37af](https://github.com/xm-online/xm-webapp/commit/c3e37af0c6b16a15aa176c94b7daa8e4ac0d06f8))
* **idp:** considering calback handle terms logic ([5d56155](https://github.com/xm-online/xm-webapp/commit/5d5615568431f70c76c4a8e12b70bcc56739f1de))
* **idp:** direct route oauth by key handler ([206fb0c](https://github.com/xm-online/xm-webapp/commit/206fb0c24d9962fd77fee37efb6c28f5179769c7))
* **idp:** mocking all token object, saving tokens ([f34871a](https://github.com/xm-online/xm-webapp/commit/f34871aeb9461726a8373af3353cd95a1241f33f))
* **idp:** move mock token to ignorable config, refactoring ([c5357e7](https://github.com/xm-online/xm-webapp/commit/c5357e7f67b57cebac129171664c8c0f71bc06c9))
* **idp:** pending idp styles for card if direct login ([d03713d](https://github.com/xm-online/xm-webapp/commit/d03713dd544cf834df803233382f8af5971d8e84))
* **idp:** refactoring ([8a821df](https://github.com/xm-online/xm-webapp/commit/8a821df95ad5ed88d99ec4660551c3b4bfa1ba71))
* **idp:** refactoring ([2fe8f60](https://github.com/xm-online/xm-webapp/commit/2fe8f60a697655398f9b0cae332039c5870a2f46))
* **idp:** removing old social logic and components ([7103a41](https://github.com/xm-online/xm-webapp/commit/7103a413d4000a4d00ac25c9586b60e10946ec9b))
* **if-dashboard-slug:** add filter by slug ([#598](https://github.com/xm-online/xm-webapp/issues/598)) ([76f5305](https://github.com/xm-online/xm-webapp/commit/76f5305d9c113af3ac6509ba3438547ef6c8aefb))
* **image-view:** add image-view ([#592](https://github.com/xm-online/xm-webapp/issues/592)) ([5ec6654](https://github.com/xm-online/xm-webapp/commit/5ec66548dca6cfa772690cb6551ba0dd0280874d))
* **interfaces:** add Permissible ([f568e20](https://github.com/xm-online/xm-webapp/commit/f568e2084bdb87f869b68bc74bc41bcbf3cf678c))
* **jsf-widget:** add redesigned multilingual widget ([34fc38d](https://github.com/xm-online/xm-webapp/commit/34fc38d8b0a8abe2398620e5d6840b68d18e7c85))
* **karma:** add ChromeHeadlessNoSandbox ([#695](https://github.com/xm-online/xm-webapp/issues/695)) ([fd7d594](https://github.com/xm-online/xm-webapp/commit/fd7d594d7011da181021c857d3ce6a1cbc53b259))
* **karma:** add ChromeWithoutSecurity ([635d607](https://github.com/xm-online/xm-webapp/commit/635d607abeecb0eca229ff9f7eee4d8c41e914a2))
* **languages:** add default locale from config ([ca93ae5](https://github.com/xm-online/xm-webapp/commit/ca93ae53dde5d78c18e47d2914be548e34fe0695))
* **layout:** add XmSidebarRightModule ([986917f](https://github.com/xm-online/xm-webapp/commit/986917f864177abf7f92e1c28fb4b3b945d2b792))
* **layout:** extract heatmap ([a344c5e](https://github.com/xm-online/xm-webapp/commit/a344c5e9f3a045d40055d6c12fa206b3f00ca08b))
* **link-group:** add mobile view ([c98115c](https://github.com/xm-online/xm-webapp/commit/c98115cc4aa6743510a61dd3a1df522fe8a9f879))
* **link-list-card:** refactor using mat table ([2ec5f37](https://github.com/xm-online/xm-webapp/commit/2ec5f37c168ec04b409dfd6b2bf6f7682714b483))
* **link-list-card:** removed unnecessary button styles ([eaf1b3c](https://github.com/xm-online/xm-webapp/commit/eaf1b3c6531c7bcaec08ccf76c903e351a1d3904))
* **link-list-card:** styles enhancement ([3eee5fa](https://github.com/xm-online/xm-webapp/commit/3eee5fa7f1189500975fb406d5ac348d4bc2bee3))
* **link-view-copy:** add copy icon ([#719](https://github.com/xm-online/xm-webapp/issues/719)) ([356b64a](https://github.com/xm-online/xm-webapp/commit/356b64abe6e9f211db9068267c542ee4f20791de))
* **link-view:** add link view ([#718](https://github.com/xm-online/xm-webapp/issues/718)) ([da69c7e](https://github.com/xm-online/xm-webapp/commit/da69c7e978dac1eda2e78467e6ff18b84cfa88d8))
* **link-view:** display fieldValue if option exist ([2507e6c](https://github.com/xm-online/xm-webapp/commit/2507e6c37f7ca0f91b63bb2450eedb6217196d02))
* **link-view:** refactoring, add icon ([e110d1d](https://github.com/xm-online/xm-webapp/commit/e110d1de6e058a4583844359d8d23fdbdd275dd8))
* **link:** add fieldTitle ([3c3d3a3](https://github.com/xm-online/xm-webapp/commit/3c3d3a303ed2d5b28e704a83332875a67b3764ad))
* **link:** add link button ([d46b068](https://github.com/xm-online/xm-webapp/commit/d46b068116886d82291c030b858175ff0c61b1ab))
* **link:** add link-value ([e6509fe](https://github.com/xm-online/xm-webapp/commit/e6509fed1a00af1472e47de7b8a747eb9d78915b))
* **link:** fix naming ([e109924](https://github.com/xm-online/xm-webapp/commit/e109924953f8a5d2c523bfa1d5869d454a99f2d3))
* **links-group:** add links group ([#676](https://github.com/xm-online/xm-webapp/issues/676)) ([8c3b516](https://github.com/xm-online/xm-webapp/commit/8c3b516e4ed260a9f444ca94d90c9b1f46c5f782))
* **links-group:** add scroll ([9d31b7e](https://github.com/xm-online/xm-webapp/commit/9d31b7e55d3fa181bb1986516fef0933d91b3a91))
* **links-search:** making backport of PR [#739](https://github.com/xm-online/xm-webapp/issues/739) from master ([b320788](https://github.com/xm-online/xm-webapp/commit/b320788b50f3f7aa4a24831d0555832f6df2f5c5))
* **links:** add data buttons ([2184333](https://github.com/xm-online/xm-webapp/commit/2184333df364cfefb4da8ce5227aa7a37ff06b32))
* **loading-indicator:** add import data ([d428067](https://github.com/xm-online/xm-webapp/commit/d4280678be09e2bf289c155982416bc31356eda4))
* **loading-indicator:** add indicator and modal window ([a43a4ae](https://github.com/xm-online/xm-webapp/commit/a43a4ae60b832cef98c2098b560afb2c4b177d34))
* **loading-indicator:** add styles ([97deb64](https://github.com/xm-online/xm-webapp/commit/97deb647bc255e8fba945cf59089c4d28af87bdb))
* **loading-indicator:** add styles ([9072f58](https://github.com/xm-online/xm-webapp/commit/9072f58bdf927e019a7f13e268ccec2180a629f3))
* **loading-indicator:** fix import ([65e7ab1](https://github.com/xm-online/xm-webapp/commit/65e7ab198884e9d562895479f6992f49ce42b792))
* **loading-indicator:** refactoring, add widget ([f776cf8](https://github.com/xm-online/xm-webapp/commit/f776cf8d2a1af7a7de0fa2f01b4b9143d038d978))
* **loading-indicator:** translation ([a44e49d](https://github.com/xm-online/xm-webapp/commit/a44e49dc45ef3635089facbda8fa0e8f95e5ccf3))
* **loading-indicator:** translation ([2e90805](https://github.com/xm-online/xm-webapp/commit/2e908055e42e9f56914211672e974899b053d67f))
* **loading:** add loading package ([d0b47ff](https://github.com/xm-online/xm-webapp/commit/d0b47ff6bec5e69cb52d115b0c39eda90afcfe3a))
* **location-detail-dialog:** added error messages and attributes for required fields ([6fa66fd](https://github.com/xm-online/xm-webapp/commit/6fa66fd6fb364f491b9041f2dc361f2ad54e5573))
* **logger:** add abstract layer ([1b05aaa](https://github.com/xm-online/xm-webapp/commit/1b05aaad913dda66fc469facc993972b55a412e2))
* **logger:** add add watch and be sync ([89f0efd](https://github.com/xm-online/xm-webapp/commit/89f0efd092d64b28c04b211a786a990e3ceb7265))
* **logger:** add docs ([43b1b16](https://github.com/xm-online/xm-webapp/commit/43b1b1648b2d70c1f63bf5f9a31a2514045bfe72))
* **logger:** add logger ([99a9226](https://github.com/xm-online/xm-webapp/commit/99a922657471ee49a3be78b7b3f5797e9739c92b))
* **logger:** add Skipping error handlers ([9a52adc](https://github.com/xm-online/xm-webapp/commit/9a52adce682a5e636e94ca21a8aa6435aec8ef60))
* **logger:** add xm logger service ([2db828b](https://github.com/xm-online/xm-webapp/commit/2db828b14e462b47cde2bb4ff5e186feae9a6656))
* **logger:** split into files ([5092677](https://github.com/xm-online/xm-webapp/commit/509267723d2f39b862e13638ea85789aa0dff714))
* **login:** add rememberMeActiveByDefault ([5d798fd](https://github.com/xm-online/xm-webapp/commit/5d798fdbec91b5a468ebd9364d4218c7c3a4a72f))
* **logo:** move to packages ([db1815d](https://github.com/xm-online/xm-webapp/commit/db1815daccd81f490b1ebb8c733388e66ff7a483))
* **logs:** add material tables ([749026a](https://github.com/xm-online/xm-webapp/commit/749026a8dcf201b997abcb2f136163159667d115))
* **logs:** update html ([02f82b1](https://github.com/xm-online/xm-webapp/commit/02f82b150da3c8e2e47df5df4d894f9dfacbaa8e))
* **main:** replace xmRouteChangeAnimation with angular animation ([147bec7](https://github.com/xm-online/xm-webapp/commit/147bec7c3f313bdbbdd82e6a68f1edd555ce0b19))
* **maintenance:** add showReindex ([e3523f5](https://github.com/xm-online/xm-webapp/commit/e3523f5f6e1f703a7bd614c3e539d472aab6b3ac))
* **mat-card:** add edit by permission ([0655572](https://github.com/xm-online/xm-webapp/commit/065557252a5d8acac0dd464824a00483c3019fa9))
* **mat-fab:** add mat-fab ([119bd6e](https://github.com/xm-online/xm-webapp/commit/119bd6e642b528769e1e3e50be782a07fab6a749))
* **mat-fab:** add tooltip ([#684](https://github.com/xm-online/xm-webapp/issues/684)) ([9a41ec4](https://github.com/xm-online/xm-webapp/commit/9a41ec4d7922ed57de068b56d35fcee2050909d8))
* **mat-fab:** remove shared ([7599b46](https://github.com/xm-online/xm-webapp/commit/7599b467457d6cf00ef7b28b59ca462798341ecc))
* **material-design-icons:** add icons ([83e6acf](https://github.com/xm-online/xm-webapp/commit/83e6acf857957618a4d1fd16b0f635a9e514ffef))
* **menu:** add active color ([9805b00](https://github.com/xm-online/xm-webapp/commit/9805b0012cf3ff29aed3f118bb849f058d51b404))
* **menu:** add hideAdminConsole flag ([cbca377](https://github.com/xm-online/xm-webapp/commit/cbca377f541b5aa7da6af894299dc2068bfc6f18))
* **menu:** add sections ([cdb0884](https://github.com/xm-online/xm-webapp/commit/cdb0884ee7c952743bd6005e17479aed913dbf15))
* **menu:** move to packages ([90b1556](https://github.com/xm-online/xm-webapp/commit/90b1556bbb870f58ee506fbda5ea56295c623cf4))
* **mock-translate-service:** add mock method ([9260d95](https://github.com/xm-online/xm-webapp/commit/9260d95fbb33e99d2be216903d602efcafba42e8))
* move ELEMENT_NOT_FOUND to searcher ([4abeff6](https://github.com/xm-online/xm-webapp/commit/4abeff61580e2ea4a5a63f20fe817c76090ee95c))
* **multilingual:** add title ([86ff5eb](https://github.com/xm-online/xm-webapp/commit/86ff5eb6e7a3bcfc5150688ad4c36c25dcea719a))
* **multiroles:** display several roles ([b37d4b2](https://github.com/xm-online/xm-webapp/commit/b37d4b27cec44a18675b6b1343627679036e063e))
* **mwb2c-416:** comments for components ([4b514c9](https://github.com/xm-online/xm-webapp/commit/4b514c9d9d2a265094d0fd5f12bcacae93c1919a))
* **mwb2c-416:** fix path ([7c5d7f5](https://github.com/xm-online/xm-webapp/commit/7c5d7f58c07bea3bee357ad2d621b52d8a18952b))
* **mwb2c-416:** fix path ([e2e8f85](https://github.com/xm-online/xm-webapp/commit/e2e8f856ecf60b26ef7ecbcdbafb5b8e3dfc9402))
* **navbar-input-search:** backported flag for full match search ([#596](https://github.com/xm-online/xm-webapp/issues/596)) ([d1981f9](https://github.com/xm-online/xm-webapp/commit/d1981f9673153e3d4b4c12f3b949aeee0f760881))
* **navbar-search:** fix mobile view ([f389223](https://github.com/xm-online/xm-webapp/commit/f389223ac097b4d1c2f65efb8c53b7f9d6d1529c))
* **navbar-user:** add navbar user ([2e3bb15](https://github.com/xm-online/xm-webapp/commit/2e3bb154c636424db9f0ba7a493801e94f8d1399))
* **navbar-user:** move username below ([fcf2917](https://github.com/xm-online/xm-webapp/commit/fcf2917d76f611cc9fca40f2f9f151b0a68cb80b))
* **navbar:** add version ([8f516e5](https://github.com/xm-online/xm-webapp/commit/8f516e591733a33df6dd35d58fb34ca45f6c65d9))
* **navbar:** add xm-navbar-container ([e03019f](https://github.com/xm-online/xm-webapp/commit/e03019ff172112648d8fe90681cbb326a84b823d))
* **navbar:** add z-index ([5194424](https://github.com/xm-online/xm-webapp/commit/5194424eada3d22354ec9c39374b607091a5687c))
* **navbar:** save open state ([898e109](https://github.com/xm-online/xm-webapp/commit/898e1093045a838db5fd2c9d36b969570e6fa0c6))
* **navbar:** split styles [#640](https://github.com/xm-online/xm-webapp/issues/640) ([9703d93](https://github.com/xm-online/xm-webapp/commit/9703d9310b6cdfc9391b5dce6ebf052bc9509e21))
* **ng-accessor:** add formControlName ([6b2f97e](https://github.com/xm-online/xm-webapp/commit/6b2f97e3bb610f6e3694a1d659fe0d2078a693db))
* **ng-form-accessor:** apply control from NgControl ([e7c6d64](https://github.com/xm-online/xm-webapp/commit/e7c6d64e71eeccfd49790f933cda6dfec5e8a130))
* **ng-model:** add ng control-accessor ([f2840d0](https://github.com/xm-online/xm-webapp/commit/f2840d061d47055e34bdc1c8e5cabdbf350a8abb))
* **ng-model:** add touch ([b97da21](https://github.com/xm-online/xm-webapp/commit/b97da21680ac0217cdc8dde1509fef4274de4466))
* **ngsw-config:** switch to lazy mode ([82b014f](https://github.com/xm-online/xm-webapp/commit/82b014f6d80faaeeaa2e86c37526fff90e6a737d))
* **no-data:** add imageUrl ([ed518e7](https://github.com/xm-online/xm-webapp/commit/ed518e79b2e27ce46ef866cf36f84b5046c6c1ae))
* **no-data:** update styles ([#600](https://github.com/xm-online/xm-webapp/issues/600)) ([dcc7aa0](https://github.com/xm-online/xm-webapp/commit/dcc7aa0d747d8da06af34bf3c518dfa558611a43))
* **node-sass:** update deps ([207dca6](https://github.com/xm-online/xm-webapp/commit/207dca67276daa11b4f2037bd3878139d95af860))
* **node:** update node version ([793ca0c](https://github.com/xm-online/xm-webapp/commit/793ca0c6c57cf0029a401a46f2f2422410a861b4))
* **number-control:** add control ([4bd7fe3](https://github.com/xm-online/xm-webapp/commit/4bd7fe37a8984b589bf1cabc68a2779469797b95))
* **number-control:** add data-qa ([c003c75](https://github.com/xm-online/xm-webapp/commit/c003c75ee0fbdc54c3ba5671ad559802f7a31be6))
* **number-control:** remove unused ([54e6c51](https://github.com/xm-online/xm-webapp/commit/54e6c517d6a14ba23fd6418b0a4fc1565fc8de0e))
* **operators:** add format ([0b1b39d](https://github.com/xm-online/xm-webapp/commit/0b1b39d1fa17f018e5992c48e33ba5aa07327939))
* **package:** angular-9 ([bbf49cd](https://github.com/xm-online/xm-webapp/commit/bbf49cd4ce8759ba10851a33f9944d158eb047cc))
* **packages:** add @xm-ngx/json-schema-form [#297](https://github.com/xm-online/xm-webapp/issues/297) ([#631](https://github.com/xm-online/xm-webapp/issues/631)) ([f4c57e5](https://github.com/xm-online/xm-webapp/commit/f4c57e5de6c02cb97a7aba97ac4727ae4ae47a49))
* **packages:** update angular ([64bcbd1](https://github.com/xm-online/xm-webapp/commit/64bcbd173c5f83094cd33cca20a4f9eb591c492b))
* **packages:** update ng-jhipster, ngx-chips, ngx-mat-select-search, ngx-webstorage ([6b960fb](https://github.com/xm-online/xm-webapp/commit/6b960fb607dc77a9532fbe05b64751742e05d90c))
* **package:** update angular to 10.6.0 ([86f64cb](https://github.com/xm-online/xm-webapp/commit/86f64cbd7ff01dc708caf544cbb7eaa36fe41ec0))
* **package:** update deps ([6ab4544](https://github.com/xm-online/xm-webapp/commit/6ab454452dfd843ac99fcd36ecee9b99f8b64e47))
* **page-collection:** add page-collection.service ([c93bfd6](https://github.com/xm-online/xm-webapp/commit/c93bfd6c4055dd1ba90c56b628d5c571be88e6cc))
* **page-entity:** add string type for entity ([2181728](https://github.com/xm-online/xm-webapp/commit/2181728a14058a512ae7e9b32d23bda5ba067967))
* **page:** add debug logger ([50be08a](https://github.com/xm-online/xm-webapp/commit/50be08a023a81e9ef5b8302d70a69084c674c775))
* **parallax:** add xmMouseMoveParallax ([15ed592](https://github.com/xm-online/xm-webapp/commit/15ed5929047c5b47a6fc5e9760be3b628b602641))
* **particles:** add xm-canvas-with-particles ([d7bf64e](https://github.com/xm-online/xm-webapp/commit/d7bf64ec14dbd50ef1aabb608e4c8e7c1b1128e4))
* **password:** update examples ([5a4cd6a](https://github.com/xm-online/xm-webapp/commit/5a4cd6a5050067a1f2759765bf503aa70b72ad69))
* **permission:** add canLoad ([fdadb9f](https://github.com/xm-online/xm-webapp/commit/fdadb9f84360c0d9044717adb70743a8d4097fa4))
* **permission:** add session directive ([4cbbfed](https://github.com/xm-online/xm-webapp/commit/4cbbfed0f30109cd868963a8270ee86d7b488485))
* **phone-number:** add input field ([774cb80](https://github.com/xm-online/xm-webapp/commit/774cb80d0876e532b373f90c55e3a32be880b4f7))
* **placeholder:** add block placeholder ([3e7f9f3](https://github.com/xm-online/xm-webapp/commit/3e7f9f342c51838dbff7e2e66ba9d91b9cb99f4a))
* **polyfills:** add localize ([588599b](https://github.com/xm-online/xm-webapp/commit/588599bd7c3a446212dbed46900c5e4c87b81d28))
* **prebuild-themes:** add default themes value ([cbc2911](https://github.com/xm-online/xm-webapp/commit/cbc2911c4ac16e9328448c0e5f6ebab887fe89ae))
* **protractor:** add configs ([f21110a](https://github.com/xm-online/xm-webapp/commit/f21110aa00bfd01f4a62c0db78586215141a4e95))
* **proxy:** add excludedUrls ([b9b3d5c](https://github.com/xm-online/xm-webapp/commit/b9b3d5cce07b85f81af9e9dc7a08088fc0ddf001))
* public full screen ([bfdcdd3](https://github.com/xm-online/xm-webapp/commit/bfdcdd3bd576c872c948b2bce940e05cb85f103b))
* public full screen holder ([e5ebda3](https://github.com/xm-online/xm-webapp/commit/e5ebda345fc5e096c2c25c4053b42948957942ab))
* public full screen holder update interface public config ([f604305](https://github.com/xm-online/xm-webapp/commit/f6043050c52ebc02b9053f57d35aa44a9a320621))
* public full screen holder update interface public config text ([2fc22fa](https://github.com/xm-online/xm-webapp/commit/2fc22fa262786933d98d5ad3d08bcb5ce5d49461))
* public full screen holder update interface public config text ([2035113](https://github.com/xm-online/xm-webapp/commit/2035113d02da07ad41ad3f8762ba93433e2d587c))
* **pwa:** add pwa setup ([#658](https://github.com/xm-online/xm-webapp/issues/658)) ([ac45671](https://github.com/xm-online/xm-webapp/commit/ac4567157d844599b97e2c2b6c085d0be9991cab))
* **registries:** add sidebar logo, menu ([1bf3b8a](https://github.com/xm-online/xm-webapp/commit/1bf3b8a60212c7dafd0cecd01f3ee500aef2799a))
* replace b with strong ([784a598](https://github.com/xm-online/xm-webapp/commit/784a598df1f586658f26ee4f4e78b66d525dcb2e))
* replace i with em, mat-icon ([25f4202](https://github.com/xm-online/xm-webapp/commit/25f42026d76ede490c3cc36ee1c6358b3f865bd9))
* **request-cache-factory:** add reloadInterval and requestTimeOut ([eff930a](https://github.com/xm-online/xm-webapp/commit/eff930ad7d2101e0be30022cd0e37fcc485f9665))
* **request-cache-factory:** add takeUntilOnDestroy to reloadIntervalHandle ([08241fe](https://github.com/xm-online/xm-webapp/commit/08241fea1eaccff6ac6a3998b6656b7d75e4bfc4))
* **request-cache:** add RequestCacheFactoryService ([d34eab4](https://github.com/xm-online/xm-webapp/commit/d34eab441a7136de0c7ee94ca84fb55006fae849))
* **request-cache:** remove reloadInterval and requestTimeOut ([c2fe9aa](https://github.com/xm-online/xm-webapp/commit/c2fe9aa9ef5d3c5e928742404a62858c3d567375))
* **request-factory:** inject session into stream ([8b5d086](https://github.com/xm-online/xm-webapp/commit/8b5d086f9e9ef2e0784e848d3235bfc51fa695b8))
* **ribbon:** add env icons ([a4d64a7](https://github.com/xm-online/xm-webapp/commit/a4d64a77e7c4938a32916cb8f1b091c262adc85e))
* **ribone-styles:** remove unused prefixes ([e1536aa](https://github.com/xm-online/xm-webapp/commit/e1536aa7d23e7bb8b54dfd0eab0e7a3f4ceddacc))
* **role-management:** save pagination to query params ([1e437f8](https://github.com/xm-online/xm-webapp/commit/1e437f8b2b3a344f696022f93997dba5f6524867))
* **route-change:** add route change animation ([#572](https://github.com/xm-online/xm-webapp/issues/572)) ([6b12728](https://github.com/xm-online/xm-webapp/commit/6b12728af843be952cc0ff8602f6de72b1206d41))
* **scope-attribute:** add scope attribute ([293a4f8](https://github.com/xm-online/xm-webapp/commit/293a4f8f8cb2c1193bb7795fb9d0c6d29e3e4031))
* **select-dashboards:** add translations ([71e1fa8](https://github.com/xm-online/xm-webapp/commit/71e1fa8915d71a0c2c7fb078eb6be49d440ea338))
* **selector-text-control:** trim selector value ([33b7460](https://github.com/xm-online/xm-webapp/commit/33b7460d49e7e95a5634831fc7440349a5a1565f))
* **shared-interfaces:** add dataQa ([78957c7](https://github.com/xm-online/xm-webapp/commit/78957c7b9a9cf809ee0f5f48786b4f305cfc974f))
* **shared-operation:** add interpolate.ts ([a155e45](https://github.com/xm-online/xm-webapp/commit/a155e45ebca0ee300a03b44378c9a9bbe25e4b89))
* **shared:** add Id and IId ([addfe38](https://github.com/xm-online/xm-webapp/commit/addfe38b5795bdf83bcc7ec00d93ceb8abac17bf))
* **shared:** add package.json ([728909f](https://github.com/xm-online/xm-webapp/commit/728909fda5874664476cf8e402a4ab4025db6534))
* **shared:** add validators ([859b95c](https://github.com/xm-online/xm-webapp/commit/859b95c99e76a1f44038e6a0c8e77629503294af))
* **shared:** move to packages ([5710b8b](https://github.com/xm-online/xm-webapp/commit/5710b8bf34383b9f07e1d3bc2d52d3c36dca27f4))
* **sidebar-right:** add components ([c4bc531](https://github.com/xm-online/xm-webapp/commit/c4bc531fa266a6d5c6ec65f034e184c4099bc460))
* **sidebar-user:** add subtitles ([#710](https://github.com/xm-online/xm-webapp/issues/710)) ([10c810a](https://github.com/xm-online/xm-webapp/commit/10c810a09e891cb07b685757c187f833e0fa384b))
* **sidebar:** add class to host ([06f29da](https://github.com/xm-online/xm-webapp/commit/06f29da46e511b9a999226b6f148744378fa140e))
* **sidebar:** add dynamic layout ([72a26fe](https://github.com/xm-online/xm-webapp/commit/72a26fed91b7a2cc878d2f13d4a6e98bf00b6566))
* **sign-in:** add navbar section ([476943c](https://github.com/xm-online/xm-webapp/commit/476943c727bcf79fd8fc682b69e01c73e35b2963))
* **sign-in:** add remember me ([926aaf6](https://github.com/xm-online/xm-webapp/commit/926aaf6af64133d48f8d8c6e21172c7e642e2608))
* **sign-in:** add sign-in form ([2edc813](https://github.com/xm-online/xm-webapp/commit/2edc813ddc89c794da1e8a00841599650cdda1af))
* **sign-in:** add sign-in fullscreen ([7793050](https://github.com/xm-online/xm-webapp/commit/77930504abd7cc63cb44ec3f23e66b0ac431ef7c))
* **sign-in:** add top icon ([d660be1](https://github.com/xm-online/xm-webapp/commit/d660be17da03b04701813a9e66d496cc88cfdba6))
* **spec-mng:** change maxLines ([5569cdd](https://github.com/xm-online/xm-webapp/commit/5569cddac8638c6ab8b326ba5fb44801a4d1e756))
* **spec:** fix MR ([e6bbc9e](https://github.com/xm-online/xm-webapp/commit/e6bbc9e0312f4fec7eb099a70bec839dac8736a8))
* **specification:** update translates ([b2013e4](https://github.com/xm-online/xm-webapp/commit/b2013e45e6ea603a793dd104907f72e39cca5061))
* **spec:** improve code by MR comments ([50bc849](https://github.com/xm-online/xm-webapp/commit/50bc84926e51a290fd6d1705117f19eff6664696))
* **spec:** improve code by MR comments ([d7caba1](https://github.com/xm-online/xm-webapp/commit/d7caba1e785e2ce58904d8595d689b3a5cef715e))
* **spec:** improve code by MR comments ([e5fee57](https://github.com/xm-online/xm-webapp/commit/e5fee57f849aa34f9d9d614be21cb2a29506915d))
* **spec:** improve yaml serialization ([#578](https://github.com/xm-online/xm-webapp/issues/578)) ([aa31c5e](https://github.com/xm-online/xm-webapp/commit/aa31c5e5ef37ea1f825a8970c06b484225dbb4c1))
* **spec:** initial spec editor ([f124d5b](https://github.com/xm-online/xm-webapp/commit/f124d5bbd428a8beee25008d069e66abda421480))
* **spinner:** add directive, spinner for material buttons ([55a6dc1](https://github.com/xm-online/xm-webapp/commit/55a6dc16b92530ecf072deecc65e5095bf11d5d6))
* **stats-widget:** add translates ([8bad2c5](https://github.com/xm-online/xm-webapp/commit/8bad2c590c39eacbac696709b9a35e9a5b0d75a5))
* **stats-widget:** removed mat-divider from widget template ([5448561](https://github.com/xm-online/xm-webapp/commit/5448561447eb62a60a00195c9c8fddc4501bb9ee))
* **string-handler:** add string handler ([#655](https://github.com/xm-online/xm-webapp/issues/655)) ([8a8d1d7](https://github.com/xm-online/xm-webapp/commit/8a8d1d74ca7cc8b742fea4ba7f0c2a7d1324958d))
* **string-handler:** add touch event ([dce8bef](https://github.com/xm-online/xm-webapp/commit/dce8bef56647f8608f9f969ebed8dabef103a664))
* **style-guide:** add style-guide ([bce928a](https://github.com/xm-online/xm-webapp/commit/bce928a16e275c3140bf511865c235b8cf80e2b3))
* **styles:** add radius-lg ([fb683b7](https://github.com/xm-online/xm-webapp/commit/fb683b77404384a5134fb0dc7f7291a672f7c587))
* **styles:** make scroll config global ([fb10ff0](https://github.com/xm-online/xm-webapp/commit/fb10ff00e5c34ced20038d6941563035b93bbca5))
* **swagger:** update version ([f4b06e9](https://github.com/xm-online/xm-webapp/commit/f4b06e91222cd5125e882d2cdf15cf8d39400ea5))
* **switch-theme:** save theme to store ([211cad6](https://github.com/xm-online/xm-webapp/commit/211cad6c6d130b1a804cfbce123c564b018eaf2d))
* **table-column:** add dataClass ([bc93fb6](https://github.com/xm-online/xm-webapp/commit/bc93fb6b600a678d512ab929cf6090737d933998))
* **table-column:** add dataStyle ([1ea90fc](https://github.com/xm-online/xm-webapp/commit/1ea90fc590f7462cbf6a8cf7cfc78289ff844176))
* **table-filter-validation:** alternative errors source ([9c4a43f](https://github.com/xm-online/xm-webapp/commit/9c4a43f56c3fd5b5ebd51c1a94658567ee9141a0))
* **table-filter-validation:** validation messages from configuration ([a796d38](https://github.com/xm-online/xm-webapp/commit/a796d3838ee89260c8a9e2fab19558de5578998d))
* **table:** add xm-table-column-dynamic-cells ([ecd5cc2](https://github.com/xm-online/xm-webapp/commit/ecd5cc2d7133f4959cb8222cc8a489f73ff113a8))
* **take-until-on-destroy:** add TakeUntilOnDestroy decorator ([41036c5](https://github.com/xm-online/xm-webapp/commit/41036c53ad27363fc3a80d4ba195fe54415f89a2))
* **test:** specify packages and src dirs ([5f71531](https://github.com/xm-online/xm-webapp/commit/5f71531dbda0be387740eb5cc8e0e08f93bbc7a0))
* **text-join-value:** add text-join-value ([dc5f575](https://github.com/xm-online/xm-webapp/commit/dc5f57547d3a92e9927f20a9152c9445ab083f89))
* **text-range:** add auto height ([6ad4fe8](https://github.com/xm-online/xm-webapp/commit/6ad4fe8b0cd6d3b670f3028d617ce731d76f660b))
* **text-range:** add required ([2328c61](https://github.com/xm-online/xm-webapp/commit/2328c616d4d84cdab001e394673a5cd51e4b3b78))
* **text-range:** add TextRange ([2dd34ed](https://github.com/xm-online/xm-webapp/commit/2dd34edc9f6ea46b90057932b38d6f2b01d3d6c1))
* **text-view:** add dataQA ([ddf19df](https://github.com/xm-online/xm-webapp/commit/ddf19df2dbdef666b321967cd97c34e9cfdc51bc))
* **text-view:** add empty line ([568153a](https://github.com/xm-online/xm-webapp/commit/568153a73eda854673132f307c4bd9d948e41ab4))
* **text-view:** add primitive type ([#727](https://github.com/xm-online/xm-webapp/issues/727)) ([935551e](https://github.com/xm-online/xm-webapp/commit/935551e0bdc4a815465b0ce6958d962138329c8c))
* **text-view:** apply new styles ([#723](https://github.com/xm-online/xm-webapp/issues/723)) ([e7e7767](https://github.com/xm-online/xm-webapp/commit/e7e776786aa167006d6b19c1c058622cc0de4c55))
* **text:** add autocomplete to password ([f02971b](https://github.com/xm-online/xm-webapp/commit/f02971ba418266330d29d21e160447e5accac2e7))
* **text:** add controls ([d4b997b](https://github.com/xm-online/xm-webapp/commit/d4b997bfe2f02f83bb6d5f567ad7cadf81afa281))
* **text:** add date-value ([ca39290](https://github.com/xm-online/xm-webapp/commit/ca392903f00839861b1f3102da655a0c3ac70408))
* **text:** add examples ([88fe372](https://github.com/xm-online/xm-webapp/commit/88fe37288b577311feb67ef2eb27daac3a648b10))
* **text:** add labeled-container ([9deb4bf](https://github.com/xm-online/xm-webapp/commit/9deb4bfede0b07696ac65d8b341ff4bacff1ba68))
* **text:** add phone-number-control ([0ceeb2e](https://github.com/xm-online/xm-webapp/commit/0ceeb2eaa2603be206a5a4bcc7a90bdddc7a01af))
* **text:** add text-dynamic-view ([64c8a56](https://github.com/xm-online/xm-webapp/commit/64c8a56e0b251784741d6b082a0367029ff6fa37))
* **text:** add text-title and text-translate ([be09d5b](https://github.com/xm-online/xm-webapp/commit/be09d5b52a652801fd8a352b604dcae2a8af277f))
* **text:** add translate to emptyValue ([d426c6f](https://github.com/xm-online/xm-webapp/commit/d426c6f5a6634db533314e13de0848610774df5e))
* **text:** extend registry ([cf43134](https://github.com/xm-online/xm-webapp/commit/cf431343482eb28460284a635a6a7227d3ee28b3))
* **text:** update examples ([e204d79](https://github.com/xm-online/xm-webapp/commit/e204d796968680e55004cad10c38829c98d26f7f))
* **theme-scheme:** add theme-scheme.service.ts ([744f986](https://github.com/xm-online/xm-webapp/commit/744f986e6a2998c04214162446e867073de66774))
* **theme:** add theme dark switch ([59cada0](https://github.com/xm-online/xm-webapp/commit/59cada00450e09f50ff339579b39488f3bfe8df7))
* **theme:** add xm-theme ([2b459c7](https://github.com/xm-online/xm-webapp/commit/2b459c7855523d473686afcf2d83511603e500d9))
* **theming:** add to gitignore ([9386190](https://github.com/xm-online/xm-webapp/commit/9386190d02e85eb9cde4c00b8309ecd13be8075d))
* **toaster:** define interface properties ([4fc4fe9](https://github.com/xm-online/xm-webapp/commit/4fc4fe9d9b907e8d8f581e18a47f1963c0a96bb1))
* **transform-by-map:** add multi level ([8b25563](https://github.com/xm-online/xm-webapp/commit/8b2556359e86466d95b5c88cafc7fd12d9b55191))
* **transform-by-map:** add transformByMap ([f57cad7](https://github.com/xm-online/xm-webapp/commit/f57cad78e78f7e2fc9c52e4154346fab6277979c))
* **transform-format:** the ability to use false, 0, ''... as a fieldValue in transformByMap ([5242568](https://github.com/xm-online/xm-webapp/commit/52425688c7e3de03b473656abcd9b55862cebab7))
* **translates:** add ru and uk locale ([55789f9](https://github.com/xm-online/xm-webapp/commit/55789f9fc3c3c6cc257ecf2b60bb6a4c021ba2d5))
* **translate:** set default translate ([fbc451a](https://github.com/xm-online/xm-webapp/commit/fbc451ab4fc1df3564fabb9a1e0db367d2663c86))
* **translation:** add interpolate ([795aeae](https://github.com/xm-online/xm-webapp/commit/795aeaeef61f410ee09564e3691b488f21198618))
* **translation:** add postfix to the title ([876097b](https://github.com/xm-online/xm-webapp/commit/876097b4a30eec27bd425a61c0c3e2ce27bd7fd9))
* **translation:** add XmTranslateService ([44f927f](https://github.com/xm-online/xm-webapp/commit/44f927f7fcda8d0b45582bf4508163700e6e9fbf))
* **tsconfig:** enable strictInputAccessModifiers ([c641073](https://github.com/xm-online/xm-webapp/commit/c641073fdfdebab7a6a824d8c22fff24d3193a63))
* **tsconfig:** switch target to es2015 ([8a6d164](https://github.com/xm-online/xm-webapp/commit/8a6d1647a077c9bc51fc23d70d7622f9b162835f))
* **ui-config:** split to xm-private and xm-public ([cf77e67](https://github.com/xm-online/xm-webapp/commit/cf77e67d6e50ddd904d9f3ac5dca73882448cb24))
* **ui-mng:** add xm-ace-editor-control ([f16d752](https://github.com/xm-online/xm-webapp/commit/f16d7526797b62527b95efd3743cb94b4e5b6835))
* **unblock-lock-button:** add optional title ([af98eb5](https://github.com/xm-online/xm-webapp/commit/af98eb526e383b58c186e6f73184b5a1596bb219))
* **unblock-lock-user:** add unblock-lock-user ([c63fad0](https://github.com/xm-online/xm-webapp/commit/c63fad025e8973db48b44fbb3f7234427cabff7f))
* **unblock-users:** add translations ([e6a14d3](https://github.com/xm-online/xm-webapp/commit/e6a14d338ce5545c63ffba4affc2fb94bbb22a8d))
* update to angular 9.1 ([c93ce21](https://github.com/xm-online/xm-webapp/commit/c93ce216fd065e64c8b5f8f8402d4ff7598a8951))
* **user-management:** add multi-role support ([b6797fa](https://github.com/xm-online/xm-webapp/commit/b6797fa61d0bf78cf1ee08f93eebfa8a1a30a085))
* **user-management:** set roleKey with multiRoles ([b200787](https://github.com/xm-online/xm-webapp/commit/b2007873a7c585f06b15ae606cc4db2d77cab026))
* **user:** add authorities ([0701feb](https://github.com/xm-online/xm-webapp/commit/0701feb46451aa728f37f7f29e79a2832b4be907))
* **user:** move to packages ([2be937d](https://github.com/xm-online/xm-webapp/commit/2be937d75738bf2aa55158d8d4cf1bad47033365))
* **validator-processing-service:** change minDate, valueMoreThanIn, valueLessThanIn ([edcab1c](https://github.com/xm-online/xm-webapp/commit/edcab1cb68afa53ef885c0f496c8f969523e15f5))
* **validator-processing-service:** fix for date & number validation ([df1b9a5](https://github.com/xm-online/xm-webapp/commit/df1b9a5a07427cd7743072000c499dfbbd862c63))
* **validator-processing-service:** fix getTime error ([c94a590](https://github.com/xm-online/xm-webapp/commit/c94a5902dcc9a85620563f00557e758f0104bfe8))
* **validator-processing-service:** remove spaces ([8d8279e](https://github.com/xm-online/xm-webapp/commit/8d8279e78c29df913252a3b286cc1f7c571a69c8))
* **validator-processing.service:** add dateMoreThanIn, dateLessThanIn validators ([39f219f](https://github.com/xm-online/xm-webapp/commit/39f219f3bd3c5129029126c64f99caca1cd2a247))
* **validator-processing.service:** add severalEmails validator ([6ac85f4](https://github.com/xm-online/xm-webapp/commit/6ac85f4e25b3264a8e48247ed111ebacc8a84c8a))
* **validator-processing:** add validator-processing ([5765543](https://github.com/xm-online/xm-webapp/commit/57655433b78cfbe4983fdfea7ae7c42d45121416))
* **ValidatorProcessingService:** extends ValidatorProcessingService new validations ([ee1054f](https://github.com/xm-online/xm-webapp/commit/ee1054fd2f4057cfd82b2bd61a2459fba5b3ed31))
* **ValidatorProcessingService:** fix spec ([0c050a2](https://github.com/xm-online/xm-webapp/commit/0c050a2fa913ae46e7e1c432e13d68f3a0aeaab9))
* **versions:** use same versions for new dependencies ([7d2f82d](https://github.com/xm-online/xm-webapp/commit/7d2f82d72e05ae538e8d37c9a1fecbc8d32191f1))
* **widget-edit:** add docs ([2a93bf4](https://github.com/xm-online/xm-webapp/commit/2a93bf4aa1b9df169b429bec8a429c4c7c234ad7))
* **widget-edit:** add EDIT_WIDGET_EVENT ([19d3a62](https://github.com/xm-online/xm-webapp/commit/19d3a62afd382bcae92053c2a442d2601e21d283))
* **widget-edit:** add xm-selector-text-control ([2ed70c0](https://github.com/xm-online/xm-webapp/commit/2ed70c055306eafc64213c1c98aae668d3f1eeaa))
* **widget-list:** add ApplicationRef ([16bbab6](https://github.com/xm-online/xm-webapp/commit/16bbab6b97bb701dcb52c66eeb435ecadc0d5146))
* **widget-list:** add widget-list service ([46d2976](https://github.com/xm-online/xm-webapp/commit/46d2976e4089268a0b2b2ea1fc384c633c88794d))
* **WordAutocompleteModule:** add WordAutocompleteModule ([b9501be](https://github.com/xm-online/xm-webapp/commit/b9501be33343460302732a00a63df09d978fec3a))
* **xm-alert:** fix error as object response ([48e9da7](https://github.com/xm-online/xm-webapp/commit/48e9da7cf83f0d0963f28d1b6247e91fa23c4d09))
* **xm-alert:** replace $.notify with snackBar ([a2ea94d](https://github.com/xm-online/xm-webapp/commit/a2ea94d848c635ffea7f348831c5110f29d363ae))
* **xm-alert:** replace alert with snackbar ([a991755](https://github.com/xm-online/xm-webapp/commit/a9917555f336839f28e7fda69d1cb4afb5952bae))
* **xm-bool-control:** add xm-bool-control ([6d9299e](https://github.com/xm-online/xm-webapp/commit/6d9299effc61a37533a589c0b9e73a9129fafdcf))
* **xm-bool:** add OnChange ([e1dabf6](https://github.com/xm-online/xm-webapp/commit/e1dabf600bd680f9a34cc64373980f4767d0dd6f))
* **xm-bool:** change remove to remove_circle_outline ([0de6234](https://github.com/xm-online/xm-webapp/commit/0de6234e9a0cbcc9723ff50538f6544376798b65))
* **xm-bool:** rename to xm-bool-view ([3cdc24a](https://github.com/xm-online/xm-webapp/commit/3cdc24a36c3ec0af52cf049912202e76db8892b8))
* **xm-control-errors:** add XM_CONTROL_ERRORS_TRANSLATES ([102021a](https://github.com/xm-online/xm-webapp/commit/102021a5cbd97e0d16a82c722c65c48c5425c485))
* **xm-date-range:** add auto focus ([3a2400a](https://github.com/xm-online/xm-webapp/commit/3a2400a80b9b56db6191f1a8b5255446475829f4))
* **xm-dynamic-control-example:** create XmDynamicControlExample ([78aba73](https://github.com/xm-online/xm-webapp/commit/78aba7345b7124104abb970f35af213f717edd20))
* **xm-enum:** add xm-enum-view, xm-enum-control ([b7e47c1](https://github.com/xm-online/xm-webapp/commit/b7e47c17c300f533a2c0f152a231447c144cb7ac))
* **xm-mat-card:** add actions section ([9a595c3](https://github.com/xm-online/xm-webapp/commit/9a595c36513a4cad51886b81bdeb1aece2edb662))
* **xm-mat-card:** add data-qa ([4c829ad](https://github.com/xm-online/xm-webapp/commit/4c829ad3c496a6b3c7b21e43541f2f5b163f1c14))
* **xm-mat-card:** add loading ([a05479a](https://github.com/xm-online/xm-webapp/commit/a05479acbab8bb153295d5d84243250414776cca))
* **xm-mat-card:** add permission ([289e2ab](https://github.com/xm-online/xm-webapp/commit/289e2ab6652669d4ee60668248d6c325bd7b21e0))
* **xm-mat-card:** add xm-header-actions ([#693](https://github.com/xm-online/xm-webapp/issues/693)) ([f1d0aec](https://github.com/xm-online/xm-webapp/commit/f1d0aec469b0ed8c7c4385e7db590700f905c77f))
* **xm-mat-card:** add xm-mat-card ([#675](https://github.com/xm-online/xm-webapp/issues/675)) ([961c71b](https://github.com/xm-online/xm-webapp/commit/961c71b1a6b95bfa46a78ef52c81024284119783))
* **xm-mat-card:** switch PageChangesStore on edit ([08657ee](https://github.com/xm-online/xm-webapp/commit/08657ee30f135a5bf0fb08fba372e9bb3721ac18))
* **xm-navbar-language:** add tooltip ([4d28191](https://github.com/xm-online/xm-webapp/commit/4d2819167c3685b78343f65b9670baea220b4701))
* **xm-public:** add xm public page ([4c6289c](https://github.com/xm-online/xm-webapp/commit/4c6289c41c95f110d88f67fc8c8f6d6be67a6672))
* **xm-ribbon:** add release version ([76b9259](https://github.com/xm-online/xm-webapp/commit/76b9259ac4748bf60d9a0853b1ae3bb7eafaf67f))
* **xm-table-column-dynamic-cell:** add component ([e717c3e](https://github.com/xm-online/xm-webapp/commit/e717c3ebdf5d93412fdcb9dfbdecc18bfc039543))
* **xm-text-control:** add possibility to trim value ([b72f12d](https://github.com/xm-online/xm-webapp/commit/b72f12d4370a84dcaf7937d416ea79ee544d64f1))
* **xm-text-control:** add possibility to trim value ([819bbf6](https://github.com/xm-online/xm-webapp/commit/819bbf620704916eea8386b7aba821184b2557fd))
* **xm-text-control:** add xm-text-control ([d1eb3e5](https://github.com/xm-online/xm-webapp/commit/d1eb3e5cbc264ccb5d7870cf1921e30c9b72c8db))
* **xm-text-control:** change default value for applyTrimForValue ([a8d2254](https://github.com/xm-online/xm-webapp/commit/a8d2254c65213a17c7c28d18a939abf5d5bd12a8))
* **xm-text-example:** add example with text trim option, add doc to README.md ([5bcc90e](https://github.com/xm-online/xm-webapp/commit/5bcc90e0d10e7ee5c76b36f717eccad0dc615a49))
* **xm-text-view:** add xm-text-component ([b564dfd](https://github.com/xm-online/xm-webapp/commit/b564dfd0ec30aa80f73c55f0be85310bbfdc0908))
* **xm-text-view:** add xm-text-view ([7fa8488](https://github.com/xm-online/xm-webapp/commit/7fa84882d9e6ad3c1e54f8f052a73247d21e0c69))
* **xm-text-view:** no inline margin ([a18a015](https://github.com/xm-online/xm-webapp/commit/a18a0158d77a143600482b9a7fd11c62de60b44e))
* **xm-theme:** extend with themeScheme and colorScheme ([ba95d61](https://github.com/xm-online/xm-webapp/commit/ba95d616b666a9a45013595235c889baed257a2c))
* **xm-toaster:** change to MatSnackBar ([f7a73d3](https://github.com/xm-online/xm-webapp/commit/f7a73d3aba9856af4f9b5b8bb8ef9a348425c342))
* **xm-translation:** add TranslatePipe to services ([cc6a936](https://github.com/xm-online/xm-webapp/commit/cc6a936b4d0a21faa79b85386f2c472c56928122))
* **xm-user-login-widget:** add XmUserLoginWidgetModule ([7f19385](https://github.com/xm-online/xm-webapp/commit/7f19385c4b55e4d8240809cc4716e564d06a6f1a))
* **xm-user-security-settings:** add XmUserSecuritySettingsModule ([8acd0c9](https://github.com/xm-online/xm-webapp/commit/8acd0c96d518de0787aa4a3905bebbe65c021514))
* **xm-user-settings:** add XmUserSettingsWidgetModule ([f5462cf](https://github.com/xm-online/xm-webapp/commit/f5462cf325ebd706ffa2c0787bd10f4ae669cd18))
* **XmDatetimeControl:** General improvements ([895713a](https://github.com/xm-online/xm-webapp/commit/895713a6463cb7915c0ea66b4567b31564198fd9))
* **XmEntity:** add createdBy ([aa55550](https://github.com/xm-online/xm-webapp/commit/aa55550f44eb1c9f7092828f88051f317b892664))



# [3.0.0](https://github.com/xm-online/xm-webapp/compare/v2.0.0...3.0.0) (2020-03-20)


### Bug Fixes

* add img-fluid class to <img ([5a31bce](https://github.com/xm-online/xm-webapp/commit/5a31bce3adea313746797f07058802a96e473fc1))
* **alert:** remove margin on top ([f35bf25](https://github.com/xm-online/xm-webapp/commit/f35bf25642c0d4d08216610397d3b9aa78709179))
* **app:menu:** added condition for empty menu/children.length ([72fbec5](https://github.com/xm-online/xm-webapp/commit/72fbec580858bf62a65327fa9dee4b4dedcc3eeb))
* **app:menu:** reorganized if ([2ec9bdf](https://github.com/xm-online/xm-webapp/commit/2ec9bdf2aff94020ba282684a82b69ae9a381ae2))
* build ([06e7f8c](https://github.com/xm-online/xm-webapp/commit/06e7f8c1364c70bb91cf3801cc33aa1758a45c18))
* **build:** fix global ([e495a63](https://github.com/xm-online/xm-webapp/commit/e495a630a2b64fe1105a69b151c54e54d22d9c5a))
* **build:** strict deps ([8aa7f8e](https://github.com/xm-online/xm-webapp/commit/8aa7f8e6fa76e0caa46072983080e5467c539b6e))
* **card:** fix card styles ([97b4925](https://github.com/xm-online/xm-webapp/commit/97b4925277b2c4431666b3b679d57f42774a22d2))
* check by env ([b6d5b34](https://github.com/xm-online/xm-webapp/commit/b6d5b345b9fdfaf82295d09ad47a991f3859463c))
* **client-management:** fix scopes ([1d2b00d](https://github.com/xm-online/xm-webapp/commit/1d2b00dd59045230ef59e6586be186d6ace10d1f))
* **client-management:** remove console ([bb76f0d](https://github.com/xm-online/xm-webapp/commit/bb76f0dab882a63d3d2bf81136f7876d09c6dd5c))
* **dialog:** fix submit button ([6bc25fe](https://github.com/xm-online/xm-webapp/commit/6bc25fe627c90d7e058110eb968e689e6e7d2261))
* disable errors ([1135822](https://github.com/xm-online/xm-webapp/commit/1135822af81f6b114b57d54aec0e7095dfa225ac))
* **feetback:** add attributes ([68aa2b6](https://github.com/xm-online/xm-webapp/commit/68aa2b6f7189dae5335914204aba53554850a0e5))
* fix RequestCache ([553745c](https://github.com/xm-online/xm-webapp/commit/553745c49f0bcaa84daedb411288a449afed759f))
* fix: replace Renderer with Renderer2 ([dc1d300](https://github.com/xm-online/xm-webapp/commit/dc1d300ad73242ccc0b95a90edcb6de9096d1781))
* **karma:** update to angular 9 configs ([3cac80a](https://github.com/xm-online/xm-webapp/commit/3cac80a173d9a34e323d65b2ab02d5cec1d8cd90))
* **loader:** fix scss ([bafd891](https://github.com/xm-online/xm-webapp/commit/bafd891d5fe15d78cb76fad28da647161e8cb785))
* main, navbar, task-manager - button styles ([2b05203](https://github.com/xm-online/xm-webapp/commit/2b052037a99268a9ed6219f4eb19b145fe667a4b))
* mat-fab color ([e84f250](https://github.com/xm-online/xm-webapp/commit/e84f25012d1687bfeaf9519546b8a74daf81d37b))
* **menu:** add *permitted and hidden ([dce0e93](https://github.com/xm-online/xm-webapp/commit/dce0e937dc46efe91845b0fb398d71fc2b96758c))
* **menu:** fix groupKey match ([c512a7e](https://github.com/xm-online/xm-webapp/commit/c512a7ede1aa342cbaca2b04b86182a89c061871))
* **menu:** remove useless argument ([da61fd6](https://github.com/xm-online/xm-webapp/commit/da61fd675569d42a7ac349aea5fbd923f62e605c))
* **navbar:** add  navbar-toggler ([56480e2](https://github.com/xm-online/xm-webapp/commit/56480e23fe40553940281c4c9e5bfcc0d873765b))
* **navbar:** allow feedback only auth-ed users ([07bbc6f](https://github.com/xm-online/xm-webapp/commit/07bbc6fa8310e1a910f07e47e8a0eb6a472fe10c))
* **ngx-translate:** fix translate loader ([1845a7c](https://github.com/xm-online/xm-webapp/commit/1845a7c25d2ac4487bca63ff37762de9c06c4c3e))
* **notifications:** add clearInterval ([3658f6f](https://github.com/xm-online/xm-webapp/commit/3658f6f305c17e587d6fe8c2ae10784fccbba05a))
* remove conflicted rules ([7521687](https://github.com/xm-online/xm-webapp/commit/75216876c1d1ca72dd05abd01ea80d0e7ee57be2))
* **ribbon:** change header ([eb35713](https://github.com/xm-online/xm-webapp/commit/eb357137fc4fc852b7d3174b2ce89b2b97ff16b5))
* **scripts:** extend manage-exts.js with assets ([85943ff](https://github.com/xm-online/xm-webapp/commit/85943ff241dd99572c5c3dc6da1cf60030906e52))
* **scripts:** remove  generate-localization-file.py ([f8720b7](https://github.com/xm-online/xm-webapp/commit/f8720b70ccfe026bd0354233b419e681c834f762))
* **shared-testing:** typing ([1e844a8](https://github.com/xm-online/xm-webapp/commit/1e844a8571616f5158c0458125bc105ebf9c5896))
* **shared:** add createRequestOption ([a1d8f75](https://github.com/xm-online/xm-webapp/commit/a1d8f755a6fb8a6f957552d100e201b8d64423b4))
* **shared:** fix build ([c274af2](https://github.com/xm-online/xm-webapp/commit/c274af2a47062f2db5254df2f17b17801bd6f23b))
* **sidebar:** add EntityConfigService ([a35d705](https://github.com/xm-online/xm-webapp/commit/a35d70551ca0c3faee27c64743a6632bab3292cb))
* **sidebar:** added const for if ([1dd171e](https://github.com/xm-online/xm-webapp/commit/1dd171ecaf199149f04ccc6e6febf024547055cb))
* **sidebar:** added possibility to hide item ([c084fe6](https://github.com/xm-online/xm-webapp/commit/c084fe6cdc97c16ee169841b7eb824c465b65aaa))
* **sidebar:** split styles ([53854ae](https://github.com/xm-online/xm-webapp/commit/53854aebb6f9f13f14e3b9f45dca7e422b3b8bb1))
* **styles:** add mat-slide-toggle-thumb ([873475c](https://github.com/xm-online/xm-webapp/commit/873475c53e1c8fc4b703ed1fedd2d89d4e149713))
* **styles:** fix rounded ([b82d535](https://github.com/xm-online/xm-webapp/commit/b82d535cc94a2717a25ab371c4e8367898e74973))
* **styles:** fix themes build and import ([0e74fa3](https://github.com/xm-online/xm-webapp/commit/0e74fa3f6169ae7b3d33732a9156ed687f1fb73f))
* **styles:** improve bootstrap typography ([b135c2e](https://github.com/xm-online/xm-webapp/commit/b135c2e8613a6ebfc0bf4ba6a6c711290ab67f45))
* **styles:** remove mat deps ([46b1086](https://github.com/xm-online/xm-webapp/commit/46b108656d51ee4772638acd037ed5b078b9a2d4))
* **test:** add NgxWebstorageModule ([7b5df3a](https://github.com/xm-online/xm-webapp/commit/7b5df3a38c228ec09f059680e29636bc442bbf8d))
* **titles:** add undefined check ([a28cd5b](https://github.com/xm-online/xm-webapp/commit/a28cd5b9df935dab49b1dc287d327078a193866c))
* **translations:** add XmTranslationModule ([8ed4f01](https://github.com/xm-online/xm-webapp/commit/8ed4f01c6908d20b3487dec78a7670b949fadf5b))
* **user-component:** ooops o_0, somebody forget to remove debugger ([c1847dd](https://github.com/xm-online/xm-webapp/commit/c1847ddf4023125c0b41c703912a91545c55aad4))
* **user:** fix logout permission ([8990479](https://github.com/xm-online/xm-webapp/commit/8990479ebf0460c2869a2359da685d5bf68c3e29))
* **xmAceEditor:** add destroy ([cdee115](https://github.com/xm-online/xm-webapp/commit/cdee115241fa5ddda5811b6c98cb3aeab791e4e3))
* **XmUiConfigService:** move requestCache to constructor ([d3c0b54](https://github.com/xm-online/xm-webapp/commit/d3c0b54e16aa34db981e432dd31b0092bd681bca))


### Features

* **account:** add logout ([c38725f](https://github.com/xm-online/xm-webapp/commit/c38725fe21ded358444476f383485133392ff3fd))
* add alert module ([d80e150](https://github.com/xm-online/xm-webapp/commit/d80e15041b5991cf841a830d39581f7875c69d15))
* add bowsersList ([97d2bc7](https://github.com/xm-online/xm-webapp/commit/97d2bc7bad01bcb48616934f8760f7327f2f7677))
* add cache, IUIConfig, XmUiConfigService ([6b4dbcb](https://github.com/xm-online/xm-webapp/commit/6b4dbcbf91755f6d7790473597847c5aa3816986))
* add input.module.ts ([f87686d](https://github.com/xm-online/xm-webapp/commit/f87686d9fdb612cf64f30bab4a48c622348054c6))
* add mb-5 ([0135d7f](https://github.com/xm-online/xm-webapp/commit/0135d7fce6147689ca362db72639e574f50fae62))
* add no-data module ([c89e1c4](https://github.com/xm-online/xm-webapp/commit/c89e1c4adffc1a1e4ada49476f0db15a25ecbedb))
* add noImplicitThis ([8a5fb69](https://github.com/xm-online/xm-webapp/commit/8a5fb692e97ab0af3cb170bef1baf54e63583121))
* add permission module ([9c56454](https://github.com/xm-online/xm-webapp/commit/9c56454321fd0c1b2614963d8eed99357a27ee76))
* add stylelint ([84c151d](https://github.com/xm-online/xm-webapp/commit/84c151d593d073f91729ba3884add1a597139c85))
* add typedef, type-annotation-spacing ([c83367c](https://github.com/xm-online/xm-webapp/commit/c83367caa62e7cd8a6ec15dedc58412cfa0e6f08))
* add xm-entity module ([a2bda11](https://github.com/xm-online/xm-webapp/commit/a2bda11903837f024cc75edf8ffc2157d768ce72))
* add xm-maintenance-view.module.ts ([56099f7](https://github.com/xm-online/xm-webapp/commit/56099f7146bfc578aa3b0b4ac33bb11e46bc665e))
* add XmEventManagerService ([d47e7c5](https://github.com/xm-online/xm-webapp/commit/d47e7c5317b6f9ddfa6de76e83d349744da5aed3))
* add xmsharedModule ([fd08bdf](https://github.com/xm-online/xm-webapp/commit/fd08bdf32e4dc6ddfbcb0f27bd36db67d7c5112f))
* **alert:** add XmToasterService, XmAlertService ([ca05342](https://github.com/xm-online/xm-webapp/commit/ca05342ef92da0ddee65e230aea2e32166c40806))
* **alert:** replace JhiAlertService with XmToasterService ([381fef8](https://github.com/xm-online/xm-webapp/commit/381fef8ac1a2112efac5ee04c36f9c9f85a3f737))
* **alert:** replace swal with XmAlertService ([e326bd5](https://github.com/xm-online/xm-webapp/commit/e326bd5ceec5804cc9db5e375362f65126dd8171))
* **angular.json:** add all themes ([d4aa7c7](https://github.com/xm-online/xm-webapp/commit/d4aa7c7aed88ac42629c07e36ea3d473111615e9))
* **angular2-json-schema-form:** XmJsonSchemeFormModule at '@xm-ngx/json-scheme-form' ([4270700](https://github.com/xm-online/xm-webapp/commit/42707003d024028ae93076b4a94cf126e2a0f493))
* **auth-jwt:** add session ([4533add](https://github.com/xm-online/xm-webapp/commit/4533addcad7d1baa704fe297202d4ce8405786b0))
* **build:** update angular to [@8](https://github.com/8).2.14 ([7ac124b](https://github.com/xm-online/xm-webapp/commit/7ac124b28a0e8945d232f052222fbee0af4ea761))
* **core:** add core config ([bdf050f](https://github.com/xm-online/xm-webapp/commit/bdf050f5baf422c1b061ff4a7ca5d91ffa5e331f))
* **core:** add permission service ([615ead2](https://github.com/xm-online/xm-webapp/commit/615ead25b07c9349d2ce404b2a32d7507e06d4db))
* **core:** add request-cache.ts ([791efa6](https://github.com/xm-online/xm-webapp/commit/791efa6e3aa816a3dfb50673d677201feaa84d10))
* **core:** add xm-ui-config ([525a365](https://github.com/xm-online/xm-webapp/commit/525a365675a71c3c850a326cf00a9fd4201fae6d))
* **core:** add xm-user ([b48af65](https://github.com/xm-online/xm-webapp/commit/b48af6597d0929c6aa0dc0504a5e47decb43a082))
* **core:** XmUiConfigService add private api ([1be3096](https://github.com/xm-online/xm-webapp/commit/1be30965cb5cf81c0de1c62882609a42dc2d75fc))
* **dashboard:** add widgetName ([58b84bd](https://github.com/xm-online/xm-webapp/commit/58b84bd4883cc730e35ccf25e51387246f432989))
* **dynamic-widget:** add error logs, provide injector ([b26137a](https://github.com/xm-online/xm-webapp/commit/b26137aeeb1140adc823788e85fac96747a7609b))
* **dynamic-widget:** add lazy module-entity support ([5dfa7a4](https://github.com/xm-online/xm-webapp/commit/5dfa7a43b82e352cbc9692c6ace451473b644d79))
* **editorconfig:** update ([0323e7f](https://github.com/xm-online/xm-webapp/commit/0323e7f0448450352b8ac5670fa348de26fa512e))
* **environment:** add getServerEnvironment ([768f9ea](https://github.com/xm-online/xm-webapp/commit/768f9ea229946573b6bd7a21218a779be418f30e))
* **eslint:** add code styles ([d180a46](https://github.com/xm-online/xm-webapp/commit/d180a460f7f77ef7504d7ee21518d5cc497c13eb))
* **eslint:** add configs, lint files ([0c2d322](https://github.com/xm-online/xm-webapp/commit/0c2d322d747e7b3089db7ba58241db1e7a31f6b3))
* **eslint:** extend rules with no-inferrable-types ([5be7d99](https://github.com/xm-online/xm-webapp/commit/5be7d99cd3447fd303be81c78702ad19db573da2))
* **feedback:** add feedback page ([9b33d73](https://github.com/xm-online/xm-webapp/commit/9b33d7317b077e9fdfa2e3aff405b137b451eeb4))
* **feedback:** material button styling ([7f1af48](https://github.com/xm-online/xm-webapp/commit/7f1af48e91db830f5b1357cbbd6a9d245f4808ec))
* hide linebreak-style, and of @typescript-eslint/no-use-before-define ([2a1c906](https://github.com/xm-online/xm-webapp/commit/2a1c9066d8a42f8d5435e8466d623809afde7d9c))
* **i18n:** add yes and no ([6b248a1](https://github.com/xm-online/xm-webapp/commit/6b248a1dd4930a955b99a6a5bbf4b44f4af2f649))
* **i18nJsf:** add Principal ([dec2ba8](https://github.com/xm-online/xm-webapp/commit/dec2ba89b72ccc0719f6604affe00ea562a78463))
* **icons:** removed icons from cards ([1c714f1](https://github.com/xm-online/xm-webapp/commit/1c714f1b92bb3fac80a76099f190aa3d6aa34a97))
* init ([5f2d229](https://github.com/xm-online/xm-webapp/commit/5f2d229d496a832c8659bf54d49dbef50d1b19f5))
* init permission.directive.ts ([74b1a4e](https://github.com/xm-online/xm-webapp/commit/74b1a4ec64922dfea024c5831ac6d2e6a0e4578d))
* **language:** add language.module.ts ([94e9dca](https://github.com/xm-online/xm-webapp/commit/94e9dca169300ba1fec6c28fbb70d62356ee9b3d))
* **layout:** add ribbon ([8e5da1e](https://github.com/xm-online/xm-webapp/commit/8e5da1e733cf0701d1778a37b1777deb81a842bd))
* **loader:** add loader module ([3efe451](https://github.com/xm-online/xm-webapp/commit/3efe451bd4f23f9ff55db326f332232fd129d2d8))
* **main:** add layout styling ([cf5d710](https://github.com/xm-online/xm-webapp/commit/cf5d710eb3ec75df4fde79aae03c882385e3e712))
* **menu:** add fucus style ([d1aff09](https://github.com/xm-online/xm-webapp/commit/d1aff09c1984322e25122161a0b9a8d0075b0079))
* **navbar:** remove useless comments ([7682f58](https://github.com/xm-online/xm-webapp/commit/7682f5875434b33bd9c545368910b1c264adffd7))
* **navbar:** styling icons ([5f2ec99](https://github.com/xm-online/xm-webapp/commit/5f2ec99920767fcb3b9032aa8111d192d8941630))
* **navbar:** styling of search input field ([1dc77ed](https://github.com/xm-online/xm-webapp/commit/1dc77ed973caf8171503e66f070b9a4c1a8581fd))
* **nginx:gzip:** add gzip conf ([033e538](https://github.com/xm-online/xm-webapp/commit/033e538330ed87560467285de409cd1a3fe49336))
* **package.json:** add npm-link to prebuild ([bdf47de](https://github.com/xm-online/xm-webapp/commit/bdf47defd4ef8dc82c1f87e6721b6b3ea98c5501))
* **package:** add webpack-bundle-analyzer ([5fc59ea](https://github.com/xm-online/xm-webapp/commit/5fc59ea210077bca44d9f87b99b846ed03bb751e))
* **package:** update all dependencies ([56f2220](https://github.com/xm-online/xm-webapp/commit/56f2220cf8dc07f4ef51fe5c39852328c4e0d638))
* **password:** the same padding as settings page ([60a2fb6](https://github.com/xm-online/xm-webapp/commit/60a2fb6ec4ae0bc49803e3ca58c0c85224e27b63))
* **permission:** improve doc ([04e27e3](https://github.com/xm-online/xm-webapp/commit/04e27e3fcf3171417463f1e2328a954145ada4b3))
* **polyfills:** update according to angular 9 ([ac40f48](https://github.com/xm-online/xm-webapp/commit/ac40f486bd086ac483b9bba4503221ade08602ab))
* replace deep /**/ with single /*/ ([811183d](https://github.com/xm-online/xm-webapp/commit/811183d073e73b65f73d01a8bb4000eeac89e819))
* replace ngx-rating with custom ([c893e9f](https://github.com/xm-online/xm-webapp/commit/c893e9fbce3ad416df567b4204eb0559bf77d984))
* **scripts:** replace string assets with glob: '**/*' ([5110012](https://github.com/xm-online/xm-webapp/commit/5110012641dfe09d7b0bfca37a5ab87bf861fb6f))
* **session:** add core session service ([fc1eaca](https://github.com/xm-online/xm-webapp/commit/fc1eacacb58f96777cc759b680a4c6c38debce2b))
* **settings:** the same colors for save buttons ([d916198](https://github.com/xm-online/xm-webapp/commit/d91619847094e674e0d19d5856801092f289328c))
* **shadow:** remove @angular/material ([cf1e12c](https://github.com/xm-online/xm-webapp/commit/cf1e12ce5c3772aadd0e52568d88769bd7106218))
* **sidebar:** add color variables ([7d8355f](https://github.com/xm-online/xm-webapp/commit/7d8355f211d8a5d6264f22a06898b987b9ee0dfe))
* **sidebar:** add xm-sidebar ([3ff9fee](https://github.com/xm-online/xm-webapp/commit/3ff9fee00c9f26e953485b882225d85eb691c7c2))
* **style:** add configs ([77f5f5f](https://github.com/xm-online/xm-webapp/commit/77f5f5f4036708744e8dc8f3455668a1abe7026f))
* **stylelint:** add configss, and lint files ([def796f](https://github.com/xm-online/xm-webapp/commit/def796fe5876f388ad88fa32b2e5e6a8b05a8bb0))
* **styles:** add bootstrap variables to theme ([3cecd4b](https://github.com/xm-online/xm-webapp/commit/3cecd4b2b1f4d394a7e54913222d5af6a2bb7c30))
* **styles:** add font variables ([ddf8c3e](https://github.com/xm-online/xm-webapp/commit/ddf8c3ee3b88755d8d305c54fc7891f759fedd8a))
* **styles:** add mixins ([df24b90](https://github.com/xm-online/xm-webapp/commit/df24b90d544627d1ad7bc469ebb14be6b96317ab))
* **styles:** add README, angular config extend with src/app/ext ([5400cad](https://github.com/xm-online/xm-webapp/commit/5400cadc1f2039250b355b3ba8757bd23cf4bc60))
* **styles:** add replace-styles.js ([5807286](https://github.com/xm-online/xm-webapp/commit/580728608698059eff4c6cf9c9007615a83c2f7c))
* **styles:** add scroll styles ([2aaacd9](https://github.com/xm-online/xm-webapp/commit/2aaacd962a29483440637acb257f68d0a53d459d))
* **styles:** add sidebar styling ([9de8ac3](https://github.com/xm-online/xm-webapp/commit/9de8ac3b99de80893c2dcfda9f2bb7aa1c4905f1))
* **styles:** add styles.scss ([b0027a6](https://github.com/xm-online/xm-webapp/commit/b0027a6a747feaee867c6ff8d31b3ed5e209a1e6))
* **styles:** add tint to secondary color ([7d52068](https://github.com/xm-online/xm-webapp/commit/7d52068eb2474267268f0f796a542fe7442747dd))
* **styles:** add typography vars ([84f7e4d](https://github.com/xm-online/xm-webapp/commit/84f7e4dc1ce00526c3b068741a3c73a4aa881166))
* **styles:** card-header ([363f9fb](https://github.com/xm-online/xm-webapp/commit/363f9fbf57a3bf64991b7a57303c6e036b5bd0df))
* **styles:** change theme build strategy ([e3eb4bb](https://github.com/xm-online/xm-webapp/commit/e3eb4bb53f44c831ffa52ea51cb6fda072e4e8ef))
* **styles:** remove components ([66a27dc](https://github.com/xm-online/xm-webapp/commit/66a27dcc5a65e8720e83e336b5ef74b111793f4b))
* **styles:** split theming with components.scss ([0424e2a](https://github.com/xm-online/xm-webapp/commit/0424e2a5e1992372e88bc9e7d0ace3055dbd8bb5))
* **sweetalert:** add scss variables ([6b618bf](https://github.com/xm-online/xm-webapp/commit/6b618bf2fb30d5a57424224e85dd93c2e16d1c96))
* switch to eslint ([df82521](https://github.com/xm-online/xm-webapp/commit/df82521037faad5e6a84d4a960a33b16f9a7eed6))
* **take-until-on-destroy:** add take-until-on-destroy.ts ([dac13d3](https://github.com/xm-online/xm-webapp/commit/dac13d3a432a1fda7f80b3ff8a1c225368d66b4c))
* **theme:** remove @angular/material, add default theme ([5ce020b](https://github.com/xm-online/xm-webapp/commit/5ce020b8e8d81b6d55f19a9eac3ea586152ba182))
* **themes:** add default xm themes ([78daf36](https://github.com/xm-online/xm-webapp/commit/78daf36aa19db72a2e0edad7263dcf9455409b51))
* **toaster:** add options ([5d9cf8d](https://github.com/xm-online/xm-webapp/commit/5d9cf8d06e95ac379bfaaf66fc425132bdea924e))
* **translate:** override ngx-translate ([f086166](https://github.com/xm-online/xm-webapp/commit/f086166ef079acb0ca88536c9baf3923533b8149))
* **tsconfig:** determine the necessary config ([a8644a9](https://github.com/xm-online/xm-webapp/commit/a8644a9594fb4ea799b9eb204959266c2412a88a))
* **tsconfig:** provide main modules ([2a60fca](https://github.com/xm-online/xm-webapp/commit/2a60fca43b46e622c2a8dc06907d929f2bd01baa))
* **ui-config:** add session listening ([f144993](https://github.com/xm-online/xm-webapp/commit/f14499321d28fb26e91532420589f761b8898a51))
* update @angular/flex-layout@8.0.0-beta.27 ([9ebcf0a](https://github.com/xm-online/xm-webapp/commit/9ebcf0a3b5abad6b2689a2726cff449da7ffa673))
* **xm-config:** in case if no data.theme use default ([85f17d2](https://github.com/xm-online/xm-webapp/commit/85f17d2f6db9c721d832d9a7f1368dffa2952fef))
* **xm-entity:** add @xm-ngx/entity ([76344a4](https://github.com/xm-online/xm-webapp/commit/76344a403324e5294754960ff4b9c63a24daf778))
* **xm-password-needed:** add xm-password-needed.module.ts ([66e3bd8](https://github.com/xm-online/xm-webapp/commit/66e3bd8836002706e35f797a34e119aece9f7880))
* **xm-routing:** import lazy modules ([a5f956e](https://github.com/xm-online/xm-webapp/commit/a5f956e99b622ddf8d26e9e89e1a6fdb4c19ac9c))
* **xm-toaster:** extend(bc) toaster service ([f981d8f](https://github.com/xm-online/xm-webapp/commit/f981d8fd2ea751b97ad34492446eb55ce7c4e2e2))
* **XmEntity:** extend with .data generic ([d4926c8](https://github.com/xm-online/xm-webapp/commit/d4926c8a1098eb9087603d57deed42efbf478cba))



