
export const FETCH_FILTER_SUCCESS = "FETCH_FILTER_SUCCESS";
export const FETCH_FILTER_CHANGE = "FETCH_FILTER_CHANGE";

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

export const changeFilterDataDispatch = (filterType, data) => {

    let param = {
        /*
            sorting : 정렬을 위한 필터

         */
        filterType: filterType,
        data: data
    }

    return dispatch => {
        dispatch({ type: FETCH_FILTER_CHANGE, payload: param });
    };
}

