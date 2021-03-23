import { FETCH_SORTING_LIST_SUCCESS } from "../actions/sortingListActions";

const initState = {};

const sortingListReducer = (state = initState, action) => {
    if (action.type === FETCH_SORTING_LIST_SUCCESS) {
        return {
            ...state,
            sortingList: action.payload
        };
    }
    return state;
};

export default sortingListReducer;
