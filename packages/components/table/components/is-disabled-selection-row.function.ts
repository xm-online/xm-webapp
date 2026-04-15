import {ConditionDirective} from '@xm-ngx/components/condition';

export function isDisabledSelectionRowFunction<T>(row: T, disabledCondition?: string): boolean {
    return row && disabledCondition ? ConditionDirective.checkCondition(disabledCondition, {row}): false;
}
