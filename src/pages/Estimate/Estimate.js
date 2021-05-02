import React, { Fragment, Component } from "react";
import { connect } from "react-redux";
import { ReactSVG } from "react-svg";
import { addToCartDispatch } from "../../redux/actions/cartActions";
import { addToWishlistDispatch } from "../../redux/actions/wishlistActions";
import PropTypes from "prop-types";
import axios from "axios";
import ReactLoading from 'react-loading'
import {setDetailParam} from "../../redux/actions/detailParamActions";
import commaNumber from "../../utils/commaNumber";
import DaumPostcode from "react-daum-postcode";

class Estimate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            childProductList : '',
            param: props.location.param,
            isLoading: true,
            popupOn: false,
            popupTarget: '',
            addSupportFee: '',
            shopSupportFee: '',
            memo: '',
            shopName: '',
            postCode: '',
            detailAddr: '',
            detailAddr1: '',
            openPost: false
        };

        this.recalculate = this.recalculate.bind(this);
        this.addrComplete = this.addrComplete.bind(this);
    }

    componentDidMount() {
        this.getEstimateData();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.checkData()
        if(prevProps.detailParam != this.props.detailParam){
            this.setState({popupOn:false})
            this.getChildProductData();

        }
    }

    //await axios.get( process.env.REACT_APP_API_URL + "/product/list", {params: parameter} )

    checkData() {
        if(!this.state.data){
            this.props.history.goBack();
        }
    }

    getEstimateData() {
        axios
            .get(process.env.REACT_APP_API_URL + "/customer/estimate", {params : {child_product_id: this.props.match.params.id}})

            .then(response =>
                this.setState({
                    data: response.data,
                    isLoading: false,
                    deviceMonthlyFee: response.data.estimate_info.DEVICE_MONTHLY_FEE,
                    monthlyFee: response.data.estimate_info.MONTHLY_FEE
                })
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
            if(single.CARRIER_OMD_CODE == this.state.popupTarget){
                return true;
            }
        }
        return false;
    }

    recalculate(event, installmentTerm, place){

        if(place == 'ADD'){
            this.setState({
                addSupportFee:event.target.value,
            })
        }else{
            this.setState({
                shopSupportFee:event.target.value,
            })
        }

        this.setState({
            deviceMonthlyFee: this.state.data.estimate_info.DEVICE_MONTHLY_FEE
                -Math.round((this.state.addSupportFee/installmentTerm),0)
                -Math.round((this.state.shopSupportFee/installmentTerm),0),
            monthlyFee: this.state.data.estimate_info.MONTHLY_FEE
                -Math.round((this.state.addSupportFee/installmentTerm),0)
                -Math.round((this.state.shopSupportFee/installmentTerm),0)
        }
        )
    }

    addrComplete(data) {
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
                extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
            }
            fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
        }


        this.setState({
            postCode: data.zonecode,
            detailAddr: data.roadAddress
        })

        console.log(fullAddress);  // e.g. '서울 성동구 왕십리로2길 20 (성수동1가)'
    }


    render() {
        const {
            filterList,
            setDetailParam
        } = this.props;
        const { data, deviceMonthlyFee, monthlyFee, addSupportFee, shopSupportFee } = this.state;

        if(data||this.state.isLoading!=true){

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
        }

        let contractSaleAmount = ''

        if(data.estimate_info.PLAN_TYPE=='CONTRACT'){
            contractSaleAmount = data.estimate_info.CONTRACT_SALE_AMOUNT
        }else{
            contractSaleAmount = 0
        }

        const popupX = (document.body.offsetWidth / 2) - (200 / 2)
        const popupY = (window.screen.height / 2) - (300 / 2);
        const postCodeStyle = {
            display: "block",
            position: "absolute",
            zIndex: "100",
            padding: "7px",
            margin: "auto",
            pointerEvents: "auto",
            top: popupY,
            left: popupX
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
                                <h7>{`${commaNumber(monthlyFee)}`}</h7>
                            </div>
                        </div>
                        <div className="estimate-body">
                            <div className="col d-flex justify-content-between border-bottom--medium border-dark" style={{paddingBottom:7}}>
                                <h7 className = "estimate-body-text">월 기기 납부액</h7>
                                <h7>{`${commaNumber(deviceMonthlyFee)}`}</h7>
                            </div>
                            <div className="col d-flex justify-content-between" style={{marginTop:7}}>
                                <h7 className = "estimate-body-text">출고가</h7>
                                <h7>{`${commaNumber(data.estimate_info.FACTORY_PRICE)}`}</h7>
                            </div>
                            <div className="col d-flex justify-content-between" style={{marginTop:7}}>
                                <h7 className = "estimate-body-text">공시지원금</h7>
                                <h7>{`${commaNumber(data.estimate_info.SUPPORT_FEE)}`}</h7>
                            </div>
                            <div className="col d-flex justify-content-between" style={{marginTop:7}}>
                                <h7 className = "estimate-body-text">추가지원금</h7>
                                <h7>
                                    <input className="text-input" style={{width:70, height:25, textAlign:'right'}} type="text"
                                           value = {addSupportFee}
                                           onChange={(e) => this.recalculate(e, data.estimate_info.INSTALLMENT_TERM, 'ADD')}>
                                    </input>
                                </h7>
                            </div>
                            <div className="col d-flex justify-content-between" style={{marginTop:7}}>
                                <h7 className = "estimate-body-text">매장지원금</h7>
                                <h7>
                                    <input className="text-input" style={{width:70, height:25, textAlign:'right'}} type="text"
                                           value = {shopSupportFee}
                                           onChange={(e) => this.recalculate(e, data.estimate_info.INSTALLMENT_TERM, 'SHOP')}>
                                    </input>
                                </h7>
                            </div>
                            <div className="col d-flex justify-content-between" style={{marginTop:7}}>
                                <h7 className = "estimate-body-text">할부원금</h7>
                                <h7>{`${commaNumber(data.estimate_info.MODEL_PRICE)}`}</h7>
                            </div>
                            <div className="col d-flex justify-content-between" style={{marginTop:7}}>
                                <h7 className = "estimate-body-text">할부이자</h7>
                                <h7>{`${commaNumber(data.estimate_info.INSTALLMENT_FEE)}`}</h7>
                            </div>
                        </div>
                        <div className="subscription-estimate-body">
                            <div className="col d-flex justify-content-between border-bottom--medium border-dark" style={{paddingBottom:7}}>
                                <h7 className = "estimate-body-text">월 납부 요금제액</h7>
                                <h7>{`${commaNumber(data.estimate_info.SUBSCRIPTION_MONTHLY_FEE)}`}</h7>
                            </div>
                            <div className="col d-flex justify-content-between" style={{marginTop:7}}>
                                <h7 className = "estimate-body-text">요금제명</h7>
                                <h7>{`${commaNumber(data.estimate_info.SUBSCRIPTION_NAME)}`}</h7>
                            </div>
                            <div className="col d-flex justify-content-between" style={{marginTop:7}}>
                                <h7 className = "estimate-body-text">기본료</h7>
                                <h7>{`${commaNumber(data.estimate_info.SUBSCRIPTION_MONTHLY_FEE)}`}</h7>
                            </div>
                            <div className="col d-flex justify-content-between" style={{marginTop:7}}>
                                <h7 className = "estimate-body-text">선택약정</h7>
                                <h7>{`${commaNumber(contractSaleAmount)}`}</h7>
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
                                       value = {this.state.memo}
                                       onChange={(e) => this.setState({memo:e.target.value})}>
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
                        <div className="shop-body">
                            <div className="d-flex justify-content-between" style={{paddingBottom:7}}>
                                <h7 className = "p-2 flex-shrink-1 w-25">이름</h7>
                                <div className= "address-container">
                                    <input className="address-name" type="text"
                                           value = {this.state.shopName}
                                           onChange={(e) => this.setState({shopName:e.target.value})}>
                                    </input>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between" style={{paddingBottom:7}}>
                                <h7 className = "p-2 flex-lg-shrink-1 w-25">주소</h7>
                                <div className= "address-container">
                                    <input className="address-postCode" type="text"
                                           value = {this.state.postCode}
                                    >
                                    </input>
                                    {
                                        this.state.openPost ?
                                            <DaumPostcode
                                                onComplete={(data) => {
                                                    this.addrComplete(data)
                                                    this.setState({openPost:false})
                                                }}
                                                autoClose
                                                style={postCodeStyle}
                                                isDaumPost={this.state.openPost}
                                            />
                                            : null
                                    }
                                    <button className="address-search" style={{marginLeft:5}} onClick={() => {
                                       this.setState({openPost:'ture'})
                                    }
                                    }>주소검색</button>
                                </div>
                            </div>

                            <div className="d-flex justify-content-between" style={{paddingBottom:7}}>
                                <h7 className = "p-2 flex-lg-shrink-1 w-25"> </h7>
                                <div className= "address-container">
                                    <input className="address-detail" type="text"
                                           value = {this.state.detailAddr}
                                           onChange={(e) => this.setState({detailAddr:e.target.value})}>
                                    </input>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between" style={{paddingBottom:7}}>
                                <h7 className = "p-2 flex-lg-shrink-1 w-25"> </h7>
                                <div className= "address-container">
                                    <input className="address-detail1" type="text"
                                           value = {this.state.detailAddr1}
                                           onChange={(e) => this.setState({detailAddr1:e.target.value})}>
                                    </input>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="memo-container border-bottom--thick border-dark">
                        <div className="estimate-body-memo border-0">
                            <div className="" style={{marginTop:7, textAlign:'center'}}>
                                <button className="share-button"
                                onClick={() => {
                                    let param = {
                                        //TODO : 모든 데이터 파라미터로 전달
                                    }
                                    console.log(param)
                                }}>
                                    <h7 style={{color:'#0F4C81', fontWeight:'bold'}}>구매 매장과 견적서 공유하기</h7>
                                </button>
                            </div>
                        </div>
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
        filterList: state.filterList.filter,
        subscriptionList: state.subscriptionListData,
        detailParam: state.detailParamData.detailParam
    };
};

const mapDispatchToProps = dispatch => {
    return {
        addToCart: (item, quantityCount, selectedProductColor) => {
            dispatch(addToCartDispatch(item, quantityCount, selectedProductColor));
        },
        addToWishlist: item => {
            dispatch(addToWishlistDispatch(item));
        },
        setDetailParam: (param) => {
            dispatch(setDetailParam(param))
        }

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Estimate);

