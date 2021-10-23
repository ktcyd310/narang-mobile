import axios from "axios";

export const FETCH_OMD_PRODUCT_LIST_SUCCESS = "FETCH_OMD_PRODUCT_LIST_SUCCESS";
export const FETCH_OMD_SORTED_PRODUCT_LIST_SUCCESS = "FETCH_OMD_SORTED_PRODUCT_LIST_SUCCESS"

const fetchOmdProductListSuccess = omdProductList => ({
    type: FETCH_OMD_PRODUCT_LIST_SUCCESS,
    payload: omdProductList
});

// fetch products
export const fetchOmdProductList = omdProductList => {
    return dispatch => {
        dispatch(fetchOmdProductListSuccess(omdProductList));
    };
};

const fetchOmdSortedProductListSuccess = (omdSortedProductList) => ({
    type: FETCH_OMD_PRODUCT_LIST_SUCCESS,
    payload: omdSortedProductList
});

// fetch products
export const getFilteredProductListDispatch = (filter) => {

    const parameter = {
        ...filter,
        //sorting_field: sortingField,
        //sorting_way: sortingWay,
        search_tag: ''
    }

    return async dispatch => {

        try{
            const omdSortedProductList = await axios.get( process.env.REACT_APP_API_DEV_URL + "/product/list", {params: parameter} )
            return dispatch(fetchOmdSortedProductListSuccess(omdSortedProductList.data));
        }catch (error){
            console.log(error)
        }
    };
};