import { HttpParams } from '@angular/common/http';

export interface IId {
    id: Id;
}

export type Id = (string | number);

export type Primitive = string | boolean | number | null | undefined;

export type QueryParams = HttpParams | { [param: string]: Primitive | Primitive[]; };

export interface EntityCollectionConfig {
    root: string;
}

export const ENTITY_COLLECTION_CONFIG_DEFAULT: EntityCollectionConfig = {
    root: '',
};
