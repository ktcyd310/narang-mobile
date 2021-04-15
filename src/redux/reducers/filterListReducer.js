import { FETCH_FILTER_LIST_SUCCESS } from "../actions/filterListActions";

const initState = {};

const filterListReducer = (state = initState, action) => {
    if (action.type === FETCH_FILTER_LIST_SUCCESS) {
        return {
            ...state,
            filter: action.payload
        };
    }
    return state;
};

export default filterListReducer;
