const {RuleTester} = require('eslint');
const rules = require('@xm-ngx/eslint-plugin');

const rule = rules.rules['angular-selector-unique-rule'];

const ruleTester = new RuleTester({
    parser: require.resolve('@typescript-eslint/parser'),
});

ruleTester.run('angular-selector-unique-rule', rule, {
    valid: [
        {
            code: `
        @Component({selector: 'app-component1'})
        export class AppComponent1 {}
      `,
            filename: 'app.component1.ts',
        },
        {
            code: `
        @Component({selector: 'app-component2'})
        export class AppComponent2 {}
      `,
            filename: 'app.component2.ts',
        },
        {
            code: `
        @Component({selector: 'app-component2'})
         class AppComponent3 {}
      `,
            filename: 'app.component2.ts',
        },
    ],
    invalid: [{
        code: `
        @Component({selector: 'app-component1'})
        export class AppComponent1 {}
        `,
        filename: 'app.component3.ts',
        errors: [{message: 'Selector "app-component1" is already used in "app.component1.ts:2:30".'}],
    }],
});
