# Example of extension
You can use this example as a template for new extension modules.

### /i18n
The directory with translates.

### /module/example-webapp-ext.module.ts
The entry point directory. Contains the main module - `ExampleWebappExtModule`.

### /assets
To deploy some static files e.g. image, place them in the `assets` directory. 
The directory `assest` will be placed in `angular.json` in the `build.asset` section before building the application.

### /styles/prebuild-themes
The directory contains prebuild themes.

### /styles/_theming.scss
The file stores theme mixins.
