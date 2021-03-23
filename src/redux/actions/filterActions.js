export const FETCH_FILTER_SUCCESS = "FETCH_FILTER_SUCCESS";

const fetchFilterSuccess = filter => ({
    type: FETCH_FILTER_SUCCESS,
    payload: filter
});

// fetch products
export const fetchFilter = filter => {
    return dispatch => {
        dispatch(fetchFilterSuccess(filter));
    };
};
