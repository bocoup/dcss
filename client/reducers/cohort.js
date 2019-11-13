import { combineReducers } from 'redux';

import {
    COHORT_REQUEST_LIST,
    COHORT_REQUEST_LIST_ERROR,
    COHORT_REQUEST_LIST_SUCCESS
} from '../actions/types';

const defaultState = {
    index: {},
    indexOrder: [],
    indexRequest: {
        lastRequest: 0,
        lastResponse: 0,
        status: 'init'
    }
};

const index = (state = defaultState.index, action) => {
    const { type, cohorts } = action;

    if (type === COHORT_REQUEST_LIST_SUCCESS) {
        const newState = { ...state };
        for (const cohort of cohorts) {
            newState[cohort.id] = cohort;
        }
        return newState;
    }
    return state;
};

const indexOrder = (state = defaultState.indexOrder, action) => {
    const { type, cohorts } = action;

    if (type === COHORT_REQUEST_LIST_SUCCESS) {
        return cohorts.map(({ id }) => id);
    }
    return state;
};

export const selectCohortIds = state => state.cohort.indexOrder;

const indexRequest = (state = defaultState.indexRequest, action) => {
    const { type } = action;
    if (type === COHORT_REQUEST_LIST_SUCCESS) {
        return {
            ...state,
            status: 'success',
            lastResponse: new Date().getTime(),
            error: undefined
        };
    }

    if (type === COHORT_REQUEST_LIST_ERROR) {
        const { status, message, stack } = action;
        return {
            ...state,
            status: 'error',
            lastResponse: new Date().getTime(),
            error: { status, message, stack }
        };
    }

    if (type === COHORT_REQUEST_LIST) {
        return {
            ...state,
            status: 'requesting',
            lastRequest: new Date().getTime(),
            error: undefined
        };
    }
    return state;
};

export const selectIndexRequest = state => state.cohort.indexRequest;

export default combineReducers({ index, indexRequest, indexOrder });
