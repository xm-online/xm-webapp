import { Rule } from 'eslint';

let selectors = new Map();
let isFirstIterationAnyFileMatchCache = null;

export default {
    meta: {
        type: 'problem',
        docs: {
            description: 'Selectors must be unique across Angular files',
            recommended: false,
        },
    },
    create(context) {
        const path = context.getPhysicalFilename();
        if (isFirstIterationAnyFileMatchCache === null) {
            isFirstIterationAnyFileMatchCache = path;
        } else if (isFirstIterationAnyFileMatchCache === path) {
            // Clear cache because the same file runs second time
            selectors = new Map();
            isFirstIterationAnyFileMatchCache = null;
        }

        return {
            'ExportNamedDeclaration > ClassDeclaration > Decorator[expression.callee.name=Component] Property:matches([key.name=selector]) :matches(Literal, TemplateElement)'(node) {
                const fileName = `${path}:${node.loc.start.line}:${node.loc.start.column}`;
                const existingFile = selectors.get(node.value);
                if (existingFile && existingFile !== fileName) {
                    context.report({
                        node,
                        message: `Selector "${node.value}" is already used in "${existingFile}".`,
                    });
                } else {
                    selectors.set(node.value, fileName);
                }
            },
        };
    },
} as Rule.RuleModule;
