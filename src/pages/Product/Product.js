import React, { Fragment, Component } from "react";
import { connect } from "react-redux";
import Swiper from "react-id-swiper";
import { ReactSVG } from "react-svg";
import { Rating } from "../../components";

import {
  getDiscountPrice,
  getProductCartQuantity, productFilterButton, planTypeButton
} from "../../helpers/product";
import { addToCartDispatch } from "../../redux/actions/cartActions";
import { addToWishlistDispatch } from "../../redux/actions/wishlistActions";
import {Chip} from "@material-ui/core";
import {Dropdown, DropdownButton} from "react-bootstrap";
import PropTypes from "prop-types";
import axios from "axios";
import ReactLoading from 'react-loading'
import SubscriptionPopup from "../../components/Popup/SubscriptionPopup";
import Popup from 'reactjs-popup';


class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      childProductList : '',
      param: props.location.param,
      isLoading: true
    };
  }

  componentDidMount() {
    this.getChildProductData();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.checkData()
    //TODO : 팝업 노출

  }

  //await axios.get( process.env.REACT_APP_API_URL + "/product/list", {params: parameter} )

  checkData() {
    if(!this.state.data){
      this.props.history.goBack();
    }
  }

  getChildProductData() {
    axios
        .get(process.env.REACT_APP_API_URL + "/product/detail", {params: this.state.param})

        .then(response =>
            this.setState({ data: response.data, isLoading: false })
        )
        .catch(error =>
            this.setState({ errorMessage: error.message, isLoading: false })
        );
  }

  render() {
    const {
      product,
      cartItems,
      wishlistItems,
      filterList,
    } = this.props;
    const { selectedProductColor, data } = this.state;
    const params = {
      loop: true,
      speed: 1000,
      watchSlidesVisibility: true,
      pagination: {
        el: ".swiper-pagination",
        clickable: true
      }
    };
    const wishlistItem = wishlistItems.filter(
      wishlistItem => wishlistItem.id === product.id
    )[0];

    const productCartQty = getProductCartQuantity(
      cartItems,
      product,
      selectedProductColor
    );


    let colorList = ''

    // 선택되는 탭에 따라 보여지는 리스트가 달라짐
    let childList = ''

    if(data){
      colorList = data.product_info[0].COLOR_LIST.split(', ')

      if(this.state.param.plan_type == 'SUPPORT'){
        childList = data.child_product_list.filter(e => e.TAB == "SUPPORT_POLICY");
      }else{
        childList = data.child_product_list.filter(e => e.TAB == "CONTRACT");
      }

    childList = childList.filter(e => e.INSTALLMENT_TERM == this.state.param.installment_term);

    }else{
      return (

          <div className="loading-container">
            <ReactLoading type = {"spinningBubbles"} color={"#517892"} height={"30%"} width={"30%"}/>
          </div>
      )
    }

    return (
      <div className="body-wrapper space-pt--70 space-pb--120">
        <div className="detail-img-container">
          <img
              src={process.env.REACT_APP_S3_URL + `${data.product_info[0].IMAGE_URL}`}
              className="img-fluid"
              alt=""
          />
        </div>
        {/*====================  product content ====================*/}
        {/* product content header */}
        <div className="product-content-header-area border-bottom--thick space-pb--22">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="product-content-header">
                  <div className="product-content-header__main-info">
                    <h3 className="title">{data.product_info[0].PRODUCT_GROUP_NAME}</h3>
                  </div>
                  {/*<div className="product-content-header__wishlist-info text-center">*/}
                  {/*  <ReactSVG*/}
                  {/*    src={*/}
                  {/*      process.env.PUBLIC_URL +*/}
                  {/*      "/assets/img/icons/heart-dark.svg"*/}
                  {/*    }*/}
                  {/*  />*/}
                  {/*  <span className="count">{product.wishlistCount}</span>*/}
                  {/*</div>*/}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="product-color-picker border-bottom--thick space-pt--25 space-pb--22">
          <div className="container">
            <div className="temp">
              색상
            </div>
              <ul className="color-picker" >
                {colorList.map((el, key) => {

                  el = "#"+el

                  return (
                      <li key={key}>
                        <Chip className={el} htmlFor={el} style={{backgroundColor: el}} />
                      </li>
                  );
                })}
              </ul>
          </div>
        </div>

        {/*====할부 방법====*/}
        <div className="product-color-picker border-bottom--thick space-pt--25 space-pb--22">
          <div className="container">
            <div className="temp">
              할부 방법
            </div>
            <DropdownButton
                id = "product-filter-button"
                className="dropdown-button"
                size="sm"
                drop='down'
                //                      variat="secondary"
                title={'24개월 할부'}
            >

              {
                filterList['installment_term_list'] && filterList['installment_term_list'].map(single => {

                  return(
                      <Dropdown.Item id = "dropdown-item" className="dropdown-item" onClick={(en) => {
                        console.log(single.CODE_VALUE2)
                        // 드롭다운 타이틀 바꾸는 부분
                        productFilterButton(en, single.CODE_VALUE1);

                        //리스트 재조회를 위한 Action
                        //설정된 필터의 요금제 값을 바꾸는 부분
                        // key : company_code_list or plan_type_list
                        //changeFilter('installment_term_list', single.CODE_VALUE2);
                        this.setState({
                          param: {
                            ...this.state.param,
                            installment_term : single.CODE_VALUE2
                          }
                        })

                      }
                      }>
                        {single.CODE_VALUE1}
                      </Dropdown.Item>
                  )
                })
              }
            </DropdownButton>
          </div>
        </div>

        {/*====공시 선약====*/}
        <div className="product-color-picker space-pt--22 space-pb--22">
          <div className="shop-product-button">
            <button
                className={this.state.param.plan_type === 'SUPPORT' ? 'tab active' : 'tab'}
                id="plan-type-tab"
                onClick={(e) => {
                  planTypeButton(e)
                  e.currentTarget.classList.toggle("active")
                  this.setState({
                    param: {
                      ...this.state.param,
                      plan_type : 'SUPPORT'
                    }
                  })
                }
                }
            >
              공시지원
            </button>
            <button
                className={this.state.param.plan_type === 'CONTRACT' ? 'tab active' : 'tab'}
                id="plan-type-tab"
                onClick={(e) => {
                  planTypeButton(e)
                  e.currentTarget.classList.toggle("active")
                  this.setState({
                    param: {
                      ...this.state.param,
                      plan_type : 'CONTRACT'
                    }
                  })
                }
                }
            >
              선택약정
            </button>
          </div>
        </div>


        {/*===공시 요금제 및 금액 노출===*/}
        {
          childList?(
                  childList.map(single => {

                    let icon = ''
                    switch(single.CARRIER_OMD_CODE){
                      case 'SKT' :
                        icon = 'icon_skt.png';
                        break;
                      case 'LGU' :
                        icon = 'icon_kt.png';
                        break;
                      case 'KT' :
                        icon = 'icon_lgu.png';
                        break;
                    }

              return (
                  <div className="product-detail-container">
                    <div className="container-lg">
                      <div className="col">
                        <div className="detail-img-container">
                          <img
                              src={process.env.PUBLIC_URL + `/assets/img/icons/${icon}`}
                              className="img-thumbnail"
                              alt=""
                          />
                        </div>
                        <div className="button-container">
                          <Popup trigger={
                            <button className="subscription-button">
                              <div className="d-flex justify-content-around">
                                <div>
                                  {single.SUBSCRIPTION_NAME}
                                </div>
                                  <div className="row">
                                    {single.SUBSCRIPTION_MONTHLY_FEE + "원 "}
                                    <ReactSVG
                                        className="arrow-down"
                                        src={process.env.PUBLIC_URL + "/assets/img/icons/arrow_down.svg"}
                                    />
                                </div>
                              </div>
                            </button>}
                                 modal
                                   nested>
                            {close => (
                                <div className="container">
                                  <div className="modal-dialog">
                                    <div className="modal-content">
                                      <div className="modal-header">
                                        <h7 className="modal-title">요금제를 선택하세요</h7>
                                        <button type="button" className="close" data-dismiss="modal" onClick={close}>×</button>
                                      </div>

                                      <SubscriptionPopup param={{network_type_code: single.NW_TYPE_CODE, carrier_omd_code: single.CARRIER_OMD_CODE}}>

                                      </SubscriptionPopup>

                                    </div>
                                  </div>
                                </div>
                          )}


                          </Popup>
                        </div>
                        <div className="icon-container">
                          <ReactSVG
                              className="icon"
                              fill="#FFFFFF"
                              src={process.env.PUBLIC_URL + "/assets/img/icons/plus-symbol-button.svg"}
                          />
                        </div>
                        <div className="button-container">
                          <button className="subscription-button">
                            <div className="d-flex justify-content-around">
                              <div>
                                월 기기 납부금
                              </div>
                              <div className="row">
                                {single.DEVICE_MONTHLY_FEE + "원 "}
                              </div>
                            </div>
                          </button>
                        </div>
                        <div className="icon-container">
                          <ReactSVG
                              className="icon"
                              src={process.env.PUBLIC_URL + "/assets/img/icons/equal.svg"}
                          />
                        </div>
                        <div className="button-container">
                          <button className="subscription-button">
                            <div className="d-flex justify-content-around">
                              <div className="row">
                                {"총 납부액"}
                                <span style={{paddingLeft:"10px"}}>{single.MONTHLY_FEE + "원 "}</span>
                              </div>
                              <div className="row">
                                <span style={{color:"#0F4C81"}}>{"견적서 보기"}</span>
                                <ReactSVG
                                    className="arrow-down"
                                    src={process.env.PUBLIC_URL + "/assets/img/icons/icon-right-arrow.svg"}
                                />
                              </div>
                            </div>
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
              )
            })
          ):
              (
                  <div>
                    Not Found
                  </div>
              )
        }

        {/*====================  End of product content  ====================*/}
      </div>
    );
  }
}

const label = (el) => {
  return (
      <label className={el} htmlFor={el} />
  )
}


Product.propTypes = {
  addToWishlist: PropTypes.func,
  products: PropTypes.array,
  wishlistItems: PropTypes.array,
  oemProductList: PropTypes.array,
  sortingList: PropTypes.array,
  filter: PropTypes.string,
  state: PropTypes.array
};


const mapStateToProps = (state, ownProps) => {
  const itemId = ownProps.match.params.id;
  return {
    product:
      state.productData.products,
    wishlistItems: state.wishlistData,
    cartItems: state.cartData,
    filterList: state.filterList.filter
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addToCart: (item, quantityCount, selectedProductColor) => {
      dispatch(addToCartDispatch(item, quantityCount, selectedProductColor));
    },
    addToWishlist: item => {
      dispatch(addToWishlistDispatch(item));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Product);
