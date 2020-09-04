import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ExportConfig } from '@xm-ngx/administration/maintenance/export-entities-details/export-entities-details.component';

const API_EXPORT_ENTITIES = '/entity/api/export/xm-entities';

export interface ExportDataItem {
    attachmentTypeKeys?: string[];
    linkTypeKeys?: string[];
    locationTypeKeys?: string[];
    ratingTypeKeys?: string[];
    tagTypeKeys?: string[];
    calendars?: {eventTypeKeys?: string[], typeKey?: string}[];
    comments?: boolean | string[];
    typeKey: string;
}

export class ExportEntityItemNode {
    public children: ExportEntityItemNode[];
    public item: string;
}

export class ExportEntityFlatNode {
    public item: string;
    public level: number;
    public expandable: boolean;
    public parent?: ExportEntityFlatNode;
}

@Injectable({
    providedIn: 'root'
})
export class ExportEntitiesService {

    public dataChange: BehaviorSubject<ExportEntityItemNode[]>
        = new BehaviorSubject<ExportEntityItemNode[]>([]);
    constructor(private http: HttpClient) {
    }

    get data(): ExportEntityItemNode[] { return this.dataChange.value; }

    public initialize(treeDta: unknown): void {
        // Build the tree nodes from Json object. The result is a list of `ExportEntityItemNode` with nested
        // file node as children.
        this.dataChange.next([]);

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

    public getInitialTreeModel(spec: ExportConfig): unknown {
        let treeData = {};
        // has to be this way in order to get only things that api support
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

    public getExportJson(data: ExportDataItem[]): Observable<unknown> {
        return this.http.post(API_EXPORT_ENTITIES, data);
    }

    public mapPayload(selections: any[]): ExportDataItem[] {
        const payload: ExportDataItem[] = [];

        selections.forEach((spec) => {
            const newSelection = {
                attachmentTypeKeys: [],
                linkTypeKeys: [],
                locationTypeKeys: [],
                ratingTypeKeys: [],
                tagTypeKeys: [],
                calendars: [],
                comments: false,
                typeKey: spec.key,
            }

            const exportParams = [];
            const calendarEvents = [];

            spec.selection.forEach(s => {
                if (s.level && s.level === 1) {
                    exportParams.push(s);
                }
                if (s.level && s.level === 2) {
                    calendarEvents.push(s);
                }
            });
            exportParams.forEach((p) => {
                const parentKey = p.parent.item;
                const key = p.item;
                switch(parentKey) {
                    case 'attachments': {
                        newSelection.attachmentTypeKeys.push(key);
                        break;
                    }
                    case 'links': {
                        newSelection.linkTypeKeys.push(key);
                        break;
                    }
                    case 'locations': {
                        newSelection.locationTypeKeys.push(key);
                        break;
                    }
                    case 'ratings': {
                        newSelection.ratingTypeKeys.push(key);
                        break;
                    }
                    case 'tags': {
                        newSelection.tagTypeKeys.push(key);
                        break;
                    }
                    case 'calendars': {
                        newSelection.calendars.push({
                            eventTypeKeys: [],
                            typeKey: key,
                        });
                        break;
                    }
                    case 'comments': {
                        newSelection.comments = true;
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });
            calendarEvents.forEach(event => {
                const parentKey = event.parent.item;
                const key = event.item;
                const hasCalendar = newSelection.calendars.filter(c => c.typeKey === parentKey);

                if (hasCalendar && hasCalendar.length > 0) {
                    hasCalendar[0].eventTypeKeys.push(key);
                } else {
                    newSelection.calendars.push({
                        eventTypeKeys: [key],
                        typeKey: parentKey,
                    });
                }
            });
            payload.push(newSelection);
        });
        return payload;
    }

    private getByValuesKey(values: unknown[], prop: string = 'key'): unknown {
        const obj = {}
        values.map(s => {
            Object.assign(obj, {[s[prop]]: null})
        });
        return obj;
    }

    private getCalendars(calendars: ExportConfig[]): unknown {
        const calendarsNode = {};
        calendars.forEach((c) => {
            Object.assign(calendarsNode, {[c.key]: this.getCalendarsEvents(c)})
        })
        return calendarsNode;
    }

    private getCalendarsEvents(calendar: ExportConfig): unknown {
        if (calendar.events && calendar.events.length > 0) {
            const calendarEventsNode = {};
            calendar.events.forEach((e: ExportConfig) => {
                Object.assign(calendarEventsNode, {[e.key]: null});
            });
            return calendarEventsNode;
        } else {
            return null;
        }
    }
}
