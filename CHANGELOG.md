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
