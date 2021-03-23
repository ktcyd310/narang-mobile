export const FETCH_EVENT_LIST_SUCCESS = "FETCH_EVENT_LIST_SUCCESS";

const fetchEventListSuccess = events => ({
    type: FETCH_EVENT_LIST_SUCCESS,
    payload: events
});

// fetch products
export const fetchEventList = events => {
    return dispatch => {
        dispatch(fetchEventListSuccess(events));
    };
};
