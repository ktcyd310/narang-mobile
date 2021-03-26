export const FETCH_FILTER_LIST_SUCCESS = "FETCH_FILTER_LIST_SUCCESS";

const fetchFilterListSuccess = filter => ({
    type: FETCH_FILTER_LIST_SUCCESS,
    payload: filter
});

// fetch products
export const fetchListFilter = filter => {
    return dispatch => {
        dispatch(fetchFilterListSuccess(filter));
    };
};
