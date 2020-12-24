### Xm-ngx Cli

| command          | description |
|------------------|-------------|
| `replace`        | Replaces the core files. |
| `ext-lazy-module`| Places extension modules in angular.json. |
| `ext-i18n`       | Combines extension translations into one file. |
| `ext-assets`     | Places extension assets in angular.json. |
| `ext-themes`     | Builds extension themes. |
| `ext-install`    | Runs `npm install` at extension directories. |
| `ext-routing`    | Combines extension routing.ts in the routing.ts. |
| `ext-theming`    | Combines extension theming.scss in the theming.scss. |
| `help`           | Lists available commands and their short descriptions. |

#### Replace

`--theme` - _theme.scss  
`--webmanifest` - manifest.webmanifest  
`--styles` - styles.scss  
`--app-module` - xm.module.ts  
`--index` - index.html  

Example
```shell
xm-ngx replace --webmanifest my_manifest.webmanifest
```