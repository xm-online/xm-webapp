import * as _ from 'lodash';
import { JsonPointer } from '@ajsf/core';

export const fixNestedObjectPaths = (collection: Record<string, unknown> = {}): any => {
    const result = {};

    const traverse = (collection, path: string) => {
        const isPlainObject = _.isPlainObject(collection);
        const isArray = _.isArray(collection);

        if (isArray) {
            result[path] = result[path] || collection.length;
        }

        if (isPlainObject || isArray) {
            _.forEach(collection, (value, key) => {
                traverse(value, `${path}/${key}`);
            });
        }
    };

    traverse(collection, '');

    return result;
};

// see: https://github.com/hamzahamidi/ajsf/issues/144
// This function mutate original object
export function fixNestedBuildLayout(options: {
    builtLayout: any,
    formData: Record<string, unknown>;
}): any {
    const { builtLayout, formData } = options;

    const objectPaths = fixNestedObjectPaths(formData);

    const rebuildLayout = (options: {
        builtLayout: any,
        dataIndex?: number[],
        indexPos?: number,
        parentDataPointer?: string
    }) => {
        const { builtLayout, dataIndex = [], parentDataPointer } = options;

        let { indexPos } = options;

        indexPos = indexPos == null ? indexPos = -1 : indexPos;

        if (_.isArray(builtLayout)) {
            builtLayout.forEach((item) => {
                rebuildLayout({
                    builtLayout: item,
                    dataIndex: dataIndex,
                    indexPos: indexPos,
                    parentDataPointer: item.dataPointer || parentDataPointer,
                });
            });
        } else if (
            builtLayout.items
            && builtLayout.type == 'array'
            && builtLayout.dataPointer
            && !builtLayout.recursiveReference
        ) {
            const indexPointer = JsonPointer.toIndexedPointer(builtLayout.dataPointer, dataIndex);
            const calcDataItems = objectPaths[indexPointer];

            let actualDataItems = builtLayout.items.length;

            // check if there's ref items, if so ignore it and therefore
            // decrement the item count
            builtLayout.items.forEach(item => {
                if (item.type && item.type == '$ref') {
                    actualDataItems--;
                }
            });

            actualDataItems = Math.max(actualDataItems, 0);

            if (actualDataItems < calcDataItems) {
                const itemsNeeded = calcDataItems - actualDataItems;

                // get first element for new items
                const [firstItem] = builtLayout.items;

                // added to ignore recursive references
                if (actualDataItems > 0 && !firstItem.recursiveReference) {
                    for (let i = 0; i < itemsNeeded; i++) {
                        // node must not be of type "type": "$ref"
                        // if it is then manufacture our own
                        // const isRefNode = firstItem.type && firstItem.type == '$ref';
                        //
                        // const newItem = isRefNode
                        //     ? createNonRefItem(firstItem)
                        //     : _.cloneDeep(firstItem); //copy first

                        const newItem = _.cloneDeep(firstItem);

                        newItem._id = _.uniqueId('patch_');
                        builtLayout.items.unshift(newItem);
                    }
                }

                if (builtLayout.options.listItems) {
                    builtLayout.options.listItems = calcDataItems;
                }
            }

            indexPos++;

            builtLayout.items.forEach((item, index) => {
                dataIndex[indexPos] = index;
                rebuildLayout({
                    builtLayout: item,
                    dataIndex: dataIndex,
                    parentDataPointer: builtLayout.dataPointer,
                    indexPos: indexPos,
                });
            });
        } else if (builtLayout.items) {
            builtLayout.items.forEach((item) => {
                rebuildLayout({
                    builtLayout: item,
                    dataIndex: dataIndex,
                    parentDataPointer: parentDataPointer,
                    indexPos: indexPos,
                });
            });
        }
    };
    rebuildLayout({
        builtLayout: builtLayout,
    });

    return builtLayout;
}
