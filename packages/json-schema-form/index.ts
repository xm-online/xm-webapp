// primary entry-point which is empty as of version 9. All components should
// be imported through their individual entry-points. This file is needed to
// satisfy the "ng_package" bazel rule which also requires a primary entry-point.
export * from './components';
export * from './src/locale/ru-config';
export * from './src/locale/uk-config';
export * from './src/xm-json-schema-form.service';
export * from './src/fix-build-layout';
export * from './src/fix-flex-layout';
export * from './src/jsf.attributes';
export * from './src/material-design-framework';
export * from './src/xm-json-schema-form.module';
