import productReducer from "./productReducer";
import wishlistReducer from "./wishlistReducer";
import cartReducer from "./cartReducer";
import eventListReducer from "./eventListReducer";
import { combineReducers } from "redux";
import oemProductListReducer from "./oemProductListReducer";
import sortingListReducer from "./sortingListReducer";
import filterReducer from "./filterReducer";

const rootReducer = combineReducers({
  productData: productReducer,
  wishlistData: wishlistReducer,
  cartData: cartReducer,
  eventListData: eventListReducer,
  oemProductListData: oemProductListReducer,
  sortingListData: sortingListReducer,
  filterData: filterReducer
});

export default rootReducer;
