import { FETCH_FILTER_SUCCESS } from "../actions/filterActions";
const initState = {};

const filterReducer = (state = initState, action) => {
    if (action.type === FETCH_FILTER_SUCCESS) {
        return {
            ...state,
            filter: action.payload
        };
    }
    return state;
};

export default filterReducer;
