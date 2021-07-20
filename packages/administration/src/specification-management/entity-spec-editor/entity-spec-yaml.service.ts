import { Injectable } from '@angular/core';
import { Spec } from '@xm-ngx/entity';

@Injectable()
export class EntitySpecYamlService {

    private spacing: string = '  ';
    private toJsonFields: string[] = ['name', 'pluralName', 'actionName'];
    private toJsonTextFields: string[] = ['dataSpec', 'dataForm', 'inputSpec', 'inputForm'];

    private static getType(object: unknown): string {
        const type = typeof object;
        if (object instanceof Array) {
            return 'array';
        } else if (type === 'string') {
            return 'string';
        } else if (type === 'boolean') {
            return 'boolean';
        } else if (type === 'number') {
            return 'number';
        } else if (type === 'undefined' || object === null) {
            return 'null';
        } 
        return 'hash';
        
    }

    public toYaml(spec: Spec): string {
        const ret = ['---'];
        this.convert(spec, ret);
        return ret.join('\n');
    }

    private convert(object: unknown, ret: string[]): void {
        const type = EntitySpecYamlService.getType(object);

        switch (type) {
            case 'array':
                this.convertArray(object as unknown[], ret);
                break;
            case 'hash':
                this.convertHash(object, ret);
                break;
            case 'string':
                if ((object as string).startsWith('#')) {
                    ret.push(`'${object}'`);
                } else {
                    ret.push(object as string);
                }
                break;
            case 'null':
                ret.push('null');
                break;
            case 'number':
                ret.push(object.toString());
                break;
            case 'boolean':
                ret.push(object ? 'true' : 'false');
                break;
        }
    }

    private convertArray(object: unknown[], ret: string[]): void {
        if (object.length === 0) {
            ret.push('[]');
        }
        for (let i = 0; i < object.length; i++) {
            const ele = object[i];
            const recurse = [];
            this.convert(ele, recurse);

            for (let j = 0; j < recurse.length; j++) {
                ret.push((j === 0 ? '- ' : this.spacing) + recurse[j]);
            }
        }
    }

    private convertHash(object: unknown, ret: string[]): void {
        Object.keys(object).forEach((k) => {
            const recurse = [];
            const ele = object[k];
            this.convert(ele, recurse);
            const type = EntitySpecYamlService.getType(ele);
            if (this.toJsonFields.includes(k)) {
                ret.push(`${k}: ${JSON.stringify(ele)}`);
            } else if (this.toJsonTextFields.includes(k)) {
                if (ele) {
                    ret.push(`${k}: |`);
                    ret.push(`  ${JSON.stringify(JSON.parse(ele))}`);
                }
            } else if (type === 'string' || type === 'null' || type === 'number' || type === 'boolean') {
                ret.push(`${k}: ${recurse[0]}`);
            } else {
                ret.push(`${k}: `);
                recurse.forEach((i) => ret.push(this.spacing + i));
            }
        });
    }

}
