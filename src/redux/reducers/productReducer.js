import { FETCH_PRODUCTS_SUCCESS } from "../actions/productActions";
import { SET_SORTING } from "../actions/sortingListActions";

const initState = {};

const productReducer = (state = initState, action) => {
  if (action.type === FETCH_PRODUCTS_SUCCESS) {
    return {
      ...state,
      products: action.payload
    };
  }
  return state;
};

export default productReducer;
