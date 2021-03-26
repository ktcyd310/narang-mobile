import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { save, load } from "redux-localstorage-simple";
import { Provider } from "react-redux";
import { fetchProducts } from "./redux/actions/productActions";
import { fetchEventList } from "./redux/actions/eventListActions";
import { fetchOemProductList, fetchOemSortedProductList } from "./redux/actions/oemProductListActions"
import { fetchsortingList } from "./redux/actions/sortingListActions"
import { fetchListFilter } from "./redux/actions/filterListActions";


import rootReducer from "./redux/reducers/rootReducer";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { composeWithDevTools } from "redux-devtools-extension";
import axios from "axios";
import "./env.js"
import {fetchFilter} from "./redux/actions/filterActions";

const store = createStore(
  rootReducer,
  load(),
  composeWithDevTools(applyMiddleware(thunk, save()))
);

// get product data from other source and set it to redux central state
axios
  .get(process.env.PUBLIC_URL + "/data/product.json")
  .then(response => store.dispatch(fetchProducts(response.data)))
  .catch(error => console.log(error));

axios
    .get(process.env.REACT_APP_API_URL + "/home")
    .then(response => store.dispatch(fetchEventList(response.data)))
    .catch(error => console.log(error));

axios
    .get(process.env.PUBLIC_URL + "/data/oemProductList.json")
    .then(response => store.dispatch(fetchOemProductList(response.data)))
    .catch(error => console.log(error));

axios
    .get(process.env.PUBLIC_URL + "/data/sortingList.json")
    .then(response => store.dispatch(fetchsortingList(response.data)))
    .catch(error => console.log(error));

axios
    .get(process.env.PUBLIC_URL + "/data/filter.json")
    .then(response => store.dispatch(fetchFilter(response.data)))
    .catch(error => console.log(error));

axios
    .get(process.env.PUBLIC_URL + "/data/filterList.json")
    .then(response => store.dispatch(fetchListFilter(response.data)))
    .catch(error => console.log(error));



ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

