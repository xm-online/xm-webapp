import {StateSpec, NextSpec} from '../../xm-entity/shared/state-spec.model.js';

export const findSpecByStateKey  = (states: StateSpec[] = [], stateKey: string = ''): undefined | StateSpec => {
    return states.find(item => item.key === stateKey)
};
