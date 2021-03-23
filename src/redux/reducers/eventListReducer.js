import { FETCH_EVENT_LIST_SUCCESS } from "../actions/eventListActions";
const initState = {};

const eventListReducer = (state = initState, action) => {
    if (action.type === FETCH_EVENT_LIST_SUCCESS) {
        return {
            ...state,
            eventList: action.payload
        };
    }
    return state;
};

export default eventListReducer;
