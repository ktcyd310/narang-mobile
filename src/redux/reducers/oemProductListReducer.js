import { FETCH_OEM_PRODUCT_LIST_SUCCESS } from "../actions/oemProductListActions";


const initState = {};

const productReducer = (state = initState, action) => {
    if (action.type === FETCH_OEM_PRODUCT_LIST_SUCCESS) {
        return {
            ...state,
            oemProductList: action.payload
        };
    }
    return state;
};

export default productReducer;
