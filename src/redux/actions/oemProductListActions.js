export const FETCH_OEM_PRODUCT_LIST_SUCCESS = "FETCH_OEM_PRODUCT_LIST_SUCCESS";
export const FETCH_OEM_SORTED_PRODUCT_LIST_SUCCESS = "FETCH_OEM_SORTED_PRODUCT_LIST_SUCCESS"

const fetchOemProductListSuccess = oemProductList => ({
    type: FETCH_OEM_PRODUCT_LIST_SUCCESS,
    payload: oemProductList
});

// fetch products
export const fetchOemProductList = oemProductList => {
    return dispatch => {
        dispatch(fetchOemProductListSuccess(oemProductList));
    };
};

const fetchOemSortedProductListSuccess = oemProductList => ({
    type: FETCH_OEM_SORTED_PRODUCT_LIST_SUCCESS,
    payload: oemProductList
});

// fetch products
export const fetchOemSortedProductList = oemProductList => {
    return dispatch => {
        dispatch(fetchOemSortedProductListSuccess(oemProductList));
    };
};