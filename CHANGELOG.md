
<a name="4.0.0"></a>
## [4.0.0](https://github.com/xm-online/xm-webapp/compare/v2.0.46...4.0.0) (2021-08-05)

### Add

* link-field and content-textarea widgets

### Backport

* **multiselect:** fix search

### Bugfix

* **fonts:** move material icon from web to local
* **translation-management:** add take(1) for download button

### Build

* remove AceEditorModule from GateSharedLibsModule
* change comma-dangle to warn
* update angular
* update eslint
* update eslint
* update karma
* change node-sass to sass
* **angular:** update to 12.1.1
* **packages:** add angular 10

### Chore

* remove console logging
* fix unused files
* remove EntityConfigService
* move ADMIN_ELEMENTS to XM_ELEMENTS
* add DynamicCellComponent
* add XmAceEditorControlOptions
* add UserManagementDetailModule
* fix entry resolve
* fix naming
* remove  cross deps
* add RolesManagementDetailModule
* fix /administration routing
* remove XmConfigModule, PaginationConfig
* add serve-production build
* move deps on PasswordResetInit
* add EntityCollectionBase
* pr fixed
* move interceptors to modules
* remove mediaMarshaller
* move update() from config, add getAll()
* replace TakeUntilOnDestroy with takeUntilOnDestroyDestroy
* add dynamic tenant services
* **AuthInterceptor:** provide XmCoreConfig
* **ITEMS_PER_PAGE:** move to packages/
* **ace-editor:** move to /components ([#692](https://github.com/xm-online/xm-webapp/issues/692))
* **admin:** move add route to /admin
* **admin:** split to packages
* **admin:** AceEditorDirective to module
* **admin-config:** move to administration
* **admin-service:** move to packages
* **admin-service:** add default value
* **admin.module:** update imports
* **admin.registry:** add lazy widgets
* **admin.registry:** add lazy components
* **administration:** update styles
* **alert:** update error message output
* **alert-error:** update typing
* **alert-error:** remove errors and replace errors with error
* **animations:** add appear, expand
* **aufit:** move to packages/
* **auth-core:** move to packages
* **auth-expired:** add token refresh
* **auth-expired:** simplify intercept method
* **auth-jwt:** add auth-store
* **auth-jwt:** add AuthRefreshTokenService
* **bool:** export default options
* **bool:** rename bool to xm-bool
* **by-entity-id:** rename from -cell to -value
* **card-icon:** remove icon
* **card-icon:** remove static icon from widgets
* **cli:** remove unused scripts
* **components:** update naming
* **components:** rename formControl to control
* **components-image:** update naming
* **controls:** add NgControlAccessor
* **cookies:** replace angular2-cookie with ngx-cookie
* **core:** update path
* **core-auth:** rename from AuthExpiredInterceptor to AuthInterceptor
* **core-auth:** remove AuthInterceptor
* **dashboard:** rollback divs
* **dashboard:** add logger
* **dashboard:** update typing
* **dashboard:** move path to xm-routing
* **dashboard:** remove rootRedirect
* **dashboard:** remove page-collection
* **dashboard:** update interfaces
* **dashboard:** separate sortByOrderIndex
* **dashboard:** remove routeSubscription
* **dashboard:** refactor
* **dashboard-wrapper:** add cache
* **dashboards:** exclude widgets path mapper from dashboard base
* **dashboards:** add page title service
* **dashboards:** exclude widgets mapper
* **dashboards:** add page service
* **dashboards:** move to /packages
* **dashboards:** add appearUp animation
* **dashboards:** add sort by title
* **dashboards:** add page service
* **dashboards:** rename getByByIdOrSlug to getByIdOrSlug
* **data-qa:** update data qa
* **date:** update date naming
* **date:** add errors and types
* **date:** add date-control, date-range-control
* **deps:** update paths
* **develop:** clean up
* **develop:** clean up
* **develop:** refactor
* **docs:** move to /packages
* **docs:** add docs module
* **dynamic:** extract DynamicBase
* **dynamic:** add XmDynamicModule
* **dynamic:** convert DynamicWidget to DynamicWidgetDirective
* **dynamic:** add default value
* **dynamic:** remove static
* **dynamic:** add dynamic register
* **dynamic:** split from dashboard
* **dynamic:** rename interfaces
* **dynamic:** move loaders to loader folder
* **dynamic:** fix typing error
* **dynamic:** remove i prefix
* **dynamic:** add dynamicLoaderService
* **dynamic:** make options optional at DynamicSearcher
* **dynamic:** extract loadModuleFactory, loadTenantModuleFactory
* **dynamic:** add options field
* **dynamic-cell:** provide DynamicLoader
* **dynamic-loader:** provide searcher
* **dynamic-tenant:** add loadAndResole
* **dynamic-widget:** refactor init set
* **dynamic-widget:** move dynamic to loader.service
* **dynamic-widget:** add deprecations
* **dynamic-widget:** migrate to dynamicLoader
* **empty-files:** remove empty files
* **entity-collection:** add sortable
* **entity-list:** fix linter
* **entity-list:** refactor
* **enum:** rename enum-value
* **enum-control:** add form
* **error:** move error to module
* **eslint:** changed rule
* **eslint:** update lint
* **feedback:** move to /packages
* **feedback:** fix imports
* **form-playground:** move to /packages
* **gateway:** move to gateway
* **guest-background:** styles
* **health:** move to /packages
* **home:** refactor layout ([#588](https://github.com/xm-online/xm-webapp/issues/588))
* **home:** add hide container
* **home:** move guest token to auth-jwt
* **home:** refactor
* **idle:** add idle service
* **idp:** disable SW
* **idp:** enabvle SW, map token idp
* **idp:** env debug
* **ignore:** add test.ts to lint ignore
* **jsf:** add JsfAttributes
* **link-list-card:** refactor
* **links:** add noopener
* **links-group-widget:** move to /components ([#691](https://github.com/xm-online/xm-webapp/issues/691))
* **loader:** add dark mode
* **loading:** move to packages/
* **location-detail-dialog:** refactor
* **login:** remove login index
* **login:** fix login-logout and session sync
* **logs:** move to /packages
* **main:** remove unused code
* **main:** fix loading
* **main:** remove animations
* **main:** fix session
* **main:** remove XM_SUCCESS_AUTH
* **maintenance:** move to /packages
* **maintenance:** move to packages
* **mat-fab:** add MatFabConfigBase
* **material-icon:** update material icon
* **menu:** hotfix sidebar madness
* **menu:** update permissions
* **menu-component:** replace XmEntityConfigService with XmEntitySpecWrapperService
* **merge-conflicts:** merge dev
* **metrics-modal:** move to /packages
* **navbar:** decompose ([#603](https://github.com/xm-online/xm-webapp/issues/603))
* **navbar:** split to components
* **navbar:** replace with async
* **navbar:** title and arrow move to components
* **navbar:** refactor titles
* **navbar:** rename components
* **navbar:** mov to /navbar-notification-widget
* **navbar:** fix naming, imports
* **navbar:** replace outlet with <xm-navbar>
* **navbar:** hide title and logo via config
* **navbar:** add dynamic widgets
* **navbar-language-menu:** update with material
* **ng-accessor:** remove any
* **ng-accessor:** add disabled and value
* **ng-model:** add input
* **no-data:** move to packages/
* **notifications:** move to /packages
* **operations:** add Defaults decorator
* **operators:** add download.ts
* **package:** return package-lock
* **package:** add config
* **package:** add marker for translations
* **package:** fixed version for icon
* **package:** remove auto execution get-translations from ci
* **package-lock:** unwanted changes
* **packages:** remove prebuild
* **packages:** strict localize
* **password:** change to mat-card
* **permission:** fix circular deps
* **phone-number:** move phone-number-control
* **phone-number-control:** add xm prefix
* **quotes:** replace with single quotes
* **registry:** update xm-text path
* **registry:** update urls
* **request-cache:** refactor
* **request-cache:** transform to injector
* **request-cache:** add setAndReload
* **roles-matrix:** move to /packages
* **rxjs:** fix import path
* **rxjs:** fix rxjs imports
* **search:** fix lazy route
* **shared:** update mock names
* **sidebar-right:** update -theme import
* **sidebar-right:** move width to const
* **sign-in-up-widget:** refactor
* **sortByOrder:** update typing
* **specification:** extract private-ui-mng
* **specification:** hide not implemented functionality
* **specification:** rename readOnlyMode to disabled
* **specification:** extract tenant-mng
* **specification:** extract timeline-mng
* **specification:** extract uaa-mng
* **specification:** extract ui-mng
* **specification:** extract uaa-login-mng
* **specification:** fix circular deps
* **specification-mng:** update slug
* **specification-mng:** rename to specification-management
* **specifications:** move to /packages
* **styles:** add placeholder
* **table-config:** update constants
* **text:** add text-control, text-range
* **text:** text-view
* **text:** rename to passport-control
* **text:** remove files
* **text:** xm-text rename to xm-text-view-container
* **text:** rename text-range to text-range-control
* **text:** add password-control
* **text:** add email-control
* **text-control:** add formControl
* **translate:** switch to translate pipe ([#636](https://github.com/xm-online/xm-webapp/issues/636))
* **translations:** change translations
* **translations:** remove xm-prefix in folder name
* **translations:** add translations
* **translations:** move to /packages
* **translations-management:** fix after demo
* **translations-management:** remove cache for config
* **tsconfig:** exclude testing
* **user:** rename to sidebar-user
* **user:** replace with user$()
* **user-management:** move multiRoleEnabled to security
* **user-management:** style html
* **xm-alert:** move to packages
* **xm-config-core:** add SERVER_API_URL
* **xm-core:** move to packages
* **xm-core:** remove XM_CORE_CONFIG_DEFAULT
* **xm-core:** remove init from module
* **xm-entity:** move EntityDetailDialogModule to module
* **xm-entity-spec-wrapper:** add RequestCache
* **xm-entity-spec-wrapper:** add RequestCacheFactoryService
* **xm-entity-widget:** remove console logs
* **xm-event-manger:** rename cache to dispatcher
* **xm-main:** remove xm-main
* **xm-password-needed:** move to packages/
* **xm-per-page:** move to packages/
* **xm-permission:** add empty value
* **xm-permission:** switch to defaultIfEmpty
* **xm-private-ui:** add RequestCacheFactoryService
* **xm-public-ui:** add RequestCacheFactoryService
* **xm-rating:** move to packages/
* **xm-translates:** move to /packages
* **xm-ui-config:** rename cache$ to config$()
* **xm-user:** add RequestCacheFactoryService

### Docs

* **dynamic:** add doc

### Feat

* add [@xm](https://github.com/xm)-ngx/ext
* replace ngx-rating with custom
* add cache, IUIConfig, XmUiConfigService
* add mb-5
* init
* init permission.directive.ts
* replace deep /**/ with single /*/
* add permission module
* add xmsharedModule
* add input.module.ts
* adding export and import dialogs and services
* adding methods to save and map export data
* add xm-entity module
* add [@xm](https://github.com/xm)-ngx/components/xm-ribbon
* move ELEMENT_NOT_FOUND to searcher
* added no data text options for empty lists
* add innerHtml
* add xm-maintenance-view.module.ts
* add BoolComponent
* add PROXY_INTERCEPTOR
* add no-data module
* add proxy interceptor
* add debug
* add alert module
* replace i with em, mat-icon
* replace b with strong
* add XmEventManagerService
* add bowsersList
* update to angular 9.1
* add [@kolkov](https://github.com/kolkov)/angular-editor
* added options to hide links if no links present
* add [@xm](https://github.com/xm)-ngx/xm-balance
* add permission.guard
* add NavbarDashboardEditWidgetModule
* **25488:** backport of pr [#799](https://github.com/xm-online/xm-webapp/issues/799) from master
* **25529-read-only-flag:** making backport of pr [#802](https://github.com/xm-online/xm-webapp/issues/802) from master
* **WordAutocompleteModule:** add WordAutocompleteModule
* **XmDatetimeControl:** General improvements
* **XmEntity:** extend with .data generic
* **XmEntity:** add createdBy
* **account:** add logout
* **ace:** add search
* **ace-editor:** add xm-* to name
* **ace-editr:** add AceEditorThemeSchemeAdapterDirective
* **admin:** duplicate dashboard
* **admin:** rename widget components
* **admin:** remove old dashboard management widget
* **admin:** move user, role, client managment
* **admin:** rename widget components
* **admin-base:** save to query params
* **admin-config:** add entity-spec-mng
* **admin-registry:** add [@xm](https://github.com/xm)-ngx/components/feedback
* **admin-registry:** add translations
* **administration:** add component to manage dashboards permission
* **administration:** rename Widget to DashboardWidget
* **administration-client-management:** add toggle-lock
* **ajsf:** add ru and uk locales
* **alert:** fix type, add default options
* **alert:** add XmToasterService, XmAlertService
* **alert:** add deleting
* **alert:** replace swal with XmAlertService
* **alert:** replace JhiAlertService with XmToasterService
* **angular:** prod namedChunks true
* **angular.json:** add all themes
* **angular2-json-schema-form:** XmJsonSchemeFormModule at '[@xm](https://github.com/xm)-ngx/json-scheme-form'
* **app:** enabling SW, exluding oauth data source
* **app:** idp adding logout endpoint handling
* **app:** xm-idp-config, refactoring
* **app:** adding prop to dev server task, propper login from calback
* **app:** adding memory for dev and dev-idp tasks
* **application:** add fab space
* **audits:** replace with material styles
* **auth:** add refresh token
* **auth:** add refreshGuestAccessToken
* **auth-interceptor:** skip with Authorization header
* **auth-jwt:** add session
* **b2bcrm-479:** add message after sent feedback
* **bool:** add examples
* **bool-value:** rename bool-view to bool-value
* **breadcrumb:** add breadcrumb
* **build:** update angular to [@8](https://github.com/8).2.14
* **build:** strict lib execute
* **build-theme:** include /ext
* **build-themes:** extend with number
* **by-entity-id:** add [@xm](https://github.com/xm)-ngx/components/by-entity-id-cell
* **by-entity-id:** add by-entity-id.component ([#720](https://github.com/xm-online/xm-webapp/issues/720))
* **card:** expand card when click edit
* **checkbox-control:** add control
* **checkbox-control:** remove unused
* **ci:** remove sonarqube
* **ci:** replace with blur
* **ci:** add eslint-plugin-tsdoc
* **ci:** update angular to 10.2.7
* **ci:** fix coverage
* **ci:** add test
* **ci:** update angular to 11
* **cli:** ignore theming and module files
* **cli:** make build themes acync
* **cli:** move theming to /styles
* **cli:** add node-sass, tsc strict
* **cli:** add to post install
* **cli:** cli package
* **cli:** ignore doc
* **cli:** use dynamic extension module instead
* **cli:** replace scripts with cli
* **client-management:** add dynamic-column
* **code:** add xm-code
* **code:** add code-container
* **components:** add package.json
* **components-link:** add icon
* **components-links-group:** add links-group-button-widget
* **components-table:** add name
* **condition:** add add arguments
* **condition:** add xmCondition
* **condition:** add condition output
* **control:** add translate type
* **control-error:** move providers to forRoot
* **control-error:** add control-errors
* **control-error:** move translates to const
* **copy:** add entry
* **copy:** add example
* **core:** add xm-user
* **core:** add permission service
* **core:** XmUiConfigService add private api
* **core:** add core config
* **core:** add package.json
* **core:** add request-cache.ts
* **core:** update structure
* **core:** add testing folders
* **core:** add xm-ui-config
* **core-auth:** move to core root
* **core-auth:** move XmUserService
* **counter:** add counter
* **currency:** add entry
* **dashboard:** add DashboardGuard
* **dashboard:** add bulk operations
* **dashboard:** add interface Dashboard
* **dashboard:** add layout wrong widget name error
* **dashboard:** add dynamic-routes
* **dashboard:** add not-found page handle
* **dashboard:** add order by name
* **dashboard:** add dashboard selector
* **dashboard:** add page-location.service
* **dashboard:** add a wrong dashboard warn
* **dashboard:** update paths
* **dashboard:** add dynamic-widget-layout.component.ts
* **dashboard:** add orderIndex
* **dashboard:** add copy/paste widget
* **dashboard:** add copy/paste dashboard
* **dashboard-edit:** add scroll
* **dashboard-wrapper:** add cacheFactoryService
* **dashboard-wrapper:** add forceReload
* **dashboards:** add import export scripts Merge branch 'feature/angular-9' into 'master'
* **dashboards:** add dashboard
* **dashboards:** provide pageService
* **dashboards:** add dashboards.json
* **data-qa:** add data-qa field
* **date:** improve example
* **date:** add date-value
* **date-control:** add clear button
* **datetime-picker:** making backport of PR [#827](https://github.com/xm-online/xm-webapp/issues/827) from master to develop
* **default-user-avatar:** add error handler
* **develop:** entity-list almost done
* **develop.entity-list:** refactor
* **doc-examples:** improve filter
* **docs:** add CHANGELOG.md
* **docs:** add docs-examples
* **docs:** update styles
* **docs:** add queryParams
* **docs:** add control-error
* **dynamic:** add entry
* **dynamic:** add package.json
* **dynamic:** update index, module
* **dynamic:** add class and styles
* **dynamic:** add styles to options
* **dynamic:** row as value when a field null
* **dynamic:** update interfaces
* **dynamic:** move to packages
* **dynamic:** add getEntry
* **dynamic:** add dynamic extension module
* **dynamic-cell:** extend from dynamic-view
* **dynamic-control:** add xm-dynamic-control
* **dynamic-injector:** add global
* **dynamic-list:** add component
* **dynamic-loader:** add multi loader
* **dynamic-view:** add styles
* **dynamic-view:** export ViewLayout
* **dynamic-view:** add dynamic view
* **dynamic-view:** add injector
* **dynamic-view-layout:** add xm-dynamic-view-layout
* **dynamic-widget:** add DYNAMIC_COMPONENTS
* **dynamic-widget:** add lazy module-entity support
* **dynamic-widget:** add loadAndResolve
* **dynamic-widget:** add xm-ngx support
* **dynamic-widget:** add module parse
* **dynamic-widget:** add error logs, provide injector
* **dynamic-widget:** add sanitizedLayouts
* **dynamic-widget-layout:** add animation
* **edit-buttons:** add edit-buttons ([#591](https://github.com/xm-online/xm-webapp/issues/591))
* **edit-widget-buttons:** add disabled ([#595](https://github.com/xm-online/xm-webapp/issues/595))
* **entity:** add key
* **entity:** add StatesManagementDialogModule, EntityStateModule
* **entity-card-compact:** added recent updates with all dependencies
* **entity-collection:** extend Sortable
* **entity-collection:** update pageable interface
* **entity-collection:** extend with Pageable
* **entity-collection:** extend with Pageable
* **entity-detail:** add showKey field
* **entity-list:** linter fixes
* **entity-list:** refactor
* **entity-list:** single action, inner nav with params
* **entity-list-card:** making backport of pr [#818](https://github.com/xm-online/xm-webapp/issues/818) from master, cleanup
* **entity-list-fab:** removing random entity generate option
* **entity-model:** add property version
* **entity-spec:** add isApp by default
* **enum:** add example
* **enum-control:** extend abilities
* **enum-control:** show default value in selection if property empty
* **enum-control:** display option by permission
* **enum-control:** add clear button
* **enum-control:** add button as optional
* **enum-control:** add button as optional
* **enum-value:** split enum to enum value
* **environment:** add getServerEnvironment
* **environment:** add serverApiUrl
* **environment:** add notFoundUrl
* **error-handler:** check for Loading chunk error
* **error-handler:** add skip header
* **eslint:** extend rules with no-inferrable-types
* **example-ext:** add i18n
* **example-ext:** add to git ignore
* **example-ext:** add styles
* **example-ext:** add example-widget
* **example-widget:** add config field
* **exceptions:** add exceptions namespace
* **ext-select:** add attribute notitle for rest-select for develop
* **fab-button:** route with query params
* **fade-in-out:** change position to absolute ([#653](https://github.com/xm-online/xm-webapp/issues/653))
* **feedback:** add feedback page
* **feedback:** material button styling
* **feedback:** add image
* **file:** add file-control
* **file-download-helper:** add method for download correct encoded csv
* **form-layout:** add form-layout
* **function-list-section:** set auto width for curr state column
* **gateway:** replace with material table
* **general:** update angular to 11.2.9
* **general:** add compodoc/compodoc
* **git:** add commitlint with git hook
* **git:** added .gitattributes
* **health:** add material styles
* **heatmap:** available only for super admin role
* **heatmap:** add active styles
* **high-level-architecture-widget:** move to /packages
* **home:** add regex to domains ([#601](https://github.com/xm-online/xm-webapp/issues/601))
* **home:** add null check
* **html:** add i18n
* **html:** add xm-html
* **http-client:** add pageable support
* **i18n:** add yes and no
* **i18n:** name translate add quote
* **i18n:** add 500 case
* **i18n:** name translate
* **i18n:** add concurrencyFailure
* **i18nJsf:** add Principal
* **icons:** removed icons from cards
* **idp:** adding components and basic logic
* **idp:** mocking all token object, saving tokens
* **idp:** direct route oauth by key handler
* **idp:** move mock token to ignorable config, refactoring
* **idp:** adding new env, methods refactoring
* **idp:** removing old social logic and components
* **idp:** refactoring
* **idp:** pending idp styles for card if direct login
* **idp:** considering calback handle terms logic
* **idp:** adding login auth redirect page
* **idp:** refactoring
* **if-dashboard-slug:** add filter by slug ([#598](https://github.com/xm-online/xm-webapp/issues/598))
* **image-view:** add image-view ([#592](https://github.com/xm-online/xm-webapp/issues/592))
* **interfaces:** add Permissible
* **karma:** add ChromeWithoutSecurity
* **karma:** add ChromeHeadlessNoSandbox ([#695](https://github.com/xm-online/xm-webapp/issues/695))
* **language:** add language.module.ts
* **languages:** add default locale from config
* **layout:** add XmSidebarRightModule
* **layout:** add ribbon
* **link:** add link-value
* **link:** add link button
* **link:** fix naming
* **link:** add fieldTitle
* **link-group:** add mobile view
* **link-list-card:** refactor using mat table
* **link-list-card:** removed unnecessary button styles
* **link-list-card:** styles enhancement
* **link-view:** refactoring, add icon
* **link-view:** add link view ([#718](https://github.com/xm-online/xm-webapp/issues/718))
* **link-view:** display fieldValue if option exist
* **link-view-copy:** add copy icon ([#719](https://github.com/xm-online/xm-webapp/issues/719))
* **links:** add data buttons
* **links-group:** add scroll
* **links-group:** add links group ([#676](https://github.com/xm-online/xm-webapp/issues/676))
* **links-search:** making backport of PR [#739](https://github.com/xm-online/xm-webapp/issues/739) from master
* **loader:** add loader module
* **loading:** add loading package
* **loading-indicator:** add styles
* **loading-indicator:** add styles
* **loading-indicator:** add indicator and modal window
* **loading-indicator:** translation
* **loading-indicator:** translation
* **loading-indicator:** fix import
* **loading-indicator:** add import data
* **loading-indicator:** refactoring, add widget
* **location-detail-dialog:** added error messages and attributes for required fields
* **logger:** add add watch and be sync
* **logger:** add logger
* **logger:** split into files
* **logger:** add xm logger service
* **login:** add rememberMeActiveByDefault
* **logo:** move to packages
* **logs:** update html
* **logs:** add material tables
* **main:** add layout styling
* **main:** replace xmRouteChangeAnimation with angular animation
* **maintenance:** add showReindex
* **mat-card:** add edit by permission
* **mat-fab:** add mat-fab
* **mat-fab:** remove shared
* **mat-fab:** add tooltip ([#684](https://github.com/xm-online/xm-webapp/issues/684))
* **material-design-icons:** add icons
* **menu:** add active color
* **menu:** add sections
* **menu:** add hideAdminConsole flag
* **menu:** move to packages
* **menu:** add fucus style
* **mock-translate-service:** add mock method
* **multiroles:** display several roles
* **mwb2c-416:** fix path
* **mwb2c-416:** comments for components
* **mwb2c-416:** fix path
* **navbar:** split styles [#640](https://github.com/xm-online/xm-webapp/issues/640)
* **navbar:** styling of search input field
* **navbar:** save open state
* **navbar:** remove useless comments
* **navbar:** styling icons
* **navbar:** add xm-navbar-container
* **navbar:** add version
* **navbar:** add z-index
* **navbar-input-search:** backported flag for full match search ([#596](https://github.com/xm-online/xm-webapp/issues/596))
* **navbar-search:** fix mobile view
* **navbar-user:** add navbar user
* **navbar-user:** move username below
* **ng-accessor:** add formControlName
* **ng-form-accessor:** apply control from NgControl
* **ng-model:** add ng control-accessor
* **ng-model:** add touch
* **ngsw-config:** switch to lazy mode
* **no-data:** update styles ([#600](https://github.com/xm-online/xm-webapp/issues/600))
* **no-data:** add imageUrl
* **node:** update node version
* **node-sass:** update deps
* **number-control:** remove unused
* **number-control:** add control
* **number-control:** add data-qa
* **operators:** add format
* **package:** update deps
* **package:** angular-9
* **package:** update angular to 10.6.0
* **package.json:** add npm-link to prebuild
* **packages:** update ng-jhipster, ngx-chips, ngx-mat-select-search, ngx-webstorage
* **packages:** update angular
* **packages:** add [@xm](https://github.com/xm)-ngx/json-schema-form [#297](https://github.com/xm-online/xm-webapp/issues/297) ([#631](https://github.com/xm-online/xm-webapp/issues/631))
* **page:** add debug logger
* **page-collection:** add page-collection.service
* **page-entity:** add string type for entity
* **parallax:** add xmMouseMoveParallax
* **particles:** add xm-canvas-with-particles
* **password:** update examples
* **password:** the same padding as settings page
* **permission:** add canLoad
* **permission:** improve doc
* **phone-number:** add input field
* **placeholder:** add block placeholder
* **polyfills:** update according to angular 9
* **polyfills:** add localize
* **prebuild-themes:** add default themes value
* **protractor:** add configs
* **proxy:** add excludedUrls
* **pwa:** add pwa setup ([#658](https://github.com/xm-online/xm-webapp/issues/658))
* **registries:** add sidebar logo, menu
* **request-cache:** add RequestCacheFactoryService
* **request-cache:** remove reloadInterval and requestTimeOut
* **request-cache-factory:** add reloadInterval and requestTimeOut
* **request-cache-factory:** add takeUntilOnDestroy to reloadIntervalHandle
* **request-factory:** inject session into stream
* **ribbon:** add env icons
* **ribone-styles:** remove unused prefixes
* **role-management:** save pagination to query params
* **route-change:** add route change animation ([#572](https://github.com/xm-online/xm-webapp/issues/572))
* **scope-attribute:** add scope attribute
* **scripts:** replace string assets with glob: '**/*'
* **select-dashboards:** add translations
* **selector-text-control:** trim selector value
* **session:** add core session service
* **settings:** the same colors for save buttons
* **shadow:** remove [@angular](https://github.com/angular)/material
* **shared:** add package.json
* **shared:** move to packages
* **shared:** add Id and IId
* **shared:** add validators
* **shared-interfaces:** add dataQa
* **shared-operation:** add interpolate.ts
* **sidebar:** add color variables
* **sidebar:** add xm-sidebar
* **sidebar:** add dynamic layout
* **sidebar-right:** add components
* **sidebar-user:** add subtitles ([#710](https://github.com/xm-online/xm-webapp/issues/710))
* **sign-in:** add sign-in fullscreen
* **sign-in:** add sign-in form
* **sign-in:** add remember me
* **sign-in:** add top icon
* **sign-in:** add navbar section
* **spec:** initial spec editor
* **spec:** improve code by MR comments
* **spec:** improve yaml serialization ([#578](https://github.com/xm-online/xm-webapp/issues/578))
* **spec:** improve code by MR comments
* **spec:** improve code by MR comments
* **spec:** fix MR
* **spec-mng:** change maxLines
* **specification:** update translates
* **spinner:** add directive, spinner for material buttons
* **stats-widget:** add translates
* **stats-widget:** removed mat-divider from widget template
* **string-handler:** add string handler ([#655](https://github.com/xm-online/xm-webapp/issues/655))
* **string-handler:** add touch event
* **style-guide:** add style-guide
* **styles:** add bootstrap variables to theme
* **styles:** remove components
* **styles:** add mixins
* **styles:** split theming with components.scss
* **styles:** add replace-styles.js
* **styles:** make scroll config global
* **styles:** add radius-lg
* **styles:** add scroll styles
* **styles:** add font variables
* **styles:** add typography vars
* **styles:** add README, angular config extend with src/app/ext
* **styles:** card-header
* **styles:** add sidebar styling
* **styles:** add tint to secondary color
* **styles:** change theme build strategy
* **swagger:** update version
* **sweetalert:** add scss variables
* **switch-theme:** save theme to store
* **table:** add xm-table-column-dynamic-cells
* **table-column:** add dataClass
* **table-column:** add dataStyle
* **table-filter-validation:** validation messages from configuration
* **table-filter-validation:** alternative errors source
* **take-until-on-destroy:** add take-until-on-destroy.ts
* **take-until-on-destroy:** add TakeUntilOnDestroy decorator
* **test:** specify packages and src dirs
* **text:** add controls
* **text:** add text-dynamic-view
* **text:** add text-title and text-translate
* **text:** add examples
* **text:** add autocomplete to password
* **text:** extend registry
* **text:** update examples
* **text:** add labeled-container
* **text:** add translate to emptyValue
* **text:** add phone-number-control
* **text:** add date-value
* **text-join-value:** add text-join-value
* **text-range:** add required
* **text-range:** add auto height
* **text-range:** add TextRange
* **text-view:** add dataQA
* **text-view:** apply new styles ([#723](https://github.com/xm-online/xm-webapp/issues/723))
* **text-view:** add empty line
* **text-view:** add primitive type ([#727](https://github.com/xm-online/xm-webapp/issues/727))
* **theme:** add theme dark switch
* **theme:** remove [@angular](https://github.com/angular)/material, add default theme
* **theme:** add xm-theme
* **theme-scheme:** add theme-scheme.service.ts
* **themes:** add default xm themes
* **theming:** add to gitignore
* **toaster:** add options
* **toaster:** define interface properties
* **transform-by-map:** add multi level
* **transform-by-map:** add transformByMap
* **transform-format:** the ability to use false, 0, ''... as a fieldValue in transformByMap
* **translate:** set default translate
* **translates:** add ru and uk locale
* **translation:** add XmTranslateService
* **translation:** add postfix to the title
* **translation:** add interpolate
* **tsconfig:** switch target to es2015
* **tsconfig:** enable strictInputAccessModifiers
* **tsconfig:** provide main modules
* **ui-config:** split to xm-private and xm-public
* **ui-config:** add session listening
* **ui-mng:** add xm-ace-editor-control
* **unblock-lock-button:** add optional title
* **unblock-lock-user:** add unblock-lock-user
* **user:** move to packages
* **user:** add authorities
* **user-management:** set roleKey with multiRoles
* **user-management:** add multi-role support
* **validator-processing:** add validator-processing
* **versions:** use same versions for new dependencies
* **widget-edit:** add xm-selector-text-control
* **widget-edit:** add EDIT_WIDGET_EVENT
* **widget-edit:** add docs
* **widget-list:** add widget-list service
* **widget-list:** add ApplicationRef
* **xm-alert:** fix error as object response
* **xm-alert:** replace alert with snackbar
* **xm-alert:** replace $.notify with snackBar
* **xm-bool:** change remove to remove_circle_outline
* **xm-bool:** add OnChange
* **xm-bool:** rename to xm-bool-view
* **xm-bool-control:** add xm-bool-control
* **xm-config:** in case if no data.theme use default
* **xm-control-errors:** add XM_CONTROL_ERRORS_TRANSLATES
* **xm-date-range:** add auto focus
* **xm-dynamic-control-example:** create XmDynamicControlExample
* **xm-entity:** add [@xm](https://github.com/xm)-ngx/entity
* **xm-enum:** add xm-enum-view, xm-enum-control
* **xm-mat-card:** add permission
* **xm-mat-card:** add data-qa
* **xm-mat-card:** switch PageChangesStore on edit
* **xm-mat-card:** add loading
* **xm-mat-card:** add xm-mat-card ([#675](https://github.com/xm-online/xm-webapp/issues/675))
* **xm-mat-card:** add xm-header-actions ([#693](https://github.com/xm-online/xm-webapp/issues/693))
* **xm-navbar-language:** add tooltip
* **xm-password-needed:** add xm-password-needed.module.ts
* **xm-public:** add xm public page
* **xm-ribbon:** add release version
* **xm-table-column-dynamic-cell:** add component
* **xm-text-control:** add xm-text-control
* **xm-text-view:** add xm-text-view
* **xm-text-view:** no inline margin
* **xm-text-view:** add xm-text-component
* **xm-theme:** extend with themeScheme and colorScheme
* **xm-toaster:** extend(bc) toaster service
* **xm-toaster:** change to MatSnackBar
* **xm-translation:** add TranslatePipe to services
* **xm-user-login-widget:** add XmUserLoginWidgetModule
* **xm-user-security-settings:** add XmUserSecuritySettingsModule
* **xm-user-settings:** add XmUserSettingsWidgetModule

### Feature

* add ajsf
* **api-docs-styling:** padding and excess block
* **heatmap:** PoC
* **heatmap-poc:** fix of library error
* **heatmap-poc:** hide by default
* **high-level-architecture:** reverse dependencies
* **localization-dashboard:** add new localization dashboard
* **navbar:** add isShowSearchPanel flag
* **translations:** change indentation
* **translations:** fixes after review
* **translations:** reverted theme
* **translations:** added extract translations function
* **xm-webapp:** DND
* **xm-webapp:** DND drug function

### Fix

* fixing buttons styles ([#701](https://github.com/xm-online/xm-webapp/issues/701))
* entity widget
* import swal for entity-card-compact
* main, navbar, task-manager - button styles
* corrections after review widgets and entity-card-compact
* check subscription ([#1161](https://github.com/xm-online/xm-webapp/issues/1161))
* add img-fluid class to <img
* check by env
* corrections after review
* move styles to angular-material and bootstrap
* remove conflicted rules
* fixing problem with principal fields
* move to bootstrap-xm-override-table
* unnecessary stripe
* fix: replace Renderer with Renderer2
* unnecessary stripe
* fixed field sizes
* mat input, entry
* fix RequestCache
* datepicker opacity
* fixed margin icons table-border
* switching to translate pipeline for function-list-section-compact
* dashboards remove static entry
* fixing comments format
* remove multi XmEntitySpecWrapperService injections
* conflict resolving
* custom link display options
* mat-fab color
* add ModuleWithProviders typing
* prevent showing terms modal if already shown ([#551](https://github.com/xm-online/xm-webapp/issues/551))
* fixing styles and permissions ([#487](https://github.com/xm-online/xm-webapp/issues/487))
* remove 'npm run prebuild' from 'build'
* **XmUiConfigService:** move requestCache to constructor
* **_theme:** remove $dark-primary-text and $light-primary-text ([#686](https://github.com/xm-online/xm-webapp/issues/686))
* **account:** fix circle deps
* **account-help:** addding help account from master ([#609](https://github.com/xm-online/xm-webapp/issues/609))
* **admin:** remove xmSharedModule
* **admin-service:** rollback lastModifiedDate to id
* **ajsf:** return mat-form-styles
* **ajsf:** add fixFlexLayout
* **ajsf:** parent-child flex layout
* **alert:** remove margin on top
* **alert:** fix error code mapping
* **array-control:** fix disabled state
* **array-control:** add array-control
* **audits:** fix pagination
* **audits:** fix switch with error
* **auth:** apply user locale after identity ([#697](https://github.com/xm-online/xm-webapp/issues/697))
* **auth-jwt:** fix refresh token on reload
* **avatar-dialog:** fix file button and preview styles
* **b2bcrm787:** fix if component dont have registerOnChange
* **back-links:** fixing broken back-links ([#635](https://github.com/xm-online/xm-webapp/issues/635))
* **bool:** make cancelled false by default
* **bool-control:** fix formControl -> formGroup.pristine fro xm-bool-control
* **breadcrumb:** fix first empty load
* **build:** fix global
* **button-groups:** fixing inline spacing, refactoring font sizing
* **by-entity-id:** update should be called with dynamic components
* **card:** replace .card with mat-card ([#644](https://github.com/xm-online/xm-webapp/issues/644))
* **card:** fix card styles
* **ci:** remove npm caches
* **cli:** fix assets override
* **cli:** fix assets override
* **cli:** fix lazy selector
* **cli:** fix assets copy
* **cli:** fix deps sequence
* **client-management:** change icons
* **client-management:** add XmPermissionModule
* **client-management:** fix scopes
* **client-mng:** fix pagination length
* **condition-dashboard:** fix typeKey comparison
* **condition-dashboard:** fix tests
* **condition-dashboard:** remove regex
* **condition-dashboard:** fix dashboard selection
* **config:** fix scss generation
* **core:** remove redundant code
* **core-auth:** priority to session token
* **dashboard:** fix empty dashboard after login
* **dashboard:** filter dashboards without slug
* **dashboard:** reset ui before page changes
* **dashboard:** fix empty error
* **dashboard:** fix xm-bool resolve
* **dashboard:** fix typing
* **dashboard-list:** checking orderIndex in template
* **dashboard-list:** fix toggle
* **dashboard-wrapper:** fix deleting dashboard stream instead dashboards cache
* **dashboard-wrapper.service:** check idOrSlug for null
* **dashboards:** fix link redirect
* **dashboards:** fix caches
* **dashboards:** fix redirect error
* **dashboards:** add catchError ([#643](https://github.com/xm-online/xm-webapp/issues/643))
* **dashboards:** add navbar pageSubSubTitle
* **date-control:** date control add useUtc in options
* **date-value:** fix empty options
* **datetime-control:** add option ignoreSeconds
* **datetime-control:** fix datetime format
* **datetime-control:** replace type value from XmDateValue to Moment
* **datetime-control:** add option ignoreSeconds
* **default-dashboard:** fix empty dashboard after session change
* **develop:** added mediaMarshaller calls to fix ajsf flex
* **dialog:** fix submit button
* **docs:** fix import path
* **docs:** api path
* **documentation:** skip quotes
* **dynamic:** remove from compiler cache
* **dynamic-loader:** fix undefined error
* **dynamic-route:** clear route on canActive
* **dynamic-tenant:** module resolve component
* **dynamic-tenant-loader:** remove selector validator
* **dynamic-view:** remove appearUp
* **dynamic-view:** fix resolve module
* **dynamic-view:** fix layout type ([#602](https://github.com/xm-online/xm-webapp/issues/602))
* **dynamic-view:** fix extends
* **entity-create:** filter type entity create ([#889](https://github.com/xm-online/xm-webapp/issues/889))
* **entity-details:** fix mat deps
* **entity-details:** fix update details ([#670](https://github.com/xm-online/xm-webapp/issues/670))
* **entity-details:** fix filtering spec backport ([#895](https://github.com/xm-online/xm-webapp/issues/895))
* **entity-list:** fixing update list on modufucations ([#637](https://github.com/xm-online/xm-webapp/issues/637))
* **entity-list:** refactor due to linter to fix ci build
* **entity-list:** using mat-paginator, providing translations ([#661](https://github.com/xm-online/xm-webapp/issues/661))
* **entity-list:** refactor
* **entity-list:** sort considering sortable prop ([#672](https://github.com/xm-online/xm-webapp/issues/672))
* **entity-list:** minor edits
* **entity-list-card:** attempt move on mat-tabs
* **entity-list-card:** fix aot build
* **entity-list-card:** fix aot build
* **entity-list-card:** fix aot build
* **entity-tags:** fix type key
* **entyti-list:** resolving spec to be used as dynamically loaded widget
* **enum:** fix bool as object key
* **enum:** fix import path
* **enum:** add bool and number to enum control
* **enum-control:** add translate
* **enum-control:** use false value in enum
* **environment:** fix package import
* **ext:** fix module path
* **ext-select:** adding ext select deep link support from master ([#632](https://github.com/xm-online/xm-webapp/issues/632))
* **feetback:** add attributes
* **file-control:** add required option to file-control
* **file-control:** refactor add required option to file-control
* **file-control:** refactor add required option to file-control
* **form-layout:** add formControl to form-layout
* **format:** refactor format with array
* **format:** correct array use in format
* **format:** type fix
* **format:** refactor format with array
* **function-dialog:** providing jsf service
* **function-service:** add headers for call function
* **gateway:** fix date
* **heatmap:** fix undefined error
* **heatmap:** prevent event
* **heatmap:** performance issue
* **i18n:** fix translates
* **idle-logout:** fix deps
* **idp:** fixing unit tests
* **idp:** fixing unit tests
* **idp:** saving idp config when on auth-jwt init
* **idp:** fixing unit tests
* **idp:** fixing unit tests
* **idp:** fixing unit tests
* **idp:** fixing unit  tests
* **idp:** fixing unit tests
* **idp:** try disable service worker
* **idp:** login route redirect temp test
* **idp-login:** error prop from null
* **idp-login:** error prop from null
* **jsf-widgets:** fix multi-lang input widget ([#681](https://github.com/xm-online/xm-webapp/issues/681))
* **karma:** update to angular 9 configs
* **link-list:** using vars in scss
* **link-list:** correcting imports
* **link-view:** fix defaults assign ([#721](https://github.com/xm-online/xm-webapp/issues/721))
* **linked-in:** fix translates key
* **links-tree:** fixing tree old behavior from master ([#688](https://github.com/xm-online/xm-webapp/issues/688))
* **loader:** fix scss
* **loader:** remove parent class xm-disabled
* **loading:** fix class mapping
* **location:** regexp backport from master
* **location-detail-dialog:** increased max-height
* **location-detail-dialog:** refactor, improvement
* **location-detail-dialog:** translations, console errors
* **login:** fix redirect url
* **login:** styles
* **login-terms-and-conditions:** fixing terms in develop ([#621](https://github.com/xm-online/xm-webapp/issues/621))
* **login-translation:** incorrect button key
* **main-layout:** adding auth state to html class
* **main-theme:** fix mobile view with navbar
* **map-location:** fixing point coordinates regexp
* **mat-dialog:** adding controls ([#654](https://github.com/xm-online/xm-webapp/issues/654))
* **mat-icon:** fix correcting indentation mat-icons in round buttons
* **mat-icon:** main style centers mat-icon
* **md-editor:** fix editor full screen mode overlay ([#648](https://github.com/xm-online/xm-webapp/issues/648))
* **menu:** permission MATRIX.GET
* **menu:** dashboard 403
* **menu:** remove useless argument
* **menu:** add *permitted and hidden
* **menu:** fix group name priority
* **menu:** fix groupKey match
* **menu:** fix link path
* **menu-item:** fixing long string in menu item ([#673](https://github.com/xm-online/xm-webapp/issues/673))
* **module-language.helper:** restore
* **module-loader:** lint fix
* **module-loader:** fixing rootName considering names with multiple dashes
* **momentjs:** adds momentjs to language service init
* **navbar:** fix scroll
* **navbar:** allow feedback only auth-ed users
* **navbar:** return ng-deep
* **navbar:** overflow
* **navbar:** add custom edit
* **navbar:** add  navbar-toggler
* **navbar:** fix remove mat-navbar
* **navbar:** fix widget update params
* **navbar:** remove static
* **navbar-dashboard:** fix multi subscription
* **navbar-title:** remove showLogo
* **ng-accessor:** fix update from formControl
* **ng-accessor:** fix ngModel two-way bing
* **ng-accessor:** add subscription to default value
* **ng-accessor:** fix disabled loop
* **ng-deep:** wrap with host
* **notifications:** refactor using native mat-menu
* **notifications:** fix-init, styling ([#668](https://github.com/xm-online/xm-webapp/issues/668))
* **notifications:** add clearInterval
* **old-browsers-popup:** fixed chrome version
* **old-browsers-popup:** decreased chrome version to prevent error on tests
* **olnd-browsers:** downgrade to 76
* **packages-styles:** adding xm-button-group component styles
* **page:** add PageChangesStore, add PendingChangesGuard
* **page-change-store:** tab onSubscribe emits Pristine state
* **page-ribbon:** fix getAuthenticationState
* **password:** fallback to the first appropriate login
* **permission:** replace takeUntil with subscription
* **permission:** fix folder name
* **permission:** fix SuperAdmin permission change
* **phone-number:** add default-value
* **powered-by:** fix config access
* **powered-by:** fix powered by in develop ([#616](https://github.com/xm-online/xm-webapp/issues/616))
* **principal:** connect to AuthRefreshTokenService
* **principal:** add session
* **register:** styles
* **request-cache:** add unsubscribe
* **request-cache:** fix [@TakeUntilOnDestroy](https://github.com/TakeUntilOnDestroy)()
* **ribbon:** fix icon
* **ribbon:** change header
* **route-change-animation:** remove player after animation complete
* **route-change-animation:** reset styles after animation
* **rxjs-operators:** fix import
* **scripts:** remove  generate-localization-file.py
* **scripts:** extend manage-exts.js with assets
* **search-glodal:** fixing broken search
* **shared:** fix build
* **shared:** add createRequestOption
* **shared:** fix IId import
* **shared-testing:** typing
* **sidebar:** add EntityConfigService
* **sidebar:** split styles
* **sidebar:** added possibility to hide item
* **sidebar:** added const for if
* **sidebar:** fix arrow down animation
* **sidebar:** fix multi requests
* **sign-in-up-widget:** refactor + fixed styles
* **spec:** fix change data and form specs ([#593](https://github.com/xm-online/xm-webapp/issues/593))
* **spec-manager:** add AceEditorModule deps
* **stats-widget:** fixing layout and styles ([#683](https://github.com/xm-online/xm-webapp/issues/683))
* **styles:** add mat-slide-toggle-thumb
* **styles:** remove css postfix
* **styles:** fix themes build and import
* **styles:** remove mat deps
* **styles:** add loading
* **styles:** improve bootstrap typography
* **styles:** fix rounded
* **switch-theme:** fix theme assign
* **switch-theme:** changeTheme catch undefined argument theme
* **switch-theme:** fix next theme
* **table:** split sortable header
* **tests:** add packages dir
* **tests:** fix tests
* **text:** fix number to string check
* **text:** translation module import
* **text-control:** rollback ngModel
* **text-control:** id mapping
* **text-control:** fix options value check
* **text-view:** able print zero value for xm-text-view
* **timeline:** fixing styles in timeline
* **timeline:** fixing styles in timeline
* **title:** add getCurrentActiveRoute filter
* **translate:** fix number type
* **translate:** fix value
* **translates:** merging only custom translates with values ([#633](https://github.com/xm-online/xm-webapp/issues/633))
* **translations:** fix layout
* **tsconfig:** fix rebase conflicts
* **tsconfig:** exclude environments
* **tsconfig:** remove old paths
* **twitching-ui:** remove canvas when hidden
* **upgw-346:** date control add useUtc in options
* **user:** add user public skip handler
* **user:** fix logout permission
* **user-component:** ooops o_0, somebody forget to remove debugger
* **user-management:** add resetPasswordV2
* **weather-widget:** replace list-height to line-height.
* **web-app:** remove incorrect value change
* **widget-bc:** fix incorrect mapping
* **xm-alert:** remove xm alert
* **xm-alert:** rollback XmAlertComponent, JhiAlertService usage
* **xm-balance:** resolve path
* **xm-bool:** change icons to field
* **xm-constants:** change minWidth to 120px ([#702](https://github.com/xm-online/xm-webapp/issues/702))
* **xm-data-time:** fix default locale
* **xm-date-time:** fix account error
* **xm-entity-spec-wrapper:** fix null value
* **xm-entity-spec-wrapper:** remove logout deps
* **xm-navbar-arrow-back:** set arrow back to center
* **xm-navbar-arrow-back:** clear ViewEncapsulation
* **xm-navbar-arrow-back:** clear ViewEncapsulation
* **xm-per-page:** add CommonModule
* **xm-permission:** fix empty user
* **xm-permission:** fix async permission
* **xm-permission:** fix null data
* **xm-permission-service:** add isSuperAdmin function
* **xm-ribbon:** change to async request
* **xm-sidebar-right:** fix factory resolver
* **xm-text-control:** fix options assign
* **xm-user:** add permissions
* **xm-webapp:** checkbox administration/ list of pages restriction
* **xmAceEditor:** add destroy

### Hotfix

* **translates:** fix problems with windows

### Improvement

* added logging to entity widget component

### Reactor

* **components:** fix import

### Refactor

* update test cases
* remove old themes
* remove entry points
* fix material import
* fix typedef, add [@typescript](https://github.com/typescript)-eslint/explicit-member-accessibility
* remove font-awesome
* replace mat-raised-button with mat-button
* replace NgbModal by MatDialog
* conflicts resolving
* mapping parents to treeData
* fix types, file name with stamp
* remove a.modal-close.material-icons [#217](https://github.com/xm-online/xm-webapp/issues/217)
* align buttons to left at modals [#217](https://github.com/xm-online/xm-webapp/issues/217)
* remove ext- prefix
* fix lint quote errors
* fix translates
* replace .btn.btn-primary with material [#217](https://github.com/xm-online/xm-webapp/issues/217)
* add _backward-compatibility.scss [#217](https://github.com/xm-online/xm-webapp/issues/217)
* enable no-output-native
* enable directive-class-suffix, no-empty-lifecycle-method
* enable no-input-rename, no-output-rename
* enable no-output-on-prefix
* update eslint
* replace i18nName with translate
* remove Principal for i18n
* replace UiConfigService with XmUiConfigService
* fix translates
* style bg default
* extending theme ([#716](https://github.com/xm-online/xm-webapp/issues/716))
* update path
* remove shared-common
* move add permission directive
* update deps path
* rename XM_CORE_CONFIG to XmCoreConfig
* code styles
* export notification module
* move take-until from shared dir
* **ContextService:** provide in root
* **XmEventManager:** replace JhiEventManager with XmEventManager
* **alert:** simplify valle check
* **alert:** move styles
* **alert:** make alert as module
* **alert:** remove translateService
* **alert:** rename intl to config
* **angular2-json-schema-form:** replace with [@ajsf](https://github.com/ajsf)/core
* **auth:** fix circular deps
* **auth-jwt:** move XmSessionService from Principal
* **avatar.scss:** update styles
* **btn:** replace .btn-primary with color="primary"
* **build:** sync build
* **button-groups:** using xm-button-groups styles
* **calback-idp:** typings
* **calendar:** fixing styles for calendar buttons
* **callback-idp:** const instead of let
* **carousel:** delete carousel file
* **components:** use XmUiConfigService
* **components:** fix deps
* **components:** fix imports
* **core:** move to modules
* **core-auth:** remove AuthServerProvider deps
* **core-auth:** provide XmAuthenticationRepository
* **core-auth:** use sessionService for dispatch logout
* **core-auth:** remove IDP_CLIENT deps
* **core-config:** fix imports
* **core-theme:** update structure
* **dashboard:** replace component with selector
* **dashboard:** remove server url
* **dashboard:** move loadDashboard to base
* **dashboard:** extract dashboardFactory
* **dashboard:** move from /src/xm-dashboard to /packages/dashboard
* **dashboard-config:** add reorder
* **dashboard-list:** spacing
* **dashboards:** rename DashboardWrapperService to DashboardStore
* **dashboards:** move mock-dashboard-store.ts
* **dynamic:** add typing [@xm](https://github.com/xm)-ngx/dynamic
* **dynamic-dialog:** move to core
* **dynamic-layout:** remove children layout from dynamic-widget
* **entity-collection-factory:** add new arg to method create - clear url (interpolated url)
* **entity-collection-factory:** rename create method's args
* **entity-details-modal:** filter spec to method
* **entity-list:** moving on mat-tabs, styling
* **fab:** update styles
* **feedback:** remove url form config
* **functions:** removing linked in
* **functions:** removing linked in ([#703](https://github.com/xm-online/xm-webapp/issues/703))
* **general:** remove xm- prefix from folder
* **get-value:** move to operations
* **i18nJsf:** remove :principal
* **idp:** cleam up
* **idp:** cleanup
* **inputPattern:** move from shared
* **links-component:** fix styles
* **login-error:** login oath2 error on navigate by direct url
* **logo:** replace Principal with XmSessionService
* **lot-countdown:** delete lot-countdown file
* **main:** add flex layout, fix custom image bg
* **main:** remove old sidebar
* **main:** refactor guest bg
* **main-theme:** replace with with margin
* **maintenance:** refactor styles [#217](https://github.com/xm-online/xm-webapp/issues/217)
* **mat-multi-select:** fix MatSelect deps
* **menu:** add exports
* **navbar:** fix layout
* **navbar-dashboard:** move to administration
* **navbar-help:** move IHelpNavLink
* **notifications:** fixing PR conflicts
* **package.json:** replace npm link with direct deps
* **page-collection-factory:** removed router dependence from page-collection-factory
* **password-settings:** move to own component
* **permission:** combine permitted with xmPermitted
* **permission:** replace bind wih switchMap
* **registry:** move to /registries folder
* **ribbon:** add theme
* **roles-edit:** moving to mat-table, methods rewrite, cleanup ([#680](https://github.com/xm-online/xm-webapp/issues/680))
* **schema-battery:** delete schema-battery file
* **shared:** remove CookieService
* **sidebar:** remove navbar-minimize and sidebar mini
* **sidebar:** refactor dependencies
* **sidebar:** remove sidebar
* **states:** update states.scss
* **styles:** add xm-ngx-styles-theme mixin
* **styles:** remove outline focus
* **styles:** provide _themes files and inject them into styles
* **styles:** exclude to the [@xm](https://github.com/xm)-ngx/styles
* **takeUntilOnDestroy:** change path
* **timeline:** restore default styles
* **translates:** provide [@xm](https://github.com/xm)-ngx/translation
* **tree:** delete tree.scss file
* **user:** fix styles
* **user-component:** fix typo, god bless Travis
* **user-component:** allow logout control for * type of user
* **user-password:** fix layout
* **voucher:** delete voucher file
* **widget-list:** use dynamic injector
* **word-autocomplete:** move to styles folder
* **xm-alert:** change translate service to XmTranslateService
* **xm-animate:** update styles
* **xm-core:** provide XmEventManagerService
* **xm-dashboard:** fix paths
* **xm-settings:** use xm-user-*
* **xm-styles:** remove unused
* **xm-user:** move to auth
* **xm-user-password:** add xm-user-password
* **xmUiConfigService:** add init

### Style

* remove rounded-circle
* **doc:** ignore indent
* **dynamic-widget-layout:** update imports
* **general:** style
* **general:** fix spaces
* **links-group:** redesign
* **links-group:** redesign tabs
* **sign-in:** split to files
* **translation:** update structure

### Styles

* replace btn-round with rounded-circle

### Test

* update mock usage
* **administration:** fix tests
* **dashboards:** update path
* **dynamic:** fix DynamicTenantLoaderService
* **dynamic:** fix tests
* **general:** fix tests in /packages
* **general:** update TestBed.inject
* **general:** fix tests
* **idp:** debug env uris
* **logger:** mock create method
* **mock:** remove unused method
* **mock:** return empty value
* **mock:** replace to testing directory
* **mock:** add mocks for entity-collection-service and entity-service
* **ng-accessors:** add tests
* **page:** fix tests
* **page-collection:** fix config null ([#700](https://github.com/xm-online/xm-webapp/issues/700))
* **permission:** fix create test
* **schema:** add NO_ERROR_SCHEMA


<a name="v2.0.46"></a>
## [v2.0.46](https://github.com/xm-online/xm-webapp/compare/v2.0.45...v2.0.46) (2021-07-29)

### Feat

* **pass-strength:** considering strength strategy of policies provided

### Refactor

* **pass-strength:** cleanup
* **pass-strength:** cleanup
* **pass-strength:** cleanup
* **pass-strength:** cleanup


<a name="v2.0.45"></a>
## [v2.0.45](https://github.com/xm-online/xm-webapp/compare/v2.0.44...v2.0.45) (2021-07-20)

### Fix

* **ext-multy-select:** search in labels scope


<a name="v2.0.44"></a>
## [v2.0.44](https://github.com/xm-online/xm-webapp/compare/v2.0.43...v2.0.44) (2021-06-11)

### Task

* **calendars:** take which is only in spec


<a name="v2.0.43"></a>
## [v2.0.43](https://github.com/xm-online/xm-webapp/compare/v2.0.42...v2.0.43) (2021-06-08)

### Fex

* **login-form:** remember me translations


<a name="v2.0.42"></a>
## [v2.0.42](https://github.com/xm-online/xm-webapp/compare/v2.0.41...v2.0.42) (2021-06-03)

### Feat

* **calendar-view:** for calendar events add check for event has own color
* **jsf:** researches with module resolver

### Fix

* **calendar:** setting readonly from spec


<a name="v2.0.41"></a>
## [v2.0.41](https://github.com/xm-online/xm-webapp/compare/v2.0...v2.0.41) (2021-05-14)


<a name="v2.0"></a>
## [v2.0](https://github.com/xm-online/xm-webapp/compare/v2...v2.0) (2021-05-14)


<a name="v2"></a>
## [v2](https://github.com/xm-online/xm-webapp/compare/v2.0.40...v2) (2021-05-14)

### Feat

* **calendar:** readonly feature for calendar


<a name="v2.0.40"></a>
## [v2.0.40](https://github.com/xm-online/xm-webapp/compare/3.2.2...v2.0.40) (2021-05-13)

### Debug

* try findout what is wrong with privilages

### Feat

* adding component for help page
* adding static route for fallback navigation
* **25488-old-browsers-popup:** languages fix
* **25488-old-browsers-popup:** js markup creating and i18n
* **25488-old-browsers-popup:** added message to prevent use of old browsers
* **25488-old-browsers-popup:** append replaced by appendChild for IE compatibility
* **25529-read-only-config:** added check for config read-only flag
* **account-settings:** added ability to configure json schema form for account settings
* **account-settings:** cleanup
* **account-settings:** cleanup
* **appointment-summary:** discount info added to table
* **calendar:** adding edit event picker and timezones support
* **calendar-card:** refactored for use fullcalendar angular component
* **content-uploader:** changed to send on form submit
* **content-uploader:** base64 file loader for master
* **datetime-picker:** adding ability to format sending value
* **entity-detail-fab:** formatted
* **entity-detail-fab:** added detailed tooltip for link buttons, if translation exists
* **entity-detail-fab:** replaced by translate pipe
* **entity-list-card:** fixes for page size
* **entity-list-card:** added flag to uiConfig for hiding "download" option in list menu
* **entity-list-card:** added query params handling with useQueryParams flag
* **entity-list-fab:** removing entity generate option for master
* **etail-fab:** smallfix
* **ext-select:** add attribute notitle for rest-select ([#936](https://github.com/xm-online/xm-webapp/issues/936))
* **file-upload:** add attribute notitle for file-upload
* **fullcalendar:** added fullcalendar angular component, started refactoring
* **links-search:** integrating new search api, using debounce input instead of change
* **map:** fix expresion to check 3 digit before dot in lan and lat
* **navbar:** added flag to uiConfig for toggling full match search in header
* **navbar:** some functions moved to helpers
* **password-policies:** refactoring, added for register and reset password
* **password-policies:** added password-policies component
* **password-policies:** refactoring
* **password-policies:** refactoring
* **password-policies:** refactoring
* **read-only-config:** added readOnlyMode to roles management and matrix components
* **read-only-config:** added types for buttons
* **theme-override.css:** changed styles for array item element
* **timeline-component:** disable timeline service call if configured in ui spec

### Fix

* fixing editor styles, adding permision check for edit controls, fix preview toggle only if needed
* sort with login param
* if no privilages to see dashbords, try to see apps and logout
* ensure to pass only values which has key in it
* if no accont with 403, restore public screen env
* case with buffer link paste and back history fix
* prevent showing terms modal if already shown
* **CVE-2018-19057:** fixed simplemde editor XSS via an onerror attribute of a crafted IMG element
* **CVE-2018-19057:** updated XSS fix
* **CVE-2021-23358:** updated underscore.min.js (dep of nomnoml package) to fix security issue
* **app:** cleanup
* **app:** removed unnecessary fullcalendar package, fix
* **calendar:** uuid for calendars without id, view selected fix
* **calendar-event-dialog:** cleanup
* **calendar-event-dialog:** formatted date from owl-date-time picker to UTC, without timezone
* **core:** overwrote card-header inherit margin
* **core:** improved fix
* **create-dialog:** type match starts prefix followed by dot ([#888](https://github.com/xm-online/xm-webapp/issues/888))
* **cve-2020-28458:** updated package datatables.net-bs to use sub-dep datatables.net 1.10.22
* **cve-2020-28458:** replaced datatables 1.10.18 by datatables.net 1.10.22
* **date-picker:** set explicit local date, independent property
* **docker-file:** need by devops team
* **entity-detail-dialog:** fixing filtering spec types
* **entity-detail-fab:** added one more similar permission to show edit button ([#873](https://github.com/xm-online/xm-webapp/issues/873))
* **events-service:** date utils convert changed to moment, for ignore local timezone
* **ext-query-select:** added check for value before set default
* **location-details:** using different regexps for long and lat, fixing if no location check
* **login:** fix dashlane request for auth
* **login:** redirect with params ([#646](https://github.com/xm-online/xm-webapp/issues/646))
* **main:** added check for locales list from config includes browser locale
* **sidebar:** fixing sidebar ([#610](https://github.com/xm-online/xm-webapp/issues/610))
* **tsconfig:** import flag removed

### Refactor

* cleanup
* checking on typeKey too
* cleanup, resolving discussions
* cleanup, check if can access home route
* merge fix versions
* move redirect methods to login service, adding default page config settings
* cleanup import
* fix code style
* cleanup
* **date-picker:** cleanup
* **date-picker:** cleanup

### WIP

* Translations convert script from json to csv


<a name="3.2.2"></a>
## [3.2.2](https://github.com/xm-online/xm-webapp/compare/v2.0.39...3.2.2) (2021-04-27)

### Add

* link-field and content-textarea widgets

### Bugfix

* **fonts:** move material icon from web to local
* **translation-management:** add take(1) for download button

### Build

* **packages:** add angular 10

### Chore

* add serve-production build
* fix naming
* fix /administration routing
* pr fixed
* remove console logging
* move update() from config, add getAll()
* add UserManagementDetailModule
* remove EntityConfigService
* move deps on PasswordResetInit
* remove XmConfigModule, PaginationConfig
* add RolesManagementDetailModule
* fix unused files
* move interceptors to modules
* remove  cross deps
* remove mediaMarshaller
* add DynamicCellComponent
* add dynamic tenant services
* fix entry resolve
* move ADMIN_ELEMENTS to XM_ELEMENTS
* add EntityCollectionBase
* replace TakeUntilOnDestroy with takeUntilOnDestroyDestroy
* **AuthInterceptor:** provide XmCoreConfig
* **ITEMS_PER_PAGE:** move to packages/
* **ace-editor:** move to /components ([#692](https://github.com/xm-online/xm-webapp/issues/692))
* **admin:** split to packages
* **admin:** AceEditorDirective to module
* **admin:** move add route to /admin
* **admin-config:** move to administration
* **admin-service:** add default value
* **admin-service:** move to packages
* **admin.module:** update imports
* **admin.registry:** add lazy widgets
* **admin.registry:** add lazy components
* **administration:** update styles
* **alert:** update error message output
* **alert-error:** update typing
* **alert-error:** remove errors and replace errors with error
* **animations:** add appear, expand
* **aufit:** move to packages/
* **auth-core:** move to packages
* **auth-expired:** simplify intercept method
* **auth-expired:** add token refresh
* **auth-jwt:** add auth-store
* **auth-jwt:** add AuthRefreshTokenService
* **bool:** rename bool to xm-bool
* **bool:** export default options
* **by-entity-id:** rename from -cell to -value
* **card-icon:** remove icon
* **card-icon:** remove static icon from widgets
* **cli:** remove unused scripts
* **components:** update naming
* **components:** rename formControl to control
* **components-image:** update naming
* **controls:** add NgControlAccessor
* **cookies:** replace angular2-cookie with ngx-cookie
* **core:** update path
* **core-auth:** rename from AuthExpiredInterceptor to AuthInterceptor
* **core-auth:** remove AuthInterceptor
* **dashboard:** refactor
* **dashboard:** move path to xm-routing
* **dashboard:** separate sortByOrderIndex
* **dashboard:** update interfaces
* **dashboard:** update typing
* **dashboard:** remove routeSubscription
* **dashboard:** add logger
* **dashboard:** remove rootRedirect
* **dashboard:** remove page-collection
* **dashboard:** rollback divs
* **dashboard-wrapper:** add cache
* **dashboards:** rename getByByIdOrSlug to getByIdOrSlug
* **dashboards:** add page service
* **dashboards:** exclude widgets path mapper from dashboard base
* **dashboards:** add sort by title
* **dashboards:** add appearUp animation
* **dashboards:** exclude widgets mapper
* **dashboards:** add page title service
* **dashboards:** add page service
* **dashboards:** move to /packages
* **data-qa:** update data qa
* **date:** update date naming
* **date:** add date-control, date-range-control
* **date:** add errors and types
* **deps:** update paths
* **develop:** clean up
* **develop:** clean up
* **develop:** refactor
* **docs:** move to /packages
* **docs:** add docs module
* **dynamic:** split from dashboard
* **dynamic:** add XmDynamicModule
* **dynamic:** rename interfaces
* **dynamic:** add options field
* **dynamic:** fix typing error
* **dynamic:** add dynamic register
* **dynamic:** extract loadModuleFactory, loadTenantModuleFactory
* **dynamic:** make options optional at DynamicSearcher
* **dynamic:** add dynamicLoaderService
* **dynamic:** extract DynamicBase
* **dynamic:** remove static
* **dynamic:** move loaders to loader folder
* **dynamic:** add default value
* **dynamic:** remove i prefix
* **dynamic:** convert DynamicWidget to DynamicWidgetDirective
* **dynamic-cell:** provide DynamicLoader
* **dynamic-loader:** provide searcher
* **dynamic-tenant:** add loadAndResole
* **dynamic-widget:** refactor init set
* **dynamic-widget:** migrate to dynamicLoader
* **dynamic-widget:** move dynamic to loader.service
* **dynamic-widget:** add deprecations
* **entity-collection:** add sortable
* **entity-list:** refactor
* **entity-list:** fix linter
* **enum:** rename enum-value
* **enum-control:** add form
* **error:** move error to module
* **eslint:** changed rule
* **eslint:** update lint
* **feedback:** move to /packages
* **feedback:** fix imports
* **form-playground:** move to /packages
* **gateway:** move to gateway
* **guest-background:** styles
* **health:** move to /packages
* **home:** add hide container
* **home:** refactor
* **home:** move guest token to auth-jwt
* **home:** refactor layout ([#588](https://github.com/xm-online/xm-webapp/issues/588))
* **idle:** add idle service
* **idp:** env debug
* **idp:** disable SW
* **idp:** enabvle SW, map token idp
* **ignore:** add test.ts to lint ignore
* **link-list-card:** refactor
* **links:** add noopener
* **links-group-widget:** move to /components ([#691](https://github.com/xm-online/xm-webapp/issues/691))
* **loader:** add dark mode
* **loading:** move to packages/
* **location-detail-dialog:** refactor
* **login:** fix login-logout and session sync
* **login:** remove login index
* **logs:** move to /packages
* **main:** fix session
* **main:** remove unused code
* **main:** remove XM_SUCCESS_AUTH
* **main:** fix loading
* **main:** remove animations
* **maintenance:** move to /packages
* **maintenance:** move to packages
* **mat-fab:** add MatFabConfigBase
* **material-icon:** update material icon
* **menu:** update permissions
* **menu:** hotfix sidebar madness
* **menu-component:** replace XmEntityConfigService with XmEntitySpecWrapperService
* **merge-conflicts:** merge dev
* **metrics-modal:** move to /packages
* **navbar:** split to components
* **navbar:** refactor titles
* **navbar:** hide title and logo via config
* **navbar:** decompose ([#603](https://github.com/xm-online/xm-webapp/issues/603))
* **navbar:** replace with async
* **navbar:** replace outlet with <xm-navbar>
* **navbar:** add dynamic widgets
* **navbar-language-menu:** update with material
* **ng-accessor:** add disabled and value
* **ng-accessor:** remove any
* **ng-model:** add input
* **no-data:** move to packages/
* **notifications:** move to /packages
* **operators:** add download.ts
* **package:** add marker for translations
* **package:** fixed version for icon
* **package:** remove auto execution get-translations from ci
* **package:** add config
* **package:** return package-lock
* **package-lock:** unwanted changes
* **packages:** remove prebuild
* **packages:** strict localize
* **password:** change to mat-card
* **permission:** fix circular deps
* **phone-number:** move phone-number-control
* **phone-number-control:** add xm prefix
* **quotes:** replace with single quotes
* **registry:** update urls
* **registry:** update xm-text path
* **request-cache:** refactor
* **request-cache:** transform to injector
* **request-cache:** add setAndReload
* **roles-matrix:** move to /packages
* **rxjs:** fix rxjs imports
* **rxjs:** fix import path
* **search:** fix lazy route
* **shared:** update mock names
* **sidebar-right:** update -theme import
* **sidebar-right:** move width to const
* **sign-in-up-widget:** refactor
* **sortByOrder:** update typing
* **specification:** extract tenant-mng
* **specification:** extract ui-mng
* **specification:** hide not implemented functionality
* **specification:** extract private-ui-mng
* **specification:** extract timeline-mng
* **specification:** fix circular deps
* **specification:** rename readOnlyMode to disabled
* **specification:** extract uaa-login-mng
* **specification:** extract uaa-mng
* **specification-mng:** update slug
* **specification-mng:** rename to specification-management
* **specifications:** move to /packages
* **styles:** add placeholder
* **table-config:** update constants
* **text:** rename text-range to text-range-control
* **text:** add text-control, text-range
* **text:** remove files
* **text:** add password-control
* **text:** xm-text rename to xm-text-view-container
* **text:** text-view
* **text:** rename to passport-control
* **text:** add email-control
* **text-control:** add formControl
* **translate:** switch to translate pipe ([#636](https://github.com/xm-online/xm-webapp/issues/636))
* **translations:** add translations
* **translations:** remove xm-prefix in folder name
* **translations:** change translations
* **translations:** move to /packages
* **translations-management:** remove cache for config
* **translations-management:** fix after demo
* **tsconfig:** exclude testing
* **user:** rename to sidebar-user
* **user:** replace with user$()
* **user-management:** move multiRoleEnabled to security
* **user-management:** style html
* **xm-alert:** move to packages
* **xm-config-core:** add SERVER_API_URL
* **xm-core:** move to packages
* **xm-core:** remove XM_CORE_CONFIG_DEFAULT
* **xm-core:** remove init from module
* **xm-entity:** move EntityDetailDialogModule to module
* **xm-entity-spec-wrapper:** add RequestCache
* **xm-entity-spec-wrapper:** add RequestCacheFactoryService
* **xm-entity-widget:** remove console logs
* **xm-event-manger:** rename cache to dispatcher
* **xm-main:** remove xm-main
* **xm-password-needed:** move to packages/
* **xm-per-page:** move to packages/
* **xm-permission:** switch to defaultIfEmpty
* **xm-permission:** add empty value
* **xm-private-ui:** add RequestCacheFactoryService
* **xm-public-ui:** add RequestCacheFactoryService
* **xm-rating:** move to packages/
* **xm-translates:** move to /packages
* **xm-ui-config:** rename cache$ to config$()
* **xm-user:** add RequestCacheFactoryService

### Docs

* **dynamic:** add doc

### Feat

* add xmsharedModule
* add cache, IUIConfig, XmUiConfigService
* init
* add [@xm](https://github.com/xm)-ngx/ext
* add proxy interceptor
* add NavbarDashboardEditWidgetModule
* add permission.guard
* add PROXY_INTERCEPTOR
* adding methods to save and map export data
* add BoolComponent
* add debug
* add mb-5
* add [@xm](https://github.com/xm)-ngx/components/xm-ribbon
* replace deep /**/ with single /*/
* add innerHtml
* update to angular 9.1
* move ELEMENT_NOT_FOUND to searcher
* add XmEventManagerService
* add [@kolkov](https://github.com/kolkov)/angular-editor
* adding export and import dialogs and services
* replace ngx-rating with custom
* init permission.directive.ts
* add permission module
* add [@xm](https://github.com/xm)-ngx/xm-balance
* add bowsersList
* add alert module
* added no data text options for empty lists
* add no-data module
* add xm-maintenance-view.module.ts
* add xm-entity module
* add input.module.ts
* added options to hide links if no links present
* **25488:** backport of pr [#799](https://github.com/xm-online/xm-webapp/issues/799) from master
* **25529-read-only-flag:** making backport of pr [#802](https://github.com/xm-online/xm-webapp/issues/802) from master
* **WordAutocompleteModule:** add WordAutocompleteModule
* **XmEntity:** add createdBy
* **XmEntity:** extend with .data generic
* **account:** add logout
* **ace:** add search
* **ace-editor:** add xm-* to name
* **ace-editr:** add AceEditorThemeSchemeAdapterDirective
* **admin:** rename widget components
* **admin:** duplicate dashboard
* **admin:** move user, role, client managment
* **admin:** remove old dashboard management widget
* **admin:** rename widget components
* **admin-base:** save to query params
* **admin-config:** add entity-spec-mng
* **admin-registry:** add translations
* **admin-registry:** add [@xm](https://github.com/xm)-ngx/components/feedback
* **administration:** rename Widget to DashboardWidget
* **administration-client-management:** add toggle-lock
* **ajsf:** add ru and uk locales
* **alert:** replace JhiAlertService with XmToasterService
* **alert:** replace swal with XmAlertService
* **alert:** fix type, add default options
* **alert:** add deleting
* **alert:** add XmToasterService, XmAlertService
* **angular:** prod namedChunks true
* **angular.json:** add all themes
* **angular2-json-schema-form:** XmJsonSchemeFormModule at '[@xm](https://github.com/xm)-ngx/json-scheme-form'
* **app:** xm-idp-config, refactoring
* **app:** idp adding logout endpoint handling
* **app:** adding prop to dev server task, propper login from calback
* **app:** enabling SW, exluding oauth data source
* **application:** add fab space
* **audits:** replace with material styles
* **auth:** add refresh token
* **auth:** add refreshGuestAccessToken
* **auth-interceptor:** skip with Authorization header
* **auth-jwt:** add session
* **b2bcrm-479:** add message after sent feedback
* **bool:** add examples
* **bool-value:** rename bool-view to bool-value
* **build:** update angular to [@8](https://github.com/8).2.14
* **build-theme:** include /ext
* **build-themes:** extend with number
* **by-entity-id:** add by-entity-id.component ([#720](https://github.com/xm-online/xm-webapp/issues/720))
* **by-entity-id:** add [@xm](https://github.com/xm)-ngx/components/by-entity-id-cell
* **checkbox-control:** add control
* **checkbox-control:** remove unused
* **ci:** update angular to 10.2.7
* **ci:** remove sonarqube
* **ci:** add eslint-plugin-tsdoc
* **ci:** add test
* **ci:** fix coverage
* **ci:** replace with blur
* **ci:** update angular to 11
* **cli:** add to post install
* **cli:** replace scripts with cli
* **cli:** cli package
* **cli:** move theming to /styles
* **cli:** add node-sass, tsc strict
* **client-management:** add dynamic-column
* **code:** add code-container
* **code:** add xm-code
* **components:** add package.json
* **components-link:** add icon
* **components-links-group:** add links-group-button-widget
* **components-table:** add name
* **condition:** add xmCondition
* **condition:** add condition output
* **condition:** add add arguments
* **control:** add translate type
* **control-error:** move providers to forRoot
* **control-error:** move translates to const
* **control-error:** add control-errors
* **copy:** add example
* **copy:** add entry
* **core:** add package.json
* **core:** add request-cache.ts
* **core:** update structure
* **core:** add core config
* **core:** add xm-user
* **core:** add permission service
* **core:** add xm-ui-config
* **core:** XmUiConfigService add private api
* **core-auth:** move XmUserService
* **core-auth:** move to core root
* **currency:** add entry
* **dashboard:** add interface Dashboard
* **dashboard:** add bulk operations
* **dashboard:** add copy/paste widget
* **dashboard:** add copy/paste dashboard
* **dashboard:** add DashboardGuard
* **dashboard:** add order by name
* **dashboard:** add dynamic-widget-layout.component.ts
* **dashboard:** add a wrong dashboard warn
* **dashboard:** update paths
* **dashboard:** add page-location.service
* **dashboard-edit:** add scroll
* **dashboard-wrapper:** add cacheFactoryService
* **dashboard-wrapper:** add forceReload
* **dashboards:** add dashboard
* **dashboards:** provide pageService
* **dashboards:** add import export scripts Merge branch 'feature/angular-9' into 'master'
* **dashboards:** add dashboards.json
* **data-qa:** add data-qa field
* **date:** improve example
* **date:** add date-value
* **date-control:** add clear button
* **default-user-avatar:** add error handler
* **develop:** entity-list almost done
* **develop.entity-list:** refactor
* **doc-examples:** improve filter
* **docs:** add control-error
* **docs:** add queryParams
* **docs:** add docs-examples
* **docs:** update styles
* **dynamic:** add styles to options
* **dynamic:** add package.json
* **dynamic:** add class and styles
* **dynamic:** update index, module
* **dynamic:** update interfaces
* **dynamic:** row as value when a field null
* **dynamic:** move to packages
* **dynamic-cell:** extend from dynamic-view
* **dynamic-control:** add xm-dynamic-control
* **dynamic-injector:** add global
* **dynamic-list:** add component
* **dynamic-loader:** add multi loader
* **dynamic-view:** export ViewLayout
* **dynamic-view:** add injector
* **dynamic-view:** add dynamic view
* **dynamic-view:** add styles
* **dynamic-view-layout:** add xm-dynamic-view-layout
* **dynamic-widget:** add error logs, provide injector
* **dynamic-widget:** add DYNAMIC_COMPONENTS
* **dynamic-widget:** add xm-ngx support
* **dynamic-widget:** add module parse
* **dynamic-widget:** add lazy module-entity support
* **dynamic-widget:** add loadAndResolve
* **dynamic-widget:** add sanitizedLayouts
* **dynamic-widget-layout:** add animation
* **edit-buttons:** add edit-buttons ([#591](https://github.com/xm-online/xm-webapp/issues/591))
* **edit-widget-buttons:** add disabled ([#595](https://github.com/xm-online/xm-webapp/issues/595))
* **entity:** add StatesManagementDialogModule, EntityStateModule
* **entity-card-compact:** added recent updates with all dependencies
* **entity-collection:** extend with Pageable
* **entity-collection:** update pageable interface
* **entity-collection:** extend Sortable
* **entity-collection:** extend with Pageable
* **entity-list:** refactor
* **entity-list-card:** making backport of pr [#818](https://github.com/xm-online/xm-webapp/issues/818) from master, cleanup
* **entity-list-fab:** removing random entity generate option
* **entity-spec:** add isApp by default
* **enum:** add example
* **enum-control:** display option by permission
* **enum-control:** extend abilities
* **enum-value:** split enum to enum value
* **environment:** add notFoundUrl
* **environment:** add serverApiUrl
* **environment:** add getServerEnvironment
* **error-handler:** check for Loading chunk error
* **error-handler:** add skip header
* **eslint:** extend rules with no-inferrable-types
* **example-ext:** add i18n
* **example-ext:** add styles
* **example-ext:** add example-widget
* **example-ext:** add to git ignore
* **example-widget:** add config field
* **ext-select:** add attribute notitle for rest-select for develop
* **fade-in-out:** change position to absolute ([#653](https://github.com/xm-online/xm-webapp/issues/653))
* **feedback:** material button styling
* **feedback:** add feedback page
* **feedback:** add image
* **file-download-helper:** add method for download correct encoded csv
* **function-list-section:** set auto width for curr state column
* **gateway:** replace with material table
* **general:** update angular to 11.2.9
* **general:** add compodoc/compodoc
* **git:** add commitlint with git hook
* **git:** added .gitattributes
* **health:** add material styles
* **heatmap:** add active styles
* **heatmap:** available only for super admin role
* **high-level-architecture-widget:** move to /packages
* **home:** add null check
* **home:** add regex to domains ([#601](https://github.com/xm-online/xm-webapp/issues/601))
* **html:** add i18n
* **html:** add xm-html
* **http-client:** add pageable support
* **i18n:** name translate
* **i18n:** name translate add quote
* **i18n:** add yes and no
* **i18n:** add concurrencyFailure
* **i18n:** add 500 case
* **i18nJsf:** add Principal
* **icons:** removed icons from cards
* **idp:** removing old social logic and components
* **idp:** refactoring
* **idp:** adding login auth redirect page
* **idp:** mocking all token object, saving tokens
* **idp:** refactoring
* **idp:** pending idp styles for card if direct login
* **idp:** direct route oauth by key handler
* **idp:** adding new env, methods refactoring
* **idp:** move mock token to ignorable config, refactoring
* **idp:** considering calback handle terms logic
* **idp:** adding components and basic logic
* **if-dashboard-slug:** add filter by slug ([#598](https://github.com/xm-online/xm-webapp/issues/598))
* **image-view:** add image-view ([#592](https://github.com/xm-online/xm-webapp/issues/592))
* **karma:** add ChromeWithoutSecurity
* **karma:** add ChromeHeadlessNoSandbox ([#695](https://github.com/xm-online/xm-webapp/issues/695))
* **language:** add language.module.ts
* **languages:** add default locale from config
* **layout:** add ribbon
* **layout:** add XmSidebarRightModule
* **link:** fix naming
* **link:** add link-value
* **link:** add fieldTitle
* **link-group:** add mobile view
* **link-list-card:** styles enhancement
* **link-list-card:** removed unnecessary button styles
* **link-list-card:** refactor using mat table
* **link-view:** display fieldValue if option exist
* **link-view:** add link view ([#718](https://github.com/xm-online/xm-webapp/issues/718))
* **link-view:** refactoring, add icon
* **link-view-copy:** add copy icon ([#719](https://github.com/xm-online/xm-webapp/issues/719))
* **links:** add data buttons
* **links-group:** add scroll
* **links-group:** add links group ([#676](https://github.com/xm-online/xm-webapp/issues/676))
* **links-search:** making backport of PR [#739](https://github.com/xm-online/xm-webapp/issues/739) from master
* **loader:** add loader module
* **loading:** add loading package
* **location-detail-dialog:** added error messages and attributes for required fields
* **logger:** add logger
* **logger:** add xm logger service
* **logger:** split into files
* **login:** add rememberMeActiveByDefault
* **logo:** move to packages
* **logs:** update html
* **logs:** add material tables
* **main:** add layout styling
* **main:** replace xmRouteChangeAnimation with angular animation
* **maintenance:** add showReindex
* **mat-card:** add edit by permission
* **mat-fab:** remove shared
* **mat-fab:** add tooltip ([#684](https://github.com/xm-online/xm-webapp/issues/684))
* **mat-fab:** add mat-fab
* **material-design-icons:** add icons
* **menu:** add sections
* **menu:** add fucus style
* **menu:** move to packages
* **menu:** add hideAdminConsole flag
* **multiroles:** display several roles
* **navbar:** add z-index
* **navbar:** add version
* **navbar:** remove useless comments
* **navbar:** split styles [#640](https://github.com/xm-online/xm-webapp/issues/640)
* **navbar:** save open state
* **navbar:** styling of search input field
* **navbar:** styling icons
* **navbar-input-search:** backported flag for full match search ([#596](https://github.com/xm-online/xm-webapp/issues/596))
* **ng-accessor:** add formControlName
* **ng-form-accessor:** apply control from NgControl
* **ng-model:** add touch
* **ng-model:** add ng control-accessor
* **ngsw-config:** switch to lazy mode
* **no-data:** add imageUrl
* **no-data:** update styles ([#600](https://github.com/xm-online/xm-webapp/issues/600))
* **node-sass:** update deps
* **number-control:** remove unused
* **number-control:** add data-qa
* **number-control:** add control
* **operators:** add format
* **package:** update angular to 10.6.0
* **package:** angular-9
* **package:** update deps
* **package.json:** add npm-link to prebuild
* **packages:** update ng-jhipster, ngx-chips, ngx-mat-select-search, ngx-webstorage
* **packages:** add [@xm](https://github.com/xm)-ngx/json-schema-form [#297](https://github.com/xm-online/xm-webapp/issues/297) ([#631](https://github.com/xm-online/xm-webapp/issues/631))
* **packages:** update angular
* **page:** add debug logger
* **page-collection:** add page-collection.service
* **page-entity:** add string type for entity
* **parallax:** add xmMouseMoveParallax
* **particles:** add xm-canvas-with-particles
* **password:** the same padding as settings page
* **permission:** improve doc
* **phone-number:** add input field
* **polyfills:** add localize
* **polyfills:** update according to angular 9
* **protractor:** add configs
* **proxy:** add excludedUrls
* **pwa:** add pwa setup ([#658](https://github.com/xm-online/xm-webapp/issues/658))
* **request-cache:** add RequestCacheFactoryService
* **request-cache:** remove reloadInterval and requestTimeOut
* **request-cache-factory:** add takeUntilOnDestroy to reloadIntervalHandle
* **request-cache-factory:** add reloadInterval and requestTimeOut
* **request-factory:** inject session into stream
* **ribbon:** add env icons
* **ribone-styles:** remove unused prefixes
* **role-management:** save pagination to query params
* **route-change:** add route change animation ([#572](https://github.com/xm-online/xm-webapp/issues/572))
* **scripts:** replace string assets with glob: '**/*'
* **session:** add core session service
* **settings:** the same colors for save buttons
* **shadow:** remove [@angular](https://github.com/angular)/material
* **shared:** add validators
* **shared:** add Id and IId
* **shared:** add package.json
* **shared:** move to packages
* **shared-interfaces:** add dataQa
* **shared-operation:** add interpolate.ts
* **sidebar:** add color variables
* **sidebar:** add xm-sidebar
* **sidebar-right:** add components
* **sidebar-user:** add subtitles ([#710](https://github.com/xm-online/xm-webapp/issues/710))
* **sign-in:** add remember me
* **sign-in:** add top icon
* **sign-in:** add sign-in fullscreen
* **sign-in:** add sign-in form
* **spec:** improve code by MR comments
* **spec:** initial spec editor
* **spec:** improve code by MR comments
* **spec:** fix MR
* **spec:** improve code by MR comments
* **spec:** improve yaml serialization ([#578](https://github.com/xm-online/xm-webapp/issues/578))
* **spec-mng:** change maxLines
* **specification:** update translates
* **spinner:** add directive, spinner for material buttons
* **stats-widget:** add translates
* **stats-widget:** removed mat-divider from widget template
* **string-handler:** add touch event
* **string-handler:** add string handler ([#655](https://github.com/xm-online/xm-webapp/issues/655))
* **style-guide:** add style-guide
* **styles:** add radius-lg
* **styles:** add bootstrap variables to theme
* **styles:** remove components
* **styles:** make scroll config global
* **styles:** change theme build strategy
* **styles:** split theming with components.scss
* **styles:** add sidebar styling
* **styles:** card-header
* **styles:** add typography vars
* **styles:** add font variables
* **styles:** add mixins
* **styles:** add replace-styles.js
* **styles:** add scroll styles
* **styles:** add tint to secondary color
* **styles:** add README, angular config extend with src/app/ext
* **swagger:** update version
* **sweetalert:** add scss variables
* **switch-theme:** save theme to store
* **table:** add xm-table-column-dynamic-cells
* **table-column:** add dataStyle
* **table-column:** add dataClass
* **table-filter-validation:** alternative errors source
* **table-filter-validation:** validation messages from configuration
* **take-until-on-destroy:** add TakeUntilOnDestroy decorator
* **take-until-on-destroy:** add take-until-on-destroy.ts
* **test:** specify packages and src dirs
* **text:** update examples
* **text:** add date-value
* **text:** add text-dynamic-view
* **text:** add translate to emptyValue
* **text:** add examples
* **text:** add controls
* **text:** add labeled-container
* **text:** extend registry
* **text:** add phone-number-control
* **text:** add text-title and text-translate
* **text-join-value:** add text-join-value
* **text-range:** add TextRange
* **text-range:** add auto height
* **text-range:** add required
* **text-view:** add primitive type ([#727](https://github.com/xm-online/xm-webapp/issues/727))
* **text-view:** apply new styles ([#723](https://github.com/xm-online/xm-webapp/issues/723))
* **text-view:** add empty line
* **text-view:** add dataQA
* **theme:** add theme dark switch
* **theme:** remove [@angular](https://github.com/angular)/material, add default theme
* **theme:** add xm-theme
* **theme-scheme:** add theme-scheme.service.ts
* **themes:** add default xm themes
* **theming:** add to gitignore
* **toaster:** add options
* **toaster:** define interface properties
* **transform-by-map:** add multi level
* **transform-by-map:** add transformByMap
* **transform-format:** the ability to use false, 0, ''... as a fieldValue in transformByMap
* **translate:** set default translate
* **translates:** add ru and uk locale
* **translation:** add interpolate
* **translation:** add XmTranslateService
* **translation:** add postfix to the title
* **tsconfig:** provide main modules
* **tsconfig:** switch target to es2015
* **ui-config:** add session listening
* **ui-config:** split to xm-private and xm-public
* **ui-mng:** add xm-ace-editor-control
* **unblock-lock-user:** add unblock-lock-user
* **user:** move to packages
* **user-management:** add multi-role support
* **user-management:** set roleKey with multiRoles
* **versions:** use same versions for new dependencies
* **widget-edit:** add EDIT_WIDGET_EVENT
* **widget-edit:** add xm-selector-text-control
* **widget-edit:** add docs
* **widget-list:** add widget-list service
* **widget-list:** add ApplicationRef
* **xm-alert:** replace $.notify with snackBar
* **xm-alert:** replace alert with snackbar
* **xm-alert:** fix error as object response
* **xm-bool:** add OnChange
* **xm-bool:** change remove to remove_circle_outline
* **xm-bool:** rename to xm-bool-view
* **xm-bool-control:** add xm-bool-control
* **xm-config:** in case if no data.theme use default
* **xm-control-errors:** add XM_CONTROL_ERRORS_TRANSLATES
* **xm-date-range:** add auto focus
* **xm-entity:** add [@xm](https://github.com/xm)-ngx/entity
* **xm-enum:** add xm-enum-view, xm-enum-control
* **xm-mat-card:** add xm-header-actions ([#693](https://github.com/xm-online/xm-webapp/issues/693))
* **xm-mat-card:** add xm-mat-card ([#675](https://github.com/xm-online/xm-webapp/issues/675))
* **xm-mat-card:** add permission
* **xm-mat-card:** add loading
* **xm-mat-card:** switch PageChangesStore on edit
* **xm-navbar-language:** add tooltip
* **xm-password-needed:** add xm-password-needed.module.ts
* **xm-public:** add xm public page
* **xm-ribbon:** add release version
* **xm-table-column-dynamic-cell:** add component
* **xm-text-control:** add xm-text-control
* **xm-text-view:** add xm-text-component
* **xm-text-view:** no inline margin
* **xm-text-view:** add xm-text-view
* **xm-theme:** extend with themeScheme and colorScheme
* **xm-toaster:** extend(bc) toaster service
* **xm-toaster:** change to MatSnackBar
* **xm-translation:** add TranslatePipe to services
* **xm-user-login-widget:** add XmUserLoginWidgetModule
* **xm-user-security-settings:** add XmUserSecuritySettingsModule
* **xm-user-settings:** add XmUserSettingsWidgetModule

### Feature

* add ajsf
* **api-docs-styling:** padding and excess block
* **heatmap:** PoC
* **heatmap-poc:** fix of library error
* **heatmap-poc:** hide by default
* **high-level-architecture:** reverse dependencies
* **localization-dashboard:** add new localization dashboard
* **navbar:** add isShowSearchPanel flag
* **translations:** change indentation
* **translations:** fixes after review
* **translations:** reverted theme
* **translations:** added extract translations function

### Fix

* fixing buttons styles ([#701](https://github.com/xm-online/xm-webapp/issues/701))
* main, navbar, task-manager - button styles
* fix: replace Renderer with Renderer2
* mat-fab color
* fix RequestCache
* fixed field sizes
* fixed margin icons table-border
* datepicker opacity
* dashboards remove static entry
* unnecessary stripe
* add img-fluid class to <img
* move to bootstrap-xm-override-table
* fixing styles and permissions ([#487](https://github.com/xm-online/xm-webapp/issues/487))
* prevent showing terms modal if already shown ([#551](https://github.com/xm-online/xm-webapp/issues/551))
* fixing problem with principal fields
* add ModuleWithProviders typing
* switching to translate pipeline for function-list-section-compact
* corrections after review
* remove multi XmEntitySpecWrapperService injections
* corrections after review widgets and entity-card-compact
* import swal for entity-card-compact
* move styles to angular-material and bootstrap
* remove conflicted rules
* check by env
* fixing comments format
* mat input, entry
* entity widget
* custom link display options
* remove 'npm run prebuild' from 'build'
* conflict resolving
* unnecessary stripe
* **XmUiConfigService:** move requestCache to constructor
* **_theme:** remove $dark-primary-text and $light-primary-text ([#686](https://github.com/xm-online/xm-webapp/issues/686))
* **account:** fix circle deps
* **account-help:** addding help account from master ([#609](https://github.com/xm-online/xm-webapp/issues/609))
* **admin:** remove xmSharedModule
* **admin-service:** rollback lastModifiedDate to id
* **ajsf:** add fixFlexLayout
* **ajsf:** return mat-form-styles
* **ajsf:** parent-child flex layout
* **alert:** remove margin on top
* **alert:** fix error code mapping
* **array-control:** add array-control
* **array-control:** fix disabled state
* **audits:** fix switch with error
* **audits:** fix pagination
* **auth:** apply user locale after identity ([#697](https://github.com/xm-online/xm-webapp/issues/697))
* **auth-jwt:** fix refresh token on reload
* **avatar-dialog:** fix file button and preview styles
* **b2bcrm787:** fix if component dont have registerOnChange
* **back-links:** fixing broken back-links ([#635](https://github.com/xm-online/xm-webapp/issues/635))
* **bool-control:** fix formControl -> formGroup.pristine fro xm-bool-control
* **build:** fix global
* **button-groups:** fixing inline spacing, refactoring font sizing
* **by-entity-id:** update should be called with dynamic components
* **card:** fix card styles
* **card:** replace .card with mat-card ([#644](https://github.com/xm-online/xm-webapp/issues/644))
* **ci:** remove npm caches
* **cli:** fix assets override
* **cli:** fix assets override
* **client-management:** fix scopes
* **client-management:** change icons
* **client-management:** add XmPermissionModule
* **client-mng:** fix pagination length
* **config:** fix scss generation
* **core:** remove redundant code
* **core-auth:** priority to session token
* **dashboard:** fix empty dashboard after login
* **dashboard:** fix xm-bool resolve
* **dashboard:** fix typing
* **dashboard:** reset ui before page changes
* **dashboard-list:** fix toggle
* **dashboard-wrapper:** fix deleting dashboard stream instead dashboards cache
* **dashboard-wrapper.service:** check idOrSlug for null
* **dashboards:** fix caches
* **dashboards:** add catchError ([#643](https://github.com/xm-online/xm-webapp/issues/643))
* **dashboards:** fix redirect error
* **dashboards:** fix link redirect
* **dashboards:** add navbar pageSubSubTitle
* **date-control:** date control add useUtc in options
* **date-value:** fix empty options
* **default-dashboard:** fix empty dashboard after session change
* **develop:** added mediaMarshaller calls to fix ajsf flex
* **dialog:** fix submit button
* **docs:** fix import path
* **docs:** api path
* **documentation:** skip quotes
* **dynamic-loader:** fix undefined error
* **dynamic-tenant:** module resolve component
* **dynamic-tenant-loader:** remove selector validator
* **dynamic-view:** fix extends
* **dynamic-view:** fix resolve module
* **dynamic-view:** fix layout type ([#602](https://github.com/xm-online/xm-webapp/issues/602))
* **dynamic-view:** remove appearUp
* **entity-create:** filter type entity create ([#889](https://github.com/xm-online/xm-webapp/issues/889))
* **entity-details:** fix filtering spec backport ([#895](https://github.com/xm-online/xm-webapp/issues/895))
* **entity-details:** fix update details ([#670](https://github.com/xm-online/xm-webapp/issues/670))
* **entity-details:** fix mat deps
* **entity-list:** refactor due to linter to fix ci build
* **entity-list:** using mat-paginator, providing translations ([#661](https://github.com/xm-online/xm-webapp/issues/661))
* **entity-list:** sort considering sortable prop ([#672](https://github.com/xm-online/xm-webapp/issues/672))
* **entity-list:** refactor
* **entity-list:** minor edits
* **entity-list:** fixing update list on modufucations ([#637](https://github.com/xm-online/xm-webapp/issues/637))
* **entity-list-card:** fix aot build
* **entity-list-card:** fix aot build
* **entity-list-card:** fix aot build
* **entity-list-card:** attempt move on mat-tabs
* **enum:** fix import path
* **enum-control:** add translate
* **enum-control:** use false value in enum
* **ext-select:** adding ext select deep link support from master ([#632](https://github.com/xm-online/xm-webapp/issues/632))
* **feetback:** add attributes
* **function-service:** add headers for call function
* **gateway:** fix date
* **heatmap:** performance issue
* **heatmap:** fix undefined error
* **heatmap:** prevent event
* **idle-logout:** fix deps
* **idp:** fixing unit tests
* **idp:** login route redirect temp test
* **idp:** fixing unit tests
* **idp:** fixing unit tests
* **idp:** try disable service worker
* **idp:** fixing unit tests
* **idp:** fixing unit  tests
* **idp:** fixing unit tests
* **idp:** fixing unit tests
* **jsf-widgets:** fix multi-lang input widget ([#681](https://github.com/xm-online/xm-webapp/issues/681))
* **karma:** update to angular 9 configs
* **link-list:** using vars in scss
* **link-list:** correcting imports
* **link-view:** fix defaults assign ([#721](https://github.com/xm-online/xm-webapp/issues/721))
* **linked-in:** fix translates key
* **links-tree:** fixing tree old behavior from master ([#688](https://github.com/xm-online/xm-webapp/issues/688))
* **loader:** remove parent class xm-disabled
* **loader:** fix scss
* **loading:** fix class mapping
* **location:** regexp backport from master
* **location-detail-dialog:** increased max-height
* **location-detail-dialog:** translations, console errors
* **location-detail-dialog:** refactor, improvement
* **login:** fix redirect url
* **login:** styles
* **login-terms-and-conditions:** fixing terms in develop ([#621](https://github.com/xm-online/xm-webapp/issues/621))
* **login-translation:** incorrect button key
* **main-theme:** fix mobile view with navbar
* **map-location:** fixing point coordinates regexp
* **mat-dialog:** adding controls ([#654](https://github.com/xm-online/xm-webapp/issues/654))
* **md-editor:** fix editor full screen mode overlay ([#648](https://github.com/xm-online/xm-webapp/issues/648))
* **menu:** add *permitted and hidden
* **menu:** fix group name priority
* **menu:** fix groupKey match
* **menu:** permission MATRIX.GET
* **menu:** remove useless argument
* **menu-item:** fixing long string in menu item ([#673](https://github.com/xm-online/xm-webapp/issues/673))
* **module-language.helper:** restore
* **navbar:** return ng-deep
* **navbar:** allow feedback only auth-ed users
* **navbar:** add  navbar-toggler
* **navbar:** remove static
* **navbar:** add custom edit
* **navbar:** overflow
* **navbar:** fix scroll
* **navbar:** fix widget update params
* **navbar-dashboard:** fix multi subscription
* **navbar-title:** remove showLogo
* **ng-accessor:** fix ngModel two-way bing
* **ng-accessor:** fix disabled loop
* **ng-accessor:** fix update from formControl
* **ng-accessor:** add subscription to default value
* **ng-deep:** wrap with host
* **notifications:** refactor using native mat-menu
* **notifications:** add clearInterval
* **notifications:** fix-init, styling ([#668](https://github.com/xm-online/xm-webapp/issues/668))
* **old-browsers-popup:** fixed chrome version
* **old-browsers-popup:** decreased chrome version to prevent error on tests
* **olnd-browsers:** downgrade to 76
* **packages-styles:** adding xm-button-group component styles
* **page:** add PageChangesStore, add PendingChangesGuard
* **page-change-store:** tab onSubscribe emits Pristine state
* **page-ribbon:** fix getAuthenticationState
* **password:** fallback to the first appropriate login
* **phone-number:** add default-value
* **powered-by:** fix config access
* **powered-by:** fix powered by in develop ([#616](https://github.com/xm-online/xm-webapp/issues/616))
* **principal:** add session
* **principal:** connect to AuthRefreshTokenService
* **register:** styles
* **request-cache:** add unsubscribe
* **request-cache:** fix [@TakeUntilOnDestroy](https://github.com/TakeUntilOnDestroy)()
* **ribbon:** change header
* **route-change-animation:** reset styles after animation
* **route-change-animation:** remove player after animation complete
* **scripts:** remove  generate-localization-file.py
* **scripts:** extend manage-exts.js with assets
* **search-glodal:** fixing broken search
* **shared:** fix IId import
* **shared:** add createRequestOption
* **shared:** fix build
* **shared-testing:** typing
* **sidebar:** add EntityConfigService
* **sidebar:** split styles
* **sidebar:** fix multi requests
* **sidebar:** added const for if
* **sidebar:** added possibility to hide item
* **sign-in-up-widget:** refactor + fixed styles
* **spec:** fix change data and form specs ([#593](https://github.com/xm-online/xm-webapp/issues/593))
* **spec-manager:** add AceEditorModule deps
* **stats-widget:** fixing layout and styles ([#683](https://github.com/xm-online/xm-webapp/issues/683))
* **styles:** add mat-slide-toggle-thumb
* **styles:** add loading
* **styles:** improve bootstrap typography
* **styles:** fix themes build and import
* **styles:** fix rounded
* **styles:** remove mat deps
* **switch-theme:** fix theme assign
* **switch-theme:** fix next theme
* **tests:** add packages dir
* **tests:** fix tests
* **text:** translation module import
* **text:** fix number to string check
* **text-control:** fix options value check
* **text-control:** id mapping
* **text-control:** rollback ngModel
* **timeline:** fixing styles in timeline
* **timeline:** fixing styles in timeline
* **title:** add getCurrentActiveRoute filter
* **translate:** fix number type
* **translate:** fix value
* **translates:** merging only custom translates with values ([#633](https://github.com/xm-online/xm-webapp/issues/633))
* **translations:** fix layout
* **tsconfig:** remove old paths
* **tsconfig:** exclude environments
* **twitching-ui:** remove canvas when hidden
* **upgw-346:** date control add useUtc in options
* **user:** add user public skip handler
* **user:** fix logout permission
* **user-component:** ooops o_0, somebody forget to remove debugger
* **user-management:** add resetPasswordV2
* **weather-widget:** replace list-height to line-height.
* **widget-bc:** fix incorrect mapping
* **xm-alert:** rollback XmAlertComponent, JhiAlertService usage
* **xm-alert:** remove xm alert
* **xm-balance:** resolve path
* **xm-bool:** change icons to field
* **xm-constants:** change minWidth to 120px ([#702](https://github.com/xm-online/xm-webapp/issues/702))
* **xm-data-time:** fix default locale
* **xm-date-time:** fix account error
* **xm-entity-spec-wrapper:** fix null value
* **xm-entity-spec-wrapper:** remove logout deps
* **xm-per-page:** add CommonModule
* **xm-permission:** fix empty user
* **xm-permission:** fix null data
* **xm-permission:** fix async permission
* **xm-permission-service:** add isSuperAdmin function
* **xm-ribbon:** change to async request
* **xm-sidebar-right:** fix factory resolver
* **xm-text-control:** fix options assign
* **xm-user:** add permissions
* **xmAceEditor:** add destroy

### Hotfix

* **translates:** fix problems with windows

### Improvement

* added logging to entity widget component

### Refactor

* replace i18nName with translate
* update deps path
* remove old themes
* remove shared-common
* remove font-awesome
* fix typedef, add [@typescript](https://github.com/typescript)-eslint/explicit-member-accessibility
* replace mat-raised-button with mat-button
* extending theme ([#716](https://github.com/xm-online/xm-webapp/issues/716))
* style bg default
* fix translates
* fix translates
* fix types, file name with stamp
* mapping parents to treeData
* conflicts resolving
* replace NgbModal by MatDialog
* update path
* move take-until from shared dir
* remove Principal for i18n
* remove a.modal-close.material-icons [#217](https://github.com/xm-online/xm-webapp/issues/217)
* align buttons to left at modals [#217](https://github.com/xm-online/xm-webapp/issues/217)
* replace .btn.btn-primary with material [#217](https://github.com/xm-online/xm-webapp/issues/217)
* add _backward-compatibility.scss [#217](https://github.com/xm-online/xm-webapp/issues/217)
* rename XM_CORE_CONFIG to XmCoreConfig
* replace UiConfigService with XmUiConfigService
* fix material import
* remove entry points
* update test cases
* move add permission directive
* code styles
* export notification module
* **ContextService:** provide in root
* **XmEventManager:** replace JhiEventManager with XmEventManager
* **alert:** make alert as module
* **alert:** simplify valle check
* **alert:** remove translateService
* **alert:** move styles
* **alert:** rename intl to config
* **angular2-json-schema-form:** replace with [@ajsf](https://github.com/ajsf)/core
* **auth-jwt:** move XmSessionService from Principal
* **avatar.scss:** update styles
* **btn:** replace .btn-primary with color="primary"
* **button-groups:** using xm-button-groups styles
* **calback-idp:** typings
* **calendar:** fixing styles for calendar buttons
* **callback-idp:** const instead of let
* **carousel:** delete carousel file
* **core:** move to modules
* **dashboard:** replace component with selector
* **dynamic:** add typing [@xm](https://github.com/xm)-ngx/dynamic
* **dynamic-layout:** remove children layout from dynamic-widget
* **entity-details-modal:** filter spec to method
* **entity-list:** moving on mat-tabs, styling
* **fab:** update styles
* **feedback:** remove url form config
* **functions:** removing linked in
* **functions:** removing linked in ([#703](https://github.com/xm-online/xm-webapp/issues/703))
* **i18nJsf:** remove :principal
* **idp:** cleam up
* **idp:** cleanup
* **links-component:** fix styles
* **login-error:** login oath2 error on navigate by direct url
* **logo:** replace Principal with XmSessionService
* **lot-countdown:** delete lot-countdown file
* **main:** add flex layout, fix custom image bg
* **main:** refactor guest bg
* **main:** remove old sidebar
* **main-theme:** replace with with margin
* **maintenance:** refactor styles [#217](https://github.com/xm-online/xm-webapp/issues/217)
* **mat-multi-select:** fix MatSelect deps
* **navbar:** fix layout
* **notifications:** fixing PR conflicts
* **package.json:** replace npm link with direct deps
* **password-settings:** move to own component
* **roles-edit:** moving to mat-table, methods rewrite, cleanup ([#680](https://github.com/xm-online/xm-webapp/issues/680))
* **schema-battery:** delete schema-battery file
* **shared:** remove CookieService
* **sidebar:** remove sidebar
* **sidebar:** remove navbar-minimize and sidebar mini
* **states:** update states.scss
* **styles:** remove outline focus
* **styles:** add xm-ngx-styles-theme mixin
* **styles:** provide _themes files and inject them into styles
* **styles:** exclude to the [@xm](https://github.com/xm)-ngx/styles
* **takeUntilOnDestroy:** change path
* **timeline:** restore default styles
* **translates:** provide [@xm](https://github.com/xm)-ngx/translation
* **tree:** delete tree.scss file
* **user:** fix styles
* **user-component:** allow logout control for * type of user
* **user-component:** fix typo, god bless Travis
* **user-password:** fix layout
* **voucher:** delete voucher file
* **word-autocomplete:** move to styles folder
* **xm-alert:** change translate service to XmTranslateService
* **xm-animate:** update styles
* **xm-core:** provide XmEventManagerService
* **xm-dashboard:** fix paths
* **xm-settings:** use xm-user-*
* **xm-styles:** remove unused
* **xm-user:** move to auth
* **xm-user-password:** add xm-user-password
* **xmUiConfigService:** add init

### Style

* remove rounded-circle
* **dynamic-widget-layout:** update imports
* **general:** style
* **links-group:** redesign
* **sign-in:** split to files

### Styles

* replace btn-round with rounded-circle

### Test

* **administration:** fix tests
* **dynamic:** fix tests
* **general:** fix tests in /packages
* **general:** update TestBed.inject
* **general:** fix tests
* **idp:** debug env uris
* **logger:** mock create method
* **mock:** remove unused method
* **mock:** replace to testing directory
* **mock:** add mocks for entity-collection-service and entity-service
* **mock:** return empty value
* **ng-accessors:** add tests
* **page:** fix tests
* **page-collection:** fix config null ([#700](https://github.com/xm-online/xm-webapp/issues/700))
* **permission:** fix create test
* **schema:** add NO_ERROR_SCHEMA


<a name="v2.0.39"></a>
## [v2.0.39](https://github.com/xm-online/xm-webapp/compare/v2.0.38...v2.0.39) (2021-04-15)

### Feat

* **entity-detail-fab:** replaced by translate pipe
* **entity-detail-fab:** formatted
* **entity-detail-fab:** added detailed tooltip for link buttons, if translation exists


<a name="v2.0.38"></a>
## [v2.0.38](https://github.com/xm-online/xm-webapp/compare/v2.0.37...v2.0.38) (2021-04-06)

### Fix

* **CVE-2021-23358:** updated underscore.min.js (dep of nomnoml package) to fix security issue


<a name="v2.0.37"></a>
## [v2.0.37](https://github.com/xm-online/xm-webapp/compare/v2.0.36...v2.0.37) (2021-04-05)

### Feat

* **content-uploader:** changed to send on form submit
* **content-uploader:** base64 file loader for master

### Fix

* **CVE-2018-19057:** updated XSS fix
* **CVE-2018-19057:** fixed simplemde editor XSS via an onerror attribute of a crafted IMG element
* **cve-2020-28458:** replaced datatables 1.10.18 by datatables.net 1.10.22
* **cve-2020-28458:** updated package datatables.net-bs to use sub-dep datatables.net 1.10.22


<a name="v2.0.36"></a>
## [v2.0.36](https://github.com/xm-online/xm-webapp/compare/v2.0.35...v2.0.36) (2021-03-19)

### Feat

* **account-settings:** cleanup
* **account-settings:** cleanup
* **account-settings:** added ability to configure json schema form for account settings
* **appointment-summary:** discount info added to table


<a name="v2.0.35"></a>
## [v2.0.35](https://github.com/xm-online/xm-webapp/compare/v2.0.34...v2.0.35) (2021-03-11)

### Feat

* **file-upload:** add attribute notitle for file-upload


<a name="v2.0.34"></a>
## [v2.0.34](https://github.com/xm-online/xm-webapp/compare/v2.0.33...v2.0.34) (2021-03-05)


<a name="v2.0.33"></a>
## [v2.0.33](https://github.com/xm-online/xm-webapp/compare/v2.0.32...v2.0.33) (2021-03-05)


<a name="v2.0.32"></a>
## [v2.0.32](https://github.com/xm-online/xm-webapp/compare/v2.0.31...v2.0.32) (2021-03-02)

### Feat

* **entity-list-fab:** removing entity generate option for master
* **ext-select:** add attribute notitle for rest-select ([#936](https://github.com/xm-online/xm-webapp/issues/936))


<a name="v2.0.31"></a>
## [v2.0.31](https://github.com/xm-online/xm-webapp/compare/v2.0.30...v2.0.31) (2021-02-16)

### Feat

* **calendar:** adding edit event picker and timezones support
* **calendar-card:** refactored for use fullcalendar angular component
* **fullcalendar:** added fullcalendar angular component, started refactoring

### Fix

* **app:** removed unnecessary fullcalendar package, fix
* **app:** cleanup
* **calendar-event-dialog:** cleanup
* **calendar-event-dialog:** formatted date from owl-date-time picker to UTC, without timezone
* **main:** added check for locales list from config includes browser locale
* **tsconfig:** import flag removed


<a name="v2.0.30"></a>
## [v2.0.30](https://github.com/xm-online/xm-webapp/compare/v2.0.29...v2.0.30) (2021-01-15)

### Fix

* **entity-detail-dialog:** fixing filtering spec types


<a name="v2.0.29"></a>
## [v2.0.29](https://github.com/xm-online/xm-webapp/compare/v2.0.28...v2.0.29) (2021-01-14)

### Feat

* **timeline-component:** disable timeline service call if configured in ui spec


<a name="v2.0.28"></a>
## [v2.0.28](https://github.com/xm-online/xm-webapp/compare/v2.0.27...v2.0.28) (2021-01-09)

### Fix

* **create-dialog:** type match starts prefix followed by dot ([#888](https://github.com/xm-online/xm-webapp/issues/888))
* **entity-detail-fab:** added one more similar permission to show edit button ([#873](https://github.com/xm-online/xm-webapp/issues/873))


<a name="v2.0.27"></a>
## [v2.0.27](https://github.com/xm-online/xm-webapp/compare/v2.0.26...v2.0.27) (2021-01-06)


<a name="v2.0.26"></a>
## [v2.0.26](https://github.com/xm-online/xm-webapp/compare/v2.0.25...v2.0.26) (2020-12-22)

### Fix

* **events-service:** date utils convert changed to moment, for ignore local timezone


<a name="v2.0.25"></a>
## [v2.0.25](https://github.com/xm-online/xm-webapp/compare/v2.0.24...v2.0.25) (2020-12-17)


<a name="v2.0.24"></a>
## [v2.0.24](https://github.com/xm-online/xm-webapp/compare/v2.0.23...v2.0.24) (2020-12-14)

### Fix

* **location-details:** using different regexps for long and lat, fixing if no location check


<a name="v2.0.23"></a>
## [v2.0.23](https://github.com/xm-online/xm-webapp/compare/v2.0.22...v2.0.23) (2020-12-08)

### Feat

* **navbar:** some functions moved to helpers

### WIP

* Translations convert script from json to csv


<a name="v2.0.22"></a>
## [v2.0.22](https://github.com/xm-online/xm-webapp/compare/v2.0.21...v2.0.22) (2020-11-26)

### Feat

* **entity-list-card:** added query params handling with useQueryParams flag
* **entity-list-card:** fixes for page size
* **password-policies:** refactoring
* **password-policies:** refactoring
* **password-policies:** refactoring, added for register and reset password
* **password-policies:** added password-policies component
* **password-policies:** refactoring


<a name="v2.0.21"></a>
## [v2.0.21](https://github.com/xm-online/xm-webapp/compare/v2.0.20...v2.0.21) (2020-11-20)

### Feat

* **etail-fab:** smallfix


<a name="v2.0.20"></a>
## [v2.0.20](https://github.com/xm-online/xm-webapp/compare/v2.0.19...v2.0.20) (2020-11-19)

### Feat

* **datetime-picker:** adding ability to format sending value

### Fix

* **ext-query-select:** added check for value before set default


<a name="v2.0.19"></a>
## [v2.0.19](https://github.com/xm-online/xm-webapp/compare/3.2.1...v2.0.19) (2020-11-19)

### Debug

* try findout what is wrong with privilages

### Feat

* adding component for help page
* adding static route for fallback navigation
* **25488-old-browsers-popup:** js markup creating and i18n
* **25488-old-browsers-popup:** languages fix
* **25488-old-browsers-popup:** append replaced by appendChild for IE compatibility
* **25488-old-browsers-popup:** added message to prevent use of old browsers
* **25529-read-only-config:** added check for config read-only flag
* **entity-list-card:** added flag to uiConfig for hiding "download" option in list menu
* **links-search:** integrating new search api, using debounce input instead of change
* **map:** fix expresion to check 3 digit before dot in lan and lat
* **navbar:** added flag to uiConfig for toggling full match search in header
* **read-only-config:** added readOnlyMode to roles management and matrix components
* **read-only-config:** added types for buttons
* **theme-override.css:** changed styles for array item element

### Fix

* prevent showing terms modal if already shown
* sort with login param
* if no accont with 403, restore public screen env
* case with buffer link paste and back history fix
* ensure to pass only values which has key in it
* if no privilages to see dashbords, try to see apps and logout
* fixing editor styles, adding permision check for edit controls, fix preview toggle only if needed
* **core:** improved fix
* **core:** overwrote card-header inherit margin
* **docker-file:** need by devops team
* **login:** redirect with params ([#646](https://github.com/xm-online/xm-webapp/issues/646))
* **login:** fix dashlane request for auth
* **sidebar:** fixing sidebar ([#610](https://github.com/xm-online/xm-webapp/issues/610))

### Refactor

* cleanup, resolving discussions
* cleanup, check if can access home route
* merge fix versions
* move redirect methods to login service, adding default page config settings
* cleanup
* checking on typeKey too
* cleanup import
* fix code style
* cleanup


<a name="3.2.1"></a>
## [3.2.1](https://github.com/xm-online/xm-webapp/compare/3.2.0...3.2.1) (2020-11-18)

### Feat

* **auth:** add refresh token

### Style

* **links-group:** redesign


<a name="3.2.0"></a>
## [3.2.0](https://github.com/xm-online/xm-webapp/compare/3.0.0-dev...3.2.0) (2020-11-17)


<a name="3.0.0-dev"></a>
## [3.0.0-dev](https://github.com/xm-online/xm-webapp/compare/v2.0.18...3.0.0-dev) (2020-11-17)

### Bugfix

* **fonts:** move material icon from web to local
* **translation-management:** add take(1) for download button

### Build

* **packages:** add angular 10

### Chore

* add EntityCollectionBase
* fix /administration routing
* move ADMIN_ELEMENTS to XM_ELEMENTS
* remove mediaMarshaller
* pr fixed
* fix unused files
* add DynamicCellComponent
* remove console logging
* move update() from config, add getAll()
* add dynamic tenant services
* remove EntityConfigService
* fix entry resolve
* fix naming
* move deps on PasswordResetInit
* remove  cross deps
* add UserManagementDetailModule
* add RolesManagementDetailModule
* remove XmConfigModule, PaginationConfig
* move interceptors to modules
* replace TakeUntilOnDestroy with takeUntilOnDestroyDestroy
* add serve-production build
* **AuthInterceptor:** provide XmCoreConfig
* **ITEMS_PER_PAGE:** move to packages/
* **ace-editor:** move to /components ([#692](https://github.com/xm-online/xm-webapp/issues/692))
* **admin:** AceEditorDirective to module
* **admin:** move add route to /admin
* **admin:** split to packages
* **admin-config:** move to administration
* **admin-service:** move to packages
* **admin-service:** add default value
* **admin.module:** update imports
* **admin.registry:** add lazy widgets
* **admin.registry:** add lazy components
* **administration:** update styles
* **alert:** update error message output
* **alert-error:** remove errors and replace errors with error
* **animations:** add appear, expand
* **aufit:** move to packages/
* **auth-core:** move to packages
* **auth-expired:** simplify intercept method
* **auth-expired:** add token refresh
* **auth-jwt:** add AuthRefreshTokenService
* **auth-jwt:** add auth-store
* **by-entity-id:** rename from -cell to -value
* **card-icon:** remove icon
* **card-icon:** remove static icon from widgets
* **components:** rename formControl to control
* **controls:** add NgControlAccessor
* **cookies:** replace angular2-cookie with ngx-cookie
* **core:** update path
* **core-auth:** remove AuthInterceptor
* **core-auth:** rename from AuthExpiredInterceptor to AuthInterceptor
* **dashboard:** remove routeSubscription
* **dashboard:** update interfaces
* **dashboard:** update typing
* **dashboard:** remove rootRedirect
* **dashboard:** refactor
* **dashboard:** rollback divs
* **dashboard:** move path to xm-routing
* **dashboard:** separate sortByOrderIndex
* **dashboard-wrapper:** add cache
* **dashboards:** exclude widgets mapper
* **dashboards:** add sort by title
* **dashboards:** rename getByByIdOrSlug to getByIdOrSlug
* **dashboards:** exclude widgets path mapper from dashboard base
* **dashboards:** add page service
* **dashboards:** add appearUp animation
* **dashboards:** add page service
* **dashboards:** add page title service
* **dashboards:** move to /packages
* **date:** add date-control, date-range-control
* **date:** add errors and types
* **develop:** refactor
* **develop:** clean up
* **develop:** clean up
* **docs:** add docs module
* **docs:** move to /packages
* **dynamic:** add dynamicLoaderService
* **dynamic:** add options field
* **dynamic:** remove static
* **dynamic:** add XmDynamicModule
* **dynamic:** split from dashboard
* **dynamic:** fix typing error
* **dynamic:** add dynamic register
* **dynamic:** extract DynamicBase
* **dynamic:** extract loadModuleFactory, loadTenantModuleFactory
* **dynamic:** make options optional at DynamicSearcher
* **dynamic:** convert DynamicWidget to DynamicWidgetDirective
* **dynamic:** move loaders to loader folder
* **dynamic:** add default value
* **dynamic-cell:** provide DynamicLoader
* **dynamic-loader:** provide searcher
* **dynamic-tenant:** add loadAndResole
* **dynamic-widget:** move dynamic to loader.service
* **dynamic-widget:** add deprecations
* **dynamic-widget:** migrate to dynamicLoader
* **dynamic-widget:** refactor init set
* **entity-collection:** add sortable
* **entity-list:** refactor
* **entity-list:** fix linter
* **enum:** rename enum-value
* **enum-control:** add form
* **error:** move error to module
* **eslint:** changed rule
* **eslint:** update lint
* **feedback:** move to /packages
* **form-playground:** move to /packages
* **gateway:** move to gateway
* **guest-background:** styles
* **health:** move to /packages
* **home:** refactor
* **home:** move guest token to auth-jwt
* **home:** refactor layout ([#588](https://github.com/xm-online/xm-webapp/issues/588))
* **home:** add hide container
* **idle:** add idle service
* **ignore:** add test.ts to lint ignore
* **link-list-card:** refactor
* **links-group-widget:** move to /components ([#691](https://github.com/xm-online/xm-webapp/issues/691))
* **loading:** move to packages/
* **location-detail-dialog:** refactor
* **login:** remove login index
* **login:** fix login-logout and session sync
* **logs:** move to /packages
* **main:** remove animations
* **main:** fix loading
* **main:** remove XM_SUCCESS_AUTH
* **main:** fix session
* **main:** remove unused code
* **maintenance:** move to /packages
* **maintenance:** move to packages
* **mat-fab:** add MatFabConfigBase
* **material-icon:** update material icon
* **menu:** update permissions
* **menu:** hotfix sidebar madness
* **menu-component:** replace XmEntityConfigService with XmEntitySpecWrapperService
* **merge-conflicts:** merge dev
* **metrics-modal:** move to /packages
* **navbar:** replace with async
* **navbar:** split to components
* **navbar:** decompose ([#603](https://github.com/xm-online/xm-webapp/issues/603))
* **navbar:** refactor titles
* **navbar:** replace outlet with <xm-navbar>
* **navbar:** add dynamic widgets
* **navbar-language-menu:** update with material
* **ng-accessor:** remove any
* **ng-accessor:** add disabled and value
* **no-data:** move to packages/
* **notifications:** move to /packages
* **operators:** add download.ts
* **package:** fixed version for icon
* **package:** add marker for translations
* **package:** remove auto execution get-translations from ci
* **package:** add config
* **package:** return package-lock
* **package-lock:** unwanted changes
* **packages:** strict localize
* **packages:** remove prebuild
* **password:** change to mat-card
* **permission:** fix circular deps
* **request-cache:** refactor
* **request-cache:** transform to injector
* **request-cache:** add setAndReload
* **roles-matrix:** move to /packages
* **search:** fix lazy route
* **shared:** update mock names
* **sidebar-right:** move width to const
* **sign-in-up-widget:** refactor
* **sortByOrder:** update typing
* **specification-mng:** update slug
* **specification-mng:** rename to specification-management
* **specifications:** move to /packages
* **styles:** add placeholder
* **table-config:** update constants
* **text-control:** add formControl
* **translate:** switch to translate pipe ([#636](https://github.com/xm-online/xm-webapp/issues/636))
* **translations:** add translations
* **translations:** change translations
* **translations:** move to /packages
* **translations-management:** remove cache for config
* **translations-management:** fix after demo
* **tsconfig:** exclude testing
* **user:** replace with user$()
* **user:** rename to sidebar-user
* **user-management:** style html
* **xm-alert:** move to packages
* **xm-config-core:** add SERVER_API_URL
* **xm-core:** remove init from module
* **xm-core:** move to packages
* **xm-core:** remove XM_CORE_CONFIG_DEFAULT
* **xm-entity:** move EntityDetailDialogModule to module
* **xm-entity-spec-wrapper:** add RequestCacheFactoryService
* **xm-entity-spec-wrapper:** add RequestCache
* **xm-event-manger:** rename cache to dispatcher
* **xm-main:** remove xm-main
* **xm-password-needed:** move to packages/
* **xm-per-page:** move to packages/
* **xm-permission:** switch to defaultIfEmpty
* **xm-permission:** add empty value
* **xm-private-ui:** add RequestCacheFactoryService
* **xm-public-ui:** add RequestCacheFactoryService
* **xm-rating:** move to packages/
* **xm-translates:** move to /packages
* **xm-ui-config:** rename cache$ to config$()
* **xm-user:** add RequestCacheFactoryService

### Docs

* **dynamic:** add doc

### Feat

* replace ngx-rating with custom
* add [@xm](https://github.com/xm)-ngx/xm-balance
* move ELEMENT_NOT_FOUND to searcher
* add [@kolkov](https://github.com/kolkov)/angular-editor
* add xmsharedModule
* add mb-5
* add bowsersList
* add alert module
* add XmEventManagerService
* add cache, IUIConfig, XmUiConfigService
* init
* add no-data module
* add proxy interceptor
* adding methods to save and map export data
* adding export and import dialogs and services
* add xm-maintenance-view.module.ts
* add xm-entity module
* add [@xm](https://github.com/xm)-ngx/components/xm-ribbon
* add input.module.ts
* add NavbarDashboardEditWidgetModule
* add permission module
* add [@xm](https://github.com/xm)-ngx/ext
* add permission.guard
* add BoolComponent
* add innerHtml
* added options to hide links if no links present
* added no data text options for empty lists
* add PROXY_INTERCEPTOR
* add debug
* init permission.directive.ts
* replace deep /**/ with single /*/
* update to angular 9.1
* **25488:** backport of pr [#799](https://github.com/xm-online/xm-webapp/issues/799) from master
* **25529-read-only-flag:** making backport of pr [#802](https://github.com/xm-online/xm-webapp/issues/802) from master
* **WordAutocompleteModule:** add WordAutocompleteModule
* **XmEntity:** add createdBy
* **XmEntity:** extend with .data generic
* **account:** add logout
* **ace:** add search
* **ace-editr:** add AceEditorThemeSchemeAdapterDirective
* **admin:** rename widget components
* **admin:** remove old dashboard management widget
* **admin:** rename widget components
* **admin:** move user, role, client managment
* **admin:** duplicate dashboard
* **admin-config:** add entity-spec-mng
* **admin-registry:** add translations
* **admin-registry:** add [@xm](https://github.com/xm)-ngx/components/feedback
* **administration:** rename Widget to DashboardWidget
* **ajsf:** add ru and uk locales
* **alert:** add deleting
* **alert:** replace JhiAlertService with XmToasterService
* **alert:** replace swal with XmAlertService
* **alert:** add XmToasterService, XmAlertService
* **angular:** prod namedChunks true
* **angular.json:** add all themes
* **angular2-json-schema-form:** XmJsonSchemeFormModule at '[@xm](https://github.com/xm)-ngx/json-scheme-form'
* **application:** add fab space
* **audits:** replace with material styles
* **auth:** add refreshGuestAccessToken
* **auth-interceptor:** skip with Authorization header
* **auth-jwt:** add session
* **b2bcrm-479:** add message after sent feedback
* **bool-value:** rename bool-view to bool-value
* **build:** update angular to [@8](https://github.com/8).2.14
* **build-theme:** include /ext
* **build-themes:** extend with number
* **by-entity-id:** add by-entity-id.component ([#720](https://github.com/xm-online/xm-webapp/issues/720))
* **by-entity-id:** add [@xm](https://github.com/xm)-ngx/components/by-entity-id-cell
* **checkbox-control:** add control
* **checkbox-control:** remove unused
* **components:** add package.json
* **condition:** add condition output
* **condition:** add add arguments
* **condition:** add xmCondition
* **control-error:** add control-errors
* **control-error:** move translates to const
* **copy:** add entry
* **core:** add xm-ui-config
* **core:** add request-cache.ts
* **core:** XmUiConfigService add private api
* **core:** update structure
* **core:** add permission service
* **core:** add xm-user
* **core:** add core config
* **core:** add package.json
* **core-auth:** move XmUserService
* **core-auth:** move to core root
* **currency:** add entry
* **dashboard:** update paths
* **dashboard:** add interface Dashboard
* **dashboard:** add DashboardGuard
* **dashboard:** add dynamic-widget-layout.component.ts
* **dashboard:** add page-location.service
* **dashboard-edit:** add scroll
* **dashboard-wrapper:** add forceReload
* **dashboard-wrapper:** add cacheFactoryService
* **dashboards:** add dashboard
* **dashboards:** provide pageService
* **dashboards:** add import export scripts Merge branch 'feature/angular-9' into 'master'
* **date:** add date-value
* **default-user-avatar:** add error handler
* **develop:** entity-list almost done
* **develop.entity-list:** refactor
* **docs:** add control-error
* **dynamic:** move to packages
* **dynamic:** update index, module
* **dynamic:** add package.json
* **dynamic:** add class and styles
* **dynamic:** update interfaces
* **dynamic-cell:** extend from dynamic-view
* **dynamic-control:** add xm-dynamic-control
* **dynamic-injector:** add global
* **dynamic-loader:** add multi loader
* **dynamic-view:** add dynamic view
* **dynamic-view:** add styles
* **dynamic-view:** export ViewLayout
* **dynamic-view:** add injector
* **dynamic-view-layout:** add xm-dynamic-view-layout
* **dynamic-widget:** add sanitizedLayouts
* **dynamic-widget:** add xm-ngx support
* **dynamic-widget:** add loadAndResolve
* **dynamic-widget:** add DYNAMIC_COMPONENTS
* **dynamic-widget:** add lazy module-entity support
* **dynamic-widget:** add error logs, provide injector
* **dynamic-widget:** add module parse
* **dynamic-widget-layout:** add animation
* **edit-buttons:** add edit-buttons ([#591](https://github.com/xm-online/xm-webapp/issues/591))
* **edit-widget-buttons:** add disabled ([#595](https://github.com/xm-online/xm-webapp/issues/595))
* **entity:** add StatesManagementDialogModule, EntityStateModule
* **entity-collection:** update pageable interface
* **entity-collection:** extend with Pageable
* **entity-list:** refactor
* **enum-control:** display option by permission
* **enum-control:** extend abilities
* **enum-value:** split enum to enum value
* **environment:** add notFoundUrl
* **environment:** add getServerEnvironment
* **environment:** add serverApiUrl
* **error-handler:** add skip header
* **eslint:** extend rules with no-inferrable-types
* **fade-in-out:** change position to absolute ([#653](https://github.com/xm-online/xm-webapp/issues/653))
* **feedback:** add feedback page
* **feedback:** material button styling
* **function-list-section:** set auto width for curr state column
* **gateway:** replace with material table
* **git:** add commitlint with git hook
* **git:** added .gitattributes
* **health:** add material styles
* **heatmap:** available only for super admin role
* **heatmap:** add active styles
* **high-level-architecture-widget:** move to /packages
* **home:** add regex to domains ([#601](https://github.com/xm-online/xm-webapp/issues/601))
* **home:** add null check
* **i18n:** add 500 case
* **i18n:** add concurrencyFailure
* **i18n:** add yes and no
* **i18nJsf:** add Principal
* **icons:** removed icons from cards
* **if-dashboard-slug:** add filter by slug ([#598](https://github.com/xm-online/xm-webapp/issues/598))
* **image-view:** add image-view ([#592](https://github.com/xm-online/xm-webapp/issues/592))
* **karma:** add ChromeHeadlessNoSandbox ([#695](https://github.com/xm-online/xm-webapp/issues/695))
* **karma:** add ChromeWithoutSecurity
* **language:** add language.module.ts
* **languages:** add default locale from config
* **layout:** add ribbon
* **layout:** add XmSidebarRightModule
* **link:** add fieldTitle
* **link:** add link-value
* **link-group:** add mobile view
* **link-list-card:** removed unnecessary button styles
* **link-list-card:** refactor using mat table
* **link-list-card:** styles enhancement
* **link-view:** display fieldValue if option exist
* **link-view:** refactoring, add icon
* **link-view:** add link view ([#718](https://github.com/xm-online/xm-webapp/issues/718))
* **link-view-copy:** add copy icon ([#719](https://github.com/xm-online/xm-webapp/issues/719))
* **links-group:** add links group ([#676](https://github.com/xm-online/xm-webapp/issues/676))
* **links-group:** add scroll
* **links-search:** making backport of PR [#739](https://github.com/xm-online/xm-webapp/issues/739) from master
* **loader:** add loader module
* **loading:** add loading package
* **location-detail-dialog:** added error messages and attributes for required fields
* **logo:** move to packages
* **logs:** update html
* **logs:** add material tables
* **main:** add layout styling
* **main:** replace xmRouteChangeAnimation with angular animation
* **maintenance:** add showReindex
* **mat-fab:** add tooltip ([#684](https://github.com/xm-online/xm-webapp/issues/684))
* **mat-fab:** add mat-fab
* **material-design-icons:** add icons
* **menu:** add fucus style
* **menu:** add sections
* **menu:** move to packages
* **menu:** add hideAdminConsole flag
* **navbar:** styling icons
* **navbar:** styling of search input field
* **navbar:** remove useless comments
* **navbar:** split styles [#640](https://github.com/xm-online/xm-webapp/issues/640)
* **navbar-input-search:** backported flag for full match search ([#596](https://github.com/xm-online/xm-webapp/issues/596))
* **ng-model:** add ng control-accessor
* **ng-model:** add touch
* **ngsw-config:** switch to lazy mode
* **no-data:** update styles ([#600](https://github.com/xm-online/xm-webapp/issues/600))
* **number-control:** remove unused
* **number-control:** add control
* **package:** update angular to 10.6.0
* **package:** angular-9
* **package:** update deps
* **package.json:** add npm-link to prebuild
* **packages:** update ng-jhipster, ngx-chips, ngx-mat-select-search, ngx-webstorage
* **packages:** update angular
* **packages:** add [@xm](https://github.com/xm)-ngx/json-schema-form [#297](https://github.com/xm-online/xm-webapp/issues/297) ([#631](https://github.com/xm-online/xm-webapp/issues/631))
* **page-collection:** add page-collection.service
* **page-entity:** add string type for entity
* **password:** the same padding as settings page
* **permission:** improve doc
* **phone-number:** add input field
* **polyfills:** add localize
* **polyfills:** update according to angular 9
* **protractor:** add configs
* **proxy:** add excludedUrls
* **pwa:** add pwa setup ([#658](https://github.com/xm-online/xm-webapp/issues/658))
* **request-cache:** remove reloadInterval and requestTimeOut
* **request-cache:** add RequestCacheFactoryService
* **request-cache-factory:** add reloadInterval and requestTimeOut
* **request-cache-factory:** add takeUntilOnDestroy to reloadIntervalHandle
* **request-factory:** inject session into stream
* **route-change:** add route change animation ([#572](https://github.com/xm-online/xm-webapp/issues/572))
* **scripts:** replace string assets with glob: '**/*'
* **session:** add core session service
* **settings:** the same colors for save buttons
* **shadow:** remove [@angular](https://github.com/angular)/material
* **shared:** add Id and IId
* **shared:** add validators
* **shared:** move to packages
* **shared:** add package.json
* **shared-operation:** add interpolate.ts
* **sidebar:** add xm-sidebar
* **sidebar:** add color variables
* **sidebar-right:** add components
* **sidebar-user:** add subtitles ([#710](https://github.com/xm-online/xm-webapp/issues/710))
* **spec:** improve code by MR comments
* **spec:** fix MR
* **spec:** improve code by MR comments
* **spec:** improve code by MR comments
* **spec:** improve yaml serialization ([#578](https://github.com/xm-online/xm-webapp/issues/578))
* **spec:** initial spec editor
* **spec-mng:** change maxLines
* **specification:** update translates
* **stats-widget:** removed mat-divider from widget template
* **stats-widget:** add translates
* **string-handler:** add string handler ([#655](https://github.com/xm-online/xm-webapp/issues/655))
* **string-handler:** add touch event
* **styles:** split theming with components.scss
* **styles:** remove components
* **styles:** add bootstrap variables to theme
* **styles:** change theme build strategy
* **styles:** add README, angular config extend with src/app/ext
* **styles:** card-header
* **styles:** add mixins
* **styles:** add radius-lg
* **styles:** add typography vars
* **styles:** make scroll config global
* **styles:** add tint to secondary color
* **styles:** add sidebar styling
* **styles:** add replace-styles.js
* **styles:** add scroll styles
* **styles:** add font variables
* **swagger:** update version
* **sweetalert:** add scss variables
* **table-column:** add dataClass
* **table-filter-validation:** alternative errors source
* **table-filter-validation:** validation messages from configuration
* **take-until-on-destroy:** add TakeUntilOnDestroy decorator
* **take-until-on-destroy:** add take-until-on-destroy.ts
* **text:** add date-value
* **text-join-value:** add text-join-value
* **text-range:** add TextRange
* **text-range:** add required
* **text-view:** apply new styles ([#723](https://github.com/xm-online/xm-webapp/issues/723))
* **text-view:** add primitive type ([#727](https://github.com/xm-online/xm-webapp/issues/727))
* **theme:** remove [@angular](https://github.com/angular)/material, add default theme
* **theme:** add xm-theme
* **theme-scheme:** add theme-scheme.service.ts
* **themes:** add default xm themes
* **toaster:** add options
* **toaster:** define interface properties
* **transform-by-map:** add multi level
* **transform-by-map:** add transformByMap
* **translate:** set default translate
* **translates:** add ru and uk locale
* **translation:** add interpolate
* **translation:** add XmTranslateService
* **tsconfig:** provide main modules
* **tsconfig:** switch target to es2015
* **ui-config:** split to xm-private and xm-public
* **ui-config:** add session listening
* **unblock-lock-user:** add unblock-lock-user
* **user:** move to packages
* **versions:** use same versions for new dependencies
* **widget-edit:** add EDIT_WIDGET_EVENT
* **widget-edit:** add xm-selector-text-control
* **widget-list:** add widget-list service
* **xm-alert:** fix error as object response
* **xm-alert:** replace alert with snackbar
* **xm-alert:** replace $.notify with snackBar
* **xm-bool:** change remove to remove_circle_outline
* **xm-bool:** rename to xm-bool-view
* **xm-bool:** add OnChange
* **xm-bool-control:** add xm-bool-control
* **xm-config:** in case if no data.theme use default
* **xm-control-errors:** add XM_CONTROL_ERRORS_TRANSLATES
* **xm-entity:** add [@xm](https://github.com/xm)-ngx/entity
* **xm-enum:** add xm-enum-view, xm-enum-control
* **xm-mat-card:** add xm-mat-card ([#675](https://github.com/xm-online/xm-webapp/issues/675))
* **xm-mat-card:** add xm-header-actions ([#693](https://github.com/xm-online/xm-webapp/issues/693))
* **xm-navbar-language:** add tooltip
* **xm-password-needed:** add xm-password-needed.module.ts
* **xm-public:** add xm public page
* **xm-table-column-dynamic-cell:** add component
* **xm-text-control:** add xm-text-control
* **xm-text-view:** add xm-text-view
* **xm-text-view:** no inline margin
* **xm-text-view:** add xm-text-component
* **xm-theme:** extend with themeScheme and colorScheme
* **xm-toaster:** change to MatSnackBar
* **xm-toaster:** extend(bc) toaster service
* **xm-translation:** add TranslatePipe to services
* **xm-user-login-widget:** add XmUserLoginWidgetModule
* **xm-user-security-settings:** add XmUserSecuritySettingsModule
* **xm-user-settings:** add XmUserSettingsWidgetModule

### Feature

* add ajsf
* **api-docs-styling:** padding and excess block
* **heatmap:** PoC
* **heatmap-poc:** fix of library error
* **heatmap-poc:** hide by default
* **high-level-architecture:** reverse dependencies
* **localization-dashboard:** add new localization dashboard
* **navbar:** add isShowSearchPanel flag
* **translations:** change indentation
* **translations:** fixes after review
* **translations:** reverted theme
* **translations:** added extract translations function

### Fix

* remove conflicted rules
* prevent showing terms modal if already shown ([#551](https://github.com/xm-online/xm-webapp/issues/551))
* main, navbar, task-manager - button styles
* fixing styles and permissions ([#487](https://github.com/xm-online/xm-webapp/issues/487))
* fix: replace Renderer with Renderer2
* custom link display options
* check by env
* fix RequestCache
* add img-fluid class to <img
* remove multi XmEntitySpecWrapperService injections
* mat input, entry
* mat-fab color
* add ModuleWithProviders typing
* fixing buttons styles ([#701](https://github.com/xm-online/xm-webapp/issues/701))
* conflict resolving
* remove 'npm run prebuild' from 'build'
* dashboards remove static entry
* **XmUiConfigService:** move requestCache to constructor
* **_theme:** remove $dark-primary-text and $light-primary-text ([#686](https://github.com/xm-online/xm-webapp/issues/686))
* **account:** fix circle deps
* **account-help:** addding help account from master ([#609](https://github.com/xm-online/xm-webapp/issues/609))
* **admin:** remove xmSharedModule
* **admin-service:** rollback lastModifiedDate to id
* **ajsf:** add fixFlexLayout
* **ajsf:** return mat-form-styles
* **ajsf:** parent-child flex layout
* **alert:** fix error code mapping
* **alert:** remove margin on top
* **audits:** fix pagination
* **audits:** fix switch with error
* **auth:** apply user locale after identity ([#697](https://github.com/xm-online/xm-webapp/issues/697))
* **avatar-dialog:** fix file button and preview styles
* **b2bcrm787:** fix if component dont have registerOnChange
* **back-links:** fixing broken back-links ([#635](https://github.com/xm-online/xm-webapp/issues/635))
* **build:** fix global
* **button-groups:** fixing inline spacing, refactoring font sizing
* **by-entity-id:** update should be called with dynamic components
* **card:** replace .card with mat-card ([#644](https://github.com/xm-online/xm-webapp/issues/644))
* **card:** fix card styles
* **client-management:** fix scopes
* **client-management:** add XmPermissionModule
* **client-mng:** fix pagination length
* **config:** fix scss generation
* **core:** remove redundant code
* **core-auth:** priority to session token
* **dashboard:** fix typing
* **dashboard:** fix empty dashboard after login
* **dashboard:** fix xm-bool resolve
* **dashboard-list:** fix toggle
* **dashboard-wrapper.service:** check idOrSlug for null
* **dashboards:** add catchError ([#643](https://github.com/xm-online/xm-webapp/issues/643))
* **dashboards:** fix redirect error
* **dashboards:** add navbar pageSubSubTitle
* **dashboards:** fix caches
* **dashboards:** fix link redirect
* **date-value:** fix empty options
* **default-dashboard:** fix empty dashboard after session change
* **develop:** added mediaMarshaller calls to fix ajsf flex
* **dialog:** fix submit button
* **docs:** api path
* **dynamic-loader:** fix undefined error
* **dynamic-tenant:** module resolve component
* **dynamic-tenant-loader:** remove selector validator
* **dynamic-view:** fix resolve module
* **dynamic-view:** fix layout type ([#602](https://github.com/xm-online/xm-webapp/issues/602))
* **dynamic-view:** fix extends
* **dynamic-view:** remove appearUp
* **entity-details:** fix update details ([#670](https://github.com/xm-online/xm-webapp/issues/670))
* **entity-details:** fix mat deps
* **entity-list:** using mat-paginator, providing translations ([#661](https://github.com/xm-online/xm-webapp/issues/661))
* **entity-list:** minor edits
* **entity-list:** fixing update list on modufucations ([#637](https://github.com/xm-online/xm-webapp/issues/637))
* **entity-list:** refactor
* **entity-list:** refactor due to linter to fix ci build
* **entity-list:** sort considering sortable prop ([#672](https://github.com/xm-online/xm-webapp/issues/672))
* **entity-list-card:** fix aot build
* **entity-list-card:** fix aot build
* **entity-list-card:** attempt move on mat-tabs
* **entity-list-card:** fix aot build
* **ext-select:** adding ext select deep link support from master ([#632](https://github.com/xm-online/xm-webapp/issues/632))
* **feetback:** add attributes
* **function-service:** add headers for call function
* **gateway:** fix date
* **heatmap:** fix undefined error
* **heatmap:** prevent event
* **heatmap:** performance issue
* **idle-logout:** fix deps
* **jsf-widgets:** fix multi-lang input widget ([#681](https://github.com/xm-online/xm-webapp/issues/681))
* **karma:** update to angular 9 configs
* **link-list:** correcting imports
* **link-list:** using vars in scss
* **link-view:** fix defaults assign ([#721](https://github.com/xm-online/xm-webapp/issues/721))
* **linked-in:** fix translates key
* **links-tree:** fixing tree old behavior from master ([#688](https://github.com/xm-online/xm-webapp/issues/688))
* **loader:** fix scss
* **loader:** remove parent class xm-disabled
* **location-detail-dialog:** increased max-height
* **location-detail-dialog:** translations, console errors
* **location-detail-dialog:** refactor, improvement
* **login:** styles
* **login:** fix redirect url
* **login-terms-and-conditions:** fixing terms in develop ([#621](https://github.com/xm-online/xm-webapp/issues/621))
* **main-theme:** fix mobile view with navbar
* **mat-dialog:** adding controls ([#654](https://github.com/xm-online/xm-webapp/issues/654))
* **md-editor:** fix editor full screen mode overlay ([#648](https://github.com/xm-online/xm-webapp/issues/648))
* **menu:** permission MATRIX.GET
* **menu:** remove useless argument
* **menu:** fix group name priority
* **menu:** fix groupKey match
* **menu:** add *permitted and hidden
* **menu-item:** fixing long string in menu item ([#673](https://github.com/xm-online/xm-webapp/issues/673))
* **module-language.helper:** restore
* **navbar:** allow feedback only auth-ed users
* **navbar:** add custom edit
* **navbar:** add  navbar-toggler
* **navbar:** overflow
* **navbar:** return ng-deep
* **navbar:** fix widget update params
* **navbar:** fix scroll
* **navbar:** remove static
* **navbar-dashboard:** fix multi subscription
* **ng-deep:** wrap with host
* **notifications:** add clearInterval
* **notifications:** fix-init, styling ([#668](https://github.com/xm-online/xm-webapp/issues/668))
* **notifications:** refactor using native mat-menu
* **old-browsers-popup:** decreased chrome version to prevent error on tests
* **old-browsers-popup:** fixed chrome version
* **olnd-browsers:** downgrade to 76
* **packages-styles:** adding xm-button-group component styles
* **page-ribbon:** fix getAuthenticationState
* **password:** fallback to the first appropriate login
* **phone-number:** add default-value
* **powered-by:** fix config access
* **powered-by:** fix powered by in develop ([#616](https://github.com/xm-online/xm-webapp/issues/616))
* **principal:** add session
* **register:** styles
* **request-cache:** fix [@TakeUntilOnDestroy](https://github.com/TakeUntilOnDestroy)()
* **request-cache:** add unsubscribe
* **ribbon:** change header
* **route-change-animation:** reset styles after animation
* **route-change-animation:** remove player after animation complete
* **scripts:** remove  generate-localization-file.py
* **scripts:** extend manage-exts.js with assets
* **search-glodal:** fixing broken search
* **shared:** fix IId import
* **shared:** fix build
* **shared:** add createRequestOption
* **shared-testing:** typing
* **sidebar:** added possibility to hide item
* **sidebar:** split styles
* **sidebar:** fix multi requests
* **sidebar:** added const for if
* **sidebar:** add EntityConfigService
* **sign-in-up-widget:** refactor + fixed styles
* **spec:** fix change data and form specs ([#593](https://github.com/xm-online/xm-webapp/issues/593))
* **stats-widget:** fixing layout and styles ([#683](https://github.com/xm-online/xm-webapp/issues/683))
* **styles:** add loading
* **styles:** fix themes build and import
* **styles:** improve bootstrap typography
* **styles:** add mat-slide-toggle-thumb
* **styles:** fix rounded
* **styles:** remove mat deps
* **switch-theme:** fix theme assign
* **tests:** add packages dir
* **tests:** fix tests
* **text-control:** id mapping
* **text-control:** rollback ngModel
* **timeline:** fixing styles in timeline
* **timeline:** fixing styles in timeline
* **title:** add getCurrentActiveRoute filter
* **translate:** fix value
* **translate:** fix number type
* **translates:** merging only custom translates with values ([#633](https://github.com/xm-online/xm-webapp/issues/633))
* **translations:** fix layout
* **tsconfig:** exclude environments
* **tsconfig:** remove old paths
* **twitching-ui:** remove canvas when hidden
* **user:** fix logout permission
* **user:** add user public skip handler
* **user-component:** ooops o_0, somebody forget to remove debugger
* **user-management:** add resetPasswordV2
* **widget-bc:** fix incorrect mapping
* **xm-alert:** remove xm alert
* **xm-alert:** rollback XmAlertComponent, JhiAlertService usage
* **xm-balance:** resolve path
* **xm-bool:** change icons to field
* **xm-constants:** change minWidth to 120px ([#702](https://github.com/xm-online/xm-webapp/issues/702))
* **xm-data-time:** fix default locale
* **xm-date-time:** fix account error
* **xm-entity-spec-wrapper:** fix null value
* **xm-entity-spec-wrapper:** remove logout deps
* **xm-per-page:** add CommonModule
* **xm-permission:** fix async permission
* **xm-permission:** fix empty user
* **xm-permission:** fix null data
* **xm-permission-service:** add isSuperAdmin function
* **xm-ribbon:** change to async request
* **xm-sidebar-right:** fix factory resolver
* **xm-text-control:** fix options assign
* **xm-user:** add permissions
* **xmAceEditor:** add destroy

### Hotfix

* **translates:** fix problems with windows

### Refactor

* update path
* style bg default
* fix translates
* fix translates
* fix types, file name with stamp
* mapping parents to treeData
* conflicts resolving
* remove old themes
* remove entry points
* code styles
* move add permission directive
* extending theme ([#716](https://github.com/xm-online/xm-webapp/issues/716))
* update test cases
* remove font-awesome
* fix typedef, add [@typescript](https://github.com/typescript)-eslint/explicit-member-accessibility
* replace mat-raised-button with mat-button
* move take-until from shared dir
* export notification module
* remove a.modal-close.material-icons [#217](https://github.com/xm-online/xm-webapp/issues/217)
* align buttons to left at modals [#217](https://github.com/xm-online/xm-webapp/issues/217)
* replace .btn.btn-primary with material [#217](https://github.com/xm-online/xm-webapp/issues/217)
* add _backward-compatibility.scss [#217](https://github.com/xm-online/xm-webapp/issues/217)
* replace i18nName with translate
* replace NgbModal by MatDialog
* remove Principal for i18n
* rename XM_CORE_CONFIG to XmCoreConfig
* replace UiConfigService with XmUiConfigService
* update deps path
* remove shared-common
* fix material import
* **ContextService:** provide in root
* **XmEventManager:** replace JhiEventManager with XmEventManager
* **alert:** make alert as module
* **alert:** rename intl to config
* **alert:** remove translateService
* **alert:** move styles
* **alert:** simplify valle check
* **angular2-json-schema-form:** replace with [@ajsf](https://github.com/ajsf)/core
* **auth-jwt:** move XmSessionService from Principal
* **avatar.scss:** update styles
* **btn:** replace .btn-primary with color="primary"
* **button-groups:** using xm-button-groups styles
* **calendar:** fixing styles for calendar buttons
* **carousel:** delete carousel file
* **core:** move to modules
* **dashboard:** replace component with selector
* **dynamic:** add typing [@xm](https://github.com/xm)-ngx/dynamic
* **dynamic-layout:** remove children layout from dynamic-widget
* **entity-list:** moving on mat-tabs, styling
* **fab:** update styles
* **feedback:** remove url form config
* **functions:** removing linked in ([#703](https://github.com/xm-online/xm-webapp/issues/703))
* **functions:** removing linked in
* **i18nJsf:** remove :principal
* **links-component:** fix styles
* **logo:** replace Principal with XmSessionService
* **lot-countdown:** delete lot-countdown file
* **main:** add flex layout, fix custom image bg
* **main:** remove old sidebar
* **main:** refactor guest bg
* **main-theme:** replace with with margin
* **maintenance:** refactor styles [#217](https://github.com/xm-online/xm-webapp/issues/217)
* **mat-multi-select:** fix MatSelect deps
* **navbar:** fix layout
* **notifications:** fixing PR conflicts
* **package.json:** replace npm link with direct deps
* **password-settings:** move to own component
* **roles-edit:** moving to mat-table, methods rewrite, cleanup ([#680](https://github.com/xm-online/xm-webapp/issues/680))
* **schema-battery:** delete schema-battery file
* **shared:** remove CookieService
* **sidebar:** remove navbar-minimize and sidebar mini
* **sidebar:** remove sidebar
* **states:** update states.scss
* **styles:** add xm-ngx-styles-theme mixin
* **styles:** exclude to the [@xm](https://github.com/xm)-ngx/styles
* **styles:** remove outline focus
* **styles:** provide _themes files and inject them into styles
* **takeUntilOnDestroy:** change path
* **timeline:** restore default styles
* **translates:** provide [@xm](https://github.com/xm)-ngx/translation
* **tree:** delete tree.scss file
* **user:** fix styles
* **user-component:** fix typo, god bless Travis
* **user-component:** allow logout control for * type of user
* **user-password:** fix layout
* **voucher:** delete voucher file
* **word-autocomplete:** move to styles folder
* **xm-animate:** update styles
* **xm-core:** provide XmEventManagerService
* **xm-dashboard:** fix paths
* **xm-settings:** use xm-user-*
* **xm-styles:** remove unused
* **xm-user:** move to auth
* **xm-user-password:** add xm-user-password
* **xmUiConfigService:** add init

### Style

* remove rounded-circle
* **dynamic-widget-layout:** update imports

### Styles

* replace btn-round with rounded-circle

### Test

* **general:** fix tests
* **page-collection:** fix config null ([#700](https://github.com/xm-online/xm-webapp/issues/700))
* **permission:** fix create test


<a name="v2.0.18"></a>
## [v2.0.18](https://github.com/xm-online/xm-webapp/compare/v2.0.17...v2.0.18) (2020-11-12)


<a name="v2.0.17"></a>
## [v2.0.17](https://github.com/xm-online/xm-webapp/compare/v2.0.16...v2.0.17) (2020-11-02)

### Feat

* **25488-old-browsers-popup:** added message to prevent use of old browsers
* **25488-old-browsers-popup:** languages fix
* **25488-old-browsers-popup:** append replaced by appendChild for IE compatibility
* **25488-old-browsers-popup:** js markup creating and i18n
* **25529-read-only-config:** added check for config read-only flag
* **read-only-config:** added readOnlyMode to roles management and matrix components
* **read-only-config:** added types for buttons


<a name="v2.0.16"></a>
## [v2.0.16](https://github.com/xm-online/xm-webapp/compare/v2.0.15...v2.0.16) (2020-10-16)


<a name="v2.0.15"></a>
## [v2.0.15](https://github.com/xm-online/xm-webapp/compare/v2.0.14...v2.0.15) (2020-10-06)


<a name="v2.0.14"></a>
## [v2.0.14](https://github.com/xm-online/xm-webapp/compare/v2.0.13...v2.0.14) (2020-09-28)

### Feat

* **links-search:** integrating new search api, using debounce input instead of change


<a name="v2.0.13"></a>
## [v2.0.13](https://github.com/xm-online/xm-webapp/compare/v2.0.12...v2.0.13) (2020-09-17)

### Fix

* **login:** fix dashlane request for auth


<a name="v2.0.12"></a>
## [v2.0.12](https://github.com/xm-online/xm-webapp/compare/v2.0.11...v2.0.12) (2020-08-11)

### Fix

* **login:** redirect with params ([#646](https://github.com/xm-online/xm-webapp/issues/646))


<a name="v2.0.11"></a>
## [v2.0.11](https://github.com/xm-online/xm-webapp/compare/v2.0.10...v2.0.11) (2020-08-04)

### Fix

* **sidebar:** fixing sidebar ([#610](https://github.com/xm-online/xm-webapp/issues/610))


<a name="v2.0.10"></a>
## [v2.0.10](https://github.com/xm-online/xm-webapp/compare/v2.0.9...v2.0.10) (2020-07-30)

### Debug

* try findout what is wrong with privilages

### Feat

* adding static route for fallback navigation
* **entity-list-card:** added flag to uiConfig for hiding "download" option in list menu

### Fix

* if no privilages to see dashbords, try to see apps and logout
* case with buffer link paste and back history fix
* if no accont with 403, restore public screen env

### Refactor

* cleanup, resolving discussions
* cleanup, check if can access home route
* merge fix versions
* move redirect methods to login service, adding default page config settings
* cleanup import


<a name="v2.0.9"></a>
## [v2.0.9](https://github.com/xm-online/xm-webapp/compare/v2.0.8...v2.0.9) (2020-07-13)

### Refactor

* cleanup
* checking on typeKey too


<a name="v2.0.8"></a>
## [v2.0.8](https://github.com/xm-online/xm-webapp/compare/v2.0.7...v2.0.8) (2020-07-09)

### Fix

* ensure to pass only values which has key in it


<a name="v2.0.7"></a>
## [v2.0.7](https://github.com/xm-online/xm-webapp/compare/v2.0.6...v2.0.7) (2020-07-08)

### Fix

* prevent showing terms modal if already shown


<a name="v2.0.6"></a>
## [v2.0.6](https://github.com/xm-online/xm-webapp/compare/v2.0.5...v2.0.6) (2020-06-26)

### Fix

* **core:** improved fix
* **core:** overwrote card-header inherit margin


<a name="v2.0.5"></a>
## [v2.0.5](https://github.com/xm-online/xm-webapp/compare/v2.0.4...v2.0.5) (2020-06-16)

### Feat

* **navbar:** added flag to uiConfig for toggling full match search in header


<a name="v2.0.4"></a>
## [v2.0.4](https://github.com/xm-online/xm-webapp/compare/v2.0.3...v2.0.4) (2020-06-11)

### Feat

* adding component for help page

### Fix

* sort with login param

### Refactor

* fix code style
* cleanup


<a name="v2.0.3"></a>
## [v2.0.3](https://github.com/xm-online/xm-webapp/compare/v2.0.2...v2.0.3) (2020-06-09)

### Fix

* fixing editor styles, adding permision check for edit controls, fix preview toggle only if needed


<a name="v2.0.2"></a>
## [v2.0.2](https://github.com/xm-online/xm-webapp/compare/v2.0.1...v2.0.2) (2020-06-01)

### Feat

* **theme-override.css:** changed styles for array item element


<a name="v2.0.1"></a>
## [v2.0.1](https://github.com/xm-online/xm-webapp/compare/3.1.0...v2.0.1) (2020-05-29)

### FEATURE

* show form playgrout to 'ROUTE.GET_LIST' privileged user

### Fix

* incorrect page assign [#133](https://github.com/xm-online/xm-webapp/issues/133)


<a name="3.1.0"></a>
## [3.1.0](https://github.com/xm-online/xm-webapp/compare/3.0.0...3.1.0) (2020-04-06)

### Chore

* remove EntityConfigService
* move interceptors to modules
* remove XmConfigModule, PaginationConfig
* move deps on PasswordResetInit
* remove console logging
* move update() from config, add getAll()
* remove  cross deps
* **deps:** removed sock-js from core
* **deps:** set lower sockjs verion
* **menu-component:** replace XmEntityConfigService with XmEntitySpecWrapperService
* **package:** add config
* **xm-entity-spec-wrapper:** add RequestCache
* **xm-main:** remove xm-main

### Feat

* add [@kolkov](https://github.com/kolkov)/angular-editor
* add [@xm](https://github.com/xm)-ngx/xm-balance
* add permission.guard
* add [@xm](https://github.com/xm)-ngx/ext
* add debug
* **XmEntity:** add createdBy
* **ace:** add search
* **admin-config:** add entity-spec-mng
* **application:** add fab space
* **build-theme:** include /ext
* **entity:** add StatesManagementDialogModule, EntityStateModule
* **styles:** add radius-lg
* **ui-config:** split to xm-private and xm-public

### Feature

* add ajsf

### Fix

* remove 'npm run prebuild' from 'build'
* **account:** fix circle deps
* **translate:** fix value
* **xm-balance:** resolve path

### Refactor

* **timeline:** restore default styles

### Style

* remove rounded-circle


<a name="3.0.0"></a>
## [3.0.0](https://github.com/xm-online/xm-webapp/compare/v2.0.0...3.0.0) (2020-03-20)

### Chore

* pr fixed
* **request-cache:** add setAndReload
* **xm-core:** remove init from module

### Feat

* add xmsharedModule
* add alert module
* add cache, IUIConfig, XmUiConfigService
* add no-data module
* add xm-maintenance-view.module.ts
* add mb-5
* replace deep /**/ with single /*/
* add input.module.ts
* add xm-entity module
* add XmEventManagerService
* replace ngx-rating with custom
* init permission.directive.ts
* add permission module
* add bowsersList
* init
* **XmEntity:** extend with .data generic
* **account:** add logout
* **alert:** replace swal with XmAlertService
* **alert:** replace JhiAlertService with XmToasterService
* **alert:** add XmToasterService, XmAlertService
* **angular.json:** add all themes
* **angular2-json-schema-form:** XmJsonSchemeFormModule at '[@xm](https://github.com/xm)-ngx/json-scheme-form'
* **auth-jwt:** add session
* **build:** update angular to [@8](https://github.com/8).2.14
* **core:** add request-cache.ts
* **core:** add xm-ui-config
* **core:** add core config
* **core:** add permission service
* **core:** add xm-user
* **core:** XmUiConfigService add private api
* **dynamic-widget:** add lazy module-entity support
* **dynamic-widget:** add error logs, provide injector
* **environment:** add getServerEnvironment
* **eslint:** extend rules with no-inferrable-types
* **feedback:** material button styling
* **feedback:** add feedback page
* **i18n:** add yes and no
* **i18nJsf:** add Principal
* **icons:** removed icons from cards
* **language:** add language.module.ts
* **layout:** add ribbon
* **loader:** add loader module
* **main:** add layout styling
* **menu:** add fucus style
* **navbar:** styling icons
* **navbar:** remove useless comments
* **navbar:** styling of search input field
* **package.json:** add npm-link to prebuild
* **password:** the same padding as settings page
* **permission:** improve doc
* **polyfills:** update according to angular 9
* **scripts:** replace string assets with glob: '**/*'
* **session:** add core session service
* **settings:** the same colors for save buttons
* **shadow:** remove [@angular](https://github.com/angular)/material
* **sidebar:** add color variables
* **sidebar:** add xm-sidebar
* **styles:** add tint to secondary color
* **styles:** add scroll styles
* **styles:** remove components
* **styles:** add typography vars
* **styles:** add font variables
* **styles:** add bootstrap variables to theme
* **styles:** add sidebar styling
* **styles:** change theme build strategy
* **styles:** card-header
* **styles:** add mixins
* **styles:** split theming with components.scss
* **styles:** add replace-styles.js
* **styles:** add README, angular config extend with src/app/ext
* **sweetalert:** add scss variables
* **take-until-on-destroy:** add take-until-on-destroy.ts
* **theme:** remove [@angular](https://github.com/angular)/material, add default theme
* **themes:** add default xm themes
* **toaster:** add options
* **tsconfig:** provide main modules
* **ui-config:** add session listening
* **xm-config:** in case if no data.theme use default
* **xm-entity:** add [@xm](https://github.com/xm)-ngx/entity
* **xm-password-needed:** add xm-password-needed.module.ts
* **xm-toaster:** extend(bc) toaster service

### Fix

* fix: replace Renderer with Renderer2
* main, navbar, task-manager - button styles
* fix RequestCache
* remove conflicted rules
* check by env
* add img-fluid class to <img
* mat-fab color
* **XmUiConfigService:** move requestCache to constructor
* **alert:** remove margin on top
* **build:** fix global
* **card:** fix card styles
* **client-management:** fix scopes
* **dialog:** fix submit button
* **feetback:** add attributes
* **karma:** update to angular 9 configs
* **loader:** fix scss
* **menu:** fix groupKey match
* **menu:** add *permitted and hidden
* **menu:** remove useless argument
* **navbar:** allow feedback only auth-ed users
* **navbar:** add  navbar-toggler
* **notifications:** add clearInterval
* **ribbon:** change header
* **scripts:** extend manage-exts.js with assets
* **scripts:** remove  generate-localization-file.py
* **shared:** fix build
* **shared:** add createRequestOption
* **shared-testing:** typing
* **sidebar:** added const for if
* **sidebar:** added possibility to hide item
* **sidebar:** split styles
* **sidebar:** add EntityConfigService
* **styles:** improve bootstrap typography
* **styles:** fix rounded
* **styles:** add mat-slide-toggle-thumb
* **styles:** fix themes build and import
* **styles:** remove mat deps
* **user:** fix logout permission
* **user-component:** ooops o_0, somebody forget to remove debugger
* **xmAceEditor:** add destroy

### Refactor

* remove a.modal-close.material-icons [#217](https://github.com/xm-online/xm-webapp/issues/217)
* replace mat-raised-button with mat-button
* remove shared-common
* update deps path
* remove old themes
* rename XM_CORE_CONFIG to XmCoreConfig
* export notification module
* move take-until from shared dir
* update test cases
* move add permission directive
* code styles
* fix typedef, add [@typescript](https://github.com/typescript)-eslint/explicit-member-accessibility
* update path
* add _backward-compatibility.scss [#217](https://github.com/xm-online/xm-webapp/issues/217)
* replace .btn.btn-primary with material [#217](https://github.com/xm-online/xm-webapp/issues/217)
* replace i18nName with translate
* align buttons to left at modals [#217](https://github.com/xm-online/xm-webapp/issues/217)
* remove Principal for i18n
* replace UiConfigService with XmUiConfigService
* replace NgbModal by MatDialog
* remove font-awesome
* **ContextService:** provide in root
* **XmEventManager:** replace JhiEventManager with XmEventManager
* **alert:** make alert as module
* **alert:** remove translateService
* **alert:** rename intl to config
* **alert:** simplify valle check
* **alert:** move styles
* **auth-jwt:** move XmSessionService from Principal
* **avatar.scss:** update styles
* **btn:** replace .btn-primary with color="primary"
* **carousel:** delete carousel file
* **dynamic:** add typing [@xm](https://github.com/xm)-ngx/dynamic
* **fab:** update styles
* **i18nJsf:** remove :principal
* **logo:** replace Principal with XmSessionService
* **lot-countdown:** delete lot-countdown file
* **main:** remove old sidebar
* **main:** add flex layout, fix custom image bg
* **maintenance:** refactor styles [#217](https://github.com/xm-online/xm-webapp/issues/217)
* **navbar:** fix layout
* **package.json:** replace npm link with direct deps
* **schema-battery:** delete schema-battery file
* **sidebar:** remove sidebar
* **sidebar:** remove navbar-minimize and sidebar mini
* **states:** update states.scss
* **styles:** provide _themes files and inject them into styles
* **styles:** add xm-ngx-styles-theme mixin
* **styles:** exclude to the [@xm](https://github.com/xm)-ngx/styles
* **styles:** remove outline focus
* **takeUntilOnDestroy:** change path
* **translates:** provide [@xm](https://github.com/xm)-ngx/translation
* **tree:** delete tree.scss file
* **user:** fix styles
* **user-component:** allow logout control for * type of user
* **user-component:** fix typo, god bless Travis
* **voucher:** delete voucher file
* **word-autocomplete:** move to styles folder
* **xm-animate:** update styles
* **xm-core:** provide XmEventManagerService
* **xm-dashboard:** fix paths
* **xm-styles:** remove unused
* **xmUiConfigService:** add init

### Styles

* replace btn-round with rounded-circle


<a name="v2.0.0"></a>
## v2.0.0 (2020-01-31)

### Bugfix

* on list modification event, reload currently active tab

### Build

* provide lint script
* **package.json:** add engines version

### Deps

* update minor deps

### FIX

* circular dependency
* check if uiSpec is defined [skip travis]
* increase dependency version
* unblock comment form after service error
* default value for function based statistics
* comment list display if no profile permission exist
* initisl value
* resire query select state
* get user provile via correct BE api
* shorthand for default value
* The configuration of the functions of the entities does not work AllowedStateKeys
* UI shows empty locations and empty attachments after JHipster BE migration

### Feat

* switch to eslint
* hide linebreak-style, and of [@typescript](https://github.com/typescript)-eslint/no-use-before-define
* update [@angular](https://github.com/angular)/flex-layout[@8](https://github.com/8).0.0-beta.27
* add stylelint
* add noImplicitThis
* add typedef, type-annotation-spacing
* **dashboard:** add widgetName
* **editorconfig:** update
* **eslint:** add code styles
* **eslint:** add configs, lint files
* **package:** update all dependencies
* **package:** add webpack-bundle-analyzer
* **style:** add configs
* **stylelint:** add configss, and lint files
* **styles:** add styles.scss
* **translate:** override ngx-translate
* **tsconfig:** determine the necessary config
* **xm-routing:** import lazy modules

### Feature

* jsf form result mapping for function responce

### Fix

* disable errors
* build
* **build:** strict deps
* **client-management:** remove console
* **ngx-translate:** fix translate loader
* **test:** add NgxWebstorageModule
* **titles:** add undefined check
* **translations:** add XmTranslationModule

### Fix

* remember me 403 on diferrent tabs.
* go to root if dashboard is undefined
* romove comments
* Object naming in ext-select component

### Refactor

* enable tsconfig.app angularCompilerOptions
* tslint
* tslint
* tslint
* apply default setup
* chartist
* set void as return type
* add "noFallthroughCasesInSwitch" and strictFunctionTypes
* add "noUnusedLocals"
* add "noImplicitReturns"
* replace constructors with object init
* remove next
* replace md-pro-angular-cli with xm-webapp
* **I18nNamePipe:** add principal to constructor
* **calendar:** fix typing
* **layout:** add module
* **xm-entity:** add interfaces
* **xm-routing:** structure routes

