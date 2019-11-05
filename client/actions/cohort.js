import {
    COHORT_REQUEST_LIST,
    COHORT_REQUEST_LIST_ERROR,
    COHORT_REQUEST_LIST_SUCCESS
} from './types';

export const cohortRequestList = params => async dispatch => {
    dispatch({ type: COHORT_REQUEST_LIST, params });
    try {
        const res = await fetch('/api/cohort/');
        const { cohorts, error } = await res.json();
        if (error) {
            throw error;
        }
        dispatch({ type: COHORT_REQUEST_LIST_SUCCESS, cohorts });
    } catch (error) {
        const { message, status, stack } = error;
        dispatch({ type: COHORT_REQUEST_LIST_ERROR, status, message, stack });
    }
};
