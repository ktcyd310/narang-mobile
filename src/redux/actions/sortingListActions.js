export const FETCH_SORTING_LIST_SUCCESS = "FETCH_SORTING_LIST_SUCCESS";
export const SET_SORTING = "SET_SORTING";

const fetchsortingListSuccess = sortingList => ({
    type: FETCH_SORTING_LIST_SUCCESS,
    payload: sortingList
});

// fetch products
export const fetchsortingList = sortingList => {
    return dispatch => {
        dispatch(fetchsortingListSuccess(sortingList));
    };
};

export const setSortingDispatch = (value1, value2) => {
    return dispatch => {
        dispatch({ type: SET_SORTING, payload: {

            }  });
    };
};
