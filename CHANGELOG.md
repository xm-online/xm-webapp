

bootstrap 5
As of Bootstrap 5 beta, left and right have been replaced by start and end for RTL support. Therefore the margin utilities changed for Bootstrap 5 beta:

ml-auto => ms-auto (start)
mr-auto => me-auto (end)
Also note, all uses of left and right have been replaced with start and end in Bootstrap 5...

ml-* => ms-*
pl-* => ps-*
mr-* => me-*
pr-* => pe-*
text-left => text-start
text-right=> text-end
float-left => float-start
float-right=> float-end
border-left => border-start
border-right=> border-end
rounded-left => rounded-start
rounded-right=> rounded-end
dropleft => dropstart
dropright=> dropend
dropdown-menu-left => dropdown-menu-start
dropdown-menu-right => dropdown-menu-end
carousel-item-left => carousel-item-start
carousel-item-right=> carousel-item-end


https://github.com/twbs/bootstrap/releases/tag/v5.2.0
https://getbootstrap.com/docs/5.0/migration/



# 3.2.3 (2021-05-27)

### Features

* Add `Defaults` Decorator.

```ts
class MyComponent {
  @Input() @Defaults({permission: []}) public config: { permission: string[] };
}
```

* **exceptions:** Add exceptions.

```ts
throw new ArgumentException();
throw new NotImplementedException();
throw new NotSupportedException();
```

### BREAKING CHANGES

* **navbar:** Split and rename navbar components.

```text
xm-notifications to xm-navbar-notification-widget
xm-navbar-arrow-back to xm-navbar-arrow-back-widget
xm-navbar-help-link to xm-navbar-help-link-widget
xm-navbar-language-menu to xm-navbar-language-menu-widget
xm-navbar-logo to xm-navbar-logo-widget
xm-navbar-input-search to xm-navbar-search-widget
xm-navbar-title to xm-navbar-title-widget
xm-navbar-toggle to xm-navbar-toggle-widget
```

# 3.3.0 (2021-07-14)

### BREAKING CHANGES

* **dashboards:** Move from /src/xm-dashboard to /packages/dashboard

```text
Use `@xm-ngx/dashboard` to import from /packages/dashboard
```

# 3.6.65
- Fix export