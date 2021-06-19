import React, { Component } from "react";
import { connect } from "react-redux";
import { ReactSVG } from "react-svg";
import PropTypes from "prop-types";
import axios from "axios";
import ReactLoading from 'react-loading'
import {setDetailParam} from "../../redux/actions/detailParamActions";
import commaNumber from "../../utils/commaNumber";
import MapContent from "../../components/MapContent/MapContent"

class Estimate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading : true
        };

    }
    componentDidMount() {
        this.getEstimateData();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.checkData()
    }

    checkData() {
        if(!this.state.data){
            this.props.history.goBack();
        }
    }

    getEstimateData() {
        axios
            .get(process.env.REACT_APP_API_URL + "/customer/estimate/info", {params : {estimate_seq: this.props.match.params.id}})

            .then(response =>
                this.setState({
                    data: response.data,
                    isLoading: false
                })
            )
            .catch(error =>
                this.setState({ errorMessage: error.message, isLoading: false })
            );
    }

    render() {
        const { data } = this.state;


        if(data||this.state.isLoading!==true){

        }else{
            return (
                <div className="loading-container">
                    <ReactLoading type = {"spinningBubbles"} color={"#517892"} height={"30%"} width={"30%"}/>
                </div>
            )
        }

        let icon = ''

        switch(data.estimate_info.CARRIER_OMD_CODE){
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
            <div className="body-wrapper space-pt--70 space-pb--120">
                <div className="estimate-container">
                    <div className="estimate-content-header border-bottom--thick border-dark">
                        <img
                            src={process.env.PUBLIC_URL + `/assets/img/icons/${icon}`}
                            className="img-fluid"
                            alt=""
                        />
                        <h4 style={{alignSelf:"center"}}>{data.estimate_info.CARRIER_OMD_CODE} 견적서</h4>
                    </div>

                    <div className="container-lg">
                        <div className="estimate-title">
                            <div className="col d-flex justify-content-between">
                                <h7 className = "estimate-title-text">{data.estimate_info.PRODUCT_GROUP_NAME}</h7>
                            </div>
                            <div className="col d-flex justify-content-between">
                                <h7 className = "estimate-title-text">최종 월 납부액</h7>
                                <h7>{`${commaNumber(data.estimate_info.MONTHLY_FEE)} 원`}</h7>
                            </div>
                        </div>
                        <div className="estimate-body">
                            <div className="col d-flex justify-content-between border-bottom--medium border-dark" style={{paddingBottom:7}}>
                                <h7 className = "estimate-body-text">월 기기 납부액</h7>
                                <h7>{`${commaNumber(data.estimate_info.DEVICE_MONTHLY_FEE)}`}</h7>
                            </div>
                            <div className="col d-flex justify-content-between" style={{marginTop:7}}>
                                <h7 className = "estimate-body-text">출고가</h7>
                                <h7>{`${commaNumber(data.estimate_info.FACTORY_PRICE)} 원`}</h7>
                            </div>
                            <div className="col d-flex justify-content-between" style={{marginTop:7}}>
                                <h7 className = "estimate-body-text">공시지원금</h7>
                                <h7>{`${commaNumber(data.estimate_info.SUPPORT_FEE)} 원`}</h7>
                            </div>
                            <div className="col d-flex justify-content-between" style={{marginTop:7}}>
                                <h7 className = "estimate-body-text">추가지원금</h7>
                                <h7>{`${commaNumber(data.estimate_info.ADD_SUPPORT_FEE)} 원`}</h7>
                            </div>
                            <div className="col d-flex justify-content-between" style={{marginTop:7}}>
                                <h7 className = "estimate-body-text">매장지원금</h7>
                                <h7>{`${commaNumber(data.estimate_info.SHOP_SUPPORT_FEE)} 원`}</h7>
                            </div>
                            <div className="col d-flex justify-content-between" style={{marginTop:7}}>
                                <h7 className = "estimate-body-text">할부원금</h7>
                                <h7>{`${commaNumber(data.estimate_info.MODEL_PRICE)} 원`}</h7>
                            </div>
                            <div className="col d-flex justify-content-between" style={{marginTop:7}}>
                                <h7 className = "estimate-body-text">할부이자</h7>
                                <h7>{`${commaNumber(data.estimate_info.INSTALLMENT_FEE)} 원`}</h7>
                            </div>
                        </div>
                        <div className="subscription-estimate-body">
                            <div className="col d-flex justify-content-between border-bottom--medium border-dark" style={{paddingBottom:7}}>
                                <h7 className = "estimate-body-text">월 요금 납부액</h7>
                                <h7>{`${commaNumber(data.estimate_info.SUBSCRIPTION_MONTHLY_FEE)} 원`}</h7>
                            </div>
                            <div className="col d-flex justify-content-between" style={{marginTop:7}}>
                                <h7 className = "estimate-body-text">요금제명</h7>
                                <h7>{`${commaNumber(data.estimate_info.SUBSCRIPTION_NAME)}`}</h7>
                            </div>
                            <div className="col d-flex justify-content-between" style={{marginTop:7}}>
                                <h7 className = "estimate-body-text">기본료</h7>
                                <h7>{`${commaNumber(data.estimate_info.SUBSCRIPTION_MONTHLY_FEE)} 원`}</h7>
                            </div>
                            <div className="col d-flex justify-content-between" style={{marginTop:7}}>
                                <h7 className = "estimate-body-text">선택약정</h7>
                                <h7>{`${commaNumber(data.estimate_info.CONTRACT_SALE_AMOUNT)} 원`}</h7>
                            </div>
                        </div>
                    </div>

                    <div className="memo-container border-bottom--thick border-dark">
                        <div className="estimate-body-memo border-0">
                            <div className="col d-flex justify-content-between" style={{marginTop:7}}>
                                <h7 className = "estimate-body-text">구매 메모</h7>
                            </div>
                            <div className="" style={{marginTop:7, textAlign:'center'}}>
                                <input className="text-input" type="text"
                                       value = {data.estimate_info.MEMO}>
                                </input>
                            </div>
                        </div>
                    </div>

                    <div className="container-lg">
                        <div className="shop-title">
                            <ReactSVG color="#0F4C81"
                                      src={
                                          process.env.PUBLIC_URL +
                                          "/assets/img/icons/open-store.svg"
                                      }
                            />
                            <h6 className="h6">구매 매장</h6>
                        </div>

                        {/*TODO : Input Box가 아닌 다른 스타일*/}
                        <div className="shop-body">
                            <div className="d-flex justify-content-between" style={{paddingBottom:7}}>
                                <h7 className = "p-2 flex-shrink-1 w-25">이름</h7>
                                <div className= "address-container">
                                    <input className="address-name" type="text"
                                           value = {data.estimate_info.SHOP_NAME}
                                           onChange={(e) => this.setState({shopName:e.target.value})}>
                                    </input>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between" style={{paddingBottom:7}}>
                                <h7 className = "p-2 flex-lg-shrink-1 w-25">주소</h7>
                                <div className= "address-container">
                                    <button id = "address-search-button" className="address-search-disabled" style={{marginLeft:0, marginRight:5}}>
                                        우편번호
                                    </button>

                                    <input className="address-postCode" type="text"
                                           value = {data.estimate_info.POST_CODE}
                                    >
                                    </input>


                                </div>
                            </div>

                            <div className="d-flex justify-content-between" style={{paddingBottom:7}}>
                                <h7 className = "p-2 flex-lg-shrink-1 w-25"> </h7>
                                <div className= "address-container">
                                    <input className="address-detail" type="text"
                                           value = {data.estimate_info.DETAIL_ADDR}
                                           onChange={(e) => this.setState({detailAddr:e.target.value})}>
                                    </input>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between" style={{paddingBottom:7}}>
                                <h7 className = "p-2 flex-lg-shrink-1 w-25"> </h7>
                                <div className= "address-container">
                                    <input className="address-detail1" type="text"
                                           value = {data.estimate_info.DETAIL_ADDR1}
                                           onChange={(e) => this.setState({detailAddr1:e.target.value})}>
                                    </input>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/*TODO : 가운데 정렬*/}
                    <div className="map-container border-bottom--thick border-dark">
                        <MapContent param = {{
                            address : data.estimate_info.DETAIL_ADDR,
                            name : data.estimate_info.SHOP_NAME
                        }}></MapContent>
                    </div>


                </div>
            </div>
        );
    }
}

const label = (el) => {
    return (
        <label className={el} htmlFor={el} />
    )
}


Estimate.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(Estimate);

