import { FETCH_OMD_PRODUCT_LIST_SUCCESS } from "../actions/omdProductListActions";


const initState = {};

const omdProductListReducer = (state = initState, action) => {
    if (action.type === FETCH_OMD_PRODUCT_LIST_SUCCESS) {
        return {
            ...state,
            omdProductList: action.payload
        };
    }
    return state;
};

export default omdProductListReducer;
