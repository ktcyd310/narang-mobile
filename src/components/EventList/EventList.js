import PropTypes from "prop-types";
import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { ReactSVG } from "react-svg";

import { getProducts, getDiscountPrice } from "../../helpers/product";
import { getEventLists } from "../../helpers/eventList";

import commaNumber from "../../utils/commaNumber"

const EventList = ({ eventList, wishlistItems, addToWishlist }) => {

  return (
    <div className="featured-product-area space-mb--25">
      <div className="container">
        <div className="row">
          <div className="col-12">
            {/* section title */}
            <h2 className="section-title space-mb--20">
              {eventList[0].EVENT_NAME} {" "}
              <Link to={process.env.PUBLIC_URL + "/shop"}>
                전체보기{" "}
                <span>
                  <ReactSVG
                    src={
                      process.env.PUBLIC_URL +
                      "/assets/img/icons/arrow-right.svg"
                    }
                  />
                </span>
              </Link>
            </h2>
            {/* featured products */}
            <div className="featured-product-wrapper space-mb-m--15">
              <div className="row row-5">
                {eventList &&
                  eventList.map((single) => {

                    let logo = ''

                    if(single.CARRIER_OMD_CODE ==='SKT'){
                      logo = 'icon_skt.png'
                    }else if(single.CARRIER_OMD_CODE === 'KT'){
                      logo = 'icon_kt.png'
                    }else if(single.CARRIER_OMD_CODE === 'LGU'){
                      logo = 'icon_lgu.png'
                    }

                    return (
                      <div className="col-6" key={single.id}>
                        <div className="featured-product space-mb--15">
                          <div className="featured-product__badge">
                            <img
                                src={process.env.PUBLIC_URL + `/assets/img/icons/${logo}`}
                                className="img-fluid"
                                alt=""
                            />
                          </div>
                          <Link
                              to={
                                process.env.PUBLIC_URL + `/product/${single.id}`
                              }
                          >
                            <div className="featured-product__image">
                                <img
                                  src={process.env.REACT_APP_S3_URL + `${single.IMAGE_URL}`}
                                  className="img-fluid"
                                  alt=""
                                />
                            </div>
                            <div className="featured-product__content">
                              <div className="productGroupName">
                                  <span className="discounted-price">{`${single.PRODUCT_GROUP_NAME}`}</span>
                              </div>
                              <div className="subscriptionName">
                                <span className="discounted-price">{`${single.SUBSCRIPTION_NAME}`}</span>
                              </div>
                              <div className="monthlyFee">
                                <span className="discounted-price">{`월 ${commaNumber(single.MONTHLY_FEE)}원`}</span>
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

EventList.propTypes = {
  addToWishlist: PropTypes.func,
  products: PropTypes.array,
  wishlistItems: PropTypes.array,
  eventList: PropTypes.array
};
const mapStateToProps = (state, ownProps) => {
  return {
    eventList: getEventLists(
        state.eventListData.eventList,
        ownProps.limit,
        ownProps.eventCategory
    ),
    products: getProducts(
      state.productData.products,
      ownProps.limit,
      ownProps.type
    ),
    wishlistItems: state.wishlistData
  };
};

const mapDispatchToProps = (dispatch) => {
  return {

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EventList);
