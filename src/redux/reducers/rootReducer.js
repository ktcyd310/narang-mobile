import productReducer from "./productReducer";
//import eventListReducer from "./eventListReducer";
import { combineReducers } from "redux";
import oemProductListReducer from "./oemProductListReducer";
import sortingListReducer from "./sortingListReducer";
import filterReducer from "./filterReducer";
import filterListReducer from "./filterListReducer";
import detailParamReducer from "./detailParamReducer";

const rootReducer = combineReducers({
  productData: productReducer,
//  eventListData: eventListReducer,
  oemProductListData: oemProductListReducer,
  sortingListData: sortingListReducer,
  filterData: filterReducer,
  filterList: filterListReducer,
  detailParamData: detailParamReducer
});

export default rootReducer;
