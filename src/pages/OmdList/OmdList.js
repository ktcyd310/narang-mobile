import React, { Component } from "react";
import { connect } from "react-redux";
import { OmdProductList } from "../../components";
import {
  toggleShopTopFilter,
  toggleSubscriptionFilter,
  subscriptionFilterButton,
  productFilterButton
} from "../../helpers/product";
import {Dropdown, DropdownButton} from "react-bootstrap";
import {ReactSVG} from "react-svg";
import {getFilteredProductListDispatch} from "../../redux/actions/oemProductListActions";
import { changeFilterDataDispatch } from "../../redux/actions/filterActions";
import PropTypes from "prop-types";
import {getFilter} from "../../helpers/filter";

class OmdList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortType: "",
      sortValue: "",
      filteredProducts: props.products
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.filter !== this.props.filter){
      this.props.getFilteredProductList(this.props.filter)
    }
  }


  render() {
    const { filterList, changeFilter } = this.props;
    const { filteredProducts } = this.state;

    return (
      <div className="body-wrapper space-pt--60 space-pb--120">
        {/*<div style={{textAlign:"center", backgroundColor:"#F9F9F9", fontSize:"small"}}>*/}
        {/*  <span>아래 정보는 </span>*/}
        {/*  <span style={{color:"#0F4C81", fontWeight:"bold"}}>통신 3사 공식 홈페이지 정가 </span>*/}
        {/*  <span>입니다.</span>*/}
        {/*  <br></br>*/}
        {/*  <span>휴대폰 정가 확인부터 견적서까지, 바로 확인하세요.</span>*/}
        {/*</div>*/}
        <div className="shop-header bg-color--white">
          {/*<div className="container space-y--15">*/}
          {/*  <div className="row align-items-center">*/}
          {/*    <div className="col">*/}
          {/*      <button*/}
          {/*          className="filter-trigger-button"*/}
          {/*          id="filter-trigger"*/}
          {/*          onClick={e => toggleSubscriptionFilter(e)}*/}
          {/*      >*/}
          {/*        <ReactSVG src="assets/img/icons/list.svg"/>*/}
          {/*        <div className="filter-text">요금제: </div>*/}
          {/*        <div className="filter-text" id = "filter-text">{defaultSubscription[0].SUBSCRIPTION_GROUP_NAME}</div>*/}
          {/*      </button>*/}
          {/*    </div>*/}
          {/*    <div className="col">*/}
          {/*      <button*/}
          {/*        className="filter-trigger-button"*/}
          {/*        id="filter-trigger"*/}
          {/*        onClick={e => toggleShopTopFilter(e)}*/}
          {/*      >*/}
          {/*        <ReactSVG src="assets/img/icons/filter.svg"/>*/}
          {/*        <div className="filter-text">필터</div>*/}
          {/*      </button>*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*</div>*/}

        {/* CarrierProductList */}
        <OmdProductList products={filteredProducts} />
        </div>
      </div>
    );
  }
}


OmdProductList.propTypes = {
  addToWishlist: PropTypes.func,
  products: PropTypes.array,
  wishlistItems: PropTypes.array,
  oemProductList: PropTypes.array,
  sortingList: PropTypes.array,
  filter: PropTypes.string,
  filterData: PropTypes.array
};


const mapStateToProps = state => {
  return {
    products: state.productData.products,
    wishlistItems: state.wishlistData,
    filterList: state.filterList.filter,
    filter: getFilter(
        state.filterData.filter
    )
  };
};


const mapDispatchToProps = dispatch => {
  return {
    changeFilter: (filterType, data) => {
      dispatch(changeFilterDataDispatch(filterType, data))
    },
    getFilteredProductList: (filter) => {
      dispatch(getFilteredProductListDispatch(filter,));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OmdList);
