import React, { Component } from "react";
import { connect } from "react-redux";
import { ReactSVG } from "react-svg";
import { Link } from "react-router-dom";
import {
    productFilterButton,
    planTypeButton
} from "../../helpers/product";
import {Dropdown, DropdownButton} from "react-bootstrap";
import PropTypes from "prop-types";
import axios from "axios";
import ReactLoading from 'react-loading'
import SubscriptionPopup from "../../components/Popup/SubscriptionPopup";
import Popup from 'reactjs-popup';
import {setDetailParam} from "../../redux/actions/detailParamActions";
import commaNumber from "../../utils/commaNumber";


class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      childProductList : '',
      param: props.location.param,
      isLoading: true,
        popupOn: false,
        popupTarget: ''
    };
  }

  componentDidMount() {
    this.getChildProductData();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.checkData()
    if(prevProps.detailParam !== this.props.detailParam){
        this.setState({popupOn:false})
        this.getChildProductData();

    }
  }

  checkData() {
    if(!this.state.data){
      this.props.history.goBack();
    }
  }

  getChildProductData() {
    axios
        .get(process.env.REACT_APP_API_URL + "/product/detail", {params: this.props.detailParam})

        .then(response =>
            this.setState({ data: response.data, isLoading: false })
        )
        .catch(error =>
            this.setState({ errorMessage: error.message, isLoading: false })
        );
  }

  toggleSubscriptionPopup (carrierOmdCode) {
      this.setState({
          popupTarget:carrierOmdCode,
          popupOn:true
      })
  }

  checkPopup (single) {
      if(this.state.popupOn){
          if(single.CARRIER_OMD_CODE === this.state.popupTarget){
              return true;
          }
      }
      return false;
  }

  render() {
    const {
      filterList,
      setDetailParam
    } = this.props;
    const { data } = this.state;

    // 선택되는 탭에 따라 보여지는 리스트가 달라짐
    let childList = ''

    if(data||this.state.isLoading!==true){
      // colorList = data.product_info[0].COLOR_LIST.split(', ')

      if(this.props.detailParam.plan_type === 'SUPPORT'){
        childList = data.child_product_list.filter(e => e.TAB === "SUPPORT_POLICY");
      }else{
        childList = data.child_product_list.filter(e => e.TAB === "CONTRACT");
      }

    childList = childList.filter(e => e.INSTALLMENT_TERM === this.props.detailParam.installment_term);

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
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*<div className="product-color-picker border-bottom--thick space-pt--25 space-pb--22">*/}
        {/*  <div className="container">*/}
        {/*    <div className="temp">*/}
        {/*      색상*/}
        {/*    </div>*/}
        {/*      <ul className="color-picker" >*/}
        {/*        {colorList.map((el, key) => {*/}

        {/*          el = "#"+el*/}

        {/*          return (*/}
        {/*              <li key={key}>*/}
        {/*                <Chip className={el} htmlFor={el} style={{backgroundColor: el}} />*/}
        {/*              </li>*/}
        {/*          );*/}
        {/*        })}*/}
        {/*      </ul>*/}
        {/*  </div>*/}
        {/*</div>*/}

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
                        setDetailParam({
                            ...this.props.detailParam,
                            installment_term : single.CODE_VALUE2
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
                className={this.props.detailParam.plan_type === 'SUPPORT' ? 'tab active' : 'tab'}
                id="plan-type-tab"
                onClick={(e) => {
                  planTypeButton(e)
                  e.currentTarget.classList.toggle("active")
                  setDetailParam({
                      ...this.props.detailParam,
                      plan_type : 'SUPPORT'
                  })
                }
                }
            >
              공시지원
            </button>
            <button
                className={this.props.detailParam.plan_type === 'CONTRACT' ? 'tab active' : 'tab'}
                id="plan-type-tab"
                onClick={(e) => {
                  planTypeButton(e)
                  e.currentTarget.classList.toggle("active")
                  setDetailParam({
                      ...this.props.detailParam,
                      plan_type : 'CONTRACT'
                  })
                }
                }
            >
              선택약정
            </button>
          </div>
        </div>


        {/*===공시 요금제 및 금액 노출===
        TODO : 자상품 없는 케이스 노출 처리*/}
        {
          childList?(
                  childList.map(single => {

                    let icon = ''
                    switch(single.CARRIER_OMD_CODE){

                        case 'SKT' :
                            icon = 'icon_skt.png';
                            break;

                        case 'KT' :
                            icon = 'icon_kt.png';
                            break;

                        case 'LGU' :
                            icon = 'icon_lgu.png';
                            break;

                        default :
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
                            <button className="subscription-button" style={{height:"100%"}} onClick={(en) =>
                            {
                                this.toggleSubscriptionPopup(single.CARRIER_OMD_CODE)
                            }
                            }>
                              <div className="d-flex justify-content-around">
                                <div>
                                    {single.SUBSCRIPTION_NAME}<br></br>
                                    <span style={{color:"#0F4C81" }}>월 데이터 {single.DATA_AMOUNT}</span>
                                </div>
                                  <div className="row" style={{alignItems:"center"}}>
                                    {commaNumber(single.SUBSCRIPTION_MONTHLY_FEE) + "원 "}
                                    <ReactSVG
                                        className="arrow-down"
                                        src={process.env.PUBLIC_URL + "/assets/img/icons/arrow_down.svg"}
                                    />
                                </div>
                              </div>
                            </button>

                            <Popup open={this.checkPopup(single)}
                                   closeOnEscape={true}
                                   closeOnDocumentClick={false}
                                   modal nested
                                   close={!this.state.popupOn}
                            >
                            {close => (
                                <div className="container">
                                  <div className="modal-dialog">
                                    <div className="modal-content">
                                      <div className="modal-header" style={{position:"sticky"}}>
                                          <h7 className="modal-title" style={{textAlign:"center", color:"#0F4C81", fontWeight:"bold", width:"100%"}}>요금제를 선택하세요</h7>
                                          <br></br>
                                          <h7 className="modal-title" style={{textAlign:"center", color:"#0F4C81", fontWeight:"bold", width:"100%"}}></h7>

                                          <button type="button" className="close" data-dismiss="modal" onClick={() => {this.setState({popupOn:false, popupTarget:''})}}>×</button>
                                      </div>
                                        <div className="container-lg" style={{overflowY:"scroll"}}>
                                            <div className="" style={{marginTop:7, textAlign:'center', width:"70vw"}}>

                                            </div>
                                              <SubscriptionPopup param={{network_type_code: single.NW_TYPE_CODE, carrier_omd_code: single.CARRIER_OMD_CODE}}>

                                              </SubscriptionPopup>
                                        </div>
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
                                {commaNumber(single.DEVICE_MONTHLY_FEE) + "원 "}
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
                                    <span style={{paddingLeft:"10px"}}>{commaNumber(single.MONTHLY_FEE) + "원 "}</span>
                                  </div>
                                  <div className="row">

                                        <span style={{color:"#0F4C81"}}>{"견적서 보기"}</span>
                                      <Link to={{pathname: process.env.PUBLIC_URL + `/estimateForm/${single.CHILD_PRODUCT_ID}`}}>
                                        <ReactSVG
                                            className="arrow-down"
                                            src={process.env.PUBLIC_URL + "/assets/img/icons/icon-right-arrow.svg"}
                                        />
                                      </Link>
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


Product.propTypes = {
  products: PropTypes.array,
  oemProductList: PropTypes.array,
  sortingList: PropTypes.array,
  filter: PropTypes.string,
  state: PropTypes.array
};


const mapStateToProps = (state, ownProps) => {
  return {
    product:
      state.productData.products,
    filterList: state.filterList.filter,
    subscriptionList: state.subscriptionListData,
    detailParam: state.detailParamData.detailParam
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setDetailParam: (param) => {
      dispatch(setDetailParam(param))
    }

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Product);

