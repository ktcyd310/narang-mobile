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

        var time = new Date();
        var currentTime = time.getHours() + ':' + time.getMinutes()

        if(data||this.state.isLoading!==true){
            productInfo = data.omd_product_info.filter(e => e.COLOR_HEX == this.state.colorHex)
            //productInfo = data.omd_product_info

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
                        <span style={{fontSize:12}}>지금 나랑살래에서 자급제 휴대폰 가격 비교하고 <br/>
                        <strong style={{color: `rgb(15, 76, 129)`}}>오늘 {currentTime} 기준</strong> 가장 저렴하게 구매하세요
                        </span>
                    </div>

                    <span style={{color: `rgb(0, 0, 0)`, fontWeight: 'bold', marginLeft: 15}}>실시간 기기 최저가</span>
                    <div className="container space-y--5"></div>
                    <div className="omd-detail-container-wrap">

                    {
                        childList?(
                                childList.map(single => {

                                    let icon = ''
                                    let discountCode = ''
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

                                        case 'SAMSUNG' :
                                            icon = 'Samsung_logo.png';
                                            break;


                                        default :
                                            break;

                                    }


                                    switch(single.DISCOUNT_CODE) {

                                        case 'BASIC' :
                                            discountCode = '기본';
                                            break;

                                        case 'CARD' :
                                            discountCode = '카드할인';
                                            break;

                                        default :
                                            break;
                                    }

                                    return (

                                        <a className="omd-detail-container" href={single.PRODUCT_LINK}>
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
                                                                <div className="row-big">{discountCode}</div>
                                                                <div className="row-small"> {(single.DISCOUNT_DESC)}</div>
                                                            </div>
                                                            <div className=" row-list">
                                                                <div className="row-big">
                                                                    {commaNumber(single.PRICE) + "원 "}
                                                                </div>
                                                                <div className="row-small"> {(single.DISCOUNT_DESC1)}</div>
                                                            </div>
                                                            <img src={process.env.PUBLIC_URL + `/assets/img/icons/pointer.png`} className="img-fluid-pointer" alt=""/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>



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

                    <div className="container space-y--10"></div>
                        <span style={{color: `rgb(0, 0, 0)`, fontWeight: 'bold', marginLeft: 15}}>예상 1년 후 중고가격</span>
                    <div className="container space-mt--10"></div>


                    <div className="omd-detail-container-wrap"
                         style={{backgroundColor: `rgb(249, 249, 249)`, fontSize: 'small', marginBottom: 2, padding: 1}}>

                        <div className="usedPhone-detail-container">
                            <div className="container-large">
                                <div className="col">
                                    <div className="">
                                        <div className="d-flex justify-content-between">
                                            <div className="logo-image">
                                                <img src={process.env.PUBLIC_URL + `/assets/img/icons/A_Grade.png`} className="image-fluid-logo"
                                                     alt=""/>
                                            </div>
                                            <div className="row-list">
                                                <div className="row-big">관리최상</div>
                                                <div className="row-small">액정/뒷판 미세 흠집</div>
                                            </div>
                                            <div className="row-list">
                                                <div className="row-big"> {commaNumber(usedPriceInfo[0].GRADE_A) + "원 "}</div>
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
                        <div className="usedPhone-detail-container">
                            <div className="container-large">
                                <div className="col">
                                    <div className="">
                                        <div className="d-flex justify-content-between">
                                            <div className="logo-image">
                                                <img src={process.env.PUBLIC_URL + `/assets/img/icons/B_Grade.png`} className="image-fluid-logo"
                                                     alt=""/>
                                            </div>
                                            <div className="row-list">
                                                <div className="row-big">관리적당</div>
                                                <div className="row-small">액정/뒷판 미세흠집, 녹음어플장애, 카메라멍</div>
                                            </div>
                                            <div className="row-list">
                                                <div className="row-big"> {commaNumber(usedPriceInfo[0].GRADE_B) + "원 "}</div>
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
                        <div className="usedPhone-detail-container">
                            <div className="container-large">
                                <div className="col">
                                    <div className="">
                                        <div className="d-flex justify-content-between">
                                            <div className="logo-image">
                                                <img src={process.env.PUBLIC_URL + `/assets/img/icons/C_Grade.png`} className="image-fluid-logo"
                                                     alt=""/>
                                            </div>
                                            <div className="row-list">
                                                <div className="row-big">아차차</div>
                                                <div className="row-small">액정/뒷판 파손, 강잔상,GPS오류, LCD백화 등</div>
                                            </div>
                                            <div className="row-list">
                                                <div className="row-big"> {commaNumber(usedPriceInfo[0].GRADE_C) + "원 "}</div>
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
                        <div className="usedPhone-detail-container">
                            <div className="container-large">
                                <div className="col">
                                    <div className="">
                                        <div className="d-flex justify-content-between">
                                            <div className="logo-image">
                                                <img src={process.env.PUBLIC_URL + `/assets/img/icons/D_Grade.png`} className="image-fluid-logo"
                                                     alt=""/>
                                            </div>
                                            <div className="row-list">
                                                <div className="row-big">신경안씀</div>
                                                <div className="row-small">C등급 기준 +베젤 휨, LCD잔상 등</div>
                                            </div>
                                            <div className="row-list">
                                                <div className="row-big"> {commaNumber(usedPriceInfo[0].GRADE_D) + "원 "}</div>
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
                        <div style={{backgroundColor: `rgb(249, 249, 249)`, fontSize: 11, marginLeft: 10, padding: 8, color: "#a0a1a7"}}>해당 기종의 출시일, 용량, 등급등을 고려한 빅데이터로 매일 감가상각율을 계산합니다 </div>
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

