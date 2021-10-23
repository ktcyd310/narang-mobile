import React, { Component } from "react";
import { OmdProductList } from "../../components";
import PropTypes from "prop-types";
import { connect } from "react-redux";

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

    return (
          <div className="d-flex justify-content-center">
            <div className="col-md-8 col-lg-5">
              <div className="omd-list-container-wrap">
                {/* CarrierProductList */}
                <div style={{textAlign:"center", backgroundColor:"#F9F9F9", fontSize:"small"}}>
                  <span>나랑살래에서 </span>
                  <span style={{color:"#0F4C81", fontWeight:"bold"}}>온라인 커머스 비교</span>
                  <span>를 통해 찾은 최저가 입니다.✋</span>
                  <br></br>
                </div>
                <OmdProductList/>
              </div>
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
    filterList: state.filterList.filter
  };
};


const mapDispatchToProps = dispatch => {
  return {

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OmdList);
