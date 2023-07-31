import * as _ from 'lodash';

export type Interpolate = string;

export function interpolate(text: Interpolate, interpolateParams: object): string {
    return _.template(text, { interpolate: /{{([\s\S]+?)}}/g })(interpolateParams);
}
