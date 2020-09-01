import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ExportDataItem {
    attachmentTypeKeys?: string[];
    linkTypeKeys?: string[];
    locationTypeKeys?: string[];
    ratingTypeKeys?: string[];
    tagTypeKeys?: string[];
    calendars?: [{eventTypeKeys: string[], typeKey: string}];
    comments?: boolean | string[];
    typeKey: string;
}

export class ExportEntityItemNode {
    public children: ExportEntityItemNode[];
    public item: string;
    public parent?: string;
}

export class ExportEntityFlatNode {
    public item: string;
    public level: number;
    public expandable: boolean;
    public parent?: string
}

@Injectable({
    providedIn: 'root'
})
export class ExportEntitiesService {

    public dataChange: BehaviorSubject<ExportEntityItemNode[]>
        = new BehaviorSubject<ExportEntityItemNode[]>([]);

    get data(): ExportEntityItemNode[] { return this.dataChange.value; }

    public initialize(treeDta: any): void {
        // Build the tree nodes from Json object. The result is a list of `ExportEntityItemNode` with nested
        // file node as children.
        const data = this.buildFileTree(treeDta, 0);

        // Notify the change.
        this.dataChange.next(data);
    }

    /**
     * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
     * The return value is the list of `ExportEntityItemNode`.
     */
    public buildFileTree(obj: {[key: string]: any}, level: number, parent?: string): ExportEntityItemNode[] {
        return Object.keys(obj).reduce<ExportEntityItemNode[]>((accumulator, key) => {
            const value = obj[key];
            const node = new ExportEntityItemNode();
            node.item = key;
            if (parent) {
                node.parent = parent
            }

            if (value != null) {
                if (typeof value === 'object') {
                    node.children = this.buildFileTree(value, level + 1, key);
                } else {
                    node.item = value;
                }
            }

            return accumulator.concat(node);
        }, []);
    }

    public getInitialTreeData(spec: any): any {
        let treeData = {};
        Object.keys(spec).forEach((key: string) => {
            switch (key) {
                case 'calendars': {
                    treeData = {...treeData, calendars: this.getCalendars(spec[key])}
                    break;
                }
                case 'comments': {
                    treeData = {...treeData, comments: null}
                    break;
                }
                case 'attachments': {
                    treeData = {...treeData, [key]: this.getByValuesKey(spec[key])}
                    break;
                }
                case 'links': {
                    treeData = {...treeData, [key]: this.getByValuesKey(spec[key])}
                    break;
                }
                case 'locations': {
                    treeData = {...treeData, [key]: this.getByValuesKey(spec[key])}
                    break;
                }
                case 'ratings': {
                    treeData = {...treeData, [key]: this.getByValuesKey(spec[key])}
                    break;
                }
                case 'tags': {
                    treeData = {...treeData, [key]: this.getByValuesKey(spec[key])}
                    break;
                }
                default: {
                    break;
                }
            }
        });
        return treeData;
    }

    private getCalendars(values: any[]): any {
        // const events = event.values[]

        // RESOURCE.CHARGING-STATION
        // const calendars = {};
        values.forEach(() => {

        });
        return
    }

    private getByValuesKey(values: any[], prop: string = 'key'): any {
        const obj = {}
        values.map(s => {
            Object.assign(obj, {[s[prop]]: null})
        });
        return obj;
    }
}
