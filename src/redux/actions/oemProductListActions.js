import axios from "axios";
import {fetchFilter} from "./filterActions";
import {fetchProducts} from "./productActions";

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

const fetchOemSortedProductListSuccess = (oemSortedProductList) => ({
    type: FETCH_OEM_PRODUCT_LIST_SUCCESS,
    payload: oemSortedProductList
});

// fetch products
export const getFilteredProductListDispatch = (filter, sortingField, sortingWay) => {

    const parameter = {
        company_code: 'SAMSUNG,LG,APPLE,ETC',
        factory_price_min: 100000,
        factory_price_max: 2500000,
        subscription_group_id: 1,
        plan_type: 'SUPPORT',
        sorting_field: sortingField,
        sorting_way: sortingWay,
        search_tag: ''
    }

    //let url = 'http://localhost:3001/api/v1'

    // axios
    //     .get( process.env.REACT_APP_API_URL + "/product/list", {params: parameter} )
    //     .then(response => dispatch => dispatch(fetchProducts(response.data)))
    //     .catch(error => console.log(error));

    return async dispatch => {

        try{
            const oemSortedProductList = await axios.get( process.env.REACT_APP_API_URL + "/product/list", {params: parameter} )
            return dispatch(fetchOemSortedProductListSuccess(oemSortedProductList.data));
        }catch (error){
            console.log(error)
        }
    };
};