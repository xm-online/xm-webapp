import { Command } from '../command';
import { Project } from 'ts-morph';
import fs from 'fs';
import { DynamicComponentSpecEntity, getComponentsSpec } from './dynamic-component';
import { getPublicConfigSpec } from './public-config';

export interface DynamicComponentsSpecOutput {
    components: DynamicComponentSpecEntity[]
}

export class DynamicSpecificationCommand implements Command {
    public execute(): void {
        const project = new Project({
            tsConfigFilePath: 'src/tsconfig.app.json',
        });

        const sourceFiles = project.getSourceFiles();
        const components = getComponentsSpec(sourceFiles);
        const publicUiConfig = getPublicConfigSpec(sourceFiles);

        fs.writeFileSync(
            'src/assets/specification/dynamic_components_spec_output.json',
            JSON.stringify({ components, publicUiConfig }, undefined, 2)
        );
        console.info('Dynamic components spec generated successfully.');
    }
}
