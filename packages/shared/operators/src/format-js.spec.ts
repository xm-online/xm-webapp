import { formatJs } from './format-js';

describe('formatJs', () => {
    it('Some text sample', () => {
        const template = {
            entity: '"Some text"',
            body: {
                test: {
                    title: 'entity.some_unique_field',
                },
            },
        };

        const context = {
            entity: { some_unique_field: 'Random value' },
        };

        const result = formatJs(template, context);

        const expectation = {
            entity: 'Some text',
            body: {
                test: {
                    title: 'Random value',
                },
            },
        };
        void expect(result).toEqual(expectation);
    });


});
