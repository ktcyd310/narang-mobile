import PropTypes from "prop-types";
import React, { Fragment, Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { ReactSVG } from "react-svg";

import { getDiscountPrice } from "../../helpers/product";
import {getOemProductLists } from "../../helpers/oemProductList"
import { getsortingLists } from "../../helpers/sortingList"
import { getFilteredProductListDispatch } from "../../redux/actions/oemProductListActions"

import { addToWishlistDispatch } from "../../redux/actions/wishlistActions";
import commaNumber from "../../utils/commaNumber"
import {Dropdown, DropdownButton, ButtonGroup} from "react-bootstrap";
import {getFilter} from "../../helpers/filter";
import {changeFilterDataDispatch} from "../../redux/actions/filterActions";
//import Dropdown from 'react-overlays/Dropdown';


class ShopProducts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gridActivate: false,
      listActivate: true,
      planType: 'SUPPORT'
    };
  }

  // Filter 로딩 후 데이터 재로딩을 위함
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.filter != this.props.filter){
      this.props.getFilteredProductList(this.props.filter)
    }
  }



  render() {
    const { oemProductList, sortingList, getFilteredProductList, filter , setSortingFilter} = this.props;
    const { listActivate } = this.state;
    return (
      <div className="shop-products-area">
        {/* shop layout switcher */}
        <div className="shop-layout-switcher text-right space-mt--15 space-mb--15">
          <div className="container">
            <div className="dropdown-container">
              <DropdownButton
                      className="btn-primary"
                      size="sm"
//                      variant="secondary"
                      title="정렬"
                  >
                    {
                      sortingList && sortingList.map(single => {

                        return(
                            <Dropdown.Item onClick={() => {
                              setSortingFilter(single.CODE_VALUE2, single.CODE_VALUE3, filter)

                            }
                            } >{single.CODE_VALUE1}</Dropdown.Item>
                        )
                      })
                    }
              </DropdownButton>
              <div className="list-count">
                총 4개
              </div>
            </div>
          </div>
        </div>

        {/* shop list products */}
        <div
          className={`shop-list-products-wrapper ${
            listActivate ? "d-block" : "d-none"
          }`}
        >
          {oemProductList &&
          oemProductList.map(single => {

              const sktMonthlyFee = single.SKT_MONTHLY_FEE? `${commaNumber(single.SKT_MONTHLY_FEE)}원`: `결과없음`;
              const ktMonthlyFee = single.KT_MONTHLY_FEE? `${commaNumber(single.KT_MONTHLY_FEE)}원` : `결과없음`;
              const lguMonthlyFee = single.LGU_MONTHLY_FEE? `${commaNumber(single.LGU_MONTHLY_FEE)}원` : `결과없음`;

            return (

                  <div className="container">
                    <div
                      className="list-product"
                      key={single.id}
                    >

                      {/*<Link to={process.env.PUBLIC_URL + `/product/${single.id}`}>*/}
                        <div className="list-product__image">
                          <img
                              src={process.env.REACT_APP_S3_URL + `${single.IMAGE_URL}`}
                              className="img-fluid"
                              alt=""
                          />
                        </div>
                      {/*</Link>*/}

                      <div className="list-product__content">
                        <h3 className="title">
                          <Link
                            to={process.env.PUBLIC_URL + `/product/${single.PRODUCT_GROUP_ID}`}
                          >
                            {single.PRODUCT_GROUP_NAME}
                          </Link>
                        </h3>
                        <h5 className="description">
                          월 납부금 (24개월 할부)
                        </h5>
                        <div className="category">
                          <div className="price">
                            <img
                                src={process.env.PUBLIC_URL + `/assets/img/icons/icon_skt.png`}
                                className="img"
                                alt=""
                            />
                            <span className="text">{`${sktMonthlyFee}`}</span>
                          </div>
                          <div className="price">
                          <img
                              src={process.env.PUBLIC_URL + `/assets/img/icons/icon_kt.png`}
                              className="img"
                              alt=""
                          />
                          <span className="text">{`${ktMonthlyFee}`}</span>
                          </div>
                          <div className="price">
                          <img
                              src={process.env.PUBLIC_URL + `/assets/img/icons/icon_lgu.png`}
                              className="img"
                              alt=""
                          />
                          <span className="text">{`${lguMonthlyFee}`}</span>
                          </div>
                        </div>
                        <p>{single.shortDescription}</p>
                      </div>
                    </div>
                  </div>
              );
            })}
        </div>
      </div>
    );
  }
}

ShopProducts.propTypes = {
  addToWishlist: PropTypes.func,
  products: PropTypes.array,
  wishlistItems: PropTypes.array,
  oemProductList: PropTypes.array,
  sortingList: PropTypes.array,
  filter: PropTypes.string
};

const mapStateToProps = state => {
  return {
    wishlistItems: state.wishlistData,
    oemProductList: getOemProductLists(
        state.oemProductListData.oemProductList.list
    ),
    sortingList: getsortingLists(
        state.sortingListData.sortingList,
        state.filterData.filter.plan_type
    ),
    filter: getFilter(
        state.filterData.filter
    )
  };
};

const mapDispatchToProps = dispatch => {
  return {

    setSortingFilter: (value1, value2, filter) => {

      let data = {
        sorting_field: value1,
        sorting_way: value2
      }

      dispatch(changeFilterDataDispatch('sorting', data));
    },
    getFilteredProductList: (filter) => {
      dispatch(getFilteredProductListDispatch(filter,));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ShopProducts);
