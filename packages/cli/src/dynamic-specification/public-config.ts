import { ClassDeclaration, SourceFile } from 'ts-morph';
import { DynamicComponentSpecEntity } from './dynamic-component';

function isConfig(classDeclaration: ClassDeclaration): boolean {
    return false;
}

export function getPublicConfigSpec(sourceFiles: SourceFile[]): DynamicComponentSpecEntity[] {

    for (const sourceFile of sourceFiles) {
        const dynamicClasses = sourceFile.getClasses()
            .filter(i => isConfig(i));

        for (const dynamicClass of dynamicClasses) {
            console.info(dynamicClass);
        }
    }

    return [];
}
