import { searchNestedByPredicate } from './key-predicate';

describe('keyPredicate', () => {
    it('should search return a value from nested arrays', () => {
        const nestedArray = [
            {
                id: '123',
                nested: [
                    {
                        name: 'key1',
                        value: '1',
                    },
                    {
                        name: 'key2',
                        value: '2',
                    },
                ],
            },
            {
                id: '321',
                nested: [
                    {
                        name: 'key1',
                        value: '1',
                    },
                ],
            },
        ];

        const filters = {
            'resKey1': [
                {
                    prop: 'nested',
                    predicate: {
                        id: '123',
                    },
                },
                {
                    prop: 'value',
                    predicate: {
                        name: 'key1',
                    },
                },
            ],
        };

        const result = searchNestedByPredicate(nestedArray, filters);

        expect(result).toEqual({'resKey1': '1'});
    });
});


