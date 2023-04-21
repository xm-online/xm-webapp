module.exports = {
    meta: {
        type: 'problem',
        docs: {
            description: 'Selectors must be unique across Angular files',
            category: 'Possible Errors',
            recommended: true,
        },
        fixable: null,
        schema: [],
    },
    create: function (context) {
        const selectors = new Map();
        return {
            'CallExpression[callee.property.name="selector"]'(node) {
                const selectorNode = node.arguments[0];
                const selector = selectorNode.value;
                const fileName = context.getFilename();
                const existingFile = selectors.get(selector);
                if (existingFile && existingFile !== fileName) {
                    context.report({
                        node: selectorNode,
                        message: `Selector "${selector}" is already used in "${existingFile}".`,
                    });
                } else {
                    selectors.set(selector, fileName);
                }
            },
        };
    },
};
