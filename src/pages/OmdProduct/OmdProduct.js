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
import {Chip} from "@material-ui/core";


class OmdProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            childProductList : '',
            param: props.location.param,
            isLoading: true,
            colorHex: ''
        };
    }

    componentDidMount() {
        this.getChildProductData();
    }

    checkData() {
        if(!this.state.data){
            this.props.history.goBack();
        }
    }

    getChildProductData() {
        axios
            .get(process.env.REACT_APP_API_DEV_URL + "/omdProduct/detail", {params: this.props.detailParam})

            .then(response =>
                this.setState({
                                    data: response.data,
                                    isLoading: false,
                                    colorHex: this.props.detailParam.color_hex
                                    })
            )
            .catch(error =>
                this.setState({ errorMessage: error.message, isLoading: false })
            );
    }

    render() {
        const {
            omdFilterList,
            setDetailParam
        } = this.props;
        const { data } = this.state;

        // 선택되는 탭에 따라 보여지는 리스트가 달라짐
        let childList = ''
        let colorList = ''
        let productInfo = ''
        let usedPriceInfo = ''

        if(data||this.state.isLoading!==true){
            productInfo = data.omd_product_info.filter(e => e.COLOR_HEX == this.state.colorHex)

            colorList = productInfo[0].COLOR_LIST.split(', ')
            childList = data.omd_child_product_list.filter(e => e.COLOR_HEX == this.state.colorHex)

            usedPriceInfo = data.omd_used_price_info

            console.log(data.omd_used_price_info)



        }else{
            return (

                <div className="loading-container">
                    <ReactLoading type = {"spinningBubbles"} color={"#517892"} height={"30%"} width={"30%"}/>
                </div>
            )
        }

        return (
            <div className="d-flex justify-content-center">
                <div className="col-md-8 col-lg-5">
                    <div className="body-wrapper space-pt--70 space-pb--120">
                    <div className="detail-img-container">
                        <img
                            src={process.env.REACT_APP_S3_URL + `${productInfo[0].IMAGE_URL}`}
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
                                            <h3 className="title"  style={{paddingLeft: 10}}>{data.omd_product_info[0].PRODUCT_GROUP_NAME}</h3>
                                        </div>
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

                                let code = "#"+el
                                let checkedBorder = 0

                                if(el == this.state.colorHex){
                                    checkedBorder = 1;
                                }


                              return (
                                  <li key={key} style={{marginRight:0}}>
                                      <button style={{borderWidth:0, backgroundColor:'#FFFFFF'}}
                                          onClick={() => {
                                          this.setState({colorHex: el})}}>
                                        <Chip className={code} htmlFor={code} style={{backgroundColor: code, borderStyle:'solid', borderWidth:checkedBorder, borderColor:'#0F4C81'}} />
                                      </button>
                                  </li>
                              );
                            })}
                          </ul>
                      </div>
                    </div>
                    <div
                        style={{backgroundColor: `rgb(249, 249, 249)`, fontSize: 'small', marginTop: 20, marginBottom: 20, marginLeft: 2, marginRight: 2, padding: 8}}>
                        <span style={{color: `rgb(0, 0, 0)`, fontWeight: 'bold'}}>매일 바뀌는 가격을 확인하세요! </span><br/>
                        <span style={{fontSize:12}}>지금 나랑살래에서 자급제 핸드폰 가격 비교하고 <br/>동네매장 대비
                            <strong style={{color: `rgb(15, 76, 129)`}}>최대 162,628원</strong> 저렴하게 구매하세요
                        </span>
                    </div>

                    <div className="omd-detail-container-wrap">

                    {
                        childList?(
                                childList.map(single => {

                                    let icon = ''
                                    switch(single.OMD_CODE){

                                        case 'COUPANG' :
                                            icon = 'Coupang_logo.png';
                                            break;

                                        case '11ST' :
                                            icon = '11st_logo.png';
                                            break;

                                        case 'SSG' :
                                            icon = 'SSG_logo.png';
                                            break;

                                        case 'APPLE' :
                                            icon = 'Apple_logo.png';
                                            break;

                                        case 'HIMART' :
                                            icon = 'Himart_logo.png';
                                            break;

                                        case 'AGENCY' :
                                            icon = 'Agency_logo.png';
                                            break;


                                        default :
                                            break;

                                    }

                                    return (

                                            <div className="omd-detail-container">
                                            <div className="container-large">
                                                <div className="col">
                                                    <div className="">
                                                        <div className="d-flex justify-content-between">
                                                            <div className="logo-image">
                                                            <img
                                                                src={process.env.PUBLIC_URL + `/assets/img/icons/${icon}`}
                                                                className="img-fluid-logo"
                                                                alt=""
                                                            />
                                                            </div>
                                                            <div className="row-list">
                                                                <div className="row-big">카드할인</div>
                                                                <div className="row-small"> {(single.DISCOUNT_DESC)}</div>
                                                            </div>
                                                            <div className=" row-list">
                                                                <div className="row-big">
                                                                    {commaNumber(single.PRICE) + "원 "}
                                                                </div>
                                                                <div className="row-small"> 에어팟 할인</div>
                                                            </div>
                                                            <img src={process.env.PUBLIC_URL + `/assets/img/icons/pointer.png`} className="img-fluid-pointer" alt=""/>
                                                        </div>
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
                    </div>
                    <div className="omd-detail-container-wrap"
                         style={{backgroundColor: `rgb(249, 249, 249)`, fontSize: 'small', marginBottom: 2, padding: 1}}>

                        {
                            usedPriceInfo?(
                                usedPriceInfo.map(single => {

                                    let icon = ''
                                    switch(single.GRADE){

                                        case 'A' :
                                            icon = 'A_Grade.png';
                                            break;

                                        case 'B' :
                                            icon = 'B_Grade.png';
                                            break;

                                        case 'C' :
                                            icon = 'C_Grade.png';
                                            break;

                                        case 'D' :
                                            icon = 'D_Grade.png';
                                            break;

                                        default :
                                            break;

                                    }

                                    return (

                                            <div className="usedPhone-detail-container">
                                                <div className="container-large">
                                                    <div className="col">
                                                        <div className="">
                                                            <div className="d-flex justify-content-between">
                                                                <div className="logo-image">
                                                                    <img src={process.env.PUBLIC_URL + `/assets/img/icons/${icon}`} className="image-fluid-logo"
                                                                         alt=""/>
                                                                </div>
                                                                <div className="row-list">
                                                                    <div className="row-big"> {single.GRADE_DESC}</div>
                                                                    <div className="row-small">{single.GRADE_DETAIL}</div>
                                                                </div>
                                                                <div className="row-list">
                                                                    <div className="row-big"> {commaNumber(single.PRICE) + "원 "}</div>
                                                                    <div className="row-small">
                                                                    </div>
                                                                </div>
                                                                <img src="" className="img-fluid" alt=""
                                                                     style={{width: 16, height: 'fit-content', paddingTop:15}}/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        )})
                                ):
                                (
                                    <div>
                                        Not Found
                                    </div>
                                )
                        }

                    </div>
                    </div>
                </div>
            </div>
        );
    }
}


OmdProduct.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(OmdProduct);

