export type TreePredicate<T> = (node: T) => boolean;
export type TreeChildren<T> = (node: T) => T[];

export function treeNodeSearch<T>(treeNode: T[], getChildren: TreeChildren<T>, predicate: TreePredicate<T>): T {
    function traverseRecursive(treeNode: T[]): T | null {
        if (!treeNode) {
            return null;
        }

        for (const node of treeNode) {
            if (predicate(node)) {
                return node;
            }

            const found = traverseRecursive(getChildren(node));

            if (found) {
                return found;
            }
        }

        return null;
    }

    return traverseRecursive(treeNode);
}
